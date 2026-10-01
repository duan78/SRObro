// ============================================
// SRObro - Combat Bridge (phase 2)
// Colle entre les systèmes existants pour une boucle de combat complète:
// SpawnManager (spawn/IA/mort) ↔ CombatManager (dégâts) ↔ DropManager (loot)
// ↔ PlayerEntity (récompenses/XP) ↔ réseau (packets aux clients).
// ============================================

import { createLogger } from '../core/Logger';
import { prisma } from '../database/prisma';
import type { WorldManager } from './WorldManager';
import type { Client } from '../network/Client';
import { globalSpawnManager } from '../ai/SpawnManager';
import { globalCombatManager } from '../combat/CombatManager';
import { DropManager } from '../drop/DropManager';
import { PlayerEntity } from '../world/PlayerEntity';
import { MonsterEntity } from '../world/MonsterEntity';
import { globalSpatialManager } from '../world/SpatialManager';
import { rates } from '../config/rates';
import { QuestManager } from '../quest/QuestManager';
import { cumulativeXpForLevel } from '@srobro/shared';
import type { S2CPacket } from '@srobro/shared';

const logger = createLogger('CombatBridge');

// Compétences d'attaque de base (phase 2). Les codes existent dans skilldata
// officiel (identité visuelle/nom) — les paramètres seront remplacés par les
// vraies colonnes 118 de skilldata à la phase 4.
export interface BasicSkill {
  code: string;
  label: string;
  mpCost: number;
  cooldownMs: number;
  range: number;
  damageMultiplier: number;
  hits: number;
}

export const BASIC_SKILLS: BasicSkill[] = [
  { code: 'SKILL_CH_SWORD_SMASH_A_01', label: 'Frappe', mpCost: 5, cooldownMs: 3000, range: 4, damageMultiplier: 1.5, hits: 1 },
  { code: 'SKILL_CH_SWORD_SMASH_B_01', label: 'Taillade', mpCost: 12, cooldownMs: 8000, range: 4, damageMultiplier: 2.2, hits: 1 },
  { code: 'SKILL_CH_SWORD_CHAIN_A_1S_01', label: 'Enchaînement', mpCost: 9, cooldownMs: 6000, range: 4, damageMultiplier: 0.9, hits: 2 },
];

interface PlayerCooldowns {
  skills: Map<string, number>; // code -> timestamp de fin de cooldown
  lastSkillPacket: number; // anti-spam réseau
}

export class CombatBridge {
  private worldManager: WorldManager;
  private dropManager: DropManager;
  private cooldowns: Map<string, PlayerCooldowns> = new Map();
  // Diffusion de positions monstres: au plus toutes les 250 ms par monstre
  private lastMonsterBroadcast: Map<string, number> = new Map();

  constructor(worldManager: WorldManager) {
    this.worldManager = worldManager;
    this.dropManager = DropManager.getInstance();
  }

