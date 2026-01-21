# Guide Technique de Développement - SRObro

## 📋 Table des Matières
- [Introduction](#introduction)
- [Architecture du Projet](#architecture-du-projet)
- [Stack Technique](#stack-technique)
- [Structure des Dossiers](#structure-des-dossiers)
- [Installation et Configuration](#installation-et-configuration)
- [Développement Client](#développement-client)
- [Développement Serveur](#développement-serveur)
- [Base de Données](#base-de-données)
- [Outils de Développement](#outils-de-développement)
- [Conventions de Code](#conventions-de-code)
- [Build et Déploiement](#build-et-déploiement)

---

## 📚 Introduction

**SRObro** est un clone de Silkroad Online fonctionnant entièrement dans le navigateur via WebGL. Ce document guide les développeurs à travers l'architecture, l'installation, et les meilleures pratiques pour contribuer au projet.

### Objectifs du Projet

- **Reproduire l'expérience Silkroad Online** dans le navigateur
- **Supporter des milliers de joueurs** simultanément
- **Architecture moderne** et maintenable
- **Code open-source** et communautaire

---

## 🏗️ Architecture du Projet

SRObro utilise une **architecture monorepo** avec:

```
srobro/
├── client/          # Frontend Babylon.js (React + TypeScript)
├── server/          # Backend Node.js (Express + Socket.io)
├── shared/          # Code partagé (types, utilitaires)
└── tools/           # Outils de développement
    ├── pk2-extractor/    # Extraction des fichiers SRO PK2
    └── veykril-pk2/     # Bibliothèque PK2 (Rust)
```

### Flux de Données

```
┌─────────────┐
│   Client    │ Babylon.js WebGL
│  (Browser)  │
└──────┬──────┘
       │ WebSocket/HTTP
       ↓
┌─────────────┐
│   Server    │ Node.js + Express
│             │ Socket.io (real-time)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Database   │ PostgreSQL
│   + Redis   │ (Cache + Sessions)
└─────────────┘
```

---

## 🛠️ Stack Technique

### Client (Frontend)

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **TypeScript** | 5.3+ | Typage statique |
| **Babylon.js** | 7.x | Moteur 3D/WebGL |
| **React** | 18.x | UI Components |
| **Vite** | 7.x | Build tool/dev server |
| **Vitest** | - | Testing unitaire |

### Serveur (Backend)

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | 20.x+ | Runtime JavaScript |
| **TypeScript** | 5.3+ | Typage statique |
| **Express** | 4.x | Web framework |
| **Socket.io** | 4.x | WebSocket real-time |
| **Prisma** | 5.x | ORM Database |
| **PostgreSQL** | 16+ | Base de données principale |
| **Redis** | 7.x | Cache et sessions |
| **PM2** | - | Process management |

### Outils

| Outil | Utilisation |
|-------|-------------|
| **PK2 Extractor** | Extraction assets SRO |
| **Veykril-PK2** | Parser PK2 (Rust) |
| **ESLint** | Linting code |
| **Prettier** | Formatting code |
| **Concurrently** | Run multiple scripts |

---

## 📁 Structure des Dossiers

### Client (Babylon.js + React)

```
client/
├── src/
│   ├── core/              # Cœur Babylon.js
│   │   ├── Game.ts       # Boucle de jeu principale
│   │   ├── Scene.ts      # Gestion de scène 3D
│   │   ├── Camera.ts     # Contrôles caméra
│   │   └── Input.ts      # Gestion input (clavier/souris)
│   ├── entities/         # Entités de jeu
│   │   ├── Player/       # Joueur
│   │   ├── NPC/          # PNJ
│   │   ├── Monster/      # Monstres
│   │   └── Pet/          # Pets (mount/attack/grab)
│   ├── systems/          # Systèmes de jeu
│   │   ├── Combat/       # Combat système
│   │   ├── Movement/     # Déplacement
│   │   ├── Inventory/    # Inventaire
│   │   └── Skills/       # Compétences
│   ├── ui/               # Interface utilisateur
│   │   ├── HUD/          # Heads-up display
│   │   ├── Inventory/    # Inventaire UI
│   │   ├── Skills/       # Skills bar
│   │   ├── Chat/         # Chat système
│   │   └── Minimap/      # Minimap
│   ├── network/          # Communication serveur
│   │   ├── SocketClient.ts
│   │   └── Messages.ts   # Types de messages
│   └── assets/           # Assets du jeu
│       ├── models/       # Modèles 3D
│       ├── textures/     # Textures
│       └── sounds/       # Sons
├── public/
│   └── index.html
├── package.json
└── vite.config.ts
```

### Serveur (Node.js + Express)

```
server/
├── src/
│   ├── index.ts          # Point d'entrée
│   ├── app.ts           # Configuration Express
│   ├── server.ts        # HTTP Server
│   ├── routes/          # Routes HTTP
│   │   ├── auth.ts      # Authentification
│   │   ├── character.ts # Personnage CRUD
│   │   └── game.ts      # Game endpoints
│   ├── socket/          # Socket.io handlers
│   │   ├── GameSocket.ts   # Game events
│   │   ├── ChatSocket.ts   # Chat système
│   │   └── TradeSocket.ts  # Trading système
│   ├── services/        # Logique métier
│   │   ├── AuthService.ts
│   │   ├── CharacterService.ts
│   │   ├── CombatService.ts
│   │   └── WorldService.ts
│   ├── models/          # Modèles Prisma
│   │   ├── User.ts
│   │   ├── Character.ts
│   │   ├── Item.ts
│   │   └── ...
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── rateLimit.ts
│   ├── utils/           # Utilitaires
│   │   ├── logger.ts
│   │   ├── math.ts
│   │   └── config.ts
│   └── database/        # Database config
│       ├── prisma.ts    # Prisma client
│       └── seed.ts      # Seed data
├── prisma/
│   └── schema.prisma    # Schéma DB
├── package.json
└── tsconfig.json
```

### Shared (Code Commun)

```
shared/
├── src/
│   ├── types/           # Types TypeScript partagés
│   │   ├── game.ts      # Types jeu
│   │   ├── network.ts   # Types messages réseau
│   │   └── items.ts     # Types items
│   ├── constants/       # Constantes
│   │   ├── game.ts      # Constantes jeu
│   │   └── items.ts     # Constantes items
│   └── utils/           # Utilitaires partagés
│       ├── math.ts      # Fonctions math
│       └── validation.ts
├── package.json
└── tsconfig.json
```

### Tools

```
tools/
├── pk2-extractor/       # Extracteur PK2 (Rust)
│   ├── src/
│   └── Cargo.toml
└── veykril-pk2/         # Parser PK2 (Rust)
    ├── src/
    └── Cargo.toml
```

---

## 🔧 Installation et Configuration

### Prérequis

- **Node.js** 20.0 ou supérieur
- **npm** 10.0 ou supérieur
- **PostgreSQL** 16+ (ou Docker)
- **Redis** 7+ (ou Docker)
- **Git** (pour le versioning)
- **Rust** (pour les outils, optionnel)

### Installation Pas à Pas

```bash
# 1. Cloner le repository
git clone https://github.com/yourusername/SRObro.git
cd SRObro

# 2. Installer les dépendances racine
npm install

# 3. Installer toutes les workspaces
npm run install:all

# 4. Configurer la base de données
# Créer .env dans server/ avec:
DATABASE_URL="postgresql://user:password@localhost:5432/srobro"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
PORT=3001

# 5. Lancer les migrations
npm run db:migrate

# 6. Seed la base de données (optionnel)
npm run db:seed

# 7. Lancer en développement
npm run dev
```

### Configuration Docker (Alternative)

```bash
# Avec Docker Compose
docker-compose up -d

# Les services suivants seront lancés:
# - PostgreSQL (port 5432)
# - Redis (port 6379)

# Puis installer et lancer npm run dev
```

---

## 🎮 Développement Client

### Architecture Babylon.js

Le client utilise **Babylon.js** comme moteur 3D principal:

```typescript
// Exemple: Initialisation du jeu
import { Engine, Scene } from '@babylonjs/core';

class Game {
  private engine: Engine;
  private scene: Scene;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);

    this.initScene();
    this.startRenderLoop();
  }

  private initScene(): void {
    // Caméra
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      Vector3.Zero(),
      this.scene
    );
    camera.attachControl(canvas, true);

    // Lumière
    const light = new HemisphericLight(
      'light',
      Vector3.Up(),
      this.scene
    );

    // Sol
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: 100, height: 100 },
      this.scene
    );
  }

  private startRenderLoop(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
```

### Système d'Entités

```typescript
// Classe de base pour les entités
abstract class Entity {
  protected mesh: AbstractMesh;
  protected position: Vector3;

  constructor(position: Vector3, scene: Scene) {
    this.position = position;
    this.mesh = this.createMesh(scene);
    this.mesh.position.copy(position);
  }

  abstract createMesh(scene: Scene): AbstractMesh;

  update(deltaTime: number): void {
    // Update logique
  }
}

// Exemple: Joueur
class Player extends Entity {
  private health: number = 1000;
  private mana: number = 500;
  private level: number = 1;

  createMesh(scene: Scene): AbstractMesh {
    return MeshBuilder.CreateCapsule(
      'player',
      { radius: 0.5, height: 2 },
      scene
    );
  }

  move(direction: Vector3): void {
    this.position.add(direction);
    this.mesh.position.copy(this.position);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    // Gestion de la mort
  }
}
```

### Communication Réseau

```typescript
// Client Socket.io
import { io, Socket } from 'socket.io-client';

class NetworkManager {
  private socket: Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Connexion
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Mise à jour des joueurs
    this.socket.on('players:update', (players: PlayerData[]) => {
      this.updatePlayers(players);
    });

    // Mouvement d'un joueur
    this.socket.on('player:moved', (data: MoveData) => {
      this.onPlayerMoved(data);
    });

    // Combat events
    this.socket.on('combat:hit', (data: HitData) => {
      this.onCombatHit(data);
    });
  }

  // Envoyer des actions au serveur
  move(position: Vector3): void {
    this.socket.emit('player:move', {
      x: position.x,
      y: position.y,
      z: position.z
    });
  }

  attack(targetId: string): void {
    this.socket.emit('combat:attack', { targetId });
  }
}
```

---

## 🖥️ Développement Serveur

### Architecture Express

```typescript
// app.ts - Configuration Express
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/game', gameRoutes);

// Créer serveur HTTP
const httpServer = createServer(app);

// Créer serveur Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

export { app, httpServer, io };
```

### Socket.io Handlers

```typescript
// socket/GameSocket.ts
import { Socket } from 'socket.io';

export class GameSocket {
  constructor(private socket: Socket) {
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Connection
    this.socket.on('player:move', this.onPlayerMove.bind(this));
    this.socket.on('combat:attack', this.onCombatAttack.bind(this));
    this.socket.on('chat:message', this.onChatMessage.bind(this));
  }

  private async onPlayerMove(data: MoveData): Promise<void> {
    const { socket } = this;
    const playerId = socket.data.playerId;

    // Valider la position
    if (!this.isValidPosition(data.x, data.y, data.z)) {
      socket.emit('error', { message: 'Invalid position' });
      return;
    }

    // Mettre à jour la position dans la DB
    await prisma.player.update({
      where: { id: playerId },
      data: { positionX: data.x, positionY: data.y, positionZ: data.z }
    });

    // Broadcast aux autres joueurs
    socket.broadcast.emit('player:moved', {
      playerId,
      ...data
    });
  }

  private async onCombatAttack(data: AttackData): Promise<void> {
    const { socket } = this;
    const attackerId = socket.data.playerId;

    // Logique de combat
    const result = await this.combatService.attack({
      attackerId,
      targetId: data.targetId,
      skillId: data.skillId
    });

    // Envoyer le résultat
    socket.emit('combat:result', result);
    socket.broadcast.emit('combat:result', result);
  }

  private onChatMessage(data: ChatMessage): void {
    const { socket } = this;
    const playerId = socket.data.playerId;

    // Sauvegarder le message
    const message = {
      playerId,
      content: data.content,
      timestamp: new Date()
    };

    // Broadcast à tous
    this.io.emit('chat:message', message);
  }
}
```

### Services

```typescript
// services/CharacterService.ts
import { PrismaClient } from '@prisma/client';

export class CharacterService {
  constructor(private prisma: PrismaClient) {}

  async createCharacter(userId: string, data: CreateCharacterDto) {
    return this.prisma.character.create({
      data: {
        userId,
        name: data.name,
        race: data.race, // CHINESE or EUROPEAN
        level: 1,
        experience: 0,
        skillPoints: 0,
        gold: 0,
        positionX: 2000, // Jangan start
        positionY: 1000,
        positionZ: 0
      }
    });
  }

  async getCharacters(userId: string) {
    return this.prisma.character.findMany({
      where: { userId }
    });
  }

  async levelUp(characterId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) throw new Error('Character not found');

    return this.prisma.character.update({
      where: { id: characterId },
      data: {
        level: character.level + 1,
        skillPoints: character.skillPoints + 3
      }
    });
  }
}
```

---

## 🗄️ Base de Données

### Schéma Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  characters Character[]
}

model Character {
  id          String   @id @default(cuid())
  name        String
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  race        Race     // CHINESE or EUROPEAN
  level       Int      @default(1)
  experience  BigInt   @default(0)
  skillPoints Int      @default(0)

  strength    Int      @default(20)
  intelligence Int     @default(20)

  gold        BigInt   @default(0)
  positionX   Float
  positionY   Float
  positionZ   Float    @default(0)

  inventory   Inventory[]
  skills      CharacterSkill[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([name, userId])
}

enum Race {
  CHINESE
  EUROPEAN
}

model Item {
  id          String   @id @default(cuid())
  name        String
  type        ItemType
  degree      Int      // 1D-13D
  tier        ItemTier // NORMAL, SOS, SOM, SUN, NOVA

  stats       Json     // Flexible stats storage

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ItemType {
  WEAPON
  ARMOR
  ACCESSORY
  POTION
  MATERIAL
}

enum ItemTier {
  NORMAL
  SEAL_OF_STAR
  SEAL_OF_MOON
  SEAL_OF_SUN
  SEAL_OF_NOVA
}

model Inventory {
  id          String   @id @default(cuid())
  characterId String
  character   Character @relation(fields: [characterId], references: [id])

  itemId      String
  item        Item     @relation(fields: [itemId], references: [id])
  quantity    Int      @default(1)
  slot        Int

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([characterId, slot])
}

model CharacterSkill {
  id          String   @id @default(cuid())
  characterId String
  character   Character @relation(fields: [characterId], references: [id])

  masteryId   String
  level       Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([characterId, masteryId])
}
```

### Migrations

```bash
# Créer une migration
npx prisma migrate dev --name add_job_system

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la DB (développement seulement)
npx prisma migrate reset
```

---

## 🛠️ Outils de Développement

### PK2 Extractor

Les fichiers de données de Silkroad Online sont dans le format **PK2**. Nous avons deux outils:

#### pk2-extractor (Rust)

```bash
cd tools/pk2-extractor
cargo build --release

# Extraire les fichiers
./target/release/pk2-extractor /path/to/media.pk2 ./output
```

Extrait:
- Modèles 3D (BSR)
- Textures (DDJ/DDS)
- Sons (mp3/wav)
- Données (XML, JSON)

#### veykril-pk2 (Rust Library)

```bash
cd tools/veykril-pk2
cargo build --release

# Utiliser comme library
```

### Scripts Utiles

```bash
# Lancer le client en développement
npm run dev:client    # Port 5173

# Lancer le serveur en développement
npm run dev:server    # Port 3001

# Lancer les deux simultanément
npm run dev

# Build pour production
npm run build

# Database operations
npm run db:migrate    # Appliquer migrations
npm run db:seed       # Peupler la DB

# Docker
npm run docker:up     # Lancer PostgreSQL + Redis
npm run docker:down   # Arrêter les conteneurs
npm run docker:logs   # Voir les logs
```

---

## 📐 Conventions de Code

### TypeScript

```typescript
// Nommage: camelCase pour variables et fonctions
const playerName: string = 'Hero';

// Classes: PascalCase
class GameManager {
  private activePlayers: Map<string, Player> = new Map();

  public addPlayer(player: Player): void {
    this.activePlayers.set(player.id, player);
  }
}

// Constants: UPPER_SNAKE_CASE
const MAX_LEVEL = 120;
const EXP_PER_LEVEL = 1000;

// Interfaces: PascalCase avec préfixe I
interface ICharacter {
  id: string;
  name: string;
  level: number;
}

// Types: PascalCase
type Race = 'CHINESE' | 'EUROPEAN';
```

### Imports

```typescript
// Imports organisés par groupe
// 1. Node modules
import express from 'express';
import { io, Socket } from 'socket.io-client';

// 2. Types partagés
import { PlayerData, MoveData } from '@srobro/shared/types';

// 3. Types locaux
import { Game } from './core/Game';
import { Player } from './entities/Player';
```

### Commentaires

```typescript
/**
 * Calcule les dommages d'une attaque
 *
 * @param attacker - Attaquant
 * @param defender - Défenseur
 * @param skill - Compétence utilisée
 * @returns Dommages calculés
 *
 * @example
 * ```typescript
 * const damage = calculateDamage(attacker, defender, fireBolt);
 * ```
 */
function calculateDamage(
  attacker: Player,
  defender: Player,
  skill: Skill
): number {
  // Implementation
  return 100;
}
```

---

## 📦 Build et Déploiement

### Build Production

```bash
# Builder tout le projet
npm run build

# Cette commande exécute:
# 1. npm run build:shared    # Build shared code
# 2. npm run build:client    # Build client (Vite)
# 3. npm run build:server    # Build server (TSC)
```

### Déploiement

```bash
# 1. Builder le client
cd client
npm run build

# 2. Build le serveur
cd server
npm run build

# 3. Deployer (méthode varie par hébergeur)
# - Vercel/Netlify pour le client
# - DigitalOcean/AWS pour le serveur

# 4. Configurer les environment variables
# DATABASE_URL, REDIS_URL, JWT_SECRET, etc.
```

### Environment Variables

```bash
# .env (server/)
DATABASE_URL="postgresql://user:pass@localhost:5432/srobro"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-here"
PORT=3001
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"

# .env.production
DATABASE_URL="postgresql://user:pass@prod-db:5432/srobro"
REDIS_URL="redis://prod-redis:6379"
JWT_SECRET="production-secret-key"
PORT=3001
CLIENT_URL="https://srobro.com"
NODE_ENV="production"
```

---

## 🧪 Testing

### Tests Unitaires

```typescript
// Exemple avec Vitest
import { describe, it, expect } from 'vitest';
import { calculateDamage } from './combat';

describe('calculateDamage', () => {
  it('should calculate physical damage correctly', () => {
    const attacker = { attack: 100, level: 50 };
    const defender = { defense: 50, level: 50 };
    const skill = { damage: 50, type: 'PHYSICAL' };

    const damage = calculateDamage(attacker, defender, skill);

    expect(damage).toBeGreaterThan(0);
    expect(damage).toBeLessThan(200);
  });
});
```

### Tests d'Intégration

```typescript
// Tests Socket.io
import { Server } from 'socket.io';
import { io as ioClient } from 'socket.io-client';

describe('Game Socket', () => {
  let ioServer;
  let clientSocket;

  beforeEach((done) => {
    ioServer = new Server(3000);
    clientSocket = ioClient('http://localhost:3000');
    clientSocket.on('connect', done);
  });

  it('should move player', (done) => {
    clientSocket.emit('player:move', { x: 100, y: 200, z: 0 });

    clientSocket.on('player:moved', (data) => {
      expect(data.x).toBe(100);
      expect(data.y).toBe(200);
      done();
    });
  });

  afterEach(() => {
    ioServer.close();
    clientSocket.close();
  });
});
```

---

## 🚀 Performance et Optimisation

### Optimisations Client

```typescript
// Instancing (réutiliser les géométries)
const sphereInstance = MeshBuilder.CreateSphere(
  'sphere',
  { diameter: 1, segments: 16 },
  scene
);

// Créer 100 sphères avec la même géométrie
for (let i = 0; i < 100; i++) {
  const sphere = sphereInstance.createInstance('sphere' + i);
  sphere.position.set(Math.random() * 100, 0, Math.random() * 100);
}
```

### Optimisations Serveur

```typescript
// Redis caching
import Redis from 'ioredis';

const redis = new Redis();

async function getCachedCharacter(id: string) {
  // Check cache first
  const cached = await redis.get(`char:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from DB
  const character = await prisma.character.findUnique({
    where: { id }
  });

  // Cache for 5 minutes
  await redis.setex(`char:${id}`, 300, JSON.stringify(character));

  return character;
}
```

---

## 📚 Ressources d'Apprentissage

### Babylon.js
- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [Babylon.js Playground](https://playground.babylonjs.com/)
- [Babylon.js Forum](https://forum.babylonjs.com/)

### Node.js / Express
- [Express Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)

### SRO Spécifique
- [SRObro Documentation](./docs/)
- [Silkroad Online Wiki](https://silkroadonline.fandom.com/)
- [xSROMap](https://jellybitz.github.io/xSROMap/)

---

## 🤝 Contribution Guide

### Workflow de Contribution

1. **Forker** le repository
2. **Créer une branche** (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'feat: Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir une Pull Request**

### Commit Messages

```
feat: add new combat system
fix: resolve memory leak in entity manager
docs: update installation guide
style: format code with prettier
refactor: optimize database queries
test: add unit tests for character service
chore: update dependencies
```

---

## 🐛 Debugging

### Client Debug

```typescript
// Activer le debug logger
scene.debugLayer.show();

// Inspecter les meshes
BABYLON.Tools.Inspect(mesh, scene);

// FPS counter
const fpsLabel = new GUI.GUIBlock();
fpsLabel.height = '30px';
fpsLabel.width = '100px';
fpsLabel.text = 'FPS: ' + engine.getFps().toFixed();
```

### Serveur Debug

```typescript
// Logging avec winston
import logger from './utils/logger';

logger.info('Server started', { port: 3001 });
logger.error('Database connection failed', { error });
logger.debug('Player moved', { playerId, position });

// PM2 logs
pm2 logs srobro-server
pm2 logs srobro-server --lines 100
```

---

## 📈 Monitoring

### Metrics à Surveiller

- **CPU Usage** (Serveur)
- **Memory Usage** (Client + Serveur)
- **Active Connections** (Socket.io)
- **Database Query Time**
- **FPS** (Client)
- **Network Latency**

### Outils

- **PM2** - Process monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **Sentry** - Error tracking

---

*Dernière mise à jour: 20 Janvier 2026*

*Mainteneurs: SRObro Development Team*
