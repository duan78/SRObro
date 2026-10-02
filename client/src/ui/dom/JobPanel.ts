/**
 * SRObro — Panneau Jobs (touche J, Phase E V2)
 * Triangle Trader/Thief/Hunter: choix du métier, achat transport,
 * marchandises de spécialité (achat/vente), vol (thief).
 * Embuscades poussées par le serveur (job:ambush).
 */

import type { NetworkManager } from '../../network/NetworkManager';

interface TradeGood {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
}

interface TransportInfo {
  id: string;
  transportType: string;
  starLevel: number;
  goods: Array<{ id: string; name: string; quantity: number; buyPrice: number }>;
}

export class JobPanel {
  private network: NetworkManager;
  private root: HTMLElement | null = null;
  private visible = false;
  private state: any = null;

  constructor(network: NetworkManager) {
    this.network = network;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'j' || e.key === 'J') {
        const tag = (document.activeElement?.tagName ?? '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        this.visible ? this.hide() : void this.show();
      }
      if (e.key === 'Escape') this.hide();
    });
    // Notifications serveur
    network.onRaw('job:ambush', (d: any) => {
      const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
      hud?.addChatMessage(d?.message ?? '⚠️ Embuscade sur votre caravane !', 'system');
    });
    network.onRaw('job:transport', (d: any) => {
      const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
      hud?.addChatMessage(d?.active ? '🐴 Transport actif (suivez la route !)' : 'Transport renvoyé', 'system');
    });
  }

  hide(): void {
    this.visible = false;
    this.root?.classList.add('hud-hidden');
  }

  async show(): Promise<void> {
    this.visible = true;
    if (!this.root) this.build();
    this.root!.classList.remove('hud-hidden');
    await this.refresh();
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'job-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #job-panel { top: 70px; right: 40px; width: 340px; max-height: 72vh; overflow-y: auto; z-index: 600; pointer-events: auto; }
        #job-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; }
        .job-section { color: #c9b98a; font-size: 11px; margin: 10px 0 4px; text-transform: uppercase; }
        .job-row { display: flex; justify-content: space-between; align-items: center; gap: 8px;
          padding: 5px 4px; border-bottom: 1px solid rgba(85,70,31,0.4); font-size: 12px; }
        .job-name { color: #f0e6d2; } .job-price { color: #ffd700; font-size: 11px; }
        .job-btn { padding: 2px 10px; cursor: pointer; font-size: 11px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
          border-radius: 3px; color: #1c1405; }
        .job-btn.secondary { background: #3a2f14; color: #c9b98a; border-color: #8f751d; }
        .job-stars { color: #ff9a3d; }
        .job-error { color: #e07a5f; font-size: 11px; margin-top: 6px; min-height: 14px; }
      </style>
      <div id="job-title">Métiers — Route de la Soie <span style="color:#8a94c0;font-size:10px">(J)</span></div>
      <div id="job-body"></div>
      <div class="job-error" id="job-error"></div>
    `;
    document.body.appendChild(root);
    this.root = root;
  }

  private error(msg: string): void {
    const el = this.root?.querySelector('#job-error') as HTMLElement;
    if (el) {
      el.textContent = msg;
      setTimeout(() => { el.textContent = ''; }, 4000);
    }
  }

  private async refresh(): Promise<void> {
    if (!this.root || !this.visible) return;
    try {
      this.state = await this.network.request<any>('job:state');
    } catch { return; }
    const body = this.root.querySelector('#job-body') as HTMLElement;
    body.innerHTML = '';
    if (!this.state.success) { body.innerHTML = '<div class="job-error">Non authentifié</div>'; return; }

    const job = this.state.job as { jobType: string; level: number } | null;

    // --- Métier ---
    const jobSec = document.createElement('div');
    jobSec.className = 'job-section';
    jobSec.textContent = 'Métier';
    body.appendChild(jobSec);
    if (!job) {
      for (const j of ['trader', 'thief', 'hunter'] as const) {
        const row = document.createElement('div');
        row.className = 'job-row';
        const label = j === 'trader' ? 'Commerçant (Trader)' : j === 'thief' ? 'Voleur (Thief)' : 'Chasseur (Hunter)';
        row.innerHTML = `<span class="job-name">${label}</span>`;
        const btn = document.createElement('button');
        btn.className = 'job-btn';
        btn.textContent = 'Choisir';
        btn.addEventListener('click', async () => {
          const r = await this.network.request('job:change', { job: j });
          r?.success ? void this.refresh() : this.error(r?.error ?? 'Erreur');
        });
        row.appendChild(btn);
        body.appendChild(row);
      }
    } else {
      const row = document.createElement('div');
      row.className = 'job-row';
      row.innerHTML = `<span class="job-name">${job.jobType} — niveau ${job.level}</span>`;
      body.appendChild(row);
    }

    // --- Transport ---
    const transport: TransportInfo | null = this.state.transport;
    if (job?.jobType === 'trader') {
      const tSec = document.createElement('div');
      tSec.className = 'job-section';
      tSec.textContent = 'Transport';
      body.appendChild(tSec);
      if (!transport) {
        for (const [star, label, cost] of [[1, 'Cheval (9)', '2 000'], [2, 'Bœuf (18)', '8 000'], [3, 'Chameau (27)', '20 000']] as const) {
          const row = document.createElement('div');
          row.className = 'job-row';
          row.innerHTML = `<span class="job-name">${label} slots</span><span class="job-price">${cost} or</span>`;
          const btn = document.createElement('button');
          btn.className = 'job-btn';
          btn.textContent = 'Acheter';
          btn.addEventListener('click', async () => {
            const r = await this.network.request('job:buy_transport', { starLevel: star });
            r?.success ? void this.refresh() : this.error(r?.error ?? 'Erreur');
          });
          row.appendChild(btn);
          body.appendChild(row);
        }
      } else {
        const used = transport.goods.reduce((s, g) => s + g.quantity, 0);
        const row = document.createElement('div');
        row.className = 'job-row';
        row.innerHTML = `<span class="job-name">${transport.transportType} — ${used} marchandise(s)</span>`;
        const btn = document.createElement('button');
        btn.className = 'job-btn secondary';
        btn.textContent = 'Renvoyer';
        btn.addEventListener('click', async () => {
          await this.network.request('job:dismiss_transport', {});
          void this.refresh();
        });
        row.appendChild(btn);
        body.appendChild(row);
        if (transport.goods.length > 0) {
          const sellRow = document.createElement('div');
          sellRow.className = 'job-row';
          sellRow.innerHTML = `<span class="job-name">Vendre ici (Spécialités)</span>`;
          const sellBtn = document.createElement('button');
          sellBtn.className = 'job-btn';
          sellBtn.textContent = 'Vendre';
          sellBtn.addEventListener('click', async () => {
            const r = await this.network.request('job:sell_goods', {});
            if (r?.success) {
              const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
              hud?.addChatMessage(`Trade livré: +${(r.totalProfit ?? 0).toLocaleString('fr')} or`, 'system');
              void this.refresh();
            } else this.error(r?.error ?? 'Vente impossible (mauvaise ville ?)');
          });
          sellRow.appendChild(sellBtn);
          body.appendChild(sellRow);
        }
      }

      // --- Marchandises de la ville ---
      if (transport) {
        const gSec = document.createElement('div');
        gSec.className = 'job-section';
        gSec.textContent = 'Spécialités locales';
        body.appendChild(gSec);
        for (const good of (this.state.goodsForSale ?? []) as TradeGood[]) {
          const already = transport.goods.find((g) => g.id === good.id)?.quantity ?? 0;
          const row = document.createElement('div');
          row.className = 'job-row';
          row.innerHTML = `<span class="job-name">${good.name}${already ? ` ×${already}` : ''}</span><span class="job-price">${good.buyPrice.toLocaleString('fr')} or/u</span>`;
          const btn = document.createElement('button');
          btn.className = 'job-btn';
          btn.textContent = '+1';
          btn.addEventListener('click', async () => {
            const r = await this.network.request('job:buy_goods', { goodId: good.id, quantity: 1 });
            r?.success ? void this.refresh() : this.error(r?.error ?? 'Erreur');
          });
          row.appendChild(btn);
          body.appendChild(row);
        }
      }
    }
  }
}
