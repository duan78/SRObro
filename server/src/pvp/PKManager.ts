// ============================================
// SRObro - PK/PVP Manager
// Handles player killing and murder penalties
// ============================================

// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { PK_CONFIG } from '../../../shared/src/constants';

export type MurdererLevel = 0 | 1 | 2 | 3 | 4;

export interface PKStatus {
  pkPoints: number;
  murdererLevel: MurdererLevel;
  penaltyExp: number;
  penaltyTimer: number;
  lastKillAt?: Date;
}

export interface PKPenalty {
  teleportBlock: boolean;
  npcBlock: boolean;
  dropRate: number;
}

export interface PlayerKillResult {
  killerStatus: PKStatus;
  victimStatus: PKStatus;
  wasSelfDefense: boolean;
  pointsGained: number;
  murdererLevelChanged: boolean;
}

/**
 * PKManager - Manages Player Killing system
 *
 * 4 Murderer Levels:
 * 0: Normal (white name) - 0 PK points
 * 1: Murderer 1 (blue name) - 100+ PK points
 * 2: Murderer 2 (purple name) - 500+ PK points
 * 3: Murderer 3 (red name) - 1000+ PK points
 * 4: Murderer 4 (dark red) - 2000+ PK points
 *
 * Penalties increase with murderer level:
 * - Teleport block
 * - NPC service denial
 * - Equipment drop on death
 * - Guard aggro
 */
export class PKManager {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Handle a player kill
   */
  async handlePlayerKill(
    killerId: string,
    victimId: string,
    wasSelfDefense: boolean = false
  ): Promise<PlayerKillResult> {
    // Get or create PK status for both players
    const killerStatus = await this.getOrCreatePKStatus(killerId);
    const victimStatus = await this.getOrCreatePKStatus(victimId);

    // Calculate points to add
    const pointsGained = wasSelfDefense
      ? PK_CONFIG.POINTS_SELF_DEFENSE
      : PK_CONFIG.POINTS_PER_PK;

    // Update killer's PK points
    const newPoints = killerStatus.pkPoints + pointsGained;
    const oldLevel = this.calculateMurdererLevel(killerStatus.pkPoints);
    const newLevel = this.calculateMurdererLevel(newPoints);

    await this.prisma.pKStatus.update({
      where: { characterId: killerId },
      data: {
        pkPoints: newPoints,
        murdererLevel: newLevel,
        lastKillAt: wasSelfDefense ? undefined : new Date()
      }
    });

    return {
      killerStatus: {
        ...killerStatus,
        pkPoints: newPoints,
        murdererLevel: newLevel
      },
      victimStatus,
      wasSelfDefense,
      pointsGained,
      murdererLevelChanged: oldLevel !== newLevel
    };
  }

  /**
   * Get PK status for a character
   */
  async getPKStatus(characterId: string): Promise<PKStatus | null> {
    const status = await this.prisma.pKStatus.findUnique({
      where: { characterId }
    });

    if (!status) {
      return null;
    }

    return {
      pkPoints: status.pkPoints,
      murdererLevel: status.murdererLevel as MurdererLevel,
      penaltyExp: Number(status.penaltyExp),
      penaltyTimer: status.penaltyTimer,
      lastKillAt: status.lastKillAt || undefined
    };
  }

  /**
   * Get or create PK status for a character
   */
  async getOrCreatePKStatus(characterId: string): Promise<PKStatus> {
    let status = await this.prisma.pKStatus.findUnique({
      where: { characterId }
    });

    if (!status) {
      status = await this.prisma.pKStatus.create({
        data: {
          characterId,
          pkPoints: 0,
          murdererLevel: 0,
          penaltyExp: BigInt(0),
          penaltyTimer: 0
        }
      });
    }

    return {
      pkPoints: status.pkPoints,
      murdererLevel: status.murdererLevel as MurdererLevel,
      penaltyExp: Number(status.penaltyExp),
      penaltyTimer: status.penaltyTimer,
      lastKillAt: status.lastKillAt || undefined
    };
  }

  /**
   * Calculate murderer level from PK points
   */
  calculateMurdererLevel(pkPoints: number): MurdererLevel {
    if (pkPoints >= PK_CONFIG.THRESHOLDS.MURDERER_4) return 4;
    if (pkPoints >= PK_CONFIG.THRESHOLDS.MURDERER_3) return 3;
    if (pkPoints >= PK_CONFIG.THRESHOLDS.MURDERER_2) return 2;
    if (pkPoints >= PK_CONFIG.THRESHOLDS.MURDERER_1) return 1;
    return 0;
  }

  /**
   * Get penalties for a murderer level
   */
  getPenalties(murdererLevel: MurdererLevel): PKPenalty {
    return PK_CONFIG.PENALTIES[murdererLevel];
  }

