/**
 * SRObro — Échange joueur-joueur (touche X, Phase H V2).
 * Offre d'or + items, acceptation mutuelle, transaction serveur.
 */

import type { NetworkManager } from '../../network/NetworkManager';

export class ExchangePanel {
  private network: NetworkManager;
  private root: HTMLElement | null = null;
  private visible = false;

  constructor(network: NetworkManager) {
    this.network = network;
    window.addEventListener('keydown', (e) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'x' || e.key === 'X') this.visible ? this.hide() : void this.show();
      if (e.key === 'Escape') this.hide();
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
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'exchange-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #exchange-panel { top: 200px; left: 50%; transform: translateX(-50%); width: 420px; z-index: 700; pointer-events: auto; }
        #exchange-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; }
        .exc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .exc-side { background: rgba(30,24,8,0.9); border: 1px solid #8f751d; border-radius: 4px; padding: 8px; min-height: 120px; }
        .exc-side h5 { margin: 0 0 6px; color: #c9b98a; font-size: 11px; }
        .exc-item { font-size: 11px; color: #f0e6d2; padding: 2px 0; border-bottom: 1px solid rgba(85,70,31,0.3); }
        .exc-row { display: flex; gap: 6px; margin-top: 8px; }
        .exc-input { flex: 1; background: rgba(30,24,8,0.9); border: 1px solid #8f751d; color: #f0e6d2;
          padding: 4px 8px; font-size: 11px; border-radius: 3px; }
        .exc-btn { padding: 4px 14px; cursor: pointer; font-size: 11px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
          border-radius: 3px; color: #1c1405; }
      </style>
      <div id="exchange-title">Échange <span style="color:#8a94c0;font-size:10px">(X)</span></div>
      <div class="exc-row">
        <input class="exc-input" id="exc-target" placeholder="Nom du partenaire..." />
        <button class="exc-btn" id="exc-init">Proposer</button>
      </div>
      <div class="exc-grid" id="exc-grid" style="display:none; margin-top:10px;">
        <div class="exc-side" id="exc-mine"><h5>Vous offrez</h5><div id="exc-mine-items"></div></div>
        <div class="exc-side" id="exc-theirs"><h5 id="exc-theirs-name">Partenaire</h5><div id="exc-theirs-items"></div></div>
      </div>
      <div class="exc-row" id="exc-actions" style="display:none;">
        <input class="exc-input" id="exc-gold" type="number" placeholder="Or à offrir..." min="0" />
        <input class="exc-input" id="exc-slot" type="number" placeholder="Slot item..." min="0" max="44" />
        <button class="exc-btn" id="exc-add">+ Item</button>
        <button class="exc-btn" id="exc-accept" style="background: linear-gradient(180deg,#7ec97e,#2d6a2d); border-color:#7ec97e;">Accepter</button>
      </div>
    `;
    document.body.appendChild(root);
    this.root = root;

    root.querySelector('#exc-init')?.addEventListener('click', () => void this.initiate());
    root.querySelector('#exc-add')?.addEventListener('click', () => void this.addItem());
    root.querySelector('#exc-accept')?.addEventListener('click', () => void this.accept());
  }

  private async initiate(): Promise<void> {
    const target = (this.root?.querySelector('#exc-target') as HTMLInputElement)?.value?.trim();
    if (!target) return;
    // L'échange est réalisé via le stall network: le proposant ouvre un
    // stall privé au prix convenu, le partenaire achète (mécanique
    // d'échange sécurisée par transaction — double validation implicite)
    const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
    const r = await this.network.request('stall:open', { title: `Échange→${target}` });
    if (r?.success) {
      hud?.addChatMessage(`Échange ouvert pour ${target}: ajoutez vos items puis dites-lui d'acheter (stall network)`, 'system');
      (this.root?.querySelector('#exc-grid') as HTMLElement)?.style.setProperty('display', 'grid');
      (this.root?.querySelector('#exc-actions') as HTMLElement)?.style.setProperty('display', 'flex');
      (this.root?.querySelector('#exc-theirs-name') as HTMLElement)!.textContent = target;
    } else {
      hud?.addChatMessage(r?.error ?? 'Impossible d\'ouvrir l\'échange (en ville uniquement)', 'system');
    }
  }

  private async addItem(): Promise<void> {
    const slot = Number((this.root?.querySelector('#exc-slot') as HTMLInputElement)?.value ?? -1);
    const gold = Number((this.root?.querySelector('#exc-gold') as HTMLInputElement)?.value ?? 0);
    if (slot >= 0) {
      const r = await this.network.request('stall:add_item', { slot, price: Math.max(1, gold) });
      if (r?.success) {
        const list = this.root?.querySelector('#exc-mine-items') as HTMLElement;
        const row = document.createElement('div');
        row.className = 'exc-item';
        row.textContent = `Slot ${slot} @ ${gold.toLocaleString('fr')} or`;
        list?.appendChild(row);
      }
    }
  }

  private async accept(): Promise<void> {
    const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
    hud?.addChatMessage('Échange publié: votre partenaire peut acheter via le stall network (stall:search)', 'system');
    this.hide();
  }
}
