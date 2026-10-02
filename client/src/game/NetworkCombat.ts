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
import { SkillEffectManager } from '../effects/SkillEffectManager';
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
// Hotbar de DÉMARRAGE (CH) — remplacée dynamiquement par les skills appris
// (skills:available, Phase C) dès la connexion: touches 1-8.
const STARTER_HOTBAR: HotbarSkill[] = [
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
  // Joueurs distants (phase 5): rendus avec le modèle officiel.
  // `target` = dernière position/rotation serveur: le rendu INTERPOLE vers
  // elle chaque frame (les packets arrivent à ~5 Hz, un snap direct donne
  // l'effet téléportation).
  private remotePlayers = new Map<string, {
    data: { id: string; name: string; level: number; gender: string };
    root: any;
    animState: string | null;
    target: { x: number; z: number; rot: number } | null;
  }>();

  private monsters = new Map<string, {
    data: ServerMonster;
    root: any; // TransformNode racine du modèle officiel
    proxy: any; // mesh de picking invisible
    animState: string | null; // état d'anim courant (évite les rechargements)
    netState: string | null; // aiState serveur du dernier packet (aggro/attack…)
    target: { x: number; z: number; rot: number } | null;
  }>();

  /** Hotbar courante (skills appris, touches 1-8). */
  private hotbar: HotbarSkill[] = [...STARTER_HOTBAR];
  private groundItems = new Map<string, GroundItem & { mesh: any }>();

  // Ciblage / combat
  private targetId: string | null = null;
  private autoAttackTimer: number | null = null;
  private skillCooldowns = new Map<string, number>(); // code -> fin de cooldown (ms)

  // État réseau du joueur (source HUD quand connecté)
  playerState: PlayerNetworkState | null = null;

  /** Genre du perso local (clips d'attaque/réaction dédiés chinawoman). */
  playerGender = false;
  /** Mort du perso local: verrouille le déplacement jusqu'au respawn. */
  playerDead = false;
  /** Famille d'armes équipée → clips de combo (skill_ch_<famille>_chain_*). */
  private equippedFamily: 'sword' | 'spear' | 'bow' = 'sword';
  /** Compteur de combo: fait tourner les chaînes a → b → c comme en jeu. */
  private attackCombo = 0;
  /** Génération des anims one-shot (attaque/réaction): une obsolète ne doit
   * pas « reprendre » les anims d'état après une plus récente. */
  private oneShotGen = 0;

  // Écran de mort
  private deathOverlay: HTMLElement | null = null;

  // Anti-spam network
  private lastAttackSent = 0;

  // Effets visuels des skills (cast + impact + critiques)
  private vfx: SkillEffectManager;
  private lastSkillCast: { label: string; code: string; at: number } | null = null;

  /** Accès au mesh du JOUEUR LOCAL (source de vérité, jamais par nom). */
  private getPlayerMesh: () => import('@babylonjs/core/Meshes/transformNode').TransformNode | null;

  constructor(
    scene: Scene,
    network: NetworkManager,
    assetLoader: AssetLoader,
    hud: DomHud,
    janganZone: JanganZone | null,
    getPlayerMesh?: () => import('@babylonjs/core/Meshes/transformNode').TransformNode | null,
  ) {
    this.scene = scene;
    this.network = network;
    this.assetLoader = assetLoader;
    this.hud = hud;
    this.janganZone = janganZone;
    // ⚠️ Ne pas chercher le joueur par nom « chinaman_* »: PNJ et joueurs
    // distants partagent les mêmes modèles (chinaman_adventurer___root__) —
    // les handlers téléportaient un PNJ à la place du perso.
    this.getPlayerMesh = getPlayerMesh ?? (() => null);
    this.damageNumbers = new DamageNumberManager(scene);
    this.vfx = new SkillEffectManager(scene);

    this.registerHandlers();
    this.setupInput();

    // Energy of Life (phase C V3): touche B, 1×/20 min dès le titre Knight
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        void this.network.request('zerk:energy', {}, 8000)
          .then((r: any) => { if (!r?.success && r?.error) this.hud.addChatMessage(r.error, 'system'); })
          .catch(() => undefined);
      }
    });

