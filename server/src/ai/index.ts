/**
 * SRObro - AI Module
 * Exports all AI-related classes and types
 */

export { SpawnManager, globalSpawnManager } from './SpawnManager';
export type { ActiveSpawn, SpawnManagerOptions } from './SpawnManager';

// Note: MonsterAI is implemented within MonsterEntity class in the world module
// The FSM (Finite State Machine) is part of MonsterEntity.updateAI()
