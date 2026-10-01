/**
 * SRObro - Skill Manager
 * Handles skill casting, cooldowns, queues, and validation
 */

import { Skill } from '@srobro/shared';
import { createLogger } from '../core/Logger';

const logger = createLogger('SkillManager');

/**
 * Skill execution state
 */
export enum SkillState {
  IDLE = 'idle',
  CASTING = 'casting',
  EXECUTING = 'executing',
  COOLDOWN = 'cooldown',
}

/**
 * Active skill information
 */
export interface ActiveSkill {
  skillId: string;
  state: SkillState;
  castStartTime: number;
  castEndTime: number;
  cooldownEndTime: number;
  targetId?: string;
}

/**
 * Skill execution result
 */
export interface SkillExecutionResult {
  success: boolean;
  reason?: string;
  skillId: string;
  executionTime?: number;
}

/**
 * Skill validation options
 */
export interface SkillValidationOptions {
  currentMp: number;
  currentHp: number;
  targetPosition?: { x: number; y: number; z: number };
  casterPosition: { x: number; y: number; z: number };
  targetId?: string;
}

/**
 * Skill Manager class
 */
export class SkillManager {
  private skills: Map<string, Skill>;
  private activeSkill: ActiveSkill | null = null;
  private skillCooldowns: Map<string, number> = new Map();
  private globalCooldown: number;
  private globalCooldownEndTime: number = 0;

  constructor(skills: Skill[], globalCooldown: number = 1500) {
    this.skills = new Map(skills.map((skill) => [skill.id, skill]));
    this.globalCooldown = globalCooldown;
  }

