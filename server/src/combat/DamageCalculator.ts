/**
 * SRObro - Damage Calculator
 * Implements Silkroad Online damage formulas
 *
 * Formulas:
 * - Physical Damage = (Attack - Defense) * Multiplier
 * - Magical Damage = (MagicalAttack - MagicalDefense) * Multiplier
 * - Critical = Damage * 1.5
 * - Blocked = Damage * 0.5
 */

import { DamageType, DamageResult } from '@srobro/shared';
import { createLogger } from '../core/Logger';

const logger = createLogger('DamageCalculator');

/**
 * Attacker stats interface
 */
export interface AttackerStats {
  attackPower: { min: number; max: number };
  magicalAttackPower: { min: number; max: number };
  criticalChance: number; // 0-100
  attackRating: number;
}

/**
 * Defender stats interface
 */
export interface DefenderStats {
  defense: number;
  magicalDefense: number;
  parryRatio: number; // 0-100
  blockRatio: number; // 0-100
  hp: number;
  maxHp: number;
}

/**
 * Damage calculation options
 */
export interface DamageOptions {
  damageType: DamageType;
  skillBonus?: number; // Bonus damage from skills
  defensePenetration?: number; // Ignores this much defense
  criticalBonus?: number; // Bonus critical chance
}

/**
 * Damage calculation result with details
 */
export interface DamageCalculationResult {
  damage: number;
  type: DamageType;
  isCritical: boolean;
  isBlocked: boolean;
  isParried: boolean;
  rawDamage: number;
  defenseIgnored: number;
  mitigation: number;
  targetHp: number;
  targetMp?: number;
}

/**
 * Damage Calculator class
 */
export class DamageCalculator {
  /**
   * Calculate damage between attacker and defender
   */
  static calculateDamage(
    attacker: AttackerStats,
    defender: DefenderStats,
    options: DamageOptions = { damageType: 'physical' }
  ): DamageCalculationResult {
    const { damageType, skillBonus = 0, defensePenetration = 0, criticalBonus = 0 } = options;

    let rawDamage = 0;
    let defense = 0;
    let parryOrBlockRatio = 0;

    // Calculate based on damage type
    if (damageType === 'physical') {
      // Physical damage
      const attackRoll = this.randomBetween(attacker.attackPower.min, attacker.attackPower.max);
      rawDamage = attackRoll + skillBonus;
      defense = Math.max(0, defender.defense - defensePenetration);
      parryOrBlockRatio = defender.parryRatio;
    } else {
      // Magical damage
      const attackRoll = this.randomBetween(attacker.magicalAttackPower.min, attacker.magicalAttackPower.max);
      rawDamage = attackRoll + skillBonus;
      defense = Math.max(0, defender.magicalDefense - defensePenetration);
      parryOrBlockRatio = defender.blockRatio;
    }

    // Calculate damage after defense
    const defenseIgnored = defensePenetration;
    const mitigation = defense;
    let damage = Math.max(1, rawDamage - defense);

    // Roll for critical hit
    const critRoll = Math.random() * 100;
    const effectiveCritChance = attacker.criticalChance + criticalBonus;
    const isCritical = critRoll < effectiveCritChance;

    // Apply critical multiplier
    if (isCritical) {
      damage = Math.floor(damage * 1.5);
    }

    // Roll for block/parry
    const blockRoll = Math.random() * 100;
    const isBlocked = damageType === 'physical' && blockRoll < parryOrBlockRatio;

    // Apply block reduction
    if (isBlocked) {
      damage = Math.floor(damage * 0.5);
    }

    // Parry only applies to physical attacks and is not the same as block
    const isParried = damageType === 'physical' && !isBlocked && blockRoll < (parryOrBlockRatio / 2);

    // Calculate remaining HP
    const targetHp = Math.max(0, defender.hp - damage);

    const result: DamageCalculationResult = {
      damage,
      type: damageType,
      isCritical,
      isBlocked,
      isParried,
      rawDamage,
      defenseIgnored,
      mitigation,
      targetHp,
    };

    logger.debug(`Damage calculated: ${damage} (${damageType})`, {
      rawDamage,
      defense,
      isCritical,
      isBlocked,
      attacker: { attackPower: attacker.attackPower },
      defender: { defense, hpBefore: defender.hp, hpAfter: targetHp },
    });

    return result;
  }

  /**
   * Calculate damage for a skill attack
   */
  static calculateSkillDamage(
    attacker: AttackerStats,
    defender: DefenderStats,
    skillDamage: number,
    skillDamageType: DamageType,
    skillCritBonus: number = 0
  ): DamageCalculationResult {
    return this.calculateDamage(attacker, defender, {
      damageType: skillDamageType,
      skillBonus: skillDamage,
      criticalBonus: skillCritBonus,
    });
  }

  /**
   * Calculate DoT (Damage over Time) damage
   */
  static calculateDotDamage(
    dotDamage: number,
    dotInterval: number,
    totalDuration: number
  ): { totalDamage: number; tickDamage: number; tickCount: number } {
    const tickCount = Math.floor(totalDuration / dotInterval);
    const tickDamage = Math.floor(dotDamage / tickCount);
    const totalDamage = tickDamage * tickCount;

    return {
      totalDamage,
      tickDamage,
      tickCount,
    };
  }

