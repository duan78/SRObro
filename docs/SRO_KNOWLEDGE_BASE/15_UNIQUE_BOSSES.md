# Unique Bosses

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Liste Officielle des Uniques](#-liste-officielle-des-uniques)
- [Uniques Classiques (Chine/Europe)](#-uniques-classiques-chineeurope)
- [Roc (Roc Mountain)](#-roc-roc-mountain)
- [Uniques du Qin-Shi Tomb (Medusa)](#-uniques-du-qin-shi-tomb-medusa)
- [Uniques du Job Temple (Alexandrie)](#-uniques-du-job-temple-alexandrie)
- [Boss du Forgotten World (FGW)](#-boss-du-forgotten-world-fgw)
- [Variantes Event (Strong/Evil/GM)](#-variantes-event-strongevilgm)
- [Spawn Times](#-spawn-times)
- [Spawn Locations](#-spawn-locations)
- [Drop Lists](#-drop-lists)
- [Stratégies de Farm](#-stratégies-de-farm)
- [Unique Hunting Parties](#-unique-hunting-parties)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 👑 Vue d'Ensemble

Les **Uniques** sont les boss les plus puissants de Silkroad Online. Ils dropent des items rares (SOS, SOM, SOSun) et donnent une quantité massive d'EXP/SP.

### Points Clés
- ✅ **Meilleurs drops du jeu:** SOX items
- ✅ **Massive EXP/SP:** Un unique peut donner plusieurs levels
- ✅ **Long respawn:** 3-5 heures sur iSRO (4h par défaut dans les fichiers vSRO), variable selon les serveurs
- ✅ **Full party required:** Généralement impossible solo au level approprié
- ✅ **Competition:** D'autres joueurs veulent aussi les tuer

### ⚠️ Note de fiabilité (recherche 2026)

Ce document a été corrigé à partir de **données extraites du client officiel** (tables `_RefObjCommon`/`characterdata`, publiées sur silkroadonline.wiki) et de guides communautaires anciens (elitepvpers, rev6, mmorpg.com, strategywiki). Les HP/levels ci-dessous sont **vérifiés** sauf mention contraire.

> ❌ **Corrigé :** les anciennes versions de ce fichier listaient « Cerberus niveau 40 », « Captain Ivy 60 », « Isyutaru 80 », « Lady Lyn », « Beithy », « Bunny/Rooster/Monkey », « Spider Queen », « Sphinx/Osiris/Ra » comme uniques de terrain. **Lady Lyn, Beithy, Bunny, Rooster, Monkey, Spider Queen n'existent pas dans les données client iSRO** — ce sont des inventions ou des uniques de serveurs privés. Sphinx/Osiris/Neith/Isis/Serket/Seth existent mais sont les uniques du **Job Temple** (voir sections dédiées).

---

## 📜 Liste Officielle des Uniques

### 📊 Tableau Complet Vérifié (données client iSRO)

| # | Unique | Code client | ID | Level | HP | ATK | Gold | Carte |
|---|--------|-------------|-----|-------|-----|-----|------|-------|
| 1 | **Tiger Girl** | `MOB_CH_TIGERWOMAN` | 1954 | 20 | 598,720 | 42-51 | 586,560 | Chine (Jangan) |
| 2 | **Cerberus** | `MOB_EU_KERBEROS` | 5871 | 24 | 693,072 | 52-70 | 740,519 | Europe (Constantinople) |
| 3 | **Captain Ivy** | `MOB_AM_IVY` | 14778 | 30 | 1,094,835 | 115-184 | 1,050,440 | Asie Mineure |
| 4 | **Uruchi** | `MOB_OA_URUCHI` | 1982 | 40 | 1,779,528 | 124-149 | 1,711,056 | Asie Centrale (Tarim Basin) |
| 5 | **Isyutaru** | `MOB_KK_ISYUTARU` | 2002 | 60 | 4,324,612 | 274-329 | 3,572,738 | Karakoram |
| 6 | **Lord Yarkan** | `MOB_TK_BONELORD` | 3810 | 80 | 9,353,045 | 559-1047 | 6,452,763 | Taklamakan |
| 7 | **Demon Shaitan** | `MOB_RM_TAHOMET` | 3875 | 90 | 12,732,060 | 898-1528 | 8,671,974 | Roc Mountain |
| 8 | **Roc** | `MOB_RM_ROC` | 3877 | 100 | **1,451,891,045** | 2052-3283 | 1,157,701,880 | Roc Mountain |
| 9 | **BeakYung the White Viper** (« Medusa ») | `MOB_QT_*` | — | 105 | 183,535,199 | — | — | Qin-Shi Tomb B6 |
| 10 | **Apis** | `MOB_SD_APIS` | 32751 | 103 | 21,068,995 | 1775-2925 | 12,735,087 | Job Temple |
| 11 | **Selket** | `MOB_SD_SELKISID` | 32767 | 105 | 80,811,919 | 2907-4785 | 32,264,851 | Job Temple |
| 12 | **Neith** | `MOB_SD_NEITH` | 32768 | 106 | 83,077,174 | 2991-4923 | 33,232,797 | Job Temple |
| 13 | **Anubis** | `MOB_SD_ANUBIS` | 32769 | 107 | 150,486,799 | 3165-5210 | 52,885,013 | Job Temple |
| 14 | **Isis** | `MOB_SD_ISIS` | 32770 | 108 | 154,677,234 | 3256-5359 | 54,471,562 | Job Temple |
| 15 | **Haroeris** | `MOB_SD_HAROERIS` | 26681 | 109 | 440,747,010 | 3815-6277 | 99,204,245 | Job Temple |
| 16 | **Seth** | `MOB_SD_SETH` | 26683 | 110 | 425,505,853 | 4034-6637 | 101,035,947 | Job Temple |

**Sous-uniques du Qin-Shi Tomb** (voir section dédiée) : 4 Gardiens (98-99), Shinmoo (100), Soso the Black Viper (100), Snake Generals (95).

**Boss de donjons FGW** (voir section dédiée) : Togui General (bracket 35-50, version A1 = lvl 39), Ghost Sereness (bracket 91-100, version A1 = lvl 93) — le level des boss FGW dépend du bracket et du grade (A1-A4).

### Codes de région dans les noms internes
| Préfixe | Région |
|---------|--------|
| `MOB_CH_` | Chine (Jangan → Donwhang → Hotan) |
| `MOB_EU_` | Europe (Constantinople) |
| `MOB_AM_` | Asie Mineure |
| `MOB_OA_` | Asie Centrale (Tarim Basin) |
| `MOB_KK_` | Karakoram |
| `MOB_TK_` | Taklamakan |
| `MOB_RM_` | Roc Mountain |
| `MOB_QT_` | Qin-Shi Tomb (donjon de Jangan) |
| `MOB_SD_` | Désert d'Alexandrie / Job Temple |
| `MOB_GOD_` | Forgotten World (donjons) |
| `MOB_EV_` | Événements |

---

## 🐯 Uniques Classiques (Chine/Europe)

### TIGER GIRL (Level 20) — le premier unique

```
ID: 1954 | Code: MOB_CH_TIGERWOMAN
HP: 598,720 | ATK: 42-51 | DEF phys: 18 | Gold: 586,560
```

**Carte:** Chine — zone de Jangan
**Zones de spawn:** Bandit Stronghold (Bijeokdan Mountain) et Tiger Mountain. Le point exact est aléatoire parmi plusieurs spots « bleus ».

**Mécanique:** AOE stun (roar). Cible classique des serveurs privés (spawn souvent réduit à 30-60 min).

**Stratégie:**
- Level 30+ en solo possible, 20+ en petite party
- Tank and spank, attention au stun AOE

---

### CERBERUS (Level 24)

```
ID: 5871 | Code: MOB_EU_KERBEROS
HP: 693,072 | ATK: 52-70 | DEF phys: 22 | Gold: 740,519
```

**Carte:** Europe — zone de Constantinople
**Zones de spawn:** Desperado Hill, Forest of Dusk, Garden of Gods

**Mécanique:** Attaques multiples (3 têtes). Monstres europe proches aggro.

**Stratégie:**
- Level 30+ recommandé, ranged pratique
- Après un crash serveur : spawn fixe à l'ouest de Desperado Hill

---

### CAPTAIN IVY (Level 30)

```
ID: 14778 | Code: MOB_AM_IVY
HP: 1,094,835 | ATK: 115-184 | DEF phys: 30 | Gold: 1,050,440
```

**Carte:** Asie Mineure
**Zones de spawn:** Amphitheater, Cleopatra's Gate, Haran's Tower

**Mécanique:** Attaques rapides de « pirate », forte ATK pour son level.

**Stratégie:**
- Level 40+ en petit groupe, full party à level 30-35
- Après un crash serveur : spawn fixe à l'Amphitheater

---

### URUCHI (Level 40)

```
ID: 1982 | Code: MOB_OA_URUCHI
HP: 1,779,528 | ATK: 124-149 | DEF phys: 47 | Gold: 1,711,056
```

**Carte:** Asie Centrale — Tarim Basin (route Donwhang → Hotan)
**Zones de spawn:** large zone autour de la forteresse **Black Robber Den** et le long des routes du **Tarim Ferry**

**Mécanique:** Chef des Black Robbers. Bonne source de gold pour son level.

**Stratégie:**
- Level 50+ party (4-8 joueurs)
- Après un crash serveur : spawn fixe dans le Black Robber Den

---

### ISYUTARU (Level 60)

```
ID: 2002 | Code: MOB_KK_ISYUTARU
HP: 4,324,612 | ATK: 274-329 | DEF phys: 101 | Gold: 3,572,738
```

**Carte:** Karakoram (montagnes enneigées entre Hotan et Samarkand)
**Zones de spawn:** centre de la carte, zones de glace autour des **Ancient Remains**

**Mécanique:** Reine des glaces — attaques de froid/freeze. DEF élevée (101) pour son époque : le combat dure.

**Stratégie:**
- Full party 8 joueurs level 70+ recommandé
- 2 tanks + healer + DPS, attaques de feu privilégiées
- Après un crash serveur : spawn fixe sur la glace du Karakoram

---

### LORD YARKAN (Level 80)

```
ID: 3810 | Code: MOB_TK_BONELORD
HP: 9,353,045 | ATK: 559-1047 | DEF phys: 197 | Gold: 6,452,763
```

**Carte:** Taklamakan (désert, au-delà de Hotan)
**Zones de spawn:** ruines de **Niya Remains** et les zones de sable environnantes ; une « arène » de spawn existe dans le désert

**Mécanique:** Seigneur des os — multi-attaques, 9 skills répertoriés dans le client (3501-3509).

**Stratégie:**
- Full party 8 joueurs level 90+, coordination obligatoire
- Zarkan (= Yarkan) est très recherché pour ses drops 9D

---

### DEMON SHAITAN (Level 90)

```
ID: 3875 | Code: MOB_RM_TAHOMET
HP: 12,732,060 | ATK: 898-1528 | DEF phys: 268 | Gold: 8,671,974
```

**Carte:** Roc Mountain (chaîne de montagnes à l'ouest, accès par le Taklamakan)
**Zones de spawn:** **Heart Peak, Claw Peak, Wing Peak** (les 3 sommets)

**Mécanique:** Démon de feu — 10 skills répertoriés dans le client. Le plus dur des uniques « de terrain » classiques.

**Stratégie:**
- Full party 100+ avec tanks solides et heals continus
- Après un crash serveur : spawn fixe près de Claw Peak
- Beaucoup de potions — le fight est long

---

## 🦅 Roc (Roc Mountain)

```
ID: 3877 | Code: MOB_RM_ROC
Level: 100 | HP: 1,451,891,045 (1.45 milliard!) | ATK: 2052-3283 | Gold: 1,157,701,880
```

**Le boss ultime de Roc Mountain.** L'oiseau géant (code `MOB_RM_ROC`, classé « party monster » dans le client). Son HP est ~100x celui de Demon Shaitan : c'est un raid de guilde, pas un unique de party 8.

**Stratégie:**
- Raid multi-parties, stuff SOSun minimum
- Mécanique de type « world boss » (long combat, respawn très espacé)

> ⚠️ Certains serveurs privés ne l'activent pas ou modifient son HP massivement.

---

## 🐍 Uniques du Qin-Shi Tomb (Medusa)

Le **Qin-Shi Tomb** (donjon « Jangan Cave », à l'est de Jangan) contient un système complet d'uniques, décrit en détail par le guide mmorpg.com (2009, iSRO) :

### Structure du donjon
| Étage | Levels des monstres | Particularité |
|-------|---------------------|---------------|
| B1-B2 | ~76-89 | Monstres terre/feu |
| B3 | ~90-95 | Tomb Snake Lady, Snake Generals (95) |
| B4 | ~96-99 | **Serin Gate** au centre (téléport vers B5) |
| B5 | 98-99 | Les 4 Gardiens |
| B6 | 92-99 | Chambres : Guardian / Man-Viper / Black Viper / White Viper |

### La Serin Gate (accès à B5/B6)
```
Ouverture: 4 fois par jour — 04h00, 10h00, 16h00, 22h00 (heure SRST)
Durée d'ouverture: 10 minutes
Position: centre du B4
```

### Les 4 Gardiens (B5, niveaux 98-99)
| Gardien | Animal | Position | Level |
|---------|--------|----------|-------|
| JeonUk The Black Tortoise | Tortue noire | Nord | 98 |
| YumJae The Red Hawk | Faucon rouge | Sud | 98 |
| TaeHo The Blue Dragon | Dragon bleu | Ouest | 99 |
| SoHaow The White Tiger | Tigre blanc | Est | 99 (le plus dur) |

### SHINMOO, The Man of Flames (Level 100)
- Spawn dans le coin sud-ouest de la salle centrale du B5 **après la mort des 4 gardiens**
- Guerrier venu tuer Medusa — un des rares monstres à dropper du stuff level 100

### SOSO, The Black Viper (Level 100)
- Black Viper Chamber (B6) — drop du stuff 10D level 100

### BEAKYUNG THE WHITE VIPER « MEDUSA » (Level 105)
```
HP: 183,535,199 | Zone: White Viper Chamber (pièce nord du B6)
```
- Le boss final du tombeau, la « Snake Lady / Medusa » de la communauté
- Sur iSRO son spawn est partiellement **codé en dur dans le GameServer** (source : guide elitepvpers « Fixing Medusa duplicated spawn »)
- Considérée comme le unique le plus difficile du jeu classique — top guilds uniquement

---

## 🏺 Uniques du Job Temple (Alexandrie)

Le **Job Temple** (donjon de job au sud d'Alexandrie, cap 120) contient 6+ uniques égyptiens. Accès selon l'**Activity Points (AP)** de votre union de job :

| Unique | Level | HP | Accès |
|--------|-------|-----|-------|
| **Apis** | 103 | 21,068,995 | Spawn conditionnel (après la mort d'Isis et Anubis) |
| **Selket** | 105 | 80,811,919 | Libre (aucun AP requis) |
| **Neith** | 106 | 83,077,174 | Libre (aucun AP requis) |
| **Anubis** | 107 | 150,486,799 | AP requis (zone Anubis/Isis) |
| **Isis** | 108 | 154,677,234 | AP requis (zone Anubis/Isis) |
| **Haroeris** | 109 | 440,747,010 | Zone profonde, haut AP d'union |
| **Seth** | 110 | 425,505,853 | Zone profonde, haut AP d'union |

**Monstres du temple (SD) :** Uneg (100), Weneg (101), Dark Khepri (101), Dark Scout (102), Blood Hyena (104).

**Drops signalés** (non vérifiés sur iSRO, confirmés sur serveurs type ExaySRO) : Immortal/Astral stones par les uniques, items de job, Iron Coins.

**Mécanique:** le temple est un PvP-job zone — tradez/portez la cape de job ; les unions se disputent les chambres.

---

## 🐉 Boss du Forgotten World (FGW)

Les donjons FGW (accessibles lvl 35-110 via les **Dimension Holes** ouverts par les **Envies** après destruction des **Dimension Pillars**) ont chacun un boss final. Code client : `MOB_GOD_*`.

### Donjons et brackets
| Donjon | Brackets de level | Boss |
|--------|-------------------|------|
| **Togui Village** | 35-50 / 51-60 / 61-70 | **Togui General** (A1 = lvl 39, HP 143,131) + Togui Elder |
| **Arab Flame Mountain** | 71-80 / 81-90 | Généraux de la montagne (noms exacts Ipne/Ipilla signalés par la communauté — *non vérifiés dans le client*) |
| **Green Abyss (Shipwreck)** | 91-100 | **Ghost Sereness** (A1 = lvl 93, HP 11,307,269, **Petrify!**) |
| **Sea of Resentment (Shipwreck)** | 101-110 | **Ghost Sereness** version 101-110 (drops D11 Nova) |

### Détails
- **Grades:** chaque donjon existe en grades 1★-4★ ; le level du boss et des mobs monte avec le bracket et le grade (suffixe client A1-A4)
- **Party:** 4 joueurs max en 1★-2★, 8 en 3★-4★
- **Timer:** 2h dans le donjon, ré-entrée impossible pendant 3h ; les trous de dimension se rouvrent toutes les 30 min
- **Ghost Sereness** : boss « Serenity Ghost » présent dans tous les donjons FGW, avec **pétrification** — clez/tuez les adds, purgez la pétrification
- **Récompenses de collection** (talisans → armes) :
  - Togui Village → arme **8D Seal of Sun**
  - Flame Mountain → arme **9D Seal of Sun**
  - Green Abyss → arme **10D Seal of Moon**
  - Sea of Resentment → arme **11D Seal of Nova** (Power)
- Les talismans tombent dans les trésoreries et sur les boss ; les **Faded Beads** rapportent 200-20,000 SP

> 👉 Guide dédié : [29_FORGOTTEN_WORLD.md](./29_FORGOTTEN_WORLD.md)

---

## 🎭 Variantes Event (Strong/Evil/GM)

Les fichiers client contiennent des variantes d'uniques utilisées pour les events (souvent spawnées par GM) :

| Variante | Code client | Usage |
|----------|-------------|-------|
| **Strong Tiger Girl** | `MOB_CH_TIGERWOMAN_L2` | Event / serveur privé (boostée) |
| **Evil Tiger Girl** | `MOB_CH_TIGERWOMAN_L3` | Event / serveur privé (encore plus forte) |
| **GM's Tiger Girl / GM's Lord Yarkan** | IDs 7550-7564 | Tools GM |
| **Strong Ong** (lvl 34, HP 62,959 vs 2,099) | `MOB_OA_ONG` variant | Event monsters de zone |
| **MOB_EV_*** (ex. Young Bear `MOB_EV_BEAR_A_050`) | — | Events saisonniers |

**Attention :** « Cerberus Strong / Captain Ivy Strong » (ex-« Cerberus King ») cités dans d'anciens documents correspondent à ces variantes d'event, pas à des uniques officiels de terrain.

---

## ⏰ Spawn Times

### Règles vérifiées (iSRO / vSRO)

```
iSRO (officiel)      : spawn toutes les 3-5 heures à un point aléatoire ("blue spots")
vSRO (fichiers srv)  : timer par défaut = 4 heures après la mort
StrategyWiki (2006)  : "spawn 1-2 fois par jour dans des zones spéciales" (ancien)
```

- ⏱️ **Le timer démarre à la mort** de l'unique
- 🎲 **Le point de spawn est aléatoire** parmi plusieurs spots prédéfinis (points bleus des maps communautaires)
- 💥 **Après un crash/restart serveur**, les uniques repop aux **spots fixes** :
  - Tiger Girl → nord du Bandit Stronghold
  - Cerberus → ouest de Desperado Hill
  - Captain Ivy → Amphitheater
  - Uruchi → intérieur du Black Robber Den
  - Isyutaru → glace du Karakoram
  - Lord Yarkan → arène
  - Demon Shaitan → près de Claw Peak
- 🔗 Sur certains serveurs (ZsZC), Tiger Girl a une chance de spawn **après** la mort de Lord Yarkan ou Uruchi

### Variations serveurs privés
- Low-rate (1x-5x) : souvent timers officiels
- Mid-rate : 1-4h
- High-rate (100x+) : 30-60 min, announcements globales
- Certains serveurs annoncent le spawn (« Unique [Tiger Girl] has spawned! »), d'autres non

### Timer spécial : Qin-Shi Tomb
- La **Serin Gate** (B4 → B5/B6) ouvre à heure **fixe** : 04h00 / 10h00 / 16h00 / 22h00, pendant 10 minutes seulement
- Medusa/BeakYung : spawn très espacé, partiellement hardcoded côté serveur

---

## 🗺️ Spawn Locations

### Résumé par carte (zones vérifiées rev6/elitepvpers)

| Unique | Carte | Zones de spawn |
|--------|-------|----------------|
| Tiger Girl | Chine | Bandit Stronghold (Bijeokdan Mtn), Tiger Mountain |
| Cerberus | Europe | Desperado Hill, Forest of Dusk, Garden of Gods |
| Captain Ivy | Asie Mineure | Amphitheater, Cleopatra's Gate, Haran's Tower |
| Uruchi | Tarim Basin | Black Robber Den, routes du Tarim Ferry |
| Isyutaru | Karakoram | centre de la carte (glace), Ancient Remains |
| Lord Yarkan | Taklamakan | Niya Remains + sables, arène |
| Demon Shaitan | Roc Mountain | Heart Peak, Claw Peak, Wing Peak |
| Roc | Roc Mountain | nid du Roc (non publié) |
| Medusa (BeakYung) | Qin-Shi Tomb | White Viper Chamber (nord du B6) |
| Job Temple uniques | Alexandrie sud | chambres du temple (instance de job) |

### Coordonnées précises (rapportées, non vérifiées)

> ⚠️ Les coordonnées exactes monde varient selon la version du client. Les valeurs ci-dessous proviennent de maps communautaires (xSROMap / SilkNoobz) — à valider avant implémentation :

- **Tiger Girl :** X ≈ 4853, Y ≈ 94 (Tiger Mountain) *(rapporté)*
- **Cerberus :** X ≈ -1552, Y ≈ -94 (Desperado Hill) *(rapporté)*
- **Captain Ivy :** X ≈ -6425, Y ≈ 2745 (Amphitheater) *(rapporté)*

**Outil recommandé :** [xSROMap](https://jellybitz.github.io/xSROMap/) — navigation par zones et coordonnées PosX/Y/Z.
Détails complets : [MONSTERS_SPAWN_LOCATIONS.md](./MONSTERS_SPAWN_LOCATIONS.md)

---

## 💎 Drop Lists

### ⚠️ Ce qui est vérifié vs ce qui ne l'est pas

**Vérifié :**
- Les tables de drop sont **côté serveur** (aucun dump public fiable pour iSRO)
- Le **gold yield** ci-dessus vient des données client (ex. Tiger Girl = 586,560)
- Uniques → équipement du degré correspondant à leur tranche de level (TG: 2D-3D … Shaitan: 9D, tomb: 10D, job temple: 11D+) *(consensus communautaire)*
- FGW : talismans (boss + trésoreries), armes de collection D8→D11, Faded Beads (SP)
- Job Temple : Immortal/Astral stones signalés sur les uniques *(serveurs privés, non vérifié iSRO)*

**Non vérifié (à ne pas présenter comme acquis) :**
- Les « taux » de SOS/SOM/SOSun par unique (variables par serveur)
- Les % de drop d'elixirs par unique

### Ordres de grandeur communautaires (serveurs type officiel)

| Type de drop | Chance rapportée |
|--------------|------------------|
| SOS (Seal of Star) | ~5-10% par kill d'unique |
| SOM (Seal of Moon) | ~1-3% |
| SOSun (Seal of Sun) | ~0.1-0.5% (légendaire) |

> Sur les serveurs boostés ces taux montent fortement (jusqu'à 30-50% SOS) — **toujours vérifier les rates de votre serveur**.

---

## ⚔️ Stratégies de Farm

### Preparation

**1. Gather Information:**
- Notez l'heure de mort de chaque unique (fenêtre de spawn = mort + 3-5h)
- Placez des scouts sur les différents spots possibles

**2. Assemble Party:**
- Full party 8 : 2 tanks (Warriors STR), 2 healers (Clerics), 4 DPS (Wizards/Nukers)
- Pour Roc/Medusa/Haroeris : raid multi-parties coordonné par guilde

**3. Stock Supplies:**
- HP/MP potions en grande quantité, res scrolls, speed scrolls, buffs

### Pendant le combat

- **Tanks:** tiennent l'aggro, skills défensifs
- **Healers:** spam heal, watch aggro, resurrection
- **DPS:** DPS soutenu, attention à l'aggro, pas de pull d'adds
- **Cas particuliers:** Ghost Sereness (purge pétrification), Isyutaru (résistance froid), Shaitan (résistance feu)

### Après le kill

- Le leader distribue, ou « free for all », ou roll — définissez AVANT le fight
- Les SOX se vendent très cher ([22_ECONOMY_GOLD.md](./22_ECONOMY_GOLD.md))

---

## 👥 Unique Hunting Parties

### Composition

**Standard (8 joueurs):**
- 2x Tanks (Warriors) — rotation d'aggro
- 2x Healers (Clerics)
- 4x DPS (Wizards, Rogues, Nukers)

**Minimum (4 joueurs):** 1 tank + 1 healer + 2 DPS — pour les uniques bas level uniquement

**Raid (Roc, Medusa, Haroeris/Seth):** 2-3 parties + shot-caller dédié

### Compétition

- **First hit / most damage** : la règle d'attribution dépend du serveur — renseignez-vous
- Le KS (kill stealing) est possible sur la plupart des serveurs anciens : le burst DPS peut « voler » le loot
- Camp les spots 30 min avant la fenêtre de spawn théorique

---

## ❓ FAQ

### Q: Quel est le vrai niveau de Tiger Girl ?
**R:** **20** (données client, ID 1954). Certaines anciennes pages disaient 18 : c'est une confusion avec d'anciennes versions.

### Q: « Lady Lyn » et « Beithy » existent-ils ?
**R:** **Pas dans les données client iSRO.** Ces noms (comme Bunny, Rooster, Monkey, Spider Queen) viennent d'inventions ou de serveurs privés. Les vrais « gros » uniques sont **Roc (100)**, **Medusa/BeakYung (105)** et les uniques du **Job Temple (103-110)**.

### Q: Les uniques spawn-ils à heure fixe ?
**R:** Non — X heures (3-5h sur iSRO) après leur mort, à un point aléatoire. Exceptions : la Serin Gate du Qin-Shi Tomb (heures fixes 04h/10h/16h/22h) et certains events.

### Q: Puis-je solo un unique ?
**R:** Tiger Girl/Cerberus/Ivy/Uruchi se solotent avec 10-20 levels de plus. Isyutaru, Yarkan, Shaitan nécessitent une party. Roc et Medusa = raids de guilde.

### Q: Pourquoi le HP de Roc est si énorme ?
**R:** 1.45 milliard — Roc est un « world boss / party monster » (code MOB_RM_ROC), pas un unique standard. Il est conçu pour des raids entiers.

### Q: Les drops sont-ils garantis ?
**R:** Non, c'est du RNG. Seul le gold est quasi garanti (montants ci-dessus issus du client).

### Q: Les uniques respawn-ils plus vite sur les serveurs privés ?
**R:** Généralement oui (30 min à 2h). Le défaut vSRO est 4h.

---

## 🔗 Resources

### Données client / bases
- [Silkroad Online Database - Monsters](https://silkroadonline.wiki/monsters) — données extraites du client (IDs, HP, levels)
- [xSROMap](https://jellybitz.github.io/xSROMap/) — carte interactive (zones + coordonnées)

### Guides uniques
- [Elitepvpers - Guide Unique Spawns](https://www.elitepvpers.com/forum/sro-guides-templates/186742-guide-unique-spawns.html) — HP officiels + mécanique 3-5h
- [Elitepvpers - Unique Spawn Maps COMPLETE](https://www.elitepvpers.com/forum/silkroad-online/389926-silkroad-unique-spawn-maps-complete.html)
- [MMORPG.com - Unique Monsters Part 1](https://www.mmorpg.com/interviews/unique-monsters-part-one-2000116853) et [Part 2](https://www.mmorpg.com/guides/unique-monsters-part-two-2000116869) — Qin-Shi Tomb / Medusa en détail
- [Rev6 - Unique Spawn Points](https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari) — zones de spawn par unique
- [StrategyWiki - Silkroad Online/Bosses](https://strategywiki.org/wiki/Silkroad_Online/Bosses) — liste officielle des 7 uniques
- [ExaySRO Wiki - Unique Locations](https://wiki.exaysro.com/books/guides/page/unique-locations)
- [ExaySRO Forum - Job Temple Unique Guide](https://forum.exaysro.com/showthread.php?tid=3875)

### Forgotten World
- [Silkroad Online Wiki (Fandom) - Forgotten World](https://silkroadonline.fandom.com/wiki/Forgotten_World)
- [Guild Algarb - FGW Maps](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world)

---

*Dernière mise à jour: 2026-10-01 (recherche web exhaustive — données client vérifiées via silkroadonline.wiki, elitepvpers, rev6, mmorpg.com, strategywiki)*
