# Intégration Babylon.js pour SRObro

## Vue d'ensemble

Ce document détaille l'intégration de **Babylon.js** pour créer **SRObro**, un portage de Silkroad Online fonctionnant entièrement dans un navigateur web.

**Objectif:** Recréer l'expérience Silkroad Online avec Babylon.js
**Frontend:** Babylon.js + React
**Backend:** Node.js + TypeScript + Socket.io
**Database:** PostgreSQL ou MongoDB

---

## Architecture SRObro

```
┌─────────────────────────────────────────────────────────────────┐
│  Architecture SRObro                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Frontend (Browser)                                     │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ React UI (HUD, Inventory, Skills, Chat, etc.)    │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ Babylon.js Scene (3D World Rendering)           │  │     │
│  │ │ ┌─────────┐  ┌─────────┐  ┌─────────┐          │  │     │
│  │ │ │ Players │  │ NPCs    │  │ Mobs    │          │  │     │
│  │ │ └─────────┘  └─────────┘  └─────────┘          │  │     │
│  │ │ ┌─────────┐  ┌─────────┐  ┌─────────┐          │  │     │
│  │ │ │ Terrain │  │ Items   │  │ Effects │          │  │     │
│  │ │ └─────────┘  └─────────┘  └─────────┘          │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ Socket.io Client (WebSocket Communication)       │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  └──────────────────────┬─────────────────────────────────┘     │
│                          │ WebSocket (WSS)                    │
│                          ▼                                     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Backend (Node.js Server)                               │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ Socket.io Server (WebSocket Handler)             │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ Game Logic (Movement, Combat, Skills, etc.)      │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  │ ┌──────────────────────────────────────────────────┐  │     │
│  │ │ Database Layer (PostgreSQL/MongoDB)              │  │     │
│  │ └──────────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mapping: SRO → Babylon.js

### Concepts SRO vs Babylon.js

| Silkroad Online | Babylon.js | Description |
|-----------------|------------|-------------|
| 3D World | Scene | Conteneur principal du monde 3D |
| Characters (Players/NPCs/Mobs) | Mesh + Skeleton | Modèles 3D avec squelette |
| Animations | AnimationGroup | Animations des personnages |
| Terrain | GroundMesh | Sol du monde |
| Items | Mesh | Objets 3D |
| Skills/Effects | ParticleSystem | Effets visuels |
| Camera | Camera/ArcRotateCamera | Vue du joueur |
| Light | Light/HemisphericLight | Éclairage |
| Textures | Texture | Matériaux des meshes |

---

## 1. Initialisation de Babylon.js

### Setup de Base

**Installation:**
```bash
npm install babylonjs @babylonjs/core @babylonjs/loaders
npm install socket.io-client
npm install react react-dom
```

**Composant React:**
```tsx
import React, { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import { Socket } from 'socket.io-client';

const GameScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialiser Babylon.js
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // Créer la caméra
        const camera = new ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2.5,
            15,
            new Vector3(0, 0, 0),
            scene
        );
        camera.attachControl(canvasRef.current, true);

        // Créer la lumière
        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        // Initialiser Socket.io
        socketRef.current = io('ws://localhost:15879', {
            transports: ['websocket']
        });

        // Gérer les connexions
        setupSocketEvents(scene, socketRef.current);

        // Render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Cleanup
        return () => {
            engine.dispose();
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100vh' }}
        />
    );
};

export default GameScene;
```

---

## 2. Import des Assets 3D

### Extraction depuis media.pk2

**Processus:**
```
1. Extraire les fichiers BSR depuis media.pk2
   PK2 Editor → Character/ → Export

2. Convertir BSR vers FBX/GLTF
   Noesis → Import BSR → Export FBX

3. Optimiser pour le web
   - Réduire le nombre de polygones
   - Compresser les textures
   - Optimiser l'animation

4. Importer dans Babylon.js
   SceneLoader.ImportMesh()
```

---

### Chargement des Modèles

**Chargement d'un personnage:**
```typescript
import { SceneLoader, Vector3 } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

export class Character {
    private mesh: SkeletonMesh | null = null;
    private skeleton: Skeleton | null = null;

    constructor(private scene: Scene, private characterId: number) {}

    async load(modelPath: string): Promise<void> {
        const result = await SceneLoader.ImportMeshAsync(
            "",
            modelPath,
            "character.glb",
            this.scene
        );

        this.mesh = result.meshes[0] as SkeletonMesh;
        this.skeleton = result.skeletons[0];

        // Positionner le personnage
        this.mesh.position = new Vector3(0, 0, 0);
        this.mesh.rotation = new Vector3(0, Math.PI, 0);
    }