  /**
   * Calculate attack rating difference for hit chance
   */
  static calculateHitChance(
    attackerAttackRating: number,
    defenderDefense: number
  ): { hitChance: number; glancingChance: number; missingChance: number } {
    const ratingDiff = attackerAttackRating - defenderDefense;

    // Base hit chance is 95%
    let hitChance = 95.0;
    let glancingChance = 0.0;
    let missingChance = 5.0;

    // Adjust based on rating difference
    if (ratingDiff > 0) {
      // Higher attack rating = better hit chance
      hitChance = Math.min(100.0, 95.0 + ratingDiff * 0.1);
      missingChance = Math.max(0.0, 5.0 - ratingDiff * 0.05);
    } else if (ratingDiff < 0) {
      // Lower attack rating = worse hit chance
      hitChance = Math.max(50.0, 95.0 + ratingDiff * 0.2);
      glancingChance = Math.min(40.0, Math.abs(ratingDiff) * 0.3);
      missingChance = 100.0 - hitChance - glancingChance;
    }

    return {
      hitChance,
      glancingChance,
      missingChance,
    };
  }

  /**
   * Roll for hit/miss/glancing
   */
  static rollHitOutcome(attackRating: number, defense: number): 'hit' | 'glancing' | 'miss' {
    const chances = this.calculateHitChance(attackRating, defense);
    const roll = Math.random() * 100;

    if (roll < chances.missingChance) {
      return 'miss';
    } else if (roll < chances.missingChance + chances.glancingChance) {
      return 'glancing';
    } else {
      return 'hit';
    }
  }

  /**
   * Calculate HP regeneration
   */
  static calculateHpRegen(level: number, maxHp: number, regenBonus: number = 0): number {
    // Base HP regen is 1% of max HP per 10 seconds
    const baseRegen = Math.floor(maxHp * 0.01);
    const levelBonus = Math.floor(level * 0.5);
    return baseRegen + levelBonus + regenBonus;
  }

  /**
   * Calculate MP regeneration
   */
  static calculateMpRegen(level: number, maxMp: number, regenBonus: number = 0): number {
    // Base MP regen is 1% of max MP per 5 seconds
    const baseRegen = Math.floor(maxMp * 0.01);
    const levelBonus = Math.floor(level * 0.3);
    return baseRegen + levelBonus + regenBonus;
  }

  /**
   * Get random number between min and max (inclusive)
   */
  private static randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Convert DamageCalculationResult to DamageResult (shared type)
   */
  static toDamageResult(result: DamageCalculationResult): DamageResult {
    return {
      damage: result.damage,
      type: result.type,
      isCritical: result.isCritical,
      isBlocked: result.isBlocked,
      targetHp: result.targetHp,
      targetMp: result.targetMp,
    };
  }
}

/**
 * Default stats for different levels (for NPCs/monsters)
 */
export const DefaultMonsterStats = {
  level1: {
    attackPower: { min: 5, max: 10 },
    magicalAttackPower: { min: 3, max: 7 },
    defense: 2,
    magicalDefense: 1,
    parryRatio: 5,
    blockRatio: 0,
    criticalChance: 2,
    attackRating: 10,
  },
  level10: {
    attackPower: { min: 25, max: 40 },
    magicalAttackPower: { min: 15, max: 30 },
    defense: 12,
    magicalDefense: 8,
    parryRatio: 10,
    blockRatio: 5,
    criticalChance: 5,
    attackRating: 50,
  },
  level20: {
    attackPower: { min: 50, max: 80 },
    magicalAttackPower: { min: 30, max: 60 },
    defense: 25,
    magicalDefense: 15,
    parryRatio: 15,
    blockRatio: 10,
    criticalChance: 8,
    attackRating: 100,
  },
  level30: {
    attackPower: { min: 80, max: 120 },
    magicalAttackPower: { min: 50, max: 90 },
    defense: 40,
    magicalDefense: 25,
    parryRatio: 20,
    blockRatio: 15,
    criticalChance: 10,
    attackRating: 150,
  },
  level50: {
    attackPower: { min: 150, max: 220 },
    magicalAttackPower: { min: 100, max: 170 },
    defense: 70,
    magicalDefense: 45,
    parryRatio: 25,
    blockRatio: 20,
    criticalChance: 15,
    attackRating: 250,
  },
  level80: {
    attackPower: { min: 250, max: 380 },
    magicalAttackPower: { min: 170, max: 290 },
    defense: 120,
    magicalDefense: 80,
    parryRatio: 30,
    blockRatio: 25,
    criticalChance: 20,
    attackRating: 400,
  },
  level100: {
    attackPower: { min: 350, max: 500 },
    magicalAttackPower: { min: 250, max: 400 },
    defense: 180,
    magicalDefense: 120,
    parryRatio: 35,
    blockRatio: 30,
    criticalChance: 25,
    attackRating: 550,
  },
  level120: {
    attackPower: { min: 500, max: 700 },
    magicalAttackPower: { min: 350, max: 550 },
    defense: 250,
    magicalDefense: 170,
    parryRatio: 40,
    blockRatio: 35,
    criticalChance: 30,
    attackRating: 700,
  },
};
