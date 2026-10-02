/**
 * SRObro - Panneau de quêtes + rendu des PNJ (DOM + meshes, phase 4)
 * Touche L: quêtes disponibles/en cours. Les PNJ de la ville sont rendus
 * comme bornes cliquables: clic → dialogue/quêtes (talk/rendu).
 */

import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import type { NetworkManager } from '../../network/NetworkManager';
import type { JanganZone } from '../../zones/jangan/JanganZone';

interface NpcInfo {
  id: string;
  name: string;
  npcType?: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  dialogue: string | null;
}

export class QuestSystem {
  private network: NetworkManager;
  private scene: Scene;
  private janganZone: JanganZone | null;
  private root: HTMLElement | null = null;
  private visible = false;
  private npcMeshes = new Map<string, any>();
  private npcsLoaded = false;
  /** Quête suivie dans le HUD (une seule à la fois, façon SRO). */
  private trackedQuestId: string | null = null;

  constructor(network: NetworkManager, scene: Scene, janganZone: JanganZone | null) {
    this.network = network;
    this.scene = scene;
    this.janganZone = janganZone;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'l' || e.key === 'L') void this.toggle();
    });
    // Évènements quêtes poussés par le serveur
    this.network.onRaw('quest:progress', (d: any) => this.notify(`${d?.monster} tué — objectif avancé`));
    this.network.onRaw('quest:completed', (d: any) => {
      const r = d?.rewards ?? {};
      this.notify(`Quête « ${d?.questName} » terminée ! +${r.exp ?? 0} XP, +${r.sp ?? 0} SP, +${r.gold ?? 0} or`);
    });
    // Annonce serveur d'apparition d'un unique (comportement officiel)
    this.network.onRaw('unique:spawned', (d: any) =>
      this.notify(`⭐ ${d?.name ?? 'Un unique'} (niv. ${d?.level ?? '?'}) est apparu dans la région !`));
  }

  private notify(text: string): void {
    const hud = (window as unknown as { hud?: { addChatMessage(t: string, k: string): void } }).hud;
    hud?.addChatMessage(text, 'system');
  }

  /** Charge les PNJ et les rend dans la ville (appelé après le boot). */
  async loadNpcs(): Promise<void> {
    if (this.npcsLoaded) return;
    try {
      const res = await this.network.request<{ success: boolean; npcs?: NpcInfo[] }>('npc:list');
      if (!res.success || !res.npcs) return;
      for (const npc of res.npcs) {
        this.spawnNpcMesh(npc);
      }
      this.npcsLoaded = true;
      console.log(`[QuestSystem] ${this.npcMeshes.size} PNJ rendus`);
    } catch { /* silencieux */ }
  }

  private spawnNpcMesh(npc: NpcInfo): void {
    const terrain = this.janganZone?.realTerrain;
    const y = terrain ? terrain.heightAt(npc.position.x, npc.position.z) : npc.position.y;
    // Modèle humain officiel animé (idle standcity) quand l'AssetLoader est
    // disponible; cylindre coloré en repli. Le genre alterne selon l'id.
    const game = (window as unknown as { appState?: { game?: { getAssetLoader?: () => unknown } } }).appState;
    const loader = game?.game?.getAssetLoader?.() as
      | { loadGameObject(id: string): Promise<{ root: any } | null> }
      | undefined;
    if (loader) {
      const hash = [...npc.id].reduce((a, c) => a + c.charCodeAt(0), 0);
      const female = hash % 2 === 0;
      const resource = female ? 'chinawoman_adventurer' : 'chinaman_adventurer';
      void loader.loadGameObject(resource).then((loaded) => {
        if (!loaded?.root) {
          this.spawnNpcCylinder(npc, y);
          return;
        }
        const root = loaded.root;
        root.position.set(npc.position.x, y, npc.position.z);
        root.rotation.y = npc.rotation || (hash % 628) / 100;
        // Pieds au sol depuis les VERTICES BRUTS (statiques — la bbox animée
        // bouge avec l'idle et ferait « flotter » le PNJ), échelle native
        // BMS ~17 u: le monde est en unités SRO, ne pas réduire à 1,8.
        const parts = root.getChildMeshes().filter((m: any) => m.getTotalVertices?.() > 0) as any[];
        let min = Infinity, max = -Infinity;
        for (const m of parts) {
          const pos = m.getVerticesData?.('position');
          if (!pos) continue;
          for (let i = 1; i < pos.length; i += 3) {
            if (pos[i] < min) min = pos[i];
            if (pos[i] > max) max = pos[i];
          }
        }
        const h = max - min;
        if (h > 5 && Number.isFinite(h)) {
          root.scaling.setAll(1.0);
          for (const child of root.getChildTransformNodes(true)) child.position.y = -min;
        }
        // Ciblage (dialogue/téléport) sur le corps du PNJ
        for (const mesh of root.getChildMeshes()) {
          mesh.isPickable = true;
          mesh.metadata = { npcId: npc.id, npcName: npc.name, npcType: npc.npcType };
        }
        this.npcMeshes.set(npc.id, root);
        // Idle officiel en boucle
        const skeletons: unknown[] = [];
        for (const m of root.getChildMeshes()) {
          const sk = (m as any).skeleton;
          if (sk && !skeletons.includes(sk)) skeletons.push(sk);
        }
        if (skeletons.length > 0) {
          void import('../../animation/BanAnimationService').then(({ AnimationService }) =>
            AnimationService.loadAndPlay(
              this.scene,
              skeletons as never,
              AnimationService.playerClip('standcity', female),
              true,
              1.0,
            )).catch(() => undefined);
        }
      }).catch(() => this.spawnNpcCylinder(npc, y));
      return;
    }
    this.spawnNpcCylinder(npc, y);
  }

  /** Borne cylindrique cliquable (repli sans modèle 3D). */
  private spawnNpcCylinder(npc: NpcInfo, y: number): void {
    const marker = MeshBuilder.CreateCylinder(`npc_${npc.id}`, { diameter: 0.8, height: 1.9 }, this.scene);
    marker.position.set(npc.position.x, y + 0.95, npc.position.z);
    const mat = new StandardMaterial(`npc_mat_${npc.id}`, this.scene);
    const isGuard = npc.id.includes('guard');
    const isTeleporter = npc.npcType === 'teleport' || npc.id.includes('teleport') || npc.id.includes('gatekeeper');
    mat.diffuseColor = isTeleporter
      ? new Color3(0.3, 0.85, 0.9)
      : isGuard ? new Color3(0.2, 0.4, 0.9) : new Color3(0.85, 0.7, 0.2);
    mat.emissiveColor = mat.diffuseColor.scale(0.25);
    marker.material = mat;
    marker.isPickable = true;
    marker.metadata = { npcId: npc.id, npcName: npc.name, npcType: npc.npcType };
    this.npcMeshes.set(npc.id, marker);
  }

  /** Clic sur un PNJ: Gatekeeper → téléporteurs officiels, sinon quêtes. */
  async interact(npcId: string): Promise<void> {
    const meta = this.npcMeshes.get(npcId)?.metadata as { npcType?: string } | undefined;
    if (meta?.npcType === 'teleport' || npcId.includes('teleport') || npcId.includes('gatekeeper')) {
      await this.openTeleportDialog(npcId);
      return;
    }
    const res = await this.network.request<{
      success: boolean; error?: string; completed?: string[]; startedDialogue?: string;
    }>('quest:interact', { npcId });
    if (!res.success) {
      this.notify(res.error ?? 'Interaction impossible');
      return;
    }
    const npc = this.findNpcName(npcId);
    if (res.startedDialogue) {
      this.notify(`${npc}: « ${res.startedDialogue} »`);
    }
    if (res.completed && res.completed.length) {
      for (const q of res.completed) this.notify(`Quête rendue: ${q}`);
    } else if (!res.startedDialogue) {
      this.notify(`${npc} n'a rien pour l'instant (quêtes: touche L)`);
    }
  }

  /** Boîte de dialogue du Gatekeeper: destinations officielles (coût/niveau). */
  private async openTeleportDialog(npcId: string): Promise<void> {
    try {
      const res = await this.network.request<{
        success: boolean; gold?: number;
        destinations?: Array<{ id: string; name: string; cost: number; requiredLevel: number }>;
      }>('teleport:list');
      if (!res.success || !res.destinations?.length) {
        this.notify('Gatekeeper: aucune destination disponible');
        return;
      }
      document.getElementById('teleport-dialog')?.remove();
      const dlg = document.createElement('div');
      dlg.id = 'teleport-dialog';
      dlg.innerHTML = `
        <style>
          #teleport-dialog { position: fixed; top: 90px; left: 50%; transform: translateX(-50%);
            background: rgba(18,14,6,0.94); border: 1px solid #8f751d; border-radius: 6px;
            padding: 14px 18px; z-index: 900; pointer-events: auto; min-width: 260px; }
          #teleport-dialog h4 { color: #ffd700; margin: 0 0 8px; font-size: 14px; }
          .tp-row { display: flex; justify-content: space-between; gap: 14px; padding: 5px 4px;
            border-bottom: 1px solid rgba(85,70,31,0.4); font-size: 12px; align-items: center; }
          .tp-name { color: #f0e6d2; } .tp-cost { color: #ffd700; font-size: 11px; }
          .tp-go { padding: 2px 10px; cursor: pointer; font-size: 11px;
            background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
            border-radius: 3px; color: #1c1405; }
          .tp-close { margin-top: 8px; width: 100%; padding: 4px; cursor: pointer; font-size: 11px;
            background: #3a2f14; color: #c9b98a; border: 1px solid #8f751d; border-radius: 3px; }
        </style>
        <h4>Gatekeeper — Téléportation</h4>
        <div class="tp-rows"></div>
        <button class="tp-close">Fermer</button>`;
      document.body.appendChild(dlg);
      const rows = dlg.querySelector('.tp-rows') as HTMLElement;
      for (const d of res.destinations) {
        const row = document.createElement('div');
        row.className = 'tp-row';
        row.innerHTML = `
          <span class="tp-name">${d.name}</span>
          <span class="tp-cost">${d.cost.toLocaleString('fr')} or${d.requiredLevel > 1 ? ` · niv. ${d.requiredLevel}` : ''}</span>
          <button class="tp-go">Voyager</button>`;
        row.querySelector('.tp-go')?.addEventListener('click', async () => {
          const r = await this.network.request<{ success: boolean; error?: string; destination?: string }>(
            'teleport:use', { teleportPointId: d.id });
          if (r?.success) {
            this.notify(`Téléporté vers ${r.destination} (−${d.cost.toLocaleString('fr')} or)`);
            dlg.remove();
          } else {
            this.notify(r?.error ?? 'Téléportation impossible');
          }
        });
        rows.appendChild(row);
      }
      dlg.querySelector('.tp-close')?.addEventListener('click', () => dlg.remove());
      setTimeout(() => dlg.remove(), 60000);
    } catch {
      this.notify('Gatekeeper indisponible');
    }
  }

  private findNpcName(npcId: string): string {
    return this.npcMeshes.get(npcId)?.metadata?.npcName ?? 'PNJ';
  }

  // ============================================
  // PANNEAU DE QUÊTES (touche L)
  // ============================================

  async toggle(): Promise<void> {
    this.visible ? this.hide() : await this.show();
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
    root.id = 'quest-panel';
    root.className = 'hud-panel hud-hidden';
    root.innerHTML = `
      <style>
        #quest-panel { top: 70px; right: 40px; width: 300px; z-index: 600; pointer-events: auto; }
        #quest-title { color: #ffd700; font-weight: 600; margin-bottom: 6px; }
        .q-section { color: #c9b98a; font-size: 11px; margin: 8px 0 4px; text-transform: uppercase; }
        .q-row { padding: 5px 4px; border-bottom: 1px solid rgba(85,70,31,0.4); font-size: 12px; }
        .q-name { color: #f0e6d2; }
        .q-obj { color: #8a94c0; font-size: 11px; margin-top: 2px; }
        .q-rewards { color: #ffd700; font-size: 10px; }
        .q-accept { margin-left: 8px; padding: 2px 8px; cursor: pointer; font-size: 10px;
          background: linear-gradient(180deg, #d8b54a, #8f751d); border: 1px solid #ffd700;
          border-radius: 3px; color: #1c1405; }
      </style>
      <div id="quest-title">Quêtes</div>
      <div id="quest-body"></div>
    `;
    document.body.appendChild(root);
    this.root = root;
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.hide(); });
  }

  private async refresh(): Promise<void> {
    if (!this.root || !this.visible) return;
    const body = this.root.querySelector('#quest-body') as HTMLElement;
    body.innerHTML = '';
    try {
      const avail = await this.network.request<{ success: boolean; quests?: any[] }>('quest:get_available', {});
      const inProg = await this.network.request<{ success: boolean; quests?: any[] }>('quest:get_in_progress', {});
      if (avail.success && avail.quests?.length) {
        const sec = document.createElement('div');
        sec.className = 'q-section';
        sec.textContent = 'Disponibles';
        body.appendChild(sec);
        for (const q of avail.quests) {
          const row = document.createElement('div');
          row.className = 'q-row';
          const rewards = q.rewards ?? {};
          row.innerHTML = `
            <span class="q-name">${q.name}</span><button class="q-accept">Accepter</button>
            <div class="q-obj">${(q.objectives ?? []).map((o: any) => `${o.targetName ?? o.targetId} ×${o.count}`).join(', ')}</div>
            <div class="q-rewards">+${rewards.exp ?? 0} XP · +${rewards.sp ?? 0} SP · +${rewards.gold ?? 0} or</div>`;
          row.querySelector('.q-accept')?.addEventListener('click', async () => {
            const res = await this.network.request('quest:accept', { questId: q.id });
            this.notify(res?.success ? `Quête acceptée: ${q.name}` : res?.error ?? 'Impossible');
            void this.refresh();
          });
          body.appendChild(row);
        }
      }
      if (inProg.success && inProg.quests?.length) {
        const sec = document.createElement('div');
        sec.className = 'q-section';
        sec.textContent = 'En cours';
        body.appendChild(sec);
        for (const p of inProg.quests) {
          const q = p.quest ?? p;
          const row = document.createElement('div');
          row.className = 'q-row';
          const objectives = (q.objectives ?? []) as any[];
          const progressData = (p.progress ?? {}) as Record<string, number>;
          const objLines = objectives.map((o, i) =>
            `<div class="q-obj">${o.targetName ?? o.targetId}: ${progressData[i] ?? 0}/${o.count}</div>`).join('');
          // Phase C V3: suivi HUD (une quête trackée) + abandon
          const done = objectives.every((o, i) => (progressData[i] ?? 0) >= o.count);
          row.innerHTML = `<span class="q-name">${q.name}${done ? ' ✓ (à rendre)' : ''}</span>
            <button class="q-track" title="Suivre dans le HUD">${this.trackedQuestId === q.id ? '◉' : '○'}</button>
            <button class="q-abandon" title="Abandonner">✕</button>${objLines}`;
          row.querySelector('.q-track')?.addEventListener('click', () => {
            this.trackedQuestId = this.trackedQuestId === q.id ? null : q.id;
            this.updateTracker(p);
            void this.refresh();
          });
          row.querySelector('.q-abandon')?.addEventListener('click', async () => {
            const res = await this.network.request('quest:abandon', { questId: q.id });
            this.notify(res?.success ? `Quête abandonnée: ${q.name}` : res?.error ?? 'Impossible');
            if (this.trackedQuestId === q.id) { this.trackedQuestId = null; this.updateTracker(null); }
            void this.refresh();
          });
          if (this.trackedQuestId === q.id) this.updateTracker(p);
          body.appendChild(row);
        }
      }
      // Phase C V3: section Terminées (journal complet)
      try {
        const done = await this.network.request<{ success: boolean; quests?: any[] }>('quest:get_completed', {});
        if (done.success && done.quests?.length) {
          const sec = document.createElement('div');
          sec.className = 'q-section';
          sec.textContent = `Terminées (${done.quests.length})`;
          body.appendChild(sec);
          for (const q of done.quests.slice(0, 30)) {
            const row = document.createElement('div');
            row.className = 'q-row';
            row.innerHTML = `<span class="q-name" style="color:#7fa76f">✔ ${q.name ?? (q.quest ?? {}).name ?? q.id}</span>`;
            body.appendChild(row);
          }
        }
      } catch { /* optionnel */ }
      if (!body.children.length) {
        body.innerHTML = '<div class="q-obj">Aucune quête — parlez aux PNJ de quête (L: journal) !</div>';
      }
    } catch { /* silencieux */ }
  }

  /** Widget HUD de suivi d'objectif (une quête à la fois, façon SRO). */
  private updateTracker(p: { quest?: any; objectives?: any[]; progress?: Record<string, number> } | null): void {
    let el = document.getElementById('quest-tracker');
    if (!p) { el?.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'quest-tracker';
      el.style.cssText = 'position:fixed;top:200px;right:12px;z-index:590;background:rgba(10,12,18,0.72);' +
        'border:1px solid #55461f;border-radius:6px;padding:6px 10px;pointer-events:none;max-width:250px;';
      document.body.appendChild(el);
    }
    const q = p.quest ?? p;
    const objectives = (q.objectives ?? p.objectives ?? []) as any[];
    const progressData = p.progress ?? {};
    const lines = objectives.map((o, i) => {
      const cur = Math.min(progressData[i] ?? 0, o.count);
      return `<div style="color:#a9b6d6;font-size:11px;">${o.targetName ?? o.targetId} ${cur}/${o.count}${cur >= o.count ? ' ✓' : ''}</div>`;
    }).join('');
    el.innerHTML = `<div style="color:#ffd700;font-size:11px;font-weight:600;">${q.name ?? 'Quête'}</div>${lines}`;
  }

  /** Rafraîchissement temps réel (progress/complétion pendant le jeu). */
  bindLiveRefresh(): void {
    const net = (this as unknown as { network: { onRaw?: (ev: string, cb: (d: any) => void) => void; on?: (ev: string, cb: (d: any) => void) => void } }).network;
    const hook = (ev: string) => net.on?.(ev, () => {
      if (this.visible) void this.refresh();
    });
    hook('quest:progress');
    hook('quest:completed');
  }
}
