# Hub Combat - Système de Combat et PvP

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Combat](HUB_COMBAT.md)

---

## 📋 Table des Matières
- [Introduction](#introduction)
- [Système de Combat](#système-de-combat)
- [Mécaniques Avancées](#mécaniques-avancées)
- [PvP et PK](#pvp-et-pk)
- [Builds PvP](#builds-pvp)
- [Fortress War](#fortress-war)
- [Formules et Calculs](#formules-et-calculs)
- [Ressources Techniques](#ressources-techniques)

---

## ⚔️ Introduction

Ce **hub centralise toutes les informations sur le combat** dans Silkroad Online. Des mécaniques de base aux formules avancées, en passant par le PvP compétitif et la Fortress War.

### Points Clés
- 🎯 **Combat basé sur les stats** : STR, INT, PHY ATK, MAG ATK
- 🛡️ **Défense active** : Block, Parry, Attack Rating
- ⚡ **Système de critiques** : Coups critiques et dégâts bonus
- 🔮 **Skills et cooldowns** : Gestion des ressources MP
- 🏰 **Mass PvP** : Fortress War à 300+ joueurs

---

## 🎮 Système de Combat

### Guide Principal
👉 **[04_COMBAT_SYSTEM.md](04_COMBAT_SYSTEM.md)** - Système de combat complet

### Fondamentaux du Combat

#### Attributs Principaux
| Attribut | Effet | Importance |
|----------|-------|------------|
| **STR** | +1 PHY ATK, +0.5 PHY DEF, +5 HP | ⭐⭐⭐⭐⭐ |
| **INT** | +1 MAG ATK, +0.5 MAG DEF, +20 MP | ⭐⭐⭐⭐⭐ |
| **PHY ATK** | Dégâts physiques | ⭐⭐⭐⭐⭐ |
| **MAG ATK** | Dégâts magiques | ⭐⭐⭐⭐⭐ |
| **PHY DEF** | Réduction dégâts physiques | ⭐⭐⭐⭐ |
| **MAG DEF** | Réduction dégâts magiques | ⭐⭐⭐⭐ |

#### Types d'Attaque
- **Attaques normales** : Auto-attacks
- **Skills physiques** : Dégâts basés sur PHY ATK
- **Skills magiques** : Dégâts basés sur MAG ATK
- **AOE** : Area of Effect (dégâts de zone)
- **DOT** : Damage Over Time (dégâts dans le temps)

### Mécaniques de Base

#### Attack Rating (Chance de toucher)
- Plus élevé = plus de chances de toucher
- Contre Parry Ratio de l'adversaire
- Influencé par STR et INT

#### Parry Ratio (Chance de bloquer)
- Plus élevé = plus de chances de bloquer
- Réduit les dégâts reçus
- Influencé par le type d'arme et shield

#### Critical Hits
- Chance de coup critique
- Dégâts bonus (généralement +50%)
- Influencé par les stats et équipement

---

## 🧮 Mécaniques Avancées

### Guide Principal
👉 **[28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md)** - Mécaniques avancées + Code

### Formules de Dégâts

#### Dégâts Physiques
```
Dégâts PHY = (PHY ATK - PHY DEF cible) × Multiplier skill × Crit
```

#### Dégâts Magiques
```
Dégâts MAG = (MAG ATK - MAG DEF cible) × Multiplier skill × Crit
```

#### Attack Rating vs Parry Ratio
```
Chance de toucher = Attack Rating / (Attack Rating + Parry Ratio cible)
```

### Système de Critiques

#### Critical Hit Rate
- Base : 5%
- +1 DEX = +0.5% crit (certains builds)
- Équipement critique : +2% à +10%
- Maximum effectif : ~50%

#### Critical Damage
- Base : +50% dégâts
- Bonus équipement : +10% à +30%
- Certains skills : +100%+

### Socket System

#### Pierres Magiques
| Pierre | Effet | Max Slots |
|--------|-------|-----------|
| **Attack** | +PHY ATK/MAG ATK | 4 |
| **Defense** | +PHY DEF/MAG DEF | 4 |
| **HP** | +HP max | 4 |
| **MP** | +MP max | 4 |
| **Critical** | +Crit rate/dmg | 2 |
| **Parry** | +Parry Ratio | 4 |

### Block et Parry

#### Block (Shield)
- Chance de bloquer 100% dégâts
- Influencé par Block Rate
- Shield required

#### Parry (Arme)
- Réduction dégâts de 0-50%
- Basé sur Parry Ratio
- Fonctionne sans shield

---

## ⚔️ PvP et PK

### Guide Principal
👉 **[20_PVP_PK_SYSTEM.md](20_PVP_PK_SYSTEM.md)** - Système PvP et PK

### Types de PvP

#### 1v1 Duel
- Duel consentu
- Pas de pénalité
- Friendly competition

#### PvP Libre
- Zone PvP activée
- Pas de pénalité de murder
- Fortress, Job wars

#### PK (Player Killing)
- Tue des joueurs innocents
- Compte murder : 1+ par kill
- Pénalités :
  - Perte d'EXP à la mort
  - Drop d'équipement possible
  - NPCs attaquent
  - Teleport aléatoire à la mort

### Murderer System
- **Murder count** : Nombre de PKs
- **Pénalités** : Augmentent avec le count
- **Réduction** : -1 murder par 10 minutes en ligne
- **Redemption** : 500,000 gold pour supprimer 1 murder

---

## 🏆 Builds PvP

### Guide Principal
👉 **[33_PVP_BUILDS.md](33_PVP_BUILDS.md)** - Tier list + Builds PvP détaillés

### Tier List PvP 1v1

#### S-Tier (Dominants)
| Build | Race | Masteries | Pourquoi |
|-------|------|-----------|----------|
| **Warrior/Cleric** | EU | Warrior 110 / Cleric 110 | Survie + dégâts |
| **Rogue/Cleric** | EU | Rogue 110 / Cleric 110 | Burst énorme |

#### A-Tier (Très Forts)
| Build | Race | Masteries | Pourquoi |
|-------|------|-----------|----------|
| **Warlock/Cleric** | EU | Warlock 110 / Cleric 110 | Debuffs + DoT |
| **Wizard/Warrior** | EU | Wizard 110 / Warrior 110 | AOE massives |
| **Sword/Shield** | CH | Bicheon 110 / Cold 110 | Tanky + CC |

#### B-Tier (Viables)
| Build | Race | Masteries | Pourquoi |
|-------|------|-----------|----------|
| **Bow** | CH | Pacheon 110 / Lightning 110 | Kiting |
| **Spear** | CH | Heuksal 110 / Fire 110 | Dégâts PHY max |

### Stratégies PvP

#### Warrior/Cleric
1. Tank les dégâts avec defense buff
2. Heal en continu
3. Attendre OOM ennemi
4. Burst avec 2H weapon

#### Rogue/Cleric
1. Stealth pour surprise
2. Knockdown chain
3. Full burst
4. Stealth et repeat si besoin

#### Wizard/Warrior
1. AOE en masse
2. Kiter avec knockdowns
3. Burst skills
4. Gestion du MP

---

## 🏰 Fortress War

### Guide Principal
👉 **[19_FORTRESS_WAR.md](19_FORTRESS_WAR.md)** - Fortress War complet

### Vue d'Ensemble

#### Qu'est-ce que Fortress War ?
- **Mass PvP** : 300+ joueurs
- **Objectif** : Capturer la forteresse
- **Récompenses** : Gold, drops uniques, buffs guilde
- **Fréquence** : Hebdomadaire

#### Mécaniques
1. **Phase 1** : Briser les portes
2. **Phase 2** : Capturer les bases
3. **Phase 3** : Détruire le heart
4. **Phase 4** : Installer le guild leader

#### Stratégies
- **Full DEF** : Tank build pour gates
- **Full ATK** : DPS pour bases/heart
- **Support** : Buffs et heals
- **AOE** : Pour défenses de masse

### Builds Recommandés FW

#### Tank/Gate Breaker
- Warrior/Cleric full DEF
- Shield + Armor set
- Defense buff max

#### DPS/AOE
- Wizard/Warrior
- Warlock/Cleric
- Spear Nuker

#### Support
- Bard/Cleric
- Full buffer

---

## 📊 Formules et Calculs

### Calcul de Dégâts

#### Formule Complète
```
Dégâts Finals = Base_DMG × Skill_Multiplier × Crit_Multiplier
                × Defense_Reduction × Attack_Vs_Parry
```

#### Exemple de Calcul
```
Warrior avec 10,000 PHY ATK vs Enemy avec 5,000 PHY DEF

Base DMG = 10,000 - 5,000 = 5,000
Skill Multiplier = 200% (Flying Chain)
Crit Multiplier = 150% (Critical hit)
Parry Reduction = 80% (20% blocked)

Final = 5,000 × 2.0 × 1.5 × 0.8
       = 12,000 dégâts
```

### Attack Rating Formula

#### Chance de Toucher
```
Hit Chance = (Your_AR / (Your_AR + Target_PR)) × 100%

Exemple:
Your AR = 5,000
Target PR = 3,000

Hit Rate = 5,000 / (5,000 + 3,000)
        = 5,000 / 8,000
        = 62.5%
```

### Critical Formula

#### Critical Hit Rate
```
Crit Rate = Base_Chance + Gear_Bonus + DEX_Bonus

Exemple:
Base = 5%
Gear = +12%
DEX (24 DEX × 0.5%) = +12%

Total = 5 + 12 + 12 = 29%
```

---

## 💻 Ressources Techniques

### Code TypeScript

#### Damage Calculation
```typescript
// From 28_ADVANCED_MECHANICS.md
interface DamageResult {
  finalDamage: number;
  isCritical: boolean;
  damageBreakdown: DamageBreakdown;
}

function calculateDamage(
  attacker: AttackerStats,
  defender: DefenderStats,
  skill: SkillData
): DamageResult {
  // Calculate base damage
  const baseDamage = attacker.attack - defender.defense;

  // Apply skill multiplier
  const skillDamage = baseDamage * skill.multiplier;

  // Check critical
  const isCritical = Math.random() < attacker.critRate;
  const critMultiplier = isCritical ? (1 + attacker.critDamage) : 1;

  // Apply parry reduction
  const parryReduction = calculateParryReduction(
    attacker.attackRating,
    defender.parryRatio
  );

  // Final damage
  const finalDamage = Math.floor(
    skillDamage * critMultiplier * parryReduction
  );

  return {
    finalDamage,
    isCritical,
    damageBreakdown: {
      baseDamage,
      skillDamage,
      critMultiplier,
      parryReduction
    }
  };
}
```

#### Attack Rating vs Parry Ratio
```typescript
function calculateHitRate(
  attackRating: number,
  parryRatio: number
): number {
  return attackRating / (attackRating + parryRatio);
}

function calculateParryReduction(
  attackRating: number,
  parryRatio: number
): number {
  const hitRate = calculateHitRate(attackRating, parryRatio);
  const minReduction = 0.5; // 50% min damage
  const maxReduction = 1.0;  // 100% max damage

  return minReduction + (hitRate * (maxReduction - minReduction));
}
```

---

## 🎓 Guides Progressifs Combat

### Débutant
1. **Comprendre les bases**
   - [Système de combat](04_COMBAT_SYSTEM.md)
   - Attributs STR vs INT
   - PHY ATK vs MAG ATK

2. **Premier PvP**
   - Duel friendly
   - Comprendre cooldowns
   - Gérer le MP

### Intermédiaire
3. **Optimiser son build**
   - [Builds PvP](33_PVP_BUILDS.md)
   - Socket system
   - Attack Rating vs Parry

4. **Stratégies avancées**
   - Counters
   - Matchups
   - Positioning

### Avancé
5. **Maîtriser les formules**
   - [Mécaniques avancées](28_ADVANCED_MECHANICS.md)
   - Theorycrafting
   - Min-maxing

---

## 📚 Voir aussi

### Systèmes de Combat
- [Système de combat](04_COMBAT_SYSTEM.md) - Mécaniques de base
- [Mécaniques avancées](28_ADVANCED_MECHANICS.md) - Formules + Code
- [PvP et PK](20_PVP_PK_SYSTEM.md) - Système PvP

### Builds et Classes
- [Hub Classes](HUB_CLASSES.md) - Centralise classes et builds
- [Builds PvP](33_PVP_BUILDS.md) - Tier list et builds
- [Builds PvE](34_PVE_BUILDS.md) - Farming optimisé

### Mass PvP
- [Fortress War](19_FORTRESS_WAR.md) - Mass PvP 300+
- [Job Strategies](35_JOB_STRATEGIES.md) - PvP job

### Équipement
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun
- [Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement +1 à +12
- [Item Degrees](07_ITEM_DEGREES.md) - Système 1D-13D

---

**Dernière mise à jour:** 2025-01-20
**Hub Combat** - Centralise toute l'information sur le combat SRO
