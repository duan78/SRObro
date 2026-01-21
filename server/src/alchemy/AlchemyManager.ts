// ============================================
// SRObro - Alchemy Manager
// Handles item enhancement operations
// ============================================

import { PrismaClient } from '@prisma/client';
import { ProbabilityCalculator, ElixirType, LuckyPowderGrade } from './ProbabilityCalculator';

export interface AlchemyAttemptResult {
  success: boolean;
  critical: boolean;
  destroyed: boolean;
  oldPlus: number;
  newPlus: number;
  probability: {
    baseSuccessRate: number;
    finalSuccessRate: number;
    criticalRate: number;
    destructionRate: number;
  };
  attemptId: string;
}

export interface AlchemyOptions {
  luckyPowder?: LuckyPowderGrade;
  protector?: boolean;  // Tablet/Stone
  elixirType: ElixirType;
}

/**
 * AlchemyManager - Manages all alchemy operations
 *
 * Responsibilities:
 * - Validate alchemy attempts
 * - Execute enhancement rolls
 * - Update item + levels
 * - Track alchemy history
 * - Handle item destruction
 */
export class AlchemyManager {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Attempt to enhance an item by +1 (or +2 on critical)
   */
  async enhanceItem(
    inventoryItemId: string,
    characterId: string,
    options: AlchemyOptions
  ): Promise<AlchemyAttemptResult> {
    // Fetch the inventory item
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: {
        item: true,
        character: true
      }
    });

    if (!inventoryItem) {
      throw new Error('Item not found');
    }

    if (inventoryItem.characterId !== characterId) {
      throw new Error('Item does not belong to this character');
    }

    const currentPlus = inventoryItem.plus;
    const targetPlus = currentPlus + 1;

    // Validate can upgrade
    if (currentPlus >= 12) {
      throw new Error('Item is already at maximum + level (+12)');
    }

    if (currentPlus < 0) {
      throw new Error('Invalid + level');
    }

    // Determine elixir type from item type if not specified
    const elixirType = this.determineElixirType(inventoryItem.item.type, options.elixirType);

    // Calculate probability
    const probability = ProbabilityCalculator.calculate(
      currentPlus,
      targetPlus,
      elixirType,
      options.luckyPowder || null
    );

    // Roll for success
    const roll = ProbabilityCalculator.roll(
      currentPlus,
      targetPlus,
      elixirType,
      options.luckyPowder || null,
      options.protector || false
    );

    // Create alchemy attempt record
    const attempt = await this.prisma.alchemyAttempt.create({
      data: {
        inventoryItemId,
        characterId,
        targetPlus,
        result: roll.destroyed ? 'destroyed' : (roll.success ? 'success' : 'fail'),
        wasCritical: roll.critical,
        wasDestroyed: roll.destroyed,
        usedLuckyPowder: options.luckyPowder || null,
        usedElixir: elixirType,
        usedProtector: options.protector || false
      }
    });

    // Update or delete item based on result
    if (roll.destroyed) {
      // Delete the item
      await this.prisma.inventoryItem.delete({
        where: { id: inventoryItemId }
      });
    } else {
      // Update the + level
      await this.prisma.inventoryItem.update({
        where: { id: inventoryItemId },
        data: {
          plus: roll.newPlus
        }
      });
    }

    return {
      success: roll.success,
      critical: roll.critical,
      destroyed: roll.destroyed,
      oldPlus: currentPlus,
      newPlus: roll.destroyed ? 0 : roll.newPlus,
      probability,
      attemptId: attempt.id
    };
  }

  /**
   * Get alchemy history for a character
   */
  async getAlchemyHistory(characterId: string, limit: number = 50) {
    const attempts = await this.prisma.alchemyAttempt.findMany({
      where: { characterId },
      include: {
        inventoryItem: {
          include: {
            item: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return attempts.map(attempt => ({
      id: attempt.id,
      itemName: attempt.inventoryItem.item.name,
      targetPlus: attempt.targetPlus,
      result: attempt.result,
      wasCritical: attempt.wasCritical,
      wasDestroyed: attempt.wasDestroyed,
      usedLuckyPowder: attempt.usedLuckyPowder,
      usedElixir: attempt.usedElixir,
      usedProtector: attempt.usedProtector,
      timestamp: attempt.timestamp
    }));
  }

  /**
   * Get success statistics for a character
   */
  async getAlchemyStats(characterId: string) {
    const attempts = await this.prisma.alchemyAttempt.findMany({
      where: { characterId }
    });

    const total = attempts.length;
    if (total === 0) {
      return {
        totalAttempts: 0,
        successes: 0,
        fails: 0,
        destroyed: 0,
        criticals: 0,
        successRate: 0
      };
    }

    const successes = attempts.filter(a => a.result === 'success').length;
    const fails = attempts.filter(a => a.result === 'fail').length;
    const destroyed = attempts.filter(a => a.wasDestroyed).length;
    const criticals = attempts.filter(a => a.wasCritical).length;

    return {
      totalAttempts: total,
      successes,
      fails,
      destroyed,
      criticals,
      successRate: Math.round((successes / total) * 100)
    };
  }

  /**
   * Determine elixir type from item type
   */
  private determineElixirType(itemType: string, providedType: ElixirType): ElixirType {
    if (providedType) {
      return providedType;
    }

    // Auto-detect based on item type
    if (itemType === 'weapon' || itemType === 'shield') {
      return 'weapon';
    }
    if (['helmet', 'chest', 'shoulder', 'legs', 'boots'].includes(itemType)) {
      return 'armor';
    }
    if (['ring', 'necklace', 'earring'].includes(itemType)) {
      return 'accessory';
    }

    throw new Error(`Cannot determine elixir type for item type: ${itemType}`);
  }

  /**
   * Get probability preview for an item
   */
  getProbabilityPreview(
    currentPlus: number,
    itemType: string,
    luckyPowder?: LuckyPowderGrade
  ) {
    const elixirType = this.determineElixirType(itemType, 'weapon' as ElixirType);
    const targetPlus = currentPlus + 1;

    if (targetPlus > 12) {
      throw new Error('Already at maximum + level');
    }

    return ProbabilityCalculator.getProbabilityDisplay(
      currentPlus,
      targetPlus,
      elixirType,
      luckyPowder || null
    );
  }

  /**
   * Check if an item can be enhanced
   */
  canEnhanceItem(inventoryItem: { plus: number; item: { type: string } }): {
    canEnhance: boolean;
    reason?: string;
  } {
    if (inventoryItem.plus >= 12) {
      return { canEnhance: false, reason: 'Item is already at maximum +12' };
    }

    if (inventoryItem.plus < 0) {
      return { canEnhance: false, reason: 'Invalid + level' };
    }

    return { canEnhance: true };
  }
}