  initialize(): void {
    // Monstres: diffusion spawn/despawn aux joueurs proches
    globalSpawnManager.on('monsterSpawned', (data: unknown) => {
      const { monsterEntity } = data as { monsterEntity: MonsterEntity };
      this.broadcastToNearby(monsterEntity.position, {
        type: 'spawn',
        timestamp: Date.now(),
        data: this.serializeMonster(monsterEntity),
      });
    });

    globalSpawnManager.on('monsterDespawned', (data: unknown) => {
      const { monsterId, monsterEntity } = data as { monsterId: string; monsterEntity?: MonsterEntity };
      this.broadcastToNearby(monsterEntity?.position ?? { x: 0, y: 0, z: 0 }, {
        type: 'despawn',
        timestamp: Date.now(),
        data: { id: monsterId },
      });
    });

    // IA: un monstre attaque un joueur → dégâts autoritaires
    globalSpawnManager.on('monsterAttack', (data: unknown) => {
      const { attackerId, targetId } = data as { attackerId: string; targetId: string };
      this.processMonsterAttack(attackerId, targetId);
    });

    // Mort (joueur ou monstre) via CombatManager
    globalCombatManager.on('death', (data: unknown) => {
      const d = data as { victimId: string; killerId: string };
      if (globalSpawnManager.getMonsterEntity(d.victimId)) {
        this.onMonsterDeath(d.victimId, d.killerId);
      } else {
        this.onPlayerDeath(d.victimId, d.killerId);
      }
    });

    // Multi-joueurs: signaler le départ d'un joueur aux autres
    this.worldManager.on('playerLeft', (data: unknown) => {
      const { playerId } = data as { playerId: string };
      this.sendToPlayerRaw(playerId, 'player:despawn_self', {});
      for (const other of this.worldManager.getAllPlayers()) {
        if (other.id !== playerId) {
          this.sendToPlayerRaw(other.id, 'despawn_player', { id: playerId });
        }
      }
    });

    // Quêtes: toute complétion (auto au dernier objectif OU rendu PNJ)
    // crédite les récompenses à l'ENTITÉ vivante — le QuestManager n'écrit
    // qu'en base, l'entité en jeu écraserait ces valeurs à la sauvegarde.
    QuestManager.getInstance().on('questCompleted', (ev: unknown) => {
      const { characterId, rewards } = ev as { characterId: string; rewards: { exp?: number; sp?: number; gold?: number } };
      const player = this.worldManager.getPlayer(characterId);
      if (!player) return;
      if (rewards?.exp) player.addExp(Math.round(rewards.exp * rates.exp));
      if (rewards?.sp) player.sp += Math.round(rewards.sp * rates.sp);
      if (rewards?.gold) player.addGold(Math.round(rewards.gold * rates.gold));
      this.sendToPlayerRaw(characterId, 'quest:completed', { rewards });
      this.sendPlayerState(characterId);
      logger.info(`Quête complétée: +${rewards?.exp ?? 0} XP pour ${player.name}`);
    });

    // Level-up + snapshot monde des joueurs connectés
    this.worldManager.on('playerJoined', (data: unknown) => {
      const { playerEntity } = data as { playerEntity: PlayerEntity };
      playerEntity.on('levelUp', (ev: unknown) => {
        const { oldLevel, newLevel } = ev as { oldLevel: number; newLevel: number };
        this.sendToPlayer(playerEntity.id, {
          type: 'level_up',
          timestamp: Date.now(),
          data: { oldLevel, newLevel, level: newLevel },
        });
        this.sendPlayerState(playerEntity.id);
      });

      // Monstres déjà présents autour du point d'apparition + état initial.
      // forceCheckNearby: repeuple immédiatement les camps vides (déconnexion
      // du précédent joueur) au lieu d'attendre un respawnTime complet.
      globalSpawnManager.forceCheckNearby(playerEntity.position, 120);
      setTimeout(() => this.sendWorldSnapshot(playerEntity.id), 2500).unref?.();
      this.sendPlayerState(playerEntity.id);

      // Multi-joueurs (phase 5): le nouveau voit les joueurs proches, les
      // autres le voient apparaître.
      this.syncPlayerVisibility(playerEntity);
    });

    logger.info('CombatBridge initialisé');
  }

  // ============================================
  // SNAPSHOT MONDE (à la connexion / sélection de perso)
  // ============================================

  sendWorldSnapshot(playerId: string): void {
    const player = this.worldManager.getPlayer(playerId);
    if (!player) return;
    // Aussi les joueurs proches: le client charge le monde des minutes
    // durant, les spawn_player émis à son arrivée sont perdus avant que son
    // module de rendu réseau existe (idempotent côté client).
    for (const other of this.worldManager.getAllPlayers()) {
      if (other.id === playerId) continue;
      if (other.invisible) continue; // GM invisible: pas dans le snapshot
      const dp = Math.hypot(other.position.x - player.position.x, other.position.z - player.position.z);
      if (dp <= 200) {
        this.sendToPlayerRaw(playerId, 'spawn_player', this.serializePlayer(other));
      }
    }
    for (const monster of globalSpawnManager.getMonsterEntities().values()) {
      const d = Math.hypot(monster.position.x - player.position.x, monster.position.z - player.position.z);
      if (d <= 120) {
        this.sendToPlayer(playerId, {
          type: 'spawn',
          timestamp: Date.now(),
          data: this.serializeMonster(monster),
        });
      }
    }
  }

  // ============================================
  // TICK: diffusion des positions monstres
  // ============================================

