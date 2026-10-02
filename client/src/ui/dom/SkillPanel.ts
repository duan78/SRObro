/**
 * SRObro — Fenêtre Skills (touche S, Phase C du PROMPT_MAITRE_V2)
 * Arbre des maîtrises avec les séries officielles (skills:available — données
 * skilldata serveur), apprentissage par SP (skill:learn), hotbar dynamique.
 */

import type { NetworkManager } from '../../network/NetworkManager';
import { iconUrl, DEFAULT_ICON } from './iconUrl';

/** Icône officielle de maîtrise (bicheon→sword, fire…, warrior→eu_warrior…). */
function masteryIconUrl(masteryKey: string): string | null {
  const CH: Record<string, string> = {
    bicheon: 'sword', heuksal: 'spear', pacheon: 'bow',
    fire: 'fire', cold: 'cold', lightning: 'lightning', force: 'gigong',
  };
  const EU: Record<string, string> = {
    warrior: 'warrior', rogue: 'rog', wizard: 'wizard',
    warlock: 'warlock', cleric: 'cleric', bard: 'bard',
  };
  const base = CH[masteryKey] ? `/assets/icons/skillmastery/china/mastery_${CH[masteryKey]}.png`
    : EU[masteryKey] ? `/assets/icons/skillmastery/europe/eu_${EU[masteryKey]}.png`
    : null;
  return base;
}

interface SkillLevel {
  code: string;
  name: string;
  level: number;
  reqMasteryLv: number;
  reqSp: number;
  mpCost: number;
  cooldownMs: number;
  attKind: number;
  attPct: number;
  attMin: number;
  attMax: number;
  learned: boolean;
  masteryLevel: number;
  icon?: string;
}

interface SeriesInfo {
  code: string;
  name: string;
  masteryKey: string;
  masteryLabel: string;
  levels: SkillLevel[];
}

const KIND_LABEL: Record<number, string> = { 5: 'PHY', 8: 'Imbue', 10: 'MAG' };

export class SkillPanel {
  private network: NetworkManager;
  private root: HTMLElement | null = null;
  private visible = false;
  private series: SeriesInfo[] = [];
  private sp = 0;
  private activeMastery = '';
  private onChanged?: () => void;

