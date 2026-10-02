/**
 * SRObro - HUD DOM Overlay
 *
 * Interface joueur en HTML/CSS par-dessus le canvas Babylon. Le HUD DOM est
 * volontairement adopté (au lieu de @babylonjs/gui) pour sa fiabilité de
 * rendu et sa facilité de stylage Silkroad (cadres dorés, panneaux sombres).
 *
 * Surcharge CSS dans index.html (style #hud).
 */

import { Minimap } from './Minimap';

export interface HudStats {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  exp: number;
  maxExp: number;
  gold: number;
  sp?: number;
}

export interface HudTarget {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
} 

export class DomHud {
  private root: HTMLElement;
  private hpFill: HTMLElement;
  private mpFill: HTMLElement;
  private expFill: HTMLElement;
  private hpText: HTMLElement;
  private mpText: HTMLElement;
  private expText: HTMLElement;
  private levelBadge: HTMLElement;
  private nameLabel: HTMLElement;
  private goldText: HTMLElement;
  private chatLog: HTMLElement;
  private targetFrame: HTMLElement;
  private targetFill: HTMLElement;
  private targetText: HTMLElement;
  private targetName: HTMLElement;
  private coordsText: HTMLElement;
  private hotbarSlots: HTMLElement[] = [];
  private minimap: Minimap;

  constructor() {
    this.root = document.createElement('div');
    this.root.id = 'hud';
    this.root.innerHTML = `
      <div id="hud-charframe" class="hud-panel">
        <div class="hud-name-row"><span id="hud-name">Adventurer</span><span id="hud-level" class="hud-level">Lv. 1</span></div>
        <div class="hud-bar hud-bar-hp"><div id="hud-hp-fill" class="hud-fill"></div><span id="hud-hp-text" class="hud-bar-text">100 / 100</span></div>
        <div class="hud-bar hud-bar-mp"><div id="hud-mp-fill" class="hud-fill"></div><span id="hud-mp-text" class="hud-bar-text">100 / 100</span></div>
        <div class="hud-bar hud-bar-exp"><div id="hud-exp-fill" class="hud-fill"></div><span id="hud-exp-text" class="hud-bar-text">0.0%</span></div>
        <div class="hud-gold-row">Gold: <span id="hud-gold">0</span></div>
      </div>

      <div id="hud-targetframe" class="hud-panel hud-hidden">
        <div class="hud-name-row"><span id="hud-target-name">Monster</span><span id="hud-target-level" class="hud-level">Lv. 1</span></div>
        <div class="hud-bar hud-bar-target"><div id="hud-target-fill" class="hud-fill"></div><span id="hud-target-text" class="hud-bar-text">100 / 100</span></div>
      </div>

      <div id="hud-hotbar" class="hud-panel">
        <!-- slots injectés par JS -->
      </div>

      <div id="hud-chat" class="hud-panel">
        <div id="hud-chat-log"></div>
        <div id="hud-chat-hint">[Enter] Chat</div>
      </div>

      <div id="hud-minimap" class="hud-panel">
        <div id="hud-coords">X: 0 Z: 0</div>
      </div>
    `;
    document.body.appendChild(this.root);

    const byId = (id: string): HTMLElement => this.root.querySelector('#' + id) as HTMLElement;
    this.hpFill = byId('hud-hp-fill');
    this.mpFill = byId('hud-mp-fill');
    this.expFill = byId('hud-exp-fill');
    this.hpText = byId('hud-hp-text');
    this.mpText = byId('hud-mp-text');
    this.expText = byId('hud-exp-text');
    this.levelBadge = byId('hud-level');
    this.nameLabel = byId('hud-name');
    this.goldText = byId('hud-gold');
    this.chatLog = byId('hud-chat-log');
    this.targetFrame = byId('hud-targetframe');
    this.targetFill = byId('hud-target-fill');
    this.targetText = byId('hud-target-text');
    this.targetName = byId('hud-target-name');
    this.coordsText = byId('hud-coords');

    // Minimap réelle (phase 7): tuiles officielles + flèche joueur orientée
    this.minimap = new Minimap(byId('hud-minimap'));

    // Hotbar F1..F10
    const hotbar = byId('hud-hotbar');
    for (let i = 1; i <= 10; i++) {
      const slot = document.createElement('div');
      slot.className = 'hud-slot';
      slot.innerHTML = `<span class="hud-slot-key">F${i}</span>`;
      hotbar.appendChild(slot);
      this.hotbarSlots.push(slot);
    }

    // Jauge berserker (5 orbes, Tab pour activer — Phase C)
    const zerk = document.createElement('div');
    zerk.id = 'hud-zerk';
    zerk.style.cssText = 'position:absolute;bottom:96px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:20;';
    for (let i = 0; i < 5; i++) {
      const orb = document.createElement('div');
      orb.style.cssText =
        'width:14px;height:14px;border-radius:50%;border:1px solid #8f751d;' +
        'background:rgba(30,20,5,0.7);transition:background 0.3s,box-shadow 0.3s;';
      zerk.appendChild(orb);
    }
    (byId('hud-root') ?? document.body).appendChild(zerk);

    this.addChatMessage('Welcome to SRObro!', 'system');
    this.addChatMessage('WASD/ZQSD pour bouger, clic pour attaquer. S: skills, Tab: zerk.', 'system');
  }