  update(_delta: number): void {
    const now = Date.now();
    for (const monster of globalSpawnManager.getMonsterEntities().values()) {
      if (monster.aiState === 'idle') continue; // ne diffuse pas l'inaction
      const last = this.lastMonsterBroadcast.get(monster.id) ?? 0;
      if (now - last < 250) continue;
      this.lastMonsterBroadcast.set(monster.id, now);
      this.broadcastToNearby(monster.position, {
        type: 'update',
        timestamp: now,
        data: {
          id: monster.id,
          position: monster.position,
          rotation: monster.rotation,
          state: monster.aiState,
        },
      });
    }
  }

  // ============================================
  // ATTAQUES JOUEUR: skill (cast_skill)
  // ============================================

  /**
   * Exécute une compétence pour un joueur. Retourne une réponse pour le
   * client (cooldowns/erreurs affichables).
   */
  processSkillCast(_client: Client, characterId: string, skillCode: string, targetId: string): void {
    const player = this.worldManager.getPlayer(characterId);
    if (!player || !player.isAlive()) return;

    const skill = BASIC_SKILLS.find((s) => s.code === skillCode);
    if (!skill) {
      this.sendToPlayer(characterId, {
        type: 'skill_rejected', timestamp: Date.now(), data: { skillCode, reason: 'Compétence inconnue' },
      });
      return;
    }

    const cd = this.cooldowns.get(characterId) ?? { skills: new Map(), lastSkillPacket: 0 };
    this.cooldowns.set(characterId, cd);

    const now = Date.now();
    if (now - cd.lastSkillPacket < 300) return; // anti-spam
    cd.lastSkillPacket = now;

    // Cooldown
    const readyAt = cd.skills.get(skill.code) ?? 0;
    if (now < readyAt) {
      this.sendToPlayer(characterId, {
        type: 'skill_rejected', timestamp: now,
        data: { skillCode, reason: 'Cooldown', remainingMs: readyAt - now },
      });
      return;
    }

    // Coût MP
    if (player.mp < skill.mpCost) {
      this.sendToPlayer(characterId, {
        type: 'skill_rejected', timestamp: now, data: { skillCode, reason: 'Pas assez de MP' },
      });
      return;
    }

    // Cible valide + à portée
    const target = this.worldManager.getEntityById(targetId);
    if (!target || !target.isAlive()) {
      this.sendToPlayer(characterId, {
        type: 'skill_rejected', timestamp: now, data: { skillCode, reason: 'Cible invalide' },
      });
      return;
    }
    const distance = player.distanceTo(target);
    if (distance > Math.max(skill.range * 3, 15)) {
      this.sendToPlayer(characterId, {
        type: 'skill_rejected', timestamp: now, data: { skillCode, reason: 'Hors de portée' },
      });
      return;
    }

    // Applique: MP + cooldown
    player.setMp(player.mp - skill.mpCost);
    cd.skills.set(skill.code, now + skill.cooldownMs);

    // Casting bar côté client (silence serveur bref = cast instantané de
    // base; les vrais castTime viendront des colonnes skilldata)
    this.sendToPlayer(characterId, {
      type: 'casting_start', timestamp: now,
      data: { skillCode, durationMs: 0, targetId },
    });

    // Dégâts (multi-coups)
    for (let i = 0; i < skill.hits; i++) {
      globalCombatManager.startCombat(
        this.worldManager.toCombatParticipant(player),
        this.worldManager.toCombatParticipant(target),
      );
      const bonus = Math.round(
        ((player.stats.attackPower.min + player.stats.attackPower.max) / 2) * (skill.damageMultiplier - 1),
      );
      const result = globalCombatManager.processAttack(characterId, targetId, 'physical', bonus);
      if (result && (target instanceof PlayerEntity || target instanceof MonsterEntity)) {
        target.setHp(result.targetHp);
        this.broadcastToNearby(target.position, {
          type: 'attack',
          timestamp: now,
          data: {
            attackerId: characterId,
            targetId,
            skillId: skill.code,
            damage: result.damage,
            isCritical: result.isCritical,
            isBlocked: result.isBlocked,
            remainingHp: result.targetHp,
          },
        });
      }
    }

    this.sendPlayerState(characterId);
  }

  // ============================================
  // ATTAQUES MONSTRE → JOUEUR
  // ============================================

