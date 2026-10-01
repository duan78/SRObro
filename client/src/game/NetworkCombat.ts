/**
 * SRObro - NetworkCombat (phase 2, client)
 * Rendu des entités serveur (monstres), ciblage, auto-attaque, skills,
 * dégâts, HUD réseau, mort/résurrection et loot — le serveur reste
 * autoritaire, ce module n'est qu'une vue + entrées.
 */

import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import type { NetworkManager } from '../network/NetworkManager';
import type { AssetLoader } from '../core/AssetLoader';
import type { DomHud } from '../ui/dom/DomHud';
import { AnimationService } from '../animation/BanAnimationService';
import { DamageNumberManager, DamageType } from '../combat/DamageNumberManager';
import type { JanganZone } from '../zones/jangan/JanganZone';

interface ServerMonster {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  position: { x: number; y: number; z: number };
  rotation: number;
}

interface GroundItem {
  droppedItemId: string;
  name: string;
  quantity: number;
  position: { x: number; y: number; z: number };
}

interface PlayerNetworkState {
  hp: number; maxHp: number; mp: number; maxMp: number;
  level: number; exp: number; nextLevelExp: number;
  sp: number; gold: number; str: number; int: number; statPoints: number;
}

// Skills affichés (codes officiels; paramètres appliqués côté serveur)
interface HotbarSkill {
  code: string;
  label: string;
  key: string;
  mpCost: number;
  cooldownMs: number;
}
const HOTBAR: HotbarSkill[] = [
  { code: 'SKILL_CH_SWORD_SMASH_A_01', label: 'Frappe', key: '1', mpCost: 5, cooldownMs: 3000 },
  { code: 'SKILL_CH_SWORD_SMASH_B_01', label: 'Taillade', key: '2', mpCost: 12, cooldownMs: 8000 },
  { code: 'SKILL_CH_SWORD_CHAIN_A_1S_01', label: 'Enchaînement', key: '3', mpCost: 9, cooldownMs: 6000 },
];

export class NetworkCombat {
  private scene: Scene;
  private network: NetworkManager;
  private assetLoader: AssetLoader;
  private hud: DomHud;
  private janganZone: JanganZone | null;
  private damageNumbers: DamageNumberManager;

  // Entités
  private monsters = new Map<string, {
    data: ServerMonster;
    root: any; // TransformNode racine du modèle officiel
    proxy: any; // mesh de picking invisible
    animState: string | null; // état d'anim courant (évite les rechargements)
  }>();
  private groundItems = new Map<string, GroundItem & { mesh: any }>();

  // Ciblage / combat
  private targetId: string | null = null;
  private autoAttackTimer: number | null = null;
  private skillCooldowns = new Map<string, number>(); // code -> fin de cooldown (ms)

  // État réseau du joueur (source HUD quand connecté)
  playerState: PlayerNetworkState | null = null;

  // Écran de mort
  private deathOverlay: HTMLElement | null = null;

  // Anti-spam network
  private lastAttackSent = 0;

  constructor(
    scene: Scene,
    network: NetworkManager,
    assetLoader: AssetLoader,
    hud: DomHud,
    janganZone: JanganZone | null,
  ) {
    this.scene = scene;
    this.network = network;
    this.assetLoader = assetLoader;
    this.hud = hud;
    this.janganZone = janganZone;
    this.damageNumbers = new DamageNumberManager(scene);

    this.registerHandlers();
    this.setupInput();

    // Le monde 3D se charge longtemps APRÈS la sélection du perso: redemander
    // l'état du monde à la création de ce module (les premiers spawn packets
    // ont été émis pendant le chargement, avant que ce module existe).
    if (this.network.getIsConnected()) {
      void this.network.request('world:snapshot', {}, 15000).catch(() => undefined);
    }
    console.log('[NetworkCombat] initialisé');
  }

  // ============================================
  // RÉSEAU: événements serveur → vue
  // ============================================

