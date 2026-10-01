# 🗺️ Référence des Coordonnées Carte — POI et Points d'Intérêt

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Références techniques](MAP_COORDINATES_REFERENCE.md)

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Système de Coordonnées Officiel](#-système-de-coordonnées-officiel)
- [Villes Principales](#-villes-principales)
- [Portails et Téléporteurs](#-portails-et-téléporteurs)
- [Ferries et Voie Maritime](#-ferries-et-voie-maritime)
- [Fortress War — Forteresses](#-fortress-war--forteresses)
- [Zones de Chasse et Uniques](#-zones-de-chasse-et-uniques)
- [Dungeons et Instances](#-dungeons-et-instances)
- [Zones Spéciales](#-zones-spéciales)
- [Routes de Trading](#-routes-de-trading)
- [Notes de Développement](#-notes-de-développement)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 📚 Introduction

Ce document fournit la **référence complète des coordonnées** pour tous les points d'intérêt majeurs de Silkroad Online : villes, téléporteurs, ferries, forteresses, donjons, spawns d'uniques.

> ⚠️ **Refonte 2026-10 :** toutes les coordonnées de ce fichier sont désormais issues du **client officiel** (extraction de la base xSROMap : 697 NPCs, 161 téléporteurs, formule de conversion du client). Les anciennes valeurs estimées (« Jangan 2000/1000 », « Alexandria 18000/18000 », etc.) étaient **erronées** et ont été remplacées.

---

## 📐 Système de Coordonnées Officiel

### Format interne du client
Le client Silkroad utilise le format **`Region / X / Y / Z`** :
- `Region` : identifiant du secteur de **192 × 192 unités** — calculé `(ySector << 8) | xSector`
- `X`, `Y` : position **locale** dans le secteur (0 à 1 920, en dixièmes d'unité)
- `Z` : altitude (étages des grottes : ex. Stone Cave 1F = 0, 2F = 115, 3F = 230, 4F = 345)

### Conversion en coordonnées monde (PosX/PosY)
```
PosX = ((Region & 0xFF) - 135) × 192 + X / 10      → augmente vers l'EST
PosY = ((Region >> 8)  - 92) × 192 + Y / 10        → augmente vers le NORD
```

### Exemple
Jangan, Storage-Keeper Sansan : Region 25000, X 634, Y 1394
→ PosX = (168 − 135) × 192 + 63,4 = **6 433** ; PosY = (97 − 92) × 192 + 139,4 = **1 099**

### Bornes du monde
- Le monde couvre 256 × 256 secteurs = **49 152 × 49 152 unités**
- PosX ∈ [−25 920, +23 040] · PosY ∈ [−25 920, +23 040]
- Les **régions > 32767** (négatives en signé) sont des **couches de donjon** (coordinate space séparé)

### Repères cardinaux
| Direction | Effet |
|-----------|-------|
| **PosX ↑** | vers l'Est (Chine) |
| **PosX ↓** | vers l'Ouest (Europe, Égypte) |
| **PosY ↑** | vers le Nord (Samarkand, Donwhang) |
| **PosY ↓** | vers le Sud (Hotan, Alexandria, déserts) |

---

## 🏯 Villes Principales

| Ville | Région | PosX (centre) | PosY (centre) | Niveaux | Remarques |
|-------|--------|---------------|---------------|---------|-----------|
| **Jangan** | China | ≈ 6 460 | ≈ 1 100 | 1-20 | Départ chinois |
| **Donwhang** | Western China | ≈ 3 550 | ≈ 2 050 | 20-35 | Stone Cave à proximité |
| **Hotan** | Oasis Kingdom | ≈ 115 | ≈ 50 | 30-60 | Sert CH + EU |
| **Samarkand** | Central Asia | ≈ −5 180 | ≈ 2 890 | 30-45 | Sert CH + EU |
| **Constantinople** | East Europe | ≈ −10 680 | ≈ 2 600 | 1-20 (EU) | Départ européen |
| **Alexandria (South)** | Egypt | ≈ −16 600 | ≈ −300 | 100+ | Marché principal |
| **Alexandria (North)** | Egypt | ≈ −16 200 | ≈ 50 | 100+ | Palais, jobs, port |
| **Thief Town** | (cachée, Est) | ≈ 9 130 | ≈ 860 | 20+ (thieves) | Village des voleurs |
| **Baghdad** | Arabia | ≈ −8 540 | ≈ −730 | 115+ | Post-classique (Legend VIII+) |

### Emprises urbaines approximatives (PosX × PosY)

| Ville | Emprise |
|-------|---------|
| Jangan | 6 170 à 6 670 × 960 à 1 310 |
| Donwhang | 3 470 à 3 630 × 1 950 à 2 290 |
| Hotan | 15 à 320 × 0 à 470 |
| Samarkand | −5 370 à −5 000 × 2 700 à 3 010 |
| Constantinople | −11 170 à −10 380 × 2 330 à 2 940 |
| Alexandria (S+N) | −16 760 à −15 995 × −480 à 440 |
| Baghdad | −8 810 à −8 210 × −1 100 à −440 |

---

## 🚪 Portails et Téléporteurs

### Réseau de Dimensional Gates (inter-villes)

| # | Gate (ville) | Position | Destinations |
|---|--------------|----------|--------------|
| 1 | **Jangan** | (6 461, 1 097) | Donwhang · Alexandria (S) · Alexandria (N) |
| 2 | **Donwhang** | (3 552, 2 113) | Jangan · Hotan |
| 3 | **Hotan** | (113, 49) | Donwhang · Samarkand · Alexandria (S) · Alexandria (N) · Baghdad |
| 4 | **Samarkand** | (−5 184, 2 891) | Constantinople · Hotan |
| 5 | **Constantinople** | (−10 682, 2 585) | Samarkand |
| 6 | **Alexandria (South)** | (−16 643, −275) | Jangan · Hotan · Alexandria (N) · Baghdad |
| 7 | **Alexandria (North)** | (−16 148, 76) | Jangan · Hotan · Alexandria (S) · Baghdad |
| 8 | **Baghdad** | (−8 538, −707) | Hotan · Alexandria (S) · Alexandria (N) |

**Coûts (iSRO classique) :** ≈ **5 000 gold** par trajet ; tarif réduit (~10 gold) pour les personnages **< niveau 20**. Variable selon serveurs.

### Gates internes d'Alexandria (Égypte)

| Gate | Position | Destination |
|------|----------|-------------|
| Dimensional Gate (Delta Area) | (−15 122, 126) | Storm and Cloud Desert |
| Dimensional Gate (Delta Area) | (−15 842, −1 205) | Kings Valley |
| Dimensional Gate (Kings Valley) | (−14 950, −3 266) | Forbidden Plain |
| Dimensional Gate (abundance) | (−13 391, −1 344) | Abundance Ground |
| Dimensional Gate (Pharaoh tomb) | (−11 351, −3 278) | Job Temple (beginner/intermediate/advanced) |

### Gates de zone (Est / Roc Mountain)

| Gate | Position | Destination |
|------|----------|-------------|
| Gate of Ruler | (−4 612, −1) | Roc Mountain |
| Gate « RC Roc » | (10 471, 1 810) | Roc Mountain (portal interne) |
| Mortifying Monk (Shambhala Entrance) | (−593, 2 595) | Sky Temple (post-classique) |

### Téléporteurs de garde (Jangan)
Soldier Choiyoung (6 437, 1 150) · Jingyo (6 429, 963) · Hogang (6 177, 1 155) · Sangnam (6 667, 1 137) — navettes inter-portes.

### Téléporteur Thief Town
- **Soldier Kartino** (Constantinople, (−10 495, 2 473)) → Thief Town
- **Téléporteur au sol** (2 485, 2 679) → Thief Town

---

## ⛴️ Ferries et Voie Maritime

### Ferries fluviaux (région de Jangan)

| Liaison | Vendeurs (positions) |
|---------|----------------------|
| **Doji ↔ Tayun** | (5 028, 1 136) ↔ (5 043, 1 664) — traversée N-S à l'ouest de Jangan |
| **Chau ↔ Hageuk** | (4 449, 929) ↔ (4 124, 1 189) — traversée E-O |

### Voie maritime Europe ↔ Égypte (Méditerranée)

| Escale | Position |
|--------|----------|
| **Harbor Manager Gale** (port européen) | (−11 424, 1 162) |
| **Pirate Morgun** (escale) | (−8 699, 2 203) |
| **Priate Blackbeard** (escale) | (−8 700, 1 828) |
| **Harbor Manager Marwa** (Alexandria North) | (−16 542, 372) |

*NB : le port de Constantinople (Harbor Manager Georion, (−10 408, 2 503)) est le point d'origine historique/thématique de la ligne.*

---

## 🏰 Fortress War — Forteresses

### Jangan Fortress
| Élément | Position |
|---------|----------|
| Portes I / II / III | (6 159, 54) · (6 348, 50) · (6 609, 52) |
| Clerk (en ville) | Jangan Fortress Clerk (6 493, 1 264) |
| Garnison | Jangan Blacksmith, Jangan Trainer, Jangan Combat Assistant, Jangan Fortress Administrator |
| Intérieur (instance) | ≈ (−12 560 à −11 780, −4 760) |
| Gates internes FW | Gate of Charge (−12 610, −4 132) · Gate of Glory (−12 048, −4 756) · Gate of Resurrection (−12 208, −4 269) → Jangan |

### Bandit Fortress (forteresse des thieves)
| Élément | Position |
|---------|----------|
| Portes I / II / III | (5 396, 115) · (5 433, −13) · — |
| Garnison | Bandit Blacksmith, Bandit Combat Assistant, Bandit Fortress Administrator |
| Intérieur (instance) | ≈ (−11 060 à −10 460, −4 100) |
| Gates internes FW | Charge (−10 602, −4 333) · Glory (−10 899, −4 088) · Resurrection (−10 742, −4 741) → Jangan |

### Hotan Fortress
| Élément | Position |
|---------|----------|
| Portes I / II / III / IV | (−133, 773) · (38, 813) · (181, 856) · (intérieur) |
| Clerk (en ville) | Hotan Fortress Clerk (15, 465) |
| Garnison | Hotan Blacksmith, Hotan Trainer, Hotan Combat Assistant, Hotan Fortress Administrator |
| Intérieur (instance) | ≈ (−12 670 à −12 095, −6 610) |
| Gates internes FW | Charge (−12 789, −6 335) · Glory (−11 917, −6 300) · Resurrection (−12 125, −6 331) → Hotan |

### Eastern Europe Fortress (Constantinople)
| Élément | Position |
|---------|----------|
| Portes I / II / III | (−11 099, 1 747) · (−11 127, 2 017) · (−11 167, 1 549) |
| Clerk (en ville) | Eastern Europe Fortress Clerk (−10 778, 2 793) |
| Garnison | Eastern Europe Blacksmith, Trainer, Combat Assistant, Fortress Administrator |
| Intérieur (instance) | ≈ (−8 330 à −8 374, −5 490 à −6 060) |
| Gates internes FW | Charge (−7 770, −5 443) · Glory (−8 357, −5 868) · Resurrection (−7 749, −5 849) → Constantinople |

> **Gate of Charge** = entrée attaquants · **Gate of Glory** = entrée défenseurs · **Gate of Resurrection** = sortie/revival vers la ville. Les « Castle Gate Pulleys » (tracts de porte) jalonnent les intérieurs.

---

## 🎯 Zones de Chasse et Uniques

### Spawns officiels des 7 uniques classiques (iSRO)

| Unique | Niv. | HP | Zone | Points de spawn (PosX/PosY) |
|--------|------|----|------|------------------------------|
| **Tiger Girl** | 18 | 598 720 | China — Tiger Mountain / Bandit Stronghold | 4853/94 · 4733/−34 · 4840/−123 · 5039/−28 · 4230/201 · 4418/599 · 4744/414 · 5335/360 · 5355/−224 · 4544/−303 · 4309/−151 |
| **Cerberus** | 24 | 693 072 | East Europe — Desperado Hill, Forest of Dusk, Garden of Gods | −12483/2029 · −11739/2225 · −12355/1535 · −12070/1535 · −12488/1297 · −11811/1313 · −11852/1766 · −11673/1665 · −12421/1822 · −11444/2195 · −11607/1986 · −11332/2008 · −11372/1778 |
| **Captain Ivy** | 30 | 1 094 835 | Asia Minor — Cleopatra's Gate, Amphitheater, Haran's Tower | −6425/2745 · −6416/2706 · −6931/1670 · −6933/1834 · −6807/1265 · −7587/1229 · −6391/1252 · −7039/2612 |
| **Uruchi** | 40 | 1 779 528 | Oasis Kingdom — Tarim Basin (Black Robber Den, Tarim Ferry) | 2698/120 · 2695/−113 · 2515/−120 · 2495/104 · 2046/840 · 2317/617 · 2580/513 · 3170/−15 · 2588/−367 · 2041/351 · 2618/747 |
| **Isyutaru** | 60 | 4 324 612 | Karakoram — centre + Ancient Remains | −1552/−94 · −1291/−133 · −1275/−409 · −1540/−357 · −2162/249 · −2206/−1044 · −1837/−1131 · −860/−1104 · −1041/315 · −1408/462 · −1858/−123 |
| **Lord Yarkan** | 80 | 9 353 045 | Taklamakan — Niya Remains | −1559/2550 · −1558/2555 · −1562/2555 · −1563/2551 · −1559/2549 · −1560/1858 · −545/2510 · 50/2449 · −1178/2144 · −16/2006 |
| **Demon Shaitan** | 90 | 12 732 060 | Roc Mountain — Heart/Claw/Wing Peak | −4509/−468 · −4829/−519 · −4179/−262 · −4917/−225 · −4294/141 · −4588/215 |

### 🈶 Noms ZH/KR des zones d'uniques (✅ recherche ZH/KO 2026-10)

Noms des zones de spawn cités par les sources chinoises officielles (wiki DiGeam, Bahamut) et la presse coréenne — utiles pour croiser les cartes communautaires TW/KR :

| Unique | Zones — noms chinois cités | Noms coréens cités |
|---|---|---|
| Tiger Girl (虎女) | 虎穴山 (mont du repaire aux tigres), 飞贼团山寨 (fort des bandits) | 호혈산 (« mont du sang-de-tigre ») |
| Cerberus (克贝洛斯) | 神的庭院 (Garden of Gods), 无法者的山坡 (Desperado Hill), 黄昏的树林 (Forest of Dusk), 黎明的海岸 | — |
| Captain Ivy (艾维船长) | 小亚细亚 (Asia Minor), 克利奥派特拉门 (Cleopatra's Gate), 邪恶之灵要塞 | — |
| Uruchi (乌鲁齐) | 塔里木盆地 (Tarim Basin), 死亡溪谷, 黑漠团巢穴 (Black Robber Den) | 타림분지 (bassin du Tarim) |
| Isyutaru (冰神之女) | 卡拉昆仑古代遗迹 (Ancient Remains), 绿洲 (oasis), 蜘蛛树林 (forêt aux araignées) | 카라코람 (lacs de glace) |
| Lord Yarkan (路亚汗) | 塔克拉玛干 (Taklamakan), 尼雅遗址 (ruines de Niya) | — |
| Demon Shaitan (撒旦) | 洛克山, 心脏之峰 / 利爪之峰 / 翅膀之峰 (Heart/Claw/Wing Peak), 羽毛之峰 / 尖嘴之峰 / 雷峰 | — |

- **Roc Mountain (로크산) côté KR** : 양치기/버려진 마을 (villages berger/abandonné, 82-84) · 눈·심장·날개·부리의 봉우리 (pics œil/cœur/aile/bec, 85-87) · 정상의 로키 (sommet du Roc, 88-90).
- **Qin-Shi Tomb** : 秦始皇陵 (ZH) / 진시황릉 (KR) ; **Thief Town** : 盗贼村 (ZH).
- Sources : [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) · [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md)

### Emplacements des uniques ultérieurs

| Unique | Niv. | Zone / accès |
|--------|------|--------------|
| **Medusa** | 105 | Égypte, ère Legend V (contenu du Temple) |
| **Tomb General** | ~90+ | Tomb of Qin-Shi Emperor |
| Boss Jupiter (Uniques du Temple) | 110-120 | Temple of Jupiter |

### Zones de chasse classées par plage de niveaux

| Zone | Plage | Emplacement approx. |
|------|-------|---------------------|
| China (Tiger Mountain, Bandit Stronghold) | 1-20 | (4 200-5 400, −300-600) |
| Western China (Earth Ghosts, fermes) | 20-35 | (2 500-3 600, 1 300-2 100) |
| East Europe (bois de Constantinople) | 1-24 | (−11 300 à −12 500, 1 300-2 200) |
| Asia Minor | 20-30 | (−6 400 à −7 600, 1 200-2 750) |
| Central Asia (Ongs, Huns, Golems) | 30-45 | autour de Samarkand (−5 200, 2 900) |
| Tarim Basin (Ong Habitat — SP farming) | 30-45 | (2 000-3 200, −400-850) |
| Karakoram | 45-60 | (−800 à −2 200, −1 050-460) |
| Taklamakan | 60-80 | (−1 600 à 0, 1 850-2 600) |
| Roc Mountain | 75-90 | (−4 200 à −4 900, −520-220), entrée Gate of Ruler (−4 612, −1) |
| Égypte (Delta, déserts, Kings Valley) | 100-110 | (−11 400 à −16 700, −3 300-130) |

---

## 🏰 Dungeons et Instances

| Donjon / Instance | Entrée (monde) | Niveaux | Structure client |
|-------------------|----------------|---------|------------------|
| **Donwhang Stone Cave** | extérieur de Donwhang (Western China) | ~26-70 | 4 étages (Z 0/115/230/345), couche 32769 |
| **Tomb of Qin-Shi Emperor** | (7 200, 2 086) — NE de Jangan | 71-100 | B1-B6 (couches 32770-32775), Tomb General |
| **Job Temple** (« Pharaoh Tomb ») | (−11 351, −3 278) — Égypte | 105+ (job suit requis) | Temple + Sanctuaires Anubis/Isis/Haroeris/Seth/Blue Eye (couches 32779-32784), difficultés Beginner/Intermediate/Advanced |
| **Cave of Meditation** | générée en Fortress War | — | couche 32785 |
| **Flame Mountain** (Forgotten World) | portails dédiés | 100+ | couche 32786 |
| **Temple of Jupiter** | (13 138, −972) — continent Est | 110-120 | Earth's/Yuno's/Jupiter's Rooms + Zealots Hideout (couches 32787-32790) |
| **Kalia's Hideout** | Arabie | 120+ | couche 32793 |
| **Zone Forgotten World** (instances) | coins de carte (PosX 17 000-21 700, PosY 3 700-6 700) | 100+ | Pillars of Party Recall, Dungeon Exits, « Lost Soldiers » |

---

## 🌟 Zones Spéciales

| Zone | Position / accès | Notes |
|------|------------------|-------|
| **Thief Town** | NPCs à (9 088-9 166, 808-906) ; téléporteur au sol (2 485, 2 679) ; Soldier Kartino (Constantinople) | Stolen Goods Dealer, Thief Associate, Black Robber Band, Tiger Bandit Band, Vicious Desperado, Windy Phantom Thief |
| **Bandit Fortress** (thief hub) | portes (5 396-5 433, −13-115) | Forteresse FW capturable par des guildes de thieves |
| **Mirror Dimension** | rift à (−12 331, 1 143) | Zone spéciale (post-classique) |
| **Original World** | rift à (12 880, −39) | Retour depuis zones Est |
| **Arena / Survival Arena** | Arena Managers en ville | PvP en équipe |
| **Avant-postes (Outposts)** | ex. Tarim Outpost (131, 1 318-1 331), poste ouest Donwhang (2 545-2 550, 2 098-2 109), Asia Minor (−9 500 à −6 700), Central Asia (−8 500/−6 700) | Quest hubs militaires |

---

## 🐪 Routes de Trading

### Distances indicatives (à vol d'oiseau, PosX/PosY)

| De → À | Distance approx. | Danger | Notes |
|--------|------------------|--------|-------|
| Jangan → Donwhang | ~3 400 | ⭐⭐ | ferry + route, débutants |
| Donwhang → Hotan | ~3 600 | ⭐⭐⭐ | traverse le Tarim (Uruchi) |
| Hotan → Samarkand | ~5 400 | ⭐⭐⭐⭐ | via Karakoram (Yetis) |
| Samarkand → Constantinople | ~5 500 | ⭐⭐⭐⭐ | via Asia Minor |
| Hotan → Alexandria | ~16 500 | ⭐⭐⭐⭐⭐ | déserts + Égypte (ou téléporteur) |
| Jangan → Constantinople | ~17 100 | ⭐⭐⭐⭐⭐ | traversée complète du monde |

> Ces distances sont calculées sur les PosX/PosY officiels des centres-villes. Les routes réelles (chemins, reliefs, ferries) sont plus longues.

### Waypoints des gates (téléporteurs) — pour navigation
Voir la section [Portails et Téléporteurs](#-portails-et-téléporteurs) : les 8 Dimensional Gates forment le graphe de navigation inter-villes.

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

```javascript
// Conversion coordonnées client → monde (implémentation officielle)
function regionToWorld(region, x, y) {
  const r = region < 0 ? region + 65536 : region;   // gestion signé
  const posX = ((r & 0xff) - 135) * 192 + x / 10;
  const posY = (((r >> 8) & 0xff) - 92) * 192 + y / 10;
  return { posX, posY };
}

// Conversion inverse (monde → client)
function worldToRegion(posX, posY) {
  let x = Math.round(Math.abs(posX) % 192 * 10);
  if (posX < 0) x = 1920 - x;
  let y = Math.round(Math.abs(posY) % 192 * 10);
  if (posY < 0) y = 1920 - y;
  const xSector = Math.round((posX - x / 10) / 192 + 135);
  const ySector = Math.round((posY - y / 10) / 192 + 92);
  return { region: (ySector << 8) | xSector, x, y, z: 0 };
}

// Exemples de zones (bounds en PosX/PosY)
const ZONES = {
  JANGAN_CITY:   { min: [6170, 960],  max: [6670, 1310], safe: true,  levels: [1, 20] },
  DONWHANG_CITY: { min: [3470, 1950], max: [3630, 2290], safe: true,  levels: [20, 35] },
  HOTAN_CITY:    { min: [15, 0],      max: [320, 470],   safe: true,  levels: [30, 60] },
  SAMARKAND_CITY:{ min: [-5370,2700], max: [-5000,3010], safe: true,  levels: [30, 45] },
  CONSTANTINOPLE:{ min: [-11170,2330],max: [-10380,2940],safe: true,  levels: [1, 20] },
  ALEXANDRIA:    { min: [-16760,-480],max: [-15995,440], safe: true,  levels: [100, 110] },
  TIGER_MOUNTAIN:{ min: [4200, -300], max: [5400, 600],  safe: false, levels: [1, 20] },
  TARIM_BASIN:   { min: [2000, -400], max: [3200, 850],  safe: false, levels: [30, 45] },
  KARAKORAM:     { min: [-2200,-1050],max: [-860, 460],  safe: false, levels: [45, 60] },
  TAKLAMAKAN:    { min: [-1600,1850], max: [50, 2600],   safe: false, levels: [60, 80] },
  ROC_MOUNTAIN:  { min: [-4900, -520],max: [-4180, 220], safe: false, levels: [75, 90] },
  ASIA_MINOR:    { min: [-7600,1200], max: [-6390,2750], safe: false, levels: [20, 30] },
  EGYPT:         { min: [-16700,-3300],max: [-11400,130],safe: false, levels: [100,110] },
};
```

### Graphe de téléportation (pour pathfinding)
```javascript
const TELEPORT_GRAPH = {
  Jangan:         ['Donwhang', 'AlexandriaS', 'AlexandriaN'],
  Donwhang:       ['Jangan', 'Hotan'],
  Hotan:          ['Donwhang', 'Samarkand', 'AlexandriaS', 'AlexandriaN', 'Baghdad'],
  Samarkand:      ['Constantinople', 'Hotan'],
  Constantinople: ['Samarkand'],
  AlexandriaS:    ['Jangan', 'Hotan', 'AlexandriaN', 'Baghdad'],
  AlexandriaN:    ['Jangan', 'Hotan', 'AlexandriaS', 'Baghdad'],
  Baghdad:        ['Hotan', 'AlexandriaS', 'AlexandriaN'],  // retirer en cap 90/110
};
```

### Méthode de collecte
1. **xSROMap** (https://jellybitz.github.io/xSROMap/) — double-clic sur la carte = PosX/PosY/Region affichés ; données source sur GitHub (JellyBitz/xSROMap, `assets/js/main.js`)
2. **Données client** — tables `_RefRegion`, `_RefNpc` des bases d'émulateurs (vSRO/SilkroadDoc)
3. **Cross-validation** — listes de spawns communautaires (SRO Info 2009, Rev6)

---

## ❓ FAQ

**Q: Pourquoi les coordonnées ont-elles toutes changé dans cette refonte ?**
R: Les anciennes valeurs étaient des estimations inventées. Les nouvelles sont les **PosX/PosY officiels du client**, convertis depuis les Region IDs (formule documentée plus haut).

**Q: Comment retrouver une coordonnée sur la carte ?**
R: Sur xSROMap, double-cliquez sur le point voulu : la popup affiche `PosX / PosY / Region`.

**Q: Les spawns d'uniques sont-ils fixes ?**
R: Chaque unique possède une **liste de points de spawn possibles** (tableaux ci-dessus) et choisit aléatoirement ; le timer de respawn varie selon serveur (classiquement plusieurs heures).

**Q: Les forteresses intérieures ont des coordonnées étranges (négatives, loin de la ville) ?**
R: Oui — les intérieurs de forteresse et tous les donjons sont des **couches séparées** (Region > 32767) avec leur propre espace de coordonnées. Seules les **portes d'accès** sont sur la carte du monde.

---

## 🔗 Resources

- [xSROMap — carte interactive + données source](https://jellybitz.github.io/xSROMap/)
- [JellyBitz/xSROMap — dépôt GitHub (main.js : 697 NPCs, 161 TPs)](https://github.com/JellyBitz/xSROMap)
- [SRO Info — Unique spawn maps + coords (2009)](https://sroinfo.forumotion.com/t9-map-unique-spawn-map-cords)
- [Rev6 — All Unique Spawn Points](https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari)
- [StrategyWiki — Silkroad Online/Locations](https://strategywiki.org/wiki/Silkroad_Online/Locations)
- Docs internes : [NPCS_COORDINATES.md](NPCS_COORDINATES.md) · [13_ZONES_OVERVIEW.md](13_ZONES_OVERVIEW.md) · [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md)

---

## 🎯 Prochaines Étapes

1. **Validation croisée** des bounds de zones par extraction des tiles du client
2. **Extraction des spawns de monstres normaux** (_RefNpc / Nest) au même format
3. **Pathfinding A*** sur le graphe téléporteurs + routes
4. **Couches de donjons** : implémenter le changement de couche (Region > 32767) avec coordonnées locales

---

*Dernière mise à jour : 2026-10-01*

*Sources : client officiel via xSROMap (JellyBitz), SRO Info (spawns uniques 2009), Rev6, StrategyWiki, SRObro Project*
*Fusion multilingue 2026-10 : [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) (noms ZH des zones d'uniques) · [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) (noms KR, sous-zones Roc Mountain)*