  private processMonsterAttack(attackerId: string, targetId: string): void {
    const monster = globalSpawnManager.getMonsterEntity(attackerId);
    const player = this.worldManager.getPlayer(targetId);
    if (!monster || !player) return;
    if (!player.isAlive()) {
      monster.target = null;
      return;
    }
    // Mode dieu (GM): aucun dégât ne s'applique
    if (player.godMode) return;

    globalCombatManager.startCombat(
      this.worldManager.toCombatParticipant(monster),
      this.worldManager.toCombatParticipant(player),
    );
    const result = globalCombatManager.processAttack(attackerId, targetId, 'physical', 0);
    if (result) {
      player.setHp(result.targetHp);
      this.broadcastToNearby(player.position, {
        type: 'attack',
        timestamp: Date.now(),
        data: {
          attackerId,
          targetId,
          damage: result.damage,
          isCritical: result.isCritical,
          isBlocked: result.isBlocked,
          remainingHp: result.targetHp,
        },
      });
      this.sendPlayerState(targetId);
    }
  }

  // ============================================
  // MORT D'UN MONSTRE: récompenses + loot
  // ============================================

  /** Commande GM /kill: même pipeline qu'une mort en combat. */
  gmKillMonster(monsterId: string, killerId: string): void {
    const monster = globalSpawnManager.getMonsterEntity(monsterId);
    if (!monster || monster.hp <= 0) return;
    monster.setHp(0);
    void this.onMonsterDeath(monsterId, killerId);
  }

  private async onMonsterDeath(victimId: string, killerId: string): Promise<void> {
    try {
      const killer = this.worldManager.getPlayer(killerId);
      const monster = globalSpawnManager.getMonsterEntity(victimId);
      if (!monster) return;

      // Journal de kill (console admin, phase 6)
      try {
        await prisma.killLog.create({
          data: { killerId, victimId, victimName: monster.name, victimType: 'MONSTER', damage: monster.maxHp },
        });
      } catch { /* non bloquant */ }

      if (killer) {
        // XP / SP / or (taux configurables à chaud)
        const expGain = Math.max(1, Math.round(monster.exp * rates.exp));
        const spGain = Math.max(0, Math.round(monster.sp * rates.sp));
        const goldGain = Math.round((monster.level * 8 + Math.random() * monster.level * 4) * rates.gold);

        killer.addExp(expGain);
        killer.sp += spGain;
        killer.addGold(goldGain);

        this.sendToPlayer(killerId, {
          type: 'xp_gain', timestamp: Date.now(),
          data: { amount: expGain, total: killer.exp },
        });
        this.sendToPlayer(killerId, {
          type: 'sp_gain', timestamp: Date.now(),
          data: { amount: spGain, total: killer.sp },
        });
        this.sendPlayerState(killerId);
      }

      // Loot: table MonsterDrop officielle si remplie, sinon rien (l'or est auto)
      await this.dropMonsterLoot(monster, killerId);

      // Quêtes: faire avancer les objectifs de kill du tueur
      if (killer) {
        void this.trackQuestKills(killerId, monster.name).catch(() => undefined);
      }

      // Le SpawnManager gère despawn (3 s) + respawn via son propre cycle
      logger.info(`Monstre tué: ${monster.name} par ${killer?.name ?? killerId} (+${killer ? Math.round(monster.exp * rates.exp) : 0} XP)`);
    } catch (error) {
      logger.error('Erreur onMonsterDeath:', error);
    }
  }