  /**
   * Check if a player can use teleports
   */
  async canUseTeleport(characterId: string): Promise<boolean> {
    const status = await this.getPKStatus(characterId);
    if (!status) return true;

    const penalties = this.getPenalties(status.murdererLevel);
    return !penalties.teleportBlock;
  }

  /**
   * Check if a player can use NPCs
   */
  async canUseNPCs(characterId: string): Promise<boolean> {
    const status = await this.getPKStatus(characterId);
    if (!status) return true;

    const penalties = this.getPenalties(status.murdererLevel);
    return !penalties.npcBlock;
  }

  /**
   * Calculate drop rate on death for a PKer
   */
  async getDropRateOnDeath(characterId: string): Promise<number> {
    const status = await this.getPKStatus(characterId);
    if (!status) return 0;

    const penalties = this.getPenalties(status.murdererLevel);
    return penalties.dropRate;
  }

  /**
   * Handle PK death (drop items, apply penalties)
   */
  async handlePKDeath(characterId: string) {
    const status = await this.getPKStatus(characterId);
    if (!status) return;

    const penalties = this.getPenalties(status.murdererLevel);

    // No penalties for normal players
    if (status.murdererLevel === 0) {
      return {
        shouldDropItems: false,
        droppedItems: [],
        expPenalty: 0
      };
    }

    // Calculate how many items to drop
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: { characterId },
      include: { item: true }
    });

    const equippedItems = await this.prisma.equipment.findUnique({
      where: { characterId }
    });

    const droppableItems = inventoryItems.filter(item =>
      item.item.type !== 'quest' && item.item.rarity !== 'unique'
    );

    const itemsToDrop = Math.ceil(droppableItems.length * penalties.dropRate);
    const droppedItems: string[] = [];

    // Randomly select items to drop
    for (let i = 0; i < itemsToDrop && droppableItems.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * droppableItems.length);
      const item = droppableItems.splice(randomIndex, 1)[0];

      // Delete the item from inventory
      await this.prisma.inventoryItem.delete({
        where: { id: item.id }
      });

      droppedItems.push(item.item.name);
    }

    // Apply exp penalty for higher murderer levels
    const expPenalty = status.murdererLevel >= 2 ? 50000 * status.murdererLevel : 0;

    if (expPenalty > 0) {
      await this.prisma.character.update({
        where: { id: characterId },
        data: {
          exp: {
            decrement: BigInt(expPenalty)
          }
        }
      });
    }

    return {
      shouldDropItems: itemsToDrop > 0,
      droppedItems,
      expPenalty
    };
  }

  /**
   * Reduce PK points over time (called periodically)
   */
  async decayPKPoints(): Promise<void> {
    // Get all PK status records
    const allStatus = await this.prisma.pKStatus.findMany({
      where: {
        pkPoints: { gt: 0 }
      }
    });

    for (const status of allStatus) {
      const newPoints = Math.max(0, status.pkPoints - PK_CONFIG.POINT_DECAY_PER_HOUR);
      const newLevel = this.calculateMurdererLevel(newPoints);

      await this.prisma.pKStatus.update({
        where: { id: status.id },
        data: {
          pkPoints: newPoints,
          murdererLevel: newLevel
        }
      });
    }
  }

  /**
   * Purge PK points (admin command or special item)
   */
  async purgePKPoints(characterId: string): Promise<PKStatus> {
    const status = await this.prisma.pKStatus.update({
      where: { characterId },
      data: {
        pkPoints: 0,
        murdererLevel: 0,
        penaltyExp: BigInt(0),
        penaltyTimer: 0
      }
    });

    return {
      pkPoints: status.pkPoints,
      murdererLevel: status.murdererLevel as MurdererLevel,
      penaltyExp: Number(status.penaltyExp),
      penaltyTimer: status.penaltyTimer,
      lastKillAt: status.lastKillAt || undefined
    };
  }

  /**
   * Get name color for display based on murderer level
   */
  getNameColor(murdererLevel: MurdererLevel): number {
    // Return RGB color values
    switch (murdererLevel) {
      case 0: return 0xFFFFFF; // White
      case 1: return 0x3399FF; // Blue
      case 2: return 0x9933FF; // Purple
      case 3: return 0xFF0000; // Red
      case 4: return 0x8B0000; // Dark Red
    }
  }

  /**
   * Get PK status for display
   */
  async getPKDisplay(characterId: string) {
    const status = await this.getPKStatus(characterId);
    if (!status || status.murdererLevel === 0) {
      return null;
    }

    const penalties = this.getPenalties(status.murdererLevel);

    return {
      murdererLevel: status.murdererLevel,
      pkPoints: status.pkPoints,
      nameColor: this.getNameColor(status.murdererLevel),
      teleportBlocked: penalties.teleportBlock,
      npcBlocked: penalties.npcBlock,
      dropRate: penalties.dropRate,
      canPurge: status.pkPoints > 0
    };
  }
}
