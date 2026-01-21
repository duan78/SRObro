# Hub Technique - Documentation pour Développeurs SRObro

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Technique](HUB_TECHNIQUE.md)

---

## 📋 Table des Matières
- [Introduction](#introduction)
- [Guide Technique Développement](#guide-technique-développement)
- [Spécifications Techniques](#spécifications-techniques)
- [Mécaniques Avancées](#mécaniques-avancées)
- [Forgotten World](#forgotten-world)
- [Bases de Données](#bases-de-données)
- [Ressources Techniques](#ressources-techniques)
- [API et Intégration](#api-et-intégration)

---

## 💻 Introduction

Ce **hub centralise toutes les ressources techniques** pour le développement du projet SRObro - un clone de Silkroad Online fonctionnant entièrement dans le navigateur utilisant Babylon.js, Node.js, et PostgreSQL.

### Stack Technique

#### Frontend
- **Babylon.js** : Moteur 3D pour le rendu du monde
- **TypeScript** : Code typé pour la maintenance
- **React** : Interface utilisateur
- **Socket.io Client** : Communication temps réel

#### Backend
- **Node.js** : Runtime JavaScript serveur
- **Express** : Serveur HTTP
- **Socket.io** : WebSockets pour temps réel
- **Prisma** : ORM pour PostgreSQL

#### Base de Données
- **PostgreSQL** : Base de données relationnelle
- **Redis** : Cache et sessions
- **S3** : Stockage assets (meshes, textures)

---

## 🛠️ Guide Technique Développement

### Documentation Principale
👉 **[DEVELOPMENT_TECHNICAL_GUIDE.md](DEVELOPMENT_TECHNICAL_GUIDE.md)** - Guide complet (1,134 lignes)

### Architecture Globale

#### Structure du Projet
```
SRObro/
├── frontend/              # Client Babylon.js
│   ├── src/
│   │   ├── 3d/           # Scènes 3D
│   │   ├── ui/           # Interface React
│   │   ├── network/      # Socket.io client
│   │   └── utils/        # Helpers
│   └── public/           # Assets statiques
├── backend/              # Serveur Node.js
│   ├── src/
│   │   ├── routes/       # API REST
│   │   ├── socket/       # Socket.io handlers
│   │   ├── services/     # Business logic
│   │   └── prisma/       # Database schema
│   └── tests/            # Tests unitaires
└── docs/                 # Documentation
    └── SRO_KNOWLEDGE_BASE/
```

### Modules Principaux

#### 1. 3D Engine Module (Babylon.js)
```typescript
// Core 3D scene setup
interface SceneConfig {
  renderer: 'babylon';
  shadowsEnabled: boolean;
  physicsEnabled: boolean;
  maxCharacters: number;
  drawDistance: number;
}

class SROSceneManager {
  createScene(): BABYLON.Scene;
  loadTerrain(zoneId: string): Promise<Terrain>;
  spawnCharacter(data: CharacterData): Character;
  updatePhysics(deltaTime: number): void;
  render(): void;
}
```

#### 2. Network Module (Socket.io)
```typescript
// Socket event handlers
interface ServerToClientEvents {
  characterSpawn: (data: CharacterSpawnData) => void;
  characterMove: (data: MovementData) => void;
  characterAttack: (data: AttackData) => void;
  chatMessage: (data: ChatMessage) => void;
  gameUpdate: (data: GameState) => void;
}

interface ClientToServerEvents {
  playerMove: (position: Vector3) => void;
  playerAttack: (targetId: string) => void;
  playerUseSkill: (skillId: string) => void;
  chatSend: (message: string) => void;
}
```

#### 3. Database Module (Prisma)
```typescript
// Prisma schema
model Character {
  id          String   @id
  name        String
  level       Int
  race        Race     // CHINESE, EUROPEAN
  masteries   Mastery[]
  skills      Skill[]
  equipment   Equipment
  position    Position
  stats       CharacterStats
}

model Mastery {
  id          String   @id
  characterId String
  name        String   // BICHEON, HEUKSAL, etc.
  level       Int
}

model Skill {
  id          String   @id
  characterId String
  masteryId   String
  name        String
  level       Int
}
```

---

## 📐 Spécifications Techniques

### Documentation
👉 **[TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md)** - Spécifications complètes (880 lignes)

### Spécifications par Module

#### Combat System
```typescript
// Damage calculation interface
interface DamageCalculation {
  attacker: CharacterStats;
  defender: CharacterStats;
  skill: SkillData;
  environment: EnvironmentFactors;
}

interface DamageResult {
  baseDamage: number;
  finalDamage: number;
  isCritical: boolean;
  isBlocked: boolean;
  damageType: 'PHYSICAL' | 'MAGICAL';
}
```

#### Movement System
```typescript
// Character movement
interface MovementData {
  characterId: string;
  position: Vector3;
  rotation: number;
  velocity: Vector3;
  animation: string;
  timestamp: number;
}

// Server-side validation
function validateMovement(
  previous: Position,
  next: Position,
  deltaTime: number
): boolean {
  const maxSpeed = 10; // units per second
  const distance = Vector3.Distance(previous, next);
  const maxDistance = maxSpeed * deltaTime;
  return distance <= maxDistance;
}
```

#### Skill System
```typescript
// Skill execution
interface SkillData {
  id: string;
  name: string;
  mastery: string;
  level: number;
  mpCost: number;
  castTime: number;
  cooldown: number;
  damage: DamageFormula;
  effects: StatusEffect[];
}

function executeSkill(
  caster: Character,
  skill: SkillData,
  targets: Character[]
): SkillResult {
  // MP check
  if (caster.stats.mp < skill.mpCost) {
    return { success: false, reason: 'NO_MP' };
  }

  // Cooldown check
  if (caster.cooldowns.has(skill.id)) {
    return { success: false, reason: 'ON_COOLDOWN' };
  }

  // Execute skill
  const results = targets.map(target => {
    const damage = calculateDamage(caster, target, skill);
    applyDamage(target, damage);
    return { target, damage };
  });

  // Consume MP and set cooldown
  caster.stats.mp -= skill.mpCost;
  caster.cooldowns.set(skill.id, skill.cooldown);

  return { success: true, results };
}
```

---

## 🧮 Mécaniques Avancées

### Documentation
👉 **[28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md)** - Mécaniques avancées + Code (1,097 lignes)

### Formules de Combat Implémentées

#### Attack Rating vs Parry Ratio
```typescript
function calculateHitChance(
  attackRating: number,
  parryRatio: number
): number {
  return attackRating / (attackRating + parryRatio);
}

function calculateParryReduction(
  attackRating: number,
  parryRatio: number
): number {
  const hitChance = calculateHitChance(attackRating, parryRatio);
  const minReduction = 0.5; // 50% min damage
  const maxReduction = 1.0;  // 100% max damage
  return minReduction + (hitChance * (maxReduction - minReduction));
}
```

#### Critical Hits
```typescript
interface CriticalHitData {
  critRate: number;    // 0.05 = 5%
  critDamage: number;  // 0.5 = +50% damage
}

function rollCritical(critData: CriticalHitData): boolean {
  return Math.random() < critData.critRate;
}

function calculateCriticalDamage(
  baseDamage: number,
  critMultiplier: number
): number {
  return Math.floor(baseDamage * (1 + critMultiplier));
}
```

#### Socket System
```typescript
interface SocketData {
  slot: number;        // 1-4
  type: SocketType;    // ATTACK, DEFENSE, HP, MP, CRITICAL, PARRY
  value: number;
}

function applySockets(
  baseStats: CharacterStats,
  sockets: SocketData[]
): CharacterStats {
  const modified = { ...baseStats };

  sockets.forEach(socket => {
    switch (socket.type) {
      case 'ATTACK':
        modified.phyAtk += socket.value;
        modified.magAtk += socket.value;
        break;
      case 'DEFENSE':
        modified.phyDef += socket.value;
        modified.magDef += socket.value;
        break;
      case 'HP':
        modified.maxHp += socket.value;
        break;
      case 'MP':
        modified.maxMp += socket.value;
        break;
      case 'CRITICAL':
        modified.critRate += socket.value;
        break;
      case 'PARRY':
        modified.parryRatio += socket.value;
        break;
    }
  });

  return modified;
}
```

---

## 🏛️ Forgotten World

### Documentation
👉 **[29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md)** - Donjons complets + Code (1,095 lignes)

### Architecture des Donjons

#### Dungeon Instance System
```typescript
interface DungeonConfig {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  maxPlayers: number;
  timeLimit: number; // seconds
  spawnPoints: Vector3[];
  bossSpawns: BossSpawnData[];
  rewardPool: RewardTable;
}

class DungeonInstance {
  config: DungeonConfig;
  players: Character[];
  state: 'LOBBY' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  startTime: number;
  elapsedTime: number;

  addPlayer(player: Character): boolean;
  removePlayer(playerId: string): void;
  start(): void;
  update(deltaTime: number): void;
  complete(): Reward[];
  fail(): void;
}
```

#### Talisman System
```typescript
interface TalismanData {
  id: string;
  dungeonId: string;
  type: 'BLUE' | 'RED' | 'YELLOW';
  tier: number; // 1-5
  stats: TalismanStats;
}

interface TalismanStats {
  phyAtk: number;
  magAtk: number;
  phyDef: number;
  magDef: number;
  hp: number;
  mp: number;
}

function generateTalisman(
  dungeonId: string,
  tier: number
): TalismanData {
  const baseStats = {
    tier1: { phyAtk: 3, magAtk: 3, phyDef: 3, magDef: 3, hp: 30, mp: 30 },
    tier2: { phyAtk: 6, magAtk: 6, phyDef: 6, magDef: 6, hp: 60, mp: 60 },
    tier3: { phyAtk: 9, magAtk: 9, phyDef: 9, magDef: 9, hp: 90, mp: 90 },
    tier4: { phyAtk: 12, magAtk: 12, phyDef: 12, magDef: 12, hp: 120, mp: 120 },
    tier5: { phyAtk: 18, magAtk: 18, phyDef: 18, magDef: 18, hp: 180, mp: 180 }
  };

  return {
    id: generateUUID(),
    dungeonId,
    type: getRandomType(),
    tier,
    stats: baseStats[`tier${tier}`]
  };
}
```

---

## 🗄️ Bases de Données

### NPCs avec Coordonnées
👉 **[NPCS_COORDINATES.md](NPCS_COORDINATES.md)** - 130+ NPCs avec positions X/Y

**Contenu:**
- NPCs par ville (Jangan, Donwhang, Hotan, Alexandria, Constantinople)
- Coordonnées X/Y précises pour chaque NPC
- Types de NPCs (entraîneurs, marchands, etc.)

### Monstres et Spawns
👉 **[MONSTERS_SPAWN_LOCATIONS.md](MONSTERS_SPAWN_LOCATIONS.md)** - 15 Uniques + Spots

**Contenu:**
- Coordonnées de spawn des Uniques
- SP farming spots
- Champion/Giant spawns
- Leveling zones

### Items Database
👉 **[ITEMS_DATABASE.md](ITEMS_DATABASE.md)** - Tous les items du jeu (698 lignes)

**Contenu:**
- Armes 1D-13D
- Armures 1D-13D
- Accessoires
- Consommables
- Materials

### Skills Databases
👉 **[SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)** - 7 maîtrises chinoises

👉 **[SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)** - 8 classes européennes

---

## 📊 Ressources Techniques

### Coordonnées et Cartes

#### Map Coordinates Reference
👉 **[MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md)** - Toutes les coordonnées

**Contenu:**
- Système de coordonnées X/Y
- Frontières de chaque zone
- Points de téléportation
- Spawn points

### Technical Specifications
👉 **[TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md)** - Spécifications détaillées

**Contenu:**
- Architecture système
- API specifications
- Database schemas
- Network protocols

---

## 🔌 API et Intégration

### REST API Endpoints

#### Authentication
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

#### Characters
```typescript
GET    /api/characters
POST   /api/characters
GET    /api/characters/:id
PATCH  /api/characters/:id
DELETE /api/characters/:id
```

#### Game Data
```typescript
GET /api/data/npcs
GET /api/data/monsters
GET /api/data/items
GET /api/data/skills
GET /api/data/zones
```

### Socket.io Events

#### Connection
```typescript
// Client → Server
socket.emit('authenticate', { token: string });

// Server → Client
socket.on('authenticated', (data: AuthData) => void);
socket.on('authenticationFailed', (error: Error) => void);
```

#### Character Movement
```typescript
// Client → Server
socket.emit('characterMove', {
  position: { x: number, y: number, z: number },
  rotation: number,
  timestamp: number
});

// Server → Client
socket.on('characterMoved', (data: MovementData) => void);
socket.on('otherCharactersMoved', (data: MovementData[]) => void);
```

#### Combat
```typescript
// Client → Server
socket.emit('attack', {
  targetId: string,
  skillId: string
});

// Server → Client
socket.on('attackResult', (data: AttackResult) => void);
socket.on('characterDamaged', (data: DamageData) => void);
socket.on('characterDied', (data: DeathData) => void);
```

---

## 🧪 Testing et Debugging

### Tests Unitaires

#### Damage Calculation Tests
```typescript
describe('Damage Calculation', () => {
  test('should calculate physical damage correctly', () => {
    const attacker = { phyAtk: 1000 };
    const defender = { phyDef: 500 };
    const result = calculatePhysicalDamage(attacker, defender);
    expect(result).toBe(500);
  });

  test('should apply critical damage', () => {
    const baseDamage = 1000;
    const critMultiplier = 0.5; // +50%
    const result = calculateCriticalDamage(baseDamage, critMultiplier);
    expect(result).toBe(1500);
  });
});
```

#### Movement Validation Tests
```typescript
describe('Movement Validation', () => {
  test('should reject impossible movement', () => {
    const previous = { x: 0, y: 0, z: 0 };
    const next = { x: 1000, y: 0, z: 0 }; // Too far
    const deltaTime = 1; // 1 second

    const result = validateMovement(previous, next, deltaTime);
    expect(result).toBe(false);
  });
});
```

---

## 🚀 Déploiement

### Infrastructure

#### Production Stack
- **Frontend** : Vercel / Netlify
- **Backend** : AWS EC2 / DigitalOcean
- **Database** : AWS RDS PostgreSQL
- **Cache** : Redis Labs
- **Storage** : AWS S3

#### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/srobro
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Game
MAX_PLAYERS_PER_SERVER=1000
TICK_RATE=60
DRAW_DISTANCE=200

# S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=srobro-assets
```

---

## 📚 Voir aussi

### Documentation Technique
- [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md) - Architecture complète (1,134 lignes)
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md) - Spécifications (880 lignes)

### Mécaniques avec Code
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Formules + Code TypeScript
- [Forgotten World](29_FORGOTTEN_WORLD.md) - Donjons + Implémentation

### Bases de Données
- [NPCs Coordinates](NPCS_COORDINATES.md) - 130+ positions précises
- [Monsters Spawn Locations](MONSTERS_SPAWN_LOCATIONS.md) - 15 Uniques + spots
- [Map Coordinates Reference](MAP_COORDINATES_REFERENCE.md) - Toutes coordonnées
- [Items Database](ITEMS_DATABASE.md) - Tous les items
- [Skills Database Chinese](SKILLS_DATABASE_CHINESE.md) - 7 maîtrises
- [Skills Database European](SKILLS_DATABASE_EUROPEAN.md) - 8 classes

### Autres Ressources
- [Hub Classes](HUB_CLASSES.md) - Classes et builds
- [Hub Combat](HUB_COMBAT.md) - Système de combat
- [Hub Jobs](HUB_JOBS.md) - Système de jobs
- [Hub Économie](HUB_ECONOMIE.md) - Or et commerce

---

## 🔗 Liens Externes

### Technologies Utilisées
- **Babylon.js** : https://doc.babylonjs.com/
- **Socket.io** : https://socket.io/docs/
- **Prisma** : https://www.prisma.io/docs
- **React** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/docs/

### Communauté SRO Development
- **xSROMap** : https://jellybitz.github.io/xSROMap/ (Cartes)
- **SRO Forums** : http://www.silkroadforums.com/ (Development)
- **Elitepvpers** : https://www.elitepvpers.com/ (Emulators)

---

**Dernière mise à jour:** 2025-01-20
**Hub Technique** - Centralise toute la documentation technique SRObro