  constructor(network: NetworkManager, onChanged?: () => void) {
    this.network = network;
    this.onChanged = onChanged;
    window.addEventListener('keydown', (e) => {
      if (e.key === 's' || e.key === 'S') {
        // Ne pas ouvrir si un champ de saisie a le focus (chat)
        const tag = (document.activeElement?.tagName ?? '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        this.visible ? this.hide() : void this.show();
      }
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
    await this.refresh();
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'skill-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #skill-panel { top: 70px; left: 40px; width: 460px; max-height: 70vh; overflow-y: auto;
          z-index: 600; pointer-events: auto; }
        #skill-title { color: #ffd700; font-weight: 600; margin-bottom: 4px; }
        #skill-sp { color: #c9b98a; font-size: 11px; margin-bottom: 6px; }
        .sk-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .sk-tab { padding: 3px 10px; font-size: 11px; cursor: pointer; border: 1px solid #8f751d;
          border-radius: 3px; background: rgba(30,24,8,0.9); color: #c9b98a; }
        .sk-tab.active { background: linear-gradient(180deg, #d8b54a, #8f751d); color: #1c1405; font-weight: 600; }
        .sk-series { padding: 6px 4px; border-bottom: 1px solid rgba(85,70,31,0.4); }
        .sk-series-name { color: #f0e6d2; font-size: 12px; font-weight: 600; }
        .sk-kind { color: #8a94c0; font-size: 10px; margin-left: 6px; }
        .sk-levels { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .sk-lv { display: flex; align-items: center; gap: 3px; font-size: 10px; color: #c9b98a; }
        .sk-lv.learned { color: #7ec97e; }
        .sk-lv.locked { color: #6a5f45; }
        .sk-learn { padding: 1px 7px; cursor: pointer; font-size: 10px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
          border-radius: 3px; color: #1c1405; }
        .sk-learn:disabled { opacity: 0.35; cursor: default; }
      </style>
      <div id="skill-title">Maîtrises & Skills <span style="color:#8a94c0;font-size:10px">(touche S)</span></div>
      <div id="skill-sp"></div>
      <div class="sk-tabs" id="skill-tabs"></div>
      <div id="skill-body"></div>
    `;
    document.body.appendChild(root);
    this.root = root;
  }

  private async refresh(): Promise<void> {
    if (!this.root || !this.visible) return;
    try {
      const res = await this.network.request<{
        success: boolean; sp?: number; series?: SeriesInfo[]; masteries?: Array<[string, number]>;
      }>('skills:available');
      if (!res.success || !res.series) return;
      this.series = res.series;
      this.sp = res.sp ?? 0;

      const spEl = this.root.querySelector('#skill-sp') as HTMLElement;
      spEl.textContent = `SP disponibles: ${this.sp.toLocaleString('fr')} — monter les maîtrises: console admin ou quêtes (gap farming officiel)`;

      // Onglets par maîtrise (avec niveau entraîné + icône officielle)
      const masteryLevels = new Map(res.masteries ?? []);
      const masteries = [...new Set(this.series.map((s) => s.masteryKey))];
      if (!this.activeMastery || !masteries.includes(this.activeMastery)) {
        this.activeMastery = masteries[0] ?? '';
      }
      const tabs = this.root.querySelector('#skill-tabs') as HTMLElement;
      tabs.innerHTML = '';
      for (const m of masteries) {
        const tab = document.createElement('div');
        tab.className = 'sk-tab' + (m === this.activeMastery ? ' active' : '');
        const label = this.series.find((s) => s.masteryKey === m)?.masteryLabel ?? m;
        const lv = masteryLevels.get(m) ?? 0;
        const icon = masteryIconUrl(m);
        tab.innerHTML =
          (icon ? `<img src="${icon}" style="width:22px;height:22px;object-fit:contain;" onerror="this.style.display='none'">` : '') +
          `<span>${label}${lv ? ` (${lv})` : ''}</span>`;
        tab.addEventListener('click', () => { this.activeMastery = m; void this.refresh(); });
        tabs.appendChild(tab);
      }

      // Séries de la maîtrise active
      const body = this.root.querySelector('#skill-body') as HTMLElement;
      body.innerHTML = '';
      const list = this.series.filter((s) => s.masteryKey === this.activeMastery);
      for (const s of list) {
        const row = document.createElement('div');
        row.className = 'sk-series';
        const kind = s.levels[0]?.attKind ?? 5;
        // Icône officielle de la série (icône du plus haut niveau)
        const topLvl = [...s.levels].reverse().find((l) => l.icon) ?? s.levels.find((l) => l.icon);
        const sIcon = iconUrl(topLvl?.icon as string | undefined) ?? DEFAULT_ICON;
        row.innerHTML =
          `<img src="${sIcon}" style="width:34px;height:34px;object-fit:contain;flex:none" onerror="this.src='${DEFAULT_ICON}'">` +
          `<span class="sk-series-name">${s.name}</span><span class="sk-kind">${KIND_LABEL[kind] ?? ''}</span>`;
        const lvRow = document.createElement('div');
        lvRow.className = 'sk-levels';
        for (const lvl of s.levels) {
          const el = document.createElement('div');
          const cls = lvl.learned ? 'learned' : lvl.masteryLevel >= lvl.reqMasteryLv && this.sp >= lvl.reqSp ? '' : 'locked';
          el.className = `sk-lv ${cls}`;
          el.innerHTML = `<span title="${lvl.name} — ${lvl.attPct}% +${lvl.attMin}~${lvl.attMax}, ${lvl.mpCost} MP, CD ${(lvl.cooldownMs / 1000).toFixed(1)}s, maîtrise ${lvl.reqMasteryLv}">
            ${lvl.learned ? '✓' : ''}Lv${lvl.level}</span>`;
          if (!lvl.learned) {
            const btn = document.createElement('button');
            btn.className = 'sk-learn';
            btn.textContent = `${lvl.reqSp} SP`;
            btn.disabled = lvl.masteryLevel < lvl.reqMasteryLv || this.sp < lvl.reqSp;
            btn.addEventListener('click', async () => {
              const r = await this.network.request<{ success: boolean; error?: string }>('skill:learn', { code: lvl.code });
              if (r?.success) {
                lvl.learned = true;
                this.onChanged?.();
                void this.refresh();
              } else {
                el.title = r?.error ?? '';
                btn.textContent = r?.error?.slice(0, 18) ?? 'Erreur';
                setTimeout(() => { btn.textContent = `${lvl.reqSp} SP`; }, 2000);
              }
            });
            el.appendChild(btn);
          }
          lvRow.appendChild(el);
        }
        row.appendChild(lvRow);
        body.appendChild(row);
      }
      if (!body.children.length) {
        body.innerHTML = '<div style="color:#8a94c0;font-size:11px;">Aucune série pour cette maîtrise.</div>';
      }
    } catch { /* silencieux */ }
  }
}
