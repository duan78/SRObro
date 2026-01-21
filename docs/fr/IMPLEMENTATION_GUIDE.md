# Guide d'Implémentation - SRObro

## Vue d'ensemble

Ce guide fournit un plan d'implémentation détaillé pour créer **SRObro**, un portage de Silkroad Online vers le web avec Babylon.js.

**Durée estimée:** 6-12 mois
**Équipe recommandée:** 2-4 développeurs
**Stack technique:** TypeScript, Babylon.js, React, Node.js, PostgreSQL

---

## Architecture Technique

### Stack Recommandée

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend                                                       │
├─────────────────────────────────────────────────────────────────┤
│  Framework: React 18+                                           │
│  3D Engine: Babylon.js 6+                                      │
│  State: Zustand ou Redux                                        │
│  UI: TailwindCSS ou Material-UI                                 │
├─────────────────────────────────────────────────────────────────┤
│  Backend                                                        │
├─────────────────────────────────────────────────────────────────┤
│  Runtime: Node.js 20+                                           │
│  Framework: Express.js ou Fastify                               │
│  WebSocket: Socket.io                                           │
│  ORM: Prisma (PostgreSQL) ou Mongoose (MongoDB)                 │
├─────────────────────────────────────────────────────────────────┤
│  Database                                                       │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (recommandé) ou MongoDB                             │
│  Redis (pour le cache et les sessions)                          │
├─────────────────────────────────────────────────────────────────┤
│  DevOps                                                         │
├─────────────────────────────────────────────────────────────────┤
│  Git: GitHub ou GitLab                                         │
│  CI/CD: GitHub Actions ou GitLab CI                            │
│  Hosting: AWS, Azure, ou Google Cloud                          │
│  CDN: Cloudflare pour les assets                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Setup Initial (Semaine 1-2)

### Objectifs

- Initialiser les projets Frontend et Backend
- Configurer l'environnement de développement
- Mettre en place la base de données

---

### 1.1 Initialisation du Projet

**Création du monorepo:**
```bash
# Structure des dossiers
srobro/
├── frontend/          # React + Babylon.js
├── backend/           # Node.js + Express
├── shared/            # Code partagé (types, etc.)
├── docker/            # Configurations Docker
└── docs/              # Documentation
```

**Initialiser les sous-projets:**
```bash
# Frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install babylonjs @babylonjs/core @babylonjs/loaders
npm install socket.io-client
npm install zustand  # State management
npm install tailwindcss  # Styling

# Backend
cd ../backend
npm init -y
npm install express socket.io
npm install typescript @types/node @types/express
npm install prisma @prisma/client  # ORM
npm install jsonwebtoken bcrypt  # Auth
npm install dotenv

# Shared
cd ../shared
npm init -y
npm install typescript
```

---

### 1.2 Configuration TypeScript

**shared/types/src/index.ts:**
```typescript
// Types partagés entre frontend et backend

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Character {
    id: number;
    name: string;
    level: number;
    position: Vector3;
    rotation: number;
    region: number;
    modelId: number;
}

export interface Player extends Character {
    accountId: number;
    hp: number;
    mp: number;
    exp: number;
    maxHp: number;
    maxMp: number;
}

export interface MovementData {
    characterId: number;
    position: Vector3;
    rotation: number;
    timestamp: number;
}

export interface AttackData {
    attackerId: number;
    targetId: number;
    skillId: number;
    damage: number;
}

export interface ChatMessage {
    senderId: number;
    senderName: string;
    message: string;
    chatType: number;
    timestamp: number;
}
```

---

### 1.3 Configuration de la Base de Données

