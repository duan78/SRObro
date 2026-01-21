# Référence des Coordonnées Carte - POI et Points d'Intérêt

## 📋 Table des Matières
- [Introduction](#introduction)
- [Villes Principales](#villes-principales)
- [Portails et Téléporteurs](#portails-et-téléporteurs)
- [Fortress War Locations](#fortress-war-locations)
- [Zones de Chasse Populaires](#zones-de-chasse-populaires)
- [Dungeons et Instances](#dungeons-et-instances)
- [Routes de Trading](#routes-de-trading)
- [Points d'Intérêt Spéciaux](#points-dintérêt-spéciaux)
- [Notes de Développement](#notes-de-développement)

---

## 📚 Introduction

Ce document fournit une **référence complète des coordonnées** pour tous les points d'intérêt majeurs de Silkroad Online: villes, portails, forts, dungeons, et zones de farming.

**Sources:**
- xSROMap (https://jellybitz.github.io/xSROMap/)
- In-game measurements
- Community documentation

**Système de Coordonnées:**
- X: Est/Ouest (positif = Est, négatif = Ouest)
- Y: Nord/Sud (positif = Nord)
- Échelle: 1 unité ≈ 1 mètre en jeu

---

## 🏯 Villes Principales

### Jangan (Ville Chinoise de Départ)
```
Centre de la Ville: X: 2000, Y: 1000
Porte Sud: X: 2050, Y: 800
Porte Nord: X: 1950, Y: 1200
Porte Est: X: 2200, Y: 1000

Zones Adjacentes:
  - Tiger Mountain: X: 4000-5500, Y: -200-300
  - Western China: X: 2500-4000, Y: 500-1500

Level Range: 1-20
Services Complets: ✅
Job NPCs: ✅ (Trader, Hunter, Thief)
```

### Donwhang
```
Centre de la Ville: X: 8000, Y: 3000
Porte Ouest: X: 7800, Y: 3000 (vers Jangan)
Porte Est: X: 8200, Y: 3000 (vers Hotan)
Porte Sud: X: 8000, Y: 2700 (vers Stone Cave)

Zones Adjacentes:
  - Donwhang Hills: X: 7500-9000, Y: 2500-3800
  - Stone Cave Entrance: X: 8100, Y: 2600

Level Range: 20-30
Services Complets: ✅
Job NPCs: ✅
```

### Hotan
```
Centre de la Ville: X: 14000, Y: 5000
Porte Ouest: X: 13800, Y: 5000 (vers Donwhang)
Porte Est: X: 14200, Y: 5000 (vers Samarkand)
Porte Sud: X: 14000, Y: 4700 (vers Tarim Basin)

Zones Adjacentes:
  - Hotan Environs: X: 13500-15000, Y: 4500-6000
  - Karakoram: X: 12000-14000, Y: 5500-7000

Level Range: 30-50
Services Complets: ✅
Job NPCs: ✅
```

### Samarkand
```
Centre de la Ville: X: 11000, Y: 9000
Porte Ouest: X: 10800, Y: 9000 (vers Hotan)
Porte Est: X: 11200, Y: 9000 (vers Constantinople)

Zones Adjacentes:
  - Tarim Basin: X: 9500-11500, Y: 6500-9000
  - Central Asia: X: 11000-13000, Y: 8500-10000

Level Range: 50-70
Services Complets: ✅
Job NPCs: ✅
```

### Constantinople (Ville Européenne)
```
Centre de la Ville: X: -17000, Y: 500
Porte Est: X: -16800, Y: 500 (vers Asia Minor)
Port: X: -17500, Y: 450

Zones Adjacentes:
  - Asia Minor: X: -18000 to -15000, Y: 200-1500
  - Eastern Europe: X: -19000 to -17000, Y: -500-500

Level Range: 1-30 (départ EU), 30-90 (hub)
Services Complets: ✅
Job NPCs: ✅
European Trainers: ✅
```

### Alexandria (Ville Égyptienne)
```
Centre de la Ville: X: 18000, Y: 18000
Zone Nord (Ville): X: 17500-18500, Y: 17500-18500
Zone Sud (Delta): X: 17000-19000, Y: 16000-17000

Zones Adjacentes:
  - Egypt Desert: X: 17500-19500, Y: 15000-18000
  - Storm Desert: X: 18000-20000, Y: 16000-17500
  - Pharaoh's Tomb Entrance: X: 18500, Y: 17200

Level Range: 90-110+
Services Complets: ✅
Job NPCs: ✅ (Trader, Hunter)
```

---

## 🚪 Portails et Téléporteurs

### Portails de Téléportation

#### Jangan Area Portals
```
Jangan → Western China:
  NPC: Gate Porter
  Location: X: 2200, Y: 1050
  Destination: X: 3500, Y: 1200
  Cost: Free
```

#### Donwhang Area Portals
```
Jangan → Donwhang:
  NPC: Gate Porter
  Location: X: 7980, Y: 2950
  Destination: X: 8020, Y: 2880
  Cost: Free

Donwhang → Stone Cave:
  NPC: Dungeon Porter
  Location: X: 8100, Y: 2650
  Destination: Stone Cave B1
  Cost: Free
```

#### Hotan Area Portals
```
Donwhang → Hotan:
  NPC: Gate Porter
  Location: X: 13820, Y: 2950
  Destination: X: 14020, Y: 4880
  Cost: Free

Hotan → Samarkand:
  NPC: Gate Porter
  Location: X: 14020, Y: 5050
  Destination: X: 11020, Y: 8880
  Cost: Free
```

#### Constantinople Portals
```
Constantinople → Asia Minor:
  NPC: Gate Porter
  Location: X: -16820, Y: 520
  Destination: X: -16500, Y: 800
  Cost: Free

Asia Minor → Samarkand:
  NPC: Teleporter
  Location: X: -15500, Y: 1500
  Destination: X: 11000, Y: 9000
  Cost: Free (certains serveurs)
```

#### Alexandria Portals
```
Hotan → Alexandria:
  NPC: Portal
  Location: X: 14050, Y: 5250
  Destination: X: 17980, Y: 18020
  Cost: Free (level 90+)

Alexandria → Hotan:
  NPC: Portal
  Location: X: 18020, Y: 18180
  Destination: X: 14050, Y: 5050
  Cost: Free
```

### Dimensional Gates (Special Portals)

```
Constantinople Dimensional Gate:
  Location: X: -16750, Y: 350
  Function: Event access, special instances
  Requirements: Variable (par event)

Fortress War Portals:
  Active during Fortress War only
  Spawn points pour attaquants/défenseurs
```

---

## 🏰 Fortress War Locations

### Jangan Fortress
```
Location: X: 2500, Y: 800

Structures:
  - Command Center: X: 2500, Y: 800
  - Gate 1 (West): X: 2400, Y: 800
  - Gate 2 (East): X: 2600, Y: 800
  - Tower 1 (NW): X: 2450, Y: 750
  - Tower 2 (NE): X: 2550, Y: 750
  - Tower 3 (SW): X: 2450, Y: 850
  - Tower 4 (SE): X: 2550, Y: 850

Owner Benefits:
  - Tax: 1-5% de transactions à Jangan
  - Guild Buffs: +10% EXP pour guilde
  - Recall: Guild recall au fort

Schedule: Samedi, varié par serveur
Capacity: 300 joueurs (150 vs 150)
```

### Hotan Fortress
```
Location: X: 13500, Y: 4800

Structures:
  - Command Center: X: 13500, Y: 4800
  - Gate 1 (West): X: 13400, Y: 4800
  - Gate 2 (East): X: 13600, Y: 4800
  - Towers: 4 tours aux coins

Owner Benefits:
  - Tax: Plus élevé que Jangan (zone trading majeure)
  - Guild Buffs: +15% EXP, +5% drop rate
  - Special NPCs: Access exclusive

Importance: ⭐⭐⭐⭐⭐ (Most valuable fort)
```

### Constantinople Fortress (Eastern Europe)
```
Location: X: -17200, Y: 200

Structures:
  - Command Center: X: -17200, Y: 200
  - Gates: 3 portes (multiple angles)
  - Towers: 8 tours (fortifié)

Owner Benefits:
  - Tax: Transactions européennes
  - Guild Buffs: +20% EXP, +10% SP
  - Europe Special: Bonus pour EU characters

Clerk: Eastern Europe Fortress Clerk
  Location: X: -16800, Y: 400
```

### Bandit Fortress (Thief Town)
```
Location: Special zone (access via thief NPCs)

Access:
  - Jangan Thief: X: 1920, Y: 890 (portal)
  - Donwhang Thief: X: 7920, Y: 2890 (portal)
  - Hotan Thief: X: 13920, Y: 4890 (portal)

Features:
  - Thief-only zone
  - Special thief traders
  - Thief storage
  - Safe zone pour thieves
```

---

## 🎯 Zones de Chasse Populaires

### Tiger Mountain (Level 1-20)
```
Zone: X: 4000-5500, Y: -200-300

Spots:
  - Entrance (Level 1-8): X: 4200-4700, Y: 50-150
  - Mid Mountain (Level 8-15): X: 4700-5200, Y: 0-100
  - Tiger Stronghold (Level 15-20): X: 4800-5300, Y: 50-150

Monsters:
  - Mangyang (Lv 1-3)
  - Yeoha (Lv 4-6)
  - Small-Eye Ghost (Lv 7-9)
  - Big-Eye Ghost (Lv 9-10)
  - Tiger (Lv 15-18)
  - Tiger Girl Unique (Lv 20): X: 4853, Y: 94

Popularity: ⭐⭐⭐⭐⭐ (Nouveaux joueurs)
```

### Bandit Stronghold (Level 25-35)
```
Zone: X: 8200-8600, Y: 3200-3600

Spots:
  - Outer Bandits (Lv 25-28): X: 8200-8400, Y: 3200-3400
  - Inner Bandits (Lv 30-35): X: 8400-8600, Y: 3400-3600

Monsters:
  - Bandit (Lv 25-28)
  - Bandit Archer (Lv 28-32)
  - Bandit Leader (Lv 32-35)

Popularity: ⭐⭐⭐⭐⭐ (SP farming)
```

### Shia Geeks (Level 40-50)
```
Zone: X: 13800-14200, Y: 5200-5600

Spots:
  - Shia Geeks (Lv 40-45): X: 13800-14000, Y: 5200-5400
  - Shia Toads (Lv 45-50): X: 14000-14200, Y: 5400-5600

Monsters:
  - Shia Geek (Lv 42-45)
  - Shia Toad (Lv 44-47)
  - Shia Cobra (Lv 46-49)

Popularity: ⭐⭐⭐⭐⭐ (SP farming optimal)
```

### Egypt Delta (Level 90-100)
```
Zone: X: 17500-18500, Y: 16500-17500

Spots:
  - Delta North (Lv 90-95): X: 17800-18300, Y: 17000-17500
  - Delta South (Lv 95-100): X: 17300-17800, Y: 16500-17000

Monsters:
  - Uneg (Lv 90-92)
  - Weneg (Lv 92-94)
  - Dark Scout (Lv 94-96)
  - Dark Khepri (Lv 96-98)
  - Uraeus (Lv 98-100)

Popularity: ⭐⭐⭐⭐⭐ (High-level SP farming)
```

---

## 🏰 Dungeons et Instances

### Stone Cave (Donwhang)
```
Entrance: X: 8100, Y: 2600

Levels:
  - B1 (Level 26-29)
  - B2 (Level 28-30)
  - B3 (Level 29-32)
  - B4 (Level 31-35)

Monsters:
  - Stone Cave Monsters (Lv 26-35)
  - Champion spawns
  - Mini-bosses

Party Size: 2-4 players
Difficulty: ⭐⭐
```

### Qin-Shi Tomb (Pharaoh's Tomb)
```
Entrance: X: 18500, Y: 17200

Levels - Lesser:
  - B1 (Level 81-85)
  - B2 (Level 86-90)
  - B3 (Level 90-95)
  - B4 (Level 96-99)
  - B5 (Level 100+)
  - B6 (Level 105+)

Bosses (Lesser):
  - Sphinx (Lv 90) - B1
  - Sekhmet (Lv 92) - B2
  - Nephthys (Lv 95) - B3
  - Horus (Lv 98) - B4
  - Osiris (Lv 100) - B5

Party Size: 4-8 players
Difficulty: ⭐⭐⭐⭐ (Requires coordination)
Rewards: SOX, 13D equipment, Hearts
```

### Forgotten World
```
Entrance: Multiple (via portals)

Instance Type: Daily dungeon
Level Requirement: 100+

Features:
  - Daily quests
  - Boss fights
  - Special drops

Party Size: 4-8 players
Difficulty: ⭐⭐⭐⭐⭐
```

### Job Temple
```
Entrance: Special portals (event-based)

Instance Type: Job-based PvPvE
Level Requirement: 90+

Features:
  - Trader vs Hunter vs Thief
  - Special rewards
  - Job points

Difficulty: ⭐⭐⭐⭐⭐
```

---

## 🐪 Routes de Trading

### Jangan → Donwhang
```
Distance: ~6000 units
Duration: ~15 minutes (normal transport)

Route Markers:
  - Start: Jangan South Gate (X: 2050, Y: 800)
  - Checkpoint 1: X: 5000, Y: 2000
  - Checkpoint 2: X: 6500, Y: 2500
  - End: Donwhang West Gate (X: 7800, Y: 3000)

Thief Danger: ⭐⭐ (Low-Medium)
Profit: Low-Medium
Popularity: ⭐⭐⭐⭐ (Beginner traders)
```

### Donwhang → Hotan
```
Distance: ~6000 units
Duration: ~15 minutes

Route Markers:
  - Start: Donwhang East Gate (X: 8200, Y: 3000)
  - Checkpoint 1: X: 10000, Y: 4000
  - Checkpoint 2: X: 12000, Y: 4500
  - End: Hotan West Gate (X: 13800, Y: 5000)

Thief Danger: ⭐⭐⭐ (Medium)
Profit: Medium
Popularity: ⭐⭐⭐⭐⭐
```

### Hotan → Samarkand
```
Distance: ~4000 units
Duration: ~10 minutes

Route Markers:
  - Start: Hotan East Gate (X: 14200, Y: 5000)
  - Checkpoint 1: X: 12500, Y: 7000
  - End: Samarkand West Gate (X: 10800, Y: 9000)

Thief Danger: ⭐⭐⭐⭐ (High)
Profit: High
Popularity: ⭐⭐⭐ (Experienced traders)
```

### Constantinople → Samarkand
```
Distance: ~28000 units (very long)
Duration: ~30+ minutes

Route Markers:
  - Start: Constantinople East Gate (X: -16800, Y: 500)
  - Asia Minor: X: -15000 to -10000, Y: 1000-3000
  - Central Asia: X: -5000 to 5000, Y: 5000-9000
  - End: Samarkand West Gate (X: 10800, Y: 9000)

Thief Danger: ⭐⭐⭐⭐⭐ (Extreme)
Profit: Very High
Popularity: ⭐⭐ (High-risk traders)
```

### Hotan → Alexandria
```
Distance: ~13000 units
Duration: ~25 minutes

Route Markers:
  - Start: Hotan South (X: 14000, Y: 4700)
  - Egypt Border: X: 16000, Y: 12000
  - Egypt Delta: X: 17500, Y: 17000
  - End: Alexandria (X: 18000, Y: 18000)

Thief Danger: ⭐⭐⭐⭐⭐ (Extreme - high level thieves)
Profit: Very High (high-level goods)
Popularity: ⭐⭐⭐ (End-game trading)
```

---

## 🌟 Points d'Intérêt Spéciaux

### Job Temples
```
Trader Temple:
  Location: Special coordinates (access via quest)
  Function: Trader buffs, quests

Hunter Temple:
  Location: Special coordinates
  Function: Hunter buffs, quests

Thief Temple:
  Location: Bandit Fortress
  Function: Thief buffs, quests
```

### Event Areas
```
Battle Arena:
  Location: X: -16980, Y: 300 (Constantinople)
  Type: PvP arena
  Level: Any (scaled)

Survival Arena:
  Location: X: -16960, Y: 280
  Type: Survival PvP
  Level: Any

Robot Event Area:
  Location: Various (event-dependent)
  Type: Event collection
```

### Forgotten World Entrances
```
Entrance 1 (Jangan): X: 2300, Y: 1200
Entrance 2 (Donwhang): X: 8300, Y: 3200
Entrance 3 (Hotan): X: 14100, Y: 5200
Entrance 4 (Alexandria): X: 18200, Y: 17500
```

### Special Spawn Points
```
Unique Spawn Markers:
  - Tiger Girl: X: 4853, Y: 94
  - Cerberus: X: -1552, Y: -94
  - Captain Ivy: X: -6425, Y: 2745
  - Isyutaru: X: 12000, Y: 6500
  - Uruchi: X: 15000, Y: 7500
  - Lord Yarkan: X: 18000, Y: 8500
  - Medusa: X: 19000, Y: 17000
  - Lady Lyn: X: 20000, Y: 18000
```

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

#### Système de Coordonnées Mondiales

```javascript
// Classe pour gérer les coordonnées mondiales
class WorldCoordinateSystem {
  constructor() {
    this.worldSize = 50000; // 50km x 50km world
    this.chunkSize = 1000; // 1km chunks for loading
  }

  // Conversion coordonnées monde → chunk
  worldToChunk(x, y) {
    return {
      chunkX: Math.floor(x / this.chunkSize),
      chunkY: Math.floor(y / this.chunkSize)
    };
  }

  // Vérification si position est valide
  isValidPosition(x, y) {
    return x >= -this.worldSize/2 && x <= this.worldSize/2 &&
           y >= -this.worldSize/2 && y <= this.worldSize/2;
  }

  // Calcul de distance entre deux points
  calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

#### Gestion des Zones

```javascript
// Système de gestion des zones
class ZoneManager {
  constructor() {
    this.zones = this.loadZones();
  }

  loadZones() {
    return {
      JANGAN: {
        name: "Jangan",
        bounds: { minX: 1500, maxX: 2500, minY: 500, maxY: 1500 },
        levelRange: [1, 20],
        safeZone: true
      },
      TIGER_MOUNTAIN: {
        name: "Tiger Mountain",
        bounds: { minX: 4000, maxX: 5500, minY: -200, maxY: 300 },
        levelRange: [1, 20],
        safeZone: false
      },
      // ... autres zones
    };
  }

  getZoneAt(x, y) {
    for (const [id, zone] of Object.entries(this.zones)) {
      if (x >= zone.bounds.minX && x <= zone.bounds.maxX &&
          y >= zone.bounds.minY && y <= zone.bounds.maxY) {
        return { id, ...zone };
      }
    }
    return null;
  }

  isSafeZone(x, y) {
    const zone = this.getZoneAt(x, y);
    return zone && zone.safeZone;
  }
}
```

#### Waypoints et Navigation

```javascript
// Système de waypoints pour navigation
class WaypointSystem {
  constructor() {
    this.waypoints = this.loadWaypoints();
  }

  loadWaypoints() {
    return {
      JANGAN_SOUTH_GATE: { x: 2050, y: 800, name: "Jangan South Gate" },
      DONWHANG_WEST_GATE: { x: 7800, y: 3000, name: "Donwhang West Gate" },
      HOTAN_WEST_GATE: { x: 13800, y: 5000, name: "Hotan West Gate" },
      // ... autres waypoints
    };
  }

  getNearestWaypoint(x, y, maxDistance = 500) {
    let nearest = null;
    let minDist = maxDistance;

    for (const [id, wp] of Object.entries(this.waypoints)) {
      const dist = Math.sqrt((wp.x - x) ** 2 + (wp.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = { id, ...wp, distance: dist };
      }
    }

    return nearest;
  }

  calculateRoute(startX, startY, endX, endY) {
    // Simple pathfinding - pourrait être amélioré avec A*
    const route = [];
    const steps = 10;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      route.push({
        x: startX + (endX - startX) * t,
        y: startY + (endY - startY) * t
      });
    }

    return route;
  }
}
```

#### Markers sur la Minimap

```javascript
// Affichage des POI sur la minimap
class MinimapPOI {
  renderPOIs(playerPosition, renderDistance = 5000) {
    const visiblePOIs = [];

    // Villes
    this.cities.forEach(city => {
      if (this.isInRange(playerPosition, city, renderDistance)) {
        visiblePOIs.push({
          type: 'CITY',
          name: city.name,
          position: { x: city.x, y: city.y },
          icon: 'city_icon'
        });
      }
    });

    // Portails
    this.portals.forEach(portal => {
      if (this.isInRange(playerPosition, portal, renderDistance)) {
        visiblePOIs.push({
          type: 'PORTAL',
          name: portal.name,
          position: { x: portal.x, y: portal.y },
          icon: 'portal_icon'
        });
      }
    });

    // Fortresses
    this.fortresses.forEach(fort => {
      if (this.isInRange(playerPosition, fort, renderDistance)) {
        visiblePOIs.push({
          type: 'FORTRESS',
          name: fort.name,
          position: { x: fort.x, y: fort.y },
          icon: 'fortress_icon'
        });
      }
    });

    return visiblePOIs;
  }

  isInRange(player, poi, range) {
    const dist = Math.sqrt((poi.x - player.x) ** 2 + (poi.y - player.y) ** 2);
    return dist <= range;
  }
}
```

---

## 📊 Références Rapides

### Distances Intervilles

| De → À | Distance | Durée estimée |
|--------|----------|---------------|
| Jangan → Donwhang | ~6000 | 15 min |
| Donwhang → Hotan | ~6000 | 15 min |
| Hotan → Samarkand | ~4000 | 10 min |
| Samarkand → Constantinople | ~28000 | 30+ min |
| Hotan → Alexandria | ~13000 | 25 min |

### Coordonnées des Portes Principales

| Ville | Porte Ouest | Porte Est | Porte Nord | Porte Sud |
|-------|-------------|-----------|-----------|----------|
| Jangan | - | 2200/1000 | 1950/1200 | 2050/800 |
| Donwhang | 7800/3000 | 8200/3000 | - | 8000/2700 |
| Hotan | 13800/5000 | 14200/5000 | - | 14000/4700 |
| Samarkand | 10800/9000 | 11200/9000 | - | - |
| Constantinople | - | -16800/500 | - | - |
| Alexandria | - | - | - | - (port: -17500/450) |

---

## 🎯 Prochaines Étapes

1. **Coordonnées Précises:**
   - Mesures in-game pour validation
   - Extraction systématique via tools
   - Documentation des variations

2. **Carte Interactive:**
   - Implémentation avec Three.js/Babylon.js
   - Interface de recherche
   - Marqueurs cliquables

3. **Pathfinding:**
   - Algorithme A* pour navigation
   - Évitement d'obstacles
   - Routes optimales pour trading

---

*Dernière mise à jour: 20 Janvier 2026*

*Sources: xSROMap, SRObro Project, Community Documentation*
