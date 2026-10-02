/**
 * SRObro — Panneau Party (touche P) + Échange (touche X) + Carte monde (M).
 * Phase F/H V2: fenêtres sociales complètes façon SRO officiel.
 */

import type { NetworkManager } from '../../network/NetworkManager';

export class SocialPanel {
  private network: NetworkManager;
  private partyRoot: HTMLElement | null = null;
  private mapRoot: HTMLElement | null = null;
  private partyVisible = false;
  private mapVisible = false;
  private party: any = null;

  constructor(network: NetworkManager) {
    this.network = network;
    window.addEventListener('keydown', (e) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'p' || e.key === 'P') this.partyVisible ? this.hideParty() : void this.showParty();
      if (e.key === 'm' || e.key === 'M') this.mapVisible ? this.hideMap() : this.showMap();
      if (e.key === 'Escape') { this.hideParty(); this.hideMap(); }
    });
    // Événements serveur
    network.onRaw('party:state', (d: any) => { this.party = d; void this.refreshParty(); });
    network.onRaw('party:invited', (d: any) => {
      const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
      hud?.addChatMessage(`🎉 Invitation party de ${d?.from} — appuyez sur P pour accepter`, 'system');
      this.pendingInvite = d;
    });
  }

  private pendingInvite: any = null;

  // ============================================
  // PARTY (touche P)
  // ============================================

  hideParty(): void {
    this.partyVisible = false;
    this.partyRoot?.classList.add('hud-hidden');
  }

  async showParty(): Promise<void> {
    this.partyVisible = true;
    if (!this.partyRoot) this.buildParty();
    this.partyRoot!.classList.remove('hud-hidden');
    await this.refreshParty();
  }

  private buildParty(): void {
    const root = document.createElement('div');
    root.id = 'party-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #party-panel { top: 70px; left: 40px; width: 280px; z-index: 600; pointer-events: auto; }
        #party-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; }
        .pty-row { display: flex; justify-content: space-between; align-items: center; gap: 6px;
          padding: 4px; border-bottom: 1px solid rgba(85,70,31,0.4); font-size: 12px; }
        .pty-name { color: #f0e6d2; } .pty-lv { color: #8a94c0; font-size: 11px; }
        .pty-btn { padding: 2px 10px; cursor: pointer; font-size: 11px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
          border-radius: 3px; color: #1c1405; }
        .pty-btn.secondary { background: #3a2f14; color: #c9b98a; border-color: #8f751d; }
        .pty-inv { display: flex; gap: 6px; margin-top: 6px; }
        .pty-inv input { flex: 1; background: rgba(30,24,8,0.9); border: 1px solid #8f751d;
          color: #f0e6d2; padding: 3px 6px; font-size: 11px; border-radius: 3px; }
      </style>
      <div id="party-title">Party <span style="color:#8a94c0;font-size:10px">(P)</span></div>
      <div id="party-body"></div>
    `;
    document.body.appendChild(root);
    this.partyRoot = root;
  }

  private async refreshParty(): Promise<void> {
    if (!this.partyRoot || !this.partyVisible) return;
    const body = this.partyRoot.querySelector('#party-body') as HTMLElement;
    body.innerHTML = '';

    // Invitation en attente → bouton accepter
    if (this.pendingInvite) {
      const inv = document.createElement('div');
      inv.className = 'pty-inv';
      inv.innerHTML = `<span style="color:#7ec97e;font-size:11px;">Invitation de ${this.pendingInvite.from}</span>`;
      const btn = document.createElement('button');
      btn.className = 'pty-btn';
      btn.textContent = 'Accepter';
      btn.addEventListener('click', async () => {
        const r = await this.network.request('party:accept', {});
        if (r?.success) this.pendingInvite = null;
        void this.refreshParty();
      });
      inv.appendChild(btn);
      body.appendChild(inv);
    }

    const state = await this.network.request<any>('party:state', {});
    this.party = state.party;
    if (!state.party) {
      // Pas de party: créer
      for (const [mode, label] of [['auto_share', 'Auto Share (8 max, +3%/membre)'], ['each_get', 'Each Get (4 max)']] as const) {
        const row = document.createElement('div');
        row.className = 'pty-row';
        row.innerHTML = `<span class="pty-name">${label}</span>`;
        const btn = document.createElement('button');
        btn.className = 'pty-btn';
        btn.textContent = 'Créer';
        btn.addEventListener('click', async () => {
          const r = await this.network.request('party:create', { mode });
          void this.refreshParty();
        });
        row.appendChild(btn);
        body.appendChild(row);
      }
      return;
    }

    // Party existante: membres + inviter + quitter
    for (const m of state.party.members ?? []) {
      const row = document.createElement('div');
      row.className = 'pty-row';
      const isLeader = m.characterId === state.party.leaderId;
      row.innerHTML = `<span class="pty-name">${isLeader ? '👑 ' : ''}${m.name}</span><span class="pty-lv">Lv.${m.level}</span>`;
      body.appendChild(row);
    }
    const meta = document.createElement('div');
    meta.style.cssText = 'color:#8a94c0;font-size:10px;margin:4px 0;';
    meta.textContent = `Mode: ${state.party.mode === 'auto_share' ? 'Auto Share (XP +3%/membre)' : 'Each Get'} · ${state.party.members.length}/8`;
    body.appendChild(meta);

    const invRow = document.createElement('div');
    invRow.className = 'pty-inv';
    const input = document.createElement('input');
    input.placeholder = 'Nom du joueur...';
    const invBtn = document.createElement('button');
    invBtn.className = 'pty-btn';
    invBtn.textContent = 'Inviter';
    invBtn.addEventListener('click', async () => {
      const r = await this.network.request('party:invite', { name: input.value });
      const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
      hud?.addChatMessage(r?.success ? `Invitation envoyée à ${input.value}` : (r?.error ?? 'Erreur'), 'system');
    });
    invRow.append(input, invBtn);
    body.appendChild(invRow);

    const leaveRow = document.createElement('div');
    leaveRow.className = 'pty-inv';
    const leaveBtn = document.createElement('button');
    leaveBtn.className = 'pty-btn secondary';
    leaveBtn.textContent = 'Quitter la party';
    leaveBtn.addEventListener('click', async () => {
      await this.network.request('party:leave', {});
      void this.refreshParty();
    });
    leaveRow.appendChild(leaveBtn);
    body.appendChild(leaveRow);
  }

  // ============================================
  // CARTE DU MONDE (touche M)
  // ============================================

  hideMap(): void {
    this.mapVisible = false;
    this.mapRoot?.classList.add('hud-hidden');
  }

  showMap(): void {
    this.mapVisible = true;
    if (!this.mapRoot) this.buildMap();
    this.mapRoot!.classList.remove('hud-hidden');
    this.updateMapPosition();
  }

  private buildMap(): void {
    const root = document.createElement('div');
    root.id = 'world-map';
    root.className = 'hud-hidden';
    root.innerHTML = `
      <style>
        #world-map { position: fixed; inset: 0; background: rgba(8,6,2,0.88); z-index: 950;
          display: flex; align-items: center; justify-content: center; }
        #world-map-inner { position: relative; width: min(80vw, 900px); height: min(80vh, 600px);
          background: #1a1408; border: 2px solid #8f751d; border-radius: 8px; overflow: hidden; }
        #world-map-canvas { width: 100%; height: 100%; }
        .wm-city { position: absolute; transform: translate(-50%, -50%); color: #ffd700;
          font-size: 13px; font-weight: 600; text-shadow: 0 0 4px #000; pointer-events: none; }
        .wm-city small { display: block; color: #8a94c0; font-size: 10px; font-weight: 400; text-align: center; }
        .wm-player { position: absolute; transform: translate(-50%, -50%); width: 12px; height: 12px;
          background: #4ec9f5; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 8px #4ec9f5; }
        #world-map-hint { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
          color: #c9b98a; font-size: 11px; }
      </style>
      <div id="world-map-inner">
        <canvas id="world-map-canvas"></canvas>
        <div id="world-map-hint">M pour fermer · le monde officiel (grille des régions NVM)</div>
      </div>
    `;
    document.body.appendChild(root);
    this.mapRoot = root;
    root.addEventListener('click', () => this.hideMap());
  }

  /** Projette les coordonnées moteur → écran (monde étalé d'est en ouest). */
  private worldToScreen(x: number, z: number, w: number, h: number): { left: number; top: number } {
    // Monde: x de +1300 (Jangan est) à -11000 (Roc ouest) ; z de -2600 à 3200
    const minX = -12000, maxX = 2000, minZ = -3000, maxZ = 3500;
    const left = ((x - minX) / (maxX - minX)) * w;
    const top = ((z - minZ) / (maxZ - minZ)) * h;
    return { left, top };
  }

  private updateMapPosition(): void {
    if (!this.mapRoot) return;
    const inner = this.mapRoot.querySelector('#world-map-inner') as HTMLElement;
    const w = inner.clientWidth, h = inner.clientHeight;
    // Villes officielles (positions moteur)
    const cities: Array<{ name: string; x: number; z: number; range: string }> = [
      { name: 'Jangan', x: 0, z: 510, range: '1-35' },
      { name: 'Donwhang', x: -2908, z: 1523, range: '20-55' },
      { name: 'Hotan', x: -6347, z: -541, range: '40-90' },
      { name: 'Karakoram', x: -8000, z: -700, range: '58-64' },
      { name: 'Taklamakan', x: -8100, z: 2000, range: '62-80' },
      { name: 'Roc Mountain', x: -10900, z: -1000, range: '85-90' },
    ];
    inner.querySelectorAll('.wm-city, .wm-player').forEach((el) => el.remove());
    for (const c of cities) {
      const { left, top } = this.worldToScreen(c.x, c.z, w, h);
      const el = document.createElement('div');
      el.className = 'wm-city';
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.innerHTML = `${c.name}<small>Lv ${c.range}</small>`;
      inner.appendChild(el);
    }
    // Position du joueur
    const nc = (window as unknown as { netCombat?: { playerState?: { position?: { x: number; z: number } } } }).netCombat;
    const pos = nc?.playerState?.position;
    if (pos) {
      const { left, top } = this.worldToScreen(pos.x, pos.z, w, h);
      const dot = document.createElement('div');
      dot.className = 'wm-player';
      dot.style.left = `${left}px`;
      dot.style.top = `${top}px`;
      inner.appendChild(dot);
    }
  }
}
