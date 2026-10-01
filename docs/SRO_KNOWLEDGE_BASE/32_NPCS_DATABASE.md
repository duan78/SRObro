# 🗂️ Base de données NPCs — Hub Central

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Technique](HUB_TECHNIQUE.md) → [NPCs Database](32_NPCS_DATABASE.md)

---

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Référence Rapide](#-référence-rapide)
- [NPCs par Ville](#-npcs-par-ville)
- [Catégories de NPCs](#-catégories-de-npcs)
- [NPCs avec Coordonnées](#-npcs-avec-coordonnées)
- [Recherche par Type](#-recherche-par-type)
- [Recherche par Level Range](#-recherche-par-level-range)
- [Implémentation Technique](#-implémentation-technique)
- [Guide d'Interaction](#-guide-dinteraction)
- [FAQ](#-faq)

---

## 🎯 Introduction

Cette page centrale référence **toutes les ressources NPCs** du projet SRObro.

### Points Clés
- 👤 **~322 NPCs urbains** documentés (sur **697 NPCs** au total dans la base client extraite de xSROMap)
- 📍 **Coordonnées PosX/PosY officielles** pour chaque NPC (système client converti)
- 🏰 **8 villes** couvertes : Jangan, Donwhang, Hotan, Samarkand, Constantinople, Alexandria (S+N), Thief Town, Baghdad
- 🎮 **Essentiel pour** le développement SRObro (spawns, interactions, shops)

> ⚠️ **Refonte 2026-10 :** refonte complète des données NPCs — noms officiels du client, coordonnées réelles PosX/PosY, suppression des NPCs/prix inventés des versions précédentes. Les numéros de lignes ci-dessous sont indicatifs.

---

## 📚 Référence Rapide

### Bases de Données Principales

| Fichier | Contenu | Statut |
|---------|---------|--------|
| **[NPCS_COORDINATES.md](NPCS_COORDINATES.md)** | **NPCs avec coordonnées X/Y par ville** ⭐ | Refondu 2026-10 |
| **[NPCS_DATABASE.md](NPCS_DATABASE.md)** | Référence fonctionnelle (rôles/services) | Refondu 2026-10 |
| **[CITIES_01_JANGAN.md](CITIES_01_JANGAN.md)** | Guide Jangan (55 NPCs) | Refondu 2026-10 |
| **[CITIES_02_DONWHANG.md](CITIES_02_DONWHANG.md)** | Guide Donwhang (47 NPCs) | Refondu 2026-10 |
| **[CITIES_03_HOTAN.md](CITIES_03_HOTAN.md)** | Guide Hotan (32 NPCs) | Refondu 2026-10 |
| **[CITIES_04_ALEXANDRIA.md](CITIES_04_ALEXANDRIA.md)** | Guide Alexandria (46 NPCs + quêtes) ⭐ | Refondu 2026-10 |
| **[CITIES_05_CONSTANTINOPLE.md](CITIES_05_CONSTANTINOPLE.md)** | Guide Constantinople (48 NPCs) ⭐ | Refondu 2026-10 |
| **[MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md)** | Téléporteurs, ferries, uniques | Refondu 2026-10 |

### Source primaire des données
- **xSROMap v1.4** (https://jellybitz.github.io/xSROMap/) — dépôt GitHub `JellyBitz/xSROMap`, fichier `assets/js/main.js` (697 NPCs + 161 téléporteurs)
- Conversion : `PosX = ((Region & 0xFF) − 135) × 192 + X/10` · `PosY = ((Region >> 8) − 92) × 192 + Y/10`

---

## 🏰 NPCs par Ville

### Jangan (Level 1-20) — China — ≈ (6 460, 1 100)

👉 **[CITIES_01_JANGAN.md](CITIES_01_JANGAN.md)** — 55 NPCs documentés

**NPCs clés :**
- **Blacksmith Chulsan** (6 369, 1 101) — armes/armures 1D-3D
- **Protector Trader Mrs Jang** · **Grocery Trader Jinjin** · **Specialty Trader Jodaesan**
- **Storage-Keeper Sansan/Wangu** · **Stable-Keeper Machun** · **Guild Manager Leebaek**
- **Jobs :** Merchant Associate Hwajung / Hunter Associate Gwakwi / **Smuggler Chao** (caché)
- **Gardes téléporteurs :** Choiyoung, Jingyo, Hogang, Sangnam
- **Quartier Gisaeng** (6 NPCs Gisaeng) + casino/loterie

---

### Donwhang (Level 20-35) — Western China — ≈ (3 550, 2 050)

👉 **[CITIES_02_DONWHANG.md](CITIES_02_DONWHANG.md)** — 47 NPCs documentés

**NPCs clés :**
- **Blacksmith Agol** (3 576, 2 042) — 3D-5D
- **Grocery Trader Yeosun** · **Specialty Shop Elder Leegak** · **Herbalist Bori**
- **Storage-Keeper Irina/Paedo** · **Stable-Keeper Makgo** · **Guild Manager Ryukang**
- **Jobs :** Merchant Associate Leegeuk / Hunter Associate Haraho / **Smuggler Chungho** (caché)
- Temple bouddhiste (3 Priests), avant-postes militaires aux alentours

---

### Hotan (Level 30-60) — Oasis Kingdom — ≈ (115, 50)

👉 **[CITIES_03_HOTAN.md](CITIES_03_HOTAN.md)** — 32 NPCs documentés

**NPCs clés :**
- **Blacksmith Soboi** (50, 77) — 5D-8D
- **Potion Merchant Manina** · **Specialty Trader Sanmok** · **Nephrite Refiner Pahap**
- **Ville des deux races :** China + Europe suppliers (Dae-Pyeong/Shadi, Ryoe-Ju/David)
- **Jobs :** Merchant Associate Asaman / Hunter Associate Ahmok / **aucun thief**
- **Hotan Fortress Clerk** (15, 465)

---

### Samarkand (Level 30-45) — Central Asia — ≈ (−5 180, 2 890)

👉 **[NPCS_COORDINATES.md — Samarkand](NPCS_COORDINATES.md#-samarkand-npcs)** — 34 NPCs documentés

**NPCs clés :**
- **Weapon Trader Tricia** (−5 200, 2 961) · **Protector Trader Aryoan**
- **Storage-Keeper Saesa** · **Stable-Keeper Hoyun** · **Guild Manager Hapsa**
- **Jobs :** Merchant Associate Karen / Hunter Associate Shahad / **Smuggler Barus**
- Nun Martel, avant-postes d'Asia Minor/Central Asia aux alentours

---

### Constantinople (Level 1-20 EU) — East Europe — ≈ (−10 680, 2 600)

👉 **[CITIES_05_CONSTANTINOPLE.md](CITIES_05_CONSTANTINOPLE.md)** — 48 NPCs documentés

**NPCs clés :**
- **Weapon Trader Balbardo** (−10 674, 2 649) — armes EU 1D-8D
- **Protector Trader Jatomo** · **Grocery Trader Bajel** · **Specialty Trader Tina**
- **Stable-Keeper Treno** · **Inn Master Sikeulro** · **Guild Manager Gilt** · **Harbor Manager Georion**
- **Jobs :** Merchant Associate Tana / Hunter Associate Adria / **Smuggler Raul**
- **Soldier Kartino** (−10 495, 2 473) : téléporteur vers **Thief Town**
- Église (Clergy Gabriel), guides (Lipria, Riise, Raffy), Fortress Clerk

---

### Alexandria (Level 100-110+) — Egypt — South ≈ (−16 600, −300) / North ≈ (−16 200, 50)

👉 **[CITIES_04_ALEXANDRIA.md](CITIES_04_ALEXANDRIA.md)** — 46 NPCs + 27 quêtes documentés ⭐

**NPCs clés :**
- **South :** Weapon Trader Hemaka · Armor Trader Sharon · Potion Merchant Titi · Storage Khamererne · Stable Master Nefret
- **North :** Governor Senmute (palais) · Weapon Trader Chunmoo · Armor Trader Viviana
- **Jobs (schéma « President ») :** Trader Naunakt / Hunter Narmer / Thief Tausert (+ Item Exchange managers)
- **Port :** Harbor Manager Marwa (voie maritime Europe) · Lighthouse Keeper Snefru
- 27+ quêtes officielles (séries « Overdriving Heart », « Tax Due Notice », ...)

---

### Thief Town — vallée cachée ≈ (9 130, 860)

👉 **[NPCS_COORDINATES.md — Thief Town](NPCS_COORDINATES.md#-thief-town-npcs)** — 6 NPCs

- **Thief Associate** (9 122, 824) — union thief
- **Stolen Goods Dealer** (9 119, 891) — revente des marchandises volées
- Accès : téléporteur au sol (2 485, 2 679) · Soldier Kartino (Constantinople) · Smugglers

---

### Baghdad (Level 115+, post-classique) — Arabia — ≈ (−8 540, −730)

👉 **[NPCS_COORDINATES.md — Baghdad](NPCS_COORDINATES.md#-baghdad-npcs-post-classique)** — 54 NPCs

- Palais du **King Shahryar** et de la **Queen Sheherazade**
- Marchés (fruit/épices/huile), Repairer Uthman, associations de jobs
- Contenu postérieur au cap 120 classique — optionnel pour SRObro

---

## 🗂️ Catégories de NPCs

### Entraîneurs (Trainers)
- **Masteries chinoises :** Bicheon, Heuksal, Pacheon, Cold, Lightning, Fire, Force
- **Classes européennes :** Warrior, Rogue, Wizard, Warlock, Bard, Cleric

👉 **Details :** [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md) | [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md)

### Marchands (Merchants)
| Type | Par ville (noms officiels) |
|------|---------------------------|
| Armes | Chulsan (Jangan) → Agol (Donwhang) → Soboi (Hotan) / Tricia (Samarkand) → Balbardo (Const.) → Hemaka/Chunmoo (Alex.) |
| Armures | Mrs Jang → Yeolah → Gonishya / Aryoan → Jatomo → Sharon/Viviana |
| Potions | Jinjin/Dae-Pyeong → Yeosun → Manina+Shadi → Saha+Shadi → Bajel/Shadi → Titi/Thiara |
| Accessoires | Ryoe-A → Ryoe-Won → Ryoe-Ju/David → Sid → Zephyd → (loot/drops à Alex.) |
| Specialty | Jodaesan → Leegak → Sanmok → Toson → Tina → Wasdi |

### Services
- **Storage Keepers** — toutes les villes
- **Stable Keepers** — toutes les villes (sauf variantes)
- **Guild Managers** — toutes les villes
- **Harbor Managers / Ferry Ticket Sellers** — transport maritime et fluvial

### Job Unions (T/H/Th)
Voir le tableau récapitulatif : **[NPCS_COORDINATES.md — Job NPCs par Ville](NPCS_COORDINATES.md#-job-npcs-par-ville)**

### Donneurs de Quêtes
- Daily Quest Managers (une par ville), guides, chefs militaires, avant-postes (Outposts)
- Série Alexandria : Governor Senmute, Finance Officer Maneto, etc.

👉 **Details :** [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md)

---

## 📍 NPCs avec Coordonnées

### Base de Données Coordonnées

👉 **[NPCS_COORDINATES.md](NPCS_COORDINATES.md)** — ~322 NPCs urbains + liens vers la base complète (697) ⭐

**Format :**
```
NPC Name
  - Ville/Zone: [Jangan]
  - PosX/PosY: 6369, 1101   (officiel client)
  - Region: 25000
  - Type: Merchant/Service/Job/Quest/Guard/Event
  - Services: [liste]
```

**Exemples réels (client officiel) :**

```
Blacksmith Chulsan (Jangan)
  - Position: PosX 6369, PosY 1101
  - Type: Merchant (armes/armures 1D-3D + repair)

Hunter Associate Ahmok (Hotan)
  - Position: PosX 225, PosY 155
  - Type: Job (union Hunter)

Stolen Goods Dealer (Thief Town)
  - Position: PosX 9119, PosY 891
  - Type: Job (revente marchandises volées)
```

---

## 🔍 Recherche par Type

### Par Service

| Besoin | NPC à consulter |
|--------|-----------------|
| Apprendre des skills | Trainers (place centrale des villes de sa race) |
| Acheter équipement | Blacksmith/Protector Trader de la ville correspondant au degree |
| Consommables | Grocery/Potion Traders |
| Stockage | Storage Keeper (toutes villes) |
| Téléportation | Dimensional Gates + gardes téléporteurs + Homeless Genie |
| Jobs | Unions (trader/hunter visibles, thief caché) |
| Montures | Stable Keeper |
| Guilde | Guild Manager |

### Par Level Range

| Level | Ville recommandée | Degrees |
|-------|-------------------|---------|
| 1-20 | Jangan (CH) / Constantinople (EU) | 1D-3D |
| 20-35 | Donwhang (CH) / Asia Minor (EU) | 3D-5D |
| 30-60 | Hotan (les deux races) | 5D-8D |
| 30-45 | Samarkand (les deux races) | 5D-8D |
| 60-90 | Zones ouvertes (Karakoram, Taklamakan, Roc) — shops via Specialty Traders de zone | 8D-9D |
| 100-110 | Alexandria | 10D-11D |
| 110-120 | Alexandria / Temple of Jupiter | 11D-13D |
| 115+ | Baghdad *(post-classique)* | 13D+ |

---

## 📚 Voir aussi

### Coordonnées et Positions
- [NPCs Coordinates](NPCS_COORDINATES.md) — toutes les tables ⭐
- [Map Coordinates Reference](MAP_COORDINATES_REFERENCE.md) — téléporteurs, ferries, uniques, zones
- [Monsters Spawn Locations](MONSTERS_SPAWN_LOCATIONS.md) — spawns de monstres

### Guides de Villes
- [Jangan](CITIES_01_JANGAN.md) · [Donwhang](CITIES_02_DONWHANG.md) · [Hotan](CITIES_03_HOTAN.md)
- [Alexandria](CITIES_04_ALEXANDRIA.md) · [Constantinople](CITIES_05_CONSTANTINOPLE.md)
- [Zones Overview](13_ZONES_OVERVIEW.md) — toutes les régions du monde

### Base de Données
- [Items Database](ITEMS_DATABASE.md) · [Monsters Database](MONSTERS_DATABASE.md)

### Technique
- [Hub Technique](HUB_TECHNIQUE.md) · [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md)

---

## 💻 Implémentation Technique

### Database Schema (SRObro)

```typescript
model NPC {
  id           String   @id
  name         String          // nom officiel client
  zoneId       String
  zone         Zone     @relation(fields: [zoneId], references: [id])
  position     Position        // { posX, posY } — coordonnées monde officielles
  region       Int             // secteur 192×192 du client
  type         NPCType         // TRAINER, MERCHANT, SERVICE, QUEST, JOB, GUARD, EVENT
  services     NPCService[]
  levelRange   LevelRange?
  description  String?
}

enum NPCType {
  TRAINER
  MERCHANT
  SERVICE
  QUEST
  JOB
  GUARD
  EVENT
}
```

### API Endpoint

```typescript
// GET /api/data/npcs?zone=Jangan&type=MERCHANT
interface NPCResponse {
  id: string;
  name: string;
  position: { posX: number; posY: number };
  region: number;
  type: NPCType;
  services: string[];
}
```

### Import depuis la source xSROMap

```javascript
// Pipeline d'import (main.js de JellyBitz/xSROMap → npcs.json)
function convert(raw) {
  const r = raw.region < 0 ? raw.region + 65536 : raw.region;
  return {
    name: raw.name,
    region: raw.region,
    posX: ((r & 0xff) - 135) * 192 + raw.x / 10,
    posY: (((r >> 8) & 0xff) - 92) * 192 + raw.y / 10,
    teleport: raw.teleport?.map(t => t.name) ?? []
  };
}
```

---

## 🎯 Guide d'Interaction

### Comment Interagir avec les NPCs

1. **Approche** : cliquez sur le NPC (distance d'interaction ~15 unités)
2. **Dialogue** : sélectionnez l'option souhaitée
3. **Quêtes** : acceptez/refusez (icônes « ! » et « ? »)
4. **Commerce** : achetez/vendez des items
5. **Services** : storage, téléportation, guilde...

### Conseils d'Interaction

1. **Quêtes** : accepter les chaînes principales (guides), faire les dailies (Daily Quest Managers)
2. **Commerce** : comparer les degrees par ville ; vendre les drops inutiles aux marchands
3. **Services** : définir sa résidence, utiliser les Dimensional Gates (≈5 000 gold)

---

## ❓ FAQ

### Questions Fréquentes sur les NPCs

**Q: Comment trouver un NPC spécifique ?**
R: Utilisez [NPCS_COORDINATES.md](NPCS_COORDINATES.md) (par ville) ou la recherche xSROMap (par nom). En jeu, la carte (M) affiche les icônes NPCs.

**Q: Les NPCs listés existent-ils vraiment sous ces noms ?**
R: Oui — tous les noms de cette base sont les **noms officiels du client** (« Blacksmith Chulsan », « Merchant Associate Hwajung »...). Les anciennes versions utilisaient des noms génériques inventés.

**Q: Quel NPC pour débuter le trade ?**
R: Le **Merchant Associate** de votre ville (Hwajung à Jangan, Tana à Constantinople...) — achetez ensuite les specialty goods au Specialty Trader local.

**Q: Où vendre des marchandises volées ?**
R: Au **Stolen Goods Dealer** de **Thief Town** (9 119, 891).

**Q: Les NPCs peuvent-ils être tués ?**
R: Non — les NPCs amicaux sont invulnérables. Seuls les monstres/uniques (documentés dans [MONSTERS_SPAWN_LOCATIONS.md](MONSTERS_SPAWN_LOCATIONS.md)) sont combattables.

**Q: Comment savoir si un NPC a une quête ?**
R: Icône au-dessus de sa tête : « ! » jaune (quête principale), « ? » bleu (secondaire), sablier (quête en cours).

---

**Dernière mise à jour :** 2026-10-01
**Base de données NPCs** — Hub central des NPCs SRO
**Fichier #32** — Refondu et synchronisé avec les données client officielles
**Statut :** Documentation complète (source : xSROMap v1.4 / JellyBitz)