**Schéma Prisma (PostgreSQL):**
```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  email     String?   @unique
  password  String
  status    Int       @default(1)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  characters Character[]
}

model Character {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  accountId   Int
  level       Int      @default(1)
  exp         BigInt   @default(0)
  hp          Int      @default(200)
  mp          Int      @default(200)
  strength    Int      @default(20)
  intellect   Int      @default(20)
  positionX   Float    @default(0)
  positionY   Float    @default(0)
  positionZ   Float    @default(0)
  region      Int      @default(0)
  modelId     Int
  guildId     Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  account     Account  @relation(fields: [accountId], references: [id])
  guild       Guild?   @relation(fields: [guildId], references: [id])
  skills      CharacterSkill[]
  inventory   InventoryItem[]

  @@index([accountId])
}

model CharacterSkill {
  id         Int      @id @default(autoincrement())
  characterId Int
  skillId    Int
  level      Int      @default(1)

  character  Character @relation(fields: [characterId], references: [id])

  @@unique([characterId, skillId])
}

model Item {
  id         Int     @id @default(autoincrement())
  codeName   String  @unique
  name       String
  type       Int
  level      Int
  price      BigInt
  stackSize  Int     @default(1)

  inventory  InventoryItem[]
}

model InventoryItem {
  id         Int      @id @default(autoincrement())
  characterId Int
  itemId     Int
  quantity   Int      @default(1)
  slot       Int
  plus       Int      @default(0)

  character  Character @relation(fields: [characterId], references: [id])
  item       Item      @relation(fields: [itemId], references: [id])
}

model Guild {
  id         Int      @id @default(autoincrement())
  name       String   @unique
  level      Int      @default(1)
  masterId   Int
  notice     String?
  createdAt  DateTime @default(now())

  members    Character[]
}
```

**Migration:**
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

## Phase 2: Backend Core (Semaine 3-6)

### Objectifs

- Implémenter le serveur WebSocket
- Créer le packet handler
- Implémenter l'authentification
- Gérer les connexions

---

### 2.1 Serveur Express + Socket.io

**backend/src/server.ts:**
```typescript
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Authentification
io.use(async (socket: Socket, next) => {
  const token = socket.handshake.auth.token;
  // Vérifier le token JWT
  const user = await verifyToken(token);
  if (user) {
    socket.data.user = user;
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

// Gestion des connexions
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handlers
  setupCharacterHandlers(socket);
  setupMovementHandlers(socket);
  setupCombatHandlers(socket);
  setupChatHandlers(socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    handleDisconnect(socket);
  });
});

const PORT = process.env.PORT || 15879;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### 2.2 Authentification

**backend/src/auth.ts:**
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(username: string, email: string, password: string) {
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer le compte
  const account = await prisma.account.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  });

  return account;
}

export async function login(username: string, password: string) {
  // Chercher le compte
  const account = await prisma.account.findUnique({
    where: { username }
  });

  if (!account) {
    throw new Error('Account not found');
  }

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, account.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { accountId: account.id, username: account.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, account };
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}
```

---

### 2.3 Handlers de Personnages

**backend/src/handlers/character.ts:**
```typescript
import { Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { Character, Player } from 'shared/types';

const prisma = new PrismaClient();

// Map des joueurs connectés
const onlinePlayers = new Map<number, Player>();

export function setupCharacterHandlers(socket: Socket) {
  // Créer un personnage
  socket.on('character_create', async (data, callback) => {
    try {
      const { name, modelId } = data;
      const accountId = socket.data.user.accountId;

      // Vérifier si le nom existe déjà
      const existing = await prisma.character.findUnique({
        where: { name }
      });

      if (existing) {
        return callback({ success: false, error: 'Name already exists' });
      }

      // Créer le personnage
      const character = await prisma.character.create({
        data: {
          name,
          accountId,
          modelId,
          positionX: 1000,
          positionY: 0,
          positionZ: 1000,
          region: 1
        }
      });

      callback({ success: true, character });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Liste des personnages
  socket.on('character_list', async (callback) => {
    try {
      const accountId = socket.data.user.accountId;

      const characters = await prisma.character.findMany({
        where: { accountId }
      });

      callback({ success: true, characters });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Entrer dans le monde
  socket.on('world_join', async (data, callback) => {
    try {
      const characterId = data.characterId;
      const accountId = socket.data.user.accountId;

      // Vérifier que le personnage appartient au compte
      const character = await prisma.character.findFirst({
        where: {
          id: characterId,
          accountId
        },
        include: {
          account: true,
          skills: true,
          inventory: {
            include: { item: true }
          }
        }
      });

      if (!character) {
        return callback({ success: false, error: 'Character not found' });
      }

      // Créer le joueur
      const player: Player = {
        id: character.id,
        name: character.name,
        level: character.level,
        position: {
          x: character.positionX,
          y: character.positionY,
          z: character.positionZ
        },
        rotation: 0,
        region: character.region,
        modelId: character.modelId,
        accountId: character.accountId,
        hp: character.hp,
        mp: character.mp,
        exp: Number(character.exp),
        maxHp: character.hp,
        maxMp: character.mp
      };

      // Ajouter aux joueurs en ligne
      onlinePlayers.set(characterId, player);
      socket.data.character = player;

      // Envoyer les personnages proches
      const nearbyPlayers = getNearbyPlayers(player.position, 100);

      callback({
        success: true,
        character: player,
        nearbyPlayers
      });

      // Notifier les autres joueurs
      socket.broadcast.emit('character_spawn', player);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });
}

function getNearbyPlayers(position: { x: number; y: number; z: number }, radius: number): Player[] {
  const nearby: Player[] = [];

  for (const [id, player] of onlinePlayers) {
    const distance = Math.sqrt(
      Math.pow(player.position.x - position.x, 2) +
      Math.pow(player.position.y - position.y, 2) +
      Math.pow(player.position.z - position.z, 2)
    );

    if (distance <= radius) {
      nearby.push(player);
    }
  }

  return nearby;
}
```

