# Mécaniques Avancées de Silkroad Online

## 📋 Table des Matières
- [Introduction](#introduction)
- [Système d'Attributes (STR / INT)](#système-dattributes-str--int)
- [Balance Physique / Magique](#balance-physique--magique)
- [Attack Rating et Parry Ratio](#attack-rating-et-parry-ratio)
- [Système de Critiques](#système-de-critiques)
- [Formules de Dégâts (formule elitepvpers)](#formules-de-dégâts-formule-elitepvpers)
- [Block et Parry](#block-et-parry)
- [Vitesses (attaque / cast / déplacement)](#vitesses-attaque--cast--déplacement)
- [Vol de vie : Absorb HP / MP](#vol-de-vie--absorb-hp--mp)
- [Socket System](#socket-system)
- [Blue Stats et Alchemy Impact](#blue-stats-et-alchemy-impact)
- [Statistiques Secondaires](#statistiques-secondaires)
- [Notes de Développement SRObro](#notes-de-développement-srobro)
- [Tables de Référence Rapide](#tables-de-référence-rapide)
- [Mythes et Réalités](#mythes-et-réalités)
- [Findings Recherche Communautaire (2025-2026)](#findings-recherche-communautaire-2025-2026)
- [Sources](#sources)

---

## 📚 Introduction

Silkroad Online possède des **mécaniques de combat complexes** qui vont au-delà des simples statistiques. Ce guide couvre les systèmes avancés :

- **Attribute Points** (STR vs INT → Balance)
- **Attack Rating & Parry Ratio** (position du jet de dégâts dans la range)
- **Critical Hits** (2×PHY + MAG)
- **Formule de dégâts complète** (elitepvpers, multi-composants)
- **Block & Parry Mechanics** (bouclier = % direct)
- **Vitesses** (attaque / cast / déplacement)
- **Absorb HP/MP** (vol de vie)

Comprendre ces mécaniques est **crucial** pour :
- Optimiser son build
- PvP efficace
- Farming optimal
- Création de contenu SRObro

> ⚠️ **Note de fiabilité** : les formules ci-dessous proviennent de tests communautaires approfondis (elitepvpers, 2006-2015) et de données clients (RefSkill). Joymax n'a jamais publié de formules officielles. Les constantes numériques exactes (multipliers 1.2767…/1.2870…) sont des reconstructions de tests joueurs réputées fiables.

---

## 💪 Système d'Attributes (STR / INT)

À chaque level-up, le personnage gagne **3 points** à répartir (plus 1 STR et 1 INT automatiques sur le client CH classique ; détails selon version).

### Force (STR)

```
+1 STR :
  +8 HP (via la formule Max HP)
  +2 MP
  +1.29 "poids" dans le calcul du Balance (voir section Balance)
  Augmente l'attaque/défense PHYSIQUE via le Physical Reinforce :
    Physical Attack     += STR × Physical Reinforce (%)
    Physical Defense    += STR × Physical Reinforce (défense)
```

### Intelligence (INT)

```
+1 INT :
  +2 HP
  +8 MP (via la formule Max MP)
  +1.0 "poids" dans le calcul du Balance
  Augmente l'attaque/défense MAGIQUE via le Magical Reinforce :
    Magical Attack      += INT × Magical Reinforce (%)
    Magical Defense     += INT × Magical Reinforce (défense)
```

### Formules dérivées (vérifiées evolex.dev + communauté)

```
Max HP = 20 × Level + STR × 8 + INT × 2  (+ items/buffs)
Max MP = 20 × Level + STR × 2 + INT × 8  (+ items/buffs)

Physical Attack  = STR × Physical Reinforce (+ weapon)
Magical Attack   = INT × Magical Reinforce  (+ weapon)
```

> ❌ **Corrigé (ancienne version de ce doc)** : la STR ne donne PAS « +0.5 Attack Rating » ni « +0.5 Parry Ratio » par point. L'AR/PR vient du **niveau** (+1/level) et des **masteries** (+3/mastery level), voir section dédiée.

### Distribution Recommandée

```
Pure STR : Warriors/Bladers/Glavier/Bow STR — dégâts physiques max, gros crits
Pure INT : Nukers CH, Wizard/Warlock/Bard/Cleric — nukes max, gros MP pool
Hybride 1:1 : ~56%/44% balance — polyvalent
Hybride 2:1 (STR:INT) : bladers/glavier hybrides
```

---

## ⚖️ Balance Physique / Magique

Le **Balance** est le multiplicateur appliqué à chaque composante (PHY ou MAG) des dégâts :

```
Physical Balance (%) = 100 × STR / M
Magical Balance (%)  = 100 × INT / M
où M = max(STR × 1.29, INT)
```

**Exemples :**
- Full STR (442/175) : PHY Balance 100%, MAG Balance ≈ 45%
- Full INT : MAG Balance 100%, PHY Balance ≈ 33%
- 1:1 : ≈ 56% / 44%

**Conséquences gameplay :**
- Un full STR utilise quand même les imbues/nukes avec une réduction ~55% (mais non négligeable)
- Un full INT a des attaques physiques réduites à ~1/3
- **Le critical ne double que la partie PHY** → full STR = crits massifs

---

## ⚔️ Attack Rating et Parry Ratio

### ⚠️ Mécanique réelle (correction majeure)

L'AR et le PR ne sont **PAS** des chances de toucher/esquiver. **Il n'y a pas de "miss"** sur les attaques en SRO classique (l'attaque porte toujours, sauf rupture de portée/LoS) :

- **Attack Rating (attaquant)** : détermine la **position du jet de dégâts dans la range min-max de l'arme** — haut AR → jets proches du MAX
- **Parry Ratio (défenseur)** : tire les jets reçus vers le **MIN** de la range de l'attaquant

```
Exemple concret (arme 80 ~ 112 de dégâts, source UnKnoWnCheaTs) :

  Votre AR élevé  vs  PR adverse faible  →  dégâts ≈ 112 (max)
  Votre AR faible vs  PR adverse fort    →  dégâts ≈ 80  (min)
  AR ≈ PR                                →  dégâts ≈ 96  (milieu)
```

### Sources de gain

```
Attack Rating & Parry Ratio :
  +1 par niveau de personnage
  +3 par niveau de mastery (CH et EU)
  + valeurs fixes sur armes (hitratio) et boucliers (parry)
  + buffs (ex: Lightning "Concentration" series → parry ratio)
```

### Optimisation AR/PR

```
PvE  : monstres = AR/PR selon niveau → être au level du mob évite le malus
PvP  : stuff hitratio/parry + masteries à jour
        le PR est une stat défensive majeure (réduction des dégâts moyens reçus)
```

---

## 💥 Système de Critiques

### Formule du Critical (multi-sources, consensus)

```
Dégâts normaux = Physical Damage + Magical Damage
Dégâts CRIT    = 2 × Physical Damage + Magical Damage
```

- Seule la **partie physique double** — la partie magique n'est pas affectée
- Ex : 1000 PHY + 200 MAG → crit = 2200 (×1.83)

### Qu'est-ce qui peut critiquer ?

| Source | Peut critiquer ? |
|--------|------------------|
| Attaques normales | ✅ |
| Skills d'armes CH (Bicheon, Heuksal, Pacheon) | ✅ |
| Skills physiques EU | ✅ |
| **Nukes CH (Fire/Lightning/Cold)** | ❌ **ne critique PAS** |
| **Lion Shout** | ❌ |
| DoTs (burn, poison...) | ❌ (les ticks ne critiquent pas) |

### Critical Rate (chance) — vient de l'équipement

- Stat **« Critical X »** sur l'arme/accessoires = **X% de chance**
- Valeurs par degré (données items communauté) : Crit 11 (D6), 15 (D7-8), 20 (D9-11)
- Un très bon set PvP atteint **~25% de crit**
- ❌ La STR n'augmente PAS la chance de crit (elle augmente le dégât du crit via la partie PHY)

### Critical Builds

```
Bow crit build (Pacheon) : le plus haut crit rate du jeu CH
Blade/glaive STR : crits massifs (2×PHY énorme)
Dagger Rogue EU : crit + double attack (rapide)
```

---

## 📊 Formules de Dégâts (formule elitepvpers)

### La formule de référence (thread elitepvpers 412387)

```
Physical Damage = [(base + skill_pow × mastery_incr − Phys def)
                    × balance × skill_mult × buff&passive × multiplier]

Magical Damage  = [((base + imbue_pow) × mastery_incr − Mag def)
                    × balance × skill_mult × buff&passive × multiplier]

Total = Physical + Magical
Crit  = 2 × Physical + Magical
```

**Constantes (tests joueurs) :**
```
Physical Multiplier = 1.276772606
Magical Multiplier  = 1.287004542
```

**Définitions des composants :**

| Composant | Signification |
|-----------|---------------|
| `base` | attaque de base (weapon + renfort STR/INT) |
| `skill_pow` | puissance de la skill (min~max, ex: 574~777) |
| `mastery_incr` | coefficient de mastery (ex: 1.90 pour mastery 90) |
| `Phys/Mag def` | défense de la cible (soustraite avant multiplicateurs) |
| `balance` | Physical/Magical Balance % (voir section dédiée) |
| `skill_mult` | multiplier % de la skill (57%, 350%...) |
| `buff&passive` | multiplicateurs de buffs (+18% attack → ×1.18) |
| `multiplier` | constante globale de conversion |

### Exemple complet vérifié (elitepvpers, Pure STR Bow lvl 100)

```
Stats : STR 442, INT 175 → PHY Balance 1.09 (109%), MAG Balance 0.45 (45%)
Base PHY Attack : 2558 ~ 3012   Base MAG Attack : 2638
Buffs : +18% PHY, +18% MAG

Skill : Strong Bow-Craft lvl 8  (574 ~ 777, 350%)
Imbue : Soul Fire Force lvl 11  (658 ~ 1097, 100%)

PHY = (3012 + 777×1.90 − 7) × 1.09 × 3.5 × 1.18 × 1.277 ≈ 25 890
MAG = ((2638 + 1097) × 1.90 − 10) × 0.45 × 3.5 × 1.18 × 1.287 ≈ 16 897
Total ≈ 42 787
Crit  ≈ 2×25 890 + 16 897 ≈ 68 678
```

### Débat communautaire sur le crit

Deux lectures coexistent dans les threads elitepvpers :
1. **Crit = 2×PHY + MAG** (consensus dominant, vérifié KR+EN)
2. Le crit ajouterait **le Physical Balance en %** plutôt qu'un doublement strict (variante proposée dans le même thread)

→ Utiliser la forme 1 ; la forme 2 donne des résultats proches pour les builds STR.

### Renforts (Reinforce) — plus forts qu'ils n'y paraissent

```
Physical Attack = STR × Physical Reinforce % + base
Exemple communauté : 500 STR × 276.8% + 2146 base = 3 530 total
```

Les % de renfort **multiplient** la contribution de la stat → un passif de renfort élevé vaut souvent plus qu'un gain d'arme brut.

---

## 🛡️ Block et Parry

### Blocking (bouclier uniquement)

```
Block mechanics :
  - Nécessite un bouclier équipé
  - Block Rate (stat du bouclier) = % direct de chance de bloquer
  - Un bouclier correct : block ratio ≥ 15
  - 17+ = excellent (cher, prisé PvP)
  - Le blocage réduit drastiquement/annule les dégâts de l'attaque
  - Prioritaire sur les attaques physiques ; effet réduit/nu sur les nukes
  - Les armes 2H ne peuvent PAS bloquer (pas de bouclier)
```

> ❌ **Corrigé (ancienne version)** : le block ne réduit pas « les dégâts de 50-80% » en général — c'est une **chance** (le % du bouclier) de bloquer complètement/quasi-complètement un coup.

### Parry (passif)

- Voir [Attack Rating et Parry Ratio](#attack-rating-et-parry-ratio)
- Le parry **déplace le jet de dégâts reçu vers le min de la range adverse** — ce n'est pas un % de réduction fixe et il n'y a pas de « cap 80% »

---

## ⚡ Vitesses (attaque / cast / déplacement)

### Attack speed par arme (données items communautaires)

| Arme | Vitesse relative |
|------|------------------|
| Daggers (Rogue) | La plus rapide |
| Sword CH 1M / Staff 1M / Harp | Rapide |
| Glaive / Spear | Moyenne |
| 2H (Blade lourde, Axe, Long sword EU) | Lente |
| Bow CH | La plus lente |

- **Frostbite** réduit la vitesse d'attaque ET de déplacement de la cible
- Blue stats « attack speed » sur certains items

### Casting speed (EU)

- Les skills EU ont un cast time (jusqu'à 2+s pour les gros nukes)
- Stat **haste / casting speed** = réduction du temps de cast
- Les données RefSkill ont deux colonnes : `Cast (référence)` et `Cast (hâte)`

### Movement speed

```
Base ~50 (unités jeu)
Bonus additifs : Garment set +20% / Protector +10% / Lightning passif / potions / blues
Malus : Frostbite, Freeze, heavy armor (pas de bonus set)
Cap pratique : ~2× la base
```

---

## 🩸 Vol de vie : Absorb HP / MP

- **Blue stats** « Absorb HP » / « Absorb MP » :
  - Armes : **10 à 35%** selon le degré (chaque attaque rend un % des dégâts)
  - Accessoires : jusqu'à ~**20%**
  - Se retire uniquement en détruisant l'item (pas de downgrade)
- **Skills avec Absorb natif** (données RefSkill, effet `Absorb`) :
  - Ex. « Baiser du Vampire » (Warlock) : dégâts + **absorb 50%** des dégâts infligés
  - Ex. « Full Life Absorb » (mob/skill) : absorb fixe (200 HP)

---

## 💎 Socket System

### Magic Stones

Les équipements 10D+ (et EU D8+) ont des slots pour des **Magic Stones** (pierres magiques).

#### Types de Stones

```
Astral/Immortal stones etc. (selon degré) :
  - +% PHY ATK / MAG ATK (attack stones)
  - +% crit, +% parry, +% block (stat stones)
  - +% HP/MP, résistances (defense stones)
```

### Socket System Mechanics

```
Socket Rules :
  - Chaque type de pierre : 1 slot max (généralement)
  - Retirer une pierre = destruction (certaines versions)
  - Stones de plus haut niveau = équipement de plus haut degré
```

### Obtention des Stones

```
Monsters drops (champions/giants/uniques)
Forgotten World (runs garantis)
Alchemy / events (Robot event, etc.)
```

---

## 🔮 Blue Stats et Alchemy Impact

### Stats Blues fréquentes (armes)

```
Physical attack +X% / Magical attack +X%
Critical +X (chance % directe)
Attack Rate +X (hitratio)
Parry Ratio +X
Absorb HP +X% / Absorb MP +X% (10-35% selon degré)
Steady/Strong/Icone : renforts PHY/MAG %
Deadly/Brutal etc. selon degré
```

### Stats Blues fréquentes (armures)

```
HP +X% / MP +X%
Physical defense +X% / Magical defense +X%
Block ratio +X (sur boucliers)
Critical resistance (rare)
Immortal/Astral (préservation à la destruction — EU)
```

### Stats Blues fréquentes (accessoires)

```
STR +X / INT +X
HP/MP absorb jusqu'à ~20%
Résistances élémentales (ex: Ice +20% max sur D8)
5 stats de réduction de durée de status :
  freezing/frostbite, burn, shocked, poison, zombie
```

### Enhancement et blues

- L'enhancement (+1 → +12) augmente les stats de base de l'item
- Les **blues** sont roulés séparément (Lucky Powder/alchemy) et persistent indépendamment du +X
- Sur les stuff EU, les blues "Immortal" empêchent la destruction à l'échec d'upgrade

---

## 📈 Statistiques Secondaires

### Hit Ratio vs Attack Rating

```
Termes interchangeables dans la communauté :
  Hit ratio = la stat d'arme
  Attack rating = le total personnage (niveau + masteries + arme + buffs)
Les deux désignent le même mécanisme (jet vers le max de la range)
```

### Defense Break / Ignore DEF

```
Skills de réduction de défense :
  - Warlock : Physical Raze (Decayed : −PHY def), Magical Raze (Weaken : −16% MAG def, 8 s)
  - Rogue : Prick (réduit les heals), Perforation : réduit PHY/MAG def de la cible "jusqu'à zéro" (8 s)
  - Warrior : certains debuffs
Durées typiques : 8-30 secondes, refresh possible
```

### Knockdown (résumé)

```
- La cible tombe, ne peut plus agir ~2-4 s
- Les skills "Stab" font ×2 dégâts sur cibles au sol
- Anti-chain : immunité partielle après relève (selon version)
```

---

## 🔮 Notes de Développement SRObro

### Pour SRObro Browser Clone

#### Structure de Données Stats

```typescript
// shared/types/character.ts
export interface CharacterStats {
  // Primary Stats
  strength: number;       // PHY attack, HP, balance
  intelligence: number;   // MAG attack, MP, balance

  // Secondary Stats
  health: number;
  mana: number;
  level: number;

  // Derived Stats (formules vérifiées)
  physicalAttack: number;   // STR × physReinforce + weapon
  magicalAttack: number;    // INT × magReinforce + weapon
  physicalDefense: number;  // armor + STR × physReinforce
  magicalDefense: number;   // armor + INT × magReinforce
  attackRating: number;     // level + 3×masteries + weapon hitratio
  parryRatio: number;       // level + 3×masteries + shield/armor

  // Equipment Bonuses
  weaponCritRate: number;   // % direct (Critical X = X%)
  shieldBlockRate: number;  // % direct du bouclier
  absorbHpPercent: number;  // 10-35% (armes)
  absorbMpPercent: number;

  // Status Resistances (5 types documentés)
  statusResist: {
    freezeFrostbite: number;
    burn: number;
    shock: number;
    poison: number;
    zombie: number;
  };
}
```

#### Système de Calcul de Dégâts

```typescript
// server/utils/combat.ts — formule elitepvpers
export class CombatSystem {
  private static readonly PHY_MULTIPLIER = 1.276772606;
  private static readonly MAG_MULTIPLIER = 1.287004542;

  calculateDamage(attacker: Character, defender: Character, skill?: Skill): DamageResult {
    // Balance
    const m = Math.max(attacker.str * 1.29, attacker.int);
    const phyBalance = attacker.str / m;
    const magBalance = attacker.int / m;

    // Base attacks
    const phyBase = attacker.physicalAttack;  // weapon + STR×reinforce
    const magBase = attacker.magicalAttack;   // weapon + INT×reinforce (+imbue)

    // Formule PHY
    const phyRaw = (phyBase + skill.phyPower * attacker.masteryIncr - defender.physicalDefense)
      * phyBalance * skill.multiplier * attacker.buffMultiplier
      * CombatSystem.PHY_MULTIPLIER;

    // Formule MAG
    const magRaw = (magBase + skill.magPower * attacker.masteryIncr - defender.magicalDefense)
      * magBalance * skill.multiplier * attacker.buffMultiplier
      * CombatSystem.MAG_MULTIPLIER;

    // AR vs PR : position du jet dans la range [min, max]
    const roll = this.rollDamageRange(phyRaw, attacker.attackRating, defender.parryRatio);

    // Critical (seulement skills d'armes / attaques normales)
    const canCrit = skill?.weaponSkill ?? true;
    const crit = canCrit && this.checkCrit(attacker);
    const total = (crit ? 2 * roll : roll) + magRaw;

    return { damage: Math.floor(total), crit, damageType: 'hybride' };
  }

  /**
   * AR pousse vers le max de la range, PR vers le min.
   * Implémentation simple : biais linéaire entre min et max.
   */
  private rollDamageRange(base: number, ar: number, pr: number): number {
    const min = base * 0.8, max = base * 1.2;   // range ~±20% (approx)
    const bias = (ar - pr) / (ar + pr);          // -1..+1
    const t = 0.5 + 0.5 * bias;                  // 0..1
    return min + (max - min) * t;
  }

  private checkCrit(attacker: Character): boolean {
    return Math.random() * 100 < attacker.critRate; // Critical X = X%
  }
}
```

#### Système de Status (structure RefSkill)

```typescript
// server/utils/status.ts
export type SkillEffectType =
  | 'Damage'      // DoT : burn, poison, decay...
  | 'KnockDown'   // cible au sol
  | 'KnockBack'   // repoussée
  | 'Stun'
  | 'Sleep'       // break au dégât
  | 'Fear'
  | 'Root'        // immobile
  | 'Dull'
  | 'Weaken'      // ex: -16% MAG def
  | 'Curse'       // Disease / Panic / Hidden / Combustion / Decay
  | 'Absorb'      // vol de vie
  | 'Specialized' // Stab : x2 vs cibles au sol

export interface SkillEffect {
  type: SkillEffectType;
  status?: string;
  value?: number;      // ex: 560 HP toutes les 2 s
  duration?: number;   // secondes
  chance: number;      // 0-100
}
```

---

## 📊 Tables de Référence Rapide

### Attack Rating / Parry Ratio par niveau (ordres de grandeur)

```
AR/PR ≈ (1 × level) + (3 × mastery) + stats d'équipement
Exemple lvl 100, mastery 100 : 100 + 300 = 400 + arme/bouclier (~30-60)
```

### Block Rate des boucliers

```
Bouclier correct  : block ratio ≥ 15
Bouclier PvP      : 17+
Le block ratio = % de chance direct de bloquer
```

### Crit Rate par degré (valeurs max observées)

```
D6  : Crit 11
D7-8: Crit 15
D9-11: Crit 20+
Set PvP optimal : ~25% de crit
```

### Absorb HP/MP (armes)

```
D6-D8   : 10-20%
D9-D11  : 20-35%
Accessoires : jusqu'à ~20%
```

---

## 💡 Mythes et Réalités

### Mythes Courants (et corrections sourcées)

```
Mythe : "Full STR = +0.5 AR par point"
Réalité : l'AR vient du niveau (+1) et des masteries (+3), pas des stats
         (corrigé dans ce document)

Mythe : "Le crit double tous les dégâts"
Réalité : seul le PHY double (2×PHY + MAG) — les nukers ne critiquent pas

Mythe : "Parry = % de réduction, cap 80%"
Réalité : le parry déplace le jet dans la range min-max de l'attaquant,
          ce n'est pas une réduction en %

Mythe : "Le block réduit de 50-80%"
Réalité : le block ratio est une CHANCE (%) de bloquer quasi-totalement un coup

Mythe : "Les nukes crit"
Réalité : seuls les skills d'armes CH et attaques normales critiquent

Mythe : "Full INT ne peut pas tanker"
Réalité : Snow Shield (Cold) absorbe une part des dégâts en MP —
          les full INT ont un pool MP énorme → survivabilité réelle en PvP
```

### Conseils Finaux

```
1. Builds purs > hybrides (en général) : le Balance punit le mix
2. PvP : PR + block + absorb = méta défensive ; crit + KD/stab = méta offensive
3. Toujours capter les 5 stats de résistance de status sur les accessoires PvP
4. Garment pour les INT (MP cost -20%, speed +20%)
```

---

## 🌍 Findings Recherche Communautaire (2025-2026)

### 🛡️ Armor Type Set Bonuses — Detailed Mechanics

**Source** : [Silkroad Forums - Armors Guide](http://www.silkroadforums.com/viewtopic.php?f=113&t=93505)

#### Complete Set Bonus System

**Garment Set** (all 6 pieces - chest, legs, head, hands, shoulder, feet):
- **+20% movement speed** increase
- **-20% MP consumption** on all skills and spells
- **Critical for SP farming**: Reduces MP potion consumption by 20%

**Protector Set** (all 6 pieces):
- **+10% movement speed** increase
- **-10% MP consumption** on all skills and spells

**Armor Set** (heavy armor):
- **No set bonus**
- Highest PHY DEF, lowest MAG DEF
- Used primarily for full STR tanks

#### Low Level Strategy
**Garment recommended until level 20** because:
- PHY DEF difference between Garment and Armor is negligible (~5-6 points)
- MP savings (20%) significantly reduces downtime
- Movement speed bonus (+20%) improves kiting efficiency

---

### 👥 Party EXP System - "Taxi" Mechanic

**Sources** :
- [Silkroad Origin Mobile - Party Mechanics Discussion](https://sromobile.com/en/news/announcements/discussion-on-game-mechanisms-party)

#### "Taxi" System - Power Leveling Mechanic

1. High-level player (level 80) parties with low-level character (level 20)
2. Average party level = (80 + 20) ÷ 2 = **50**
3. Fighting level 50 mobs: level gap reduced → **higher EXP multipliers** than solo

#### Party Types & Bonuses (PC classic)

**"Each get EXP" Party** :
- Max 4 members, **+5% EXP per player** (full party = +20%)

**"Share EXP" Party** :
- Max 8 members, proximity-based, higher potential EXP

---

### 🎯 Unique Monster Spawn Times

**Sources** : [Multiple private server guides]

| Unique | Level | HP | Spawn Time |
|--------|-------|-----|------------|
| **Tiger Girl** | 20 | 598,720 | Every 1-2 hours (varies) |
| **Cerberus** | 20 | 693,072 | Every 3-5 hours |
| **Captain Ivy** | 30 | 1,094,835 | Every 3-5 hours |
| **Uruchi** | 40 | 1,779,528 | Every 60+ minutes |
| **Isyutaru** | 60 | 4,324,612 | Every 3-6 hours |
| **Lord Yarkan** | 70+ | High HP | Every 3-6 hours |
| **Demon Shaitan** | 80+ | Highest HP | Every 3-6 hours |

---

### 📊 Confidence Levels des mécaniques (mise à jour 2026)

| Mécanique | Formule/Valeur | Sources | Confiance |
|-----------|---------------|---------|-----------|
| **Formule dégâts complète** | multi-composants elitepvpers | elitepvpers 412387 | 4/5 |
| **Physical Multiplier** | 1.276772606 | elitepvpers (testing) | 3/5 |
| **Magical Multiplier** | 1.287004542 | elitepvpers (testing) | 3/5 |
| **Balance** | 100×STR/max(STR×1.29, INT) | evolex.dev + communauté | 4/5 |
| **Critical** | 2×PHY + MAG | consensus KR+EN | 4/5 |
| **Nukes ne critiquent pas** | confirmé | silkroadforums | 4/5 |
| **AR/PR = jet dans la range** | AR→max, PR→min | UnKnoWnCheaTs + forums | 4/5 |
| **AR/PR gain** | +1/level, +3/mastery | guides reinforce | 3/5 |
| **Block bouclier** | % direct, 15-17+ = PvP | Way Items Work | 4/5 |
| **Absorb blues** | armes 10-35%, acc ~20% | Way Items Work | 3/5 |
| **Garment/Protector set bonuses** | +20%/+10% speed, −20%/−10% MP | silkroadforums | 4/5 |
| **Weaken (Raze)** | −16% MAG def, 8 s | silkroaddoc (RefSkill) | 5/5 |
| **Stab ×2 vs sol** | effet Specialized | silkroaddoc (RefSkill) | 5/5 |
| **DoT tick** | toutes les 2 s (ex: 560×4 ticks) | silkroaddoc (RefSkill) | 5/5 |
| **Perte EXP mort** | ~2% | florian0 + communauté | 3/5 |

---

### ⚠️ Incertitudes restantes (sources divergentes)

1. **Constantes multiplier exactes** (1.2767…/1.2870…) : reconstruites par tests, jamais officielles ; modifiées par certains serveurs privés
2. **Variante du crit** (doublement PHY vs ajout du balance PHY en %) : deux lectures dans les mêmes threads
3. **Chance de proc des imbues par pallier de skill** : ordres de grandeur (fire ~20-30%, cold 20-60% selon skill) mais pas de table exacte publiée — se fier aux tooltips client
4. **Échelle exacte de la vitesse d'attaque** (coups/minute par arme) : l'ordre relatif est sûr, les valeurs absolues varient selon les sources
5. **Effet du Zerk sur la défense** : aucun en classic ; les variantes (Origin mobile) ajoutent des stats

---

## 📚 Sources

### Documentation technique
- [DummkopfOfHachtenduden (DaxterSoul) — SilkroadDoc](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) — formats de fichiers & packets
- [silkroaddoc.github.io](https://silkroaddoc.github.io/) — données RefSkill (types d'effets de status)
- [florian0 — Death Penalty Item Drops](https://florian0.wordpress.com/2016/10/05/silkroad-online-death-penalty-item-drops) — reverse engineering du serveur

### Guides communauté
- [Elitepvpers — Silkroad Damage Formulas (412387)](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
- [Elitepvpers — The Way Items Work](https://www.elitepvpers.com/forum/sro-guides-templates/2545845-guide-way-items-work.html)
- [Elitepvpers — Physical & Magical Reinforce explained](https://www.elitepvpers.com/forum/sro-guides-templates/807866-explaination-physical-magical-reinforce.html)
- [Elitepvpers — Full INT Guide](https://www.elitepvpers.com/forum/sro-guides-templates/621667-guide-full-int-guide.html)
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html)
- [Silkroad Forums — What is Parry Ratio](http://www.silkroadforums.com/viewtopic.php?f=2&t=49338)
- [PlayOrigin — Chinese Race Guide (archive)](https://forum.playorigin.com/archive/index.php/t-26.html)

### Calculateurs
- [evolex.dev — SRO Character Stats Calculator](https://evolex.dev/sro-char-stats)

---

*Dernière mise à jour : 2026-10-01*

*Sources : elitepvpers, silkroadforums, UnKnoWnCheaTs, florian0 (RE), silkroaddoc.github.io, PlayOrigin, evolex.dev, silkroad.fandom.com, SRObro Project*
