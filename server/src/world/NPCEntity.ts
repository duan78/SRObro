/**
 * SRObro - NPC Entity Class
 * Represents a non-player character (shop, storage, stable, etc.)
 */

import { Entity } from './Entity';
import { Position, EntityType, NPC } from '@srobro/shared';
import { createLogger } from '../core/Logger';

const logger = createLogger('NPCEntity');

/**
 * NPC type
 */
export enum NPCEntityType {
  SHOP = 'shop',
  STORAGE = 'storage',
  STABLE = 'stable',
  QUEST = 'quest',
  TELEPORT = 'teleport',
  EXCHANGE = 'exchange',
  GUILD = 'guild',
  UNION = 'union',
  JOB = 'job',
}

/**
 * NPC entity options
 */
export interface NPCEntityOptions {
  id: string;
  name: string;
  npcType: NPCEntityType;
  position: Position;
  rotation: number;
  modelId: string;
  zoneId: string;
  dialogue?: string[];
  shopItems?: string[];
}

/**
 * NPC Entity class
 */
export class NPCEntity extends Entity {
  public readonly npcType: NPCEntityType;
  public dialogue: string[];
  public shopItems: string[];

  constructor(options: NPCEntityOptions) {
    super({
      id: options.id,
      name: options.name,
      type: EntityType.NPC,
      level: 1,
      position: options.position,
      rotation: options.rotation,
      modelId: options.modelId,
      zoneId: options.zoneId,
    });

    this.npcType = options.npcType;
    this.dialogue = options.dialogue || [];
    this.shopItems = options.shopItems || [];

    logger.info(`NPC entity created: ${this.name}`, {
      id: this.id,
      type: this.npcType,
    });
  }

  /**
   * Interact with player
   */
  interact(playerId: string): { dialogue: string[]; actions: string[] } {
    const actions: string[] = [];

    // Determine available actions based on NPC type
    switch (this.npcType) {
      case NPCEntityType.SHOP:
        actions.push('open_shop');
        break;
      case NPCEntityType.STORAGE:
        actions.push('open_storage');
        break;
      case NPCEntityType.STABLE:
        actions.push('open_stable');
        break;
      case NPCEntityType.QUEST:
        actions.push('open_quest');
        break;
      case NPCEntityType.TELEPORT:
        actions.push('open_teleport');
        break;
      case NPCEntityType.EXCHANGE:
        actions.push('open_exchange');
        break;
      case NPCEntityType.GUILD:
        actions.push('open_guild');
        break;
      case NPCEntityType.JOB:
        actions.push('open_job');
        break;
    }

    logger.debug(`NPC interacted: ${this.name} by player ${playerId}`, {
      actions,
    });

    this.emit('interact', {
      npcId: this.id,
      playerId,
      actions,
    });

    return {
      dialogue: this.dialogue,
      actions,
    };
  }

  /**
   * Get shop items
   */
  getShopItems(): string[] {
    if (this.npcType !== NPCEntityType.SHOP) {
      return [];
    }
    return [...this.shopItems];
  }

  /**
   * Check if NPC is shop type
   */
  isShop(): boolean {
    return this.npcType === NPCEntityType.SHOP;
  }

  /**
   * Check if NPC is storage type
   */
  isStorage(): boolean {
    return this.npcType === NPCEntityType.STORAGE;
  }

  /**
   * Check if NPC is stable type
   */
  isStable(): boolean {
    return this.npcType === NPCEntityType.STABLE;
  }

  /**
   * Check if NPC is quest type
   */
  isQuest(): boolean {
    return this.npcType === NPCEntityType.QUEST;
  }

  /**
   * Check if NPC is teleport type
   */
  isTeleport(): boolean {
    return this.npcType === NPCEntityType.TELEPORT;
  }

  /**
   * Serialize for network
   */
  serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      npcType: this.npcType,
      dialogue: this.dialogue,
    };
  }
}

/**
 * Create NPCEntity from shared NPC type
 */
export function createNPCEntityFromShared(npc: NPC, zoneId: string): NPCEntity {
  return new NPCEntity({
    id: npc.id,
    name: npc.name,
    npcType: npc.npcType as NPCEntityType,
    position: npc.position,
    rotation: npc.rotation,
    modelId: npc.modelId,
    zoneId,
    dialogue: npc.dialogue,
    shopItems: npc.shopItems,
  });
}
