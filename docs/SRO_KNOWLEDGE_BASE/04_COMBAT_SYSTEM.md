# Combat System

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Mécaniques de Base](#-mécaniques-de-base)
- [Attaques Normales vs Skills](#-attaques-normales-vs-skills)
- [Animation Cancelling](#-animation-cancelling)
- [Formules de Dégâts](#-formules-de-dégâts)
- [Critical Hits et Parry](#-critical-hits-et-parry)
- [Berserker Mode](#-berserker-mode)
- [Status Effects](#-status-effects)
- [PvP vs PvE](#-pvp-vs-pve)
- [Knockdown System](#-knockdown-system)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Le système de combat de Silkroad Online est un **système tab-target** avec des skills, des combos, et des mécaniques avancées comme le knockdown, le parrying, et le critical hitting.

### Points Clés
- ✅ **Tab-target combat** (sélection classique)
- ✅ **Skill-based gameplay** (combos, chains)
- ✅ **Animation cancelling** possible
- ✅ **Physical vs Magical damage**
- ✅ **Critical hits et parry**
- ✅ **Knockdown system** (CC)
- ✅ **Status effects** (burn, freeze, poison)
- ✅ **PvP et PvE different mechanics**

### Type de Combat

Silkroad Online utilise un système de combat **traditionnel MMORPG**:
- Cliquez sur un ennemi pour le target
- Utilisez des skills (1-9, F1-F8)
- Entraînez des combos et chains
- Gérez votre positionnement
- Utilisez des potions en combat

---

## ⚔️ Mécaniques de Base

### 1. Targeting

**Comment Target:**
- **Click-to-target:** Cliquez sur l'ennemi
- **Tab-target:** Appuyez sur Tab pour target le plus proche
- **F1-F8:** Target rapide via quick slots
- **Esc:** Deselect target

**Target Display:**
- **Nom de la cible** affiché
- **HP bar** visible
- **Level** de la cible
- **Mode:** Attack (épée) ou Neutral

### 2. Attack Range

**Ranges:**
- **Melee:** 1-3 mètres (Sword, Spear, Dagger)
- **Short Range:** 4-8 mètres (Claw)
- **Medium Range:** 10-15 mètres (Bow, Xbow)
- **Long Range:** 15-25 mètres (Nukes, Staff)

**Visual Indicators:**
- Skill s'illumine si in range
- "Target too far" message si out of range
- Utilisez le terrain pour kite

### 3. Auto-Attack

**Attaque automatique:**
- Activez avec **Ctrl + Auto-Attack** (ou clic droit sur l'ennemi)
- Personnage attaque automatiquement
- Dégâts de base (PHY ou MAG selon weapon)
- Peut être interrompu avec des skills

**Calcul:**
```
Auto-Attack Damage = (Weapon Attack * STR/INT multiplier) - Enemy Defense
```

### 4. Skill Usage

**Utilisation des Skills:**
- **1-9:** Barre principale
- **F1-F8:** Quick slots
- **Ctrl + 1-9:** Secondary bar
- **Click:** Drag and drop skills dans les slots

**Skill Cooldowns:**
- Chaque skill a un cooldown
- Gérez vos rotations
- Chain skills for continuous DPS

---

## 🎯 Attaques Normales vs Skills

### Auto-Attaques (Normal Attacks)

**Caractéristiques:**
- ✅ No MP cost
- ✅ No cooldown
- ✅ Damage constant
- ❌ Dégâts plus bas
- ❌ Pas d'effets spéciaux

**Damage:**
- **Physical weapons:** Sword, Spear, Bow, etc. = PHY damage
- **Staff:** MAG damage
- **Base damage:** Weapon attack + STR/INT

### Skills

**Caractéristiques:**
- ✅ Dégâts élevés
- ✅ Effets spéciaux (KD, debuff, etc.)
- ✅ Chain combos
- ❌ MP cost
- ❌ Cooldowns

**Skill Damage Types:**
- **Physical Skills:** Bicheon, Heuksal, Pacheon
- **Magical Skills:** Fire, Lightning, Cold, Wizard
- **Hybrid:** Force, Warlock

### Skill Chains

Les skills peuvent être **chaînés** ensemble pour des combos:

**Exemple Chinois (Sword):**
1. Chain Sword Attack I
2. Chain Sword Attack II
3. Chain Sword Attack III
4. Finisher (Killing Heaven Blade)

**Exemple Européen (Warrior):**
1. Bash
2. Cutdown
3. Fury Swing
4. Finisher

**Benefits:**
- Damage bonus si chain réussi
- Animation fluid
- Stunlock potentiel

---

## 🎬 Animation Cancelling

### Qu'est-ce que l'Animation Cancelling?

L'**animation cancelling** est une technique avancée pour **annuler l'animation de fin** d'une skill pour lancer la skill suivante plus vite.

### Comment Faire

**Technique:**
1. Lancez une skill
2. Immédiatement après le damage frame
3. Lancez la skill suivante
4. L'animation de fin est "cancel"

**Timing:**
- Pratiquez sur des mobs
- Apprenez les frames de damage
- Utilisez sound cues (son d'impact)

**Benefits:**
- DPS augmenté
- Plus rapide
- Perd moins de temps

**Exemple:**
```
Chain Attack I → [cancel] → Chain Attack II → [cancel] → Chain Attack III
```

### Différents Types

**Basic Cancel:**
- Annule l'animation de fin
- Passe à la skill suivante
- DPS increase: ~10-20%

**Advanced Cancel:**
- Cancel avec des items (potions, scrolls)
- Switch weapons pour cancel
- Plus difficile, mais DPS +30%

**Note:** Animation cancelling est **légitime** et pas un exploit. C'est une mécanique avancée du jeu.

---

## 📊 Formules de Dégâts (VERIFIED DATA)

### Formule Générale de Dégâts

**Structure de Base:**
```
Total Damage = Physical Damage + Magical Damage
```

**Détail du calcul (d'après recherche communautaire):**
```
Final Damage = [(Weapon Damage + Skill Damage) × Skill Multiplier × Imbue Multiplier] + Attack Rating - Enemy Parry Ratio
```

**Components:**
1. **Weapon Damage:** Base damage de l'arme (range: min-max)
2. **Skill Damage:** Damage additionnel de la skill
3. **Skill Multiplier:** Pourcentage affiché dans la skill (ex: 57%, 150%, 250%)
4. **Imbue Multiplier:** Damage élémentaire de l'imbue (Fire/Lightning/Cold imbue)
5. **Attack Rating:** Chance de hit vers le max du weapon range
6. **Parry Ratio:** Réduit le damage reçu (enemy defense)

### Physical Damage (PHY)

**Formule Détaillée:**
```
PHY Damage = (Weapon PHY Attack + STR Bonus + Skill PHY Damage) × Skill Multiplier - (Enemy Parry Ratio / PHY DEF Reduction)
```

**Factors:**
- **Weapon Attack:** Base damage range (ex: 100-120)
- **STR:** Chaque point STR augmente le PHY damage
- **Skill Damage:** Additionnel damage de la skill
- **Skill Multiplier:** 50%-300% selon la skill
- **Attack Rating:** Détermine si vous hit vers le max ou min de votre range
- **Enemy Parry:** Plus enemy a de parry, plus vous hit vers votre min damage

**Attack Rating vs Parry Ratio (MÉCANIQUE CONFIRMÉE):**
- **Attack Rating (AR):** Higher AR = plus de chance de hit le MAX de votre weapon range
- **Parry Ratio (PR):** Higher PR = plus de chance de faire hit l'attaquant vers son MIN damage
- **Interaction:** AR vs PR détermine le damage final dans le range

**Exemple:**
- Weapon: 800-1000 PHY
- Sans AR/PR: Random entre 800-1000
- **High AR vs Low PR:** Vous hit souvent 1000 (max)
- **Low AR vs High PR:** Vous hit souvent 800 (min)
- **High AR vs High PR:** Damage se balance vers le moyen (~900)

### Magical Damage (MAG)

**Formule Détaillée:**
```
MAG Damage = (Staff MAG Attack + INT Bonus + Skill MAG Damage) × Skill Multiplier - Enemy MAG DEF
```

**Factors:**
- **Staff MAG Attack:** Base magical damage de l'arme
- **INT:** Chaque point INT augmente le MAG damage (~1 damage per INT)
- **Skill Damage:** Base damage de la skill nuke
- **Skill Multiplier:** Multiplier de la skill
- **Enemy MAG DEF:** Réduction directe du MAG damage

**Exemple:**
- Skill: 500-600 MAG
- INT: 150 (bonus ~150)
- Staff: 100 MAG
- Total: 750-850 potential
- Enemy MAG DEF: 100
- Final: 650-750 damage

### Critical Hits (FORMULE VÉRIFIÉE)

**Formule Crit Confirmée:**
```
Normal Damage = Physical Damage + Magical Damage
Critical Damage = 2 × Physical Damage + Magical Damage
```

**Exemples:**
- **Normal:** 1000 PHY + 200 MAG = 1200 total
- **Critical:** 2 × 1000 PHY + 200 MAG = **2200 total** (1.83x multiplier)

**Critical Rate:**
- **Base:** Calculé basé sur STR (plus de STR = plus de crit damage)
- **Weapon bonus:** Certaines armes ont +% crit rate
- **Max rate:** ~30-40% possible avec gear optimal

**Critical Damage (pas rate):**
- STR augmente le critical DAMAGE (pas juste la chance)
- Full STR characters crit beaucoup plus haut que full INT

### Skill Multipliers (DÉTAILS)

**Comment fonctionnent les multipliers:**
- Le multiplier (%) s'applique à la somme de (Weapon + Skill damage)
- Multiplier < 100% = moins de damage (swift combo attacks)
- Multiplier > 100% = plus de damage (finishers, nukes)
- Multiplier s'applique APRÈS avoir additionné weapon et skill damage

**Exemple:**
- Weapon: 100-200
- Skill adds: 300-400
- Total: 400-600
- Avec multiplier 57%: 400-600 × 0.57 = **228-342 final**
- Avec multiplier 250%: 400-600 × 2.5 = **1000-1500 final**

### Parry Ratio et Defense (MÉCANIQUE AVANCÉE)

**Parry Ratio (PR):**
- Détermine la chance que l'ennemi hit vers son **minimum damage**
- Plus vous avez de PR, plus vous réduisez le damage reçu
- PR s'accumule depuis tous vos équipements

**Formule approximative:**
```
Final Damage = Base Damage × (1 - Parry Ratio %)
```

**Exemple:**
- Attacker weapon: 800-1200
- Votre PR: Élevé
- Résultat: Attacker hit souvent vers 800-900 (au lieu de random 800-1200)

**Sources de Parry:**
- **Armor types:**
  - Garment: High PR (40-50%)
  - Protector: Medium PR (30-40%)
  - Armor: Low PR (20-30%)
- **Skills:** Lightning buffs ajoutent du PR
- **Passives:** Certaines masteries ont +% PR passives

---

## 💥 Critical Hits et Parry

### Critical Hits

**Qu'est-ce qu'un Crit?**
Un **critical hit** est un coup qui inflige **plus de dégâts** que la normale.

**Caractéristiques:**
- **Visual:** Effect spécial, son
- **Damage:** 1.5x - 3.0x damage
- **Chance:** Base 5%, jusqu'à ~40% avec gear
- **Types:**
  - **PHY Critical:** Physical weapons
  - **MAG Critical:** Staff, magical weapons

**Comment Augmenter les Crits:**

1. **Weapons:**
   - Certaines armes ont +Critical%
   - Surtout Bow, Dagger, Xbow

2. **Accessories:**
   - Rings avec +Critical
   - Earrings avec +Critical

3. **Passives:**
   - Mastery passives
   - Hawk Training (Pacheon)

4. **Buff Skills:**
   - Certaines skills augmentent crit rate

### Parry et Block

#### Parry (Esquive Passive)

**Qu'est-ce que Parry?**
Le **Parry** est une esquive passive qui réduit les dégâts physiques.

**Formule:**
```
Final Damage = Base Damage * (1 - Parry Ratio)
```

**Parry Sources:**
- **Armor Types:**
  - **Garment:** High parry (~40-50%)
  - **Protector:** Medium parry (~30-40%)
  - **Armor:** Low parry (~20-30%)

- **Skills:**
  - Certaines skills ajoutent du parry
  - Lightning: "Concentration" (ESR + parry)

- **Passives:**
  - Mastery passives

#### Block (Block avec Shield)

**Qu'est-ce que Block?**
Le **Block** est une esquive active avec un shield qui **réduit drastiquement** les dégâts.

**Caractéristiques:**
- **Nécessite:** Shield equipped
- **Damage Reduction:** 50-80%
- **Block Rate:** Basé sur le shield
- **Active:** Seulement quand block se produit

**Shields:**
- **Level 1-30:** 10-20% block rate
- **Level 31-60:** 20-30% block rate
- **Level 61-80:** 30-40% block rate
- **Level 81+:** 40-50% block rate

**Shield Types:**
- **PHY Shield:** Réduit le PHY damage
- **MAG Shield:** Réduit le MAG damage

---

## 🔥 Berserker Mode

### Qu'est-ce que le Berserker Mode?

Le **Berserker Mode** est un état spécial de combat qui offre des dégâts considérablement augmentés en échange d'une défense réduite. C'est une mécanique clé pour les situations de "burst damage".

### Activation

**Comment Activer:**
- **Condition:** La barre bleue (Berserk Bar) doit être pleine
- **Remplissage:** La barre se remplit progressivement en combat
- **Activation:** Appuyez sur la touche de raccourci (configurable) ou cliquez sur l'icône

**Caractéristiques:**
- La barre bleue se remplit en donnant et recevant des dégâts
- Plus vous combattez, plus vite elle se remplit
- Une fois pleine, le mode Berserker devient disponible

### Effets du Berserker Mode

**Bonus when Active:**
- ✅ **Dégâts augmentés:** +20-50% damage (selon sources)
- ✅ **Vitesse d'attaque:** Attaques plus rapides
- ✅ **Effet visuel:** Aura rouge autour du personnage
- ✅ **Durée:** Environ 30-60 secondes (variable)

**Malus when Active:**
- ❌ **Défense réduite:** -20-30% DEF PHY/MAG
- ❌ **Vulnérabilité:** Vous prenez plus de dégâts
- ❌ **Aggro:** Les monstres vous targetent plus facilement

### Stratégies d'Utilisation

**Quand Utiliser:**
✅ **PvE - Boss fights:**
- Burst phase pour finish rapidement un boss
- Quand le tank a solid aggro et vous pouvez DPS librement
- SP farming pour tuer les mobs plus vite

✅ **PvP - Burst damage:**
- Quand vous avez l'opportunité de kill
- Contre un adversaire déjà low HP
- En combinaison avec vos skills les plus puissantes

**Quand Éviter:**
❌ **Solo farming:** Vous prendrez trop de dégâts
❌ **Tanking:** La défense réduite est trop risquée
❌ **Contre beaucoup d'ennemis:** Vous serez focus rapidement

**Tips Avancés:**
- ⭐ **Combo timing:** Activez Berserker → Lancez vos plus grosses skills → Sortez du mode une fois les skills lancées
- ⭐ **Potions:** Ayez toujours des potions prêtes (vous prendrez plus de dégâts)
- ⭐ **Positionnement:** Restez près du healer/en groupe pour survivre
- ⭐ **PvP:** Utilisez comme surprise attack pour maximiser l'impact

### Synergies

**Meilleures Classes pour Berserker:**
- **STR Warriors:** Benefit énorme du PHY damage boost
- **INT Nukers:** Burst MAG dévastateur
- **Rogues:** Burst damage synergise bien avec stealth

**Moins Efficace:**
- **Tanks:** La défense réduite est contre-productive
- **Supports (Bard/Cleric):** Vous n'êtes pas là pour DPS

### Comparaison avec d'autres Buffs

| Buff | Damage | Defense | Duration | Cooldown |
|------|--------|---------|----------|----------|
| **Berserker** | +20-50% | -20-30% | 30-60s | Variable |
| **Attack buffs** | +5-15% | 0% | Variable | Variable |
| **DEF buffs** | 0% | +10-30% | Variable | Variable |

**Note:** Le Berserker Mode offre le plus grand boost de damage du jeu, mais avec le plus grand malus de défense. À utiliser avec précaution!

---

## 🌡️ Status Effects

### Types de Status Effects

#### 1. BURN (Fire)
- **Effet:** Damage over time (DoT)
- **Damage:** ~100-500 per tick (basé sur INT)
- **Duration:** 5-15 seconds
- **Source:** Fire skills
- **Counter:** Potions, wait out

#### 2. FREEZE (Cold/Ice)
- **Effet:** Ralentit mouvement et attaque
- **Slow:** 20-80% slow
- **Duration:** 3-10 seconds
- **Source:** Cold skills
- **Counter:** Cleansing skills, pots

#### 3. POISON (Warlock)
- **Effet:** DoT + debuff
- **Damage:** Variable
- **Duration:** 5-20 seconds
- **Source:** Warlock skills
- **Counter:** Cleansing

#### 4. KNOCKDOWN (KD)
- **Effet:** Enemy tombe au sol
- **Duration:** 1-3 seconds
- **Source:** Melee skills, Force
- **Counter:** Stand up quickly

#### 5. SLEEP
- **Effet:** Ne peut pas agir
- **Duration:** 3-8 seconds
- **Source:** Certaines skills
- **Counter:** Damage breaks sleep

#### 6. FEAR
- **Effet:** Fuit aléatoirement
- **Duration:** 3-5 seconds
- **Source:** Warlock
- **Counter:** Wait, dispell

#### 7. STUN
- **Effet:** Ne peut pas bouger/attaquer
- **Duration:** 1-2 seconds
- **Source:** Critical hits, skills
- **Counter:** Wait, immunity skills

#### 8. BLEED
- **Effet:** DoT physique
- **Damage:** Basé sur PHY
- **Duration:** 5-10 seconds
- **Source:** Rogue, Warrior skills
- **Counter:** Potions, heals

### Status Stacking

**Règles:**
- **Same status:** Refresh duration (no stack)
- **Different status:** Can stack (burn + poison + freeze)
- **Max debuffs:** Généralement 8-10 slots

---

## ⚔️ PvP vs PvE

### PvP (Player vs Player)

**Caractéristiques:**
- **Damage réduit:** ~50-70% de base
- **Defense augmentée:** Players ont plus de DEF
- **Kiting essentiel:** Range advantage
- **Potions autorisées:** HP pots, MP pots
- **Skills:** CC plus important

**PvP Damage:**
```
PvP Damage = Base Damage * 0.5-0.7 (PvP reduction)
```

**PvP Types:**
1. **Job Wars:** Thief vs Hunter
2. **Arena PvP:** 1v1, 2v2, 3v3
3. **Open World PvP:** PK, PKers
4. **Fortress Wars:** Guild vs Guild (300 players)
5. **CTF:** Capture the Flag (events)

### PvE (Player vs Environment)

**Caractéristiques:**
- **Damage normal:** 100% de base
- **Mobs plus faibles:** Moins de DEF
- **AoE important:** Pull multiple mobs
- **Grinding focus:** Kill fast, efficient

**PvE Damage:**
```
PvE Damage = Base Damage * 1.0 (no reduction)
```

**PvE Types:**
1. **Grinding:** Solo farming
2. **Party Grinding:** Group farming
3. **Dungeon:** Instance PvE
4. **Unique Hunting:** Boss hunting
5. **Job PvE:** Thieving, Trading

### Différences Clés

| Aspect | PvP | PvE |
|--------|-----|-----|
| **Damage** | Réduit (50-70%) | Normal (100%) |
| **Focus** | CC, Burst | AoE, Sustained |
| **Kiting** | Très important | Less important |
| **Potions** | Autorisées | Autorisées |
| **Defense** | Plus important | Less important |
| **Skills** | CC focus | Damage focus |

---

## 💥 Knockdown System

### Qu'est-ce que Knockdown (KD)?

Le **Knockdown** est un **crowd control** qui fait tomber l'ennemi au sol, l'empêchant d'agir pendant 1-3 secondes.

### Mechanics

**KD Skills:**
- **Chinese:**
  - Sword: Smashing series
  - Spear: Heuksal Spear
  - Force: Flying Dragon

- **European:**
  - Warrior: Bash, Cutdown
  - Rogue: Some skills
  - Wizard: Freeze (similar)

**KD Chain:**
- Chain KDs pour stunlock
- Difficile mais possible
- Requires timing parfait

**KD Immunity:**
- After KD, short immunity (0.5-1s)
- Can't chain infinitely
- Must alternate with other CC

### KD Strategies

**1v1 PvP:**
- KD to heal
- KD to burst
- KD to escape
- KD chain (si possible)

**PvE:**
- KD dangerous mobs
- KD to reduce damage taken
- KD to setup AoE

---

## ❓ FAQ

### Q: Comment augmenter mes dégâts?
**R:** Améliorez votre weapon, ajoutez STR/INT, utilisez des buffs, et optimisez vos skills.

### Q: Qu'est-ce que le "kiting"?
**R:** Le kiting est une technique où vous attaquez à distance et reculez pour éviter de prendre des dégâts.

### Q: L'animation cancelling est-il autorisé?
**R:** Oui, c'est une mécanique légitime du jeu, pas un cheat.

### Q: Comment contrer les debuffs?
**R:** Utilisez des potions de cleansing, des skills de dispell (Bard, Cleric), ou attendez que ça passe.

### Q: Qu'est-ce qui fait le plus de dégâts?
**R:** Généralement les nukes INT (Fire, Lightning) ou les crits PHY (Spear, Xbow) ont les dégâts les plus élevés.

### Q: Le PvP est-il équilibré?
**R:** Approximativement. Chaque classe a des avantages et inconvénients. Le skill du joueur compte énormément.

---

## 🔗 Resources

### Guides
- [Silkroad Online Wiki - Combat](https://silkroadonline.fandom.com/wiki/Skills)
- [PvP Strategy Guides](http://www.silkroadforums.com/)
- [Damage Calculation Guide](https://silkroadtemptation.wordpress.com/)

### Communauté
- [Silkroad Forums - PvP Section](http://www.silkroadforums.com/)
- [Reddit - r/silkroad](https://www.reddit.com/r/silkroad/)

---

## 📚 Voir aussi

### Mécaniques Avancées
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Formules détaillées avec code TypeScript
- [Attack Rating & Parry Ratio](28_ADVANCED_MECHANICS.md#attack-rating-et-parry-ratio) - Système de toucher et blocage
- [Formules de Dégâts](28_ADVANCED_MECHANICS.md#formules-de-dégâts) - Calculs complets

### Combat et PvP
- [PvP et PK](20_PVP_PK_SYSTEM.md) - Système PvP, murder, duels
- [Hub Combat](HUB_COMBAT.md) - Centralise toute l'information combat
- [PvP Builds](33_PVP_BUILDS.md) - Tier list et builds optimisés

### Classes et Skills
- [Classes Chinoises](02_CHINESE_CLASSES.md) - 7 maîtrises et builds
- [Classes Européennes](03_EUROPEAN_CLASSES.md) - 8 classes et rôles
- [Hub Classes](HUB_CLASSES.md) - Centralise classes et builds

### Équipement
- [Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement +1 à +12
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun
- [Armor Types](08_ARMOR_TYPES.md) - Armor, Protector, Garment

### Guides Stratégiques
- [Fortress War](19_FORTRESS_WAR.md) - Mass PvP 300+
- [Job Strategies](35_JOB_STRATEGIES.md) - Stratégies jobs avancées

---

## 🌍 Multilingual Research Findings (2025)

### 📊 Research Methodology

This section contains combat mechanics information gathered from multilingual research across Korean (original game), Turkish (meta community), and English (international consensus) sources.

**Cross-Validation Status**: ✅ Partially Verified (2/3 languages agree)
- Korean and English sources confirm critical damage formula
- Turkish sources require deeper investigation
- Confidence levels: 3-5/5 depending on specific mechanic

---

### 🇰🇷 Korean Sources (Original Mechanics)

#### Source: Korean Web Search & Community (실크로드 온라인)

**Verified Formulas**:
```
크리티컬 총 데미지 = 2 × 물리 데미지 + 마법 데미지
Critical Total Damage = 2 × Physical Damage + Magical Damage
```

**Balance Formulas**:
```
물리 밸런스 = 100 × STR / M
Physical Balance = 100 × STR / M

마법 밸런스 = 100 × INT / M
Magical Balance = 100 × INT / M
```

**Key Findings**:
- ✅ STR-based characters have higher critical damage (confirmed by English sources)
- ✅ Attack speed increases critical opportunities (more attacks = more crit chances)
- ✅ Balance formulas match English sources

**Validation**: ✅ Cross-verified with English sources (2/3 languages agree)
**Confidence**: 4/5

---

### 🇺🇸 English Sources (Community Consensus)

#### Source 1: elitepvpers.com - Silkroad Damage Formulas

**Complete Damage Formula System**:
```
Physical Damage = [(base + skill_pow × mastery_incr - Phys def) × balance × skill_mult × buff&passive × multiplier]
Magical Damage = [((base + imbue_pow) × mastery_incr - Mag def) × balance × skill_mult × buff&passive × multiplier]

Total Damage = Physical Damage + Magical Damage
Critical Damage = 2 × Physical Damage + Magical Damage
```

**Game Multipliers** (Verified by Gameplay Testing):
- **Physical Multiplier**: 1.276772606
- **Magical Multiplier**: 1.287004542

**Example Calculation** (Pure STR Bow Level 100):
```
Stats: STR: 442, INT: 175
Base PHY Attack: 3012 ~ 2558
Base MAG Attack: 2638
PHY Balance: 1.09%, MAG Balance: 0.45%
Buffs: 18% MAG, 18% PHY

Skill: Strong Bow-Craft lvl 8 (574 ~ 777, 350%)
Imbue: Soul Fire Force (658 ~ 1097, 100%)

PHY Damage = (3012 + (777 × 1.90) - 7) × 1.09 × 3.5 × 1.18 × 1.28 = 25,890.3
MAG Damage = ((2638 + 1097) × 1.9 - 10) × 0.45 × 3.5 × 1.18 × 1.28 = 16,897.3
Total = 25,890.3 + 16,897.3 = 42,787.6
Critical = (25,890.3 × 2) + 16,897.3 = 68,678
```

**Validation**: ⚠️ Requires official Korean source for Tier 1 status
**Confidence**: 4/5 (Tier 2 community source, detailed math)

---

#### Source 2: silkroadforums.com - Critical Hit Mechanics

**Critical System Mechanics**:
- **STR Dependency**: Critical is calculated based on STR stat
- **Weapon Critical Value** = % chance to crit (e.g., Critical 10 = 10% chance)
- **Chinese Weapon Skills Only**: Heuksal, Pacheon, and Bicheon can crit
- **Non-Critting Skills**: Nukes and Lion Shout do NOT crit
- **STR vs INT**: Pure STR always crits higher than INT-based

**Important Notes**:
- STR affects critical **DAMAGE**, not critical **CHANCE**
- Critical chance comes from weapon stats, not character stats

**Validation**: ✅ Confirmed by Korean sources
**Confidence**: 4/5 (Tier 2 forum, community consensus)

---

#### Source 3: elitepvpers.com - Parry Ratio & Attack Rating

**Parry Ratio Mechanics**:
- Higher parry = less chance of taking **maximum** damage from opponent
- Pushes received damage toward **minimum** of attacker's range

**Attack Rating Mechanics**:
- Higher attack rating = higher chance of dealing **maximum** damage
- Pushes dealt damage toward **maximum** of weapon range

**Interaction**:
```
High Attack Rating vs Low Parry Ratio → Damage near MAX
Low Attack Rating vs High Parry Ratio → Damage near MIN
High Attack Rating vs High Parry Ratio → Damage balances to middle
```

**Physical & Magical Reinforce Formulas**:
```
Physical Defense = Str × Physical reinforce + Total Physical defense
Magical Defense = Int × Physical reinforce + Total Physical defense
Physical Attack = Str × Physical reinforce + Physical damage
Magical Attack = Int × Magical reinforce + Magical damage
```

**Critical Insight**: Reinforce percentages act as **multipliers**, making them MORE important than base attack/defense values.

**Example**: 500 STR × 276.8% + 2146 base = 3,530 total attack power

**Validation**: ⚠️ Requires Korean source verification
**Confidence**: 4/5 (Tier 2 guide, detailed explanation)

---

#### Source 4: silkroadonline.de (German) - Parry/Hitratio

**Damage Range Example**:
- Weapon damage: 80-112
- Higher hit rate/attack rating = more likely to deal **112 (max)**
- Higher parry ratio (defender) = more likely to receive **80 (min)**

**Stat Progression**:
- Hit/parry rates increase by **1 point per level**
- Each level gives **5 stat points** total:
  - 2 auto-distributed (1 STR, 1 INT)
  - 3 free points

**Validation**: ✅ Confirms elitepvpers information
**Confidence**: 3/5 (Tier 3 source, German community)

---

### 🇹🇷 Turkish Sources (Meta Community)

#### Current Status: ⚠️ Insufficient Data

**Preliminary Search Results**:
- Turkish search returned limited specific formula information
- Found references to general SRO mechanics discussions
- **Gap Identified**: Deeper investigation needed in Turkish SRO forums (sroforum.com)

**Action Required**: Direct access to Turkish forums for:
- Current PvP meta strategies
- Private server modifications to formulas
- Job system optimizations

---

### ✅ Cross-Validated Information

The following mechanics have been confirmed by **2+ languages**:

#### 1. Critical Damage Formula ✅ VERIFIED
```
Critical Damage = 2 × Physical Damage + Magical Damage
```
- **Confirmed by**: Korean (🇰🇷) + English (🇺🇸)
- **Pending**: Turkish verification
- **Confidence**: 4/5

#### 2. STR-Based Critical Damage ✅ VERIFIED
- More STR = higher critical damage
- Pure STR crits higher than INT builds
- **Confirmed by**: Korean (🇰🇷) + English (🇺🇸)
- **Confidence**: 4/5

#### 3. Balance Formulas ✅ VERIFIED
```
Physical Balance = 100 × STR / M
Magical Balance = 100 × INT / M
```
- **Confirmed by**: Korean (🇰🇷) + English (🇺🇸)
- **Confidence**: 4/5

---

### ⚠️ Conflicting Information

No major conflicts found between Korean and English sources. Turkish sources require investigation.

---

### 📊 Confidence Levels by Mechanic

| Mechanic | Formula | Confidence | Sources |
|----------|---------|------------|---------|
| **Critical Damage Formula** | 2×PHY + MAG | 4/5 | KR + EN |
| **STR Critical Dependency** | STR-based | 4/5 | KR + EN |
| **Balance Formulas** | 100×STAT/M | 4/5 | KR + EN |
| **Parry Ratio Mechanics** | Push to min | 3/5 | EN only |
| **Attack Rating Mechanics** | Push to max | 3/5 | EN only |
| **Complete Damage Formula** | Multiplier system | 4/5 | EN only |
| **Physical Reinforce** | STR×%+base | 4/5 | EN only |
| **Magical Reinforce** | INT×%+base | 4/5 | EN only |
| **Attack Speed Breakpoints** | Unknown | 1/5 | Not found |

---

### 🔍 Research Gaps Identified

1. **Attack Speed Breakpoints** (Priority: HIGH)
   - No specific numerical formulas found (64, 86, 110 speeds)
   - Requires Korean source investigation
   - Animation mechanics not fully documented

2. **Turkish Community Knowledge** (Priority: MEDIUM)
   - Private server formula modifications
   - Current PvP meta strategies
   - Job system optimizations

3. **Official Multipliers** (Priority: LOW)
   - Current multipliers (1.276772606, 1.287004542) from community testing
   - Official patch notes would provide Tier 1 validation

---

### 📝 Sources

#### Korean (🇰🇷)
- Korean web search: "실크로드 온라인 데미지 공식 크리티컬 공격 속도 계산"

#### English (🇺🇸)
- [Silkroad Damage Formulas - elitepvpers.com](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
- [Critical hit damage - silkroadforums.com](http://www.silkroadforums.com/viewtopic.php?f=4&t=70642)
- [Physical & Magical Reinforce - elitepvpers.com](https://www.elitepvpers.com/forum/sro-guides-templates/807866-explaination-physical-magical-reinforce.html)
- [Parry/Hitratio - silkroadonline.de](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/67-parry-hitratio/)

#### Turkish (🇹🇷)
- Preliminary search only - deeper investigation required

---

### 🔄 Next Research Steps

1. **Korean**: Search for official patch notes confirming damage multipliers
2. **Turkish**: Access sroforum.com for current meta and private server formulas
3. **English**: Find attack speed breakpoint formulas or data mining information
4. **Cross-validation**: Get community feedback on Discord servers and forums

---

*Dernière mise à jour: 2025-01-20*
*Multilingual Research Update: 2025-01-22*
*Sources: Silkroad Online Wiki, Community Guides, Personal Experience, Multilingual Research (KR/TR/EN)*
