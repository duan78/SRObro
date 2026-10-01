/**
 * SRObro - Combat Manager
 * Manages combat cycles, damage application, death, and respawn
 */

import { DamageCalculator, DamageCalculationResult } from './DamageCalculator';
import { DamageType } from '@srobro/shared';
import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';

const logger = createLogger('CombatManager');

/**
 * Combat state
 */
export enum CombatState {
  IDLE = 'idle',
  FIGHTING = 'fighting',
  DEAD = 'dead',
  RESPawning = 'respawning',
}

/**
 * Combat participant
 */
export interface CombatParticipant {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: {
    attackPower: { min: number; max: number };
    magicalAttackPower: { min: number; max: number };
    defense: number;
    magicalDefense: number;
    parryRatio: number;
    blockRatio: number;
    criticalChance: number;
    attackRating: number;
  };
  position: { x: number; y: number; z: number };
}

/**
 * Combat session
 */
export interface CombatSession {
  id: string;
  attacker: CombatParticipant;
  defender: CombatParticipant;
  startTime: number;
  lastActionTime: number;
  state: CombatState;
}

/**
 * Death info
 */
export interface DeathInfo {
  victimId: string;
  killerId: string;
  deathTime: number;
  respawnTime: number;
  position: { x: number; y: number; z: number };
}

/**
 * Damage event data
 */
export interface DamageEvent {
  attackerId: string;
  defenderId: string;
  damage: number;
  damageType: DamageType;
  isCritical: boolean;
  isBlocked: boolean;
  remainingHp: number;
}

/**
 * Combat Manager options
 */
export interface CombatManagerOptions {
  defaultRespawnTime: number; // seconds
  combatTimeout: number; // milliseconds without action before combat ends
  autoAttackDelay: number; // milliseconds between auto-attacks
}

/**
 * Combat Manager class
 */
export class CombatManager extends EventEmitter {
  private activeCombats: Map<string, CombatSession> = new Map();
  private deathQueue: Map<string, DeathInfo> = new Map();
  private options: CombatManagerOptions;
  private autoAttackTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(options?: Partial<CombatManagerOptions>) {
    super();
    this.options = {
      defaultRespawnTime: 10,
      combatTimeout: 10000, // 10 seconds
      autoAttackDelay: 2000, // 2 seconds
      ...options,
    };
  }

  /**
   * Start combat between two participants
   */
  startCombat(attacker: CombatParticipant, defender: CombatParticipant): string {
    const combatId = this.generateCombatId(attacker.id, defender.id);

    // Check if combat already exists
    const existingCombat = this.activeCombats.get(combatId);
    if (existingCombat) {
      existingCombat.lastActionTime = Date.now();
      return combatId;
    }

    const session: CombatSession = {
      id: combatId,
      attacker,
      defender,
      startTime: Date.now(),
      lastActionTime: Date.now(),
      state: CombatState.FIGHTING,
    };

    this.activeCombats.set(combatId, session);

    logger.info(`Combat started: ${attacker.name} vs ${defender.name}`, {
      combatId,
      attacker: { id: attacker.id, name: attacker.name, hp: attacker.hp },
      defender: { id: defender.id, name: defender.name, hp: defender.hp },
    });

    this.emit('combatStarted', { combatId, attacker, defender });

    return combatId;
  }

  /**
   * Process an attack
   */
  processAttack(
    attackerId: string,
    defenderId: string,
    damageType: DamageType = 'physical',
    skillBonus: number = 0
  ): DamageCalculationResult | null {
    const combatId = this.generateCombatId(attackerId, defenderId);
    const session = this.activeCombats.get(combatId);

    if (!session) {
      logger.warn(`Combat session not found: ${combatId}`);
      return null;
    }

    // Determine attacker and defender
    const isAttacker = session.attacker.id === attackerId;
    const attacker = isAttacker ? session.attacker : session.defender;
    const defender = isAttacker ? session.defender : session.attacker;

    // Check if either is dead
    if (attacker.hp <= 0 || defender.hp <= 0) {
      logger.warn('Cannot attack: attacker or defender is dead');
      return null;
    }

    // Calculate damage
    const result = DamageCalculator.calculateDamage(
      attacker.stats,
      {
        ...defender.stats,
        hp: defender.hp,
        maxHp: defender.maxHp,
      },
      { damageType, skillBonus }
    );

    // Apply damage
    defender.hp = result.targetHp;
    session.lastActionTime = Date.now();

    // Emit damage event
    const damageEvent: DamageEvent = {
      attackerId: attacker.id,
      defenderId: defender.id,
      damage: result.damage,
      damageType: result.type,
      isCritical: result.isCritical,
      isBlocked: result.isBlocked,
      remainingHp: result.targetHp,
    };
    this.emit('damage', damageEvent);

    // Check for death
    if (result.targetHp <= 0) {
      this.handleDeath(combatId, attacker.id, defender.id);
    }

    logger.debug(`Attack processed: ${attacker.name} -> ${defender.name}`, {
      damage: result.damage,
      remainingHp: result.targetHp,
      isCritical: result.isCritical,
      isBlocked: result.isBlocked,
    });

    return result;
  }

  /**
   * Process a skill attack
   */
  processSkillAttack(
    attackerId: string,
    defenderId: string,
    skillDamage: number,
    skillDamageType: DamageType
  ): DamageCalculationResult | null {
    return this.processAttack(attackerId, defenderId, skillDamageType, skillDamage);
  }

