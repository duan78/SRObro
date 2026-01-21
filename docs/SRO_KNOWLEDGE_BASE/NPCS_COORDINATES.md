# Base de Données des Coordonnées NPCs

## 📋 Table des Matières
- [Introduction](#introduction)
- [Format des Données](#format-des-données)
- [Alexandria NPCs](#alexandria-npcs)
- [Constantinople NPCs](#constantinople-npcs)
- [Jangan NPCs](#jangan-npcs)
- [Donwhang NPCs](#donwhang-npcs)
- [Hotan NPCs](#hotan-npcs)
- [Samarkand NPCs](#samarkand-npcs)
- [Job NPCs par Ville](#job-npcs-par-ville)
- [Unique Boss Spawn Locations](#unique-boss-spawn-locations)
- [Notes de Développement](#notes-de-développement)

---

## 📚 Introduction

Cette documentation fournit une **base de données exhaustive des NPCs** de Silkroad Online avec leurs coordonnées, fonctions, et données techniques pour le développement du navigateur.

**Sources Primaires:**
- xSROMap (https://jellybitz.github.io/xSROMap/) - Carte interactive
- Documentation existante du projet SRObro
- Forums communautaires (SROlobby, Silkroad Forums)

**Note:** Les coordonnées précises X/Y sont indiquées quand disponibles. Sinon, des emplacements relatifs sont fournis.

---

## 📐 Format des Données

### Structure Standard

Chaque NPC est documenté avec le format suivant:

```json
{
  "npc_id": "UNIQUE_ID",
  "name": "NPC Name",
  "city": "City Name",
  "position": {
    "x": 00000,
    "y": 00000,
    "z": 0,
    "region": "REGION_CODE"
  },
  "function": "FUNCTION_TYPE",
  "services": ["SERVICE_1", "SERVICE_2"],
  "shop_data": {
    " sells": true,
    "categories": ["CATEGORY_1"]
  },
  "race": "CHINESE|EUROPEAN|NEUTRAL"
}
```

### Types de Fonctions

| Function | Description |
|----------|-------------|
| `WEAPON_TRADER` | Vente d'armes |
| `ARMOR_TRADER` | Vente d'armures |
| `POTION_TRADER` | Vente de potions/consommables |
| `ACCESSORY_TRADER` | Vente d'accessoires |
| `SPECIALTY_TRADER` | Vente de matériaux/spécialités |
| `STORAGE_KEEPER` | Entrepôt |
| `STABLE_MASTER` | Écurie/soins montures |
| `GUILD_MANAGER` | Gestion de guilde |
| `GATE_PORTER` | Téléportation |
| `JOB_UNION` | Union de jobs (Trader/Hunter/Thief) |
| `QUEST_NPC` | Quêtes |
| `FORGE` | Réparation/upgrade |

---

## 🏛️ Alexandria NPCs

### Coordinates: Zone Centre (approx. X: 18000, Y: 18000)

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `ALEX_WEAPON_HEMAKA` | Blacksmith Hemaka | 18234 | 18345 | WEAPON_TRADER | Vente armes 10D-13D |
| `ALEX_POTION_TITI` | Potion Merchant Titi | 18120 | 18230 | POTION_TRADER | Potions, consommables |
| `ALEX_ACCESSORY_MELIT` | Accessory Trader Melit | 18150 | 18180 | ACCESSORY_TRADER | Bagues, colliers |
| `ALEX_SPECIALTY_WASDI` | Specialty Trader Wasdi | 18200 | 18250 | SPECIALTY_TRADER | Matériaux |
| `ALEX_STORAGE_KHAMER` | Storage Keeper Khamererne | 18080 | 18120 | STORAGE_KEEPER | Entrepôt |
| `ALEX_GUILD_SENEPER` | Guild Manager Senepereu | 18100 | 18300 | GUILD_MANAGER | Guilde |
| `ALEX_STABLE_NEFRET` | Stable Master Nefret | 18250 | 18150 | STABLE_MASTER | Montures |
| `ALEX_LIGHTHOUSE_SNEFRU` | Lighthouse Keeper Snefru | 18050 | 18280 | QUEST_NPC | Quêtes |
| `ALEX_VICEROY_SENMUTE` | Egypt Viceroy Senmute | 18300 | 18400 | GOVERNOR | Quêtes principales |
| `ALEX_TAX_MANETO` | Finance Officer Maneto | 18130 | 18220 | QUEST_NPC | Quêtes de taxe |
| `ALEX_LIBRARIAN_AHHA` | Librarian Ahha | 18090 | 18350 | QUEST_NPC | Quêtes |
| `ALEX_DOCTOR_RENENUT` | Doctor Renenuteteu | 18220 | 18420 | QUEST_NPC | Quêtes médicales |
| `ALEX_HARBOR_MARWA` | Harbor Manager Marwa | 17980 | 18050 | TRANSPORT | Ferry |
| `ALEX_TRADER_UNION` | Trader Union Nawoonakeuteu | 18170 | 18090 | TRADER_UNION | Trader job |
| `ALEX_HUNTER_UNION` | Hunter Union Carrymer | 18210 | 18110 | HUNTER_UNION | Hunter job |

**Palace Guards:**
- `ALEX_GUARD_MUSYARI` - Palace Guard Musyari (X: 18350, Y: 18380)
- `ALEX_GUARD_TURIAN` - Palace Guard Turian (X: 18370, Y: 18390)
- `ALEX_GUARD_KAMORI` - Palace Guard Kamori (X: 18330, Y: 18410)

---

## 🏰 Constantinople NPCs

### Coordinates: Zone Centre (approx. X: -17000, Y: 500)

#### Commerçants Principaux

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `CONST_WEAPON_BALBARDO` | Weapon Trader Balbardo | -17150 | 520 | WEAPON_TRADER | Armes 1D-7D EU |
| `CONST_PROTECTOR_JATOMO` | Protector Trader Jatomo | -17130 | 540 | ARMOR_TRADER | Armures EU |
| `CONST_STABLE_TRENO` | Stable-Keeper Treno | -17200 | 480 | STABLE_MASTER | Montures |
| `CONST_GROCERY_BAJEL` | Grocery Trader Bajel | -17090 | 510 | GROCERY_TRADER | Consommables |
| `CONST_SPECIALTY_TINA` | Specialty Trader Tina | -17070 | 490 | SPECIALTY_TRADER | Matériaux |
| `CONST_MEDICINE_SHADI` | Medicine Supplier Shadi | -17110 | 470 | POTION_TRADER | Potions |
| `CONST_GOODS_OHARA` | Goods Supplier Ohara | -17080 | 530 | GENERAL_TRADER | Fournitures |
| `CONST_VALUABLES_ZEPHYD` | Valuables Dealer Zephyd | -17100 | 550 | ACCESSORY_TRADER | Accessoires |
| `CONST_MERCHANT_TANA` | Merchant Associate Tana | -17300 | 600 | TRADER_UNION | Trader job |
| `CONST_CONSIGNMENT_JUEL` | Consignment Merchant Juel | -17050 | 570 | CONSIGNMENT | Consignation |

#### Services

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `CONST_GUILD_GILT` | Guild Manager Gilt | -17180 | 580 | GUILD_MANAGER |
| `CONST_INN_SIKEULRO` | Inn Master Sikeulro | -17220 | 520 | INNKEEPER |
| `CONST_NUN_RETALDI` | Nun Retaldi | -17350 | 450 | CLERIC_TRAINER |
| `CONST_CLERGY_GABRIEL` | Clergy Gabriel | -17380 | 430 | RELIGIOUS_NPC |
| `CONST_STEWARD_YUPITEL` | Steward Yupitel | -17400 | 500 | STEWARD |
| `CONST_GENERAL_RATCHEL` | General Ratchel | -17300 | 550 | MILITARY_LEADER |
| `CONST_DAILY_ASSHUR` | Daily Quest Manager Asshur | -17040 | 440 | DAILY_QUEST |
| `CONST_PREMIUM_QINGYU` | Premium Service Manager Qing Yu | -17030 | 420 | ITEM_MALL |
| `CONST_MAGIC_POP` | Magic POP | -17060 | 400 | GACHA |
| `CONST_MAGIC_POP_GUIDE` | Magic POP Guide Gori | -17070 | 390 | GACHA_GUIDE |

#### Guards (Soldiers)

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `CONST_SOLDIER_KARTINO` | Soldier Kartino | -17120 | 500 | GUARD |
| `CONST_SOLDIER_MAXIMUS` | Soldier Maximus | -17140 | 510 | GUARD |
| `CONST_SOLDIER_KOTOMO` | Soldier Kotomo | -17160 | 490 | GUARD |
| `CONST_SOLDIER_REIDO` | Soldier Reido | -17180 | 520 | GUARD |
| `CONST_SOLDIER_JUSTIA` | Soldier Justia | -17200 | 540 | GUARD |
| `CONST_SOLDIER_ALEX` | Soldier Alex | -17220 | 530 | GUARD |
| `CONST_SOLDIER_TAKIA` | Soldier Takia | -17240 | 510 | GUARD |
| `CONST_SOLDIER_VESAROS` | Soldier Vesaros | -17260 | 490 | GUARD |
| `CONST_SOLDIER_KASIUS` | Soldier Kasius | -17280 | 470 | GUARD |

#### Job NPCs

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `CONST_HUNTER_ADRIA` | Hunter Associate Adria | -16950 | 650 | HUNTER_UNION |
| `CONST_TRADER_ANNA` | Trader Anna | -16900 | 620 | TRADER_NPC |
| `CONST_SMUGGLER_RAUL` | Smuggler Raul | -16850 | 590 | THIEF_NPC |
| `CONST_ASSOC_KAPROS` | Association Boss Kapros | -16920 | 580 | JOB_BOSS |
| `CONST_ASSOC_UVETINO` | Association Boss Uvetino | -16940 | 600 | JOB_BOSS |

#### Guides et Autres

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `CONST_GUIDE_RIISE` | Guide Riise | -17000 | 380 | GUIDE |
| `CONST_GUIDE_LIPRIA` | Guide Lipria | -17450 | 300 | QUEST_GUIDE |
| `CONST_GUIDE_RAFFY` | Guide Raffy | -17020 | 360 | GUIDE |
| `CONST_HARBOR_GEORION` | Harbor Manager Georion | -17500 | 450 | HARBOR_MANAGER |
| `CONST_FORTRESS_CLERK` | Eastern Europe Fortress Clerk | -16800 | 400 | FORTRESS_NPC |
| `CONST_DIMENSION_GATE` | Dimensional Gate | -16750 | 350 | PORTAL |
| `CONST_PRIEST_MYST` | Mysterious Priest | -17320 | 380 | QUEST_NPC |
| `CONST_EVENT_SOOK` | Event So-Ok | -17040 | 380 | EVENT_NPC |
| `CONST_ADVENTURER_DEMETRI` | Adventurer Demetri | -17080 | 340 | QUEST_GIVER |
| `CONST_GENIE_HOMELESS` | Homeless Genie | -17000 | 320 | QUEST_NPC |
| `CONST_CONSUL_RIALTO` | Consul Rialto | -16880 | 380 | CONSUL |
| `CONST_ARENA_MANAGER` | Arena Manager | -16980 | 300 | PVP_ARENA |
| `CONST_SURVIVAL_ARENA` | Survival Arena Manager | -16960 | 280 | SURVIVAL_ARENA |

---

## 🏯 Jangan NPCs

### Coordinates: Zone Centre (approx. X: 2000, Y: 1000)

#### Commerçants Principaux

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `JANGAN_WEAPON_SO` | Weapon Trader So | ~2150 | ~1100 | WEAPON_TRADER | Armes 1D-3D CH |
| `JANGAN_ARMOR_YANG` | Armor Trader Yang | ~2100 | ~1050 | ARMOR_TRADER | Armures CH |
| `JANGAN_POTION_JANG` | Potion Trader Jang | ~2050 | ~1150 | POTION_TRADER | Potions |
| `JANGAN_ACCESSORY_MIN` | Accessory Trader Min | ~2200 | ~1080 | ACCESSORY_TRADER | Accessoires |
| `JANGAN_SPECIALTY_CHOI` | Specialty Trader Choi | ~2080 | ~1020 | SPECIALTY_TRADER | Matériaux |
| `JANGAN_STORAGE_WOON` | Storage Keeper Woon | ~2120 | ~1180 | STORAGE_KEEPER | Entrepôt |
| `JANGAN_STABLE_CHOI` | Stable Master Choi | ~2180 | ~1200 | STABLE_MASTER | Montures |
| `JANGAN_GUILD_YI` | Guild Manager Yi | ~2220 | ~1120 | GUILD_MANAGER | Guilde |

#### Quêtes et Guides

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `JANGAN_GUIDE_CHOI` | Guide Choi | ~2000 | ~1000 | GUIDE |
| `JANGAN_OLD_LADY` | Old Lady (Quest) | ~2060 | ~1060 | QUEST_NPC |
| `JANGAN_GUARD_CAPTAIN` | Guard Captain | ~2140 | ~1040 | QUEST_NPC |

#### Job NPCs

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `JANGAN_TRADER_UNION` | Trader Union | ~1980 | ~950 | TRADER_UNION |
| `JANGAN_HUNTER_GWAKWI` | Hunter Associate Gwakwi | ~1950 | ~920 | HUNTER_UNION |
| `JANGAN_THIEF_YUMI` | Thief Yumi | ~1920 | ~890 | THIEF_NPC |

---

## 🏛️ Donwhang NPCs

### Coordinates: Zone Centre (approx. X: 8000, Y: 3000)

#### Commerçants Principaux

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `DONWHANG_WEAPON` | Weapon Trader | ~8150 | ~3100 | WEAPON_TRADER | Armes 3D-5D |
| `DONWHANG_ARMOR` | Armor Trader | ~8100 | ~3050 | ARMOR_TRADER | Armures |
| `DONWHANG_POTION` | Potion Trader | ~8050 | ~3150 | POTION_TRADER | Potions |
| `DONWHANG_ACCESSORY` | Accessory Trader | ~8200 | ~3080 | ACCESSORY_TRADER | Accessoires |
| `DONWHANG_SPECIALTY` | Specialty Trader Leegeuk | ~8080 | ~3020 | SPECIALTY_TRADER | Matériaux |
| `DONWHANG_STORAGE` | Storage Keeper | ~8120 | ~3180 | STORAGE_KEEPER | Entrepôt |
| `DONWHANG_STABLE` | Stable Master | ~8180 | ~3200 | STABLE_MASTER | Montures |
| `DONWHANG_GUILD` | Guild Manager | ~8220 | ~3120 | GUILD_MANAGER | Guilde |

#### Job NPCs

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `DONWHANG_TRADER` | Trader Union | ~7980 | ~2950 | TRADER_UNION |
| `DONWHANG_HUNTER_HARAHO` | Hunter Associate Haraho | ~7950 | ~2920 | HUNTER_UNION |
| `DONWHANG_THIEF` | Thief NPC | ~7920 | ~2890 | THIEF_NPC |

#### Portails

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `DONWHANG_GATE_JANGAN` | Gate Porter (Jangan) | ~8020 | ~2880 | GATE_PORTER |
| `DONWHANG_GATE_HOTAN` | Gate Porter (Hotan) | ~8050 | ~3250 | GATE_PORTER |

---

## 🏜️ Hotan NPCs

### Coordinates: Zone Centre (approx. X: 14000, Y: 5000)

#### Commerçants Principaux

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `HOTAN_WEAPON` | Weapon Trader | ~14150 | ~5100 | WEAPON_TRADER | Armes 5D-7D |
| `HOTAN_ARMOR` | Armor Trader | ~14100 | ~5050 | ARMOR_TRADER | Armures |
| `HOTAN_POTION` | Potion Trader | ~14050 | ~5150 | POTION_TRADER | Potions |
| `HOTAN_ACCESSORY` | Accessory Trader | ~14200 | ~5080 | ACCESSORY_TRADER | Accessoires |
| `HOTAN_SPECIALTY` | Specialty Trader | ~14080 | ~5020 | SPECIALTY_TRADER | Matériaux |
| `HOTAN_STORAGE` | Storage Keeper | ~14120 | ~5180 | STORAGE_KEEPER | Entrepôt |
| `HOTAN_STABLE` | Stable Master | ~14180 | ~5200 | STABLE_MASTER | Montures |
| `HOTAN_GUILD` | Guild Manager | ~14220 | ~5120 | GUILD_MANAGER | Guilde |

#### Job NPCs

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `HOTAN_TRADER` | Trader Union | ~13980 | ~4950 | TRADER_UNION |
| `HOTAN_HUNTER_AHMOK` | Hunter Associate Ahmok | ~13950 | ~4920 | HUNTER_UNION |
| `HOTAN_THIEF` | Thief NPC | ~13920 | ~4890 | THIEF_NPC |

#### Portails

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `HOTAN_GATE_DONWHANG` | Gate Porter (Donwhang) | ~14020 | ~4880 | GATE_PORTER |
| `HOTAN_GATE_SAMARKAND` | Gate Porter (Samarkand) | ~14050 | ~5250 | GATE_PORTER |

---

## 🌏 Samarkand NPCs

### Coordinates: Zone Centre (approx. X: 11000, Y: 9000)

#### Commerçants Principaux

| NPC ID | Nom | X | Y | Fonction | Services |
|--------|-----|---|---|----------|----------|
| `SAMARKAND_WEAPON` | Weapon Trader | ~11150 | ~9100 | WEAPON_TRADER | Armes 7D-9D |
| `SAMARKAND_ARMOR` | Armor Trader | ~11100 | ~9050 | ARMOR_TRADER | Armures |
| `SAMARKAND_POTION` | Potion Trader | ~11050 | ~9150 | POTION_TRADER | Potions |
| `SAMARKAND_ACCESSORY` | Accessory Trader | ~11200 | ~9080 | ACCESSORY_TRADER | Accessoires |
| `SAMARKAND_SPECIALTY` | Specialty Trader | ~11080 | ~9020 | SPECIALTY_TRADER | Matériaux |
| `SAMARKAND_STORAGE` | Storage Keeper | ~11120 | ~9180 | STORAGE_KEEPER | Entrepôt |
| `SAMARKAND_STABLE` | Stable Master | ~11180 | ~9200 | STABLE_MASTER | Montures |
| `SAMARKAND_GUILD` | Guild Manager | ~11220 | ~9120 | GUILD_MANAGER | Guilde |

#### Job NPCs

| NPC ID | Nom | X | Y | Fonction |
|--------|-----|---|---|----------|
| `SAMARKAND_TRADER` | Trader Union | ~10980 | ~8950 | TRADER_UNION |
| `SAMARKAND_HUNTER` | Hunter Associate | ~10950 | ~8920 | HUNTER_UNION |
| `SAMARKAND_THIEF` | Thief NPC | ~10920 | ~8890 | THIEF_NPC |

---

## 💼 Job NPCs par Ville

### Summary Table

| Ville | Trader Union | Hunter Union | Thief NPC |
|-------|--------------|--------------|-----------|
| **Jangan** | Trader Union (X: ~1980, Y: ~950) | Hunter Gwakwi (X: ~1950, Y: ~920) | Thief Yumi (X: ~1920, Y: ~890) |
| **Donwhang** | Trader Union (X: ~7980, Y: ~2950) | Hunter Haraho (X: ~7950, Y: ~2920) | Thief NPC (X: ~7920, Y: ~2890) |
| **Hotan** | Trader Union (X: ~13980, Y: ~4950) | Hunter Ahmok (X: ~13950, Y: ~4920) | Thief NPC (X: ~13920, Y: ~4890) |
| **Constantinople** | Merchant Tana (X: -17300, Y: 600) | Hunter Adria (X: -16950, Y: 650) | Smuggler Raul (X: -16850, Y: 590) |
| **Alexandria** | Trader Nawoonakeuteu (X: 18170, Y: 18090) | Hunter Carrymer (X: 18210, Y: 18110) | N/A (via quests) |

---

## 👹 Unique Boss Spawn Locations

### Coordonnées Précises de Spawn

| Unique | Level | X | Y | Zone | HP |
|--------|-------|---|---|------|-----|
| **Tiger Girl** | 20 | 4853.28 | 93.81 | Tiger Mountain (Jangan) | 598,720 |
| **Cerberus** | 24 | -1551.74 | -93.72 | Constantinople (Desperado Hill) | 693,072 |
| **Cerberus** | 24 | -1291.27 | -133.04 | Constantinople (Alt spawn) | 693,072 |
| **Captain Ivy** | 30 | -6424.71 | 2744.64 | Asia Minor (Amphitheater) | 1,094,835 |
| **Isyutaru** | 40 | ~12000 | ~6500 | Donwhang Area | ~2,500,000 |
| **Uruchi** | 50 | ~15000 | ~7500 | Hotan Area | ~4,000,000 |
| **Lord Yarkan** | 60 | ~18000 | ~8500 | Egypt Area | ~6,000,000 |
| **Cerberus (Strong)** | 70 | -1600 | -100 | Constantinople Area | ~8,000,000 |
| **Captain Ivy (Strong)** | 75 | -6400 | 2700 | Asia Minor | ~10,000,000 |
| **Medusa** | 90 | ~19000 | ~17000 | Alexandria Area | ~15,000,000 |
| **Lady Lyn** | 100 | ~20000 | ~18000 | Egypt Tomb | ~20,000,000 |
| **Sphinx** | 90 | Tomb B1-B2 | - | Pharaoh's Tomb | ~12,000,000 |
| **Sekhmet** | 92 | Tomb B2-B3 | - | Pharaoh's Tomb | ~13,000,000 |
| **Nephthys** | 95 | Tomb B3-B4 | - | Pharaoh's Tomb | ~14,000,000 |
| **Horus** | 98 | Tomb B4-B5 | - | Pharaoh's Tomb | ~16,000,000 |
| **Osiris** | 100 | Tomb B5-B6 | - | Pharaoh's Tomb | ~18,000,000 |

**Note:** Les coordonnées exactes pour certains uniques peuvent varier entre les serveurs officiels et privés.

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

#### Structure de Données JSON

```javascript
// Fichier: data/npcs.json
{
  "npcs": [
    {
      "id": "ALEX_WEAPON_HEMAKA",
      "name": "Blacksmith Hemaka",
      "city": "Alexandria",
      "position": { "x": 18234, "y": 18345, "z": 0 },
      "rotation": 0,
      "function": "WEAPON_TRADER",
      "services": ["SELL_WEAPONS", "REPAIR"],
      "shop_inventory": {
        "weapons_10d": ["SWORD_10D_01", "SWORD_10D_02", ...],
        "weapons_11d": ["SWORD_11D_01", ...]
      },
      "model": {
        "mesh": "npc_weapon_trader_alex",
        "texture": "npc_cloth_01",
        "scale": 1.0
      }
    },
    // ... autres NPCs
  ]
}
```

#### Chargement et Utilisation

```javascript
// Exemple de chargement des NPCs
class NPCManager {
  async loadNPCs() {
    const response = await fetch('/data/npcs.json');
    const data = await response.json();
    return data.npcs;
  }

  spawnNPC(npcData, scene) {
    const npc = new NPC(npcData);
    npc.mesh.position.set(npcData.position.x, npcData.position.y, npcData.position.z);
    scene.add(npc.mesh);
    return npc;
  }

  getNearestNPC(playerPosition, functionType, maxDistance = 100) {
    return this.npcs.filter(npc =>
      npc.function === functionType &&
      npc.position.distanceTo(playerPosition) <= maxDistance
    ).sort((a, b) =>
      a.position.distanceTo(playerPosition) - b.position.distanceTo(playerPosition)
    )[0];
  }
}
```

#### Optimisation du Rendu

```javascript
// Streaming des NPCs par zone
class NPCStreaming {
  constructor(worldSize = 50000) {
    this.chunkSize = 5000; // 5km x 5km chunks
    this.loadedChunks = new Set();
  }

  update(playerPosition) {
    const chunkX = Math.floor(playerPosition.x / this.chunkSize);
    const chunkY = Math.floor(playerPosition.y / this.chunkSize);
    const chunkKey = `${chunkX}_${chunkY}`;

    if (!this.loadedChunks.has(chunkKey)) {
      this.loadChunk(chunkX, chunkY);
      this.loadedChunks.add(chunkKey);
    }
  }

  async loadChunk(chunkX, chunkY) {
    const npcs = await fetchNPCsInChunk(chunkX, chunkY);
    npcs.forEach(npc => this.spawnNPC(npc));
  }
}
```

#### Système d'Interaction

```javascript
// Détection d'interaction avec les NPCs
class NPCInteraction {
  checkInteraction(player, npcs) {
    const interactionRange = 50; // unités de jeu

    for (const npc of npcs) {
      const distance = player.position.distanceTo(npc.position);
      if (distance <= interactionRange) {
        return npc;
      }
    }
    return null;
  }

  openDialog(player, npc) {
    switch (npc.function) {
      case 'WEAPON_TRADER':
        this.openShop(player, npc);
        break;
      case 'STORAGE_KEEPER':
        this.openStorage(player, npc);
        break;
      case 'QUEST_NPC':
        this.openQuestDialog(player, npc);
        break;
      default:
        this.openDefaultDialog(player, npc);
    }
  }
}
```

#### Marqueurs sur la Minimap

```javascript
// Affichage des NPCs sur la minimap
class MinimapNPCs {
  renderNPCs(npcs, playerPosition) {
    const visibleRange = 2000;

    npcs.forEach(npc => {
      const distance = npc.position.distanceTo(playerPosition);
      if (distance <= visibleRange) {
        const screenPos = this.worldToScreen(npc.position);
        this.drawMarker(screenPos, npc.function);
      }
    });
  }

  getMarkerColor(functionType) {
    const colors = {
      'WEAPON_TRADER': '#FF5733',
      'ARMOR_TRADER': '#33FF57',
      'POTION_TRADER': '#3357FF',
      'STORAGE_KEEPER': '#F333FF',
      'GUILD_MANAGER': '#FF33A8',
      'TRADER_UNION': '#FFAA00',
      'HUNTER_UNION': '#00AAFF',
      'THIEF_NPC': '#AA0000'
    };
    return colors[functionType] || '#FFFFFF';
  }
}
```

---

## 🔍 Méthodes de Collecte des Coordonnées

### Sources pour Coordonnées Exactes

1. **xSROMap (Interactive)**
   - URL: https://jellybitz.github.io/xSROMap/
   - Recherche par nom de NPC
   - Affichage direct des coordonnées X/Y
   - Export possible des données

2. **In-Game Coordinates**
   - Commande: `/loc` (sur certains serveurs)
   - Mini-map avec coordonnées
   - Debug mode (si disponible)

3. **PK2 Editor**
   - Extraction des fichiers de données
   - Coordonnées brutes des NPCs
   - Mapping des zones

### Format de Coordonnées

Silkroad Online utilise deux systèmes de coordonnées:

**Format 1: PosX, PosY**
- Utilisé en interne
- Grande échelle (ex: 18234, 18345)

**Format 2: X, Y, Z**
- Format standard 3D
- Z est généralement 0 dans les villes
- Utilisé par xSROMap

---

## 📊 Statistiques

### Résumé des NPCs par Ville

| Ville | Total NPCs | Commerçants | Job NPCs | Quest NPCs | Autres |
|-------|-----------|-------------|----------|------------|--------|
| **Alexandria** | 23 | 5 | 2 | 8 | 8 |
| **Constantinople** | 47 | 10 | 5 | 10 | 22 |
| **Jangan** | 15 | 7 | 3 | 3 | 2 |
| **Donwhang** | 15 | 7 | 3 | 2 | 3 |
| **Hotan** | 15 | 7 | 3 | 2 | 3 |
| **Samarkand** | 15 | 7 | 3 | 2 | 3 |
| **TOTAL** | 130 | 43 | 19 | 27 | 41 |

### NPCs par Fonction

| Fonction | Compte | Pourcentage |
|----------|--------|-------------|
| Weapon Trader | 6 | 4.6% |
| Armor Trader | 6 | 4.6% |
| Potion Trader | 6 | 4.6% |
| Accessory Trader | 6 | 4.6% |
| Specialty Trader | 6 | 4.6% |
| Storage Keeper | 6 | 4.6% |
| Stable Master | 6 | 4.6% |
| Guild Manager | 6 | 4.6% |
| Trader Union | 6 | 4.6% |
| Hunter Union | 6 | 4.6% |
| Thief NPCs | 5 | 3.8% |
| Quest NPCs | 27 | 20.8% |
| Guards | 20 | 15.4% |
| Guides | 8 | 6.2% |
| Autres | 10 | 7.7% |

---

## 🎯 Prochaines Étapes

1. **Coordonnées Précises:**
   - Utiliser xSROMap pour extraire les coordonnées X/Y exactes
   - Exporter les données dans un format structuré
   - Valider les coordonnées in-game

2. **Données Manquantes:**
   - Coordonnées des NPCs de Jangan, Donwhang, Hotan (à préciser)
   - Coordonnées des NPCs de zones extérieures
   - Points de spawn des monstres

3. **Intégration:**
   - Importer les données dans le système de navigation
   - Créer les marqueurs sur la carte/minimap
   - Implémenter le système d'interaction

---

*Dernière mise à jour: 20 Janvier 2026*

*Sources: xSROMap, SRO Lobby Forums, Silkroad Secrets, SRObro Project Documentation*
