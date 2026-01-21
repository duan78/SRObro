/**
 * SRObro - Combat Module
 * Exports all combat-related classes and types
 */

export { DamageCalculator, DefaultMonsterStats } from './DamageCalculator';
export {
  SkillManager,
  createCharacterSkillManager,
  createMonsterSkillManager,
  ActiveSkill,
  SkillExecutionResult,
  SkillState,
} from './SkillManager';
export {
  CombatManager,
  globalCombatManager,
  CombatSession,
  CombatParticipant,
  DeathInfo,
  DamageEvent,
} from './CombatManager';

// Re-export types
export type {
  AttackerStats,
  DefenderStats,
  DamageOptions,
  DamageCalculationResult,
} from './DamageCalculator';

export type {
  SkillValidationOptions,
} from './SkillManager';

export type {
  CombatManagerOptions,
} from './CombatManager';