  private async dropMonsterLoot(monster: MonsterEntity, killerId: string): Promise<void> {
    try {
      // L'entité serveur ne porte pas l'id DB du monstre template: on utilise
      // les drops déclarés pour ce spawn via prisma (recherche par nom).
      const template = await prisma.monster.findFirst({ where: { name: monster.name } });
      if (!template) return;

      const drops = await prisma.monsterDrop.findMany({
        where: { monsterId: template.id },
        include: { item: true },
      });

      const toDrop: Array<{ itemId: string; quantity: number }> = [];
      for (const d of drops) {
        if (Math.random() < d.chance * rates.drop) {
          const qty = d.quantityMin + Math.floor(Math.random() * (d.quantityMax - d.quantityMin + 1));
          toDrop.push({ itemId: d.itemId, quantity: qty });
        }
      }
      if (toDrop.length === 0) return;

      const droppedIds = await this.dropManager.dropItems(
        monster.zoneId,
        toDrop.map((t) => ({ itemId: t.itemId, quantity: t.quantity })),
        monster.position,
        // Propriétaire = tueur: les autres joueurs ne peuvent ramasser qu'a
        //près 30 s (anti-vol de loot, verrou par joueur du prompt phase 5)
        { ownerId: killerId },
      );

      // Diffusion aux joueurs proches: items visibles au sol
      for (let i = 0; i < toDrop.length; i++) {
        const item = drops.find((d) => d.itemId === toDrop[i].itemId)?.item;
        this.broadcastToNearby(monster.position, {
          type: 'drop_item',
          timestamp: Date.now(),
          data: {
            droppedItemId: droppedIds[i],
            itemId: toDrop[i].itemId,
            name: item?.name ?? 'Objet',
            quantity: toDrop[i].quantity,
            position: monster.position,
          },
        });
      }
      void killerId;
    } catch (error) {
      logger.error('Erreur dropMonsterLoot:', error);
    }
  }

  // ============================================
  // MORT DU JOUEUR: écran de résurrection
  // ============================================

  private onPlayerDeath(victimId: string, killerId: string): void {
    const player = this.worldManager.getPlayer(victimId);
    const monster = globalSpawnManager.getMonsterEntity(killerId);
    this.sendToPlayer(victimId, {
      type: 'player:death',
      timestamp: Date.now(),
      data: {
        killerName: monster?.name ?? 'le destin',
        // Pénalités de résurrection (choix client)
        townFree: true,
        hereExpLossPercent: 2,
      },
    });
    this.sendPlayerState(victimId);
    logger.info(`Joueur mort: ${player?.name ?? victimId} (tué par ${monster?.name ?? killerId})`);
  }

  /**
   * Résurrection demandée par le client (bouton Ville ou Ici).
   */
  async handleRespawnRequest(_client: Client, characterId: string, mode: 'town' | 'here'): Promise<void> {
    const player = this.worldManager.getPlayer(characterId);
    if (!player || player.isAlive()) return;

    if (mode === 'here') {
      // Pénalité: 2% d'XP (jamais sous 0)
      const loss = Math.floor(player.exp * 0.02);
      player.exp = Math.max(0, player.exp - loss);
    }

    // Restauration
    player.setHp(player.maxHp);
    player.setMp(player.maxMp);

    if (mode === 'town') {
      // Point de liaison: spawn sûr de Jangan
      player.setPosition({ x: 0, y: 0, z: 500 });
    }
    globalCombatManager.forceRespawn(characterId); // vide la death queue du CombatManager

    this.sendToPlayer(characterId, {
      type: 'player:respawned',
      timestamp: Date.now(),
      data: { mode, position: player.position, hp: player.hp, mp: player.mp },
    });
    this.sendPlayerState(characterId);
    logger.info(`Joueur ressuscité (${mode}): ${player.name}`);
  }

  // ============================================
  // ÉTAT JOUEUR → HUD
  // ============================================

  sendPlayerState(characterId: string): void {
    const player = this.worldManager.getPlayer(characterId);
    if (!player) return;
    // Courbe OFFICIELLE (leveldata.txt): seuils cumulés. Le HUD affiche
    // la progression dans le niveau courant: (exp − levelBase)/(next − levelBase).
    const nextLevelExp = cumulativeXpForLevel(player.level + 1);
    const levelBaseExp = cumulativeXpForLevel(player.level);
    this.sendToPlayer(characterId, {
      type: 'player:state',
      timestamp: Date.now(),
      data: {
        hp: player.hp, maxHp: player.maxHp,
        mp: player.mp, maxMp: player.maxMp,
        level: player.level, exp: player.exp, nextLevelExp, levelBaseExp,
        sp: player.sp, gold: player.gold,
        str: player.str, int: player.int,
        statPoints: player.statPoints,
        position: player.position,
      },
    });
  }

  // ============================================
  // MULTI-JOUEURS (phase 5)
  // ============================================

