/**
 * SRObro - Character Manager
 * Handles character creation, deletion, and management
 */

import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';
import { CharacterRace } from '@srobro/shared';

const logger = createLogger('CharacterManager');

/**
 * Convert a Prisma CharacterRace ('chinese' | 'european') to the shared enum
 */
function toSharedRace(race: string): CharacterRace {
  return race === 'european' ? CharacterRace.EUROPEAN : CharacterRace.CHINESE;
}

/**
 * Character creation data
 */
export interface CharacterCreationData {
  accountId: string;
  name: string;
  race: CharacterRace;
}

/**
 * Character creation result
 */
export interface CharacterCreationResult {
  success: boolean;
  reason?: string;
  character?: {
    id: string;
    name: string;
    race: CharacterRace;
    level: number;
  };
}

/**
 * Character deletion result
 */
export interface CharacterDeletionResult {
  success: boolean;
  reason?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Character Manager options
 */
export interface CharacterManagerOptions {
  maxCharactersPerAccount: number;
  minNameLength: number;
  maxNameLength: number;
  startingLevel: number;
  startingGold: number;
  startingSP: number;
}

/**
 * Default stats by race
 */
const DEFAULT_STATS = {
  chinese: {
    str: 20,
    int: 20,
    hp: 200,
    mp: 100,
    maxHp: 200,
    maxMp: 100,
  },
  european: {
    str: 20,
    int: 20,
    hp: 200,
    mp: 100,
    maxHp: 200,
    maxMp: 100,
  },
};

/**
 * Default spawn position by race
 */
const DEFAULT_SPAWN = {
  chinese: {
    zoneId: 'zone_jangan',
    position: { x: 100, y: 0, z: 100 },
    rotation: 0,
  },
  european: {
    // Départ EU officiel: Constantinople, près de la Dimensional Gate
    // (ancre moteur phase I — bâtiments euro_constan_* région 105x79).
    zoneId: 'zone_constantinople',
    position: { x: 69368, y: 0, z: 15831 },
    rotation: 0,
  },
};

/**
 * Character Manager class
 */
export class CharacterManager extends EventEmitter {
  private options: Required<CharacterManagerOptions>;

  constructor(options?: Partial<CharacterManagerOptions>) {
    super();
    this.options = {
      maxCharactersPerAccount: 4,
      minNameLength: 3,
      maxNameLength: 16,
      startingLevel: 1,
      startingGold: 0,
      startingSP: 0,
      ...options,
    };
  }

  /**
   * Create a new character
   */
  async createCharacter(data: CharacterCreationData): Promise<CharacterCreationResult> {
    // Validate input
    const validation = this.validateCharacterCreation(data);
    if (!validation.valid) {
      return {
        success: false,
        reason: validation.errors.join(', '),
      };
    }

    try {
      // Check character count for account
      const characterCount = await prisma.character.count({
        where: { accountId: data.accountId },
      });

      if (characterCount >= this.options.maxCharactersPerAccount) {
        return {
          success: false,
          reason: `Maximum character limit reached (${this.options.maxCharactersPerAccount})`,
        };
      }

      // Check if name is already taken
      const existingName = await prisma.character.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        return {
          success: false,
          reason: 'Character name already taken',
        };
      }

      // Get default stats for race
      const stats = DEFAULT_STATS[data.race];
      const spawn = DEFAULT_SPAWN[data.race];

      // Create character
      const character = await prisma.character.create({
        data: {
          accountId: data.accountId,
          name: data.name,
          race: data.race,
          level: this.options.startingLevel,
          exp: 0,
          sp: this.options.startingSP,
          hp: stats.hp,
          mp: stats.mp,
          maxHp: stats.maxHp,
          maxMp: stats.maxMp,
          str: stats.str,
          int: stats.int,
          positionX: spawn.position.x,
          positionY: spawn.position.y,
          positionZ: spawn.position.z,
          rotation: spawn.rotation,
          zoneId: spawn.zoneId,
          gold: this.options.startingGold,
          skillPoints: 0,
          statPoints: 0,
          isOnline: false,
        },
      });

      // Create initial equipment record
      await prisma.equipment.create({
        data: {
          characterId: character.id,
        },
      });

      logger.info(`Character created: ${data.name}`, {
        characterId: character.id,
        accountId: data.accountId,
        race: data.race,
      });

      this.emit('characterCreated', {
        characterId: character.id,
        accountId: data.accountId,
        name: data.name,
        race: data.race,
      });

      return {
        success: true,
        character: {
          id: character.id,
          name: character.name,
          race: toSharedRace(character.race),
          level: character.level,
        },
      };
    } catch (error) {
      logger.error('Character creation failed:', error);
      return {
        success: false,
        reason: 'Character creation failed. Please try again.',
      };
    }
  }

