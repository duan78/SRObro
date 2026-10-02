/**
 * SRObro - Gestionnaire de fenêtres DOM (V4 §B)
 *
 * Le HUD SRObro est 100% DOM. Avant V4, chaque panneau avait une position
 * CSS fixe (toutes ~top:70px) : deux fenêtres ouvertes se recouvraient et
 * l'écran devenait illisible. Ce module donne aux fenêtres le comportement
 * MMO officiel :
 *  - zone d'écran par défaut par panneau (colonnes gauche/centre/droite,
 *    comme SRO : perso à gauche, inventaire à droite…)
 *  - anti-collision à l'ouverture : si la cible recouvre une fenêtre ouverte
 *    (ou un élément fixe du HUD), elle se décale en cascade jusqu'à être
 *    libre — garantie « tous les panneaux ouverts = 0 chevauchement »
 *  - glisser-déposer par la barre de titre
 *  - clic = passage devant (z-index croissant)
 *  - Échap ferme la fenêtre du dessus
 */

/** Zones par défaut des panneaux (viewport ≥ 1280×720).
 *  Colonnes: gauche (perso/quêtes), milieu (fenêtres larges), droite (party). */
const PANEL_ZONES: Record<string, { left: number; top: number }> = {
  'char-panel': { left: 12, top: 150 },
  'quest-panel': { left: 12, top: 150 },
  'skill-panel': { left: 322, top: 150 },
  'job-panel': { left: 322, top: 150 },
  'exchange-panel': { left: 322, top: 150 },
  'teleport-dialog': { left: 322, top: 150 },
  'inventory-panel': { left: 322, top: 150 },
  'shop-panel': { left: 322, top: 150 },
  'party-panel': { left: 992, top: 210 },
};

/**
 * Groupes d'exclusivité (comportement SRO officiel): une seule fenêtre par
 * zone d'écran — ouvrir un panneau ferme celui déjà ouvert dans son groupe.
 * Sur 1280×720 il est impossible d'afficher simultanément inventaire
 * (640px) + skills (460px) + 4 autres fenêtres sans recouvrement; le jeu
 * officiel empile aussi ces zones.
 */
const ZONE_GROUPS: Record<string, string> = {
  'char-panel': 'left',
  'quest-panel': 'left',
  'skill-panel': 'mid',
  'job-panel': 'mid',
  'exchange-panel': 'mid',
  'teleport-dialog': 'mid',
  'inventory-panel': 'mid',
  'shop-panel': 'mid',
  // party: zone propre (haut-droite, sous la minimap)
};

/** Hauteur max par panneau (scroll interne au-delà — officiel MMO).
 *  ≤ 500 pour la colonne milieu: reste au-dessus de la hotbar (y≈668). */
const PANEL_MAX_HEIGHT: Record<string, number> = {
  'quest-panel': 380,
  'inventory-panel': 500,
  'skill-panel': 500,
  'job-panel': 420,
  'char-panel': 370,
  'exchange-panel': 500,
  'shop-panel': 500,
};

/** Éléments fixes du HUD à ne jamais recouvrir à l'ouverture (le chat et
 *  la hotbar peuvent être recouverts par une fenêtre, comme dans SRO). */
const FIXED_OBSTACLES = ['#hud-charframe', '#hud-targetframe', '#hud-minimap'];

interface ManagedWindow {
  el: HTMLElement;
  title: HTMLElement | null;
}

export class WindowManager {
  private windows = new Map<string, ManagedWindow>();
  private zCounter = 610;
  private observer: MutationObserver | null = null;