    playAnimation(animationName: string): void {
        if (!this.skeleton) return;

        // Arrêter toutes les animations
        this.skeleton.stopAnimation(null);

        // Jouer l'animation demandée
        const animation = this.scene.getAnimationGroupByName(animationName);
        if (animation) {
            animation.start(true); // loop
        }
    }

    moveTo(position: Vector3): void {
        if (!this.mesh) return;

        // Animation de mouvement
        const frameRate = 10;
        const xSlide = new Animation(
            "xSlide",
            "position.x",
            frameRate,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keyFrames = [];
        keyFrames.push({ frame: 0, value: this.mesh.position.x });
        keyFrames.push({ frame: 100, value: position.x });

        xSlide.setKeys(keyFrames);
        this.mesh.animations.push(xSlide);

        this.scene.beginAnimation(this.mesh, 0, 100, false);
    }
}
```

---

## 3. Système de Réseau

### WebSocket avec Socket.io

**Configuration côté client:**
```typescript
import { io, Socket } from 'socket.io-client';

class NetworkManager {
    private socket: Socket;

    constructor(serverUrl: string) {
        this.socket = io(serverUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        // Connexion
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.sendLogin();
        });

        // Déconnexion
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Spawn d'un personnage
        this.socket.on('character_spawn', (data: CharacterSpawnData) => {
            this.onCharacterSpawn(data);
        });

        // Mouvement d'un personnage
        this.socket.on('character_move', (data: MovementData) => {
            this.onCharacterMove(data);
        });

        // Attack
        this.socket.on('character_attack', (data: AttackData) => {
            this.onCharacterAttack(data);
        });
    }

    private sendLogin(): void {
        this.socket.emit('login', {
            username: 'myuser',
            password: 'mypass'
        });
    }

    public sendMovement(position: Vector3): void {
        this.socket.emit('movement', {
            x: position.x,
            y: position.y,
            z: position.z
        });
    }

    public sendAttack(targetId: number, skillId: number): void {
        this.socket.emit('attack', {
            targetId,
            skillId
        });
    }

    // Handlers
    private onCharacterSpawn(data: CharacterSpawnData): void {
        // Créer le mesh du personnage
        const character = new Character(this.scene, data.id);
        character.load(data.modelPath);
    }

    private onCharacterMove(data: MovementData): void {
        // Mettre à jour la position du personnage
        const character = this.characters.get(data.id);
        if (character) {
            character.moveTo(new Vector3(data.x, data.y, data.z));
        }
    }

    private onCharacterAttack(data: AttackData): void {
        // Jouer l'animation d'attaque
        const character = this.characters.get(data.id);
        if (character) {
            character.playAnimation('attack');
        }
    }
}
```

---

## 4. Contrôles et Inputs

### Contrôles du Personnage

**Gestion des touches:**
```typescript
import { KeyboardEventTypes } from '@babylonjs/core';

class InputManager {
    private keys: Map<string, boolean> = new Map();

    constructor(scene: Scene) {
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.keys.set(kbInfo.event.key.toLowerCase(), true);
                    break;

                case KeyboardEventTypes.KEYUP:
                    this.keys.set(kbInfo.event.key.toLowerCase(), false);
                    break;
            }
        });
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.get(key.toLowerCase()) || false;
    }

    public getMovementDirection(): Vector3 {
        const direction = new Vector3(0, 0, 0);

        if (this.isKeyPressed('w')) direction.z += 1;
        if (this.isKeyPressed('s')) direction.z -= 1;
        if (this.isKeyPressed('a')) direction.x -= 1;
        if (this.isKeyPressed('d')) direction.x += 1;

        return direction.normalize();
    }
}
```

**Boucle de mouvement:**
```typescript
// Dans le render loop
scene.onBeforeRenderObservable.add(() => {
    const inputDir = inputManager.getMovementDirection();

    if (inputDir.length() > 0) {
        // Calculer la nouvelle position
        const speed = 0.1;
        const deltaTime = engine.getDeltaTime() / 1000;
        const movement = inputDir.scale(speed * deltaTime);

        const newPosition = player.position.add(movement);

        // Envoyer au serveur
        networkManager.sendMovement(newPosition);

        // Mettre à jour localement (prédiction)
        player.position = newPosition;
    }
});
```

---

## 5. Interface Utilisateur (React)

### HUD (Heads-Up Display)

**Composant HUD:**
```tsx
import React, { useState, useEffect } from 'react';