---

### 2.4 Handlers de Mouvement

**backend/src/handlers/movement.ts:**
```typescript
import { Socket } from 'socket.io';
import { onlinePlayers } from './character';

export function setupMovementHandlers(socket: Socket) {
  socket.on('movement', (data) => {
    const player = socket.data.character;
    if (!player) return;

    const { x, y, z, rotation } = data;

    // Valider la position
    if (!isValidPosition(x, y, z)) {
      return;
    }

    // Vérifier la vitesse (anti-speedhack)
    const distance = Math.sqrt(
      Math.pow(x - player.position.x, 2) +
      Math.pow(y - player.position.y, 2) +
      Math.pow(z - player.position.z, 2)
    );

    const maxSpeed = 0.1; // m/ms (à ajuster)
    const deltaTime = Date.now() - player.lastMoveTime || 0;
    const maxDistance = maxSpeed * deltaTime;

    if (distance > maxDistance * 2) {  // Tolérance 2x
      console.log(`Speed hack detected: ${player.name}`);
      return;
    }

    // Mettre à jour la position
    player.position = { x, y, z };
    player.rotation = rotation;
    player.lastMoveTime = Date.now();

    // Sauvegarder en base de données (periodiquement)
    if (Math.random() < 0.1) {  // 10% de chance
      savePosition(player);
    }

    // Diffuser aux joueurs proches
    const nearbyPlayers = getNearbyPlayers(player.position, 100);

    for (const nearbyPlayer of nearbyPlayers) {
      if (nearbyPlayer.id !== player.id) {
        socket.to(`player_${nearbyPlayer.id}`).emit('character_move', {
          characterId: player.id,
          position: player.position,
          rotation: player.rotation
        });
      }
    }
  });
}

function isValidPosition(x: number, y: number, z: number): boolean {
  // Vérifier que la position est dans les limites du monde
  if (x < -1000 || x > 1000) return false;
  if (y < -100 || y > 100) return false;
  if (z < -1000 || z > 1000) return false;

  return true;
}

async function savePosition(player: Player) {
  // Utiliser une queue pour éviter les trop nombreuses écritures
  await prisma.character.update({
    where: { id: player.id },
    data: {
      positionX: player.position.x,
      positionY: player.position.y,
      positionZ: player.position.z
    }
  });
}
```

---

## Phase 3: Frontend Core (Semaine 7-10)

### Objectifs

- Créer la scène Babylon.js
- Implémenter le réseau (Socket.io)
- Gérer les inputs
- Afficher les personnages

---

### 3.1 Initialisation Babylon.js

