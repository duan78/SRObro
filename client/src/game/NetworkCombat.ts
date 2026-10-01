/**
 * SRObro - NetworkCombat (phase 2, client)
 * Rendu des entités serveur (monstres), ciblage, auto-attaque, skills,
 * dégâts, HUD réseau, mort/résurrection et loot — le serveur reste
 * autoritaire, ce module n'est qu'une vue + entrées.
 */

import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3, DynamicTexture, Mesh } from '@babylonjs/core';
import type { NetworkManager } from '../network/NetworkManager';
import type { AssetLoader } from '../core/AssetLoader';
import type { DomHud } from '../ui/dom/DomHud';
import { AnimationService } from '../animation/BanAnimationService';
import { DamageNumberManager, DamageType } from '../combat/DamageNumberManager';
import { gameAudio } from '../ui/dom/GameAudio';
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
  level: number; exp: number; nextLevelExp: number; levelBaseExp?: number;
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
  // Joueurs distants (phase 5): rendus avec le modèle officiel
  private remotePlayers = new Map<string, {
    data: { id: string; name: string; level: number; gender: string };
    root: any;
    animState: string | null;
  }>();

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
    // Reconnexion: les entités du serveur précédent sont mortes avec lui —
    // purger les monstres/cibles fantômes (le snapshot renvoie les vrais).
    this.network.on('connected', () => {
      for (const m of this.monsters.values()) { m.root.dispose(); m.proxy.dispose(); }
      this.monsters.clear();
      this.clearTarget();
      for (const it of this.groundItems.values()) it.mesh.dispose();
      this.groundItems.clear();
      for (const rp of this.remotePlayers.values()) rp.root.dispose();
      this.remotePlayers.clear();
    });

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
      // Joueur distant: position + anim de marche
      const rp = this.remotePlayers.get(d?.id);
      if (rp && d.position) {
        const terrain2 = this.janganZone?.realTerrain;
        const y2 = terrain2 ? terrain2.heightAt(d.position.x, d.position.z) : d.position.y;
        rp.root.position.set(d.position.x, y2, d.position.z);
        if (typeof d.rotation === 'number') rp.root.rotation.y = d.rotation;
        if (rp.animState !== 'walk') {
          rp.animState = 'walk';
          const skeletons: any[] = [];
          for (const mesh of rp.root.getChildMeshes()) {
            const sk = (mesh as any).skeleton;
            if (sk && !skeletons.includes(sk)) skeletons.push(sk);
          }
          if (skeletons.length > 0) {
            AnimationService.loadAndPlay(this.scene, skeletons, AnimationService.playerClip('walkforward'), true, 1.0)
              .catch(() => undefined);
          }
        }
        return;
      }
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
        // SFX (phase 7): coup porté/reçu (le son de mort est dans playMonsterDeath)
        if (d.damage > 0 && d.remainingHp > 0) {
          if (this.monsters.has(d.attackerId)) gameAudio.monsterHurt();
          else gameAudio.swordHit();
        }
        // Anim de dégâts + mort de la cible monstre
        if (d.remainingHp > 0 && d.damage > 0) this.switchMonsterAnim(m, 'damage01', true);
        if (d.remainingHp <= 0) this.playMonsterDeath(m);
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

    this.network.on('player:respawned', (data: any) => {
      this.hideDeathScreen();
      // Téléporter le perso client à la position de résurrection (ville/ici)
      const d = data?.data ?? data;
      const player = this.scene.meshes.find((m) => m.name.startsWith('chinaman_'));
      if (player && d?.position) {
        const terrain = this.janganZone?.realTerrain;
        const y = terrain ? terrain.heightAt(d.position.x, d.position.z) : (d.position.y ?? 0);
        const root = (player.parent ?? player) as { position: { set(x: number, y: number, z: number): void } };
        root.position.set(d.position.x, y, d.position.z);
      }
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

    // Visuel de l'arme équipée (phase 3): attache le GLB officiel au perso
    this.network.onRaw('equipment:weapon', (d: any) => void this.attachWeaponVisual(d));

    // Chat sortant (phase 5): champ de saisie HUD → serveur
    this.hud.setupChatInput();
    this.hud.onChatSend = (message: string) => {
      if (!message) return;
      if (message.startsWith('/')) {
        // Les commandes slash passent par le canal chat (le serveur répond
        // en message système — pas de diffusion).
        this.network.sendChat(message, 'general');
      } else {
        this.network.sendChat(message, 'general');
      }
    };

    // Chat entrant (phase 5): affiché dans le HUD — les canaux système et
    // annonce s'affichent sans préfixe « Joueur: »
    this.network.on('chat', (data: any) => {
      const d = data?.data ?? data;
      if (d?.message) {
        if (d.channel === 'system') {
          this.hud.addChatMessage(d.message, 'system');
        } else if (d.channel === 'announce') {
          this.hud.addChatMessage(`📢 ${d.message}`, 'system');
        } else {
          this.hud.addChatMessage(`${d.playerName ?? 'Joueur'}: ${d.message}`, 'say');
        }
      }
    });

    // Téléport GM (/tp, console admin): recalage du personnage local
    this.network.onRaw('player:teleport', (d: any) => {
      const pos = d?.position ?? d;
      const player = this.scene.meshes.find((m) => m.name.startsWith('chinaman_'));
      if (player && pos) {
        const terrain = this.janganZone?.realTerrain;
        const y = terrain ? terrain.heightAt(pos.x, pos.z) : (pos.y ?? 0);
        const root = (player.parent ?? player) as { position: { set(x: number, y: number, z: number): void } };
        root.position.set(pos.x, y, pos.z);
      }
    });

    // Vitesse GM (/speed): propagée au contrôleur de déplacement
    this.network.onRaw('gm:speed', (d: any) => {
      const m = Number(d?.multiplier ?? 1);
      window.dispatchEvent(new CustomEvent('srobro:speed', { detail: m }));
    });

    // Joueurs distants (phase 5)
    this.network.onRaw('spawn_player', (d: any) => void this.spawnRemotePlayer(d));
    this.network.onRaw('despawn_player', (d: any) => {
      const id = (d && d.id) ?? d;
      const rp = this.remotePlayers.get(id);
      if (rp) { rp.root.dispose(); this.remotePlayers.delete(id); }
    });
  }

  /** Rend un autre joueur (modèle officiel chinaman/chinawoman + anim). */
  private async spawnRemotePlayer(data: any): Promise<void> {
    if (!data || this.remotePlayers.has(data.id)) return;
    const terrain = this.janganZone?.realTerrain;
    const y = terrain ? terrain.heightAt(data.position.x, data.position.z) : data.position.y;

    // Marqueur immédiat pendant le chargement du modèle
    const root = MeshBuilder.CreateCylinder(`netplayer_${data.id}`, { diameter: 0.7, height: 1.8 }, this.scene);
    root.position.set(data.position.x, y + 0.9, data.position.z);
    const mat = new StandardMaterial(`netplayer_mat_${data.id}`, this.scene);
    mat.diffuseColor = new Color3(0.3, 0.75, 0.4);
    root.material = mat;
    this.remotePlayers.set(data.id, { data, root, animState: null });
    this.hud.addChatMessage(`${data.name} (niv. ${data.level}) est en ligne`, 'system');

    // Modèle officiel
    try {
      const stem = data.gender === 'female' ? 'chinawoman_adventurer' : 'chinaman_adventurer';
      const loaded = await this.assetLoader.loadGameObject(stem);
      if (loaded?.root && this.remotePlayers.has(data.id)) {
        loaded.root.position.set(data.position.x, y, data.position.z);
        loaded.root.rotation.y = data.rotation ?? 0;
        const old = this.remotePlayers.get(data.id)!;
        old.root.dispose();
        old.root = loaded.root;
        const skeletons = (loaded as any).skeletons as any[] | undefined;
        if (skeletons && skeletons.length > 0) {
          AnimationService.loadAndPlay(this.scene, skeletons, AnimationService.playerClip('standcity'), true, 1.0)
            .catch(() => undefined);
        }
      }
    } catch { /* marqueur conservé */ }
  }

  /** Attache/détache le modèle d'arme officiel sur le personnage. */
  private async attachWeaponVisual(d: { itemCode: string; name: string } | null): Promise<void> {
    try {
      const old = this.scene.getTransformNodeByName('equipped_weapon');
      if (old) { old.dispose(); }

      if (!d) return;
      // bsr "item\china\weapon\blade_01.bsr" → stem "blade_01" (manifest)
      const stem = (d.itemCode || '').replace(/\\/g, '/').split('/').pop()?.replace(/\.bsr$/i, '') ?? '';
      if (!stem) return;
      const loaded = await this.assetLoader.loadGameObject(stem);
      if (loaded?.root) {
        loaded.root.name = 'equipped_weapon';
        const player = this.scene.meshes.find((m) => m.name.startsWith('chinaman_'));
        if (player?.parent) {
          loaded.root.parent = player.parent as any;
          loaded.root.position.set(0.35, 1.0, 0.1);
          loaded.root.scaling.setAll(1.0);
        }
        this.hud.addChatMessage(`${d.name} équipée`, 'system');
      }
    } catch (e) {
      console.warn('[NetworkCombat] visuel arme non chargé:', e);
    }
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
    // walk/idle ↔ boucle; attack01/damage01 ponctuels
    const action = state === 'attack01' || state === 'damage01' ? state : 'walk';
    const clip = AnimationService.monsterClip(stem, action as 'attack01' | 'damage01' | 'walk');
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

  /** Mort d'un monstre (phase 7): anim die01 si dispo, sinon affaissement. */
  private dyingMonsters = new Set<string>();
  private playMonsterDeath(m: { data: ServerMonster; root: any; proxy: any; animState: string | null }): void {
    if (this.dyingMonsters.has((m.data as any).id)) return;
    this.dyingMonsters.add((m.data as any).id);
    gameAudio.monsterDie();
    const skeletons: any[] = [];
    for (const mesh of m.root.getChildMeshes()) {
      const sk = (mesh as any).skeleton;
      if (sk && !skeletons.includes(sk)) skeletons.push(sk);
    }
    const stem = (m.data as any).modelId ?? m.data.name.toLowerCase();
    if (skeletons.length > 0) {
      const dieClip = AnimationService.monsterClip(stem, 'die');
      AnimationService.loadAndPlay(this.scene, skeletons, dieClip, false, 1.0)
        .then((groups: any[]) => {
          // Fin de l'anim: affaissement, le despawn serveur (~3 s) nettoie
          setTimeout(() => {
            for (const g of groups) { g.stop(); g.dispose(); }
            this.sinkMonster(m);
          }, 1500);
        })
        .catch(() => this.sinkMonster(m));
    } else {
      this.sinkMonster(m);
    }
  }

  /** Affaissement du corps sous le terrain (fallback mort). */
  private sinkMonster(m: { root: any }): void {
    const root = m.root;
    const start = root.position.y;
    const t0 = performance.now();
    const sink = (): void => {
      const k = Math.min(1, (performance.now() - t0) / 900);
      root.position.y = start - k * 2.2;
      if (k < 1 && !root.isDisposed()) requestAnimationFrame(sink);
    };
    requestAnimationFrame(sink);
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
      // PNJ (quêtes phase 4): interagit via QuestSystem
      const npcId = (pick.pickedMesh.metadata as any)?.npcId;
      if (npcId) {
        const qs = (window as unknown as { questSystem?: { interact(id: string): Promise<void> } }).questSystem;
        void qs?.interact(npcId);
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
    this.attachTargetLabel(m);
    this.startAutoAttack();
  }

  clearTarget(): void {
    this.targetId = null;
    this.stopAutoAttack();
    this.hud.showTarget(null);
    this.detachTargetLabel();
  }

  /** Étiquette flottante nom + niveau au-dessus de la cible (phase 7). */
  private targetLabel: { plane: any; texture: any } | null = null;
  private attachTargetLabel(m: { data: ServerMonster; root: any }): void {
    this.detachTargetLabel();
    try {
      const dt = new DynamicTexture(`target_label_${(m.data as any).id}`, { width: 512, height: 128 }, this.scene, false);
      dt.hasAlpha = true;
      const c = dt.getContext();
      c.clearRect(0, 0, 512, 128);
      c.fillStyle = 'rgba(10,12,18,0.72)';
      c.fillRect(56, 34, 400, 60);
      c.strokeStyle = 'rgba(220,190,120,0.9)';
      c.lineWidth = 3;
      c.strokeRect(56, 34, 400, 60);
      c.font = 'bold 34px sans-serif';
      c.fillStyle = '#f0e6d2';
      (c as any).textAlign = 'center';
      (c as any).textBaseline = 'middle';
      c.fillText(`${m.data.name}  Lv.${m.data.level}`, 256, 64);
      dt.update();

      const mat = new StandardMaterial(`target_label_mat_${(m.data as any).id}`, this.scene);
      mat.diffuseTexture = dt;
      mat.emissiveTexture = dt;
      mat.opacityTexture = dt;
      mat.disableLighting = true;
      mat.backFaceCulling = false;

      const plane = MeshBuilder.CreatePlane(`target_label_plane_${(m.data as any).id}`, { width: 3.2, height: 0.8 }, this.scene);
      plane.material = mat;
      plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
      plane.position.y = 2.4;
      plane.isPickable = false;
      m.root.addChild(plane);
      this.targetLabel = { plane, texture: dt };
    } catch {
      // L'étiquette est cosmétique: jamais bloquante
    }
  }

  private detachTargetLabel(): void {
    if (!this.targetLabel) return;
    try {
      this.targetLabel.plane.dispose(false, true);
      this.targetLabel.texture.dispose();
    } catch { /* déjà nettoyée */ }
    this.targetLabel = null;
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
      gameAudio.swordSwing();
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
    // XP cumulative (courbe officielle): la barre montre la progression
    // dans le niveau courant (exp − base) / (next − base).
    const base = ps.levelBaseExp ?? 0;
    const next = ps.nextLevelExp ?? (base + 100);
    this.hud.setStats({
      name: this.playerName,
      level: ps.level,
      hp: ps.hp,
      maxHp: ps.maxHp,
      mp: ps.mp,
      maxMp: ps.maxMp,
      exp: Math.max(0, ps.exp - base),
      maxExp: Math.max(1, next - base),
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