const HUD: React.FC = () => {
    const [hp, setHP] = useState(100);
    const [mp, setMP] = useState(100);
    const [exp, setExp] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        // Écouter les événements du serveur
        socket.on('stats_update', (data) => {
            setHP(data.hp);
            setMP(data.mp);
            setExp(data.exp);
            setLevel(data.level);
        });
    }, []);

    return (
        <div className="hud">
            <div className="hp-bar">
                <div className="bar-fill" style={{ width: `${hp}%` }} />
                <span>HP: {hp}/100</span>
            </div>

            <div className="mp-bar">
                <div className="bar-fill" style={{ width: `${mp}%` }} />
                <span>MP: {mp}/100</span>
            </div>

            <div className="exp-bar">
                <div className="bar-fill" style={{ width: `${exp}%` }} />
                <span>Lvl {level}</span>
            </div>

            <Skillbar />
            <ChatBox />
        </div>
    );
};

const Skillbar: React.FC = () => {
    const skills = [
        { id: 1, name: 'Basic Attack', icon: '/icons/skill1.png' },
        { id: 2, name: 'Fire Shield', icon: '/icons/skill2.png' },
        // ...
    ];

    return (
        <div className="skillbar">
            {skills.map(skill => (
                <div key={skill.id} className="skill-slot">
                    <img src={skill.icon} alt={skill.name} />
                    <span className="keybind">{skill.id}</span>
                </div>
            ))}
        </div>
    );
};

export default HUD;
```

---

## 6. Optimisations Performance

### Level of Detail (LOD)

```typescript
// Créer plusieurs versions du modèle avec différentes résolutions
const createLOD = (scene: Scene) => {
    const lod = new Mesh("character_lod", scene);

    // High detail (distance < 10)
    const highDetail = SceneLoader.ImportMesh(
        "",
        "./models/",
        "character_high.glb",
        scene
    );

    // Medium detail (10 < distance < 30)
    const mediumDetail = SceneLoader.ImportMesh(
        "",
        "./models/",
        "character_medium.glb",
        scene
    );

    // Low detail (distance >= 30)
    const lowDetail = SceneLoader.ImportMesh(
        "",
        "./models/",
        "character_low.glb",
        scene
    );

    // Ajouter au LOD
    lod.addLODLevel(10, mediumDetail);
    lod.addLODLevel(30, lowDetail);
};
```

---

### Instancing

**Pour les objets répétitifs (arbres, rochers, etc.):**
```typescript
const createTreeInstances = (scene: Scene, count: number) => {
    const baseTree = SceneLoader.ImportMesh(
        "",
        "./models/",
        "tree.glb",
        scene
    );

    const trees: InstancedMesh[] = [];

    for (let i = 0; i < count; i++) {
        const instance = baseTree.createInstance(`tree_${i}`);

        // Position aléatoire
        instance.position = new Vector3(
            Math.random() * 1000 - 500,
            0,
            Math.random() * 1000 - 500
        );

        // Rotation aléatoire
        instance.rotation.y = Math.random() * Math.PI * 2;

        trees.push(instance);
    }

    return trees;
};
```

---

## 7. Système de Particules

### Effets de Skills

```typescript
const createFireballEffect = (scene: Scene, origin: Vector3, target: Vector3) => {
    // Créer le système de particules
    const particleSystem = new ParticleSystem("fireball", 2000, scene);

    // Texture
    particleSystem.particleTexture = new Texture("flare.png", scene);

    // Couleurs
    particleSystem.color1 = new Color4(1, 0.5, 0, 1);
    particleSystem.color2 = new Color4(1, 0.2, 0, 1);

    // Taille
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Durée de vie
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Émission
    particleSystem.emitRate = 1000;

    // Direction (vers la cible)
    const direction = target.subtract(origin).normalize();
    particleSystem.direction1 = direction;
    particleSystem.direction2 = direction;

    // Vitesse
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;

    // Gravité
    particleSystem.gravity = new Vector3(0, -9.81, 0);

    // Démarrer à l'origine
    particleSystem.emitter = origin;

    // Arrêter après 2 secondes
    particleSystem.targetStopDuration = 2;

    return particleSystem;
};
```

---

## 8. Différences Techniques: SRO vs SRObro

| Aspect | Silkroad Online (Original) | SRObro (Babylon.js) |
|--------|---------------------------|---------------------|
| **Platform** | Windows (Client lourd) | Navigateur Web |
| **Graphics** | Direct3D 8/9 | WebGL 2 |
| **Network** | TCP (Propriétaire) | WebSocket |
| **Assets** | media.pk2 (BSR, DDJ) | glTF/GLB |
| **Language** | C++ | TypeScript |
| **UI** | DirectX UI | HTML/CSS/React |
| **Update** | Téléchargement complet | Mise à jour à la volée |
| **Performance** | Natif (optimisé) | JavaScript (plus lent) |
| **Multiplayer** | ~1500 joueurs par shard | Limité par WebSocket |
| **Accessibilité** | Installation requise | Aucune installation |

---

## Références

- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Statut:** ✅ Documenté