  /** Hotbar dynamique (skills appris, touches 1-8 — Phase C). */
  setHotbarSkills(skills: Array<{ label: string; key: string; mpCost?: number }>): void {
    this.hotbarSlots.forEach((slot, i) => {
      const s = skills[i];
      if (s) {
        slot.innerHTML = `<span class="hud-slot-key">${s.key}</span><span class="hud-slot-label" style="font-size:9px;color:#f0e6d2;overflow:hidden;max-width:40px;text-overflow:ellipsis;white-space:nowrap;">${s.label}</span>`;
        slot.title = `${s.label}${s.mpCost ? ` (${s.mpCost} MP)` : ''}`;
      } else {
        slot.innerHTML = `<span class="hud-slot-key">${i < 8 ? i + 1 : 'F' + (i + 1)}</span>`;
      }
    });
  }

  /** Orbes berserker (0-5); actif = orbes rouges pulsantes. */
  setZerkOrbs(orbs: number, active = false): void {
    const zerk = document.getElementById('hud-zerk');
    if (!zerk) return;
    [...zerk.children].forEach((orb, i) => {
      const el = orb as HTMLElement;
      const filled = i < orbs || active;
      el.style.background = active
        ? 'radial-gradient(circle, #ff5a2a, #a01a00)'
        : filled ? 'radial-gradient(circle, #ffb347, #b06000)' : 'rgba(30,20,5,0.7)';
      el.style.boxShadow = filled ? '0 0 8px rgba(255,120,40,0.8)' : 'none';
    });
  }

  setStats(s: HudStats): void {
    this.nameLabel.textContent = s.name;
    this.levelBadge.textContent = 'Lv. ' + s.level;
    this.setBar(this.hpFill, this.hpText, s.hp, s.maxHp);
    this.setBar(this.mpFill, this.mpText, s.mp, s.maxMp);
    this.setBar(this.expFill, this.expText, s.exp, s.maxExp, true);
    this.goldText.textContent = s.gold.toLocaleString('fr-FR');
  }

  setCoords(x: number, z: number): void {
    this.coordsText.textContent = `X: ${Math.round(x)} Z: ${Math.round(z)}`;
    this.minimap.update(x, z, this.lastPlayerRot);
  }

  /** Cap du joueur (anims/move) pour orienter la flèche minimap. */
  private lastPlayerRot = 0;
  setPlayerRotation(rot: number): void {
    this.lastPlayerRot = rot;
  }

  showTarget(t: HudTarget | null): void {
    if (!t) {
      this.targetFrame.classList.add('hud-hidden');
      return;
    }
    this.targetFrame.classList.remove('hud-hidden');
    this.targetName.textContent = t.name;
    (this.root.querySelector('#hud-target-level') as HTMLElement).textContent = 'Lv. ' + t.level;
    this.setBar(this.targetFill, this.targetText, t.hp, t.maxHp);
  }

  /** Callback d'envoi de message chat (branché par NetworkCombat). */
  onChatSend: ((message: string) => void) | null = null;
  private chatInput: HTMLInputElement | null = null;

  /** Active le champ de saisie: Entrée ouvre/valide, Échap referme. */
  setupChatInput(): void {
    const hint = this.root.querySelector('#hud-chat-hint');
    const input = document.createElement('input') as HTMLInputElement;
    input.id = 'hud-chat-input';
    input.type = 'text';
    input.maxLength = 120;
    input.placeholder = 'Message… (/who, /loc)';
    input.style.cssText = 'width:100%;box-sizing:border-box;margin-top:3px;padding:4px 6px;background:#141008;border:1px solid #55461f;border-radius:3px;color:#f0e6d2;font-size:12px;outline:none;display:none;';
    hint?.after(input);
    this.chatInput = input;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.style.display === 'none') {
        input.style.display = 'block';
        input.focus();
        e.preventDefault();
      } else if (e.key === 'Escape' && input.style.display !== 'none') {
        input.style.display = 'none';
        input.blur();
      }
    });
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        const msg = input.value.trim();
        if (msg) this.onChatSend?.(msg);
        input.value = '';
        input.style.display = 'none';
        input.blur();
      } else if (e.key === 'Escape') {
        input.style.display = 'none';
        input.blur();
      }
    });
  }

  addChatMessage(text: string, kind: 'system' | 'say' | 'combat' = 'say'): void {
    const line = document.createElement('div');
    line.className = 'hud-chat-line hud-chat-' + kind;
    line.textContent = text;
    this.chatLog.appendChild(line);
    while (this.chatLog.children.length > 8) {
      this.chatLog.removeChild(this.chatLog.firstChild as ChildNode);
    }
  }

  /** Met à jour une icône de slot (1..10) avec un glyphe texte. */
  setSlotIcon(index: number, glyph: string, title?: string): void {
    const slot = this.hotbarSlots[index - 1];
    if (!slot) return;
    const key = slot.querySelector('.hud-slot-key') as HTMLElement | null;
    if (key) key.textContent = glyph || 'F' + index;
    slot.title = title ?? '';
  }

  private setBar(fill: HTMLElement, text: HTMLElement, value: number, max: number, isPercent = false): void {
    const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
    fill.style.width = (ratio * 100).toFixed(1) + '%';
    if (isPercent) {
      text.textContent = (ratio * 100).toFixed(1) + '%';
    } else {
      text.textContent = `${Math.round(value)} / ${Math.round(max)}`;
    }
  }

  dispose(): void {
    this.root.remove();
  }
}