  /**
   * Delete a character
   */
  async deleteCharacter(characterId: string, accountId: string): Promise<CharacterDeletionResult> {
    try {
      // Get character
      const character = await prisma.character.findUnique({
        where: { id: characterId },
      });

      if (!character) {
        return {
          success: false,
          reason: 'Character not found',
        };
      }

      // Verify ownership
      if (character.accountId !== accountId) {
        return {
          success: false,
          reason: 'You do not own this character',
        };
      }

      // Check if character is online
      if (character.isOnline) {
        return {
          success: false,
          reason: 'Cannot delete online character',
        };
      }

      // Delete character (cascade will handle related records)
      await prisma.character.delete({
        where: { id: characterId },
      });

      logger.info(`Character deleted: ${character.name}`, {
        characterId,
        accountId,
      });

      this.emit('characterDeleted', {
        characterId,
        accountId,
        name: character.name,
      });

      return {
        success: true,
      };
    } catch (error) {
      logger.error('Character deletion failed:', error);
      return {
        success: false,
        reason: 'Character deletion failed. Please try again.',
      };
    }
  }

  /**
   * Get all characters for an account
   */
  async getAccountCharacters(accountId: string) {
    try {
      const characters = await prisma.character.findMany({
        where: { accountId },
        orderBy: [{ level: 'desc' }, { createdAt: 'asc' }],
      });

      return characters.map((char) => ({
        id: char.id,
        name: char.name,
        race: char.race,
        level: char.level,
        exp: Number(char.exp),
        hp: char.hp,
        maxHp: char.maxHp,
        mp: char.mp,
        maxMp: char.maxMp,
        gold: Number(char.gold),
        zoneId: char.zoneId,
        isOnline: char.isOnline,
        createdAt: char.createdAt,
        lastLoginAt: char.lastLoginAt,
      }));
    } catch (error) {
      logger.error('Failed to get account characters:', error);
      return [];
    }
  }

  /**
   * Get character by ID
   */
  async getCharacter(characterId: string) {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          masteries: {
            include: {
              mastery: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          inventoryItems: {
            include: {
              item: true,
            },
          },
          equipment: true,
        },
      });

      if (!character) {
        return null;
      }

      return {
        id: character.id,
        accountId: character.accountId,
        name: character.name,
        race: character.race,
        level: character.level,
        exp: Number(character.exp),
        sp: Number(character.sp),
        hp: character.hp,
        mp: character.mp,
        maxHp: character.maxHp,
        maxMp: character.maxMp,
        str: character.str,
        int: character.int,
        position: {
          x: character.positionX,
          y: character.positionY,
          z: character.positionZ,
        },
        rotation: character.rotation,
        zoneId: character.zoneId,
        gold: Number(character.gold),
        skillPoints: character.skillPoints,
        statPoints: character.statPoints,
        isOnline: character.isOnline,
        masteries: character.masteries.map((m) => ({
          id: m.masteryId,
          name: m.mastery.name,
          level: m.level,
        })),
        skills: character.skills.map((s) => ({
          id: s.skillId,
          name: s.skill.name,
          level: s.level,
        })),
        inventoryItems: character.inventoryItems.map((item) => ({
          id: item.id,
          itemId: item.itemId,
          slot: item.slot,
          quantity: item.quantity,
          plus: item.plus,
        })),
        createdAt: character.createdAt,
        lastLoginAt: character.lastLoginAt,
      };
    } catch (error) {
      logger.error('Failed to get character:', error);
      return null;
    }
  }

  /**
   * Validate character creation data
   */
  private validateCharacterCreation(data: CharacterCreationData): ValidationResult {
    const errors: string[] = [];

    // Validate name length
    if (data.name.length < this.options.minNameLength) {
      errors.push(`Name must be at least ${this.options.minNameLength} characters`);
    }
    if (data.name.length > this.options.maxNameLength) {
      errors.push(`Name must be at most ${this.options.maxNameLength} characters`);
    }

    // Validate name format
    if (!/^[a-zA-Z0-9_]+$/.test(data.name)) {
      errors.push('Name can only contain letters, numbers, and underscores');
    }

    // Validate name is not a reserved word
    const reservedNames = ['admin', 'moderator', 'gm', 'game', 'master', 'system', 'server'];
    if (reservedNames.includes(data.name.toLowerCase())) {
      errors.push('This name is reserved');
    }

    // Validate race
    if (!Object.values(CharacterRace).includes(data.race)) {
      errors.push('Invalid race');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if character name is available
   */
  async isNameAvailable(name: string): Promise<boolean> {
    try {
      const existing = await prisma.character.findUnique({
        where: { name },
      });

      return !existing;
    } catch (error) {
      logger.error('Failed to check name availability:', error);
      return false;
    }
  }

  /**
   * Get character count for account
   */
  async getCharacterCount(accountId: string): Promise<number> {
    try {
      return await prisma.character.count({
        where: { accountId },
      });
    } catch (error) {
      logger.error('Failed to get character count:', error);
      return 0;
    }
  }

  /**
   * Get online character count
   */
  async getOnlineCharacterCount(): Promise<number> {
    try {
      return await prisma.character.count({
        where: { isOnline: true },
      });
    } catch (error) {
      logger.error('Failed to get online character count:', error);
      return 0;
    }
  }
}

/**
 * Global character manager instance
 */
export const globalCharacterManager = new CharacterManager();
