/**
 * SRObro — OfficialFormulas
 * Formules de combat Silkroad Online DOCUMENTÉES et SOURCÉES.
 *
 * Source: docs/SRO_KNOWLEDGE_BASE/28_ADVANCED_MECHANICS.md
 *  - Formule elitepvpers 412387 (structure validée par 2 sources indépendantes)
 *  - Balance physique/magique (M = max(STR×1.29, INT))
 *  - Crit = 2×PHY + MAG (uniquement PHY doublée; seules 14 séries de skills
 *    peuvent critiquer — aucun nuke/imbue, données skilldata 2026-10)
 *  - AR/PR: position du jet dans la range min-max (pas de "miss")
 *  - Block: % direct du bouclier, quasi-annulation du coup
 *  - HP/MP: Max HP = 20×lvl + STR×8 + INT×2 (evolex.dev)
 *
 * Toute valeur marquée [APROX] est une interpolation raisonnée d'un
 * comportement documenté qualitativement (jamais publiée en formule exacte).
 */

/** Constantes globales de conversion (reconstructions tests joueurs, fiables). */
export const PHY_MULTIPLIER = 1.276772606;
export const MAG_MULTIPLIER = 1.287004542;

export interface BalanceStats {
  str: number;
  int: number;
}

/** Balances physiques/magiques en % (100 = neutre). */
export function physicalBalance({ str, int: intStat }: BalanceStats): number {
  const m = Math.max(str * 1.29, intStat);
  return (100 * str) / m;
}

export function magicalBalance({ str, int: intStat }: BalanceStats): number {
  const m = Math.max(str * 1.29, intStat);
  return (100 * intStat) / m;
}

/** Max HP officiel (formule linéaire moderne, evolex.dev). */
export function maxHp(level: number, str: number, intStat: number): number {
  return 20 * level + str * 8 + intStat * 2;
}

/** Max MP officiel. */
export function maxMp(level: number, str: number, intStat: number): number {
  return 20 * level + str * 2 + intStat * 8;
}

/**
 * Jet de dégâts dans la range [min,max] pondéré AR vs PR.
 * AR élevé → jet proche du MAX ; PR adverse → tire vers le MIN.
 * [APROX] interpolation continue du comportement documenté (exemple 80~112).
 */
export function rollDamageInRange(min: number, max: number, attackRating: number, parryRatio: number): number {
  if (max <= min) return min;
  const total = attackRating + parryRatio;
  const bias = total > 0 ? (attackRating - parryRatio) / total : 0; // −1..1
  const noise = Math.random() * 0.5 - 0.25;
  const t = Math.max(0, Math.min(1, 0.5 + 0.5 * bias + noise));
  return Math.round(min + t * (max - min));
}

export interface SkillDamageInput {
  /** Attaque de base de l'attaquant (arme + renfort stat). */
  baseAttack: { min: number; max: number };
  /** Puissance fixe de la skill (part fixe min~max du skilldata officiel). */
  skillPow: { min: number; max: number };
  /** Niveau de maîtrise concerné → mastery_incr = 1 + lv/100 (ex: mastery 90 → 1.90). */
  masteryLevel: number;
  /** % de la skill (att_pct, FIXE par série: 143 → 1.43). */
  skillPct: number;
  /** Défenses de la cible. */
  physDefense: number;
  magDefense: number;
  /** Balance de l'attaquant (0-100). */
  physBalancePct: number;
  magBalancePct: number;
  /** Type de dégâts: 5=physique, 8=imbue (magique), 10=magique. */
  attKind: number;
  /** Puissance d'imbue équipée (min~max), optionnelle. */
  imbuePow?: { min: number; max: number } | null;
  /** Multiplicateurs de buffs/passifs (ex: 1.18). */
  buffMult?: number;
  /** Jets AR (attaquant) et PR (défenseur) pour la position dans les ranges. */
  attackRating?: number;
  parryRatio?: number;
}

export interface SkillDamageOutput {
  physical: number;
  magical: number;
  total: number;
}

