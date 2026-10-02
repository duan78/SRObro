/**
 * SRObro - ProbabilityCalculator
 * TAUX OFFICIELS dépackés de la DB serveur vSRO (extraction binaire 2026-10,
 * validée indépendamment par SroCave sur 30 000 essais — cf.
 * docs/SRO_KNOWLEDGE_BASE/05_ALCHEMY_SYSTEM.md §Données Vérifiées).
 *
 * Élixir seul (cible +1→+12): 50 / 40 / 30 / 19 / 17 / 12 / 12 / 12...
 * Lucky Powder (ADDITIF, par degré de cible): +50 / +30 / +20 / +8 puis +8
 *   → totaux: 100 / 70 / 50 / 27 / 25 / 20 / 20...
 * Échec cible ≤ +4 → RESET à +0 (l'item survit).
 * Échec cible ≥ +5 → 50% DESTRUCTION / 50% survie au même + (malus
 *   durabilité officiel — non modélisé: l'item garde son +).
 * Pas de critique d'enhancement dans les données officielles (supprimé).
 */

export type ElixirType = 'weapon' | 'armor' | 'shield' | 'accessory';
export type LuckyPowderGrade = null;

export interface AlchemyProbability {
  baseSuccessRate: number;
  finalSuccessRate: number;
  destructionRate: number;
}

/** Taux de base par PLUS CIBLE (identique pour tous les types d'élixir). */
const BASE_BY_TARGET: readonly number[] = [
  0.50, 0.40, 0.30, 0.19, 0.17, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12,
]; // index 0 = cible +1 … index 11 = cible +12

/** Bonus additif du Lucky Powder par PLUS CIBLE (degré 1→5 puis +8 plat). */
const POWDER_BONUS_BY_TARGET: readonly number[] = [
  0.50, 0.30, 0.20, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08,
];

export class ProbabilityCalculator {
  static calculate(
    _currentPlus: number,
    targetPlus: number,
    _elixirType: ElixirType,
    usePowder = false,
  ): AlchemyProbability {
    if (targetPlus < 1 || targetPlus > 12) {
      throw new Error(`Plus cible invalide: ${targetPlus}`);
    }
    const idx = targetPlus - 1;
    const base = BASE_BY_TARGET[idx];
    const withPowder = Math.min(1, base + (usePowder ? POWDER_BONUS_BY_TARGET[idx] : 0));
    // Destruction: uniquement en échec vers +5 et plus (50% des échecs)
    const destructionRate = targetPlus >= 5 ? 0.5 : 0;
    return {
      baseSuccessRate: base,
      finalSuccessRate: withPowder,
      destructionRate,
    };
  }

  /**
   * Jet d'enhancement officiel.
   * @returns success (+1) / échec (reset +0 si cible ≤4, sinon 50% destruction
   *          ou survie au même +)
   */
  static roll(
    currentPlus: number,
    targetPlus: number,
    elixirType: ElixirType,
    usePowder = false,
    hasProtector = false,
  ): {
    success: boolean;
    destroyed: boolean;
    newPlus: number;
  } {
    const p = this.calculate(currentPlus, targetPlus, elixirType, usePowder);
    if (Math.random() <= p.finalSuccessRate) {
      return { success: true, destroyed: false, newPlus: targetPlus };
    }
    // Échec vers +5 et plus: destruction 50% (Immortal/protector annulent)
    if (targetPlus >= 5 && !hasProtector && Math.random() <= p.destructionRate) {
      return { success: false, destroyed: true, newPlus: 0 };
    }
    // Cible ≤ +4: reset à +0. Cible ≥ +5 non détruite: survit au même +.
    return {
      success: false,
      destroyed: false,
      newPlus: targetPlus <= 4 ? 0 : currentPlus,
    };
  }
}
