# Forgotten World - Guide Complet

## 📋 Table des Matières
- [Introduction](#introduction)
- [Conditions d'Entrée](#conditions-dentrée)
- [Les Différents Donjons](#les-différents-donjons)
- [Système de Difficulté](#système-de-difficulté)
- [Mécaniques de Jeu](#mécaniques-de-jeu)
- [Système de Talismans](#système-de-talismans)
- [Boss et Récompenses](#boss-et-récompenses)
- [Stratégies de Groupe](#stratégies-de-groupe)
- [Forgotten Coins System](#forgotten-coins-system)
- [Implémentation Technique](#implémentation-technique)
- [Sources](#sources)

---

## 🎯 Introduction

**Le Forgotten World (FW)** est un système d'instances dungeons introduit avec **Legend VI**, offrant aux joueurs des défis de groupe avec des récompenses exclusives. C'est l'une des activités les plus populaires de Silkroad Online pour les joueurs de niveau **35 à 110**.

### Points Clés
- ✅ **Instances de groupe** pour 2-8 joueurs
- ✅ **Niveaux 35-110** avec différents donjons par tranche de niveaux
- ✅ **Système de collections** avec 8 talismans par set
- ✅ **Récompenses uniques** : armures, armes, SP, Forgotten Coins
- ✅ **Différentes difficultés** : 1 à 4 étoiles
- ✅ **Quêtes journalières** et récompenses

---

## 🔑 Conditions d'Entrée

### Niveau Requis
- **Niveau minimum** : 35
- **Niveau maximum** : 110
- Chaque donjon s'adresse à une tranche de niveaux spécifique

### Dimension Hole (Ticket d'Entrée)

Pour entrer dans un Forgotten World, vous devez obtenir un **Dimension Hole** :

#### Comment Obtenir un Dimension Hole
1. Trouver un **Dimension Pillar** (Red Crystal Talisman) dans le monde
2. Détruire le pilier
3. Le Dimension Hole apparaît dans votre inventaire

#### Où Trouver les Dimension Pillars
- **N'importe où dans le monde** de Silkroad
- Apparaissent aléatoirement comme des cristaux rouges
- Visible sur la carte comme des points rouges
- Généralement dans les zones de monstres de niveau moyen à élevé

### Durée et Restrictions
- **Durée de l'instance** : 30-60 minutes (selon le donjon)
- **Limite d'entrées** : 3-5 par jour (selon le serveur)
- **Taille du groupe** : 2-8 joueurs recommandé
- **Restriction de niveau** : Doit correspondre au donjon (ex: 51-60 pour Togui Village)

---

## 🗺️ Les Différents Donjons

Il existe plusieurs instances Forgotten World, chacune avec son thème et sa tranche de niveaux :

### 1. Togui Village (Niveau 51-60)
- **Type** : Village fantôme japonais
- **Degree** : 8D
- **Collection** : The Phantom of the Crimson Blood
- **Localisation** : près de Hotan
- **Difficulty** : ★ à ★★★★

### 2. Flame Mountain (Niveau 61-70)
- **Type** : Volcan enflammé
- **Degree** : 9D
- **Collection** : The Burning Abyss
- **Thème** : Feu et lave

### 3. Green Abyss (Niveau 71-80)
- **Type** : Forêt maudite
- **Degree** : 10D
- **Collection** : The Green Abyss
- **Thème** : Nature corrompue

### 4. Sea of Resentment (Niveau 81-90)
- **Type** : Ruines sous-marines
- **Degree** : 11D
- **Collection** : The Sea of Resentment
- **Thème** : Eau et esprits

### 5. Shipwreck Dimension (Niveau 91-100)
- **Type** : Épave de navire
- **Degree** : 12D
- **Collection** : Shipwreck
- **Boss** : Sereness Ghost

### 6. Temple of Egypt (Niveau 101-110)
- **Type** : Temple égyptien
- **Degree** : 13D
- **Collection** : Egypt
- **Meilleures récompenses**

---

## ⭐ Système de Difficulté

Chaque donjon Forgotten World dispose de **4 niveaux de difficulté** (étoiles) :

### ★ 1 Star (Facile)
- **HP des monstres** : 100%
- **Dégâts des monstres** : 100%
- **Drop Rate Talismans** : Bas (1x)
- **Recommended** : Groupe débutant ou équipement moyen

### ★★ 2 Stars (Normal)
- **HP des monstres** : 150%
- **Dégâts des monstres** : 120%
- **Drop Rate Talismans** : Moyen (2x)
- **Recommended** : Groupe expérimenté

### ★★★ 3 Stars (Difficile)
- **HP des monstres** : 200%
- **Dégâts des monstres** : 150%
- **Drop Rate Talismans** : Élevé (4x)
- **Recommended** : Groupe bien équipé, 8 joueurs
- **Bonus** : Arena Coins en récompense

### ★★★★ 4 Stars (Extrême)
- **HP des monstres** : 300%
- **Dégâts des monstres** : 200%
- **Drop Rate Talismans** : Très élevé (8x)
- **Recommended** : Full party 8/8, équipement SOX+, full buffs
- **Bonus** : Meilleures récompenses, plus de Forgotten Coins

### Exemple de Drop Rates par Donjon
| Donjon | Base Rate | ★ | ★★ | ★★★ | ★★★★ |
|--------|-----------|---|----|-----|------|
| Togui Village | 100x | 1x | 2x | 4x | 8x |
| Flame Mountain | 70x | 0.7x | 1.4x | 2.8x | 5.6x |

---

## ⚔️ Mécaniques de Jeu

### Déroulement d'une Instance

#### Phase 1: Entrée et Préparation
1. **Le leader de party** utilise le Dimension Hole
2. **Toute la party** est téléportée dans l'instance
3. **Timer démarre** (30-60 minutes selon le donjon)
4. **Buffez votre groupe** avant d'engager

#### Phase 2: Clear des Salles
1. **Chaque salle** contient des monstres à éliminer
2. **Tous les monstres** doivent mourir pour débloquer la porte suivante
3. **Treasure Boxes** apparaissent après avoir clear une salle
4. **Les Talismans** drop des chests et des mobs uniques

#### Phase 3: Boss Unique
- **Elder Earth Ghost** apparaît à mi-parcours
- **Doit être tué** pour progresser
- **Drop des talismans** supplémentaires

#### Phase 4: Boss Final - Sereness Ghost
1. Apparaît **après avoir tué TOUS les monstres** du donjon
2. **HP élevé** (plusieurs millions)
3. **Skills puissantes** : AOE, debuffs, knockdowns
4. **Drop des récompenses finales** :
   - Arme scellée (SOS/SOM/SOSun selon grade)
   - Talismans manquants
   - Forgotten Coins (sur certains serveurs)

### Système de Portes et Salles

```typescript
// Structure d'une instance Forgotten World
interface FGWRoom {
  id: number;
  name: string;
  monsters: Monster[];
  treasureBox?: TreasureBox;
  nextRoom: number;
  isCleared: boolean;
}

interface FGWDungeon {
  name: string;
  levelRange: [number, number];
  rooms: FGWRoom[];
  boss: FGWBoss;
  difficulty: 1 | 2 | 3 | 4;
  timeLimit: number; // en minutes
}
```

---

## 🃏 Système de Talismans

### Collections de Talismans

Chaque donjon possède sa propre **collection de 8 talismans** uniques.

### Collection 1: The Phantom of the Crimson Blood (Togui Village - 8D)

Les 8 talismans à collecter :

1. **Red Tears** (Larmes Rouges)
2. **Western Scriptures** (Scriptures Occidentales)
3. **Togui Mask** (Masque de Togui)
4. **Red Talisman** (Talisman Rouge)
5. **Puppet** (Poupée)
6. **Dull Kitchen Knife** (Couteau de Cuisine Émoussé)
7. **Spell Paper** (Papier de Sort)
8. **Elder Staff** (Bâillon des Anciens)

### Collection 2: The Burning Abyss (Flame Mountain - 9D)

Les 8 talismans à collecter :

1. **Fire Flower** (Fleur de Feu)
2. **Horned Cattle** (Bovin Cornu)
3. **Flame of Oblivion** (Flamme de l'Oubli)
4. **Flame Paper** (Papier de Flamme)
5. **Hearthstone Flame** (Flamme de Foyer)
6. **Silver Pendant** (Pendentif en Argent)
7. **Cobalt** (Cobalt)
8. **Obsidian Shard** (Éclat d'Obsidienne)

### Collection 3: The Green Abyss (10D)

Talismans de la collection (liste partielle) :

1. **Jade Crystal** (Cristal de Jade)
2. **Poison Ivy Leaf** (Feuille de Lierre Poison)
3. **Spirit Orb** (Orbe Spirituel)
4. **Ancient Root** (Racine Ancienne)
5-8. *(Talismans supplémentaires)*

### Collection 4: The Sea of Resentment (11D)

Talismans de la collection (liste partielle) :

1. **Coral Fragment** (Fragment de Corail)
2. **Mermaid Tear** (Larme de Sirène)
3. **Drowned Captain's Hat** (Chapeau du Capitaine Noyé)
4. **Sea Spirit Scale** (Écaille d'Esprit de Mer)
5-8. *(Talismans supplémentaires)*

### Comment Compléter une Collection

#### Étape 1: Collecter les Talismans
- **Loot les Treasure Boxes** dans chaque salle
- **Tuer l'Elder Earth Ghost** unique
- **Tuer le boss final Sereness**
- **Les talismans drop** aléatoirement de ces sources

#### Étape 2: Enregistrer dans le Collection Book
1. Ouvrez votre **Inventory**
2. Cliquez sur l'onglet **Collection**
3. **Cliquez droit** sur chaque talisman pour l'enregistrer
4. La progression s'affiche (ex: 3/8)

#### Étape 3: Compléter la Quête
Une fois les **8 talismans collectés** :
1. Retournez auprès du **NPC de quête Forgotten World**
2. **Activez la quête de récompense**
3. **Choisissez votre récompense** selon votre collection

---

## 🏆 Boss et Récompenses

### Boss Principaux

#### 1. Elder Earth Ghost (Unique de Mi-Donjon)
- **Level** : Selon le donjon (51-110)
- **HP** : ~500,000 - 2,000,000
- **Skills** :
  - Earthquake AOE (dégâts de zone)
  - Rock Throw (projets de rochers)
  - Defense Up (buff de défense)
- **Drops** :
  - 1-3 Talismans aléatoires
  - Gold (100,000 - 500,000)
  - Potions/Consommables

#### 2. Sereness Ghost (Boss Final)
**Le boss principal de TOUS les Forgotten Worlds**

- **Level** : Selon le donjon
- **HP** : ~2,000,000 - 10,000,000
- **Skills** :
  - **Scream AOE** : Dégâts magiques dans une large zone
  - **Ghost Fire** : DoT (damage over time) de feu
  - **Curse** : Debuff -50% défense
  - **Summon Ghosts** : Invoque des esprits auxiliaires
  - **Teleport** : Se téléporte aléatoirement

- **Stratégie** :
  - **Tank** maintient l'aggro avec defense buffs
  - **Nukers** attaquent à distance
  - **Clerics/Bards** heal et purge les debuffs
  - **Évitez l'AOE** en vous écartant pendant le cast

### Récompenses par Collection

#### Grade ★ - Facile
- **Arme** : Sealed 8D-13D (normale)
- **Stats** : +0, sans blues
- **SP** : 0
- **Coins** : 0-5 Forgotten Coins

#### Grade ★★ - Normal
- **Arme** : Sealed 8D-13D
- **Stats** : +3-5, 1-2 blues
- **SP** : 100,000
- **Coins** : 5-10 Forgotten Coins

#### Grade ★★★ - Difficile
- **Arme** : Sealed of Star (SOS) 8D-13D
- **Stats** : +5-7, 3-4 blues
- **SP** : 250,000
- **Coins** : 10-20 Forgotten Coins
- **Bonus** : Arena Coins × 50

#### Grade ★★★★ - Extrême
- **Arme** : Sealed of Star/Moon (SOS/SOM) 8D-13D
- **Stats** : +7-9, 4-5 blues maximum
- **SP** : 500,000
- **Coins** : 20-50 Forgotten Coins
- **Bonus** : Arena Coins × 100 + Chance SOSun

### Récompenses Uniques

#### Armes Spéciales
Certains donjons drop des armes spéciales :
- **A-grade Shield** (Chinese ou European)
- **B-grade Weapon** (arme de grade B, rare)
- **Nova A/B Egypt Weapons** (sur certains serveurs)

#### Forgotten Coins System
Sur les serveurs modernes/private servers :
- **Treasure Boxes drop des Forgotten Coins** au lieu de talismans directs
- **Coins peuvent être échangés** contre n'importe quel talisman
- **Système sans RNG** : vous choisissez ce qu vous manque
- **Shop NPC** : Forgotten World Coin Trader

```typescript
// Exemple d'échange Forgotten Coins
interface ForgottenCoinShop {
  talismans: {
    name: string;
    cost: number; // en coins
    stock: number; // illimité ou limité
  }[];
}

// Prix exemple
const TALISMAN_PRICES = {
  RED_TEARS: 5,        // 5 Forgotten Coins
  WESTERN_SCRIPTURES: 5,
  TOGUI_MASK: 10,      // Plus rare
  ELDER_STAFF: 15,     // Très rare
};
```

---

## 👥 Stratégies de Groupe

### Composition Optimale de Party

#### Groupe 8 Joueurs (Recommandé pour ★★★ et ★★★★)

**Tank (1-2)**
- **Warrior (European)** ou **Spear/Glaive (Chinese)**
- Rôle : Maintenir l'aggro, encaisser les dégâts
- Gear : Armor set, high defense, shield

**Nukers (2-3)**
- **Wizard (European)** ou **Fire/Lightning Nuker (Chinese)**
- Rôle : Dégâts magiques à distance
- Gear : Garment set, high MAG attack, MP potions

**Damage Dealers (1-2)**
- **Rogue (European)** ou **Bow (Chinese)**
- Rôle : Dégâts physiques rapides, critical hits
- Gear : Protector/Garment, high PHY attack

**Support (2)**
- **Cleric (European)** ou **Bard (European)**
- Rôle : Healing, buffs, debuff purge
- Gear : Garment, high MP, healing spells

**Hybrid (Optionnel)**
- **Warlock** pour les debuffs
- **2H Warrior** pour dégâts + off-tank

### Tactics par Donjon

#### Togui Village (51-60)
- **Clear rapide** des salles 1-3
- **Focus Elder Earth Ghost** en premier
- **N'oubliez pas les Treasure Boxes** dans chaque coin
- **Boss Sereness** : Évitez l'AOE, kitez si nécessaire

#### Flame Mountain (61-70)
- **Fire resistance** recommandée (Cold armor buff)
- **Attention aux pièges de lave** au sol
- **Range attacks** privilégiées
- **Potions de feu** nécessaires

#### Green Abyss (71-80)
- **Poison resistance** (Bard/Cleric heals)
- **Monstres plus agressifs**
- **Stay grouped** pour éviter l'aggro multiple
- **Crowd control** indispensable

#### Sea of Resentment (81-90)
- **Water resistance** utile
- **Ghosts sont immunisés** à certains debuffs
- **AOE attacks** très fréquentes
- **Mana potions** en quantité

#### Shipwreck (91-100)
- **Spaces réduits**, attention au placement
- **Boss Sereness** plus difficile ici
- **Full buffs** obligatoires
- **Resurrections scrolls** recommandés

#### Temple of Egypt (101-110)
- **Donjon le plus difficile**
- **Full party 8/8** requise
- **Top equipment** (SOM/SOSun+)
- **Multiple uniques** dans une seule run
- **Récompenses les plus précieuses**

---

## 💰 Forgotten Coins System

### Vue d'Ensemble

Le **Forgotten Coins System** est une alternative au système traditionnel de talismans, introduite sur certains serveurs pour réduire la frustration du RNG.

### Comment Ça Marche

#### Étape 1: Farm des Coins
- **Treasure Boxes** drop des **Forgotten World Coins** au lieu de talismans
- **Quantité** : 1-5 coins par chest
- **Boss drops** : 10-20 coins par boss (Elder Earth Ghost, Sereness)
- **Grade influence** : Plus difficile = plus de coins

#### Étape 2: Shop Échange
Un **NPC spécial** permet d'échanger les coins :

```typescript
// Structure du shop Forgotten Coins
interface CoinShopItem {
  id: string;
  name: string;
  talismanType: string;
  cost: number; // en Forgotten Coins
  dungeon: string; // quel donjon
}

// Exemple de prix
const COIN_SHOP_ITEMS: CoinShopItem[] = [
  {
    id: "red_tears_togui",
    name: "Red Tears",
    talismanType: "The Phantom of the Crimson Blood",
    cost: 5,
    dungeon: "Togui Village"
  },
  {
    id: "togui_mask",
    name: "Togui Mask",
    talismanType: "The Phantom of the Crimson Blood",
    cost: 10, // Plus rare
    dungeon: "Togui Village"
  },
  {
    id: "fire_flame_flame",
    name: "Fire Flower",
    talismanType: "The Burning Abyss",
    cost: 8,
    dungeon: "Flame Mountain"
  }
];
```

#### Avantages du Système Coins
✅ **Pas de RNG frustrant** : vous choisissez ce qu vous voulez
✅ **Accumulation possible** : farmez plusieurs runs, achetez ce qu'il vous manque
✅ **Trade possible** : sur certains serveurs, les coins sont tradeables
✅ **Équilibré** : les talismans les plus rares coûtent plus cher

#### Taux de Drop par Grade

| Grade | Coins par Chest | Coins Boss Unique | Total par Run |
|-------|-----------------|-------------------|---------------|
| ★     | 1-2             | 5-10              | ~20-40        |
| ★★    | 2-3             | 10-15             | ~40-70        |
| ★★★   | 3-5             | 15-20             | ~70-120       |
| ★★★★  | 5-8             | 20-30             | ~120-200      |

### Calcul de Coût Exemple

**Collection Complète : Togui Village (8 talismans)**

```
Talismans communs (5×) : 5 coins chacun = 25 coins
Talismans rares (2×)    : 10 coins chacun = 20 coins
Talisman ultra-rare (1×): 15 coins = 15 coins
TOTAL pour 8/8          : 60 Forgotten Coins
```

**Runs nécessaires par grade** :
- ★★★★ : 1 run (200 coins) → vous pouvez faire 3 collections complètes!
- ★★★ : 1 run (120 coins) → 2 collections complètes
- ★★ : 2 runs (70 coins/run)
- ★ : 3 runs (40 coins/run)

---

## 🛠️ Implémentation Technique

### Architecture du Système Forgotten World

```typescript
// Modèle de données pour Forgotten World
interface FGWDungeonConfig {
  id: string;
  name: string;
  levelRange: [number, number];
  degree: number;
  difficulty: 1 | 2 | 3 | 4;
  timeLimit: number; // en secondes
  maxPlayers: number;
  monsters: FGWMonsterConfig[];
  bosses: FGWBossConfig[];
  talismanCollection: string[];
  rewards: FGWRewardConfig[];
}

interface FGWMonsterConfig {
  id: string;
  name: string;
  level: number;
  hp: number;
  attack: number;
  defense: number;
  position: { x: number; y: number; z: number };
  drops: FGWDropConfig[];
}

interface FGWBossConfig {
  id: string;
  name: string;
  level: number;
  hp: number;
  skills: FGWSkillConfig[];
  phase: 'mid' | 'final';
  position: { x: number; y: number; z: number };
  drops: FGWDropConfig[];
}

interface FGWDropConfig {
  itemType: 'talisman' | 'coin' | 'gold' | 'consumable';
  itemId?: string;
  coinAmount?: number;
  goldAmount?: number;
  dropRate: number; // 0.0 à 1.0
}

interface FGWSkillConfig {
  name: string;
  type: 'damage' | 'debuff' | 'summon' | 'teleport';
  damage?: number;
  aoe?: boolean;
  cooldown: number; // en ms
}
```

### Système d'Instance

```typescript
class FGWInstanceManager {
  private instances: Map<string, FGWInstance> = new Map();

  // Créer une nouvelle instance
  createInstance(
    partyId: string,
    dungeonId: string,
    difficulty: number
  ): FGWInstance {
    const config = this.getDungeonConfig(dungeonId);
    const instance: FGWInstance = {
      id: this.generateInstanceId(),
      partyId,
      dungeonId,
      difficulty,
      startTime: Date.now(),
      timeLimit: config.timeLimit,
      players: [],
      currentRoom: 0,
      roomsCleared: [],
      bossesKilled: [],
      talismansCollected: [],
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  // Téléporter la party dans l'instance
  teleportPartyToInstance(partyId: string, instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Instance not found');

    const party = this.getParty(partyId);
    party.members.forEach(member => {
      this.teleportPlayer(member, instance.spawnPoint);
    });
  }

  // Gérer la mort d'un monstre
  onMonsterKilled(
    instanceId: string,
    monsterId: string,
    killerId: string
  ): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    const monster = instance.monsters.get(monsterId);
    if (!monster) return;

    // Supprimer le monstre
    instance.monsters.delete(monsterId);

    // Générer les drops
    const drops = this.generateDrops(monster.drops, instance.difficulty);
    drops.forEach(drop => {
      this.spawnDrop(drop, monster.position);
    });

    // Vérifier si la salle est clear
    this.checkRoomCleared(instance);
  }

  // Vérifier si tous les monstres de la salle sont morts
  private checkRoomCleared(instance: FGWInstance): void {
    const currentRoom = instance.rooms[instance.currentRoom];
    const remainingMonsters = currentRoom.monsters.filter(m =>
      instance.monsters.has(m.id)
    );

    if (remainingMonsters.length === 0) {
      // Salle clear
      instance.roomsCleared.push(instance.currentRoom);

      // Spawn Treasure Box
      this.spawnTreasureBox(instance, currentRoom.treasureBoxPosition);

      // Ouvrir la porte vers la salle suivante
      this.openDoor(instance, instance.currentRoom + 1);
    }
  }

  // Générer les drops selon la difficulté
  private generateDrops(
    drops: FGWDropConfig[],
    difficulty: number
  ): FGWDrop[] {
    const dropMultiplier = Math.pow(2, difficulty - 1); // 1, 2, 4, 8
    const generatedDrops: FGWDrop[] = [];

    drops.forEach(drop => {
      if (Math.random() < drop.dropRate * dropMultiplier) {
        if (drop.itemType === 'coin') {
          // Système Forgotten Coins
          const coinAmount = drop.coinAmount! * difficulty;
          generatedDrops.push({
            type: 'coin',
            amount: coinAmount,
          });
        } else if (drop.itemType === 'talisman') {
          // Système traditionnel
          generatedDrops.push({
            type: 'talisman',
            itemId: drop.itemId!,
          });
        }
      }
    });

    return generatedDrops;
  }

  // Gérer l'entrée du boss final
  onAllRoomsCleared(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    // Spawn Sereness Ghost
    const bossConfig = instance.config.bosses.find(b => b.phase === 'final');
    if (bossConfig) {
      this.spawnBoss(instance, bossConfig);
      this.notifyPlayers(instance, 'Sereness Ghost has appeared!');
    }
  }
}
```

### Système de Collections

```typescript
class FGWCollectionSystem {
  private playerCollections: Map<string, PlayerCollection> = new Map();

  // Enregistrer un talisman dans la collection
  registerTalisman(
    playerId: string,
    dungeonId: string,
    talismanId: string
  ): void {
    const collection = this.getPlayerCollection(playerId, dungeonId);

    if (!collection.collectedTalismans.includes(talismanId)) {
      collection.collectedTalismans.push(talismanId);
      this.notifyProgress(playerId, collection);

      // Vérifier si la collection est complète
      if (this.isCollectionComplete(collection)) {
        this.onCollectionComplete(playerId, dungeonId);
      }
    }
  }

  // Vérifier si la collection est complète (8/8)
  private isCollectionComplete(collection: PlayerCollection): boolean {
    return collection.collectedTalismans.length >= 8;
  }

  // Callback quand collection complète
  private onCollectionComplete(playerId: string, dungeonId: string): void {
    // Offrir la quête de récompense
    const quest = this.createRewardQuest(playerId, dungeonId);
    this.questSystem.addQuest(playerId, quest);

    // Notifier le joueur
    this.notifyPlayer(playerId, {
      type: 'fgw_collection_complete',
      dungeon: dungeonId,
      questId: quest.id,
    });
  }

  // Échanger des Forgotten Coins contre talisman
  exchangeCoinsForTalisman(
    playerId: string,
    dungeonId: string,
    talismanId: string
  ): void {
    const player = this.getPlayer(playerId);
    const talisman = this.getTalismanConfig(dungeonId, talismanId);
    const coinCost = talisman.coinCost;

    // Vérifier si le joueur a assez de coins
    if (player.forgottenCoins < coinCost) {
      throw new Error('Not enough Forgotten Coins');
    }

    // Déduire les coins
    player.forgottenCoins -= coinCost;

    // Ajouter le talisman
    this.addItem(player, talismanId);

    // Enregistrer dans la collection
    this.registerTalisman(playerId, dungeonId, talismanId);
  }
}
```

### Système de Boss - Sereness Ghost

```typescript
class SerenessGhostAI extends BossAI {
  private phase: 1 | 2 | 3 = 1;
  private lastSkillTime: number = 0;

  update(deltaTime: number): void {
    const hpPercent = this.currentHp / this.maxHp;

    // Phase 1: 100% - 70% HP
    if (hpPercent > 0.7) {
      this.phase1Behavior();
    }
    // Phase 2: 70% - 30% HP
    else if (hpPercent > 0.3) {
      if (this.phase !== 2) {
        this.enterPhase2();
      }
      this.phase2Behavior();
    }
    // Phase 3: 30% - 0% HP (Enrage)
    else {
      if (this.phase !== 3) {
        this.enterPhase3();
      }
      this.phase3Behavior();
    }
  }

  private phase1Behavior(): void {
    // Attaques normales + Coup de pied occasionnel
    if (this.canCastSkill('BasicAttack', 2000)) {
      this.castSkill('BasicAttack', this.target);
    }

    if (Math.random() < 0.01) { // 1% par frame
      this.castSkill('Kick', this.target);
    }
  }

  private enterPhase2(): void {
    this.phase = 2;
    this.shout('You shall not pass!');
    this.castSkill('ScreamAOE'); // AOE immédiat
  }

  private phase2Behavior(): void {
    // AOE plus fréquent + Ghost Fire DoT
    if (this.canCastSkill('ScreamAOE', 15000)) {
      this.castSkill('ScreamAOE');
      this.announce('Sereness prepares a powerful scream!');
    }

    if (this.canCastSkill('GhostFire', 8000)) {
      this.castSkill('GhostFire', this.randomTarget());
    }

    // Attaques normales
    if (this.canCastSkill('BasicAttack', 2000)) {
      this.castSkill('BasicAttack', this.target);
    }
  }

  private enterPhase3(): void {
    this.phase = 3;
    this.shout('I shall not perish!');
    this.castSkill('Curse'); // Debuff -50% defense sur tous les joueurs
    this.buffSelf('Enrage', { attack: 2.0 }); // Double dégâts
  }

  private phase3Behavior(): void {
    // Enrage: toutes les skills sont plus rapides
    if (this.canCastSkill('ScreamAOE', 10000)) {
      this.castSkill('ScreamAOE');
    }

    if (this.canCastSkill('GhostFire', 5000)) {
      this.castSkill('GhostFire', this.randomTarget());
    }

    if (this.canCastSkill('SummonGhosts', 20000)) {
      this.castSkill('SummonGhosts'); // Invoque des esprits
    }

    // Téléport aléatoire
    if (Math.random() < 0.005) {
      this.teleport(this.randomPosition());
    }

    // Attaques normales très rapides
    if (this.canCastSkill('BasicAttack', 1000)) {
      this.castSkill('BasicAttack', this.target);
    }
  }

  private canCastSkill(skillName: string, cooldown: number): boolean {
    const now = Date.now();
    const lastCast = this.lastSkillCast.get(skillName) || 0;
    return now - lastCast >= cooldown;
  }
}
```

### Schéma Prisma pour Forgotten World

```prisma
// FGW Dungeon Config
model FGWDungeon {
  id          String   @id
  name        String
  levelMin    Int
  levelMax    Int
  degree      Int
  timeLimit   Int // en secondes
  maxPlayers  Int

  rooms       FGWRoom[]
  collections FGWCollection[]
  instances   FGWInstance[]
}

model FGWRoom {
  id          String   @id
  dungeonId   String
  dungeon     FGWDungeon @relation(fields: [dungeonId], references: [id])
  roomNumber  Int
  name        String

  monsters    FGWMonster[]
  treasureBox FGWTreasureBox?
}

model FGWMonster {
  id          String   @id
  roomId      String
  room        FGWRoom @relation(fields: [roomId], references: [id])
  name        String
  level       Int
  hp          Int
  attack      Int
  defense     Int
  positionX   Float
  positionY   Float
  positionZ   Float

  drops       FGWDrop[]
}

model FGWDrop {
  id          String   @id
  monsterId   String?
  monster     FGWMonster? @relation(fields: [monsterId], references: [id])

  itemType    String // 'talisman', 'coin', 'gold'
  itemId      String?
  amount      Int?
  dropRate    Float // 0.0 à 1.0
}

model FGWCollection {
  id          String   @id
  dungeonId   String
  dungeon     FGWDungeon @relation(fields: [dungeonId], references: [id])
  name        String // ex: "The Phantom of the Crimson Blood"

  talismans   FGWTalisman[]
  playerCollections FGWPlayerCollection[]
}

model FGWTalisman {
  id          String   @id
  collectionId String
  collection  FGWCollection @relation(fields: [collectionId], references: [id])
  name        String // ex: "Red Tears"
  rarity      String // 'common', 'rare', 'epic'
  coinCost    Int? // Pour système coins

  playerTalismans FGWPlayerTalisman[]
}

model FGWInstance {
  id          String   @id
  dungeonId   String
  dungeon     FGWDungeon @relation(fields: [dungeonId], references: [id])
  partyId     String
  difficulty  Int // 1-4
  startTime   DateTime
  endTime     DateTime?
  completed   Boolean  @default(false)

  playerProgress FGWPlayerProgress[]
}

model FGWPlayerCollection {
  id          String   @id
  playerId    String
  collectionId String
  collection  FGWCollection @relation(fields: [collectionId], references: [id])
  collected   Int      @default(0) // Nombre de talismans collectés
  completed   Boolean  @default(false)
  completedAt DateTime?
}

model FGWPlayerTalisman {
  id          String   @id
  playerId    String
  talismanId  String
  talisman    FGWTalisman @relation(fields: [talismanId], references: [id])
  obtainedAt  DateTime  @default(now())

  @@unique([playerId, talismanId])
}

model Player {
  id          String   @id
  name        String

  forgottenCoins Int    @default(0) // Solde de Forgotten Coins

  fgwCollections    FGWPlayerCollection[]
  fgwTalismans      FGWPlayerTalisman[]
  fgwProgress       FGWPlayerProgress[]
}

model FGWPlayerProgress {
  id          String   @id
  playerId    String
  player      Player @relation(fields: [playerId], references: [id])
  instanceId  String
  instance    FGWInstance @relation(fields: [instanceId], references: [id])

  enteredAt   DateTime @default(now())
  exitedAt    DateTime?
}
```

---

## ❓ FAQ

### Q: Combien de fois puis-je faire Forgotten World par jour ?
**R:** Généralement **3-5 entrées par jour** selon le serveur. Certains serveurs offrent des entrées illimitées pendant les events.

### Q: Puis-je faire Forgotten World solo ?
**R:** C'est **possible en grade ★ pour certains donjons**, mais très difficile. Les grades supérieurs (★★★ et ★★★★) nécessitent un **groupe complet 8/8**.

### Q: Les talismans sont-ils tradeables ?
**R:** Sur les serveurs officiels, **non**. Ils sont liés à votre personnage une fois lootés. Sur certains private servers, ils peuvent être tradeables ou vendables.

### Q: Qu'est-ce qui drop le plus de talismans ?
**R:**
1. **Treasure Boxes** : 1-3 talismans par chest
2. **Elder Earth Ghost** : 2-4 talismans
3. **Sereness Ghost** : 3-5 talismans + récompense spéciale

### Q: Le système Forgotten Coins est-il meilleur ?
**R:** **Oui**, car il élimine le RNG frustrant. Vous pouvez accumuler des coins et acheter exactement ce qu'il vous manque pour compléter votre collection.

### Q: Puis-je entrer dans un donjon au-dessus de mon niveau ?
**R:** **Non**, chaque donjon a une restriction de niveau stricte. Un niveau 60 ne peut pas entrer dans Flame Mountain (61-70).

### Q: Que se passe-t-il si le temps expire ?
**R:** Vous êtes **éjecté de l'instance** et perdez tout ce que vous n'avez pas looté. Les talismans collectés sont cependant conservés.

### Q: Les récompenses sont-elles les mêmes pour tous les grades ?
**R:** **Non**. Plus le grade est élevé, meilleures sont les récompenses (plus de SP, armes avec meilleurs stats, plus de Forgotten Coins).

### Q: Puis-je refaire la même collection plusieurs fois ?
**R:** Sur les serveurs officiels, **la quête de collection est une seule fois par personnage**. Sur certains private servers, elle est repeatable.

### Q: Comment savoir quels talismans me manquent ?
**R:** Ouvrez votre **Inventory → onglet Collection**. Vous verrez la progression (ex: 5/8) et les talismans manquants seront grisés.

---

## 🔗 Resources

### Wikis et Guides Officiels
- [Forgotten World - Silkroad Online Wiki](https://silkroadonline.fandom.com/wiki/Forgotten_World)
- [Silkroad Online Wiki - Main](https://silkroadonline.fandom.com/wiki/Silkroad_Online_Wiki)

### Forums et Guides Communautaires
- [The Forgotten World - Togui Village Origin Guide](https://forum.playorigin.com/showthread.php?73-%2526%25239673%253B-The-Forgotten-World-Togui-Village-Instance-Origin-Guide)
- [GUIDE Forgotten World - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=5&t=129133)
- [Tutorial Forgotten World - Elitepvpers](http://www.elitepvpers.com/forum/sro-guides-templates/1147804-tutorial-forgotten-world.html)
- [The FGW Tutorial - Seidenkraft Blog](https://seidenkraftblog.wordpress.com/2012/09/14/the-fgw-tutorial/)
- [Legend VI: Forgotten World Shipwreck Dimension II](https://princessjaneblog.wordpress.com/2011/03/18/legend-vi-forgotten-world-shipwreck-dimension-ii/)
- [Talismans Names Discussion - Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=2&t=126663)

### Cartes et Outils
- [Forgotten World Map - GUILD](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world/)
- [xSROMap - Interactive Map](https://jellybitz.github.io/xSROMap/) (pour localiser les Dimension Pillars)

### Vidéos
- [Silkroad Online - Togui Village 51-60 1 Star](https://www.youtube.com/watch?v=Aag1Ggt6Yk)
- [Silkroad Online - Togui Spell Walkthrough](https://www.youtube.com/watch?v=W3ZMkWvGmk4)
- [Togui Hunters Quest](https://www.youtube.com/watch?v=BK3QT0YGYE)
- [Silkroad Online - Forgotten World Talisman Display](https://www.youtube.com/watch?v=eH1-rem53-I)

### Ressources Turques (Très Complètes)
- [Silkroad Online Forgotten World Koleksiyon Kartları](https://www.srolobby.com/konular/silkroad-online-forgotten-world-koleksiyon-kartlari.746/) (Collection Cards avec images)

---

*Dernière mise à jour: 2025-01-20*
*Sources: Silkroad Online Wiki, PlayOrigin Forums, Silkroad Forums, Seidenkraft Blog, Elitepvpers*