  /** Annonce un joueur aux joueurs proches et vice-versa. */
  private syncPlayerVisibility(player: PlayerEntity): void {
    const packet = this.serializePlayer(player);
    for (const other of this.worldManager.getAllPlayers()) {
      if (other.id === player.id) continue;
      const d = Math.hypot(other.position.x - player.position.x, other.position.z - player.position.z);
      if (d > 200) continue;
      // Chacun voit l'autre (un joueur invisible n'est pas annoncé)
      if (!player.invisible) this.sendToPlayerRaw(other.id, 'spawn_player', packet);
      this.sendToPlayerRaw(player.id, 'spawn_player', this.serializePlayer(other));
    }
  }

  /**
   * Téléporte un joueur (commande GM /tp, console admin): déplace l'entité,
   * informe le client (recalage terrain) et ré-annonce aux autres.
   */
  teleportPlayer(characterId: string, position: { x: number; y?: number; z: number }): void {
    const player = this.worldManager.getPlayer(characterId);
    if (!player) return;
    // Disparait des anciennes vues, réapparait aux nouvelles
    this.sendToPlayerRaw(characterId, 'player:teleport', { position });
    this.syncPlayerVisibility(player);
    this.sendPlayerState(characterId);
  }

  /** Invisibilité GM: masque/montre le joueur aux autres clients. */
  setPlayerInvisible(characterId: string, invisible: boolean): void {
    const player = this.worldManager.getPlayer(characterId);
    if (!player) return;
    player.invisible = invisible;
    if (invisible) {
      for (const other of this.worldManager.getAllPlayers()) {
        if (other.id !== characterId) this.sendToPlayerRaw(other.id, 'despawn_player', { id: characterId });
      }
    } else {
      this.syncPlayerVisibility(player);
    }
  }

  private serializePlayer(p: PlayerEntity): Record<string, unknown> {
    return {
      id: p.id,
      entityType: 'player',
      name: p.name,
      level: p.level,
      gender: p.gender,
      position: p.position,
      rotation: p.rotation,
    };
  }

  // ============================================
  // QUÊTES (phase 4): kills, PNJ, récompenses
  // ============================================

  /** Fait avancer les objectifs « kill » des quêtes en cours du joueur. */
  private async trackQuestKills(characterId: string, monsterName: string): Promise<void> {
    const qm = QuestManager.getInstance();
    const inProgress = await qm.getQuestProgress(characterId);
    for (const progress of inProgress) {
      const quest = (progress as any).quest;
      const objectives = (quest?.objectives ?? []) as Array<{ type: string; count: number; targetId?: string; targetName?: string }>;
      for (let i = 0; i < objectives.length; i++) {
        const obj = objectives[i];
        if (obj.type !== 'kill') continue;
        const done = ((progress.progress as any)?.[i] ?? 0) >= obj.count;
        if (done) continue;
        // Cible: « monster_yeoha » ou nom direct (« Yeoha »)
        const matches = obj.targetId === `monster_${monsterName.toLowerCase()}`
          || obj.targetName?.toLowerCase() === monsterName.toLowerCase();
        if (matches) {
          await qm.updateQuestProgress(characterId, quest.id, i, 1);
          this.sendToPlayerRaw(characterId, 'quest:progress', {
            questName: quest.name, objective: obj.targetName ?? obj.targetId, monster: monsterName,
          });
          break;
        }
      }
    }
  }