  start(): void {
    if (this.observer) return;
    // Les panneaux sont construits paresseusement au premier show: observer
    // le body pour capturer leur apparition et leurs changements de classe.
    this.observer = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (n instanceof HTMLElement) this.tryManage(n);
          }
        } else if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target as HTMLElement;
          if (el instanceof HTMLElement && this.windows.has(el.id) && !el.classList.contains('hud-hidden')) {
            this.onOpen(el.id);
          }
        }
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ['class'] });
    // Les panneaux déjà présents (rares: construits avant start)
    for (const el of Array.from(document.body.children)) {
      if (el instanceof HTMLElement) this.tryManage(el);
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeTop();
    });
  }

  private tryManage(el: HTMLElement): void {
    if (!(el.id in PANEL_ZONES) || this.windows.has(el.id)) return;
    const title = el.querySelector<HTMLElement>('[id$="-title"], .hud-title, h4');
    const w: ManagedWindow = { el, title };
    this.windows.set(el.id, w);
    // Position de zone immédiate (même caché — prête pour la 1re ouverture)
    const zone = PANEL_ZONES[el.id];
    el.style.left = zone.left + 'px';
    el.style.top = zone.top + 'px';
    el.style.transform = 'none';
    // Hauteur max + scroll interne (fenêtres MMO officielles)
    const maxH = PANEL_MAX_HEIGHT[el.id];
    if (maxH) {
      el.style.maxHeight = maxH + 'px';
      el.style.overflowY = 'auto';
    }
    // Passage devant au clic
    el.addEventListener('pointerdown', () => this.bringToFront(el.id));
    // Glisser-déposer par le titre
    if (title) {
      title.style.cursor = 'move';
      title.style.userSelect = 'none';
      title.addEventListener('pointerdown', (e) => this.startDrag(w, e));
    }
    if (!el.classList.contains('hud-hidden')) this.onOpen(el.id);
  }

  /** À l'ouverture: exclusivité de zone, anti-collision clampée à l'écran. */
  private onOpen(id: string): void {
    const w = this.windows.get(id);
    if (!w) return;
    const zone = PANEL_ZONES[id];
    w.el.style.left = zone.left + 'px';
    w.el.style.top = zone.top + 'px';
    this.bringToFront(id);
    // Exclusivité de zone (SRO officiel): fermer la fenêtre déjà ouverte
    // du même groupe.
    const grp = ZONE_GROUPS[id];
    if (grp) {
      for (const [oid, ow] of this.windows) {
        if (oid !== id && ZONE_GROUPS[oid] === grp && !ow.el.classList.contains('hud-hidden')) {
          ow.el.classList.add('hud-hidden');
        }
      }
    }
    // Cascade anti-collision clampée au viewport (droite → bas → jamais hors écran)
    for (let step = 0; step < 40 && this.collides(id); step++) {
      const l = parseFloat(w.el.style.left || '0');
      const t = parseFloat(w.el.style.top || '0');
      let nl = l + 26;
      let nt = t;
      if (nl + w.el.offsetWidth > window.innerWidth - 8) {
        nl = Math.max(0, window.innerWidth - 8 - w.el.offsetWidth);
        nt = t + 26;
      }
      if (nt + w.el.offsetHeight > window.innerHeight - 8) {
        nt = Math.max(0, window.innerHeight - 8 - w.el.offsetHeight);
      }
      w.el.style.left = nl + 'px';
      w.el.style.top = nt + 'px';
    }
  }

  /** Rect de la fenêtre recouvre-t-il une autre fenêtre OUVERTE ou un obstacle fixe ? */
  private collides(id: string): boolean {
    const w = this.windows.get(id);
    if (!w) return false;
    const a = w.el.getBoundingClientRect();
    const pad = 4;
    const rect = { l: a.left - pad, r: a.right + pad, t: a.top - pad, b: a.bottom + pad };
    for (const [oid, ow] of this.windows) {
      if (oid === id || ow.el.classList.contains('hud-hidden')) continue;
      const b = ow.el.getBoundingClientRect();
      if (rect.l < b.right && rect.r > b.left && rect.t < b.bottom && rect.b > b.top) return true;
    }
    for (const sel of FIXED_OBSTACLES) {
      const el = document.querySelector(sel);
      if (!el || (el as HTMLElement).classList.contains('hud-hidden')) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (rect.l < b.right && rect.r > b.left && rect.t < b.bottom && rect.b > b.top) return true;
    }
    return false;
  }

  private bringToFront(id: string): void {
    const w = this.windows.get(id);
    if (w) w.el.style.zIndex = String(this.zCounter++);
  }

  /** Z-index le plus élevé parmi les fenêtres ouvertes. */
  private closeTop(): void {
    let top: ManagedWindow | null = null;
    let topZ = -1;
    for (const w of this.windows.values()) {
      if (w.el.classList.contains('hud-hidden')) continue;
      const z = parseInt(w.el.style.zIndex || '600', 10);
      if (z > topZ) { topZ = z; top = w; }
    }
    if (top) top.el.classList.add('hud-hidden');
  }

  private startDrag(w: ManagedWindow, e: PointerEvent): void {
    e.preventDefault();
    const el = w.el;
    const startX = e.clientX;
    const startY = e.clientY;
    const origL = parseFloat(el.style.left || '0');
    const origT = parseFloat(el.style.top || '0');
    el.setPointerCapture?.(e.pointerId);
    const onMove = (ev: PointerEvent): void => {
      const nl = Math.min(Math.max(origL + ev.clientX - startX, 0), Math.max(0, window.innerWidth - el.offsetWidth));
      const nt = Math.min(Math.max(origT + ev.clientY - startY, 0), Math.max(0, window.innerHeight - 24));
      el.style.left = nl + 'px';
      el.style.top = nt + 'px';
    };
    const onUp = (): void => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  }

  /** Assertion d'audit V4 §B: aucune paire de fenêtres ouvertes ne se chevauche. */
  static auditNoOverlap(): { ok: boolean; overlaps: Array<[string, string]> } {
    const MODALS = new Set(['world-map', 'loading-screen', 'auth-screen', 'hud']);
    const open = Array.from(document.body.children).filter(
      (n) =>
        n instanceof HTMLElement &&
        !MODALS.has(n.id) &&
        !n.classList.contains('hud-hidden') &&
        (n.id.endsWith('-panel') || n.id === 'teleport-dialog' || n.id === 'shop-panel'),
    ) as HTMLElement[];
    const bad: Array<[string, string]> = [];
    for (let i = 0; i < open.length; i++) {
      for (let j = i + 1; j < open.length; j++) {
        const a = open[i].getBoundingClientRect();
        const b = open[j].getBoundingClientRect();
        if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
          bad.push([open[i].id || open[i].className, open[j].id || open[j].className]);
        }
      }
    }
    return { ok: bad.length === 0, overlaps: bad };
  }
}
