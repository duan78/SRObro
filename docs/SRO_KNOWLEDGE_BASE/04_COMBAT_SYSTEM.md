# Combat System

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Mécaniques de Base](#-mécaniques-de-base)
- [Vitesses : Attaque / Incantation / Déplacement](#-vitesses--attaque--incantation--déplacement)
- [Attaques Normales vs Skills](#-attaques-normales-vs-skills)
- [Formules de Dégâts](#-formules-de-dégâts)
- [Critical Hits et Parry](#-critical-hits-et-parry)
- [Block et Parry](#-block-et-parry)
- [Vol de vie : Absorb HP / Absorb MP](#-vol-de-vie--absorb-hp--absorb-mp)
- [Berserker Mode](#-berserker-mode)
- [Status Effects](#-status-effects)
- [Imbues Élémentaires Chinoises](#-imbues-élémentaires-chinoises)
- [Knockdown / Knockback / Stab System](#-knockdown--knockback--stab-system)
- [Animation Cancelling](#-animation-cancelling)
- [PvP vs PvE](#-pvp-vs-pve)
- [Différences Client Classique vs Silkroad-R](#-différences-client-classique-vs-silkroad-r)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Le système de combat de Silkroad Online est un **système tab-target** avec des skills, des combos, et des mécaniques avancées comme le knockdown, le parry, le critical hit et le Berserker (Zerk).

### Points Clés
- ✅ **Tab-target combat** (sélection classique, pas d'action combat)
- ✅ **Skill-based gameplay** (combos, chains, cooldowns)
- ✅ **Animation cancelling** possible (technique communautaire majeure)
- ✅ **Physical vs Magical damage** (deux voies de dégâts cumulables)
- ✅ **Critical hits** : seule la partie PHY double, la MAG ne critique pas
- ✅ **Knockdown / Knockback / Stab** (le cœur du PvP melee)
- ✅ **Status effects** nombreux (burn, freeze, frostbite, shock, poison, zombie, decay, division, impotent, dull, fear, panic, disease, hidden, combustion, bind...)
- ✅ **Berserker orb** (jauge se remplissant via les kills)
- ✅ **PvP et PvE** : mêmes formules, différences de contexte (voir [PvP vs PvE](#-pvp-vs-pve))

### Type de Combat

Silkroad Online utilise un système de combat **traditionnel MMORPG**:
- Cliquez sur un ennemi pour le cibler (ou Tab pour le plus proche)
- Utilisez des skills (barres 1-0, Ctrl+1-0, Alt+1-0)
- Les skills ont un **temps d'incantation** (EU) ou sont **instantanés avec animation** (CH)
- Gérez votre positionnement (kiting, distance de skill)
- Utilisez des potions en combat (HP/MP/pills universels)

---

## ⚔️ Mécaniques de Base

### 1. Targeting

**Comment cibler:**
- **Click-to-target:** Cliquez sur l'ennemi
- **Tab-target:** Appuyez sur Tab pour cibler le plus proche
- **Esc:** Désélectionne la cible

**Affichage de la cible:**
- **Nom** de la cible (couleur selon niveau relatif)
- **HP bar** visible
- **Level** de la cible
- **Mode:** attaque / neutre / PvP (cape, job suit, murderer)

### 2. Attack Range (distances de skills)

Les distances sont exprimées en mètres dans les données du client (champ *Distance* de RefSkill) :

| Type | Distance typique | Exemples |
|------|-----------------|----------|
| **Melee (dague/sword/spear)** | 1-3 m | Stab Chain (2 m), Sword Chain (3 m) |
| **Claw / Daggers** | 1-2 m | Coup Bas : 2 m |
| **Scepter / buffs EU** | 0-15 m | Buffs de groupe : 15 m |
| **Bow / Crossbow** | ~10-15 m+ (selon skill) | Strong Bow, Hawk Series |
| **Nukes CH** | 10-15 m+ | nukes Fire/Lightning/Cold |
| **Wizard nukes EU** | 10-20 m+ | Meteor, Blizzard |

**Notes:**
- La majorité des skills melee EU sont à **2 mètres** (données RefSkill vérifiées)
- Certains skills de zone (Cri Désespéré etc.) ont **Distance 3 m / Portée 3 m**
- "Target too far" s'affiche si hors de portée ; le skill ne part pas

### 3. Auto-Attack

**Attaque automatique:**
- Activez avec **clic droit** sur l'ennemi (ou double-clic)
- Le personnage attaque automatiquement à la vitesse de l'arme
- Dégâts de base (PHY ou MAG selon l'arme, les armes CH sword/glaive font les deux)
- Peut être interrompue par les skills / mouvement

### 4. Skill Usage

- **1-0:** Barre principale
- **Ctrl / Alt + touches:** Barres secondaires
- Chaque skill a un **cooldown** (affiché en secondes sur l'icône)
- Les skills EU ont un **cast time** (réduit par la stat *haste/casting speed*)
- Les skills CH sont quasi-instantanés mais avec animations plus longues

---

## ⚡ Vitesses : Attaque / Incantation / Déplacement

### Attack Speed (vitesse d'attaque)

Chaque type d'arme a une **vitesse d'attaque de base** (données items communautaires, elitepvpers "The Way Items Work") :

| Arme | Vitesse | Note |
|------|---------|------|
| **Dagger / Daggers (Rogue)** | Très rapide | Le plus rapide du jeu |
| **Sword CH (1 main) / Staff EU (1 main)** | Rapide | 10 (échelle communautaire) |
| **Harp, Crossbow (visée)** | Moyen | |
| **Glaive / Spear CH** | Moyen | 11 |
| **2H: Blade lourde, Axe de guerre, Épée longue EU** | Lent | 13 |
| **Bow CH** | Très lent | 9 (le plus lent) |

- La stat **"attack speed"** existe en blue sur certaines armes/accessoires
- **Frostbite** réduit la vitesse d'attaque ET de déplacement de la cible
- L'échelle exacte (coups/min) varie selon les sources ; l'ordre relatif est confirmé

### Casting Speed (vitesse d'incantation — principalement EU)

- Les skills **européens** ont des temps d'incantation (0,5 à 2+ secondes)
- La stat **haste / casting speed** réduit ce temps
- Les données RefSkill contiennent deux colonnes : `Cast` de référence et `Cast (hâte)` — le jeu calcule les deux
- Les skills **chinois** sont instantanés (Cast 0) mais leur **animation** conditionne le DPS réel → d'où l'animation cancelling

### Movement Speed (vitesse de déplacement)

- **Base:** vitesse de course standard (~50 en unités jeu ; ~5 m/s effective)
- **Bonus additifs (stack):**
  - Garment set complet (6 pièces) : **+20%**
  - Protector set complet : **+10%**
  - Lightning (passif Wind walk series) : jusqu'à **+50%** au max (selon niveau de skill)
  - Potions/drugs de vitesse : jusqu'à **+50%**
  - Blue stats sur stuff
- **Malus:** Frostbite / Freeze (ralentissement), Heavy armure (pas de bonus set)
- Cap pratique constaté : environ **2× la vitesse de base**

---

## 🎯 Attaques Normales vs Skills

### Auto-Attaques (Normal Attacks)

**Caractéristiques:**
- ✅ Pas de coût MP
- ✅ Pas de cooldown
- ❌ Dégâts beaucoup plus bas qu'un skill
- ❌ Pas d'effets spéciaux (pas de KD, pas de status)
- ✅ Peuvent **crit** (utile pour les builds crit)

**Dégâts:**
- **Armes physiques** (sword, blade, spear, bow, dagger...) : PHY damage
- **Armes magiques** (staff, harp...) : MAG damage
- **Armes hybrides CH** (sword 1M, glaive) : dégâts PHY **et** MAG simultanés (double attaque)
- Base = weapon damage modulée par le renfort STR/INT et l'AR/PR

### Skills

**Caractéristiques:**
- ✅ Dégâts élevés (multipliers 100-600%+)
- ✅ Effets spéciaux (KD, KB, status, buffs, debuffs)
- ✅ Chains / combos
- ❌ Coût MP
- ❌ Cooldowns

**Skill Damage Types:**
- **Physical Skills:** Bicheon, Heuksal, Pacheon (CH) ; Warrior, Rogue, Warlock (dot PHY EU)
- **Magical Skills:** Fire, Lightning, Cold nukes (CH) ; Wizard, Warlock curses (EU)
- **Hybride:** Force (CH), certaines attacks EU mixtes

### Skill Chains

**Exemple Chinois (Sword):**
1. Chain Sword Attack I → II → III (combos à 3 hits)
2. Finisher type Killing Heaven Blade

**Exemple Européen (Warrior):**
1. Bash / Triple Attack
2. Will Turn (KD setup)
3. Sprint Assault / Bloody Storm

**Note importante:** en SRO classique, il n'y a pas de "damage bonus de chain" automatique — les chains existent parce que les skills intermédiaires ont des animations courtes et des KD/KB qui permettent les follow-ups (stabs ×2, etc.).

---

## 📊 Formules de Dégâts

### Formule Générale (source principale : elitepvpers "Silkroad Damage Formulas")

**Structure :**
```
Total Damage = Physical Damage + Magical Damage

Physical Damage = [(base + skill_pow × mastery_incr − Phys def) × balance × skill_mult × buff&passive × multiplier]
Magical Damage = [((base + imbue_pow) × mastery_incr − Mag def) × balance × skill_mult × buff&passive × multiplier]
```

**Composants :**
1. **base** : attaque de base du personnage (weapon + renfort STR/INT, voir ci-dessous)
2. **skill_pow** : puissance de la skill (valeur min~max du skill)
3. **mastery_incr** : bonus de mastery (ex: 1.90 pour un mastery 90 vs skill bas niveau)
4. **Phys/Mag def** : défense de la cible (soustraite)
5. **balance** : Physical/Magical Balance (voir ci-dessous)
6. **skill_mult** : multiplier % de la skill (57%, 350%, etc.)
7. **buff&passive** : multiplicateurs de buffs (+18% attack etc.)
8. **multiplier** : constantes globales du jeu (voir ci-dessous)

**Constantes de conversion (testées communauté, elitepvpers) :**
- **Physical Multiplier : 1.276772606**
- **Magical Multiplier : 1.287004542**

> ⚠️ Ces constantes proviennent de tests joueurs réputés fiables, mais n'ont jamais été confirmées par Joymax. Les serveurs privés les modifient parfois.

### Balance (Physical / Magical)

```
Physical Balance = 100 × STR / M
Magical Balance  = 100 × INT / M
où  M = max(STR × 1.29, INT)
```

- **1 STR ≈ 1.29 INT** dans le calcul du dénominateur → un full STR a un Physical Balance de 100% et un Magical Balance réduit (~77%)
- Un full INT : Magical Balance 100%, Physical Balance ~33%
- Un hybride 1:1 : environ 56%/44%

**Exemple (source elitepvpers, Pure STR Bow lvl 100):**
```
Stats: STR 442, INT 175
Base PHY Attack: 2558 ~ 3012 — Base MAG Attack: 2638 (élémentaire)
Buffs: 18% PHY, 18% MAG
Skill: Strong Bow-Craft lvl 8 (574 ~ 777, 350%)
Imbue: Soul Fire Force lvl 11 (658 ~ 1097, 100%)

PHY = (3012 + 777×1.90 − 7) × 1.09 × 3.5 × 1.18 × 1.28 ≈ 25 890
MAG = ((2638 + 1097) × 1.90 − 10) × 0.45 × 3.5 × 1.18 × 1.28 ≈ 16 897
Total ≈ 42 787   |   Crit ≈ 68 678
```

### Stats dérivées (HP / MP / attaques / défenses)

Sources croisées : evolex.dev calculator + guides elitepvpers :

```
Max HP = 20 × Level + STR × 8 + INT × 2  (+ items)
Max MP = 20 × Level + STR × 2 + INT × 8  (+ items)

Physical Attack = STR × Physical Reinforce (+ weapon)
Magical Attack  = INT × Magical Reinforce (+ weapon)
Physical Defense = armure PHY + STR × Physical Reinforce (défense)
Magical Defense  = armure MAG + INT × Magical Reinforce (défense)
```

**Renforts (Reinforce %)** : les passifs/items ajoutent un % qui **multiplie** la contribution STR/INT. Un renfort élevé vaut souvent plus qu'un +weapon brut. (Ex communauté : 500 STR × 276.8% + 2146 base = 3 530 attack total.)

### Attack Rating vs Parry Ratio (mécanique confirmée)

**⚠️ Mécanique la plus mal comprise du jeu.** L'AR et le PR ne sont PAS des chances de toucher/esquiver type WoW. Il n'y a **pas de miss** sur les attaques normales en SRO (hors rupture de portée) :

- **Attack Rating (attaquant)** : pousse le jet de dégâts vers le **MAX** de la range d'arme
- **Parry Ratio (défenseur)** : pousse le jet de dégâts reçu vers le **MIN** de la range de l'attaquant

```
Arme 80 ~ 112 dégâts :
- Haut AR vs bas PR  → dégâts proches de 112
- Bas AR vs haut PR  → dégâts proches de 80
- AR ≈ PR            → dégâts moyens (~96)
```

**Sources de gain :**
- AR et PR augmentent de **+1 par niveau** de personnage
- **+3 par niveau de mastery** (CH et EU)
- Armes et boucliers apportent des valeurs fixes (hitratio/parry stat)
- Buffs : Lightning "Concentration" series (parry ratio), certains buffs EU

### Skill Multipliers

- Le multiplier (%) s'applique à l'ensemble (weapon + skill power)
- Multipliers typiques : 50-150% (skills rapides/combos), 200-350% (nukes/finishers), jusqu'à 600%+ (skills cap élevé)
- Les skills d'imprégnation (imbues) ont leur propre puissance ajoutée à la partie magique

---

## 💥 Critical Hits et Parry

### Formule du Critical (vérifiée multi-sources)

```
Dégâts normaux = Physical Damage + Magical Damage
Dégâts crit    = 2 × Physical Damage + Magical Damage
```

**Exemples:**
- Normal : 1000 PHY + 200 MAG = 1200
- **Crit : 2 × 1000 + 200 = 2200** (soit ×1.83 pour un hybride 5:1)

**Conséquences :**
- Seule la **partie physique** double → les builds STR crit beaucoup plus fort
- Un full INT (nuker) ne bénéficie presque pas du crit (sa partie PHY est minuscule)

### Qu'est-ce qui peut critiquer ?

- ✅ **Skills d'armes chinois** (Bicheon, Heuksal, Pacheon) : peuvent crit
- ✅ **Attaques normales**
- ✅ **Skills EU** (physiques et, selon tests, magiques — sujet débattu)
- ❌ **Nukes chinois** (Fire/Lightning/Cold) : **ne crit PAS**
- ❌ **Lion Shout** (Lightning) : ne crit pas

### Critical Rate (chance)

- Le **critical rate vient de la stat "Critical" de l'équipement** (weapon surtout, accessoires)
- **Critical 10 = 10% de chance** (correspondance directe)
- Valeurs par degree (données items communautaires) : jusqu'à **Crit 11** (D6), **Crit 15** (D7-8), **Crit 20+** (D9-11) sur le meilleur stuff, ~**25%** atteignable avec un très bon set
- ⚠️ La STR augmente le critical **DAMAGE** (via la formule ci-dessus), **PAS la chance**

---

## 🛡️ Block et Parry

### Block (bouclier uniquement)

- Nécessite un **bouclier équipé** (1 main + bouclier)
- **Block rate = chance directe de bloquer** (stat du bouclier, en %)
- Un bouclier correct a un **block ratio ≥ 15** ; 17+ = excellent/PvP (coûteux)
- Le blocage **annule/reduit fortement** les dégâts de l'attaque bloquée (constaté : dégâts réduits à ~0 ou très faibles)
- Ne bloque pas la plupart des skills magiques/nuke selon retours joueurs (débattu ; vSRO : block s'applique aux attaques PHY)

### Parry (passif, tout le monde)

- Voir [Attack Rating vs Parry Ratio](#formules-de-dégâts) : déplace le jet de dégâts vers le min de la range adverse
- Sources de parry ratio : niveau, masteries, boucliers, armures, buff Lightning Concentration
- **Il n'y a pas de "cap 80%"** — le parry ne réduit pas en %, il déplace le jet dans la range

### Armures et parry/défense (correction d'une erreur fréquente)

Les types d'armure ne donnent PAS un % de parry. Ils diffèrent par :

| Type d'armure | PHY DEF | MAG DEF | Bonus set (complet) |
|---|---|---|---|
| **Armor (heavy)** | Maximum | Faible | aucun |
| **Protector** | Moyen | Moyen | +10% speed, −10% MP cost |
| **Garment** | Faible | Élevé | +20% speed, −20% MP cost |

---

## 🩸 Vol de vie : Absorb HP / Absorb MP

- **Stats bleues d'équipement** : "Absorb HP" / "Absorb MP" (accessoires jusqu'à ~20%, armes 10-35% selon degré)
- Chaque attaque/dégâts infligés rendent un % en HP ou MP
- S'obtient par alchimie (blues) — se retire uniquement par destrction totale de l'item
- **Skills :** certains skills ont un effet Absorb natif (ex. données RefSkill : « Baiser du Vampire » : dégâts + **absorb 50%** des dégâts infligés ; Warlock Leech-type skills)
- Le **Zerk** ne vole pas de vie ; par contre les dégâts absolus (% HP) existent via certains skills

---

## 🔥 Berserker Mode

### La jauge Berserk (orb)

- Une **orb (losange doré)** tombe parfois des monstres tués (~1 kill sur 3, monstres de niveau proche ou supérieur recommandés)
- Il faut **5 orbs** pour remplir la jauge (4 slots + 1)
- La jauge se remplit aussi en frappant/recevant des coups (lentement)
- **Berserk Regeneration Pill** (« Energy of Life ») : remplit instantanément la jauge — cooldown ~20 minutes

### Effets exacts

- Le personnage prend son **mode Berserker** (« Destructeur de masse » → « Démoniaque » → « Dieu » selon le rang du titre)
- **Dégâts multipliés (~×2)** et animations accélérées pendant la durée
- ⚠️ Contrairement à une idée reçue répandue, le Zerk **n'augmente pas la défense** dans le client classique — il booste l'offensif (les variantes mobiles/privées ajoutent parfois des stats)
- ✅ **Corroboration KO (présentation officielle open beta, Inven 20/12/2004)** : le Berserk (환모드, « mode Hwan », jauge 환, touche Tab) y est décrit comme « augmentation brutale de la puissance d'attaque et de la vitesse de déplacement » (공격력·이동속도 급증) — **aucune mention de défense**, ce qui confirme l'absence de bonus défensif. Source 🇰🇷 : https://www.inven.co.kr/webzine/news/?news=2285
- **Blue Zerk** (iSRO, quête titre lvl 95 « Captain » puis 100 « Senior General ») : même dégâts que le zerk rouge mais **+10% de défense** (15% pour la version lvl 100) pour tout le groupe si plusieurs membres l'utilisent

### Stratégies

- **PvP burst :** zerk + plus gros skills + stabs sur KD
- **PvE :** nettoyage de packs de mobs, boss
- La jauge zerk est **conservée** en changeant de zone (mais pas toujours après mort selon version)

---

## 🌡️ Status Effects

### Vue d'ensemble

Les status (« bad states ») sont appliqués par skills et imbues. Structure de données (RefSkill) : chaque skill a des effets avec **Type**, **Valeur**, **Durée**, **Chance**. Types documentés : `Damage` (DoT), `KnockDown`, `KnockBack`, `Stun`, `Sleep`, `Fear`, `Root`, `Dull`, `Weaken`, `Curse` (Disease, Panic, Hidden, Combustion, Decay...), `Absorb`, `Specialized` (Stab).

### Tableau des status

| Status | Effet | Durée typique | Source | Cure |
|---|---|---|---|---|
| **Burn** 🔥 | DoT feu (tick toutes les ~2 s) | 5-10 s | Fire imbue/skills, Warlock | Universal pill 2 |
| **Freeze** ❄️ | Cible **immobile** (root complet) | ~4-6 s | Cold imbue/skills | Universal pill 1, Anti-cold |
| **Frostbite (Frost)** ❄️ | Ralentit déplacement + vitesse d'attaque | variable | Cold imbue/skills | Universal pill 1 |
| **Shock** ⚡ | Réduit le **parry ratio** de la cible | 4-11 s | Lightning imbue/skills | Universal pill ? |
| **Poison** ☠️ | DoT (tick ~2 s) | ~8 s | Rogue (Prick), mobs | Universal pill 2 |
| **Zombie** 🧟 | Les **soins/potions HP infligent des dégâts** à la place de soigner | variable | Warlock (Bloodthirst?) | Universal pill 3 |
| **Bleeding** 🩸 | DoT physique | variable | Rogue/Warrior skills | Universal pill 2 |
| **Decay** 🪦 | DoT qui **brûle le MP** en dégâts | ~10 s | Warlock (Décomposition) | pill 2 |
| **Combustion** 🔥💬 | Brûle le MP de la cible en dégâts | ~10 s | Warlock | pill 3 |
| **Disease (Maladie)** 🤢 | **Bloque les soins** (heal = 0) | ~10 s | Warlock | pill 3 |
| **Panic** 😱 | **Dissipe les consommables** (potion/pill désactivés) | ~10 s | Warlock | pill 3 |
| **Hidden** 👻 | Rend la cible **invisible** (contre-intuitif : débuff utilisé contre l'ennemi) | ~10 s | Warlock | pill 3 / AoE |
| **Fear (Peur)** 💀 | La cible **fuit sans contrôle** | ~3-5 s | Warlock Fear | aucun (hard CC) |
| **Sleep (Sommeil)** 😴 | Cible endormie, **se réveille si touchée** | ~5-10 s | Warlock / Wizard | dégât = break |
| **Stun (Étourdi)** ⭐ | Ne peut rien faire | ~1-3 s | Rogue stun, mobs | aucun (hard CC) |
| **Dull (Cri Désespéré)** | Réduit l'attaque (hit) de la cible | variable | Warlock | pill 3 |
| **Weaken** | **−16% Magical Defense** (valeur RefSkill vérifiée) | ~8 s | Warlock (Bénédiction de Faiblesse) | pill 3 |
| **Decayed (Raze PHY)** | Réduit la défense physique | ~30 s | Warlock Physical Raze | pill 3 |
| **Impotent** | La cible **inflige moins de dégâts** | ~20-30 s | Warlock Combat Raze | pill 3 |
| **Division** | La cible **subit plus de dégâts** | ~20-30 s | Warlock Medical Raze | pill 3 |
| **Bind/Root (Prison)** ⛓️ | Cible immobile (peut attaquer) | ~5-8 s | Warlock Prison Terrestre | aucun/pill 3 |
| **Knockdown** 🌀 | Cible au sol | ~2-4 s | skills melee | aucune (attente) |
| **Knockback** ↔️ | Cible repoussée | instant | skills melee | — |

> ℹ️ Les seuils « pill 1/2/3 » correspondent aux **Universal Pill (Purification) grades** : grade 1 retire Freeze/Frostbite, grade 2 retire Burn/Poison/Decay, grade 3 retire Panic/Dull/Fear-type et curses supérieurs. Les **hard CC** (Stun, KD, Sleep avant break, Fear) ne se soignent pas aux pills — il faut attendre.

> ✅ **Corroborations multilingues (2026-10)** :
> - 🇹🇷 **SroCave** confirme : Burn = perte de HP toutes les **2 s** ; Zombie = « les potions **réduisent** les HP/MP » au lieu de soigner ; Electric shock = baisse du parry ; Freezing = immobilise ; Frostbite = ralentit ; Poison = dégâts fixes. Hiérarchie des dégâts élémentaux : **Cold (les plus bas + freeze) < Lightning (intermédiaire + vitesse) < Fire (dégâts max + burn)**. La même source précise que la chance de crit exacte est « inconnue » côté communauté TR. Source : https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635
> - 🇨🇳 Corroboration indirecte (source **mobile**, qualitative seulement) : Fire lv 1 = burn, Cold lv 1 = chance de freeze, cités comme « excellent rapport niveau/effet » — cohérent avec Burn ~25% / Freeze ~20%. Source : https://www.taptap.cn/moment/645615206830965814 (⚠️ remake MOBILE — ne pas importer comme donnée PC)

### Résistances aux status

- **Accessoires** : stats de résistance par élément (ex: accessoires D8 jusqu'à **+20% résistance Ice**), cumulables
- **Skills CH** : Fire Shield series (réduit durée des status ice), passifs de résistance
- La **réduction de durée** fonctionne par % sur chaque status reçu

### Stacking des status

- **Même status** : refresh de la durée (pas de stack)
- **Status différents** : cumulables (burn + poison + division + impotent...)
- Les **hard CC partagent souvent un timer d'immunité** interne (anti chain-stun) — comportement variable selon version (vSRO : aucun, d'où les chain-KD)

---

## ❄️ Imbues Élémentaires Chinoises

Les imbues ajoutent des dégâts magiques élémentaires à chaque attaque et peuvent appliquer un status. Le choix dépend du build :

| Imbue | Dégâts | Status | Chance (constatée) | Durée |
|---|---|---|---|---|
| **Fire (Soul Fire Force)** | Les plus élevés | **Burn** (DoT) | ~20-30% par hit | ~6 s |
| **Lightning (Thunder)** | 2e | **Shock** (−parry ratio) | variable (par hit) | 4-11 s |
| **Cold (Ice)** | Les plus faibles | **Frostbite** (slow) + **Freeze** (root) | 20-60% selon skill | 4-6 s |

**Notes détaillées (guide Origin/community) :**
- **Fire imbue** : le plus de dégâts bruts, burn ~20-30% de chance — le meilleur pour le pure DPS/PvE
- **Lightning imbue** : dégâts proches de Fire, shock réduit le parry adverse (plus de dégâts effectifs)
- **Cold imbue** : deux status (frostbite + freeze), le **freeze root complet** est le "roi du PvP 1v1" ; les skills Cold dédiés ont 20 à 60% de chance de freeze selon le skill et son niveau
- Le status d'imbue se déclenche par **hit** → les armes rapides (sword/dagger) proc plus souvent

**⚖️ Mécanique de scaling de l'imbue (source DE 2006) :**
- Le dégât d'imbue est **multiplié par le % de la skill** qui la porte : un skill à 200% double le bonus d'imbue, un coup de combo à 68% le réduit proportionnellement (tests chiffrés in-thread : Hidden Blade 200 → 400 avec Fire ; sans imbue 25-30 dégâts, avec 250-300)
- Le calcul côté serveur s'effectue à la **confirmation d'activation du skill** → une skill lancée une fraction de seconde avant l'activation de l'imbue n'en bénéficie pas (explication des « combos non imbueés »)
- Deux lectures coexistent dans le thread source ; celle du **×% par coup** est celle qui concorde avec les tests chiffrés
- Source 🇩🇪 : https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung (mai 2006, via [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md))

**📊 Dégâts d'imbue au niveau 1 (tests presse coréenne, 2005) :**

| Imbue (livre lv 1) | Dégât moyen | Note |
|---|---|---|
| River Fire Force (화류결, Fire) | **21** | |
| Thunder Tiger Force (뇌호결, Lightning) | **17,5** | |
| Transfert lightning (splash) | **12,25** | le splash accélère le farm de **~+20%** |

- Source 🇰🇷 : http://www.gameabout.com/news/articleView.html?idxno=615 (GameAbout, janv. 2005)
- Corroboration 🇰🇷 (test Bicheon 20 vs Pacheon 10, 2005) : l'épée **critique plus et gèle plus** que l'arc (coups plus nombreux) mais encaisse plus — confirme le proc par hit. Source : http://www.gameabout.com/news/articleView.html?idxno=584

---

## 💥 Knockdown / Knockback / Stab System

### Les trois états physiques

1. **Knockdown (KD)** : la cible **tombe au sol**, ne peut ni bouger ni attaquer (~2-4 s). Certaines attaques font des dégâts bonus aux cibles au sol.
2. **Knockback (KB)** : la cible est **repoussée** de quelques mètres (interrupt de cast).
3. **Stab (coups bas)** : attaques spéciales qui font **×2 dégâts contre une cible au sol** (données RefSkill : effet `Specialized: Stab — x2 contre cibles au sol`).

### Le combo cœur du PvP melee

```
Skill KD (ex: Balayage/Sweep — KnockDown 100%)
        ↓ (cible au sol)
Stab 1 → Stab 2 → Stab 3  (chacun ×2 dégâts)
        ↓
Repeat quand la cible se relève (anti-refresh KD : ~variable)
```

- Le **Blader** chinois peut enchainer **3 stabs** sur un seul KD avec un animation cancel parfait (technique avancée emblématique)
- Certaines skills ont **65% de chance de KD** (ex données RefSkill : Frappe Empoisonnée : DoT poison + KnockDown 65%)
- **Immunisation** : après relevée, une courte immunité au KD existe sur certains clients (à verifier par version) — le chain-KD infini est possible sur vSRO, bridé sur iSRO tardif

### Skills KD/KB typiques

- **CH** : Bicheon Smashing Series, Heuksal (spear knockdown), Flying Dragon
- **EU Warrior** : Will Turn (KD), Cutdown, Sprint Assault ; Bash chain
- **EU Rogue** : Coup Bas (KnockBack 100% selon données RefSkill EU)
- **EU Warlock** : certains dots avec KD 65% en bonus

---

## 🎬 Animation Cancelling

### Qu'est-ce que l'Animation Cancelling ?

Technique consistant à **interrompre l'animation de fin** d'une skill pour enchaîner la suivante plus vite. Légitime, appris par la pratique, **essentiel en PvP compétitif CH**.

### Méthodes connues (communauté 2010-2026)

1. **Skill-chain cancel** : lancer la skill suivante dès la frame d'impact (le start-up suivant annule la recovery précédente)
2. **Potion cancel** : boire une potion juste après le hit pour couper l'animation
3. **Weapon switch cancel** : switcher d'arme (ex: sword ↔ blade, rod ↔ weapon) coupe l'animation instantanément
4. **Mouvement** : un ordre de déplacement bref peut couper certaines animations (moins fiable)

### Gains constatés

- DPS effectif : +30 à +70% selon la maîtrise (les chiffres exacts varient selon les skills/builds)
- **Blader triple-stab** sur un seul KD (voir ci-dessus)
- Rogue : enchainement X-Bow → daggers

### Où apprendre

- Vidéos « Silkroad animation cancelling technique » (YouTube, shorts 2023-2025)
- Guides elitepvpers / projecthax

---

## ⚔️ PvP vs PvE

### ⚠️ Correction d'une erreur répandue

Il n'existe **pas de réduction globale des dégâts PvP documentée** dans le client classique iSRO (l'ancienne valeur « ×0.5-0.7 » de ce document était une invention). Les dégâts PvP utilisent les **mêmes formules** que le PvE. Les différences réelles :

| Aspect | PvP | PvE |
|--------|-----|-----|
| **Formules** | Identiques | Identiques |
| **Défense adverse** | Joueurs : DEF/stuff + parry ratio élevés | Mobs : DEF fixe par niveau/type |
| **Statuts** | Diminishing returns/immunités certaines | Mobs souvent immuns aux hard CC (boss) |
| **Potions** | Autorisées (sauf events) | Autorisées |
| **Pills universels** | Cruciaux (cure des débuffs) | Utiles |
| **Focus builds** | CC (KD/stun/freeze), burst, absorb | AoE, sustain, DPS |

**N.B.** : certains serveurs privés et versions tardives appliquent un coefficient PvP maison (ex: Fortress War reductions) — à vérifier par serveur.

---

## 🔄 Différences Client Classique vs Silkroad-R

| Mécanique | Classic iSRO | Silkroad-R (2012) |
|---|---|---|
| **Engine** | Base | Identique (même client) |
| **EXP/SP** | Grind lent, gap SP farming nécessaire | Rates accélérés, leveling plus rapide |
| **Skills** | Masteries libres (330 total au cap) | Système restructuré plus guidé (classes) |
| **SP gap farming** | Cœur du meta classic | Largement supprimé |
| **PvP/PK** | Système murderer complet | Assoupli (moins de perte, PK plus accessible) |
| **Balance classes** | Original | Ajustements de balance réguliers |
| **Job system** | Identique | Identique en structure |

> Les formules de dégâts restent structurellement les mêmes ; les serveurs privés « classic » recréent l'iSRO d'époque, les serveurs « R » suivent les règles Silkroad-R.

---

## ❓ FAQ

### Q: Comment augmenter mes dégâts ?
**R:** Arme (degré/enhancement), STR ou INT selon le build, masteries à jour (mastery_incr), buffs d'attack %, imbues, crit (pour les builds PHY), et l'animation cancelling.

### Q: Le nuke Fire peut-il crit ?
**R:** **Non.** Seuls les skills d'armes CH (Bicheon/Heuksal/Pacheon) et les attaques normales critiquent. Les nukes Fire/Lightning/Cold ne critiquent pas.

### Q: Attack Rating vs Parry Ratio — qui gagne ?
**R:** Ce n'est pas toucher/rater : l'AR pousse vos jets vers le max de votre range, le PR adverse les tire vers le min. Un PR très supérieur à l'AR adverse réduit fortement les dégâts moyens reçus.

### Q: Combien d'orbs pour le Zerk ?
**R:** 5 orbs (chute ~1 mob sur 3 au niveau approprié), ou Berserk Regeneration Pill (cooldown ~20 min).

### Q: Les potions peuvent-elles aggraver mon état ?
**R:** Oui sous **Zombie** (les potions HP infligent des dégâts) — c'est le but du débuff Warlock. Utilisez le bon grade d'Universal Pill à la place.

### Q: L'animation cancelling est-il un cheat ?
**R:** Non, c'est une technique légitime apprise et partagée par la communauté depuis 2006.

### Q: Pourquoi mon Block ne fonctionne jamais contre les nukes ?
**R:** Le block s'applique prioritairement aux attaques physiques ; contre les nukes magiques son effet est réduit ou nul (comportement variable selon version).

### Q: Le kiting, c'est quoi ?
**R:** Attaquer à distance tout en gardant l'ennemi hors de portée melee (movement speed + slows = cœur du kiting SRO).

---

## 🔗 Resources

### Documentation technique
- [SilkroadDoc (DummkopfOfHachtenduden/DaxterSoul) — formats de fichiers & packets](https://github.com/DummkopfOfHachtenduden/SilkroadDoc)
- [silkroaddoc.github.io — données skills/RefSkill (types d'effets)](https://silkroaddoc.github.io/)
- [florian0 — Death Penalty Item Drops (reverse engineering)](https://florian0.wordpress.com/2016/10/05/silkroad-online-death-penalty-item-drops)

### Guides communauté
- [Elitepvpers — Silkroad Damage Formulas](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
- [Elitepvpers — The Way Items Work (attack speeds, absorb, block)](https://www.elitepvpers.com/forum/sro-guides-templates/2545845-guide-way-items-work.html)
- [Elitepvpers — Physical & Magical Reinforce explained](https://www.elitepvpers.com/forum/sro-guides-templates/807866-explaination-physical-magical-reinforce.html)
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html)
- [PlayOrigin — Chinese Race Guide (imbues/status)](https://forum.playorigin.com/archive/index.php/t-26.html)
- [StrategyWiki — Silkroad Online/Gameplay](https://strategywiki.org/wiki/Silkroad_Online/Gameplay)
- [Silkroad Forums — What is Parry Ratio](http://www.silkroadforums.com/viewtopic.php?f=2&t=49338)

### Sources multilingues (2026-10)
- [silkroadonline.de — Diverse Formeln in Silkroad (formules empiriques Troy 2006)](https://www.silkroadonline.de/allgemein/allgemeines-ber-silkroad/9220-diverse-formeln-in-silkroad) 🇩🇪
- [silkroadonline.de — Schadensberechnung (mécanique des imbues ×%, 2006)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung) 🇩🇪
- [SroCave — Temel Bilgiler (status effects, AR/parry, éléments)](https://srocave.com/konular/silkroad-online-oyunu-hakkinda-en-temel-bilgiler-karakter-yapilandirmasi-ve-itemler.2635) 🇹🇷
- [SilkroadPortal — formules hasar/defans (TR)](https://silkroadportal.com/konular/silkroad-online-hasar-defans-hesaplama-attritube-stone.366) 🇹🇷
- [GameAbout — tests dégâts 2005 (imbues lv 1, AoE)](http://www.gameabout.com/news/articleView.html?idxno=615) 🇰🇷
- [Inven — présentation open beta 2004 (Berserk 환모드)](https://www.inven.co.kr/webzine/news/?news=2285) 🇰🇷
- Rapports [ML_RESEARCH/](ML_RESEARCH/) — RESEARCH_DE / TR / KO / FR / ZH / PT (2026-10)

### Calculateurs
- [evolex.dev — SRO Character Stats Calculator (HP/MP/balance)](https://evolex.dev/sro-char-stats)

---

## 📚 Voir aussi

### Mécaniques Avancées
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Formules détaillées, balance, reinforce
- [Attack Rating & Parry Ratio](28_ADVANCED_MECHANICS.md#attack-rating-et-parry-ratio) - Système détaillé

### Combat et PvP
- [PvP et PK](20_PVP_PK_SYSTEM.md) - Murderer, capes, CTF, arène
- [Hub Combat](HUB_COMBAT.md) - Centralise toute l'information combat
- [PvP Builds](33_PVP_BUILDS.md) - Tier list et builds optimisés

### Classes et Skills
- [Classes Chinoises](02_CHINESE_CLASSES.md) - 7 maîtrises et builds
- [Classes Européennes](03_EUROPEAN_CLASSES.md) - 8 classes et rôles
- [Hub Classes](HUB_CLASSES.md) - Centralise classes et builds

### Équipement
- [Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement +1 à +12, blues (absorb, crit)
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun
- [Armor Types](08_ARMOR_TYPES.md) - Armor, Protector, Garment (bonus de set)

### Guides Stratégiques
- [Fortress War](19_FORTRESS_WAR.md) - Mass PvP 300+
- [Job Strategies](35_JOB_STRATEGIES.md) - Stratégies jobs avancées

---

## 🌍 Multilingual Research Findings (2025-2026)

### Sources croisées et validation

| Mécanique | Formule/Valeur | Sources | Confiance |
|-----------|---------------|---------|-----------|
| **Formule dégâts PHY/MAG** | elitepvpers multi-composants | elitepvpers + calculs vérifiés | 4/5 |
| **Critical** | 2×PHY + MAG | Consensus KR + EN | 4/5 |
| **Nukes ne critiquent pas** | oui | silkroadforums + guides | 4/5 |
| **Physical Multiplier** | 1.276772606 | elitepvpers (testing) | 3/5 (non officiel) |
| **Magical Multiplier** | 1.287004542 | elitepvpers (testing) | 3/5 (non officiel) |
| **Balance** | 100×STR/M, M=max(STR×1.29, INT) | evolex.dev + communauté | 4/5 |
| **AR/PR : jet dans la range** | AR→max, PR→min | UnKnoWnCheaTs + silkroadforums | 4/5 |
| **Block = % direct du bouclier** | 15-20 = bon/PvP | elitepvpers Way Items Work | 4/5 |
| **Absorb HP/MP blues** | armes 10-35%, acc. ~20% | elitepvpers | 3/5 |
| **Stab ×2 vs cibles au sol** | effet Specialized | silkroaddoc (RefSkill) | 5/5 (données client) |
| **DoT burn/poison : tick 2 s** | ex: 560/2s pendant 8 s | silkroaddoc (RefSkill) | 5/5 (données client) |
| **Weaken : −16% MAG DEF** | 8 s | silkroaddoc (RefSkill) | 5/5 (données client) |
| **Zerk : 5 orbs, ~×2 dégâts** | ~1 drop/3 mobs | guides Origin + forums | 4/5 |
| **Imbue : dégât ×% de la skill** | 200% → double ; combo 68% → proportionnel | silkroadonline.de (DE, 2006) | 4/5 |
| **Imbue calculée à l'activation** | skill lancée avant l'imbue = non imbueée | silkroadonline.de (DE, 2006) | 4/5 |
| **Dégâts imbue lv 1 (2005)** | River Fire 21 · Thunder Tiger 17,5 · splash 12,25 | GameAbout (KO, 2005) | 4/5 |
| **Burn tick 2 s / Zombie** | potions HP/MP infligent la perte au lieu de soigner | SroCave (TR, 2026) | 4/5 |
| **Hiérarchie dégâts éléments** | Cold < Lightning < Fire | SroCave (TR, 2026) | 4/5 |
| **Zerk = attaque + vitesse (pas def)** | 환모드, description officielle OB 2004 | Inven (KO, 2004) | 4/5 |
| **Formule dégâts TR simplifiée** | Dégât = STR × Reinforce% + Atk Power (sans constantes) | silkroadportal.com (TR) | 3/5 |

### Divergences connues entre sources

1. **Chance exacte de Burn par imbue** : « ~20-30% » (guide Origin) vs valeurs par niveau de skill non publiées → utiliser les tooltips in-game par pallier (corroboration indirecte ZH : burn dès l'imbue Fire lv 1 — source mobile, qualitative uniquement)
2. **Cap block / immunités KD** : variables selon client (iSRO tardif vs vSRO)
3. **L'effet exact du Zerk sur la défense** : aucune défense en classic (corroboré par la description officielle KR 2004 « attaque + vitesse de déplacement » uniquement) ; +10-15% en Blue Zerk (quête 95+)
4. **Constantes des formules de dégâts** : les formules TR modernes (silkroadportal.com : Dégât = STR × Reinforce% + Atk Power) et DE 2006 (mastery bonus ×(100+mastery)/100, HP exponentielle) ne contiennent pas les constantes elitepvpers 1.2767/1.2870 — divergences détaillées dans [28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md)

---

*Dernière mise à jour : 2026-10-01*
*Sources : elitepvpers, silkroadforums, UnKnoWnCheaTs, florian0 (RE), silkroaddoc.github.io, PlayOrigin, StrategyWiki, evolex.dev, silkroad.fandom.com, silkroadonline.de (DE), SilkroadPortal/SroCave (TR), GameAbout/Inven (KO) — rapports ML_RESEARCH (2026-10)*