  /**
   * Interaction avec un PNJ (proximité vérifiée): avance les objectifs
   * « talk », rend les quêtes complètes, distribue les récompenses à
   * l'entité vivante (le QuestManager écrit déjà en base).
   */
  async handleNpcInteract(client: { getCharacterId(): string | null }, npcId: string): Promise<{
    success: boolean; error?: string; completed?: string[]; startedDialogue?: string;
  }> {
    try {
      const characterId = client.getCharacterId();
      const player = characterId ? this.worldManager.getPlayer(characterId) : null;
      if (!characterId || !player) return { success: false, error: 'Non authentifié' };

      // Proximité au PNJ (30 m) — données NPC depuis la base (cache 60 s)
      const npc = await this.loadNpc(npcId);
      if (!npc) return { success: false, error: 'PNJ inconnu' };
      const d = Math.hypot(npc.positionX - player.position.x, npc.positionZ - player.position.z);
      if (d > 30) return { success: false, error: `Trop loin du PNJ (${Math.round(d)} m)` };

      const qm = QuestManager.getInstance();
      const completed: string[] = [];

      // 1) Avancer les objectifs « talk » visant ce PNJ
      const inProgress = await qm.getQuestProgress(characterId);
      for (const progress of inProgress) {
        const quest = (progress as any).quest;
        const objectives = (quest?.objectives ?? []) as Array<{ type: string; count: number; targetId?: string }>;
        for (let i = 0; i < objectives.length; i++) {
          const obj = objectives[i];
          if (obj.type === 'talk' && obj.targetId === npcId) {
            const done = ((progress.progress as any)?.[i] ?? 0) >= obj.count;
            if (!done) {
              await qm.updateQuestProgress(characterId, quest.id, i, 1);
            }
          }
        }
      }

      // 2) Rendre les quêtes dont les objectifs sont remplis et qui se
      // terminent chez ce PNJ (récompenses vers l'entité vivante)
      const refreshed = await qm.getQuestProgress(characterId);
      for (const progress of refreshed) {
        const quest = (progress as any).quest;
        const endsAt = (quest?.endsAt ?? []) as string[];
        if (!endsAt.includes(npcId)) continue;
        const objectives = (quest?.objectives ?? []) as Array<{ count: number }>;
        const allDone = objectives.every((_o, i) => ((progress.progress as any)?.[i] ?? 0) >= _o.count);
        if (!allDone) continue;
        try {
          const rewards = (quest.rewards ?? {}) as { exp?: number; sp?: number; gold?: number };
          await qm.completeQuest(characterId, quest.id);
          // Miroir vers l'entité en jeu (le QuestManager a écrit en base)
          if (rewards.exp) player.addExp(Math.round(rewards.exp * rates.exp));
          if (rewards.sp) player.sp += Math.round(rewards.sp * rates.sp);
          if (rewards.gold) player.addGold(Math.round(rewards.gold * rates.gold));
          completed.push(quest.name);
          this.sendToPlayerRaw(characterId, 'quest:completed', {
            questName: quest.name, rewards,
          });
        } catch { /* déjà complétée ou non éligible */ }
      }
      this.sendPlayerState(characterId);
      return { success: true, completed, startedDialogue: npc.dialogue ?? undefined };
    } catch (error) {
      logger.error('handleNpcInteract error:', error);
      return { success: false, error: 'Erreur serveur' };
    }
  }

  private npcCache: Map<string, { positionX: number; positionZ: number; dialogue: string | null; at: number }> = new Map();

  private async loadNpc(npcId: string): Promise<{ positionX: number; positionZ: number; dialogue: string | null } | null> {
    const cached = this.npcCache.get(npcId);
    if (cached && Date.now() - cached.at < 60000) {
      return { positionX: cached.positionX, positionZ: cached.positionZ, dialogue: cached.dialogue };
    }
    const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
    if (!npc) return null;
    this.npcCache.set(npcId, { positionX: npc.positionX, positionZ: npc.positionZ, dialogue: npc.dialogue, at: Date.now() });
    return { positionX: npc.positionX, positionZ: npc.positionZ, dialogue: npc.dialogue };
  }

  // ============================================
  // HELPERS RÉSEAU
  // ============================================

  private serializeMonster(m: MonsterEntity): Record<string, unknown> {
    return {
      id: m.id,
      entityType: 'monster',
      name: m.name,
      level: m.level,
      hp: m.hp,
      maxHp: m.maxHp,
      // modelId serveur = stem BSR officiel (ex: mob_mangnyang → mangnyang)
      modelId: m.modelId,
      position: m.position,
      rotation: m.rotation,
    };
  }

  private broadcastToNearby(position: { x: number; y: number; z: number }, packet: S2CPacket): void {
    const entities = globalSpatialManager.getEntitiesInAOI(position);
    for (const entity of entities) {
      if (entity.type === 'player') {
        this.sendToPlayer(entity.id, packet);
      }
    }
  }

  private sendToPlayer(playerId: string, packet: S2CPacket): void {
    this.worldManager.emit('sendToClient', { playerId, packet });
  }

  /** Envoi d'un évènement brut (équipement, notifications hors protocole packets). */
  sendToPlayerRaw(playerId: string, event: string, data: unknown): void {
    this.worldManager.emit('sendToClient', { playerId, event, data });
  }
}
