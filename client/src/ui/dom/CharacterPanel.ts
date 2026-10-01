/**
 * SRObro - Panneau personnage (DOM, phase 4)
 * Répartition des statPoints (STR/INT) avec effet immédiat sur les dégâts.
 */

import type { NetworkManager } from '../../network/NetworkManager';

export class CharacterPanel {
  private network: NetworkManager;
  private root: HTMLElement | null = null;
  private visible = false;

  constructor(network: NetworkManager) {
    this.network = network;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'c' || e.key === 'C') this.toggle();
    });
  }

  toggle(): void {
    this.visible ? this.hide() : this.show();
  }

  show(): void {
    this.visible = true;
    if (!this.root) this.build();
    this.root!.classList.remove('hud-hidden');
    void this.refresh();
  }

  hide(): void {
    this.visible = false;
    this.root?.classList.add('hud-hidden');
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'char-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #char-panel { top: 70px; left: 12px; width: 240px; z-index: 600; pointer-events: auto; }
        #char-title { color: #ffd700; font-weight: 600; margin-bottom: 8px; }
        .cp-row { display: flex; justify-content: space-between; align-items: center;
          padding: 5px 4px; border-bottom: 1px solid rgba(85,70,31,0.4); font-size: 12px; }
        .cp-row .cp-label { color: #c9b98a; }
        .cp-row .cp-val { color: #f0e6d2; font-weight: 600; }
        .cp-plus { width: 22px; height: 22px; margin-left: 8px; cursor: pointer; line-height: 20px;
          text-align: center; background: linear-gradient(180deg, #d8b54a, #8f751d);
          border: 1px solid #ffd700; border-radius: 3px; color: #1c1405; font-weight: 700; }
        .cp-plus.disabled { opacity: 0.3; cursor: not-allowed; }
        #cp-points { color: #9fd39f; font-size: 12px; margin: 6px 0; }
        #cp-atk { color: #ffd700; font-size: 12px; margin-top: 4px; }
        #cp-hint { margin-top: 6px; font-size: 10px; color: #8a7d5c; }
        .cp-mastery { display: flex; justify-content: space-between; align-items: center;
          padding: 3px 4px; font-size: 11px; border-bottom: 1px solid rgba(85,70,31,0.3); }
        .cp-mastery .m-name { color: #c9b98a; }
        .cp-mastery .m-lvl { color: #9fd39f; margin: 0 6px; }
        .cp-mastery .m-cost { color: #8a94c0; font-size: 10px; }
        .cp-mastery .cp-plus { width: 18px; height: 18px; font-size: 11px; }
      </style>
      <div id="char-title">Personnage</div>
      <div id="cp-points"></div>
      <div class="cp-row"><span class="cp-label">Force (STR)</span><span><span class="cp-val" id="cp-str"></span><span class="cp-plus" data-stat="str">+</span></span></div>
      <div class="cp-row"><span class="cp-label">Intelligence (INT)</span><span><span class="cp-val" id="cp-int"></span><span class="cp-plus" data-stat="int">+</span></span></div>
      <div id="cp-atk"></div>
      <div id="char-mastery-title" style="color:#ffd700;font-weight:600;margin:10px 0 4px;font-size:12px;">Maîtrises</div>
      <div id="cp-masteries"></div>
      <div id="cp-hint">C ou Échap: fermer · +1 STR = +1 dégât tous les 10 points</div>
    `;
    document.body.appendChild(root);
    this.root = root;
    root.querySelectorAll('.cp-plus').forEach((btn) => {
      btn.addEventListener('click', () => this.allocate((btn as HTMLElement).dataset.stat!));
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hide();
    });
  }

  private async allocate(stat: string): Promise<void> {
    const res = await this.network.request<{
      success: boolean; error?: string;
      str?: number; int?: number; statPoints?: number; attackMin?: number; attackMax?: number;
    }>('character:allocate', { stat });
    if (!res.success) {
      const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
      hud?.addChatMessage(res.error ?? 'Allocation impossible', 'system');
      return;
    }
    this.render(res.str ?? 0, res.int ?? 0, res.statPoints ?? 0, res.attackMin ?? 0, res.attackMax ?? 0);
    const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
    hud?.addChatMessage(`+1 ${stat.toUpperCase()} — attaque ${res.attackMin}~${res.attackMax}`, 'system');
  }

  private async refresh(): Promise<void> {
    // L'état réseau courant donne les valeurs de base
    const nc = (window as unknown as { netCombat?: { playerState?: any } }).netCombat;
    const ps = nc?.playerState;
    if (ps) {
      this.render(ps.str ?? 20, ps.int ?? 20, ps.statPoints ?? 0, null, null);
    }
    await this.refreshMasteries();
  }

  private async refreshMasteries(): Promise<void> {
    if (!this.root) return;
    try {
      const res = await this.network.request<{
        success: boolean; masteries?: Array<{
          masteryId: string; name: string; level: number; nextCost: number; canUp: boolean;
        }>; sp?: number;
      }>('character:masteries');
      if (!res.success || !res.masteries) return;
      const box = this.root.querySelector('#cp-masteries') as HTMLElement;
      box.innerHTML = '';
      for (const m of res.masteries) {
        const row = document.createElement('div');
        row.className = 'cp-mastery';
        row.innerHTML = `
          <span class="m-name">${m.name}</span>
          <span><span class="m-lvl">niv. ${m.level}</span>
          <span class="m-cost">${m.nextCost} SP</span>
          <span class="cp-plus ${m.canUp ? '' : 'disabled'}" data-mid="${m.masteryId}">+</span></span>`;
        row.querySelector('.cp-plus')?.addEventListener('click', async () => {
          const up = await this.network.request<{ success: boolean; error?: string }>('mastery:levelup', { masteryId: m.masteryId });
          const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
          if (up.success) {
            hud?.addChatMessage(`${m.name} niveau ${m.level + 1} !`, 'system');
          } else {
            hud?.addChatMessage(up.error ?? 'Montée impossible', 'system');
          }
          void this.refreshMasteries();
        });
        box.appendChild(row);
      }
    } catch { /* silencieux */ }
  }

  private render(str: number, int: number, points: number, atkMin: number | null, atkMax: number | null): void {
    if (!this.root) return;
    (this.root.querySelector('#cp-str') as HTMLElement).textContent = String(str);
    (this.root.querySelector('#cp-int') as HTMLElement).textContent = String(int);
    (this.root.querySelector('#cp-points') as HTMLElement).textContent =
      points > 0 ? `${points} point${points > 1 ? 's' : ''} à répartir` : 'Aucun point disponible';
    this.root.querySelectorAll('.cp-plus').forEach((b) => {
      (b as HTMLElement).classList.toggle('disabled', points <= 0);
    });
    if (atkMin !== null) {
      (this.root.querySelector('#cp-atk') as HTMLElement).textContent = `Attaque: ${atkMin} ~ ${atkMax}`;
    }
  }
}
