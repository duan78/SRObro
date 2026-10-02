// ============================================
// SRObro - PetService (Phase H V2 — loup de croissance officiel)
// KB 24_MOUNTS_PETS: loup blanc/gris 1 000 000 or à l'écurie, louveteau →
// adulte au niveau 40, combat aux côtés du maître, HGP (faim). Montures:
// vitesse ×(base/3) appliquée au joueur (le MountManager ne flipait que
// isActive en base sans entité monde ni vitesse).
// ============================================

import { createLogger } from '../core/Logger';
import type { WorldManager } from './WorldManager';
import type { CombatBridge } from './CombatBridge';
import { globalCombatManager } from '../combat/CombatManager';
import { globalSpatialManager } from '../world/SpatialManager';
import { MonsterEntity } from '../world/MonsterEntity';
import type { Position } from '@srobro/shared';

const logger = createLogger('PetService');

/** Loup officiel (KB 24): 1 000 000 or, croissance jusqu'à adulte (lv 40). */
const WOLF_COST = 1_000_000;
const WOLF_ADULT_LEVEL = 40;
const WOLF_BASE_ATK = 15; // [APROX] attaque de base du louveteau

interface ActivePet {
  ownerId: string;
  name: string;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  atk: { min: number; max: number };
  entity: MonsterEntity; // réutilise le pipeline monstre (rendu/attaque)
  lastAttack: number;
}

export class PetService {
  private static instance: PetService | null = null;
  private pets = new Map<string, ActivePet>(); // ownerId → pet
  private wolvesOwned = new Set<string>(); // characterId → loup possédé (session)

  static getInstance(): PetService {
    if (!PetService.instance) PetService.instance = new PetService();
    return PetService.instance;
  }

  /** Achat du loup (étable, proximité NPC stable requise). */
  buyWolf(ownerId: string, gold: number, stablePos: Position, playerPos: Position): { spent: number } {
    if (this.wolvesOwned.has(ownerId)) throw new Error('Vous avez déjà un loup');
    const d = Math.hypot(stablePos.x - playerPos.x, stablePos.z - playerPos.z);
    if (d > 40) throw new Error(`Trop loin de l'écurie (${Math.round(d)} m)`);
    if (gold < WOLF_COST) throw new Error(`Or insuffisant (${WOLF_COST.toLocaleString('fr')} requis — loup officiel KB 24)`);
    this.wolvesOwned.add(ownerId);
    return { spent: WOLF_COST };
  }

  hasWolf(ownerId: string): boolean {
    return this.wolvesOwned.has(ownerId);
  }

  /** Invoque le loup près du maître (pipeline monstre: rendu + attaques). */
  summonWolf(
    ownerId: string,
    ownerName: string,
    position: Position,
    combatBridge: CombatBridge,
  ): ActivePet {
    if (this.pets.has(ownerId)) throw new Error('Loup déjà invoqué');
    if (!this.wolvesOwned.has(ownerId)) throw new Error("Vous n'avez pas de loup (achat à l'écurie)");

    const level = 1;
    const maxHp = 100;
    const entity = new MonsterEntity({
      id: `pet_wolf_${ownerId}`,
      name: `Loup de ${ownerName}`,
      level,
      hp: maxHp, maxHp,
      mp: 0, maxMp: 0,
      attackPower: { min: WOLF_BASE_ATK, max: WOLF_BASE_ATK + 5 },
      defense: 5, magicalDefense: 5,
      exp: 0, sp: 0,
      aggroRange: 0, // docile: n'attaque que la cible du maître
      attackRange: 3, moveSpeed: 5, attackSpeed: 1500,
      respawnTime: Number.MAX_SAFE_INTEGER,
      position: { x: position.x + 2, y: position.y, z: position.z },
      rotation: 0,
      modelId: 'wolf',
      zoneId: 'jangan',
      spawnId: 'pet',
    });
    globalSpatialManager.addEntity({ id: entity.id, position: entity.position, type: 'monster', zoneId: entity.zoneId });
    // Rendu client via le pipeline spawn standard
    combatBridge.sendToPlayerRaw(ownerId, 'spawn', {
      id: entity.id, entityType: 'monster', name: entity.name, level,
      hp: maxHp, maxHp, modelId: 'wolf', position: entity.position, rotation: 0,
    });

    const pet: ActivePet = {
      ownerId, name: entity.name, level, exp: 0,
      hp: maxHp, maxHp,
      atk: { min: WOLF_BASE_ATK, max: WOLF_BASE_ATK + 5 },
      entity, lastAttack: 0,
    };
    this.pets.set(ownerId, pet);
    logger.info(`Loup invoqué pour ${ownerName} (lv ${level})`);
    return pet;
  }