  /**
   * Add a skill to the manager
   */
  addSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
    logger.debug(`Skill added: ${skill.name} (${skill.id})`);
  }

  /**
   * Remove a skill from the manager
   */
  removeSkill(skillId: string): void {
    this.skills.delete(skillId);
    this.skillCooldowns.delete(skillId);
    logger.debug(`Skill removed: ${skillId}`);
  }

  /**
   * Update a skill
   */
  updateSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
    logger.debug(`Skill updated: ${skill.name} (${skill.id})`);
  }

  /**
   * Get a skill by ID
   */
  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  /**
   * Get all skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Validate if a skill can be cast
   */
  validateSkill(skillId: string, options: SkillValidationOptions): SkillExecutionResult {
    const skill = this.skills.get(skillId);

    if (!skill) {
      return {
        success: false,
        reason: 'Skill not found',
        skillId,
      };
    }

    // Check if currently casting another skill
    if (this.activeSkill && this.activeSkill.state === SkillState.CASTING) {
      return {
        success: false,
        reason: 'Already casting a skill',
        skillId,
      };
    }

    // Check global cooldown
    const now = Date.now();
    if (now < this.globalCooldownEndTime) {
      return {
        success: false,
        reason: `Global cooldown active (${Math.ceil((this.globalCooldownEndTime - now) / 1000)}s remaining)`,
        skillId,
      };
    }

    // Check skill cooldown
    const cooldownEnd = this.skillCooldowns.get(skillId);
    if (cooldownEnd && now < cooldownEnd) {
      return {
        success: false,
        reason: `Skill on cooldown (${Math.ceil((cooldownEnd - now) / 1000)}s remaining)`,
        skillId,
      };
    }

    // Check MP cost
    if (skill.mpCost > options.currentMp) {
      return {
        success: false,
        reason: `Not enough MP (need ${skill.mpCost}, have ${options.currentMp})`,
        skillId,
      };
    }

    // Check HP cost (some skills consume HP)
    // For now, assume no HP cost

    // Check range if target specified
    if (options.targetPosition && options.casterPosition) {
      const distance = this.calculateDistance(options.casterPosition, options.targetPosition);
      if (distance > skill.range) {
        return {
          success: false,
          reason: `Target out of range (distance: ${distance.toFixed(1)}m, range: ${skill.range}m)`,
          skillId,
        };
      }
    }

    return {
      success: true,
      skillId,
    };
  }

  /**
   * Start casting a skill
   */
  startCasting(skillId: string, targetId?: string): SkillExecutionResult {
    const skill = this.skills.get(skillId);

    if (!skill) {
      return {
        success: false,
        reason: 'Skill not found',
        skillId,
      };
    }

    // Passive skills cannot be cast
    if (skill.type === 'passive') {
      return {
        success: false,
        reason: 'Cannot cast passive skills',
        skillId,
      };
    }

    const now = Date.now();
    const castEndTime = now + skill.castTime;

    // Set active skill
    this.activeSkill = {
      skillId,
      state: skill.castTime > 0 ? SkillState.CASTING : SkillState.EXECUTING,
      castStartTime: now,
      castEndTime,
      cooldownEndTime: now + skill.cooldown,
      targetId,
    };

    logger.info(`Started casting skill: ${skill.name}`, {
      skillId,
      castTime: skill.castTime,
      cooldown: skill.cooldown,
    });

    return {
      success: true,
      skillId,
      executionTime: castEndTime,
    };
  }

  /**
   * Execute a skill (after cast time completes)
   */
  executeSkill(skillId: string): SkillExecutionResult {
    const skill = this.skills.get(skillId);

    if (!skill) {
      return {
        success: false,
        reason: 'Skill not found',
        skillId,
      };
    }

    if (!this.activeSkill || this.activeSkill.skillId !== skillId) {
      return {
        success: false,
        reason: 'Skill is not being cast',
        skillId,
      };
    }

    const now = Date.now();

    // Update state
    this.activeSkill.state = SkillState.EXECUTING;
    this.activeSkill.castEndTime = now;

    // Set cooldowns
    this.skillCooldowns.set(skillId, now + skill.cooldown);
    this.globalCooldownEndTime = now + this.globalCooldown;

    logger.info(`Executed skill: ${skill.name}`, {
      skillId,
      cooldown: skill.cooldown,
    });

    return {
      success: true,
      skillId,
      executionTime: now,
    };
  }

  /**
   * Cancel skill casting
   */
  cancelSkill(skillId: string): boolean {
    if (!this.activeSkill || this.activeSkill.skillId !== skillId) {
      return false;
    }

    const skill = this.skills.get(skillId);
    logger.info(`Cancelled skill: ${skill?.name || skillId}`, { skillId });

    // Clear active skill but keep cooldown
    this.activeSkill = null;

    return true;
  }

  /**
   * Interrupt skill casting (e.g., due to damage)
   */
  interruptSkill(): boolean {
    if (!this.activeSkill) {
      return false;
    }

    const skill = this.skills.get(this.activeSkill.skillId);
    logger.info(`Interrupted skill: ${skill?.name || this.activeSkill.skillId}`);

    this.activeSkill = null;

    return true;
  }

  /**
   * Get the currently active skill
   */
  getActiveSkill(): ActiveSkill | null {
    return this.activeSkill;
  }

  /**
   * Get remaining cooldown for a skill (in milliseconds)
   */
  getRemainingCooldown(skillId: string): number {
    const cooldownEnd = this.skillCooldowns.get(skillId);
    if (!cooldownEnd) {
      return 0;
    }

    const remaining = cooldownEnd - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Get remaining global cooldown (in milliseconds)
   */
  getGlobalCooldownRemaining(): number {
    const remaining = this.globalCooldownEndTime - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Get remaining cast time for active skill (in milliseconds)
   */
  getRemainingCastTime(): number {
    if (!this.activeSkill || this.activeSkill.state !== SkillState.CASTING) {
      return 0;
    }

    const remaining = this.activeSkill.castEndTime - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Check if can cast any skill
   */
  canCastAnySkill(): boolean {
    const now = Date.now();

    // Can't cast if currently casting
    if (this.activeSkill && this.activeSkill.state === SkillState.CASTING) {
      return false;
    }

    // Can't cast if global cooldown is active
    if (now < this.globalCooldownEndTime) {
      return false;
    }

    return true;
  }

  /**
   * Update skill manager (called every tick)
   */
  update(): void {
    const now = Date.now();

    // Clear active skill if cast completed
    if (this.activeSkill && this.activeSkill.castEndTime <= now) {
      if (this.activeSkill.state === SkillState.CASTING) {
        // Cast completed, move to executing state
        this.activeSkill.state = SkillState.EXECUTING;
      }
    }

    // Clear active skill after a short delay from execution
    if (this.activeSkill && this.activeSkill.state === SkillState.EXECUTING) {
      const executionDelay = 500; // 500ms after execution to clear
      if (now - this.activeSkill.castEndTime > executionDelay) {
        this.activeSkill = null;
      }
    }
  }

  /**
   * Clear all cooldowns (e.g., on respawn)
   */
  clearAllCooldowns(): void {
    this.skillCooldowns.clear();
    this.globalCooldownEndTime = 0;
    this.activeSkill = null;
    logger.info('All cooldowns cleared');
  }

  /**
   * Calculate distance between two positions
   */
  private calculateDistance(
    pos1: { x: number; y: number; z: number },
    pos2: { x: number; y: number; z: number }
  ): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Get skill info for debugging
   */
  getDebugInfo(): {
    activeSkill: ActiveSkill | null;
    globalCooldownRemaining: number;
    skillCount: number;
  } {
    return {
      activeSkill: this.activeSkill,
      globalCooldownRemaining: this.getGlobalCooldownRemaining(),
      skillCount: this.skills.size,
    };
  }
}

/**
 * Create a SkillManager for a character
 */
export function createCharacterSkillManager(skills: Skill[]): SkillManager {
  return new SkillManager(skills, 1500); // 1.5s GCD
}

/**
 * Create a SkillManager for a monster
 */
export function createMonsterSkillManager(skills: Skill[]): SkillManager {
  return new SkillManager(skills, 2000); // 2s GCD for monsters
}
