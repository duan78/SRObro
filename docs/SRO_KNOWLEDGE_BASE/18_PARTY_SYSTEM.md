# Party System

> Système de groupe de Silkroad Online (client PC classique / iSRO). Document enrichi par recherche web (forums communautaires, guides Partyplay, phBot). Les chiffres marqués ⚠️ varient selon les versions (PC classique vs Silkroad-R vs mobile vs serveurs privés).

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Créer et Rejoindre un Party](#-créer-et-rejoindre-un-party)
- [Types de Party : Each Get EXP vs Auto Share](#-types-de-party--each-get-exp-vs-auto-share)
- [Répartition des Items](#-répartition-des-items)
- [Bonus et Répartition d'EXP](#-bonus-et-répartition-dexp)
- [Party Matching](#-party-matching)
- [Union Party](#-union-party)
- [Auto-Party System](#-auto-party-system)
- [Party Buffs](#-party-buffs)
- [Tips pour Efficacité](#-tips-pour-efficacité)
- [Système "Taxi" - Power Leveling (Recherche 2025)](#-système-taxi---power-leveling-recherche-2025)
- [Bonus EXP Détaillés (Recherche 2025)](#-bonus-exp-détaillés-recherche-2025)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 👥 Vue d'Ensemble

Le système de **party** de Silkroad Online permet aux joueurs de se regrouper pour un leveling plus rapide, un loot partagé, et du fun social.

### Points Clés
- ✅ **Taille max: 8 joueurs** (en mode EXP auto-share) / 4 en mode « Each Get EXP »
- ✅ **Deux modes de party** choisis à la création : Each Get EXP / Auto Share EXP
- ✅ **Bonus d'EXP** en party (le bonus est supérieur en auto-share)
- ✅ **Party Matching** : enregistrement/publication de groupes
- ✅ **Union Party** (ajout tardif) : jusqu'à 4 partys liées via scroll

---

## 🎮 Créer et Rejoindre un Party

### Créer un Party

**Method 1: Click**
- Cliquez droit sur un joueur
- Sélectionnez "Invite to Party"

**Method 2: Command**
- Tapez `/party [nom du joueur]` (ou via le menu social)

**Method 3: Party Interface**
- Touche **P** → gestion du party

**À la création**, le leader choisit les **options du party** :
- Mode d'EXP (Each Get / Auto Share)
- Mode de répartition des items (voir sections suivantes)

### Rejoindre un Party

- Attendre une invitation (le leader invite)
- Demander en chat global : "LFG party" (Looking For Group)
- Via le **Party Matching** (voir section dédiée)

### Party Leader

**Rôle:**
- Invite/kick des membres
- A défini les options du party à la création
- Peut transférer le leadership (clic droit sur un membre)

---

## 🔄 Types de Party : Each Get EXP vs Auto Share

⚠️ **Précision importante (souvent mal comprise):** Silkroad Online classique a **deux types de party**, choisis à la création et non modifiables ensuite :

| | **Each Get EXP** (« chacun son EXP ») | **Auto Share EXP** (« EXP partagé ») |
|---|---|---|
| **Membres max** | **4** | **8** |
| **EXP** | Chacun reçoit l'EXP de ses propres kills | EXP du groupe **partagée automatiquement** entre les membres |
| **Contrainte de distance** | **Aucune** — les membres peuvent être n'importe où | Les membres doivent rester **proches** de la zone de combat |
| **Bonus d'EXP** | Plus faible | **Plus élevé** |
| **Usage typique** | Quests, membres éparpillés, plvl light | **Grind 8/8**, farming, FW |

> La limite de **8 membres** ne peut être atteinte **qu'en mode EXP auto-share** (source: Silkroad Forums, guide Partyplay silkroadonline.de).

---

## 🎁 Répartition des Items

⚠️ **Correction :** les modes « Leader Distributes » et « Need Before Greed » listés dans les anciennes versions de ce document **n'existent pas** dans Silkroad Online — ce sont des concepts d'autres MMO.

Les modes réels du client :

| Mode | Fonctionnement |
|------|----------------|
| **Free (libre)** | Premier arrivé, premier servi — chacun loot ce qu'il veut |
| **Item Distribution / Auto Share (distribution automatique)** | Les drops sont attribués **à tour de rôle** entre les membres (A → B → C → D → A...) |

- Le mode de répartition est défini **à la création** du party, en même temps que le mode d'EXP
- En distribution automatique, l'ordre des membres dans le party window détermine le tour de loot
- Le gold looté suit les mêmes règles que les items selon le mode choisi ⚠️ (comportement exact non documenté officiellement)

---

## 📊 Bonus et Répartition d'EXP

### Bonus d'EXP de groupe (client PC classique)

- Donnée communautaire (Silkroad Forums, thread « XP share/distribute parties ») : environ **+3% d'EXP par membre additionnel** en mode distribution
  - Party de 2 : ~+3%, party de 4 : ~+9%, party de 8 (auto-share) : bonus supérieur ⚠️ chiffres exacts par taille non officialisés
- Le bonus s'applique à l'EXP **et** aux skill points (SP)

### Répartition en mode Auto Share

- L'EXP totale du kill est **répartie entre les membres** présents dans la zone
- ⚠️ **Correction :** il n'y a **pas de plage de niveaux stricte ±10** documentée sur le client PC classique — le système de « taxi » (voir plus bas) prouve qu'un membre de bas niveau reçoit de l'EXP d'un party qui farm des mobs bien au-dessus de son niveau. La part de chacun est pondérée (notamment par les niveaux relatifs), ce qui pénalise naturellement les gros écarts, sans les interdire.
- Les membres **hors de portée** (trop loin / autre zone) ne reçoivent pas leur part
- Portée approximative requise : rester dans la **même zone de chasse** (dans l'écran / quelques dizaines de mètres ⚠️ valeur exacte non documentée)

### EXP par niveau du monstre

Comme en solo, l'EXP dépend de l'écart de niveau entre le **mob** et le joueur (pénalité si le mob est bien plus bas). Voir [25_LEVELING_GUIDE.md](25_LEVELING_GUIDE.md) et la section Taxi ci-dessous pour l'exploitation de cette règle.

---

## 🔍 Party Matching

### Qu'est-ce que le Party Matching?

Système de **recherche de groupe** intégré au client (via le party window).

**Pour un leader — enregistrer son party:**
1. Ouvrez l'interface party (**P**) → onglet Party Matching
2. Enregistrez le party avec :
   - **Type / objectif** (chasse, quest, job/trade, etc.)
   - **Plage de niveaux** min/max acceptée
   - **Titre / description**
   - Option de confirmation (accepter manuellement les candidats ou non) ⚠️ selon versions
3. Le party apparaît dans la liste consultable par tous les joueurs

**Pour un joueur — chercher un party:**
1. Ouvrez Party Matching
2. Filtrez par objectif / niveau
3. Rejoignez (directement ou sur acceptation du leader)

### Benefits
- Plus facile de remplir un party 8/8
- Évite le spam "LFG" en chat global
- Standard sur iSRO et tous les serveurs privés

---

## 🤝 Union Party

### ⚠️ Correction importante

L'ancienne version de ce document décrivait l'Union Party comme « 8 partys de 8 = 64 joueurs ». C'est **inexact**. D'après le guide phBot (documentation du jeu réel) :

| Élément | Valeur réelle |
|---------|---------------|
| **Quoi** | Système ajouté **tardivement** à Silkroad, permettant de combiner le party actuel avec jusqu'à **3 partys supplémentaires** (jusqu'à ~4 × 8 = **32 joueurs**) |
| **Condition** | Un **scroll d'Union Party** (obtenable auprès du **NPC de Guild Storage**) |
| **Leader** | Le propriétaire du scroll / l'organisateur devient leader d'union party |
| **Usage principal** | **Fortress War** et zones très denses en monstres (meilleur EXP total) |

**Note:** le canal « Union chat » (chat d'alliance) existe **indépendamment** de l'Union Party — il vient du système d'**union de guildes** (voir [17_GUILD_SYSTEM.md](17_GUILD_SYSTEM.md)), pas du party. Pour la coordination FW classique, les guildes utilisent l'union chat de guilde.

---

## 🤖 Auto-Party System

**Auto-Party** = ajout automatique à un party à proximité.

⚠️ **Précision:** ce n'est **pas** une fonctionnalité du client officiel iSRO classique. L'auto-party existe via :
- **phBot** (bot tiers) : auto-invite / auto-accept selon des listes configurables
- Certains **serveurs privés** (fonction custom)

---

## 💪 Party Buffs

### Bard Buffs (cruciaux!)

**Bard dans le party:**
- **Moving March:** vitesse de déplacement
- **Noise:** réduit l'aggro des monstres (déplacement discret)
- **Tuning / Guardian etc.:** buffs physiques/défensifs

**Importance:**
- Bard est **INDISPENSABLE** en party de grind
- Gestion de mana + vitesse = downtime réduit

### Cleric Buffs

**Cleric dans le party:**
- **Bless Spell:** défense
- **Recovery Division:** heal de groupe
- **Resurrection:** rez des membres morts

### Other Buffs

**Warrior:**
- Buffs de défense/aggro (tank)

**Wizard:**
- DPS de zone (AOE)

**Importance:**
- Composition idéale : Tank + DPS + Healer + Buffer (Bard/Cleric)

---

## 🎯 Tips pour Efficacité

### Optimal Party Composition

**Standard Party 8/8 EU (grind classique):**
1. **2x Tanks** (Warrior) — tiennent l'aggro
2. **2x Bards** — mana + vitesse + anti-aggro
3. **1x Cleric** — heal groupe + rez
4. **3x DPS** (Wizard AOE) — damage de masse

> Composition 8/8 très citée (MMORPG.com, Elitepvpers) : 2 wizards, 2 tanks, 2 bards, 1 cleric, 1 warlock/rogue.
>
> 🇹🇷 **Variante turque attestée (recherche TR 2026-10)** : les guides de farm TR modernes préconisent **1 Cleric + 2 Warriors + 3 Wizards + 1 Bard + 1 Warlock** pour le grinding/SP 70-100 (vSRO.org, « Gold/SP kasma rehberi » — voir `ML_RESEARCH/RESEARCH_TR.md`) — même logique (tank/heal/support + DPS de masse), répartition différente des slots DPS.

### Leveling Efficiently

1. **Pull Big:** le tank pack les mobs, AOE du wizard
2. **Stay Together:** restez dans le rayon de partage d'EXP
3. **Use Buffs:** full buffs avant le pull, rebuff à temps
4. **Kill Speed:** privilégier des mobs 3-6 niveaux au-dessus du party (guide « Chinese 8/8 Party Farming » Elitepvpers)
5. **Rest Strategically:** coordonner les pauses de regen

### Loot

- En mode **distribution automatique**, vérifiez l'ordre des membres avant de partir
- En mode **libre**, définissez des règles claires (needs, ventes partagées) pour éviter les disputes

---

## 🚕 Système "Taxi" - Power Leveling (Recherche 2025)

### Qu'est-ce que le système "Taxi"?

**Source**: [Silkroad Origin Mobile - Party Mechanics Discussion](https://sromobile.com/en/news/announcements/discussion-on-game-mechanisms-party) + Community Research

Le **"Taxi"** est une technique de **power leveling** qui utilise les mécaniques de party pour obtenir des **EXP multipliers massifs**.

### Comment ça Marche

**Le Concept**:
```
Level 80 player veut level FAST
↓
Party avec un level 20 character
↓
Average party level = (80 + 20) ÷ 2 = 50
↓
Fight level 50 mobs
↓
EXP MASSIVE car level gap optimal!
```

**L'Ancrage du Level**:
- Le calcul d'EXP utilise le **"average party level"**
- Plus ce level est proche du mob level = **PLUS D'EXP**
- En incluant un low-level, vous **réduisez** l'average level
- Cela vous donne des **multipliers d'EXP énormes**

### Exemple Concret

**Scenario: Player Level 80**

**Solo**:
```
Player level 80
vs Level 50 mobs
→ Level gap: +30 (player MUCH higher)
→ EXP penalty: -50% ou plus
→ Résultat: EXP terrible
```

**Avec "Taxi" (Level 20)**:
```
Party: Level 80 + Level 20
Average: (80 + 20) ÷ 2 = 50
vs Level 50 mobs
→ Level gap: 0 (parfait!)
→ EXP bonus: party bonus
→ EXP multiplier: MAXIMAL (pas de penalty)
→ Résultat: EXP MASSIVE
```

### Types de Taxi

**1. Player Taxi**:
- Un joueur high-level fait le taxi
- Le low-level player (le "passager") gagne de l'EXP
- Le taxi gagne aussi de l'EXP (mais moins que solo)
- **Mutuellement bénéfique**

**2. NPC Taxi**:
- Le player se party avec un NPC mercenaire
- Plus controlable mais moins efficace
- Certains serveurs ont des "mercenary NPCs"

**3. Multi-Taxi**:
- Plusieurs low-level players dans le party
- Average level encore plus bas
- EXP encore plus insane
- Mais difficile à organiser

### Server Standard Level System

**Source**: Discussion officielle Silkroad Origin Mobile

**Le Nouveau Système (Proposé)**:
- Characters **below server standard level** reçoivent **150-200% EXP buff**
- Cela remplace le système de taxi sur certains serveurs
- Le but: Aider les new players à catch up sans abuse

### Stratégies de Taxi

**Pour le Taxi (High Level)**:
1. **Trouvez un passager** (level 20-40)
2. **Party avec lui**
3. **Allez dans une zone** avec des mobs level = average party level
4. **AOE farm** les mobs
5. **Watch les gains d'EXP** du passager

**Pour le Passager (Low Level)**:
1. **Trouvez un taxi** (level 70+)
2. **Donnez-lui un peu de gold** (optionnel)
3. **Suivez-le** et restez dans le range
4. **Profitez** de l'EXP massive

**Zones Populaires de Taxi**:
- **Level 40-50**: Ong Habitat
- **Level 50-60**: Bunwangs
- **Level 60-70**: Mu jun Area
- **Level 70-80**: Advanced zones

### Controverses

- Certains joueurs considèrent le taxi comme du "cheating" / "pay-to-win"
- Avantage injuste pour les multi-comptes
- Silkroad Origin Mobile propose de le **remplacer** par des buffs automatiques pour les bas niveaux

### Communauté

**Termes**:
- **"Taxi"**: joueur high-level qui power level des low-levels
- **"Passager"**: le low-level qui reçoit le taxi
- **"Driver"**: le taxi lui-même

**Prix**: variable selon le serveur (100k-500k gold par session, parfois gratuit entre amis/guildés)

---

## 📊 Bonus EXP Détaillés (Recherche 2025)

### "Each get EXP" Party (Original PC)

**Caractéristiques**:
- **Maximum**: 4 members
- **Type**: chaque membre reçoit de l'EXP individuel (pas de partage)
- **Bonus**: plus faible qu'en auto-share; ~**+3% par membre additionnel** selon les données communautaires

**Tableau indicatif**:
| Membres | Bonus EXP (communauté) |
|---------|------------------------|
| **2 players** | ~+3% |
| **3 players** | ~+6% |
| **4 players** | ~+9% |

### "Auto Share EXP" Party (Original PC)

**Caractéristiques**:
- **Maximum**: 8 members
- **Type**: EXP du groupe partagée automatiquement entre les membres proches (part pondérée)
- **Bonus**: **supérieur** au mode Each Get (affirmé par Silkroad Forums & guide Partyplay allemand) — les gros +20-60% parfois cités proviennent surtout des **versions mobiles / serveurs privés** ⚠️

### Silkroad Origin Mobile (Système Tiered)

**Système Modernisé** (≠ client PC classique):
| Membres | Bonus EXP |
|---------|-----------|
| **2 members** | **+5%** |
| **3 members** | **+10%** |
| **4 members** | **+15%** |
| **5 members** | **+20%** |
| **6 members** | **+25%** |
| **7+ members** | **+30%+** |

⚠️ Ces valeurs sont celles de Silkroad Origin Mobile — ne pas les traiter comme des données du client PC.

### Level Difference Impact

- Party avec des **levels similaires** = rendement optimal par tête
- Un low-level dans le party **abaisse l'average level** → utile en taxi (voir section dédiée), réduit sinon la part des hauts niveaux

### Formule EXP Approximative

```
EXP Finale = Base EXP × (1 + Party Bonus) × Level Multiplier

Exemple:
Base EXP: 1,000
Party (4 members): +9%
Level Multiplier: 1.2 (level optimal)

EXP Finale = 1,000 × 1.09 × 1.2 = 1,308 EXP
(+31% vs solo)
```

### Tips pour Maximiser EXP

1. **Party 8/8 auto-share** pour le grind
2. **Mobs 3-6 niveaux au-dessus** du party
3. **Restez ensemble** (rayon de partage)
4. **AOE parties** : wizard pull 20+ mobs
5. **Full buffs** (bard + cleric)

---

## ❓ FAQ

### Q: Quel est la taille maximum d'un party?
**R:** **8 joueurs**, uniquement en mode **Auto Share EXP**. Le mode Each Get EXP est limité à 4. L'Union Party (tardif) combine jusqu'à 4 partys (~32 joueurs).

### Q: L'EXP est-elle partagée équitablement?
**R:** En auto-share, l'EXP du groupe est répartie entre les membres proches, pondérée (notamment par niveau). En Each Get, chacun garde l'EXP de ses kills.

### Q: Existe-t-il une limite de niveau entre les membres?
**R:** Pas de plage stricte documentée sur PC classique (le système taxi en est la preuve). Certains serveurs privés/mobiles ajoutent leurs propres restrictions.

### Q: Comment fonctionne le loot en party?
**R:** Deux modes choisis à la création : **libre** (premier servi) ou **distribution automatique** (tour de rôle A→B→C→D).

### Q: Puis-je kicker un membre du party?
**R:** Oui, si vous êtes le party leader (clic droit → kick).

### Q: Le bonus EXP s'applique-t-il aux quests?
**R:** Généralement non — le bonus s'applique aux kills de monstres.

### Q: Comment quitter un party?
**R:** Clic droit sur votre portrait → "Leave Party" (ou déconnexion).

---

## 🔗 Resources

### Guides
- [Need Some Info about Party Systems - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=7&t=19130) — each-get vs auto-share
- [Partyplay Guide - silkroadonline.de](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/864-partyplay) — enregistrement party matching
- [Grouping Tips - MMORPG.com](https://www.mmorpg.com/general-articles/grouping-tips-2000116712) — composition 8/8
- [Guide: European 8/8 Party leveling - Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/1287004-guide-european-8-8-party-leveling.html)
- [Guide: Chinese 8/8 Party Farming - Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/3346708-guide-chinese-8-8-party-farming.html)
- [Hunting/Grinding - Silkroad Latino Wiki](https://wiki.silkroadlatino.com/en/faq/caza-grinding) — auto-share items à tour de rôle

### Union Party / Auto-Party
- [Union Party - phBot Guide](https://guide.phbot.org/phbot/union-party) — scroll, 3 partys supplémentaires
- [Union Party System - MMOHuts](https://mmohuts.com/news/union-party-system-unlocks-hidden-silkroad-online-power)

### Discussions EXP
- [XP share/distribute parties - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=5&t=4080) — +3%/membre
- [Party EXP adjustments - Silkroad Origin Mobile](https://sromobile.com/en/news/updates/party-exp-farming-system-adjustments)
- [Gold/SP kasma rehberi (slots, job dungeon, tactiques) — vSRO.org](https://www.vsro.org/konular/gold-sp-kasma-rehberi-slotlar-job-dungeon-ve-gunluk-taktikler.13648) — composition party 8/8 turque (1 Cleric + 2 Warrior + 3 Wizard + 1 Bard + 1 Warlock)

---

## 📚 Voir aussi
- [Guild System](17_GUILD_SYSTEM.md) — Union de guildes vs Union Party
- [Fortress War](19_FORTRESS_WAR.md) — Usage massif des partys
- [Leveling Guide](25_LEVELING_GUIDE.md) — Formules d'EXP

---

*Dernière mise à jour: 2026-10-01 (recherche web exhaustive : Silkroad Forums, Elitepvpers, silkroadonline.de, phBot, sromobile — enrichi par la recherche TR 2026-10 : vSRO.org)*
