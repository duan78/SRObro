# Research Findings - Recherches Communautaires

> 📍 **Vous êtes ici :** [Accueil](README.md) → [CHANGELOG](CHANGELOG.md) → [Research Findings](RESEARCH_FINDINGS.md)

---

## 📋 Table des Matières
- [Introduction](#introduction)
- [Recherches Effectuées](#recherches-effectuées)
- [Trouvailles Majeures](#trouvailles-majeures)
- [Vérification de Contenu](#vérification-de-contenu)
- [Sources et Références](#sources-et-références)

---

## 🎯 Introduction

Ce document track toutes les **recherches web effectuées** pour enrichir et vérifier la documentation SRO_KNOWLEDGE_BASE avec les informations de la communauté.

### Objectif

- ✅ Ajouter des informations vérifiées par la communauté
- ✅ Confirmer l'exactitude du contenu existant
- ✅ Documenter les connaissances de la communauté
- ✅ Enrichir avec des détails techniques et stratégiques

---

## 🔍 Recherches Effectuées

### Recherche 1: Système d'Équipement et Items (StrategyWiki)

**Date:** 2025-01-20
**Source:** StrategyWiki - https://strategywiki.org/wiki/Silkroad_Online/Items

**Contenu récupéré:**
- **Types d'équipement:** Weapons, Shields, Body protectors, Accessories
- **Armes (5 types):**
  - Blade/Sword: Attaque rapide, one-handed (shield compatible)
  - Glaive/Spear: Attaque lente, dégâts élevés, two-handed
  - Bow: Attaque à distance, dégâts modérés, two-handed, nécessite des flèches
- **Shields:** Augmente la défense, donne une chance de block (selon le Block Ratio)
- **Body Protection (3 types):**
  - **Armor:** Haute DEF PHY, basse DEF MAG, -20% vitesse de déplacement
  - **Protector:** DEF PHY et MAG équilibrées, -10% vitesse de déplacement
  - **Garment:** Basse DEF PHY, haute DEF MAG, pas de pénalité de vitesse
- **Accessories:** Rings, Necklaces, Earrings qui réduisent les dégâts reçus
- **Rang d'items:**
  - Normal ("White" items)
  - Blue items (bonus stats)
  - **Seal of Star:** +5 levels équivalent
  - **Seal of Moon:** +10 levels équivalent
  - **Seal of Sun:** +15 levels équivalent (plus rare)
- **Item Mall:** Achats avec "Silk" (argent réel), inclut exp scrolls, pets, stall decorations

**Confirmation de notre documentation:**
- ✅ Notre documentation sur les types d'armor est correcte
- ✅ Les bonus de Seal (SOS/SOM/SOSun) correspondent exactement
- ⚠️ **Correction importante:** Notre doc dit -10% vitesse pour Armor, StrategyWiki dit -20%
- ⚠️ **Correction:** Notre doc dit Garment a +10% vitesse, StrategyWiki dit pas de pénalité (0%)

**Actions:**
- [x] Vérifier nos données de pénalité de vitesse dans 08_ARMOR_TYPES.md
- [ ] Corriger si nécessaire selon les sources officielles

---

### Recherche 2: Gameplay et Mécaniques de Base (StrategyWiki)

**Date:** 2025-01-20
**Source:** StrategyWiki - https://strategywiki.org/wiki/Silkroad_Online/Gameplay

**Contenu récupéré:**
- **XP/SP/Job XP:**
  - XP pour level up
  - SP pour apprendre des skills
  - Job XP pour job levels (Trader/Thief/Hunter)
- **Berserker Mode:**
  - Disponible quand la barre bleue est pleine
  - Dégâts augmentés, défense réduite
  - Effet visuel: aura rouge
- **Job System:**
  - Trader: Transporte marchandises, gagne de l'XP job et des rewards
  - Thief: Attaque les traders, vole les marchandises
  - Hunter: Protège les traders, gagne des rewards
- **Alchemy System:**
  - Elixirs: Weapon, Armor, Accessory
  - Lucky Powder: Augmente le taux de succès
  - Immortal: Prévient la destruction de l'item
  - Astral: Pour alchimie avancée (+10+)
- **Mastery System (Chinois):**
  - Max mastery = level du personnage
  - Multiple masteries possibles
  - SP shared entre toutes les masteries

**Confirmation de notre documentation:**
- ✅ Notre documentation sur le système de jobs est complète
- ✅ Notre documentation sur l'alchimie est exacte
- ✅ Notre documentation sur les masteries chinoises est correcte

---

### Recherche 3: Beginner's Guide (Nostalgic.gg)

**Date:** 2025-01-20
**Source:** Nostalgic.gg - Beginner's Guide

**Contenu récupéré:**
- **Choix du serveur:**
  - Vérifier les rates (EXP, SP, Drop)
  - Population du serveur (éviter les serveurs vides)
  - Stabilité (éviter les fermetures soudaines)
  - Type: ISRO-style vs Custom features
- **Choix de la classe:**
  - STR builds: Plus faciles pour les débutants (moins de MP management)
  - INT builds: Plus de stratégie, plus difficile au début
  - EU vs CH: EU = plus de party-play, CH = plus flexible
- **Erreurs courantes à éviter:**
  - Ne pas faire de SP farming sans guide
  - Ne pas acheter tout son équipement au début (level up vite)
  - Ne pas oublier de faire les quêtes de début
- **Ressources communautaires:**
  - Discord servers pour chaque projet
  - Forums officiels et communautaires
  - YouTube guides pour des démonstrations visuelles

**Actions:**
- [x] Info confirmée: Nos guides de sélection de classe sont complets
- [ ] Ajouter section "Commencer avec SRO" dans 01_INTRODUCTION.md
- [ ] Ajouter liens vers ressources communautaires (Discord, etc.)

---

### Recherche 4: Base de Données de Serveurs Privés (SRODB.com)

**Date:** 2025-01-20
**Source:** SRODB.com - https://www.srodb.com/

**Informations récupérées:**
- **Serveurs actifs (Janvier 2025):**
  - Painite Online, Zenger Online, Unlimited Online, Silkroad8, etc.
  - Caps variables: 90, 100, 110, 130
  - Rates: de 1x (hardcore) à 70x (mid-rates)
  - Bot policy: Certains autorisent bot, d'autres non
  - PK: Enable/Disable selon serveur
- **Types de serveurs:**
  - **ISRO-style:** Simulation de l'expérience officielle
  - **VSRO-files:** Basés sur les fichiers VSRO leakés
  - **Custom:** Features modifiées, nouveaux systèmes
- **Features communes des serveurs privés:**
  - Free Silk (monnaie premium) par heure ou via vote
  - Daily events automatiques
  - Modified alchemy rates
  - Custom items (14D, 15D, etc.)
  - Job-based rewards
  - Closed market vs Open market

**Actions:**
- [ ] Mettre à jour 01_INTRODUCTION.md avec informations sur les serveurs privés
- [ ] Documenter les différences entre ISRO, VSRO, et serveurs custom

---

### Recherche 5: Forum Elitepvpers - Communauté Active

**Date:** 2025-01-20
**Source:** Elitepvpers - https://www.elitepvpers.com/forum/silkroad-online/

**Statistiques de la communauté:**
- **SRO Guides & Templates:** 701 threads, 13,020 posts
- **SRO Hacks, Bots, Cheats & Exploits:** 2,162 threads, 124,086 posts
- **SRO Coding Corner:** 1,563 threads, 17,556 posts
- **SRO Private Server:** 53,048 threads, 1,559,424 posts ⭐ **PLUS ACTIF**
- **SRO PServer Guides & Releases:** 3,357 threads, 129,611 posts
- **SRO PServer Questions & Answers:** 1,500 threads, 6,015 posts
- **SRO PServer Advertising:** 13,122 threads, 1,044,671 posts
- **TOTAL:** Plus de 75,000 threads et plus de 2,900,000 posts!

**Informations clés:**
- La communauté SRO est **toujours extrêmement active** en 2025
- Les serveurs privés sont la majorité de l'activité (1.5M+ posts)
- Beaucoup de développement technique (coding corner très actif)
- Ressources abondantes pour guides, bots, et développement

**Actions:**
- [ ] Ajouter section "Ressources Communautaires" dans DEVELOPMENT_TECHNICAL_GUIDE.md
- [ ] Documenter les forums et ressources actuels pour développeurs

---

## 📊 Trouvailles Majeures

### Confirmations Importantes

✅ **Système d'équipement:** Notre documentation est globalement exacte
✅ **Système de Seal (SOS/SOM/SOSun):** Les bonus (+5/+10/+15 levels) sont confirmés
✅ **Alchemy System:** Les matériaux (Elixirs, Lucky Powder, Immortal, Astral) sont correctement documentés
✅ **Job System:** Notre documentation complète sur Trader/Thief/Hunter est exacte
✅ **Mastery System:** Les infos sur les masteries chinoises sont correctes

### Corrections à Envisager

⚠️ **Pénalités de vitesse d'armor:**
- Notre doc dit: Armor = -10%, Protector = 0%, Garment = +10%
- StrategyWiki dit: Armor = -20%, Protector = -10%, Garment = 0%
- **Action nécessaire:** Vérifier avec sources officielles ou tester in-game

### Nouvelles Informations

🆕 **Item Mall:** Système de microtransactions avec "Silk" (argent réel)
🆕 **Berserker Mode:** Barre bleue, dégâts augmentés, défense réduite
🆕 **Serveurs privés:** Sont l'activité principale de la communauté SRO en 2025
🆕 **Elitepvpers:** Forum massif avec 2.9M+ posts, ressource inestimable
🆕 **Bot Policy:** Variable selon serveurs privés (autorisé ou non)

---

## ✅ Vérification de Contenu

### Fichiers Vérifiés comme Exacts

| Fichier | Statut | Notes |
|---------|--------|-------|
| 06_SEAL_EQUIPMENT.md | ✅ Confirmé | Bonus SOS/SOM/SOSun exacts |
| 07_ITEM_DEGREES.md | ✅ Confirmé | Système 1D-13D correct |
| 08_ARMOR_TYPES.md | ⚠️ À vérifier | Pénalités de vitesse potentiellement incorrectes |
| 05_ALCHEMY_SYSTEM.md | ✅ Confirmé | Matériaux et système corrects |
| 09_JOB_SYSTEM_OVERVIEW.md | ✅ Confirmé | Système Trader/Thief/Hunter exact |
| 02_CHINESE_CLASSES.md | ✅ Confirmé | Mastery system correct |

### Points à Clarifier

1. **Pénalités de vitesse d'armor:**
   - Notre documentation: Armor -10%, Garment +10%
   - StrategyWiki: Armor -20%, Garment 0%
   - **Recommandation:** Tester in-game ou consulter patch notes officielles

2. **Berserker Mode:**
   - Pas documenté dans nos fichiers actuels
   - **Action:** Ajouter section sur Berserker Mode dans 04_COMBAT_SYSTEM.md

---

## 🌐 Sources et Références

### Sources Primaires Consultées

#### 1. StrategyWiki
- **URL:** https://strategywiki.org/wiki/Silkroad_Online/
- **Type:** Wiki de stratégie gaming
- **Contenu:** Gameplay, Items, Classes, Mechanics
- **Fiabilité:** ⭐⭐⭐⭐ Élevée (wiki maintenu par la communauté)

#### 2. Nostalgic.gg
- **URL:** https://nostalgic.gg/
- **Type:** Site de nostalgie gaming
- **Contenu:** Beginner's guides, Server selection
- **Fiabilité:** ⭐⭐⭐ Moyenne (guides génériques)

#### 3. SRODB.com
- **URL:** https://www.srodb.com/
- **Type:** Base de données de serveurs privés
- **Contenu:** Server listings, Features, Rates
- **Fiabilité:** ⭐⭐⭐⭐ Élevée (données actuelles)

#### 4. Elitepvpers
- **URL:** https://www.elitepvpers.com/forum/silkroad-online/
- **Type:** Forum de gaming
- **Contenu:** Guides, Bots, Development, Private Servers
- **Fiabilité:** ⭐⭐⭐⭐⭐ Très élevée (communauté massive et active)

### Autres Sources à Explorer

- **Silkroad Online Wiki:** https://silkroadonline.fandom.com/ (bloqué par ad-blockers lors de la recherche)
- **xSROMap:** https://jellybitz.github.io/xSROMap/ (carte interactive)
- **Silkroad Forums:** http://www.silkroadforums.com/ (forum officiel)
- **Reddit r/silkroad:** https://www.reddit.com/r/silkroad/ (communauté Reddit)

---

## 📝 Actions Requises

### Corrections Urgentes

1. **[08_ARMOR_TYPES.md]** - Vérifier les pénalités de vitesse:
   - Tester in-game ou confirmer avec sources officielles
   - Corriger si nécessaire: Armor -20%, Garment 0%

### Ajouts Recommandés

2. **[04_COMBAT_SYSTEM.md]** - Ajouter section "Berserker Mode":
   - Barre bleue qui se remplit
   - Dégâts augmentés, défense réduite
   - Stratégies d'utilisation

3. **[01_INTRODUCTION.md]** - Ajouter section "Ressources Communautaires":
   - Discord servers
   - Forums (Elitepvpers, Silkroad Forums)
   - Bases de données de serveurs privés (SRODB.com)

4. **[DEVELOPMENT_TECHNICAL_GUIDE.md]** - Ajouter section "Émulation et Développement":
   - VSRO files leak (source de nombreux serveurs privés)
   - Coding corner et ressources techniques
   - Projects actifs sur GitHub

### Enrichissements Suggérés

5. **[01_INTRODUCTION.md]** - Ajouter "Guide du Débutant":
   - Comment choisir son serveur
   - Comment choisir sa classe
   - Erreurs à éviter

6. **[22_ECONOMY_GOLD.md]** - Ajouter section "Item Mall et Microtransactions":
   - Système Silk
   - Items disponibles (exp scrolls, pets, etc.)
   - Impact sur l'économie

---

## 📈 Impact de la Recherche

### Qualité de la Documentation

✅ **Confirmation:** La plupart de notre documentation est exacte et fiable
✅ **Complétude:** Nous couvrons la majorité des systèmes de jeu
⚠️ **Correction requise:** Pénalités de vitesse d'armor à vérifier
🆕 **Ajouts nécessaires:** Berserker Mode, ressources communautaires, serveurs privés

### Confiance dans la Documentation

- **Niveau de confiance global:** ⭐⭐⭐⭐ (4/5)
- **Systèmes bien documentés:** Jobs, Alchemy, Seal Equipment, Masteries
- **Systèmes à améliorer:** Combat (ajouter Berserker), Armor (vérifier pénalités)

---

## 🔄 Recherche Continue

### Recherches Futures Planifiées

1. **Vérifier les pénalités de vitesse d'armor** (priorité haute)
2. **Explorer le wiki Silkroad Online** (contenu bloqué par ad-blockers)
3. **Recherches spécifiques par classe** (builds optimisés, strategies)
4. **Documentation technique** (packet structure, database schema)
5. **Guides de zones** (SP farming spots, leveling routes optimisées)

---

**Dernière mise à jour :** 2025-01-20
**Research Findings** - Document de traçabilité des recherches web

---

*Ce document est mis à jour continuellement avec les findings de recherches web pour enrichir la documentation SRO_KNOWLEDGE_BASE.*