  /**
   * Handle death
   */
  private handleDeath(combatId: string, killerId: string, victimId: string): void {
    const session = this.activeCombats.get(combatId);
    if (!session) return;

    const victim = session.attacker.id === victimId ? session.attacker : session.defender;
    const killer = session.attacker.id === killerId ? session.attacker : session.defender;

    // Update combat state
    session.state = CombatState.DEAD;

    // Create death info
    const deathInfo: DeathInfo = {
      victimId: victim.id,
      killerId: killer.id,
      deathTime: Date.now(),
      respawnTime: Date.now() + this.options.defaultRespawnTime * 1000,
      position: { ...victim.position },
    };

    this.deathQueue.set(victimId, deathInfo);

    logger.info(`Death occurred: ${victim.name} killed by ${killer.name}`, {
      victimId: victim.id,
      killerId: killer.id,
      respawnTime: new Date(deathInfo.respawnTime).toISOString(),
    });

    this.emit('death', {
      victimId: victim.id,
      victimName: victim.name,
      killerId: killer.id,
      killerName: killer.name,
      position: deathInfo.position,
      respawnTime: deathInfo.respawnTime,
    });

    // End combat
    this.endCombat(combatId);
  }

  /**
   * End combat
   */
  endCombat(combatId: string): void {
    const session = this.activeCombats.get(combatId);
    if (!session) return;

    logger.info(`Combat ended: ${session.attacker.name} vs ${session.defender.name}`, {
      combatId,
      duration: Date.now() - session.startTime,
    });

    this.activeCombats.delete(combatId);

    // Clear auto-attack timer
    const timer = this.autoAttackTimers.get(combatId);
    if (timer) {
      clearTimeout(timer);
      this.autoAttackTimers.delete(combatId);
    }

    this.emit('combatEnded', { combatId });
  }

  /**
   * Check if entity is in combat
   */
  isInCombat(entityId: string): boolean {
    for (const session of this.activeCombats.values()) {
      if (session.attacker.id === entityId || session.defender.id === entityId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get combat session for an entity
   */
  getCombatSession(entityId: string): CombatSession | undefined {
    for (const session of this.activeCombats.values()) {
      if (session.attacker.id === entityId || session.defender.id === entityId) {
        return session;
      }
    }
    return undefined;
  }

  /**
   * Get opponent ID for an entity
   */
  getOpponentId(entityId: string): string | undefined {
    for (const session of this.activeCombats.values()) {
      if (session.attacker.id === entityId) {
        return session.defender.id;
      } else if (session.defender.id === entityId) {
        return session.attacker.id;
      }
    }
    return undefined;
  }

  /**
   * Update combat manager (called every tick)
   */
  update(): void {
    const now = Date.now();

    // Check for combat timeouts
    for (const [combatId, session] of this.activeCombats.entries()) {
      if (now - session.lastActionTime > this.options.combatTimeout) {
        logger.info(`Combat timed out: ${combatId}`);
        this.endCombat(combatId);
      }
    }

    // Check for respawns
    for (const [victimId, deathInfo] of this.deathQueue.entries()) {
      if (now >= deathInfo.respawnTime) {
        this.handleRespawn(victimId);
      }
    }
  }

  /**
   * Handle respawn
   */
  private handleRespawn(victimId: string): void {
    const deathInfo = this.deathQueue.get(victimId);
    if (!deathInfo) return;

    logger.info(`Respawning entity: ${victimId}`, {
      deathTime: new Date(deathInfo.deathTime).toISOString(),
      respawnTime: new Date(deathInfo.respawnTime).toISOString(),
    });

    this.deathQueue.delete(victimId);

    this.emit('respawn', {
      entityId: victimId,
      deathTime: deathInfo.deathTime,
      respawnTime: deathInfo.respawnTime,
    });
  }

  /**
   * Check if entity is dead
   */
  isDead(entityId: string): boolean {
    return this.deathQueue.has(entityId);
  }

  /**
   * Get death info for an entity
   */
  getDeathInfo(entityId: string): DeathInfo | undefined {
    return this.deathQueue.get(entityId);
  }

  /**
   * Get time until respawn (in milliseconds)
   */
  getTimeUntilRespawn(entityId: string): number {
    const deathInfo = this.deathQueue.get(entityId);
    if (!deathInfo) {
      return 0;
    }

    const remaining = deathInfo.respawnTime - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Force respawn an entity
   */
  forceRespawn(entityId: string): boolean {
    const deathInfo = this.deathQueue.get(entityId);
    if (!deathInfo) {
      return false;
    }

    // Update respawn time to now
    deathInfo.respawnTime = Date.now();
    return true;
  }

  /**
   * Generate combat ID from two entity IDs
   */
  private generateCombatId(id1: string, id2: string): string {
    return [id1, id2].sort().join('-vs-');
  }

  /**
   * Get active combat count
   */
  getActiveCombatCount(): number {
    return this.activeCombats.size;
  }

  /**
   * Get all active combats
   */
  getActiveCombats(): CombatSession[] {
    return Array.from(this.activeCombats.values());
  }

  /**
   * Clear all combats (e.g., on shutdown)
   */
  clearAllCombats(): void {
    logger.info('Clearing all combats', { count: this.activeCombats.size });

    for (const timer of this.autoAttackTimers.values()) {
      clearTimeout(timer);
    }

    this.activeCombats.clear();
    this.autoAttackTimers.clear();
  }
}

/**
 * Create a global combat manager instance
 */
export const globalCombatManager = new CombatManager();