  private registerHandlers(): void {
    this.network.on('spawn', (data: any) => {
      const d = data?.data?.entityType ? data.data : data;
      if (d?.entityType === 'monster') {
        void this.spawnMonster(d as ServerMonster);
      }
    });

    this.network.on('despawn', (data: any) => {
      const d = data?.data?.id ? data.data : data;
      this.despawnMonster(d.id);
    });

    this.network.on('update', (data: any) => {
      const d = data?.data?.id ? data.data : data;
      const m = this.monsters.get(d?.id);
      if (m && d.position) {
        const terrain = this.janganZone?.realTerrain;
        const y = terrain ? terrain.heightAt(d.position.x, d.position.z) : d.position.y;
        // Interpolation légère: va au point serveur (tick 20 Hz ≈ fluide)
        m.root.position.set(d.position.x, y, d.position.z);
        if (typeof d.rotation === 'number') m.root.rotation.y = d.rotation;
        m.proxy.position.set(d.position.x, y + 0.7, d.position.z);
        if (typeof d.rotation === 'number') m.proxy.rotation.y = d.rotation;
        const wantedState = d.state === 'aggro' || d.state === 'attack' ? 'run' : 'walk';
        if (m.animState !== wantedState) {
          m.animState = wantedState;
          this.switchMonsterAnim(m, wantedState);
        }
      }
    });

    this.network.on('attack', (data: any) => {
      const d = data?.data ?? data;
      if (!d?.targetId) return;
      // Mise à jour des HP de la cible (monstre) pour barre/target frame
      if (typeof d.remainingHp === 'number') {
        this.syncMonsterHp(d.targetId, d.remainingHp);
      }
      const m = this.monsters.get(d.targetId);
      // Nombre de dégâts au point de la cible (monstre ou joueur)
      if (m) {
        this.damageNumbers.showDamage(
          d.damage,
          m.root.position.add(new Vector3(0, 1.5, 0)),
          d.isCritical ? DamageType.CRITICAL : DamageType.PHYSICAL,
        );
        // Anim d'attaque de l'attaquant si c'est un monstre visible
        const attacker = this.monsters.get(d.attackerId);
        if (attacker) this.switchMonsterAnim(attacker, 'attack01', true);
      } else if (d.targetId === 'player' || this.isLocalPlayerTarget(d)) {
        // Dégâts sur le joueur: nombre au-dessus du perso
        const player = this.scene.getTransformNodeByName('player_root')
          ?? (this.scene.meshes.find((mm) => mm.name.startsWith('chinaman_')));
        const anchor = player ? player.getAbsolutePosition() : Vector3.Zero();
        this.damageNumbers.showDamage(d.damage, anchor.add(new Vector3(0, 2, 0)), d.isCritical ? DamageType.CRITICAL : DamageType.PHYSICAL);
      }
    });

    this.network.on('player:state', (data: any) => {
      const d = data?.data ?? data;
      this.playerState = d;
    });

    this.network.on('level_up', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`Niveau ${d.newLevel} atteint !`, 'system');
    });

    this.network.on('xp_gain', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`+${d.amount} XP`, 'combat');
    });

    this.network.on('player:death', (data: any) => {
      this.showDeathScreen();
    });

    this.network.on('player:respawned', () => {
      this.hideDeathScreen();
    });

    this.network.on('skill_rejected', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`${d.reason}${d.remainingMs ? ` (${Math.ceil(d.remainingMs / 1000)}s)` : ''}`, 'system');
    });

    this.network.on('drop_item', (data: any) => {
      const d = data?.data ?? data;
      this.spawnGroundItem(d);
    });

    this.network.on('remove_dropped_item', (data: any) => {
      const d = data?.data ?? data;
      this.removeGroundItem(d?.droppedItemId ?? d?.id);
    });

    this.network.on('pickup_success', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`Ramassé: ${d?.itemData?.name ?? 'objet'}`, 'system');
      this.removeGroundItem(d?.itemData?.droppedItemId);
    });
  }

  private isLocalPlayerTarget(_d: any): boolean {
    // Le serveur cible le joueur local par son characterId; en l'absence de
    // décorateur mesh joueur on affiche au centre-bas — suffisant en MVP.
    return true;
  }

  // ============================================
  // RENDU DES MONSTRES SERVEUR
  // ============================================

  private async spawnMonster(data: ServerMonster): Promise<void> {
    if (this.monsters.has(data.id)) return;
    const terrain = this.janganZone?.realTerrain;
    const y = terrain ? terrain.heightAt(data.position.x, data.position.z) : data.position.y;

    // Entrée immédiate (mesh placeholder léger en attendant le modèle)
    const root = MeshBuilder.CreateBox(`netmob_${data.id}`, { size: 0.8 }, this.scene);
    root.position.set(data.position.x, y + 0.4, data.position.z);
    root.rotation.y = data.rotation ?? 0;
    root.isPickable = true;
    root.metadata = { netMonsterId: data.id };
    const mat = new StandardMaterial(`netmob_mat_${data.id}`, this.scene);
    mat.diffuseColor = new Color3(0.7, 0.25, 0.2);
    root.material = mat;

    // Proxy de picking invisible: les meshes skinées GLTF se pickent en bind
    // pose (loin de la position visuelle) — un volume simple suit la racine.
    const proxy = MeshBuilder.CreateBox(`netmobproxy_${data.id}`, { width: 1.4, depth: 1.8, height: 1.4 }, this.scene);
    proxy.position.set(data.position.x, y + 0.7, data.position.z);
    proxy.isVisible = false;
    proxy.isPickable = true;
    proxy.metadata = { netMonsterId: data.id };

    this.monsters.set(data.id, { data, root, proxy, animState: null });

    // Modèle officiel (multi-parties skinées) en arrière-plan
    try {
      const stem = (data as any).modelId ?? data.name.toLowerCase();
      const loaded = await this.assetLoader.loadGameObject(stem);
      if (loaded?.root && this.monsters.has(data.id)) {
        loaded.root.position.set(data.position.x, y, data.position.z);
        loaded.root.rotation.y = data.rotation ?? 0;
        for (const child of loaded.root.getChildMeshes()) {
          child.metadata = { netMonsterId: data.id };
          child.isPickable = true;
        }
        // Remplace le placeholder
        const old = this.monsters.get(data.id)!;
        old.root.dispose();
        old.root = loaded.root;
        // Anim walk par défaut
        const skeletons = (loaded as any).skeletons as any[] | undefined;
        if (skeletons && skeletons.length > 0) {
          AnimationService.loadAndPlay(this.scene, skeletons, AnimationService.monsterClip(stem, 'walk'), true, 1.0)
            .catch(() => undefined);
        }
      }
    } catch {
      // Placeholder conservé: le combat reste jouable sans le modèle
    }
  }

  private despawnMonster(id: string): void {
    const m = this.monsters.get(id);
    if (!m) return;
    m.root.dispose();
    m.proxy.dispose();
    this.monsters.delete(id);
    if (this.targetId === id) this.clearTarget();
  }

  private switchMonsterAnim(m: { data: ServerMonster; root: any; animState: string | null }, state: string, once = false): void {
    if (!once) m.animState = state;
    const skeletons: any[] = [];
    for (const mesh of m.root.getChildMeshes()) {
      const sk = (mesh as any).skeleton;
      if (sk && !skeletons.includes(sk)) skeletons.push(sk);
    }
    if (skeletons.length === 0) return;
    const stem = (m.data as any).modelId ?? m.data.name.toLowerCase();
    const clip = AnimationService.monsterClip(stem, state === 'attack01' ? 'attack01' : 'walk');
    AnimationService.loadAndPlay(this.scene, skeletons, clip, !once, once ? 1.4 : 1.0)
      .then((groups: any[]) => {
        if (once) {
          // Retour au walk après l'attaque
          setTimeout(() => {
            for (const g of groups) { g.stop(); g.dispose(); }
            this.switchMonsterAnim(m, 'walk');
          }, 1200);
        }
      })
      .catch(() => undefined);
  }

  // ============================================
  // LOOT AU SOL
  // ============================================

  private spawnGroundItem(d: GroundItem): void {
    if (!d || this.groundItems.has(d.droppedItemId)) return;
    const terrain = this.janganZone?.realTerrain;
    const y = terrain ? terrain.heightAt(d.position.x, d.position.z) : (d.position.y ?? 0);
    const mesh = MeshBuilder.CreateBox(`loot_${d.droppedItemId}`, { size: 0.45 }, this.scene);
    mesh.position.set(d.position.x, y + 0.25, d.position.z);
    mesh.isPickable = true;
    mesh.metadata = { lootId: d.droppedItemId };
    const mat = new StandardMaterial(`loot_mat_${d.droppedItemId}`, this.scene);
    mat.diffuseColor = new Color3(1, 0.85, 0.2);
    mat.emissiveColor = new Color3(0.35, 0.28, 0.05);
    mesh.material = mat;
    this.groundItems.set(d.droppedItemId, { ...d, mesh });
  }

  private removeGroundItem(id?: string): void {
    if (!id) return;
    const it = this.groundItems.get(id);
    if (it) {
      it.mesh.dispose();
      this.groundItems.delete(id);
    }
  }

  // ============================================
  // ENTRÉES: clics ciblage / ramassage, touches skills
  // ============================================

  private setupInput(): void {
    const canvas = this.scene.getEngine().getRenderingCanvas();
    if (!canvas) return;

    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || !this.network.getIsConnected()) return;
      const rect = canvas.getBoundingClientRect();
      const pick = this.scene.pick(e.clientX - rect.left, e.clientY - rect.top, (m) => m.isPickable);
      if (!pick?.hit || !pick.pickedMesh) return;

      const netMonsterId = this.findNetMonsterId(pick.pickedMesh);
      if (netMonsterId) {
        this.selectTarget(netMonsterId);
        return;
      }
      const lootId = (pick.pickedMesh.metadata as any)?.lootId;
      if (lootId) {
        this.network.sendPickupItem(lootId);
        return;
      }
      // Clic sol sans cible: déciblage (le click-to-move est géré par Game)
      this.clearTarget();
    });

    window.addEventListener('keydown', (e) => {
      if (!this.network.getIsConnected()) return;
      if (e.key === 'Escape') {
        this.clearTarget();
        return;
      }
      const skill = HOTBAR.find((s) => s.key === e.key);
      if (skill) {
        this.useSkill(skill);
      }
    });
  }

  private findNetMonsterId(mesh: any): string | null {
    let node = mesh;
    while (node) {
      const id = node.metadata?.netMonsterId;
      if (id) return id as string;
      node = node.parent;
    }
    return null;
  }

  // ============================================
  // CIBLAGE + AUTO-ATTAQUE
  // ============================================

  selectTarget(monsterId: string): void {
    const m = this.monsters.get(monsterId);
    if (!m) return;
    this.targetId = monsterId;
    this.hud.showTarget({ name: m.data.name, level: m.data.level, hp: m.data.hp, maxHp: m.data.maxHp });
    this.hud.addChatMessage(`Cible: ${m.data.name} (niv. ${m.data.level})`, 'combat');
    this.startAutoAttack();
  }

  clearTarget(): void {
    this.targetId = null;
    this.stopAutoAttack();
    this.hud.showTarget(null);
  }

  private startAutoAttack(): void {
    this.stopAutoAttack();
    this.autoAttackTimer = window.setInterval(() => {
      if (!this.targetId || !this.network.getIsConnected()) {
        this.stopAutoAttack();
        return;
      }
      const m = this.monsters.get(this.targetId);
      if (!m || m.data.hp <= 0) {
        this.clearTarget();
        return;
      }
      const now = Date.now();
      if (now - this.lastAttackSent < 1100) return; // ~1 attaque/s
      this.lastAttackSent = now;
      this.network.sendAttack(this.targetId);
    }, 1000);
  }

  private stopAutoAttack(): void {
    if (this.autoAttackTimer !== null) {
      clearInterval(this.autoAttackTimer);
      this.autoAttackTimer = null;
    }
  }

  private useSkill(skill: HotbarSkill): void {
    if (!this.targetId) {
      this.hud.addChatMessage('Aucune cible', 'system');
      return;
    }
    const now = Date.now();
    const ready = this.skillCooldowns.get(skill.code) ?? 0;
    if (now < ready) {
      this.hud.addChatMessage(`${skill.label}: cooldown ${Math.ceil((ready - now) / 1000)}s`, 'system');
      return;
    }
    this.skillCooldowns.set(skill.code, now + skill.cooldownMs);
    this.network.send({
      type: 'cast_skill',
      timestamp: now,
      data: { targetId: this.targetId, skillId: skill.code },
    } as any);
    this.hud.addChatMessage(`${skill.label}!`, 'combat');
  }

  // ============================================
  // HUD: états réseau → affichage
  // ============================================

  /** Rafraîchit le HUD depuis l'état réseau (appelé par main.ts). */
  refreshHud(): void {
    const ps = this.playerState;
    if (!ps) return;
    this.hud.setStats({
      name: this.playerName,
      level: ps.level,
      hp: ps.hp,
      maxHp: ps.maxHp,
      mp: ps.mp,
      maxMp: ps.maxMp,
      exp: ps.exp,
      maxExp: ps.nextLevelExp,
      gold: ps.gold,
    });
    // Cible: HP à jour depuis les attaques (null force le cadre à disparaître
    // — sinon l'ancien système local affiche "Monster" par défaut)
    if (this.targetId) {
      const m = this.monsters.get(this.targetId);
      if (m) {
        this.hud.showTarget({ name: m.data.name, level: m.data.level, hp: m.data.hp, maxHp: m.data.maxHp });
      } else {
        this.hud.showTarget(null);
      }
    } else {
      this.hud.showTarget(null);
    }
  }

  playerName = 'Aventurier';

  /** Nom des skills pour l'affichage hotbar (F1..F10 → 1..3 utilisables). */
  static get hotbarSkills(): HotbarSkill[] {
    return HOTBAR;
  }

  // ============================================
  // ÉCRAN DE MORT
  // ============================================

  private showDeathScreen(): void {
    if (this.deathOverlay) return;
    this.stopAutoAttack();
    const el = document.createElement('div');
    el.id = 'death-screen';
    el.innerHTML = `
      <style>
        #death-screen {
          position: fixed; inset: 0; z-index: 3000;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, rgba(60,8,8,0.82), rgba(10,2,2,0.94));
          color: #f0e6d2; font-family: 'Segoe UI', sans-serif;
        }
        .death-title { font-size: 3rem; font-weight: bold; color: #d04545;
          text-shadow: 0 0 30px rgba(208,69,69,0.6); margin-bottom: 8px; }
        .death-sub { color: #c9a98a; margin-bottom: 30px; }
        .death-btn {
          display: block; width: 320px; box-sizing: border-box; margin: 8px 0; padding: 12px 0;
          cursor: pointer; font-size: 1rem;
          background: linear-gradient(180deg, #d8b54a, #8f751d);
          border: 1px solid #ffd700; border-radius: 3px; color: #1c1405; font-weight: 600;
        }
        .death-btn.secondary { background: linear-gradient(180deg, #2c3050, #1a1f38);
          border-color: #5560a0; color: #cdd5f5; }
        .death-btn:hover { filter: brightness(1.15); }
      </style>
      <div class="death-title">Vous êtes mort</div>
      <div class="death-sub">Résurrection en ville (gratuite) ou sur place (−2% XP)</div>
      <button class="death-btn" id="respawn-town">Résurrecter en ville</button>
      <button class="death-btn secondary" id="respawn-here">Sur place (pénalité d'XP)</button>
    `;
    document.body.appendChild(el);
    this.deathOverlay = el;
    el.querySelector('#respawn-town')?.addEventListener('click', () => {
      this.network.send({ type: 'player:respawn', timestamp: Date.now(), data: { mode: 'town' } } as any);
    });
    el.querySelector('#respawn-here')?.addEventListener('click', () => {
      this.network.send({ type: 'player:respawn', timestamp: Date.now(), data: { mode: 'here' } } as any);
    });
  }

  private hideDeathScreen(): void {
    this.deathOverlay?.remove();
    this.deathOverlay = null;
    this.hud.addChatMessage('Résurrection réussie', 'system');
  }

  // ============================================
  // UPDATE (appele chaque frame par Game)
  // ============================================

  update(): void {
    // Animation douce du loot (rotation)
    const t = performance.now() / 1000;
    for (const item of this.groundItems.values()) {
      item.mesh.rotation.y = t;
      item.mesh.position.y += Math.sin(t * 2 + item.mesh.position.x) * 0.0015;
    }
  }

  /** Nettoyage des cibles mortes (HP reçu via packets d'attaque). */
  syncMonsterHp(targetId: string, remainingHp: number): void {
    const m = this.monsters.get(targetId);
    if (m) m.data.hp = remainingHp;
  }

  dispose(): void {
    this.stopAutoAttack();
    this.hideDeathScreen();
    for (const m of this.monsters.values()) { m.root.dispose(); m.proxy.dispose(); }
    this.monsters.clear();
    for (const it of this.groundItems.values()) it.mesh.dispose();
    this.groundItems.clear();
    this.damageNumbers.dispose();
  }
}