**frontend/src/scenes/GameScene.tsx:**
```typescript
import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3 } from '@babylonjs/core';
import { Socket } from 'socket.io-client';

export const GameScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Créer le moteur Babylon.js
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Optimisation
    scene.collisionsEnabled = true;

    // Caméra (3ème personne)
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.checkCollisions = true;
    camera.upperBetaLimit = Math.PI / 2 - 0.1;  // Empêcher de passer sous le sol

    // Lumière
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Sol
    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);
    ground.checkCollisions = true;

    // Socket.io
    socketRef.current = io('http://localhost:15879', {
      transports: ['websocket']
    });

    // Handlers
    setupSocketHandlers(scene, socketRef.current);

    // Boucle de rendu
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize
    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
      socketRef.current?.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
};
```

---

### 3.2 Chargement des Personnages

**frontend/src/characters/CharacterManager.ts:**
```typescript
import { Scene, Vector3, SceneLoader, SkeletonMesh } from '@babylonjs/core';
import { Player } from 'shared/types';

export class CharacterManager {
  private characters = new Map<number, SkeletonMesh>();

  constructor(private scene: Scene) {}

  async loadPlayer(player: Player): Promise<void> {
    // Charger le modèle
    const result = await SceneLoader.ImportMeshAsync(
      '',
      '/models/',
      `character_${player.modelId}.glb`,
      this.scene
    );

    const mesh = result.meshes[0] as SkeletonMesh;
    mesh.position = new Vector3(
      player.position.x,
      player.position.y,
      player.position.z
    );
    mesh.rotation.y = player.rotation;
    mesh.checkCollisions = true;

    // Sauvegarder
    this.characters.set(player.id, mesh);
  }

  updatePosition(characterId: number, position: Vector3, rotation: number): void {
    const mesh = this.characters.get(characterId);
    if (mesh) {
      mesh.position = position;
      mesh.rotation.y = rotation;
    }
  }

  removePlayer(characterId: number): void {
    const mesh = this.characters.get(characterId);
    if (mesh) {
      mesh.dispose();
      this.characters.delete(characterId);
    }
  }
}
```

---

### 3.3 Inputs et Contrôles

**frontend/src/inputs/InputManager.ts:**
```typescript
import { Scene, KeyboardEventTypes, Vector3 } from '@babylonjs/core';
import { Socket } from 'socket.io-client';

export class InputManager {
  private keys = new Map<string, boolean>();
  private lastMoveTime = 0;
  private moveInterval = 50; // ms

  constructor(private scene: Scene, private socket: Socket) {
    this.setupKeyboard();
  }

  private setupKeyboard(): void {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();

      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          this.keys.set(key, true);
          break;

        case KeyboardEventTypes.KEYUP:
          this.keys.set(key, false);
          break;
      }
    });
  }

  public update(playerPosition: Vector3): void {
    const now = Date.now();
    if (now - this.lastMoveTime < this.moveInterval) return;

    const direction = this.getMovementDirection();
    if (direction.length() === 0) return;

    // Envoyer le mouvement au serveur
    this.socket.emit('movement', {
      x: playerPosition.x + direction.x,
      y: playerPosition.y,
      z: playerPosition.z + direction.z
    });

    this.lastMoveTime = now;
  }

  private getMovementDirection(): Vector3 {
    const dir = new Vector3(0, 0, 0);

    if (this.keys.get('w')) dir.z += 1;
    if (this.keys.get('s')) dir.z -= 1;
    if (this.keys.get('a')) dir.x -= 1;
    if (this.keys.get('d')) dir.x += 1;

    return dir.normalize().scale(0.5); // Vitesse
  }
}
```

---

## Phase 4: Tests et Déploiement (Semaine 11-12)

### Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Déploiement

**Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: srobro
      POSTGRES_USER: srobro
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "15879:15879"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://srobro:password@postgres:5432/srobro

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Lancement:**
```bash
docker-compose up -d
```

---

## Prochaines Étapes

1. **Système de combat**
   - Skills
   - Dégâts
   - Effets visuels

2. **Système d'inventaire**
   - Items
   - Équipement
   - Boutiques

3. **Système de guildes**
   - Création
   - Gestion
   - Guild wars

4. **Système de jobs**
   - Trader
   - Thief
   - Hunter

5. **Optimisations**
   - LOD (Level of Detail)
   - Instancing
   - Occlusion culling

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Statut:** ✅ Documenté
