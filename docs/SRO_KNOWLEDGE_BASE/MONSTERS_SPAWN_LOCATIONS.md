# Monster Spawn Locations - Coordonnées et Zones

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Unique Bosses](#-unique-bosses)
- [Qin-Shi Tomb (Jangan Cave)](#-qin-shi-tomb-jangan-cave--uniques--structure)
- [Job Temple (Alexandrie)](#-job-temple-alexandrie--uniques--monstres)
- [🇰🇷 Zones de spawn KSRO 106-140](#️-zones-de-spawn-ksro-106-140)
- [Champion/Giant Spawns](#-championgiant-spawns)
- [SP Farming Spots](#-sp-farming-spots)
- [Leveling Zones](#️-leveling-zones)
- [Monster Types](#-monster-types)
- [Notes de Développement](#-notes-de-développement)
- [Statistiques de Spawn](#-statistiques-de-spawn)

---

## 📚 Introduction

Ce document fournit les **coordonnées de spawn précises** pour les monstres importants de Silkroad Online: Uniques, Champions, Giants, et zones de farming.

**Sources Primaires:**
- xSROMap (https://jellybitz.github.io/xSROMap/)
- Silkroad Online Database - données client (https://silkroadonline.wiki/monsters)
- Rev6 Unique Spawn Points (https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari)
- Elitepvpers Unique Spawns (https://www.elitepvpers.com/forum/sro-guides-templates/186742-guide-unique-spawns.html)
- Monster Area Wiki
- Community guides et databases
- Rapports multilingues 2026-10 : [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) · [RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) · [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md)

**Format des Coordonnées:**
- X, Y (World coordinates)
- Zone name pour référence
- Niveau approximatif des monstres

---

## 👹 Unique Bosses

### Unique Spawns — Données vérifiées (client iSRO + rev6/elitepvpers)

> ✅ **HP/levels = données client** (silkroadonline.wiki). Zones = guides rev6/elitepvpers. Coordonnées X/Y précises = **rapportées, non vérifiées**.
>
> ✅ **Timers par unique (recherche TR 2026-10)** : fenêtres rapportées en minutes après la mort — **Tiger Girl ~210-390 min · Cerberus ~200-400 min · Captain Ivy ~200-450 min (jusqu'à 700 min !) · Uruchi ~230-450 min** ; règle générique DonanımHaber : « 3,5-5 h », « minimum 2 h après le dernier kill, ensuite aléatoire ». Sources : [Extraloob](https://www.extraloob.com/threads/silkroad-1-100-level-unique-hakkinda-bilgiler-234754) · [DonanımHaber](https://forum.donanimhaber.com/unique-spawn-saatleri--14339078)
>
> ✅ **HP validés en croisé (recherche TR/FR/DE 2026-10)** : les 7 uniques classiques sont confirmés par 2 sources TR indépendantes (DonanımHaber + MMSRN), le guide FR GMS Temple 2010 et les forums DE — valeurs identiques au client.
>
> ⚠️ **Conflit FR non tranché** : spawn ressenti ~4 h ([GMS Temple 2010](https://forum.gmstemple.com/index.php?showtopic=8106)) vs ~6 h ([Wikipédia FR](https://fr.wikipedia.org/wiki/Silkroad_Online)) — voir [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md) (section Spawn Times).

#### Tiger Girl (Level 20)
```
Zone: Bandit Stronghold (Bijeokdan Mountain) / Tiger Mountain — Chine, Jangan
Coordonnées (rapportées): X: 4853.28, Y: 93.81 (Tiger Mountain)
Spawn Time: 3-5 heures après mort (4h défaut vSRO), point aléatoire — fenêtre TR: 210-390 min (✅ recherche TR 2026-10)
HP: 598,720 | ATK: 42-51 | DEF: 18 | Gold: 586,560
ID: 1954 | Code: MOB_CH_TIGERWOMAN
Special: AOE stun (roar)
Après crash serveur: spawn fixe au nord du Bandit Stronghold

Drops: équipement 2D-3D, gold, SOX rare

Strategy: solo possible à 30+; sinon party 4-6 joueurs level 20+
```

#### Cerberus (Level 24)
```
Zone: Desperado Hill / Forest of Dusk / Garden of Gods — Europe (Constantinople)
Coordonnées (rapportées): X: -1551.74, Y: -93.72 (Desperado Hill)
Spawn Time: 3-5 heures, point aléatoire — fenêtre TR: 200-400 min (✅ recherche TR 2026-10)
HP: 693,072 | ATK: 52-70 | DEF: 22 | Gold: 740,519
ID: 5871 | Code: MOB_EU_KERBEROS
Special: attaques multiples (3 têtes)
Après crash serveur: spawn fixe à l'ouest de Desperado Hill

Drops: équipement 3D, gold

Strategy: 2-4 joueurs level 25+, ranged pratique
```

#### Captain Ivy (Level 30)
```
Zone: Amphitheater / Cleopatra's Gate / Haran's Tower — Asie Mineure
Coordonnées (rapportées): X: -6424.71, Y: 2744.64 (Amphitheater)
Spawn Time: 3-5 heures, point aléatoire — fenêtre TR: 200-450 min, parfois jusqu'à 700 min (✅ recherche TR 2026-10)
HP: 1,094,835 | ATK: 115-184 | DEF: 30 | Gold: 1,050,440
ID: 14778 | Code: MOB_AM_IVY
Après crash serveur: spawn fixe à l'Amphitheater

Drops: équipement 4D-5D, gold

Strategy: party 4-6 joueurs level 35+
```

#### Uruchi (Level 40)
```
Zone: Black Robber Den (forteresse) + routes du Tarim Ferry — Tarim Basin (Asie Centrale)
Spawn Time: 3-5 heures, point aléatoire — fenêtre TR: 230-450 min (✅ recherche TR 2026-10)
HP: 1,779,528 | ATK: 124-149 | DEF: 47 | Gold: 1,711,056
ID: 1982 | Code: MOB_OA_URUCHI
Après crash serveur: spawn fixe à l'intérieur du Black Robber Den

Drops: équipement 5D-6D, gold (très bon rendement gold)

Strategy: party 4-8 joueurs level 50+
```

#### Isyutaru (Level 60)
```
Zone: centre du Karakoram (zones de glace) + Ancient Remains — entre Hotan et Samarkand
Spawn Time: 3-5 heures, point aléatoire
HP: 4,324,612 | ATK: 274-329 | DEF: 101 | Gold: 3,572,738
ID: 2002 | Code: MOB_KK_ISYUTARU
Special: attaques de froid/freeze
Après crash serveur: spawn fixe sur la glace du Karakoram

Drops: équipement 6D-7D, SOM possible

Strategy: full party (8) level 70+; 2 tanks + heals + DPS
```

#### Lord Yarkan (Level 80)
```
Zone: Niya Remains + sables environnants (arène) — Taklamakan
Spawn Time: 3-5 heures, point aléatoire
HP: 9,353,045 | ATK: 559-1047 | DEF: 197 | Gold: 6,452,763
ID: 3810 | Code: MOB_TK_BONELORD
Après crash serveur: spawn fixe à l'arène

Drops: équipement 8D-9D, SOM fréquent, SOSun possible

Strategy: full party level 90+
```

#### Demon Shaitan (Level 90)
```
Zone: Heart Peak / Claw Peak / Wing Peak — Roc Mountain
Spawn Time: 3-5 heures, point aléatoire
HP: 12,732,060 | ATK: 898-1528 | DEF: 268 | Gold: 8,671,974
ID: 3875 | Code: MOB_RM_TAHOMET
Special: démon de feu, 10 skills client
Après crash serveur: spawn fixe près de Claw Peak

Drops: équipement 9D, meilleurs drops des uniques classiques

Strategy: full party 100+, potions en masse
```

#### Roc (Level 100)
```
Zone: Roc Mountain (world boss)
HP: 1,451,891,045 (1.45 milliard) | ATK: 2052-3283 | DEF: 441
ID: 3877 | Code: MOB_RM_ROC (classé "party monster" dans le client)

Drops: top tier (raid de guilde)
```

#### Medusa / BeakYung the White Viper (Level 105)
```
Zone: Qin-Shi Tomb B6 — White Viper Chamber (pièce nord)
Accès: Serin Gate (centre du B4), ouvertes 04h00/10h00/16h00/22h00 pendant 10 min
HP: 183,535,199
Prérequis: clear du B5 (4 gardiens level 98-99 — noms ZH officiels: 玄武颛顼/白虎小昊/青龙太皥/朱雀炎帝, + 炎火客神武 cité)

Drops: équipement 10D-11D (top tier)
```
> ✅ **Résolu (recherche TR 2026-10 — [SroLobby B6](https://www.srolobby.com/konular/silkroad-online-qin-shi-tomb-b6-monsters-mob-hp-saldiri-tipleri.1780))** : le B6 compte **4 salles dont 2 avec uniques** — SoSo The Black Viper **Lv 100, HP 27 655 068** (attaques physique & magique) ; BeakYung the White Viper HP 183 535 199 (physique & magique).
> ⚠️ **Conflit non tranché** : niveau de BeakYung **100** selon les sources TR (SroLobby + Extraloob) vs **105** selon le client iSRO et le wiki TW DiGeam (HP identiques des deux côtés).
> **Accès rapporté (Extraloob)** : B5 = **5 uniques** à tuer, B6 = tuer **4× l'unique 95** puis salle Medusa — divergent du protocole « 4 gardiens + Shinmoo » (non tranché). Skills officiels TW : AoE magique, ligature frontale, **pétrification 100 %** en rayon ([DiGeam](https://srowiki.digeam.com/%E7%B5%82%E6%A5%B5boss%E4%BB%8B%E7%B4%B9)).

#### Uniques du Job Temple (Alexandrie, levels 103-110)
```
Zone: Job Temple (sud d'Alexandrie) — zone de job, accès selon AP de l'union

Apis      Level 103 | HP 21,068,995  | spawn conditionnel (après Isis+Anubis)
Selket    Level 105 | HP 80,811,919  | accès libre
Neith     Level 106 | HP 83,077,174  | accès libre
Anubis    Level 107 | HP 150,486,799 | AP requis
Isis      Level 108 | HP 154,677,234 | AP requis
Haroeris  Level 109 | HP 440,747,010 | zone profonde
Seth      Level 110 | HP 425,505,853 | zone profonde

Drops: 11D+, Immortal/Astral stones (rapporté, non vérifié iSRO)
```

#### Variantes Event (ex "Cerberus Strong" / "Captain Ivy Strong")
```
Les anciens documents mentionnaient "Cerberus Strong (70)" et "Captain Ivy Strong (75)".
=> Ce sont des VARIANTES D'EVENT, pas des uniques officiels de terrain:
   - Strong Tiger Girl: MOB_CH_TIGERWOMAN_L2
   - Evil Tiger Girl:   MOB_CH_TIGERWOMAN_L3
   - Strong Ong: level 34, 62,959 HP (vs 2,099 normal)
   - Variantes "GM's *": IDs 7550-7564
```

> ❌ **Supprimé (non vérifié):** « Lady Lyn (100) » — introuvable dans les données client iSRO (unique de serveur privé).

---

## 🏆 Qin-Shi Tomb (Jangan Cave) — Uniques & Structure

> ⚠️ **Corrigé (2026):** l'ancienne section « Pharaoh's Tomb Bosses » (Sphinx 90, Sekhmet, Nephthys, Horus, Osiris 100...) ne correspond à **aucune donnée client iSRO**. Le vrai donjon à étages avec gardiens et boss final est le **Qin-Shi Tomb** (Jangan Cave), décrit ci-dessous d'après le guide mmorpg.com (2009). Les noms égyptiens réels (Selket, Neith, Anubis, Isis, Haroeris, Seth) sont ceux du **Job Temple** (section suivante).

### Structure par étage (vérifié)
| Étage | Levels | Contenu |
|-------|--------|---------|
| B1-B2 | ~76-89 | Monstres terre/feu |
| B3 | ~90-95 | Tomb Snake Lady, **Snake Generals (95)** |
| B4 | ~96-99 | **Serin Gate** (centre) — ouvre 04h/10h/16h/22h pendant 10 min |
| B5 | 98-99 | **Les 4 Gardiens** |
| B6 | 92-100 | Guardian Chamber / Man-Viper Chamber / Black Viper Chamber / White Viper Chamber |

### Les 4 Gardiens (B5)
```
JeonUk The Black Tortoise  (Nord)  Level 98   — ZH: 玄武颛顼 (Zhuanxu)
YumJae The Red Hawk        (Sud)   Level 98   — ZH: 朱雀炎帝 (Yandi, « Phénix vermillon »)
TaeHo  The Blue Dragon     (Ouest) Level 99   — ZH: 青龙太皥 (Taihao)
SoHaow The White Tiger     (Est)   Level 99 (le plus dur) — ZH: 白虎小昊 (Xiaohao)
+ cinquième nom cité côté ZH: 炎火客神武
```
> ✅ Résolu (recherche ZH 2026-10) : les gardiens B5 sont nommés dans les sources chinoises officielles (correspondance iSRO↔ZH probable, mêmes animaux cardinaux). Protocole TW : 4 mini-boss cardinaux → pré-boss central (probablement Shinmoo) → ouvre B6. Sources : [DiGeam](https://sro.digeam.com/intro/20200212) · [iccgame](http://silkroad.iccgame.com/content-667-84551.html)

### Boss du tombeau
```
Shinmoo, The Man of Flames    Level 100 — spawn coin SW de la salle centrale du B5
                              après la mort des 4 gardiens; drop stuff lvl 100
Soso, The Black Viper         Level 100 — Black Viper Chamber (B6); drop 10D
                              HP: 27,655,068 (✅ recherche TR 2026-10 — SroLobby)
BeakYung, The White Viper     Level 105 — White Viper Chamber (B6 nord)
                              "Medusa" — HP: 183,535,199 — boss final
                              ⚠️ Lv 100 selon sources TR (vs 105 client) — conflit non tranché
```

---

## 🏺 Job Temple (Alexandrie) — Uniques & Monstres

Zone de job PvP au sud d'Alexandrie (cap 120). Monstres `MOB_SD_*` :

```
Monstres: Uneg (100), Weneg (101), Dark Khepri (101), Dark Scout (102), Blood Hyena (104)

Uniques (accès selon AP de l'union de job):
Apis      Level 103 | HP 21,068,995   | spawn après Isis+Anubis (rapporté)
Selket    Level 105 | HP 80,811,919   | libre
Neith     Level 106 | HP 83,077,174   | libre
Anubis    Level 107 | HP 150,486,799  | AP requis
Isis      Level 108 | HP 154,677,234  | AP requis
Haroeris  Level 109 | HP 440,747,010  | zone profonde
Seth      Level 110 | HP 425,505,853  | zone profonde
```

> 🇰🇷 Validation croisée (recherche KO2 2026-10) : la gamedata officielle coréenne liste les mêmes uniques — 셀키스 105 · 네이트 106 · 아누비스 107 · 이시스 108 · 하로에리스 109 · 세이트 110 — niveaux identiques au client iSRO. Source : [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md).

---

## 🇰🇷 Zones de spawn KSRO 106-140

> ⚠️ **Périmètre** : zones de chasse et de spawn du **service coréen (KSRO)** au-delà du contenu classique — à ne pas mélanger avec les zones classiques ci-dessus. **Aucune coordonnée numérique** n'est publiée pour ces zones (le client KSRO récent n'est pas cartographié publiquement — voir la note dans [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md)) ; l'accès se fait par portails/NPC. Rapport : [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md).

### 거울 차원 — Dimension Miroir (106+, monstres 111-116)

```
Zone: Dimension Miroir (거울 차원) — champ dimensionnel du Temple de Jupiter
Accès: portail situé HORS des villes ; niveau 106+ requis (wiki officiel TW DiGeam)
       → téléportation en haut de la carte, marche jusqu'à la pierre de
         téléportation du Temple de Jupiter
Monstres: 45 monstres officiels lv 111-116 (statues-gardiennes, lions, griffons,
          minotaures, cultistes de Baal) — liste complète: MONSTERS_DATABASE.md
Unique de champ: 키데모나스 (Kidemonas, lv 120) — ajouté par notice officielle KR le 25/04/2012
Drops: 12차 en raretés épique/légendaire/divin uniquement (pas de 12D "normal")
Sous-zones: 슬픔의 숲 (Forêt de la Tristesse, gardée par les 광신도 116)
```

### Donjons Jupiter (Temple de Jupiter)

```
경배의 전당 (Hall of Worship):    초급 106 (solo, farm sans boss, respawn continu)
                                  중급 111 / 상급 113 (groupe, boss Jupiter/Yuno/Deus)
광신도의 은신처 (Zealots Hideout): 초급 106 (solo) · 중급 116 / 상급 118 (groupe,
                                  boss Baal/Babilion/Zielkiaxe)
Règles: 3 entrées/jour/difficulté · instance 2 h · progression zone par zone
```

### 바그다드 — Bagdad (121-130)

```
Zone: région arabe 이슬람 (121-130) — ville de Bagdad (Tigre, roi 샤리야르), mai 2014
Champ: désert/canyons/oasis 121-130 — monstres NON documentés officiellement
       (vidéos KR de chasse party 2020-2021 : YouTube S34, rapport KO2-WORLD)
Donjons: 바그다드 지하 (groupe, 3×50 min/jour, progression antihoraire —
         boss Grand Démon + Général en chef) · 카일리아의 은신처 (cheffe Kailia)
Chambre des boss 121-130: 2-8 joueurs, 30 min, jusqu'à 10 boss invoqués (ticket)
```

### 파멸의 성전 / 비밀의 무덤 — Legend 23 (125+, 2023)

```
파멸의 성전 (Temple of Destruction): donjon de champ (non instancié), accès NPC
       au palais de Hotan (화전 왕궁) ET à Bagdad ; 3 boss de raid → boss final
       "Squelette de Mort Éveillé" (覺醒死亡駭骨) ; despawn 3 h ; 1 seul final
비밀의 무덤 (Secret Tomb): 1-8 joueurs, 30 min, 3 vagues ; clé obtenue au
       Fire Temple de Shambhala (火焰獄)
```

### 샴발라 — Shambhala (131-140)

```
Zone: Shambhala — "nouvelle carte + nouveaux monstres" (notice officielle KR 27/03/2018,
      cap 140) ; monstres NON documentés officiellement
Accès: NPC "Mortifying Monk" situé au 타클라마칸 (Taklamakan) — même logique de
       portail dimensionnel que la Dimension Miroir (Facebook officiel iSRO)
Donjons: Ice Temple (寒冰獄) 131-135 · Fire Temple (火焰獄) 136-140 (clé du Secret Tomb)
```

> ⚠️ **Lacunes** : niveaux exacts des boss Jupiter/Bagdad/Shambhala non publiés ; HP indisponibles partout (extraction client requise) ; monstres de terrain 121+ non listés officiellement (la gamedata kSRO s'arrête au Jupiter 2011). Détail des donjons : [13_ZONES_OVERVIEW.md — section KSRO](./13_ZONES_OVERVIEW.md).

---

## 👑 Champion/Giant Spawns

### Champions (Elite Monsters)

Champions spawn randomly in regular monster zones and have:
- **~2x HP** of normal monsters (vérifié)
- **Enhanced damage**
- **Better drops** (SOX chance, more gold)
- **Distinctive appearance** (larger, nom jaune)

#### Jangan Area Champions (Level 1-20)
```
Tiger Mountain:
  - Tiger Champion (Level 8-10)
    Spawn: X: 4500-5000, Y: 50-150
  - Mangyang Champion (Level 10-12)
    Spawn: X: 4200-4700, Y: 100-200

Western China:
  - Yeoha Champion (Level 12-15)
    Spawn: X: 3500-4200, Y: 500-1000
```

#### Donwhang Area Champions (Level 20-30)
```
Donwhang Hills:
  - Bandit Champion (Level 22-25)
    Spawn: X: 7500-8500, Y: 2500-3500
  - Bunwang Champion (Level 25-28)
    Spawn: X: 8000-9000, Y: 2800-3800
```

#### Hotan Area Champions (Level 30-40)
```
Hotan Environs:
  - Earth Ghost Champion (Level 32-35)
    Spawn: X: 13500-14500, Y: 4500-5500
  - Kitlin Champion (Level 35-38)
    Spawn: X: 14000-15000, Y: 4800-5800
```

### Giants (Rare Spawns)

Giants are even rarer than Champions with:
- **10-15x HP** of normal monsters
- **Very high damage**
- **Guaranteed rare drops**
- **Giant distinctive model** (much larger)

#### Notable Giants
```
Jangan:
  - Giant Tiger (Level 15)
    Spawn: Tiger Mountain, random
    Drop: SOS 2D guaranteed

Donwhang:
  - Giant Bandit (Level 28)
    Spawn: Bandit Stronghold area
    Drop: SOS 4D, SOM 2D (rare)

Hotan:
  - Giant Earth Ghost (Level 38)
    Spawn: Near Hotan
    Drop: SOS 6D, SOM 4D

Alexandria:
  - Giant Dark Khepri (Level 98)
    Spawn: Delta area
    Drop: SOS 10D, SOM 8D, Nova (rare)
```

---

## 🎯 SP Farming Spots

### Popular SP Farming Locations

#### Bandit Stronghold (Level 30-40)
```
Location: Donwhang Area
Coordinates: X: 8200-8600, Y: 3200-3600

Monsters:
  - Bandit (Level 32-35)
  - Bandit Archer (Level 34-36)
  - Bandit Leader (Level 36-38)

Why SP Farm Here:
  - High monster density
  - Low damage output
  - Good spawn rate
  - Safe for single players

Recommended Gap:
  - Level 40 with masteries at 30
  - Use Garment for speed
  - Bring HP potions
```

#### Shia Geeks (Level 40-50)
```
Location: Near Hotan
Coordinates: X: 13800-14200, Y: 5200-5600

Monsters:
  - Shia Geek (Level 42-45)
  - Shia Toad (Level 44-47)
  - Shia Cobra (Level 46-49)

Why SP Farm Here:
  - Even better density than Bandits
  - Medium damage
  - Great for 50+ gap

Recommended Gap:
  - Level 50 with masteries at 30-35
  - Use Garment
  - Full party for best SP
```

#### Niya Spies (Level 50-60)
```
Location: Tarim Basin
Coordinates: X: 10000-10500, Y: 7000-7500

Monsters:
  - Niya Spy (Level 52-55)
  - Niya Guardian (Level 54-57)
  - Niya Assassin (Level 56-59)

Why SP Farm Here:
  - Best SP per monster
  - Higher but manageable damage
  - Great for 60+ gap

Recommended Gap:
  - Level 60 with masteries at 40
  - 5-6 gap recommended
  - Full party ideal
```

#### Penalty Spots (Level 70-80)
```
Location: Various
Best Spot: Egypt Zone (Level 90+)
Coordinates: X: 17500-18500, Y: 16500-17500

Monsters:
  - Uneg (Level 90-92)
  - Weneg (Level 92-94)
  - Dark Scout (Level 94-96)

Why SP Farm Here:
  - Maximum SP per kill
  - Requires good gear
  - Gap 70+ possible

Recommended Gap:
  - Level 90+ with maxed masteries
  - Full party mandatory
  - SOS/SOM equipment required
```

---

## 🗺️ Leveling Zones

### Progressive Zones by Level

#### Level 1-10: Jangan Area
```
Jangan South Gate:
  - Mangyang (Level 1-3)
  - Yeoha (Level 4-6)

Tiger Mountain Entrance:
  - Small-Eye Ghost (Level 7-9)
  - Big-Eye Ghost (Level 9-10)
```

#### Level 10-20: Western China
```
Karakoram:
  - White Tiger (Level 11-13)
  - Water Ghost (Level 13-15)

Tiger Mountain Deep:
  - Tiger (Level 15-18)
  - Tiger Maid (Level 17-20)
```

#### Level 20-30: Donwhang Area
```
Donwhang Hills:
  - Bandit (Level 22-25)
  - Bunwang (Level 25-28)

Stone Cave:
  - Dungeon B1 (Level 26-29)
  - Dungeon B2 (Level 28-30)
```

#### Level 30-40: Hotan Area
```
Hotan Environs:
  - Earth Ghost (Level 32-35)
  - Kitlin (Level 35-38)

Karakoram Deep:
  - Mangyang Elder (Level 36-39)
```

#### Level 40-50: Central Asia
```
Tarim Basin:
  - Shia Geek (Level 42-45)
  - Shia Toad (Level 44-47)
```

#### Level 50-60: Taklamakan
```
Taklamakan Desert:
  - Niya Spy (Level 52-55)
  - Niya Guardian (Level 54-57)
  - Niya Assassin (Level 56-59)
```

#### Level 60-70: Karakoram (Chine) / Asia Mineure (Europe)
```
Karakoram (données client — famille MOB_KK_*):
  - Spiders: White / Golden / Big White (Level ~59-64)
  - Yeti, Evil Yeti (Level ~59-66)
  - Sona (Level ~63-66)
  - Unique: Isyutaru (Level 60)

Asia Mineure (famille MOB_AM_*):
  - Soil Ghost Bug (61) / Strong Earth Ghost (62) / Earth Ghost Bug (63)
  - Power Earth Ghost (64) / Earth Ghost Warrior (65)
```

#### Level 70-80: Europe
```
Asia Minor:
  - Highwayman (Level 72-75)
  - Outlaw (Level 75-78)
```

#### Level 80-90: Roc Mountain / Egypt (selon version)
```
Roc Mountain:
  - Feather Cloak / Wing Tribe (Level 80+)
  - Shaur, Rocky, Antinoke (Level 82-90)
```

#### Level 90-110: Alexandrie / Egypt (données client vérifiées)
```
Désert d'Alexandrie + Job Temple (MOB_SD_*):
  - Uneg (Level 100)        HP 37,844
  - Weneg (Level 101)       HP 39,605
  - Dark Khepri (Level 101) HP 30,143
  - Dark Scout (Level 102)  HP 31,513
  - Blood Hyena (Level 104) HP 34,364

Qin-Shi Tomb B1-B6 (donjon Jangan):
  - Monstres 76-100 par étage (voir section Qin-Shi Tomb)
```

---

## 👾 Monster Types

### Normal Monsters
- **Spawn rate:** High
- **HP:** Base
- **Damage:** Base
- **Drops:** Common items, gold

### Champion Monsters
- **Spawn rate:** Aléatoire dans les packs de monstres normaux (fréquence exacte non publiée — ~5% rapporté, non vérifié)
- **HP:** **~2x normal** (vérifié, guides communautaires Origin)
- **Damage:** supérieur au normal
- **Drops:** Better items, SOX chance
- **Appearance:** Larger, nom jaune

### Party Monsters (groupe)
- **HP:** **~10x normal** (vérifié communauté)
- Apparaissent en groupes, conçus pour les parties
- **Party giants:** HP encore supérieur (~20x rapporté), les plus durs des monstres réguliers

### Giant Monsters
- **Spawn rate:** Rare (~1% rapporté, non vérifié)
- **HP:** ~5-10x normal (estimations communautaires)
- **Damage:** 2-3x normal
- **Drops:** Rare drops plus fréquents, SOX possible
- **Appearance:** Massive size, nom rouge

### Elite Monsters
- **⚠️ Non vérifié:** l'ancienne description (« 20-30x HP, locations spéciales ») ne correspond pas aux données client — probablement une confusion avec les géants de party ou les variantes d'event Strong/Evil
- **Locations:** Dungeons, special areas

### Unique Monsters
- **Spawn rate:** Un par serveur (ou très peu), timers 3-5h (iSRO)
- **HP:** 598,720 (Tiger Girl) → 1,451,891,045 (Roc)
- **Damage:** Extreme
- **Drops:** Best SOX, massive gold
- **Behavior:** Boss mechanics, special abilities

### Event Monsters
- **Codes `MOB_EV_*`** (ex: Young Bear `MOB_EV_BEAR_A_050`) — events saisonniers
- **Variantes Strong** (ex: Strong Ong lvl 34, 62,959 HP vs 2,099 normal; Strong Tiger Girl `_L2`), **Evil** (`_L3`), **GM's ***
- **Raiders de trade:** bandits/thieves qui spawnent pour attaquer les caravanes pendant les trade runs

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

#### Structure de Données des Spawns

```javascript
// Fichier: data/monster_spawns.json
{
  "spawns": [
    {
      "id": "UNIQUE_TIGER_GIRL",
      "monster_id": "TIGER_GIRL",
      "name": "Tiger Girl",
      "level": 20,
      "type": "UNIQUE",
      "spawn_points": [
        { "x": 4853.28, "y": 93.81, "z": 0 },
        { "x": 4900, "y": 120, "z": 0 }
      ],
      "spawn_timer": {
        "min_hours": 4,
        "max_hours": 8,
        "respawn_type": "TIMER"
      },
      "stats": {
        "hp": 598720,
        "damage": 150,
        "defense": 80
      },
      "drops": [
        { "item_id": "SOS_SWORD_2D", "chance": 0.05 },
        { "item_id": "GOLD", "min": 50000, "max": 100000, "chance": 1.0 }
      ],
      "abilities": ["ROAR_STUN", "AOE_ATTACK"]
    }
  ]
}
```

#### Système de Spawn Dynamique

```javascript
// Gestionnaire de spawns des uniques
class UniqueSpawnManager {
  constructor(serverTime) {
    this.uniques = new Map();
    this.spawnTimers = new Map();
    this.lastDeathTimes = new Map();
  }

  checkRespawns(currentTime) {
    for (const [uniqueId, data] of this.uniques) {
      const lastDeath = this.lastDeathTimes.get(uniqueId);
      if (!lastDeath) continue;

      const hoursSinceDeath = (currentTime - lastDeath) / (1000 * 60 * 60);
      const minHours = data.spawn_timer.min_hours;
      const maxHours = data.spawn_timer.max_hours;

      if (hoursSinceDeath >= minHours && hoursSinceDeath <= maxHours) {
        const spawnChance = this.calculateSpawnChance(hoursSinceDeath, minHours, maxHours);
        if (Math.random() < spawnChance) {
          this.spawnUnique(uniqueId);
        }
      }
    }
  }

  calculateSpawnChance(hoursSince, min, max) {
    // Chance increases with time
    const progress = (hoursSince - min) / (max - min);
    return Math.min(progress * 0.3, 0.5); // Max 50% chance per check
  }

  spawnUnique(uniqueId) {
    const unique = this.uniques.get(uniqueId);
    const spawnPoint = this.randomSpawnPoint(unique.spawn_points);

    const monster = new Monster(unique);
    monster.position.set(spawnPoint.x, spawnPoint.y, spawnPoint.z);

    this.world.addMonster(monster);
    this.broadcastServerMessage(`${unique.name} has spawned!`);

    // Reset death timer on death
    monster.on('death', () => {
      this.lastDeathTimes.set(uniqueId, Date.now());
    });
  }

  randomSpawnPoint(points) {
    return points[Math.floor(Math.random() * points.length)];
  }
}
```

#### Marqueurs sur la Carte

```javascript
// Affichage des spawns sur la carte/minimap
class SpawnMapMarkers {
  renderUniqueSpawns(spawns) {
    spawns.forEach(spawn => {
      if (spawn.type === 'UNIQUE') {
        this.addMarker({
          position: new Vector3(spawn.x, spawn.y, spawn.z),
          icon: 'unique_skull',
          label: spawn.name,
          tooltip: `Level ${spawn.level} Unique`
        });
      }
    });
  }

  renderChampionZones(zones) {
    zones.forEach(zone => {
      if (zone.champion_chance > 0) {
        this.drawArea({
          bounds: {
            min: { x: zone.x_min, y: zone.y_min },
            max: { x: zone.x_max, y: zone.y_max }
          },
          color: 'rgba(255, 215, 0, 0.2)',
          label: `Champion Zone (${zone.chance_chance * 100}%)`
        });
      }
    });
  }
}
```

#### Notifications de Spawn

```javascript
// Système de notification quand un unique spawn
class UniqueSpawnNotifier {
  onUniqueSpawn(unique) {
    // Notify all players
    this.broadcastToWorld({
      type: 'UNIQUE_SPAWNED',
      unique: {
        id: unique.id,
        name: unique.name,
        level: unique.level,
        position: unique.position
      }
    });

    // Add marker to minimap
    this.minimap.addSpecialMarker(unique.position, 'unique', unique.name);

    // Log for debugging
    console.log(`[Unique Spawn] ${unique.name} at (${unique.position.x}, ${unique.position.y})`);
  }

  onUniqueDeath(unique, killers) {
    this.broadcastToWorld({
      type: 'UNIQUE_KILLED',
      unique: unique.id,
      killers: killers.map(k => k.name)
    });

    // Set respawn timer
    this.scheduleRespawn(unique);
  }
}
```

---

## 📊 Statistiques de Spawn

### Taux de Spawn par Type

| Monster Type | Spawn Rate | HP Multiplier | SOX Chance |
|--------------|------------|---------------|------------|
| Normal | Majorité | 1x | ~0.01% (possible mais très rare) |
| Champion | ~5% (rapporté) | ~2x | faible |
| Party | par packs | ~10x | faible |
| Giant | ~1% (rapporté) | ~5-10x | plus élevée |
| Party Giant | rare | ~20x (rapporté) | élevée |
| Unique | Timed (3-5h) | 598K → 1.45Md | Best (SOS ~5-10% rapporté) |

### Distribution des Zones

| Zone | Level Range | Monster Density | Champion Rate |
|------|-------------|-----------------|---------------|
| Jangan Areas | 1-20 | High | 3% |
| Donwhang Areas | 20-30 | High | 4% |
| Hotan Areas | 30-40 | Medium | 5% |
| Central Asia | 40-50 | Medium | 5% |
| Taklamakan | 50-60 | Low | 6% |
| Europe | 60-80 | Medium | 7% |
| Egypt | 80-100 | High | 8% |
| Alexandria | 90-110+ | Very High | 10% |

---

## 🎯 Prochaines Étapes

1. **Coordonnées Précises:**
   - Extraction systématique via xSROMap
   - Validation in-game
   - Documentation des variations serveur

2. **Système de Spawn:**
   - Implémentation des timers
   - Gestion des respawns
   - Notification des joueurs

3. **Optimisation:**
   - Streaming des zones
   - Culling des monstres lointains
   - Optimisation du pathfinding

---

*Dernière mise à jour: 1 Octobre 2026*

*Sources: xSROMap, silkroadonline.wiki (données client), rev6, elitepvpers, mmorpg.com (Qin-Shi Tomb), Monster Area Wiki, Community Guides*
*Fusion multilingue 2026-10: [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) (timers de spawn par unique, Qin-Shi B6, validation HP) · [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) (gardiens B5 nommés, skills Medusa) · [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) (conflit spawn 4h/6h) · [RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md) · rapports KO2 (section 🇰🇷 zones de spawn KSRO 106-140 : Dimension Miroir, donjons Jupiter, Bagdad, Shambhala)*