/**
 * Formule de dégâts complète (elitepvpers 412387):
 *   PHY = [(base + skill_pow × mastery_incr − physDef) × balance × skill_mult × buffs × 1.2767]
 *   MAG = [((base + imbue) × mastery_incr − magDef) × balance × skill_mult × buffs × 1.2870]
 */
export function computeSkillDamage(input: SkillDamageInput): SkillDamageOutput {
  const masteryIncr = 1 + input.masteryLevel / 100;
  const skillMult = Math.max(input.skillPct, 1) / 100;
  const buffs = input.buffMult ?? 1;
  const ar = input.attackRating ?? 0;
  const pr = input.parryRatio ?? 0;

  const baseRoll = rollDamageInRange(input.baseAttack.min, input.baseAttack.max, ar, pr);
  const skillRoll = rollDamageInRange(input.skillPow.min, input.skillPow.max, ar, pr);

  let physical = 0;
  let magical = 0;

  if (input.attKind === 5) {
    // Skill physique: base + skill_pow×mastery − def
    physical = Math.max(
      1,
      Math.round(
        (baseRoll + skillRoll * masteryIncr - input.physDefense) *
          (input.physBalancePct / 100) * skillMult * buffs * PHY_MULTIPLIER,
      ),
    );
    // Composante magique = imbue (si équipée): dégâts d'imbue scalés par le % de la skill
    if (input.imbuePow) {
      const imbueRoll = rollDamageInRange(input.imbuePow.min, input.imbuePow.max, ar, pr);
      magical = Math.max(
        0,
        Math.round(
          (imbueRoll * masteryIncr - input.magDefense) *
            (input.magBalancePct / 100) * skillMult * buffs * MAG_MULTIPLIER,
        ),
      );
    }
  } else {
    // Skill magique (nuke) ou imbue (attKind 8/10)
    const imbueRoll = input.imbuePow
      ? rollDamageInRange(input.imbuePow.min, input.imbuePow.max, ar, pr)
      : 0;
    magical = Math.max(
      1,
      Math.round(
        ((baseRoll + skillRoll + imbueRoll) * masteryIncr - input.magDefense) *
          (input.magBalancePct / 100) * skillMult * buffs * MAG_MULTIPLIER,
      ),
    );
  }

  return { physical, magical, total: physical + magical };
}

/**
 * Coup critique: SEULE la partie physique double (2×PHY + MAG).
 * Réservé aux attaques normales + séries portant le tag crit du skilldata
 * (14 séries; les nukes/imbues ne critiquent PAS — données 2026-10).
 */
export function applyCritical(dmg: SkillDamageOutput): number {
  return 2 * dmg.physical + dmg.magical;
}

/**
 * Blocage bouclier: % direct de chance; le coup bloqué est quasi-annulé
 * (réduction 90% [APROX: "réduit drastiquement/annule"]), effet réduit sur
 * les nukes. Prioritaire sur le parry.
 */
export function rollBlock(
  blockRatio: number,
  damageType: 'physical' | 'magical',
): { blocked: boolean; factor: number } {
  const effective = damageType === 'magical' ? blockRatio / 3 : blockRatio; // [APROX] effet réduit sur nukes
  if (Math.random() * 100 < effective) {
    return { blocked: true, factor: 0.1 };
  }
  return { blocked: false, factor: 1 };
}

/**
 * Système de GAP (écart niveau perso ↔ mastery): ±10%/niveau.
 * Gap 9 = maximum utile: 10% XP / 190% SP (mesures DE 2006 + UnKnoWnCheaTs).
 * docs/SRO_KNOWLEDGE_BASE/26_SP_FARMING.md
 */
export function gapMultipliers(characterLevel: number, highestMasteryLevel: number): { gap: number; expMult: number; spMult: number } {
  const gap = Math.max(0, Math.min(9, characterLevel - highestMasteryLevel));
  return {
    gap,
    expMult: Math.max(0.1, 1 - 0.1 * gap),
    spMult: 1 + 0.1 * gap,
  };
}
