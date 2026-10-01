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
    });

    logger.info('CombatBridge initialisé');
  }

  // ============================================
  // SNAPSHOT MONDE (à la connexion / sélection de perso)
  // ============================================

  sendWorldSnapshot(playerId: string): void {
    const player = this.worldManager.getPlayer(playerId);
    if (!player) return;
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

  private async onMonsterDeath(victimId: string, killerId: string): Promise<void> {
    try {
      const killer = this.worldManager.getPlayer(killerId);
      const monster = globalSpawnManager.getMonsterEntity(victimId);
      if (!monster) return;

      // Journal de kill (console admin, phase 6)
      try {
        await prisma.killLog.create({
          data: { killerId, victimId, victimType: 'MONSTER', damage: monster.maxHp },
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
    // nextLevelExp: courbe officielle branchée en phase 4 — approximation
    // linéaire basée sur le niveau courant pour la barre d'XP du HUD.
    const nextLevelExp = 100 + (player.level * player.level * 40);
    this.sendToPlayer(characterId, {
      type: 'player:state',
      timestamp: Date.now(),
      data: {
        hp: player.hp, maxHp: player.maxHp,
        mp: player.mp, maxMp: player.maxMp,
        level: player.level, exp: player.exp, nextLevelExp,
        sp: player.sp, gold: player.gold,
        str: player.str, int: player.int,
        statPoints: player.statPoints,
        position: player.position,
      },
    });
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
}