// Le monde 3D se charge longtemps APRÈS la sélection du perso: redemander
    // l'état du monde à la création de ce module (les premiers spawn packets
    // ont été émis pendant le chargement, avant que ce module existe).
    if (this.network.getIsConnected()) {
      void this.network.request('world:snapshot', {}, 15000).catch(() => undefined);
      // Hotbar dynamique depuis les skills appris (Phase C)
      setTimeout(() => void this.refreshHotbar(), 2000);
      // Apparence (le packet de login part avant nos handlers): re-demander
      setTimeout(() => void this.network.request('equipment:request', {}, 8000).catch(() => undefined), 1500);
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
      // Joueur distant: on mémorise la cible, l'interpolation (update) fait
      // le déplacement fluide et bascule walk/idle à la convergence.
      const rp = this.remotePlayers.get(d?.id);
      if (rp && d.position) {
        if (!rp.target) {
          // Premier packet: pose directe (sinon il traverserait la carte)
          const terrain2 = this.janganZone?.realTerrain;
          const y2 = terrain2 ? terrain2.heightAt(d.position.x, d.position.z) : d.position.y;
          rp.root.position.set(d.position.x, y2, d.position.z);
        }
        rp.target = { x: d.position.x, z: d.position.z, rot: typeof d.rotation === 'number' ? d.rotation : 0 };
        return;
      }
      const m = this.monsters.get(d?.id);
      if (m && d.position) {
        if (!m.target) {
          const terrain = this.janganZone?.realTerrain;
          const y = terrain ? terrain.heightAt(d.position.x, d.position.z) : d.position.y;
          m.root.position.set(d.position.x, y, d.position.z);
        }
        m.target = { x: d.position.x, z: d.position.z, rot: typeof d.rotation === 'number' ? d.rotation : 0 };
        m.netState = d.state ?? m.netState;
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
          m.root.position.add(new Vector3(0, 13, 0)),
          d.isCritical ? DamageType.CRITICAL : DamageType.PHYSICAL,
        );
        // VFX d'impact: skill récent du joueur → burst élémentaire (double en
        // critique), sinon coup blanc → petit éclat d'arme
        const fromLocalPlayer = !this.monsters.has(d.attackerId) && !this.remotePlayers.has(d.attackerId);
        // Le perso local joue sa chaîne de combo officielle sur coup confirmé
        if (fromLocalPlayer) this.playLocalAttackAnim();
        if (fromLocalPlayer && d.damage > 0) {
          const impactPos = m.root.position.add(new Vector3(0, 11, 0));
          const skillHit = this.lastSkillCast && Date.now() - this.lastSkillCast.at < 1200;
          if (skillHit) {
            this.vfx.playEffect(this.vfxElement(this.lastSkillCast!.code, this.lastSkillCast!.label), impactPos);
            if (d.isCritical) this.vfx.playEffect('slash', impactPos);
          } else {
            this.vfx.playEffect('slash', impactPos);
          }
        }
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
        // Dégâts sur le joueur: réaction officielle (behardhit/benormalhit)
        // + nombre au-dessus du perso (hauteur SRO ~tête)
        this.playLocalOneShot(AnimationService.hitClip(!!d.isCritical || d.damage > 20, this.playerGender), 1.2);
        const player = this.getPlayerMesh() ?? this.scene.getTransformNodeByName('player_root');
        const anchor = player ? player.getAbsolutePosition() : Vector3.Zero();
        this.damageNumbers.showDamage(d.damage, anchor.add(new Vector3(0, 17, 0)), d.isCritical ? DamageType.CRITICAL : DamageType.PHYSICAL);
      }
    });

    this.network.on('player:state', (data: any) => {
      const d = data?.data ?? data;
      this.playerState = d;
    });

    this.network.on('level_up', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`Niveau ${d.newLevel} atteint !`, 'system');
      // SFX officiel de level-up (phase G V3)
      import('../ui/dom/GameAudio.js').then(({ gameAudio }) => gameAudio.levelUp()).catch(() => undefined);
    });

    this.network.on('xp_gain', (data: any) => {
      const d = data?.data ?? data;
      this.hud.addChatMessage(`+${d.amount} XP`, 'combat');
    });

    this.network.on('player:death', (data: any) => {
      // Phase A V3: anim officielle de chute (downdie), sans reprise des
      // anims d'état — le perso reste au sol jusqu'au respawn.
      this.playerDead = true;
      this.playLocalOneShot(AnimationService.deathClip(this.playerGender), 1.0, { noResume: true });
      this.showDeathScreen();
    });

    this.network.on('player:respawned', (data: any) => {
      this.hideDeathScreen();
      this.playerDead = false;
      // Reprise des anims d'état (idle) — le downdie les avait laissées en pause
      window.dispatchEvent(new CustomEvent('srobro:player-appearance'));
      // Téléporter le perso client à la position de résurrection (ville/ici)
      const d = data?.data ?? data;
      const player = this.getPlayerMesh();
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
    // Apparence complète (login + chaque équipement/déséquipement)
    this.network.onRaw('equipment:full', (d: any) => void this.applyEquipmentVisual(d));

    // Chat sortant (phase 5): champ de saisie HUD → serveur
    this.hud.setupChatInput();
    this.hud.onChatSend = (message: string) => {
      if (!message) return;
      // Préfixes de canal sociaux (phase D V3): /p party, /g guilde,
      // /u union, /w nom whisper — le reste part en general (commandes
      // slash incluses: le serveur répond en message système).
      const m = message.match(/^\/(p|g|u)\s+(.+)$/i);
      if (m) {
        const channel = m[1].toLowerCase() === 'p' ? 'party' : m[1].toLowerCase() === 'g' ? 'guild' : 'union';
        this.network.sendChat(m[2], channel);
        return;
      }
      this.network.sendChat(message, 'general');
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
        } else if (d.channel === 'party') {
          this.hud.addChatMessage(`[Groupe] ${d.playerName ?? ''}: ${d.message}`, 'party');
        } else if (d.channel === 'guild') {
          this.hud.addChatMessage(`[Guilde] ${d.playerName ?? ''}: ${d.message}`, 'guild');
        } else if (d.channel === 'union') {
          this.hud.addChatMessage(`[Union] ${d.playerName ?? ''}: ${d.message}`, 'union');
        } else if (d.channel === 'whisper') {
          this.hud.addChatMessage(`[Chuchoté] ${d.playerName ?? ''}: ${d.message}`, 'whisper');
        } else if (d.channel === 'whisper_sent') {
          this.hud.addChatMessage(d.message, 'whisper_sent');
        } else {
          this.hud.addChatMessage(`${d.playerName ?? 'Joueur'}: ${d.message}`, 'say');
        }
      }
    });

    // Téléport (GM /tp, console admin, Gatekeeper officiel): recalage du
    // personnage local + rechargement des bâtiments autour du nouveau point
    this.network.onRaw('player:teleport', (d: any) => {
      const pos = d?.position ?? d;
      const player = this.getPlayerMesh();
      if (player && pos) {
        const terrain = this.janganZone?.realTerrain;
        // Bloc de régions de la destination chargé AVANT le déplacement:
        // heightAt juste et sol visible dès l'arrivée (monde multi-continents).
        void (async () => {
          try {
            if (terrain) await terrain.teleportTo(pos.x, pos.z);
          } catch {
            // Un échec de streaming ne doit JAMAIS bloquer le déplacement
            // (bug phase I: fetch région raté → exception avalée → le perso
            // restait à l'ancienne position = rubber-band permanent).
          }
          const y = terrain ? terrain.heightAt(pos.x, pos.z) : (pos.y ?? 0);
          const root = (player.parent ?? player) as { position: { set(x: number, y: number, z: number): void } };
          root.position.set(pos.x, y, pos.z);
          // Streaming-lite (Phase B): les bâtiments de la ville de destination
          // remplacent ceux de la ville d'origine (budget perf constant).
          void this.janganZone?.worldObjectsPublic?.reload(pos.x, pos.z).catch(() => undefined);
        })();
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
      if (rp) {
        if ((rp as any).animGroups) {
          for (const g of (rp as any).animGroups) { try { g.stop(); g.dispose(); } catch { /* déjà parti */ } }
        }
        rp.root.dispose();
        this.remotePlayers.delete(id);
      }
    });
  }

  /** Rend un autre joueur (modèle officiel chinaman/chinawoman + anim). */
  private async spawnRemotePlayer(data: any): Promise<void> {
    if (!data || this.remotePlayers.has(data.id)) return;
    const terrain = this.janganZone?.realTerrain;
    const y = terrain ? terrain.heightAt(data.position.x, data.position.z) : data.position.y;

    // Marqueur immédiat pendant le chargement du modèle
    const root = MeshBuilder.CreateCylinder(`netplayer_${data.id}`, { diameter: 6, height: 17 }, this.scene);
    root.position.set(data.position.x, y + 8.5, data.position.z);
    const mat = new StandardMaterial(`netplayer_mat_${data.id}`, this.scene);
    mat.diffuseColor = new Color3(0.3, 0.75, 0.4);
    root.material = mat;
    this.remotePlayers.set(data.id, { data, root, animState: null, target: null });
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
  /**
   * Joue une animation ponctuelle du perso local (attaque, réaction aux
   * dégâts) PAR-DESSUS l'anim d'état: les groupes player_anim_* (idle/walk/run
   * gérés par Game) sont mis en pause le temps du clip officiel, puis
   * repris. Un compteur de génération évite qu'un one-shot obsolète ne
   * reprenne les anims d'état après un plus récent.
   */
  private playLocalOneShot(clipPath: string, speed = 1.0, opts?: { noResume?: boolean }): void {
    const playerMesh = this.getPlayerMesh();
    if (!playerMesh) return;
    let root: any = playerMesh;
    while (root.parent) root = root.parent;
    const skeletons: any[] = [];
    for (const mesh of root.getChildMeshes()) {
      const sk = (mesh as any).skeleton;
      if (sk && !skeletons.includes(sk)) skeletons.push(sk);
    }
    if (skeletons.length === 0) return;

    const gen = ++this.oneShotGen;
    const stateGroups = this.scene.animationGroups.filter(g => g.name.startsWith('player_anim_'));
    for (const g of stateGroups) g.pause();
    // noResume (mort): les groupes d'état restent en pause — le perso reste
    // au sol jusqu'au respawn.

    AnimationService.loadAndPlay(this.scene, skeletons, clipPath, false, speed)
      .then((groups: any[]) => {
        if (gen !== this.oneShotGen) {
          // Une anim plus récente a pris le relais: juste nettoyer
          for (const g of groups) { g.stop(); g.dispose(); }
          return;
        }
        const resume = () => {
          if (opts?.noResume) return;
          for (const g of this.scene.animationGroups.filter(x => x.name.startsWith('player_anim_'))) g.play();
        };
        if (groups.length === 0) {
          resume();
          return;
        }
        let finis = 0;
        for (const g of groups) {
          g.onAnimationGroupEndObservable.addOnce(() => {
            g.dispose();
            if (++finis >= groups.length && gen === this.oneShotGen) {
              resume();
            }
          });
        }
      })
      .catch(() => {
        if (gen === this.oneShotGen && !opts?.noResume) {
          for (const g of this.scene.animationGroups.filter(x => x.name.startsWith('player_anim_'))) g.play();
        }
      });
  }

  /** Animation d'attaque du perso local: clip du SKILL officiel si un cast
   *  est frais (phase A V3), sinon la chaîne de combo de la famille d'arme
   *  (a → b → c, comme les combos SRO). */
  private playLocalAttackAnim(): void {
    const skillHit = this.lastSkillCast && Date.now() - this.lastSkillCast.at < 1500;
    if (skillHit) {
      const clip = AnimationService.skillClip(this.lastSkillCast!.code);
      if (clip) {
        this.playLocalOneShot(clip, 1.0);
        return;
      }
    }
    this.playLocalOneShot(
      AnimationService.attackClip(this.equippedFamily, this.attackCombo++, this.playerGender),
      1.15,
    );
  }

  private async attachWeaponVisual(d: { itemCode: string; name: string } | null): Promise<void> {
    try {
      const old = this.scene.getTransformNodeByName('equipped_weapon');
      if (old) { old.dispose(); }

      if (!d) return;
      // bsr "item\china\weapon\blade_01.bsr" → stem préfixé par région
      // (phase A: GLB régénérés ch_/eu_ pour lever les collisions de stems)
      const piece = (d.itemCode || '').replace(/\\/g, '/').split('/').pop()?.replace(/\.bsr$/i, '') ?? '';
      if (!piece) return;
      const prefix = d.itemCode.includes('europe') ? 'eu_' : 'ch_';
      const stem = `${prefix}${piece}`;
      // Famille d'armes → clips de combo (sword couvre épée/lame, spear
      // couvre lance/hallebarde; arc à part)
      if (/bow/i.test(piece)) this.equippedFamily = 'bow';
      else if (/spear|glaive/i.test(piece)) this.equippedFamily = 'spear';
      else this.equippedFamily = 'sword';
      // Préférer le GLB préfixé (régénéré), repli sur l'ancien stem nu
      let loaded = await this.assetLoader.loadGameObject(stem).catch(() => null);
      if (!loaded?.root) loaded = await this.assetLoader.loadGameObject(piece).catch(() => null);
      if (loaded?.root) {
        loaded.root.name = 'equipped_weapon';
        const player = this.getPlayerMesh();
        if (player) {
          // Attache OFFICIELLE à l'os de la main (Bip01 R HandMid si le rig
          // le possède, sinon R Hand) — l'arme suit la main animée.
          const handMid = this.findPlayerBone(/Bip01 R HandMid$/);
          const handBone = handMid ?? this.findPlayerBone(/Bip01 R Hand$/);
          if (handBone) {
            const { Vector3: V3, Quaternion } = await import('@babylonjs/core/Maths/math.vector');
            loaded.root.parent = null;
            loaded.root.scaling.setAll(1.0);
            loaded.root.position.copyFrom(handBone.getAbsolutePosition());
            // Orientation: les GLB d'armes SRO ont la lame le long de leur
            // −Z local (mesuré: blade/sword/spear/bow bbox étendue en Z,
            // pommeau vers l'origine). alignToBone avec rotation(0,0,0)
            // laissait la lame dans un axe arbitraire du rig («épée
            // flottante horizontale»). On aligne la lame sur le
            // prolongement de la main (poignet → bout des doigts) mesuré
            // sur le rig — attachToBone préserve l'orientation monde.
            const wrist = this.findPlayerBone(/Bip01 R Hand$/) ?? this.findPlayerBone(/Bip01 R Forearm$/);
            let dir: InstanceType<typeof V3> | null = null;
            if (wrist && wrist !== handBone) {
              dir = handBone.getAbsolutePosition().subtract(wrist.getAbsolutePosition());
            } else if (!handMid) {
              // repli: prolonger l'avant-bras
              const forearm = this.findPlayerBone(/Bip01 R Forearm$/);
              if (forearm && forearm !== handBone) {
                dir = handBone.getAbsolutePosition().subtract(forearm.getAbsolutePosition());
              }
            }
            const bladeDir = dir && dir.lengthSquared() > 1e-6 ? dir.normalize() : new V3(0, 1, 0);
            const q = new Quaternion();
            Quaternion.FromUnitVectorsToRef(new V3(0, 0, -1), bladeDir, q);
            loaded.root.rotationQuaternion = q;
            loaded.root.attachToBone(handBone, player as any);
            // Recul le long de la paume pour ne pas traverser la main
            loaded.root.position.addInPlace(bladeDir.scale(-0.6));
          } else {
            // Repli: parent + offset fixes (pas d'os disponible)
            if (player.parent) {
              loaded.root.parent = player.parent as any;
              loaded.root.position.set(0.35, 1.0, 0.1);
              loaded.root.scaling.setAll(1.0);
            }
          }
        }
        this.hud.addChatMessage(`${d.name} équipée`, 'system');
      }
    } catch (e) {
      console.warn('[NetworkCombat] visuel arme non chargé:', e);
    }
  }

  /** Cherche un os du joueur local par regex sur le nom (suffixe accepté —
   *  les squelettes instanciés sont préfixés « resourceId_Bip01… »). */
  private findPlayerBone(pattern: RegExp): any | null {
    const player = this.getPlayerMesh();
    if (!player) return null;
    for (const mesh of player.getChildMeshes()) {
      const sk = (mesh as any).skeleton;
      if (!sk) continue;
      for (const bone of sk.bones) {
        if (pattern.test(bone.name)) return bone;
      }
    }
    return null;
  }

  // ============================================
  // APPARENCE: ARMURES PAR PIÈCE (phase A V3)
  // ============================================

  /** Race du perso local (stems ch_/eu_ des pièces d'équipement). */
  playerRace: 'chinese' | 'european' = 'chinese';

  /** Nœuds d'armure portés (reconstruits à chaque equipment:full). */
  private armorNodes: import('@babylonjs/core/Meshes/transformNode').TransformNode[] = [];
  /** Génération d'assemblage (les packets arrivent en rafale: seul le
   *  dernier assemblage doit survivre — sinon pièces en double). */
  private armorGen = 0;
  private armorRetries = 0;

  /** equipment:full → assemble les pièces d'armure skinnées sur le perso. */
  private async applyEquipmentVisual(slots: Record<string, { itemCode: string; name: string } | null> | null): Promise<void> {
    try {
      const gen = ++this.armorGen;

      // Purger TOUTES les pièces existantes (par nom — les builds concurrents
      // obsolètes ne sont pas tous dans armorNodes)
      for (const n of this.scene.getNodes().filter((x: any) => String(x.name || '').startsWith('equip_armor_'))) {
        n.dispose();
      }
      this.armorNodes = [];

      const player = this.getPlayerMesh();
      // Nœud flip du corps (les parties skinnées y vivent — même orientation).
      // S'il manque, le modèle n'est PAS prêt: même chemin de réessai que
      // sans modèle (l'assemblage des parties est différé, le flip arrive
      // avec la 1re partie — l'ancien « return » sec abandonnait l'équipement
      // à jamais sur ce cas).
      const flip = player
        ? player.getChildTransformNodes().find((n) => n.name.endsWith('_flip'))
        : null;
      if (!player || !flip) {
        // Modèle pas encore chargé (async): réessayer (max ~60 s — le modèle
        // officiel met ~10-18 s à arriver, 60 s couvre les machines lentes)
        // tant qu'aucun assemblage plus récent n'a pris le relais.
        if (gen === this.armorGen) {
          this.armorRetries = (this.armorRetries ?? 0) + 1;
          if (this.armorRetries <= 40) {
            setTimeout(() => { if (gen === this.armorGen) void this.applyEquipmentVisual(slots); }, 1500);
          }
        }
        return;
      }
      this.armorRetries = 0;

      const prefix = `${this.playerRace === 'european' ? 'eu' : 'ch'}_${this.playerGender ? 'woman' : 'man'}_`;
      // Décalage vertical appliqué par normalizePlayerScale aux enfants du
      // perso (valeur absolue commune) — les nouvelles pièces l'héritent.
      const yShift = flip.position.y;

      const order = ['boots', 'legs', 'chest', 'shoulder', 'hands', 'helmet'];
      for (const slot of order) {
        if (gen !== this.armorGen) return; // assemblage obsolète: abandonner
        const it = slots?.[slot];
        if (!it?.itemCode) continue;
        const piece = (it.itemCode || '').replace(/\\/g, '/').split('/').pop()?.replace(/\.bsr$/i, '') ?? '';
        if (!piece) continue;
        const stem = `${prefix}${piece}`;
        const loaded = await this.assetLoader.loadGameObject(stem).catch(() => null);
        if (gen !== this.armorGen) return; // obsolète pendant le chargement
        if (!loaded?.root) continue;
        loaded.root.name = `equip_armor_${slot}`;
        loaded.root.parent = flip;
        loaded.root.scaling.setAll(1.0);
        // Le corps vit déjà sous le nœud _flip (rotation π). La pièce
        // chargée embarque SON PROPRE flip interne (loadMultiPartGlb
        // n'applique le demi-tour qu'aux modèles skinnés): l'annuler,
        // sinon 2×π = pièce tournée de 180° (buste dans le dos, pieds
        // gauche/droite échangés).
        const innerFlip = loaded.root
          .getChildTransformNodes()
          .find((n) => n.name.endsWith('_flip'));
        if (innerFlip) innerFlip.rotation.y = 0;
        // Même recalage que les parties du corps (pose pieds au sol)
        for (const child of loaded.root.getChildTransformNodes(true)) child.position.y = yShift;
        this.armorNodes.push(loaded.root);
      }

      // Arme (visuel + famille de combo) depuis le même packet — au login il
      // n'y a pas de packet equipment:weapon séparé.
      if (slots?.weapon?.itemCode && gen === this.armorGen) {
        void this.attachWeaponVisual({ itemCode: slots.weapon.itemCode, name: slots.weapon.name ?? '' });
      }

      if (this.armorNodes.length > 0 || slots?.weapon?.itemCode) {
        // Rafraîchir les groupes d'animation pour inclure les squelettes des
        // nouvelles pièces (le prochain changement d'état le ferait, mais on
        // veut l'armure animée immédiatement).
        window.dispatchEvent(new CustomEvent('srobro:player-appearance'));
      }
    } catch (e) {
      console.warn('[NetworkCombat] apparence armure:', e);
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
    const proxy = MeshBuilder.CreateBox(`netmobproxy_${data.id}`, { width: 10, depth: 14, height: 10 }, this.scene);
    proxy.position.set(data.position.x, y + 5, data.position.z);
    proxy.isVisible = false;
    proxy.isPickable = true;
    proxy.metadata = { netMonsterId: data.id };

    this.monsters.set(data.id, { data, root, proxy, animState: null, netState: null, target: null });

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
    const holder = m as any;
    if (holder.animGroups) {
      for (const g of holder.animGroups) { try { g.stop(); g.dispose(); } catch { /* déjà parti */ } }
      holder.animGroups = null;
    }
    m.root.dispose();
    m.proxy.dispose();
    this.monsters.delete(id);
    if (this.targetId === id) this.clearTarget();
  }

  /**
   * Fuite de groupes d'animation (perf H V3): chaque entité instanciée crée
   * des groupes par clip×squelette (loadAndPlay) qui SURVIVENT au dispose
   * des meshes — vécu: 2 126 groupes tous en lecture → 30 FPS. Un groupe
   * dont la cible est un squelette/os de l'entité est disposé ici.
   */
  private disposeEntityAnims(root: any): void {
    const bones = new Set<string>();
    for (const mesh of root.getChildMeshes()) {
      const sk = (mesh as any).skeleton;
      if (sk) for (const bone of sk.bones) bones.add(bone.name);
    }
    if (bones.size === 0) return;
    for (const g of [...this.scene.animationGroups]) {
      const targets = (g as any).targets ? [...((g as any).targets as any[])] : [];
      if (targets.some((t: any) => bones.has(t?.name))) g.dispose();
    }
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
    // walk/run/stand01 ↔ boucle; attack01/damage01 ponctuels
    const looping = state === 'walk' || state === 'run' || state === 'stand01';
    const action = state === 'attack01' || state === 'damage01' || looping ? state : 'walk';
    const clip = AnimationService.monsterClip(stem, action as 'attack01' | 'damage01' | 'walk' | 'run' | 'stand01');
    // Fuite (perf H V3): chaque changement d'état créait de NOUVEAUX groupes
    // sans disposer les précédents (1 952 groupes cumulés → 20 FPS). Les
    // groupes sont tenus PAR ENTITÉ et disposés à chaque bascule.
    const holder = m as any;
    if (holder.animGroups) {
      for (const g of holder.animGroups) { try { g.stop(); g.dispose(); } catch { /* déjà parti */ } }
    }
    AnimationService.loadAndPlay(this.scene, skeletons, clip, !once, once ? 1.4 : 1.0)
      .then((groups: any[]) => {
        holder.animGroups = groups;
        if (once) {
          // Retour au walk après l'attaque
          setTimeout(() => {
            for (const g of groups) { g.stop(); g.dispose(); }
            holder.animGroups = null;
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
      const skill = this.hotbar.find((s) => s.key === e.key);
      if (skill) {
        this.useSkill(skill);
      }
      // Tab = berserker (5 orbes → ×2 dégâts, comportement officiel)
      if (e.key === 'Tab') {
        e.preventDefault();
        void this.network.request('zerk:activate', {}).then((r: any) => {
          if (!r?.success) this.hud.addChatMessage(r?.error ?? 'Zerk indisponible', 'system');
        });
      }
    });

    // Clic sur un slot de la hotbar DOM (V4 §B) → même chemin que la touche.
    window.addEventListener('srobro:hotbar-use', (e) => {
      const idx = (e as CustomEvent<number>).detail;
      const s = this.hotbar[idx];
      if (s) this.useSkill(s);
    });
  }

  /**
   * Recharge la hotbar depuis les skills APPRIS (Phase C): attaques (kind 5)
   * puis magiques (kind 10) puis imbues (kind 8), touches 1-8. Une entrée
   * par série (le plus haut niveau appris).
   */
  async refreshHotbar(): Promise<void> {
    try {
      const res = await this.network.request<{
        success: boolean; series?: Array<{
          code: string; name: string; masteryKey: string;
          levels: Array<{ code: string; name: string; learned: boolean; attKind: number; mpCost: number; cooldownMs: number }>;
        }>;
      }>('skills:available');
      if (!res.success || !res.series) return;
      const order = (k: number) => (k === 5 ? 0 : k === 10 ? 1 : 2);
      const withKind: Array<HotbarSkill & { kind: number }> = [];
      for (const s of res.series) {
        const lvl = [...s.levels].reverse().find((l) => l.learned);
        if (!lvl) continue;
        withKind.push({ code: lvl.code, label: s.name, key: '', mpCost: lvl.mpCost, cooldownMs: lvl.cooldownMs, kind: lvl.attKind });
      }
      withKind.sort((a, b) => order(a.kind) - order(b.kind));
      this.hotbar = withKind.slice(0, 8).map((h, i) => ({ ...h, key: String(i + 1) }));
      this.hud.setHotbarSkills(this.hotbar);
      console.log(`[NetworkCombat] Hotbar: ${this.hotbar.map((h) => h.label).join(', ')}`);
    } catch { /* silencieux */ }
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

      const plane = MeshBuilder.CreatePlane(`target_label_plane_${(m.data as any).id}`, { width: 30, height: 7.5 }, this.scene);
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
    const slotIdx = this.hotbar.indexOf(skill);
    if (slotIdx >= 0) this.hud.startSlotCooldown(slotIdx, skill.cooldownMs);
    this.network.send({
      type: 'cast_skill',
      timestamp: now,
      data: { targetId: this.targetId, skillId: skill.code },
    } as any);
    this.hud.addChatMessage(`${skill.label}!`, 'combat');

    // VFX de cast au joueur (l'impact jouera sur la cible à la réponse serveur)
    this.lastSkillCast = { code: skill.code, label: skill.label, at: now };
    const pv = this.playerAnchor();
    if (pv) {
      const element = this.vfxElement(skill.code, skill.label);
      if (element === 'lightning') {
        const m = this.monsters.get(this.targetId);
        this.vfx.playEffect('lightning', pv, m ? m.root.position.add(new Vector3(0, 11, 0)) : undefined);
      } else {
        this.vfx.playEffect(element, pv);
      }
    }
  }

  /** Position d'ancrage du joueur local (poitrine) pour les VFX. */
  private playerAnchor(): Vector3 | null {
    const player = this.getPlayerMesh();
    if (!player) return null;
    const root = (player.parent ?? player) as Mesh;
    return root.getAbsolutePosition().add(new Vector3(0, 11, 0));
  }

  /** Élément visuel d'un skill selon son code/nom (maîtrises SRO). */
  private vfxElement(code: string, label: string): string {
    const n = `${code} ${label}`.toLowerCase();
    if (/(fire|flame|burn|hwakyung|feu)/.test(n)) return 'fire';
    if (/(ice|frost|cold|freez|binggyeong|glace)/.test(n)) return 'ice';
    if (/(lightning|thunder|electro|shock|jeonkyung|foudre)/.test(n)) return 'lightning';
    if (/(heal|recovery|cure|vital|lifeturn|soin)/.test(n)) return 'heal';
    // Sorts EU sans élément explicite → VFX officiel wizard (bolt)
    if (/skill_eu_(wizard|warlock)/.test(n)) return 'wizard';
    return 'slash';
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

  /** Hotbar courante (affichage). */
  get hotbarSkills(): HotbarSkill[] {
    return this.hotbar;
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
    // Interpolation des entités distantes vers leur dernière position serveur
    // (packets ~5 Hz: monstres 250 ms, joueurs 200 ms — un snap direct fait
    // un déplacement « téléportation », oct. 2026).
    const dt = Math.min(this.scene.getEngine().getDeltaTime() / 1000, 0.1);
    if (dt > 0) {
      const k = 1 - Math.exp(-dt * 10); // lissage exponentiel indépendant du fps
      const terrain = this.janganZone?.realTerrain;
      const step = (root: any, proxy: any | null, tgt: { x: number; z: number; rot: number } | null): number => {
        if (!tgt) return -1;
        const p = root.position;
        const dx = tgt.x - p.x;
        const dz = tgt.z - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 80) {
          // Grand saut (téléporteur, correction serveur): pose directe
          p.x = tgt.x; p.z = tgt.z;
        } else if (dist > 0.02) {
          p.x += dx * k;
          p.z += dz * k;
        }
        // Rotation: chemin le plus court (wrap ±π)
        let dr = tgt.rot - root.rotation.y;
        while (dr > Math.PI) dr -= Math.PI * 2;
        while (dr < -Math.PI) dr += Math.PI * 2;
        if (Math.abs(dr) > 0.01) root.rotation.y += dr * k;
        if (terrain) p.y = terrain.heightAt(p.x, p.z);
        if (proxy) { proxy.position.set(p.x, p.y + 5, p.z); proxy.rotation.y = root.rotation.y; }
        return Math.hypot(tgt.x - p.x, tgt.z - p.z);
      };

      for (const rp of this.remotePlayers.values()) {
        const restant = step(rp.root, null, rp.target);
        const wanted = restant > 1.5 ? 'walk' : 'idle';
        // Hystérésis (perf H V3): une seule bascule par NET changement —
        // dispose les groupes précédents du joueur distant avant rechargement.
        const lastWanted = ((rp as any).animWanted ?? rp.animState);
        (rp as any).animWanted = wanted;
        if (restant >= 0 && lastWanted !== wanted) {
          rp.animState = wanted;
          if ((rp as any).animGroups) {
            for (const g of (rp as any).animGroups) { try { g.stop(); g.dispose(); } catch { /* déjà parti */ } }
          }
          const skeletons: any[] = [];
          for (const mesh of rp.root.getChildMeshes()) {
            const sk = (mesh as any).skeleton;
            if (sk && !skeletons.includes(sk)) skeletons.push(sk);
          }
          if (skeletons.length > 0) {
            AnimationService.loadAndPlay(
              this.scene, skeletons,
              AnimationService.playerClip(wanted === 'walk' ? 'walkforward' : 'standcity'),
              true, 1.0,
            ).then((groups: any[]) => { (rp as any).animGroups = groups; }).catch(() => undefined);
          }
        }
      }

      for (const m of this.monsters.values()) {
        const restant = step(m.root, m.proxy, m.target);
        // Annonce serveur aggro/attaque → course; sinon marche tant qu'on
        // n'a pas rejoint la cible, idle à l'arrêt (le serveur ne diffuse
        // pas les monstres idle → la convergence détecte l'arrêt).
        let wanted: string;
        if (m.netState === 'aggro' || m.netState === 'attack') wanted = 'run';
        else if (restant > 1.5) wanted = 'walk';
        else wanted = 'stand01';
        // Hystérésis (perf H V3): la bascule walk↔idle clignotait à chaque
        // frame (convergence oscillante autour de 1,5 u) → chaque bascule
        // rechargeait des clips. Ne basculer qu'une fois par NET changement.
        const lastWanted = ((m as any).animWanted ?? m.animState);
        (m as any).animWanted = wanted;
        if (restant >= 0 && lastWanted !== wanted) {
          m.animState = wanted;
          this.switchMonsterAnim(m, wanted);
        }
      }

      // Purge des FANTÔMES: un monstre sorti de l'AOI serveur (~150 m) sans
      // packet despawn (téléport GM, respawn hors vue) reste sinon affiché
      // pour toujours — cibler/attaquer un fantôme ne fait rien, ce qui
      // paraît « cassé » en jeu. Ramassage toutes les 2 s.
      const nowMs = performance.now();
      if (nowMs - (this as any)._lastGhostPurge > 2000) {
        (this as any)._lastGhostPurge = nowMs;
        const playerMesh = this.getPlayerMesh();
        const pr = playerMesh?.position;
        if (pr) {
          const ghosts: string[] = [];
          for (const [id, m] of this.monsters) {
            const d = Math.hypot(m.root.position.x - pr.x, m.root.position.z - pr.z);
            if (d > 300) ghosts.push(id); // AOI serveur 150 m: >300 u = forcément un fantôme
          }
          for (const id of ghosts) this.despawnMonster(id);
        }
      }
    }

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
    this.vfx.dispose();
  }
}
