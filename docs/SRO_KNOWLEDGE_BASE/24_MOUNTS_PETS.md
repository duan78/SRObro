# Mounts et Pets - Guide Complet

## 📋 Table des Matières
- [Introduction](#introduction)
- [Mounts de Transport](#mounts-de-transport)
- [Attack Pets](#attack-pets)
- [Grab Pets](#grab-pets)
- [Système de Soins et Gestion](#système-de-soins-et-gestion)
- [Compétences de Pets](#compétences-de-pets)
- [Acquisition et Coûts](#acquisition-et-coûts)
- [Notes de Développement](#notes-de-développement)

---

## 📚 Introduction

Silkroad Online dispose de **trois types de pets** qui jouent des rôles différents dans le gameplay:

1. **Mounts (Transport Pets)** - Montures pour le déplacement et le transport de marchandises
2. **Attack Pets** - Pets de combat qui aident à tuer des monstres
3. **Grab Pets** - Pets de collecte qui ramassent le loot automatiquement

Ce guide couvre en détail chaque type, leurs utilisations, et stratégies.

---

## 🐪 Mounts de Transport

### Types de Mounts

#### Horse (Cheval)
```
Level Requis: 1
Capacité de Transport: 1 slot (trading)
Vitesse: +20% (monté), +0% (à pied)
Points de Vie: 5000
Prix: ~50,000 gold
Durabilité: 1000

Utilisation:
  - Déplacement de base
  - Trading débutant
  - Tous les personnages level 1+

Avantages:
  ✅ Pas de prérequis
  ✅ Peu coûteux
  ✅ Vitesse modérée

Inconvénients:
  ❌ Capacité de trading limitée
  ❌ Vulnérable aux attaques
```

#### Camel (Chameau)
```
Level Requis: 20
Capacité de Transport: 2 slots (trading)
Vitesse: +15% (monté), -5% (à pied)
Points de Vie: 8000
Prix: ~150,000 gold
Durabilité: 1500

Utilisation:
  - Trading intermédiaire
  - Transport de plus grandes quantités
  - Routes plus longues

Avantages:
  ✅ Plus de capacité de trading
  ✅ Plus de HP (survit mieux aux attaques)
  ✅ Rentable pour le trading

Inconvénients:
  ❌ Plus lent que le cheval
  ❌ Pénalité de vitesse à pied
```

#### Elephant (Éléphant)
```
Level Requis: 40
Capacité de Transport: 3 slots (trading)
Vitesse: +10% (monté), -10% (à pied)
Points de Vie: 12000
Prix: ~500,000 gold
Durabilité: 2000

Utilisation:
  - Trading avancé
  - High-level trading
  - Routes très longues ou dangereuses

Avantages:
  ✅ Capacité de trading maximale
  ✅ HP très élevé (très résistant)
  ✅ Profit optimal pour les longues distances

Inconvénients:
  ❌ Très lent
  ❌ Très cher
  ❌ Pénalité de vitesse significative
```

### Mounts Spéciaux (Event/Item Shop)

```
Mounts rares disponibles via:
  - Item Mall (Silk)
  - Events saisonniers
  - Promotions spéciales

Exemples:
  - Unicorn (Speed +25%)
  - Dragon Mount (Speed +30%, special abilities)
  - Robo Mount (Special effects)
  - Event Mounts (Limited time)

Ces mounts offrent généralement:
  - Meilleure vitesse
  - Apparences uniques
  - Parfois des capacités spéciales
  - Pas de durabilité (infinis)
```

### Soins et Entretien des Mounts

#### HUNGER System
```
Tous les mounts ont une barre de "Faim" (Hunger):

- Full Hunger: Performance 100%
- 75% Hunger: Performance 75%
- 50% Hunger: Performance 50%
- 25% Hunger: Performance 25% (très lent)
- 0% Hunger: Le mount ne bouge plus

Régénération de la Faim:
  - Diminue avec le temps et distance parcourue
  - Doit être nourri pour restaurer

Nourriture:
  - Fodder (Nourriture basique)
  - Special Fodder (Restaure plus)
  - Prix: ~1,000-5,000 par unité
```

#### Durability System
```
Les mounts perdent de la durabilité quand:
  - Attaqués par des monstres
  - Attaqués par des thieves
  - Tombent à 0 HP

Réparation:
  - Stable Master dans les villes
  - Coût: Proportionnel aux dégâts
  - À 0 durabilité: Le mount meurt (réanimable)

Repair Costs:
  - Horse: ~1,000 per 100 durability
  - Camel: ~2,000 per 100 durability
  - Elephant: ~5,000 per 100 durability
```

### Mounts pour Job System

#### Trader Mounts
```
Utilisés par les Traders pour transporter des marchandises:

Horse Trader (1-star):
  - Capacité: 1 slot
  - HP: 5000
  - Vitesse: +20%
  - Level requis: 20 (job level)

Camel Trader (2-star):
  - Capacité: 2 slots
  - HP: 8000
  - Vitesse: +15%
  - Level requis: 30

Elephant Trader (3-star):
  - Capacité: 3 slots
  - HP: 12000
  - Vitesse: +10%
  - Level requis: 40

Special Transport Mounts (Events):
  - Ostrich (4-star): Capacité 4, Speed +5%
  - Royal Carriage: Capacité 5, Speed 0%, HP 20000
```

#### Hunter Mounts
```
Les Hunters n'utilisent généralement pas de mounts spéciaux:
  - Se déplacent souvent à pied pour chasser
  - Peuvent utiliser des montures normales pour rejoindre traders

Certains Hunter mounts existent via events:
  - Hunter Horse (Plus rapide, moins de HP)
  - Falcon Mount (Air transport, rare)
```

#### Thief Mounts
```
Les thieves utilisent des mounts spécialisés:

Robe/Flying mount:
  - Invisibilité passive
  - Vitesse améliorée
  - Capacité de vol (certains serveurs)

Standard Thief Mount:
  - Version modifiée du Camel
  - Plus de vitesse
  - Moins de capacité
```

---

## ⚔️ Attack Pets

### Overview

Les **Attack Pets** sont des compagnons de combat qui:
- Attaquent les monstres automatiquement
- Aident au farming
- Ont des compétences spéciales
- Gagnent de l'expérience et level up

### Types d'Attack Pets

#### Wolf (Loup)
```
Level Requis: 1
Type: Physical DPS
Apprentissage: Rapide
Coût: Low

Statistiques de base (Level 1):
  - HP: 500
  - ATK: 50-80
  - Attack Speed: Moyen
  - Crit Rate: 5%

Évolution:
  - Baby Wolf → Wolf → Giant Wolf → Dire Wolf

Utilisation:
  - PvE grinding
  - Tank pet modéré
  - DPS consistent

Avantages:
  ✅ Bon DPS
  ✅ Tank correctement
  ✅ Facile à obtenir

Inconvénients:
  ❌ Pas de capacités spéciales fortes
  ❌ Meilleur au milieu des pets avancés
```

#### Rabbit (Lapin)
```
Level Requis: 10
Type: Magical/Support
Apprentissage: Rapide
Coût: Low

Statistiques de base (Level 1):
  - HP: 400
  - MAG ATK: 60-90
  - Attack Speed: Rapide
  - Special: Buffs

Évolution:
  - Baby Rabbit → Rabbit → Giant Rabbit → Moon Rabbit

Utilisation:
  - Support
  - Buffs pour le joueur
  - DPS magique

Compétences:
  - Physical Attack Boost (+10% PHY ATK)
  - Mana Regeneration
  - Magic Damage

Avantages:
  ✅ Excellents buffs
  ✅ DPS magique respectable
  ✅ Très utile en party

Inconvénients:
  ❌ Faible physiquement
  ❌ Ne tank pas bien
```

#### Crow (Corbeau)
```
Level Requis: 20
Type: Ranged/Debuffer
Apprentissage: Lent
Coût: Medium

Statistiques de base (Level 1):
  - HP: 350
  - ATK: 70-100 (ranged)
  - Range: Long
  - Special: Debuffs

Évolution:
  - Baby Crow → Crow → Giant Crow → Phoenix (ultime)

Utilisation:
  - Ranged DPS
  - Debuff des ennemis
  - Support de distance

Compétences:
  - Poison (DoT)
  - Attack Speed Reduction
  - Defense Reduction (armor break)

Avantages:
  ✅ Portée excellente
  ✅ Debuffs puissants
  ✅ DPS constant à distance

Inconvénients:
  ❌ Très fragile
  ❌ Nécessite micro-management
  ❌ Difficile à obtenir
```

### Pet Growth System

#### Leveling
```
Les Attack Pets gagnent de l'expérience en:
  - Tuant des monstres (avec le joueur)
  - Participant aux kills
  - Blessés en combat

Formule d'XP:
  - XP Monster × (Pet Level / Player Level)
  - Bonus XP si le pet porte le coup fatal

Level Ranges:
  - Level 1-20: Baby phase
  - Level 21-40: Teen phase
  - Level 41-60: Adult phase
  - Level 61+: Evolution possible
```

#### Évolution (Evolution)
```
Conditions pour évolution:
  - Level maximum atteint
  - Items d'évolution (Evolution Stones)
  - Quête complétée

Stones d'évolution:
  - Evolution Stone (Basic)
  - Advanced Evolution Stone
  - Ultimate Evolution Stone

Drop rate:
  - Monstres Champion/Giant: 5-10%
  - Uniques: 20-30%
  - Dungeons: 15-20%
```

#### Pet Skills
```
Chaque pet apprend des compétences à certains levels:

Wolf Skills:
  - Lv 10: Bite (Active attack)
  - Lv 20: Growl (Taunt/aggro)
  - Lv 30: Pack Hunting (Damage boost)
  - Lv 40: Furious Bite (Critical attack)
  - Lv 50: Alpha Howl (Party buff)

Rabbit Skills:
  - Lv 10: Buff (PHY +10%)
  - Lv 20: Heal (HP recovery)
  - Lv 30: Mana Regen (MP recovery)
  - Lv 40: Buff MAG (+10%)
  - Lv 50: Party Buff (All stats +5%)

Crow Skills:
  - Lv 10: Poison Shot (DoT)
  - Lv 20: Armor Break (DEF -20%)
  - Lv 30: Attack Speed Slow (-15%)
  - Lv 40: Poison Cloud (AOE DoT)
  - Lv 50: Fatal Mark (Crit chance +20%)
```

### Pet Management

#### Hunger et Health
```
Hunger:
  - Diminue avec le temps
  - Diminue quand le pet attaque
  - À 0%: Le pet ne bouge plus
  - Doit être nourri avec Pet Food

Health:
  - Perd des HP en combat
  - Peut mourir si HP = 0
  - Doit être rez (Pet Resurrection Scroll)
  - Réparable auprès du Stable Master

Pet Food:
  - Basic Pet Food (Restaure 30%)
  - Advanced Pet Food (Restaure 60%)
  - Special Pet Food (Restaure 100% + buffs)

Pet Healing:
  - Pet Potion (Small): 500 HP
  - Pet Potion (Medium): 1000 HP
  - Pet Potion (Large): 2000 HP
  - Pet Resurrection Scroll: Rez pet mort
```

#### Pet Inventory
```
Les pets peuvent équiper des items:

Slots disponibles:
  - 1 Weapon slot (pet weapons)
  - 1 Armor slot (pet armor)
  - 1 Accessory slot (pet rings/necklaces)

Pet Equipment:
  - Claws/Teeth (Weapons)
  - Pet Armor (Defense)
  - Pet Jewelry (Stats)

Sources:
  - Drops de monstres
  - Pet Shop NPCs
  - Events
```

---

## 🤲 Grab Pets

### Overview

Les **Grab Pets** (aussi appelés Loot Pets ou Pickup Pets) sont des pets qui:
- Ramassent automatiquement le loot (gold, items)
- Libèrent le joueur de devoir cliquer sur chaque item
- Sont très populaires pour le farming intensif

### Types de Grab Pets

#### Pig (Cochon)
```
Level Requis: 1
Vitesse: Normal
Range: 10 unités
Slots d'inventaire: 5

Capacité:
  - Ramasse tous les types d'items
  - Range modérée
  - Inventaire limité

Prix: ~100,000 gold (7 jours) ou via Item Mall

Avantages:
  ✅ Automatise le farming
  ✅ Économise du temps
  ✅ Très abordable

Inconvénients:
  ❌ Inventaire limité
  ❌ Vitesse de ramassage moyenne
```

#### Fox (Renard)
```
Level Requis: 1
Vitesse: Rapide
Range: 15 unités
Slots d'inventaire: 7

Améliorations vs Pig:
  - Plus de range
  - Plus rapide
  - Plus de slots

Prix: Via Item Mall (Silk) ou events

Avantages:
  ✅ Meilleur ramassage
  ✅ Plus efficace
  ✅ Inventaire plus grand

Inconvénients:
  ❌ Plus cher
  ❌ Nécessite Silk (real money)
```

#### Fairy Cat (Chat Féerique)
```
Level Requis: 1
Vitesse: Très rapide
Range: 20 unités
Slots d'inventaire: 10

Grab Pet ultime:
  - Meilleure vitesse
  - Meilleur range
  - Plus grand inventaire

Special:
  - Peut filtrer les items (ex: ignore les low-level drops)
  - Auto-sell trash items (certains serveurs)

Prix: Via Item Mall (cher)

Avantages:
  ✅ Performance maximale
  ✅ Filtres intelligents
  ✅ Inventaire spacieux

Inconvénients:
  ❌ Très cher
  ❌ Luxe/End-game seulement
```

### Grab Pet Mechanics

#### Ramassage Automatique
```
Fonctionnement:
  1. Un mob meurt et drop du loot
  2. Le grab pet detecte le drop (dans son range)
  3. Le pet se déplace vers l'item
  4. Le pet ramasse l'item
  5. L'item va dans l'inventaire du pet
  6. Le joueur peut transférer les items du pet à son inventaire

Priorité de ramassage:
  - Gold (priorité 1)
  - SOX items (priorité 2)
  - Équipements (priorité 3)
  - Mats/Consumables (priorité 4)
  - Trash items (dernier)
```

#### Inventaire du Pet
```
Slots disponibles:
  - Pig: 5 slots
  - Fox: 7 slots
  - Fairy Cat: 10 slots

Gestion:
  - Transfert manuel au joueur
  - Auto-transfert quand plein (option)
  - Filtres (keep/sell/auto-drop)

Quand l'inventaire est plein:
  - Le pet arrête de ramasser
  - Doit être vidé par le joueur
  - Certains pets ont "Auto-Sell" (vend trash)
```

#### Durée et Limites
```
Durée:
  - Grab Pets sont généralement time-limited
  - Durées: 7 jours, 30 jours, permanent (rare)

Coût:
  - Pig (7 days): ~100,000 gold
  - Fox (30 days): ~500,000 gold
  - Fairy Cat (Permanent): Item Mall seulement

Limitations:
  - Ne peut pas ramasser pendant:
    * Combat player (optionnel)
    * Job activity (trading)
    * PvP
  - Certains zones interdisent les grab pets
```

---

## 🏥 Système de Soins et Gestion

### Stable Master Services

Dans chaque ville, le **Stable Master** offre:

#### Mount Services
```
Soins (Healing):
  - Restaure les HP du mount
  - Coût: Proportionnel aux HP manquants
  - Ex: Mount à 3000/5000 HP = ~2,000 gold

Réparation (Repair):
  - Restaure la durabilité du mount
  - Coût: Proportionnel aux dégâts
  - Ex: 500 durability perdu = ~5,000 gold

Nourriture (Food):
  - Vend Fodder pour les mounts
  - Fodder (Basique): 1,000 gold
  - Special Fodder: 5,000 gold
```

#### Pet Services
```
Attack Pet Healing:
  - Pet potions disponibles
  - Resurrection scrolls

Grab Pet Maintenance:
  - Extension de durée (pay-to-extend)
  - Repair (si endommagé)

Pet Inventory:
  - Achats d'équipement pour pets
  - Pet weapons, armor, jewelry
```

---

## 🎯 Compétences de Pets

### Attack Pet Skills Overview

Les pets ont des compétences actives et passives:

#### Actives ( doivent être activées)
```
Attack Commands:
  - "Attack" : Le pet attaque la cible du joueur
  - "Stop" : Le pet arrête d'attaquer
  - "Come" : Le pet revient vers le joueur
  - "Stay" : Le pet reste sur place

Special Skills:
  - Skill 1: Compétence principale (damage)
  - Skill 2: Compétice secondaire (buff/debuff)
  - Ultimate: Compétice ultime (level 50+)
```

#### Passives (Toujours actives)
```
Auto-Attack:
  - Le pet attaque automatiquement les ennemis proches
  - Priorité: Cible du joueur, puis plus proche

Buffs:
  - Certains pets donnent des buffs passifs
  - Ex: Rabbit donne +10% PHY ATK passivement

Auras:
  - AOE effects autour du pet
  - Ex: Wolf donne +5% crit aura dans un rayon de 10m
```

### Skill Management

#### Skill Tree
```
Chaque pet a un skill tree:

Points de compétence:
  - Gagnés à chaque level up
  - Habituellement 1 point par level

Distribution:
  - Peut être reset (Skill Reset Scroll)
  - Coût: ~1,000,000 gold ou via Item Mall

Builds courants:
  - Full DPS (Toutes les compétences offensives)
  - Support/Buff (Compétices de buff)
  - Hybrid (Mix DPS et support)
```

---

## 💰 Acquisition et Coûts

### Mounts

| Mount | Méthode | Coût | Durabilité |
|-------|---------|------|------------|
| Horse | Stable Master | 50,000 gold | 1000 |
| Camel | Stable Master | 150,000 gold | 1500 |
| Elephant | Stable Master | 500,000 gold | 2000 |
| Special Mounts | Item Mall/Events | Silk | Infini |

### Attack Pets

| Pet | Méthode | Coût Approximatif | Notes |
|-----|---------|-------------------|-------|
| Wolf | Drop/Buy | 100,000 gold | Level 1 |
| Rabbit | Drop/Buy | 200,000 gold | Level 10 requis |
| Crow | Drop/Buy | 1,000,000 gold | Level 20 requis |

### Grab Pets

| Pet | Méthode | Coût | Durée |
|-----|---------|------|-------|
| Pig | NPC Gold/Item Mall | 100,000 gold | 7 jours |
| Fox | Item Mall | 300 Silk | 30 jours |
| Fairy Cat | Item Mall | 1000 Silk | Permanent |

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

#### Système de Mounts

```javascript
// Classe pour gérer les mounts
class MountSystem {
  constructor(player) {
    this.player = player;
    this.currentMount = null;
    this.mounts = new Map();
  }

  summonMount(mountId) {
    const mountData = this.mounts.get(mountId);
    if (!mountData) return;

    if (this.currentMount) {
      this.dismount();
    }

    this.currentMount = new Mount(mountData);
    this.player.mount(this.currentMount);

    // Appliquer les buffs de vitesse
    this.applySpeedBuff(mountData.speedBonus);
  }

  dismount() {
    if (!this.currentMount) return;

    this.player.dismount();
    this.removeSpeedBuff(this.currentMount.speedBonus);
    this.currentMount = null;
  }

  applySpeedBuff(bonus) {
    this.player.speed *= (1 + bonus / 100);
  }

  removeSpeedBuff(bonus) {
    this.player.speed /= (1 + bonus / 100);
  }

  // Trading
  loadGoodsForTrading(goods) {
    if (!this.currentMount) return false;

    const slotsRequired = goods.length;
    if (slotsRequired > this.currentMount.capacity) {
      return false; // Trop de marchandises
    }

    this.currentMount.goods = goods;
    return true;
  }
}
```

#### Système d'Attack Pets

```javascript
// Système de pet de combat
class AttackPetSystem {
  constructor(owner) {
    this.owner = owner;
    this.activePet = null;
    this.pets = [];
  }

  summonPet(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet || pet.isDead) return;

    this.activePet = pet;
    this.spawnPet(pet);
    this.setupAI(pet);
  }

  spawnPet(pet) {
    // Créer le modèle 3D du pet
    pet.mesh = this.createPetMesh(pet.type);
    pet.mesh.position.copy(this.owner.position);
    pet.mesh.position.add(new Vector3(1, 0, 1)); // Offset

    scene.add(pet.mesh);
  }

  setupAI(pet) {
    // AI pour attaquer automatiquement
    pet.update = (deltaTime) => {
      if (!this.activePet) return;

      // Trouver la cible la plus proche
      const target = this.findNearestEnemy();

      if (target && this.isInRange(target)) {
        this.attack(target);
      } else if (target) {
        this.moveTo(target);
      } else {
        this.followOwner();
      }
    };

    // Enregistrer la boucle de mise à jour
    this.registerUpdate(pet.update);
  }

  findNearestEnemy() {
    const enemies = this.world.getEnemiesInRange(this.owner.position, 50);

    return enemies.sort((a, b) => {
      const distA = a.position.distanceTo(this.activePet.mesh.position);
      const distB = b.position.distanceTo(this.activePet.mesh.position);
      return distA - distB;
    })[0];
  }
}
```

#### Système de Grab Pets

```javascript
// Système de grab pet (ramassage auto)
class GrabPetSystem {
  constructor(owner) {
    this.owner = owner;
    this.activePet = null;
    this.pickupRange = 10;
  }

  enable(petType) {
    this.activePet = {
      type: petType,
      inventory: [],
      inventorySize: this.getInventorySize(petType),
      pickupSpeed: this.getPickupSpeed(petType),
      pickupRange: this.getPickupRange(petType)
    };

    this.startAutoPickup();
  }

  startAutoPickup() {
    // Vérifier périodiquement les drops à ramasser
    setInterval(() => {
      if (!this.activePet) return;

      const drops = this.world.getDropsInRange(
        this.owner.position,
        this.activePet.pickupRange
      );

      drops.forEach(drop => {
        if (this.shouldPickup(drop)) {
          this.pickupItem(drop);
        }
      });
    }, 500); // Check every 500ms
  }

  shouldPickup(drop) {
    // Filtres basés sur les paramètres du pet
    if (this.activePet.inventory.length >= this.activePet.inventorySize) {
      return false; // Inventaire plein
    }

    // Priorité par type d'item
    return true; // Pour l'instant, ramasse tout
  }

  pickupItem(drop) {
    // Animation de ramassage
    this.playPickupAnimation();

    // Ajouter à l'inventaire du pet
    this.activePet.inventory.push(drop.item);

    // Retirer du monde
    this.world.removeDrop(drop);
  }
}
```

#### Données des Pets

```javascript
// Fichier: data/pets.json
{
  "mounts": [
    {
      "id": "MOUNT_HORSE",
      "name": "Horse",
      "level_requirement": 1,
      "speed_bonus": 20,
      "capacity": 1,
      "hp": 5000,
      "durability": 1000,
      "cost": 50000,
      "model": "horse",
      "texture": "horse_brown"
    },
    {
      "id": "MOUNT_CAMEL",
      "name": "Camel",
      "level_requirement": 20,
      "speed_bonus": 15,
      "capacity": 2,
      "hp": 8000,
      "durability": 1500,
      "cost": 150000,
      "model": "camel",
      "texture": "camel_desert"
    },
    {
      "id": "MOUNT_ELEPHANT",
      "name": "Elephant",
      "level_requirement": 40,
      "speed_bonus": 10,
      "capacity": 3,
      "hp": 12000,
      "durability": 2000,
      "cost": 500000,
      "model": "elephant",
      "texture": "elephant_gray"
    }
  ],

  "attack_pets": [
    {
      "id": "PET_WOLF",
      "name": "Wolf",
      "type": "WOLF",
      "level_requirement": 1,
      "stats": {
        "hp": 500,
        "atk": 65,
        "attack_speed": 1.5,
        "crit_rate": 5
      },
      "skills": ["BITE", "GROWL", "PACK_HUNTING"],
      "model": "wolf",
      "evolution": ["BABY_WOLF", "WOLF", "GIANT_WOLF", "DIRE_WOLF"]
    },
    {
      "id": "PET_RABBIT",
      "name": "Rabbit",
      "type": "RABBIT",
      "level_requirement": 10,
      "stats": {
        "hp": 400,
        "atk": 75,
        "attack_speed": 2.0,
        "mag_atk": 75
      },
      "skills": ["BUFF_PHY", "HEAL", "MANA_REGEN", "BUFF_MAG"],
      "model": "rabbit",
      "evolution": ["BABY_RABBIT", "RABBIT", "GIANT_RABBIT", "MOON_RABBIT"]
    },
    {
      "id": "PET_CROW",
      "name": "Crow",
      "type": "CROW",
      "level_requirement": 20,
      "stats": {
        "hp": 350,
        "atk": 85,
        "attack_speed": 1.8,
        "range": 15
      },
      "skills": ["POISON", "ARMOR_BREAK", "ATK_SLOW", "POISON_CLOUD"],
      "model": "crow",
      "evolution": ["BABY_CROW", "CROW", "GIANT_CROW", "PHOENIX"]
    }
  ],

  "grab_pets": [
    {
      "id": "GRAB_PIG",
      "name": "Pig",
      "pickup_speed": 1.0,
      "pickup_range": 10,
      "inventory_size": 5,
      "model": "pig"
    },
    {
      "id": "GRAB_FOX",
      "name": "Fox",
      "pickup_speed": 1.5,
      "pickup_range": 15,
      "inventory_size": 7,
      "model": "fox"
    },
    {
      "id": "GRAB_FAIRY_CAT",
      "name": "Fairy Cat",
      "pickup_speed": 2.0,
      "pickup_range": 20,
      "inventory_size": 10,
      "model": "fairy_cat",
      "features": ["AUTO_SELL", "FILTERING"]
    }
  ]
}
```

---

## 📊 Résumé des Pets

### Tableau Comparatif des Mounts

| Mount | Vitesse | Capacité | HP | Coût | Level | Recommandé pour |
|-------|---------|----------|-------|------|-------|----------------|
| Horse | +20% | 1 | 5000 | 50k | 1 | Débutants |
| Camel | +15% | 2 | 8000 | 150k | 20 | Trading intermédiaire |
| Elephant | +10% | 3 | 12000 | 500k | 40 | Trading avancé |

### Tableau Comparatif des Attack Pets

| Pet | DPS | Tank | Support | Difficulté | Level | Recommandé pour |
|-----|-----|------|---------|------------|-------|----------------|
| Wolf | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | Facile | 1 | Tous les joueurs |
| Rabbit | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Facile | 10 | Solo/Support |
| Crow | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | Difficile | 20 | Advanced players |

### Tableau Comparatif des Grab Pets

| Pet | Vitesse | Range | Inventaire | Coût | Recommandé pour |
|-----|---------|-------|------------|------|----------------|
| Pig | Normal | 10 | 5 | Low | Farming casual |
| Fox | Rapide | 15 | 7 | Medium | Farming intensif |
| Fairy Cat | Très rapide | 20 | 10 | High | Power farming |

---

## 🎯 Conseils d'Utilisation

### Pour les Débutants

1. **Mount:**
   - Commencez avec un Horse (level 1)
   - Upgradez vers Camel quand vous commencez le trading (level 20+)

2. **Attack Pet:**
   - Obtenez un Wolf dès que possible (level 1)
   - Aide énormément pour le leveling solo

3. **Grab Pet:**
   - Pas essentiel au début, mais très utile
   - Investissez dans un Pig quand vous commencez à farm intensivement

### Pour les Joueurs Avancés

1. **Mount:**
   - Elephant pour le trading haut niveau
   - Mounts spéciaux (events) si disponibles

2. **Attack Pet:**
   - Élevez un pet jusqu'à l'évolution ultime
   - Skills optimisés pour votre playstyle

3. **Grab Pet:**
   - Fairy Cat pour le farming optimal
   - Configurez les filtres intelligemment

---

*Dernière mise à jour: 20 Janvier 2026*

*Sources: Silkroad Online Wiki, Community Guides, SRObro Project Documentation*
