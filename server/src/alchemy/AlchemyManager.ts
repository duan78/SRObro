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
  protector?: boolean;  // Tablet/Stone (Immortal/Steady)
  elixirType?: ElixirType;
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

    // Consommation des matériaux (officiel: 1 élixir du type + 1 pierre de
    // chance si powder — identifiés par nom coréen du client officiel)
    await this.consumeMaterials(characterId, elixirType, !!options.luckyPowder);

    // Taux officiels DB vSRO (2026-10) — powder = flag booléen
    const usePowder = !!options.luckyPowder;
    const probability = ProbabilityCalculator.calculate(currentPlus, targetPlus, elixirType, usePowder);
    const roll = ProbabilityCalculator.roll(currentPlus, targetPlus, elixirType, usePowder, options.protector || false);

    // Create alchemy attempt record
    const attempt = await this.prisma.alchemyAttempt.create({
      data: {
        inventoryItemId,
        characterId,
        targetPlus,
        result: roll.destroyed ? 'destroyed' : (roll.success ? 'success' : 'fail'),
        wasCritical: false, // pas de critique dans les données officielles
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
      critical: false,
      destroyed: roll.destroyed,
      oldPlus: currentPlus,
      newPlus: roll.destroyed ? 0 : roll.newPlus,
      probability: { ...probability, criticalRate: 0 },
      attemptId: attempt.id
    };
  }

  /**
   * Consomme 1 élixir du type + (option) 1 pierre de chance de l'inventaire.
   * Noms coréens officiels du client (extraction items.json):
   *   무기강화주문서(소)/강화 엘릭시르(무기) = élixir d'arme, 행운의 연금석
   *   = pierre de chance (substitut Lucky Powder, non présent dans l'import).
   */
  private async consumeMaterials(characterId: string, elixirType: ElixirType, usePowder: boolean): Promise<void> {
    const namePatterns: Record<ElixirType, string[]> = {
      weapon: ['무기강화주문서', '엘릭시르(무기)'],
      armor: ['방어구강화주문서', '엘릭시르(방어구)'],
      shield: ['방패강화주문서', '엘릭시르(방패)'],
      accessory: ['악세강화주문서', '엘릭시르(장신구)'],
    };
    const needed: Array<{ patterns: string[]; label: string }> = [
      { patterns: namePatterns[elixirType], label: `Élixir (${elixirType})` },
    ];
    if (usePowder) needed.push({ patterns: ['행운의 연금석'], label: 'Pierre de chance' });

    for (const mat of needed) {
      const rows = await this.prisma.inventoryItem.findMany({
        where: {
          characterId,
          quantity: { gte: 1 },
          item: { OR: mat.patterns.map((p) => ({ name: { contains: p } })) },
        },
        orderBy: { quantity: 'desc' },
      });
      const row = rows[0];
      if (!row) {
        throw new Error(`${mat.label} requis (introuvable dans l'inventaire)`);
      }
      if (row.quantity <= 1) {
        await this.prisma.inventoryItem.delete({ where: { id: row.id } });
      } else {
        await this.prisma.inventoryItem.update({
          where: { id: row.id },
          data: { quantity: { decrement: 1 } },
        });
      }
    }
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

    return ProbabilityCalculator.calculate(currentPlus, targetPlus, elixirType, !!luckyPowder);
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