  dismissWolf(ownerId: string, combatBridge: CombatBridge): void {
    const pet = this.pets.get(ownerId);
    if (!pet) throw new Error('Aucun loup invoqué');
    globalSpatialManager.removeEntity(pet.entity.id);
    combatBridge.sendToPlayerRaw(ownerId, 'despawn', { id: pet.entity.id });
    this.pets.delete(ownerId);
  }

  getPet(ownerId: string): ActivePet | null {
    return this.pets.get(ownerId) ?? null;
  }

  /**
   * Tick: le loup suit son maître et ATTAQUE sa cible (comportement
   * officiel: growth pet combat aux côtés du joueur).
   */
  update(worldManager: WorldManager, combatBridge: CombatBridge, dtSec: number): void {
    void combatBridge; void dtSec;
    for (const pet of this.pets.values()) {
      const owner = worldManager.getPlayer(pet.ownerId);
      if (!owner) continue;
      // Suivre (téléport fluide si trop loin — pas de pathfinding)
      const d = Math.hypot(owner.position.x - pet.entity.position.x, owner.position.z - pet.entity.position.z);
      if (d > 6) {
        pet.entity.position = { x: owner.position.x - 2, y: owner.position.y, z: owner.position.z - 2 };
        globalSpatialManager.updateEntityPosition(pet.entity.id, pet.entity.position);
      }
      // Attaquer la cible du maître (portée 4 m, CD 1,5 s)
      const target = (owner as unknown as { currentTargetId?: string }).currentTargetId;
      if (target && Date.now() - pet.lastAttack > 1500) {
        const victim = worldManager.getEntityById(target);
        if (victim && victim.isAlive()) {
          const dt2 = Math.hypot(victim.position.x - pet.entity.position.x, victim.position.z - pet.entity.position.z);
          if (dt2 <= 4) {
            pet.lastAttack = Date.now();
            const ownerLv = owner.level;
            globalCombatManager.startCombat(
              { id: pet.entity.id, name: pet.entity.name, level: pet.level, hp: pet.hp, maxHp: pet.maxHp, mp: 0, maxMp: 0, stats: { attackPower: { min: pet.atk.min + ownerLv * 3, max: pet.atk.max + ownerLv * 3 }, magicalAttackPower: { min: 0, max: 0 }, defense: 5, magicalDefense: 5, parryRatio: 5, blockRatio: 0, criticalChance: 5, attackRating: (pet.level + ownerLv) * 10 }, position: pet.entity.position } as never,
              worldManager.toCombatParticipant(victim),
            );
            const result = globalCombatManager.processAttack(pet.entity.id, target, 'physical', 0);
            if (result && 'setHp' in victim) {
              (victim as unknown as { setHp(n: number): void }).setHp(result.targetHp);
              // Diffuser aux joueurs proches + maître
              combatBridge.sendToPlayerRaw(pet.ownerId, 'attack', {
                attackerId: pet.entity.id, targetId: target, skillId: null,
                damage: result.damage, isCritical: result.isCritical, isBlocked: result.isBlocked,
                remainingHp: result.targetHp,
              } as never);
            }
          }
        }
      }
    }
  }

  /**
   * XP du loup sur les kills du maître (croissance officielle: lv 40 adulte).
   * Niveau = f(kills): ~30 kills/niveau [APROX courbe simple].
   */
  onOwnerKill(ownerId: string, combatBridge: CombatBridge): void {
    const pet = this.pets.get(ownerId);
    if (!pet || pet.level >= WOLF_ADULT_LEVEL) return;
    pet.exp += 1;
    if (pet.exp >= 30) {
      pet.exp = 0;
      pet.level++;
      pet.maxHp += 20;
      pet.hp = pet.maxHp;
      pet.atk = { min: pet.atk.min + 4, max: pet.atk.max + 5 };
      combatBridge.sendToPlayerRaw(ownerId, 'pet:levelup', {
        name: pet.name, level: pet.level,
        adult: pet.level >= WOLF_ADULT_LEVEL,
      });
      logger.info(`${pet.name} passe niveau ${pet.level}${pet.level >= WOLF_ADULT_LEVEL ? ' (ADULTE)' : ''}`);
    }
  }

  /** Vitesse de monture officielle: cheval ~2× la marche (KB 24) —
   *  appliquée au multiplicateur de vitesse du joueur. */
  mountSpeedMultiplier(baseSpeed: number): number {
    return Math.max(1, baseSpeed / 3);
  }
}

export { WOLF_COST, WOLF_ADULT_LEVEL };
