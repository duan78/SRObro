// ============================================
// SRObro - Alchemy Probability Calculator
// Based on official Silkroad Online rates
// ============================================

export interface AlchemyProbability {
  baseSuccessRate: number;
  finalSuccessRate: number;
  criticalRate: number;
  destructionRate: number;
}

export type ElixirType = 'weapon' | 'armor' | 'accessory';
export type LuckyPowderGrade = 'A' | 'B' | 'C' | null;

/**
 * Official Silkroad Online Alchemy Rates
 *
 * +1 to +5: 100% success rate
 * +6: Weapon 60%, Armor 70%, Accessory 65%
 * +7: Weapon 50%, Armor 60%, Accessory 55%
 * +8: Weapon 40%, Armor 50%, Accessory 45%
 * +9: Weapon 30%, Armor 40%, Accessory 35%
 * +10: 20% base for all types
 * +11: 10% base for all types
 * +12: 5% base for all types
 *
 * Critical Success: +2 instead of +1 (5% chance)
 * Destruction: Item destroyed if failed above +6 without protector
 *
 * Lucky Powder Bonuses:
 * - Grade C: +5% success rate
 * - Grade B: +10% success rate
 * - Grade A: +15% success rate
 */
export class ProbabilityCalculator {
  // Base success rates for each + level
  private static readonly BASE_RATES = {
    weapon: {
      1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
      6: 0.60, 7: 0.50, 8: 0.40, 9: 0.30,
      10: 0.20, 11: 0.10, 12: 0.05
    },
    armor: {
      1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
      6: 0.70, 7: 0.60, 8: 0.50, 9: 0.40,
      10: 0.20, 11: 0.10, 12: 0.05
    },
    accessory: {
      1: 1.00, 2: 1.00, 3: 1.00, 4: 1.00, 5: 1.00,
      6: 0.65, 7: 0.55, 8: 0.45, 9: 0.35,
      10: 0.20, 11: 0.10, 12: 0.05
    }
  } as const;

  // Lucky Powder bonus rates
  private static readonly LUCKY_POWDER_BONUS = {
    'C': 0.05,  // +5%
    'B': 0.10,  // +10%
    'A': 0.15   // +15%
  } as const;

  // Critical success rate (constant across all levels)
  private static readonly CRITICAL_RATE = 0.05; // 5%

  /**
   * Calculate alchemy probability for an upgrade attempt
   */
  static calculate(
    currentPlus: number,
    targetPlus: number,
    elixirType: ElixirType,
    luckyPowder: LuckyPowderGrade = null
  ): AlchemyProbability {
    // Validate inputs
    if (currentPlus < 0 || currentPlus > 12) {
      throw new Error(`Invalid current plus level: ${currentPlus}`);
    }
    if (targetPlus !== currentPlus + 1) {
      throw new Error(`Target plus must be current + 1`);
    }
    if (targetPlus > 12) {
      throw new Error(`Cannot upgrade beyond +12`);
    }

    // Get base success rate
    const baseSuccessRate = this.BASE_RATES[elixirType][targetPlus as keyof typeof this.BASE_RATES.weapon];

    // Calculate lucky powder bonus
    const luckyBonus = luckyPowder ? this.LUCKY_POWDER_BONUS[luckyPowder] : 0;

    // Final success rate (capped at 95% max)
    const finalSuccessRate = Math.min(0.95, baseSuccessRate + luckyBonus);

    // Calculate destruction rate (only applies above +6)
    const destructionRate = targetPlus > 6 ? (1 - finalSuccessRate) * 0.5 : 0;

    return {
      baseSuccessRate,
      finalSuccessRate,
      criticalRate: this.CRITICAL_RATE,
      destructionRate
    };
  }

  /**
   * Roll for alchemy success
   * @returns Object containing success, critical, and destruction results
   */
  static roll(
    currentPlus: number,
    targetPlus: number,
    elixirType: ElixirType,
    luckyPowder: LuckyPowderGrade = null,
    hasProtector: boolean = false
  ): {
    success: boolean;
    critical: boolean;
    destroyed: boolean;
    newPlus: number;
  } {
    const probability = this.calculate(currentPlus, targetPlus, elixirType, luckyPowder);

    // Roll for success
    const successRoll = Math.random();
    const success = successRoll <= probability.finalSuccessRate;

    if (!success) {
      // Check for destruction (only above +6 and without protector)
      const destroyed = targetPlus > 6 && !hasProtector && Math.random() <= probability.destructionRate;

      return {
        success: false,
        critical: false,
        destroyed,
        newPlus: destroyed ? 0 : currentPlus // Reset to 0 if destroyed
      };
    }

    // Roll for critical success (+2 instead of +1)
    const criticalRoll = Math.random();
    const critical = criticalRoll <= probability.criticalRate;

    // Critical success adds +2 (if possible), regular success adds +1
    const newPlus = critical ? Math.min(12, targetPlus + 1) : targetPlus;

    return {
      success: true,
      critical,
      destroyed: false,
      newPlus
    };
  }

  /**
   * Get display information about success rates
   */
  static getProbabilityDisplay(
    currentPlus: number,
    targetPlus: number,
    elixirType: ElixirType,
    luckyPowder: LuckyPowderGrade = null
  ): {
    successPercent: number;
    criticalPercent: number;
    destructionPercent: number;
    canDestroy: boolean;
  } {
    const probability = this.calculate(currentPlus, targetPlus, elixirType, luckyPowder);

    return {
      successPercent: Math.round(probability.finalSuccessRate * 100),
      criticalPercent: Math.round(probability.criticalRate * 100),
      destructionPercent: Math.round(probability.destructionRate * 100),
      canDestroy: targetPlus > 6
    };
  }

  /**
   * Get all probabilities for an item type across all + levels
   */
  static getAllProbabilities(elixirType: ElixirType): Record<number, AlchemyProbability> {
    const probabilities: Record<number, AlchemyProbability> = {};

    for (let plus = 0; plus < 12; plus++) {
      probabilities[plus + 1] = this.calculate(plus, plus + 1, elixirType, null);
    }

    return probabilities;
  }
}
