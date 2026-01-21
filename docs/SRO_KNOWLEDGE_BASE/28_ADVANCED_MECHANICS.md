# Mécaniques Avancées de Silkroad Online

## 📋 Table des Matières
- [Introduction](#introduction)
- [Systeme d'Attributes](#systeme-dattributes)
- [Attack Rating et Parry Ratio](#attack-rating-et-parry-ratio)
- [Système de Critiques](#système-de-critiques)
- [Formules de Dégâts](#formules-de-dégâts)
- [Socket System](#socket-system)
- [Block et Parry](#block-et-parry)
- [Statistiques Secondaires](#statistiques-secondaires)
- [Notes de Développement](#notes-de-développement)

---

## 📚 Introduction

Silkroad Online possède des **mécaniques de combat complexes** qui vont au-delà des simples statistiques. Ce guide couvre les systèmes avancés:

- **Attribute Points** (STR vs INT)
- **Attack Rating & Parry Ratio** (Toucher et bloquer)
- **Critical Hits** (Coups critiques)
- **Socket System** (Pierres magiques)
- **Damage Formulas** (Calcul des dégâts)
- **Block & Parry Mechanics** (Défense active)

Comprendre ces mécaniques est **crucial** pour:
- Optimiser son build
- PvP efficace
- Farming optimal
- Création de contenu SRObro

---

## 💪 Systeme d'Attributes

### Force (STR) vs Intelligence (INT)

Les points d'attributes gagnés à chaque level (2 points par level) doivent être distribués entre:

#### Strength (Force)

```
Effets de la Force:
  +1 STR = +1 Physical Attack (PHY ATK)
  +1 STR = +0.5 Physical Defense (PHY DEF)
  +1 STR = +5 HP (points de vie)
  +1 STR = +0.5 Attack Rating (chance de toucher)
  +1 STR = +0.5 Parry Ratio (chance de bloquer)

Pour les personnages Full STR:
  - Dégâts physiques maximums
  - Bonne défense physique
  - Beaucoup de HP
  - Toucher plus souvent
```

#### Intelligence (INT)

```
Effets de l'Intelligence:
  +1 INT = +1 Magical Attack (MAG ATK)
  +1 INT = +0.5 Magical Defense (MAG DEF)
  +1 INT = +20 MP (points de mana)
  +1 INT = +0.5 Attack Rating
  +1 INT = +0.5 Parry Ratio (via shield)

Pour les personnages Full INT:
  - Dégâts magiques maximums
  - Beaucoup de MP (pour spam skills)
  - Défense magique correcte
  - Bon pour skills AOE
```

#### Distribution Recommandée

```
Pure STR (Full Strength):
  - Tous les points en STR
  - Pour: Warriors, Bladers, Spear nukers
  - Avantages: Dégâts max, survivabilité

Pure INT (Full Intelligence):
  - Tous les points en INT
  - Pour: Wizards, Warlocks, Clerics (nuke)
  - Avantages: Mana énorme, skills spam

Hybrid Builds:
  - STR/INT mix (ex: 70/30)
  - Permet d'utiliser arms physiques et magiques
  - Plus polyvalent mais moins spécialisé

Distribution pour SRObro (équilibre):
  - Chinese: Souvent Full STR ou Full INT
  - European: Variable selon la classe
```

---

## ⚔️ Attack Rating et Parry Ratio

### Attack Rating (AR)

**L'Attack Rating** détermine la chance de toucher un adversaire.

```
Formule approximative:
Chance de toucher (%) = Attack Rating / (Attack Rating + Defense Rating)

AR est affecté par:
  - Points de STR (0.5 par point)
  - Weapon base Attack Rating
  - Level (bonus caché)
  - Skills/Buffs

Exemple:
  Player: AR 100, DEF 100
  Chance de toucher = 100/(100+100) = 50%

  Si DEF 200:
  Chance = 100/(100+200) = 33.3%
```

### Parry Ratio (PR)

**Le Parry Ratio** détermine la chance de bloquer/réduire les dégâts.

```
Formule de Parry:
Chance de bloquer (%) = Parry Ratio / (Parry Ratio + Attack Rating)

PR est affecté par:
  - Points de STR (0.5 par point)
  - Shield base Parry Ratio
  - Weapon Parry (si 2H)
  - Skills/Buffs

Exemple:
  Player: PR 80, Enemy AR 120
  Chance de bloquer = 80/(80+120) = 40%

  Si PR 160:
  Chance = 160/(160+120) = 57%
```

### Attack Rating et Parry par Arme

```
Weapons 1-Handed:
  - AR: Base ~10-30
  - PR: Base ~5-15

Shields:
  - PR: +10-40 (selon shield)
  - AR: +5-20

Weapons 2Handed (2H):
  - AR: +30-50 (bonus)
  - PR: +20-40 (bonus)
  - Tradeoff: Pas de shield

Exemple Sword 2H:
  - Base: AR 20, PR 10
  - 2H Bonus: AR +30, PR +25
  - Total: AR 50, PR 35
```

### Optimsation AR/PR

```
Pour PvE (Monstres):
  - Monstres ont DEF = Level × 2
  - AR de 100+ est suffisant pour toucher 80%+
  - PR n'est pas aussi critique

Pour PvP (Joueurs):
  - Joueurs ont AR = STR + Weapon
  - AR de 150-200+ est souhaitable
  - PR est très important (réduit dégâts)

Balancement suggéré:
  - Full STR: AR 120-150, PR 80-100
  - Full INT: AR 120-150, PR 60-80 (less PR needed)
```

---

## 💥 Système de Critiques

### Critical Hit Mechanics

Les coups critiques infligent **150% des dégâts normaux** par défaut.

```
Formule de Crit:
Critical Hit = Damage × Crit Multiplier

Par défaut:
  - Multiplier = 1.5 (150% damage)

Bonus via:
  - Weapon Crit rate (ex: Sword +5: +7% crit)
  - Skills passifs (ex: Leaf Ticket +5% crit)
  - Stats sur equipment (crit +X%)
```

### Critical Rate vs Critical Damage

```
Critical Rate (Chance de crit):
  - Base: 1-3%
  - +Weapon crit bonus
  - +Skill passif
  - +Items (crit stats)

Critical Damage (Multiplicateur):
  - Base: 150% (×1.5)
  - Certaines skills peuvent augmenter ceci
  - Items "Crit Damage" (rares)

Trade-off:
  - High crit rate (10%+) vs
  - High crit damage (×2.0+)
  - Généralement pas les deux
```

### Criticals par Weapon Type

```
Sword/Blade:
  - Crit rate: +5-10% (base sur sword)
  - Sword mastery: +crit rate aux levels élevés
  - Idéal pour crit builds

Bow:
  - Crit rate: +10-15% (base sur bow)
  - Bow mastery: +crit rate significatif
  - Meilleur pour crit rate

Spear/Glaive:
  - Crit rate: +3-5% (plus bas)
  - Compensation: Plus de dégâts de base
  - Attaques plus lentes

2H Swords:
  - Crit rate: +7-12%
  - Dégâts de base plus élevés
  - Popular pour crit builds
```

### Critical Builds

```
Pure STR Crit Build:
  - 2H Sword +5-7 (crit)
  - Full STR
  - Crit rate: 20-30%
  - Dégâts énormes sur crit

Full INT Crit (Nuker):
  -武器 crit rate via skills
  - Lightning crit skills
  - Crit rate: 15-25%
  - Nuke AOE avec crits
```

---

## 📊 Formules de Dégâts

### Dommage Physique

```
Physical Damage = (Weapon Attack + STR) - Enemy Defense

Attaque du joueur:
  - Weapon Base Attack (ex: Sword 9D: 100-150)
  + STR (ex: 100 STR = +100 ATK)
  + Skills buffs
  = Total Attack

Dégâts:
  Max Damage = Total Attack
  Min Damage = Total Attack × 0.7
  Avg Damage = Total Attack × 0.85

Enemy Defense réduit:
  - Damage subit à Defense
  - Min 10% de l'attaque (ne peut pas être en dessous)
```

### Dommage Magique

```
Magical Damage = (Weapon Attack + INT) - Enemy Magical Defense

Attaque magique:
  - Weapon Base MAG Attack (ex: Staff 9D: 100-150)
  + INT (ex: 100 INT = +100 MAG ATK)
  + Skills buffs
  = Total MAG Attack

Defense magique fonctionne comme défense physique
- Réduit les dégâts magiques
- Minimum 10%
```

### Skill Damage

```
Skill Damage Formula:

Physical Skills:
  Damage = (Base Damage + STR% bonus) × Skill Multiplier

Magical Skills:
  Damage = (Base MAG Damage + INT% bonus) × Skill Multiplier

Exemple Lion Shout (INT-based):
  Base: 500 damage
  INT 100: +10% (passif) → 550
  Level 5: ×3.0 multiplier
  Total: 550 × 3 = 1650 damage

Buff Multipliers:
  - Buffs peuvent augmenter le multiplicateur
  - Ex: Buff force +20% → ×1.2
```

### Final Damage Calculation

```
Protected Damage = Max Damage × (1 - Defense Reduction)

Defense Reduction % = DEF / (DEF + Constant)

Exemple:
  Player ATK: 1000
  Enemy DEF: 500
  Constant: 1000 (approx)

  Reduction = 500 / (500 + 1000) = 33.3%
  Final Damage = 1000 × (1 - 0.333) = 667 damage
```

---

## 💎 Socket System

### Magic Stones

Les équipements 10D+ ont des slots pour des **Magic Stones** (pierres magiques).

#### Types de Stones

```
Blue Stones (Mag Attack):
  - +% MAG ATK (ex: +3%, +5%, +7%)
  - +% MAG DEF
  - +% MP

Red Stones (Physical Attack):
  - +% PHY ATK (ex: +3%, +5%, +7%)
  - +% PHY DEF
  - +% Crit rate

Green Stones (Defense):
  - +% Block/Parry
  - +% HP
  - +% Crit Resistance
```

### Socket System Mechanics

```
Socket Rules:
  - 1 slot per type max (généralement)
  - Remove destroys stone (certains serveurs)
  - Higher stones require higher level equipment

Socket Levels:
  - Level 1 Stones: 1D equipment
  - Level 2 Stones: 7D equipment
  - Level 3 Stones: 10D+ equipment

Socket Table by Degree:
  1D-6D: 0-1 slot
  7D-9D: 1-2 slots
  10D-12D: 2-3 slots
  13D: 3-4 slots
```

### Obtention des Stones

```
Monster Drops:
  - Champion monsters: 5-10% chance
  - Giant monsters: 15-20% chance
  - Uniques: 30-50% chance

Forgotten World:
  - Guaranteed stones (1-3 per run)
  - Higher tier stones possible

Alchemy:
  - Stone creation (combiner materials)
  - Stone upgrade (fusion)
  - Cost élevé

Robot Event:
  - Échange de tickets
  - Gold tier rewards
```

### Socket Strategy

```
Best in Slot:

Weapons:
  - Red +7 PHY ATK (max DPS)
  - Crit rate +X% (si pas atteint cap)
  - Blue +5 MAG ATK (pour nukers)

Armor:
  - Green HP +% (plus de HP)
  - Green Block/Parry (plus de tank)
  - Crit resistance (PvP)

Accessories:
  - Ring: Crit +7%, ATK +5%
  - Necklace: Phy/Mag ATK +7%
  - Earring: HP +5%, MP +5%
```

---

## 🛡️ Block et Parry

### Blocking (Shield Only)

Seuls les personnages avec shield peuvent bloquer activement.

```
Block Mechanics:
  - Active skill (Shield Block)
  - Reduces damage by % (ex: 60-80%)
  - Requires shield equipped

Block Rate:
  - Calculé via Parry Ratio
  - Enhanced par shield quality
  - 2H weapons CANNOT block (pas de shield)

Types de Blocks:
  - Normal Block (skill)
  - Auto-block (certain shields)
  - Perfect Block (0 damage, rare)
```

### Parry (Passive)

La **parry** est un mécanisme passif qui réduit les dégâts.

```
Parry Mechanics:
  - Passive reduction
  - Based on Parry Ratio stat
  - Works with or without shield

Parry vs Defense:
  - Parry réduit les dégâts entrants
  - Defense réduit les dégâts après blocage
  - Les deux fonctionnent ensemble

Max Parry:
  - Max Parry cap: ~80%
  - À ce point, 80% des dégâts sont réduits
  - Les 20% restants passent
```

### Block vs Parry

```
Block (Shield):
  + Active control
  + Can reduce 80-90%
  + Perfect Block possible
  - Uses stamina
  - Shield required

Parry (Passive):
  + Always active
  + No stamina cost
  + Works with all weapons
  - Max 80% reduction
  - Passive only
```

---

## 📈 Statistiques Secondaires

### Hit Ratio vs Attack Rating

```
Hit Ratio (Not to confuse with AR):
  - Similar concept to Attack Rating
  - Used in some contexts
  - Generally same as AR in practice

Distinction:
  - Attack Rating: Your stat
  - Hit Ratio: Result (chance de toucher)
  - Termes parfois utilisés de manière interchangeable
```

### Defense Break

```
Armor Break Skills:
  - Réduisent DEF de la cible
  - Allow more damage
  - Used by Warriors, Thieves

Examples:
  - Armor Break (Warrior)
  - DegreDEF (Warlock)
  - Armor Crush (Various)

Duration:
  - 5-15 seconds
  - Can be reapplied
  - Diminishing returns if reapplied
```

### Knockdown (KD)

```
Knockdown Mechanics:
  - Certain skills can knockdown
  - Player falls to ground
  - Vulnerable while knocked down

KD Duration:
  - 1-3 seconds (normal)
  - Extended by certain skills

Resistance:
  - Higher level = less KD
  - Certain stats may reduce KD
  - KD protection skills
```

---

## 🔮 Alchemy Impact sur Stats

### Enhancement Stats

```
+1 to +3:
  - Base stats améliorés
  - Pas de stats spéciaux

+4 to +5:
  - Chance d'ajouter "Blue" stats:
    * PHY/MAG ATK +1-2
    * Crit +1-2%
    * STR/INT +1-2

+6 to +7:
  - Chance d'ajouter "Blue" stats:
    * PHY/MAG ATK +3-5
    * Crit +3-5%
    * STR/INT +3-5
    * Block/Parry +1-2

+8 to +9:
  - Chance d'ajouter "Blue" stats:
    * PHY/MAG ATK +6-8
    * Crit +6-8%
    * STR/INT +6-8
    - Block/Parry +3-4

+10 to +12:
  - Chance d'ajouter "Blue" stats:
    * PHY/MAG ATK +9-12
    * Crit +9-12%
    * Block/Parry +5-7
    - Special stats possibles

+13+:
  - Guaranteed "Blue" stats
  - Multiple stats possibles
  - Chance de "Gold" stats (très rares)
```

### Stats Blues sur Items

```
Common Blue Stats on Weapons:
  - Physical Attack +X%
  - Magical Attack +X%
  - Critical +X%
  - Attack Rate +X
  - Parry Ratio +X
  - Block Parry +X

Common Blue Stats on Armor:
  - HP +X%
  - MP +X%
  - Physical Defense +X%
  - Magical Defense +X%
  - Block/Parry +X%
  - Critical Resistance +X%

Common Blue Stats on Accessories:
  - STR +X
  - INT +X
  - HP +X
  - MP +X
  - Crit Rate +X%
```

---

## 📚 Notes de Développement

### Pour SRObro Browser Clone

#### Structure de Données Stats

```typescript
// shared/types/character.ts
export interface CharacterStats {
  // Primary Stats
  strength: number;      // Physical attack
  intelligence: number; // Magical attack & MP
  dexterity?: number;   // Not used in SRO

  // Secondary Stats
  health: number;
  mana: number;
  level: number;

  // Derived Stats
  physicalAttack: number;
  magicalAttack: number;
  physicalDefense: number;
  magicalDefense: number;
  attackRating: number;
  parryRatio: number;

  // Equipment Bonuses
  weaponCritRate: number;
  weaponParryRate: number;
  shieldBlockRate: number;

  // Status Resistances
  knockdownResist: number;
  stunResist: number;
  poisonResist: number;
  burnResist: number;
  freezeResist: number;
}
```

#### Système de Calcul de Dégâts

```typescript
// server/utils/combat.ts
export class CombatSystem {
  /**
   * Calcule les dégâts d'une attaque
   */
  calculateDamage(
    attacker: Character,
    defender: Character,
    skill?: Skill
  ): DamageResult {
    const baseDamage = this.getBaseDamage(attacker, skill);
    const defense = skill?.magical
      ? defender.stats.magicalDefense
      : defender.stats.physicalDefense;

    const damageReduction = defense / (defense + 1000);
    const finalDamage = Math.floor(
      baseDamage * (1 - damageReduction)
    );

    // Minimum 10% damage
    const minDamage = Math.floor(finalDamage * 0.1);
    const finalDamageProtected = Math.max(minDamage, finalDamage);

    return {
      damage: finalDamageProtected,
      damageType: skill?.magical ? 'magical' : 'physical',
      reducedBy: defense,
      crit: this.checkCrit(attacker)
    };
  }

  /**
   * Vérifie si l'attaque est un critique
   */
  private checkCrit(attacker: Character): boolean {
    const baseCrit = 0.02; // 2% base
    const weaponCrit = attacker.weaponCritRate;
    const totalCrit = baseCrit + weaponCrit;

    return Math.random() < totalCrit;
  }
}
```

#### Système de Socket

```typescript
// server/models/item.ts
export interface ItemSocket {
  id: string;
  itemId: string;

  // Stone type
  stoneType: 'BLUE' | 'RED' | 'GREEN';

  // Stats provided by stone
  stats: {
    phyAtkPercent?: number;
    magAtkPercent?: number;
    critRatePercent?: number;
    hpPercent?: number;
    blockParryPercent?: number;
  };

  // Stone level
  level: number;
}

// server/utils/sockets.ts
export class SocketSystem {
  /**
   * Applique les bonus d'un stone
   */
  applySocketBonus(
    baseStats: CharacterStats,
    sockets: ItemSocket[]
  ): CharacterStats {
    const enhancedStats = { ...baseStats };

    sockets.forEach(socket => {
      switch (socket.stoneType) {
        case 'RED':
          enhancedStats.physicalAttack *= (1 + (socket.stats.phyAtkPercent || 0) / 100);
          enhancedStats.critRatePercent += (socket.stats.critRatePercent || 0);
          break;

        case 'BLUE':
          enhancedStats.magicalAttack *= (1 + (socket.stats.magAtkPercent || 0) / 100);
          enhancedStats.mana *= (1 + (socket.stats.hpPercent || 0) / 100);
          break;

        case 'GREEN':
          enhancedStats.health *= (1 + (socket.stats.hpPercent || 0) / 100);
          enhancedStats.parryRatio += (socket.stats.blockParryPercent || 0);
          break;
      }
    });

    return enhancedStats;
  }

  /**
   * Calcule l'Attack Rating total
   */
  calculateAttackRating(character: Character): number {
    let baseAR = 0;

    // From STR
    baseAR += character.stats.strength * 0.5;

    // From weapon
    baseAR += character.weapon.attackRating;

    // From buffs
    baseAR += character.buffs.filter(b => b.type === 'ATTACK_RATING')
      .reduce((sum, buff) => sum + buff.value, 0);

    return baseAR;
  }

  /**
   * Calcule le Parry Ratio total
   */
  calculateParryRatio(character: Character): number {
    let basePR = 0;

    // From STR
    basePR += character.stats.strength * 0.5;

    // From shield
    if (character.offhand?.type === 'SHIELD') {
      basePR += character.offhand.parryRatio;
    }

    // From weapon (2H)
    if (character.weapon.twoHanded) {
      basePR += character.weapon.parryBonus;
    }

    return basePR;
  }
}
```

#### Système de Critique

```typescript
// server/utils/crit.ts
export class CriticalSystem {
  /**
   * Calcule le taux de crit total
   */
  calculateCritRate(character: Character): number {
    let baseCrit = 0.02; // 2% base

    // Weapon crit
    baseCrit += character.weapon.critRate;

    // Mastery passifs
    const masteryCrit = this.getMasteryCritBonus(character);
    baseCrit += masteryCrit;

    // Gear crit stats
    const gearCrit = this.getGearCritBonus(character);
    baseCrit += gearCrit;

    // Buff crit
    const buffCrit = character.buffs
      .filter(b => b.type === 'CRIT_RATE')
      .reduce((sum, buff) => sum + buff.value, 0);
    baseCrit += buffCrit;

    return Math.min(baseCrit, 1.0); // Max 100%
  }

  /**
   * Vérifie si un coup est critique
   */
  rollCritical(character: Character): boolean {
    const critRate = this.calculateCritRate(character);
    return Math.random() < critRate;
  }

  /**
   * Calcule les dégâts de critique
   */
  calculateCriticalDamage(baseDamage: number, character: Character): number {
    const baseMultiplier = 1.5; // 150% default

    // Crit damage bonuses from gear
    const critDamageBonus = this.getCritDamageBonus(character);
    const totalMultiplier = baseMultiplier + critDamageBonus;

    return Math.floor(baseDamage * totalMultiplier);
  }
}
```

---

## 📊 Tables de Référence Rapide

### Attack Rating par Level

```
Level 1-20:   AR 30-60
Level 21-40:  AR 60-100
Level 41-60:  AR 100-150
Level 61-80:  AR 150-200
Level 81-100:  AR 200-250
Level 101-110: AR 250-300
Level 110+:    AR 300+ (cap)
```

### Parry Ratio par Shield

```
1D Shields:    PR 5-15
3D Shields:    PR 10-25
5D Shields:    PR 15-35
7D Shields:    PR 20-45
9D Shields:    PR 25-55
10D+ Shields:  PR 30-65
13D Shields:   PR 40-80

Tower Shields:
  - +10-30 PR bonus
  - Block +70-80%
```

### Crit Rate par Weapon

```
Swords:
  +0-3: 2-5%
  +4-5: 7-12%
  +6-7: 15-20%

Bows:
  +0-3: 5-10%
  +4-5: 12-18%
  +6-7: 20-25%

Spears/Glaives:
  +0-3: 1-5%
  +4-5: 5-10%
  +6-7: 8-15%

2H Swords:
  +0-3: 3-8%
  +4-5: 10-15%
  +6-7: 18-25%
```

---

## 🎯 Conseils pour Optimisation

### Pour Damage Dealers (DPS)

```
Maximiser l'Attack Rating:
  - Full STR (pour PHY)
  - Weapons à haut AR
  - Skills qui boostent AR
  - Ignore DEF (si disponible)

Maximiser les Crits:
  - 2H Sword/Blade +crit
  - Sword mastery crit
  - Crit gear (ring/necklace)
  - Optimal pour PvP et farming
```

### Pour Tanks

```
Maximiser le Parry Ratio:
  - High STR
  - Shield with high PR
  - Parry gear (green stones)
  - Block skills
  - Passive defenses

Maximiser HP:
  - Full STR
  - HP gear (armor, jewelry)
  - HP stones
  - HP buffs

Optimal pour:
  - Boss tanking
  - Fortress War
  - Job Trader protection
```

### Pour Nukers (INT)

```
Maximiser MAG Damage:
  - Full INT
  - Staffs à haut MAG ATK
  - Magic attack skills
  - Crit via skills (pas weapon)

Maximiser MP:
  - Full INT
  - MP gear
  - MP stones
  - MP potions (plus de spam)
```

---

## 🔬 Formules Detallées

### Physical Attack Formula

```
STEP 1: Calculate Raw Attack
Raw Attack = Weapon Base Attack + STR + (Weapon Base Attack × 0.1 × BuffBonus)

STEP 2: Calculate Defense Reduction
Defense Reduction = Enemy DEF / (Enemy DEF + 1000)

STEP 3: Final Damage
Final Damage = Raw Attack × (1 - Defense Reduction) × CritMultiplier

Example:
  - Sword 9D: 150 ATK
  - Player STR: 100 (+100 ATK)
  - Buff: +20% ATK
  - Raw Attack = 150 + 100 + (150 × 0.2) = 280

  - Enemy DEF: 500
  - Defense Reduction = 500 / (500 + 1000) = 33.3%

  - Final Damage = 280 × (1 - 0.333) = 187 damage
```

### Magical Attack Formula

```
STEP 1: Calculate Raw MAG Attack
Raw MAG Attack = Weapon Base MAG Attack + INT + (Weapon Base MAG × 0.1 × BuffBonus)

STEP 2: Calculate Magic Defense Reduction
MAG Defense Reduction = Enemy MAG DEF / (Enemy MAG DEF + 1000)

STEP 3: Final MAG Damage
Final MAG Damage = Raw MAG Attack × (1 - MAG Defense Reduction) × CritMultiplier

Example:
  - Staff 9D: 150 MAG ATK
  - Player INT: 100 (+100 MAG ATK)
  - Buff: +20% MAG ATK
  - Raw MAG Attack = 150 + 100 + (150 × 0.2) = 280

  - Enemy MAG DEF: 400
  - MAG Defense Reduction = 400 / (400 + 1000) = 28.6%

  - Final MAG Damage = 280 × (1 - 0.286) = 200 damage
```

---

## 💡 Mythes et Réalités

### Mythes Courants

```
Mythe: "Full STR always best"
Réalité:
  - Full STR est bon pour damage
  - Mais manque de MP pour skills
  - No utility (pur DPS)

Mythe: "INT is for nukers only"
Réalité:
  - Full INT nuke est puissant
  - Mais INT builds peuvent tanker
  - INT/Warlock est très polyvalent

Mythe: "High AR guarantees hits"
Réalité:
  - AR aide à toucher
  - Mais defense ennemie peut réduire à ~10%
  - AR 300 vs DEF 500 = ~37.5% hit rate
```

### Conseils Finaux

```
1. Focus sur UNA chose:
   - Soit DPS max (Full STR, full crit)
   - Soit Tank (High PR, HP)
   - Soit Nuker (Full INT, MP)
   - Hybride est souvent moins optimal

2. Adapt to content:
   - PvE: Balance AR/PR selon monsters
   - PvP: High AR pour toucher
   - Fortress War: Tank build

3. Use calculators:
   - SRO a des calculateurs en ligne
   - Expérimentez avec builds
   - Copiez les builds pro
```

---

## 📚 Sources

- [Attack Rating & Parry Ratio](http://www.silkroadforums.com/viewtopic.php?f=4&t=79119)
- [Silkroad Forums - Attack Rating](http://ww.silkroadforums.com/viewtopic.php?f=4&t=11159)
- [SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html)
- [Silkroad Online Wiki - Character Creation](https://silkroadonline.fandom.com/wiki/Guide_to_character_creation)
- [Elitepvpers - Full Int Guide](https://www.elitepvpers.com/forum/sro-guides-templates/621667-guide-full-int-guide.html)

---

*Dernière mise à jour: 20 Janvier 2026*

*Sources: Silkroad Forums, SRO Wiki, Community Guides, SRObro Project*
