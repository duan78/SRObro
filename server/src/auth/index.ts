/**
 * SRObro - Auth Module
 * Exports all auth-related classes and types
 */

export { AuthManager, globalAuthManager } from './AuthManager';
export type { Session, LoginResult, RegistrationResult, ValidationResult, AuthManagerOptions } from './AuthManager';

export { CharacterManager, globalCharacterManager } from './CharacterManager';
export type { CharacterCreationData, CharacterCreationResult, CharacterDeletionResult, CharacterManagerOptions } from './CharacterManager';
