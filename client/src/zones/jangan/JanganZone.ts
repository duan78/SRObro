// ============================================
// SRObro - Jangan Zone
// Handles zone loading, monster spawning, and player spawning
// ============================================

import type { Scene } from '@babylonjs/core';
import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial, Texture } from '@babylonjs/core';
import type { Position } from '@srobro/shared';
import { JANGAN_CONFIG, getJanganSpawnPoint, isWithinZoneBoundaries } from './JanganConfig';
import { RealTerrain } from './RealTerrain';
import { WorldObjects } from './WorldObjects';
import { AnimationService } from '../../animation/BanAnimationService';
import type { AssetLoader } from '../../core/AssetLoader';
import { getMonsterAssetPath } from '../../config/AssetMapping';
import { MonsterHealthBarManager } from '../../ui/components/MonsterHealthBar';

export interface SpawnedMonster {
  id: string;
  monsterId: string;
  mesh: any;
  position: Position;
  level: number;
  hp: number;
  maxHp: number;
  respawnTime: number;
  isDead: boolean;
  deathTime?: number;
}

export class JanganZone {
  private scene: Scene;
  private assetLoader?: AssetLoader;
  private config = JANGAN_CONFIG;

  // Loaded state
  private isLoaded = false;
  private groundMesh: any = null;

  // Monster management
  private activeMonsters: Map<string, SpawnedMonster> = new Map();
  private monsterRespawnTimers: Map<string, NodeJS.Timeout> = new Map();

  // Health bars
  private healthBarManager: MonsterHealthBarManager;

  /** Vrai en mode réseau: les monstres sont pilotés par le serveur. */
  disableLocalMonsters = false;

  constructor(scene: Scene, assetLoader?: AssetLoader) {
    this.scene = scene;
    this.assetLoader = assetLoader;
    this.healthBarManager = new MonsterHealthBarManager(scene);
  }

  /**
   * Load the Jangan zone
   */
  async load(): Promise<void> {
    if (this.isLoaded) {
      console.warn('[JanganZone] Zone already loaded');
      return;
    }

    console.log('[JanganZone] Loading Jangan zone...');

    // En mode réseau, les monstres viennent du serveur (spawn packets):
    // ne pas peupler localement (sinon doublons visuels).
    if (this.disableLocalMonsters) {
      console.log('[JanganZone] Monstres locaux désactivés (mode réseau)');
    }

    try {
      // Stats officielles des monstres (avant tout spawn)
      await JanganZone.loadMonsterStats();

      // Load ground/heightmap
      await this.loadGround();

      // Bâtiments et décors officiels (placements Map.pk2), posés sur le relief
      try {
        const terrainRef = this.terrain;
        this.worldObjects = new WorldObjects(
          this.scene,
          this.assetLoader!,
          terrainRef ? (x, z) => terrainRef.heightAt(x, z) : undefined,
        );
        const n = await this.worldObjects.load(0, 500);
        console.log(`[JanganZone] ${n} objets du monde officiel placés`);
      } catch (e) {
        console.warn('[JanganZone] Objets du monde non chargés:', e);
      }

      // Set up environment
      this.setupEnvironment();

      // Spawn initial monsters (wrap in try-catch to continue even if monsters fail)
      try {
        this.spawnMonsters();
      } catch (monsterError) {
        console.warn('[JanganZone] Some monsters failed to spawn, continuing anyway:', monsterError);
      }

      this.isLoaded = true;
      console.log('[JanganZone] Jangan zone loaded successfully (may have limited content)');
    } catch (error) {
      console.error('[JanganZone] Failed to load zone:', error);
      // Don't throw - allow the game to continue even if zone has issues
      console.warn('[JanganZone] Continuing with limited functionality...');
      this.isLoaded = true;
    }
  }

  /**
   * Load the ground/heightmap
   */
  private terrain: RealTerrain | null = null;
  private worldObjects: WorldObjects | null = null;

  /** Terrain réel (heightmaps officiels) si chargé, pour placer les objets. */
  get realTerrain(): RealTerrain | null {
    return this.terrain;
  }

  private async loadGround(): Promise<void> {
    console.log('[JanganZone] Loading ground...');

    // Terrain réel depuis les heightmaps .nvm du client officiel
    this.terrain = new RealTerrain(this.scene);
    const loaded = await this.terrain.load();
    if (loaded) {
      this.groundMesh = this.terrain;
      console.log('[JanganZone] Terrain réel chargé');
      return;
    }

    // Repli: sol plat MVP
    const { Mesh } = await import('@babylonjs/core');

    this.groundMesh = Mesh.CreateGround('jangan_ground', 2000, 2000, 100, this.scene);
    this.groundMesh.checkCollisions = true;
    this.groundMesh.isPickable = true;

    // Apply a simple grass material
    const { StandardMaterial } = await import('@babylonjs/core');
    const groundMaterial = new StandardMaterial('jangan_ground_mat', this.scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.5, 0.1);
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    this.groundMesh.material = groundMaterial;

    console.log('[JanganZone] Ground loaded (fallback plat)');
  }

  /**
   * Set up environment (sky, fog, etc.)
   */
  private setupEnvironment(): void {
    // Skybox officiel (texture cloud de Map.pk2/skybox)
    try {
      const skybox = MeshBuilder.CreateBox('skyBox', { size: 9000 }, this.scene);
      const skyMat = new StandardMaterial('skyMat', this.scene);
      skyMat.backFaceCulling = false;
      skyMat.disableLighting = true;
      const skyTex = new Texture('/assets/textures/skybox/cloud1.png', this.scene);
      skyTex.uScale = 3;
      skyTex.vScale = 3;
      skyMat.diffuseTexture = null;
      skyMat.emissiveTexture = skyTex;
      skyMat.specularColor = new Color3(0, 0, 0);
      skybox.material = skyMat;
      skybox.infiniteDistance = true;
      skybox.isPickable = false;
      console.log('[JanganZone] Skybox officiel chargé');
    } catch (e) {
      console.warn('[JanganZone] Skybox non chargé:', e);
    }

    // Set scene clear color (sky) - use Color4 with alpha
    this.scene.clearColor = new Color4(0.53, 0.8, 0.92, 1.0);
    console.log('[JanganZone] Scene clear color set to:', this.scene.clearColor.toString());

    // Add fog for atmosphere
    this.scene.fogMode = 2; // Exponential fog
    this.scene.fogDensity = 0.0005;
    this.scene.fogColor = new Color3(0.53, 0.8, 0.92);

    console.log('[JanganZone] Environment setup complete');
  }

  /**
   * Spawn all monsters in the zone
   */
  private spawnMonsters(): void {
    // Mode réseau: le serveur est la source des monstres (NetworkCombat)
    if (this.disableLocalMonsters) return;
    console.log('[JanganZone] Spawning monsters...');

    this.config.monsterSpawns.forEach((spawnConfig, index) => {
      for (let i = 0; i < spawnConfig.maxCount; i++) {
        // Slightly offset position for each monster
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetZ = (Math.random() - 0.5) * 50;

        const position: Position = {
          x: spawnConfig.position.x + offsetX,
          y: 0,
          z: spawnConfig.position.z + offsetZ,
        };

        this.spawnMonster(spawnConfig.monsterId, position, spawnConfig.rotation, index);
      }
    });

    console.log(`[JanganZone] Spawned ${this.activeMonsters.size} monsters`);
  }

  /**
   * Spawn a single monster
   */
  private async spawnMonster(
    monsterId: string,
    position: Position,
    rotation: number,
    spawnIndex: number
  ): Promise<void> {
    const uniqueId = `monster_${spawnIndex}_${Date.now()}_${Math.random()}`;

    // Tente le vrai modèle officiel (mob_<stem BSR> => GLB skiné via manifest)
    const bsrStem = monsterId.replace(/^mob_/, '');
    const monsterData = this.getMonsterData(monsterId);
    const groundY = this.terrain ? this.terrain.heightAt(position.x, position.z) : 0;
    try {
      const loaded = await this.assetLoader?.loadGameObject(bsrStem);
      if (loaded && loaded.root) {
        loaded.root.position.set(position.x, groundY, position.z);
        loaded.root.rotation.y = rotation;

        // Animations officielles .ban sur chaque squelette des parties
        const animRoots = (loaded as { skeletons?: import('@babylonjs/core').Skeleton[] }).skeletons;
        if (animRoots && animRoots.length > 0) {
          AnimationService.loadAndPlay(this.scene, animRoots, AnimationService.monsterClip(bsrStem, 'walk'), true, 1.0)
            .catch(() => undefined);
        }
        this.activeMonsters.set(uniqueId, {
          id: uniqueId,
          monsterId,
          mesh: loaded.root,
          position,
          level: monsterData?.level || 1,
          hp: monsterData?.hp || 50,
          maxHp: monsterData?.hp || 50,
          respawnTime: 30,
          isDead: false,
        });
        return;
      }
    } catch (e) {
      console.warn(`[JanganZone] Modèle réel indisponible pour ${monsterId} (${bsrStem}), repli placeholder:`, e);
    }

    // Repli: placeholder procédural (posé sur le relief réel, pas à y=0)
    this.createPlaceholderMonster(uniqueId, monsterId, { ...position, y: groundY }, rotation);
  }

  /**
   * Create detailed 3D monster placeholder
   */
  private createPlaceholderMonster(
    uniqueId: string,
    monsterId: string,
    position: Position,
    rotation: number
  ): void {
    const monsterData = this.getMonsterData(monsterId);
    const level = monsterData?.level || 1;

    // Create different monster types based on ID
    let mesh: any;

    if (monsterId.includes('maiden') || monsterId.includes('mangnyang')) {
      // Wild dog - quadruped
      mesh = this.createQuadrupedMonster(uniqueId, position, rotation, {
        bodySize: { width: 1.5, height: 0.8, depth: 2.5 },
        legSize: { width: 0.3, height: 0.6, depth: 0.3 },
        headSize: { width: 0.5, height: 0.5, depth: 0.7 },
        colors: { body: new Color3(0.6, 0.4, 0.2), head: new Color3(0.5, 0.3, 0.15) }
      });
    } else if (monsterId.includes('yeoha') || monsterId.includes('spider')) {
      // Fox/Spider - smaller, orange
      mesh = this.createQuadrupedMonster(uniqueId, position, rotation, {
        bodySize: { width: 1, height: 0.6, depth: 1.8 },
        legSize: { width: 0.2, height: 0.5, depth: 0.2 },
        headSize: { width: 0.4, height: 0.4, depth: 0.6 },
        colors: { body: new Color3(1, 0.7, 0.3), head: new Color3(1, 0.6, 0.2) }
      });
    } else if (monsterId.includes('tiger')) {
      // Tiger - large, striped
      mesh = this.createQuadrupedMonster(uniqueId, position, rotation, {
        bodySize: { width: 2.5, height: 1.2, depth: 4 },
        legSize: { width: 0.5, height: 1, depth: 0.5 },
        headSize: { width: 0.8, height: 0.7, depth: 1 },
        colors: { body: new Color3(1, 0.6, 0.2), head: new Color3(0.9, 0.5, 0.15) }
      });
    } else if (monsterId.includes('bandit')) {
      // Bandit - humanoid with weapon
      mesh = this.createHumanoidMonster(uniqueId, position, rotation, {
        bodySize: { width: 0.6, height: 1.8, depth: 0.4 },
        colors: { skin: new Color3(0.85, 0.7, 0.6), clothes: new Color3(0.3, 0.25, 0.2) }
      });
    } else if (monsterId.includes('ghost')) {
      // Ghost - floating ethereal
      mesh = this.createGhostMonster(uniqueId, position, rotation, {
        size: 1.8,
        color: new Color3(0.6, 0.7, 0.9)
      });
    } else {
      // Default - simple cube with better material
      const size = 1.5 + (level * 0.1);
      const box = MeshBuilder.CreateBox(`${uniqueId}_body`, { size }, this.scene);
      box.position = new Vector3(position.x, position.y + size / 2, position.z);
      box.rotation.y = rotation;

      const mat = new StandardMaterial(`${uniqueId}_mat`, this.scene);
      mat.diffuseColor = new Color3(0.8, 0.2, 0.2);
      mat.emissiveColor = new Color3(0.2, 0.05, 0.05);
      box.material = mat;

      mesh = box;
    }

    // Enable collisions
    mesh.checkCollisions = true;
    mesh.isPickable = true;
    mesh.receiveShadows = true;

    const spawnedMonster: SpawnedMonster = {
      id: uniqueId,
      monsterId,
      mesh,
      position,
      level: monsterData?.level || 1,
      hp: monsterData?.hp || 100,
      maxHp: monsterData?.hp || 100,
      respawnTime: this.getRespawnTimeForMonster(monsterId),
      isDead: false,
    };

    this.activeMonsters.set(uniqueId, spawnedMonster);
    this.healthBarManager.createHealthBar(uniqueId, mesh, spawnedMonster.maxHp);

    console.log(`[JanganZone] ✓ Created 3D monster: ${monsterId} Lv${level}`);
  }

  /**
   * Create quadruped monster (4-legged)
   */
  private createQuadrupedMonster(
    uniqueId: string,
    position: Position,
    rotation: number,
    config: {
      bodySize: { width: number; height: number; depth: number };
      legSize: { width: number; height: number; depth: number };
      headSize: { width: number; height: number; depth: number };
      colors: { body: Color3; head: Color3 };
    }
  ): any {
    // Body
    const body = MeshBuilder.CreateBox(`${uniqueId}_body`, config.bodySize, this.scene);
    body.position.y = config.legSize.height;

    // Head
    const head = MeshBuilder.CreateBox(`${uniqueId}_head`, config.headSize, this.scene);
    head.position.y = config.bodySize.height / 2 + config.legSize.height + config.headSize.height / 3;
    head.position.z = config.bodySize.depth / 2 + config.headSize.depth / 3;
    head.parent = body;

    // Legs
    const legPositions = [
      { x: -config.bodySize.width / 3, z: config.bodySize.depth / 3 },
      { x: config.bodySize.width / 3, z: config.bodySize.depth / 3 },
      { x: -config.bodySize.width / 3, z: -config.bodySize.depth / 3 },
      { x: config.bodySize.width / 3, z: -config.bodySize.depth / 3 },
    ];

    legPositions.forEach((pos, i) => {
      const leg = MeshBuilder.CreateBox(`${uniqueId}_leg_${i}`, config.legSize, this.scene);
      leg.position.x = pos.x;
      leg.position.z = pos.z;
      leg.position.y = config.legSize.height / 2;
      leg.parent = body;
    });

    // Materials
    const bodyMat = new StandardMaterial(`${uniqueId}_body_mat`, this.scene);
    bodyMat.diffuseColor = config.colors.body;
    bodyMat.specularColor = new Color3(0.3, 0.3, 0.3);

    const headMat = new StandardMaterial(`${uniqueId}_head_mat`, this.scene);
    headMat.diffuseColor = config.colors.head;
    headMat.specularColor = new Color3(0.4, 0.4, 0.4);

    body.material = bodyMat;
    head.material = headMat;

    // Position entire monster
    body.position = new Vector3(position.x, position.y, position.z);
    body.rotation.y = rotation;

    return body;
  }

  /**
   * Create humanoid monster (bandit)
   */
  private createHumanoidMonster(
    uniqueId: string,
    position: Position,
    rotation: number,
    config: {
      bodySize: { width: number; height: number; depth: number };
      colors: { skin: Color3; clothes: Color3 };
    }
  ): any {
    // Body (torso + head)
    const body = MeshBuilder.CreateBox(`${uniqueId}_body`, {
      width: config.bodySize.width,
      height: config.bodySize.height * 0.6,
      depth: config.bodySize.depth
    }, this.scene);
    body.position.y = config.bodySize.height * 0.35;

    const head = MeshBuilder.CreateBox(`${uniqueId}_head`, {
      width: config.bodySize.width * 0.5,
      height: config.bodySize.height * 0.25,
      depth: config.bodySize.depth * 0.6
    }, this.scene);
    head.position.y = config.bodySize.height * 0.75;
    head.parent = body;

    // Arms
    const armWidth = config.bodySize.width * 0.25;
    const armHeight = config.bodySize.height * 0.5;

    const leftArm = MeshBuilder.CreateBox(`${uniqueId}_left_arm`, {
      width: armWidth,
      height: armHeight,
      depth: armWidth
    }, this.scene);
    leftArm.position.x = -(config.bodySize.width / 2 + armWidth / 2);
    leftArm.position.y = config.bodySize.height * 0.4;
    leftArm.parent = body;

    const rightArm = MeshBuilder.CreateBox(`${uniqueId}_right_arm`, {
      width: armWidth,
      height: armHeight,
      depth: armWidth
    }, this.scene);
    rightArm.position.x = config.bodySize.width / 2 + armWidth / 2;
    rightArm.position.y = config.bodySize.height * 0.4;
    rightArm.parent = body;

    // Legs
    const legWidth = config.bodySize.width * 0.25;
    const legHeight = config.bodySize.height * 0.4;

    const leftLeg = MeshBuilder.CreateBox(`${uniqueId}_left_leg`, {
      width: legWidth,
      height: legHeight,
      depth: legWidth
    }, this.scene);
    leftLeg.position.x = -config.bodySize.width * 0.2;
    leftLeg.position.y = -legHeight / 2;
    leftLeg.parent = body;

    const rightLeg = MeshBuilder.CreateBox(`${uniqueId}_right_leg`, {
      width: legWidth,
      height: legHeight,
      depth: legWidth
    }, this.scene);
    rightLeg.position.x = config.bodySize.width * 0.2;
    rightLeg.position.y = -legHeight / 2;
    rightLeg.parent = body;

    // Materials
    const skinMat = new StandardMaterial(`${uniqueId}_skin_mat`, this.scene);
    skinMat.diffuseColor = config.colors.skin;

    const clothesMat = new StandardMaterial(`${uniqueId}_clothes_mat`, this.scene);
    clothesMat.diffuseColor = config.colors.clothes;

    head.material = skinMat;
    leftArm.material = clothesMat;
    rightArm.material = clothesMat;
    leftLeg.material = clothesMat;
    rightLeg.material = clothesMat;
    body.material = clothesMat;

    // Position
    body.position = new Vector3(position.x, position.y, position.z);
    body.rotation.y = rotation;

    return body;
  }

  /**
   * Create ghost monster (transparent, floating)
   */
  private createGhostMonster(
    uniqueId: string,
    position: Position,
    rotation: number,
    config: { size: number; color: Color3 }
  ): any {
    const body = MeshBuilder.CreateBox(`${uniqueId}_body`, {
      width: config.size * 0.7,
      height: config.size,
      depth: config.size * 0.5
    }, this.scene);
    body.position.y = config.size / 2;
    body.position.x = position.x;
    body.position.z = position.z;
    body.rotation.y = rotation;

    const head = MeshBuilder.CreateBox(`${uniqueId}_head`, {
      width: config.size * 0.4,
      height: config.size * 0.4,
      depth: config.size * 0.4
    }, this.scene);
    head.position.y = config.size * 0.75;
    head.parent = body;

    // Ghostly transparent material
    const ghostMat = new StandardMaterial(`${uniqueId}_ghost_mat`, this.scene);
    ghostMat.diffuseColor = config.color;
    ghostMat.alpha = 0.6;
    ghostMat.emissiveColor = new Color3(0.1, 0.1, 0.2);
    ghostMat.specularColor = new Color3(0.5, 0.5, 0.5);

    body.material = ghostMat;
    head.material = ghostMat;

    return body;
  }

  /**
   * Get monster data from monster ID
   * Utilise les stats officielles exportées du client (monster-stats.json).
   */
  private getMonsterData(monsterId: string): any {
    const stats = JanganZone.monsterStats.get(monsterId);
    if (stats) return stats;

    // Repli heuristique si les stats n'ont pas encore été chargées
    return {
      level: 1,
      hp: 50,
      attackPower: { min: 5, max: 8 },
      defense: 10,
      exp: 50,
    };
  }

  /** Stats officielles chargées depuis /assets/data/monster-stats.json */
  private static monsterStats: Map<string, any> = new Map();

  static async loadMonsterStats(): Promise<void> {
    if (JanganZone.monsterStats.size > 0) return;
    try {
      const res = await fetch('/assets/data/monster-stats.json');
      if (!res.ok) return;
      const data = await res.json();
      for (const [id, stats] of Object.entries(data)) {
        JanganZone.monsterStats.set(id, stats);
      }
      console.log(`[JanganZone] ${JanganZone.monsterStats.size} monstres officiels chargés`);
    } catch (e) {
      console.warn('[JanganZone] monster-stats.json indisponible:', e);
    }
  }

  /**
   * Get respawn time for monster
   */
  private getRespawnTimeForMonster(monsterId: string): number {
    const spawnConfig = this.config.monsterSpawns.find(s => s.monsterId === monsterId);
    return spawnConfig?.respawnTime || 60;
  }

  /**
   * Kill a monster
   */
  killMonster(monsterUniqueId: string): void {
    const monster = this.activeMonsters.get(monsterUniqueId);

    if (!monster || monster.isDead) {
      return;
    }

    console.log(`[JanganZone] Killing monster: ${monster.monsterId}`);

    monster.isDead = true;
    monster.deathTime = Date.now();

    // Hide health bar when dead
    this.healthBarManager.hideHealthBar(monsterUniqueId);

    // Play death animation (if available)
    // For MVP, just hide the mesh
    if (monster.mesh) {
      monster.mesh.setEnabled(false);
    }

    // Set up respawn timer
    const respawnTimer = setTimeout(() => {
      this.monsterRespawnTimers.delete(monsterUniqueId);
      this.respawnMonster(monsterUniqueId);
    }, monster.respawnTime * 1000);

    this.monsterRespawnTimers.set(monsterUniqueId, respawnTimer);
  }

  /**
   * Respawn a monster
   */
  private respawnMonster(monsterUniqueId: string): void {
    const monster = this.activeMonsters.get(monsterUniqueId);

    if (!monster) {
      return;
    }

    console.log(`[JanganZone] Respawning monster: ${monster.monsterId}`);

    monster.isDead = false;
    monster.hp = monster.maxHp;
    monster.deathTime = undefined;

    // Show the mesh again
    if (monster.mesh) {
      monster.mesh.setEnabled(true);
    }
  }

  /**
   * Get monster by unique ID
   */
  getMonster(monsterUniqueId: string): SpawnedMonster | undefined {
    return this.activeMonsters.get(monsterUniqueId);
  }

  /**
   * Get all active monsters
   */
  getAllMonsters(): SpawnedMonster[] {
    return Array.from(this.activeMonsters.values()).filter(m => !m.isDead);
  }

  /**
   * Get monsters near a position
   */
  getMonstersNearPosition(position: Position, radius: number): SpawnedMonster[] {
    return this.getAllMonsters().filter(monster => {
      const dx = monster.position.x - position.x;
      const dz = monster.position.z - position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance <= radius;
    });
  }

  /**
   * Get player spawn point
   */
  getPlayerSpawnPoint(): Position {
    return getJanganSpawnPoint();
  }

  /**
   * Point d'apparition dégagé: cherche autour du spawn configuré une position
   * sans bâtiment officiel à moins de `clearRadius` mètres (spirale de recherche).
   */
  getSafeSpawnPoint(clearRadius = 25): Position {
    const base = getJanganSpawnPoint();
    const placements = this.worldObjects?.allPlacements ?? [];
    // Éviter les coutures entre régions (1920 m): le rayon caméra y démarre
    // à l'intérieur des maillages de bord.
    const nearSeam = (x: number, z: number): boolean => {
      const dx = Math.abs(((x % 1920) + 1920) % 1920);
      const dz = Math.abs(((z % 1920) + 1920) % 1920);
      return dx < 10 || dx > 1910 || dz < 10 || dz > 1910;
    };
    const isClear = (x: number, z: number): boolean => {
      if (nearSeam(x, z)) return false;
      for (const p of placements) {
        if (Math.hypot(p.x - x, p.z - z) < clearRadius) return false;
      }
      return true;
    };
    if (isClear(base.x, base.z)) return base;
    // Spirale de recherche par pas de 8 m jusqu'à 400 m
    for (let r = 8; r <= 400; r += 8) {
      const steps = Math.max(8, Math.round((2 * Math.PI * r) / 12));
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const x = base.x + Math.cos(a) * r;
        const z = base.z + Math.sin(a) * r;
        if (isClear(x, z)) {
          console.log(`[JanganZone] Spawn sûr trouvé à (${x.toFixed(0)}, ${z.toFixed(0)})`);
          return { x, y: base.y, z };
        }
      }
    }
    return base;
  }

  /**
   * Check if position is within zone boundaries
   */
  isPositionInBounds(position: Position): boolean {
    return isWithinZoneBoundaries(position);
  }

  /**
   * Update zone (called every frame)
   */
  update(): void {
    // Update health bars
    this.healthBarManager.update();
  }

  /**
   * Clean up zone resources
   */
  dispose(): void {
    console.log('[JanganZone] Disposing zone...');

    // Clear respawn timers
    this.monsterRespawnTimers.forEach(timer => clearTimeout(timer));
    this.monsterRespawnTimers.clear();

    // Dispose health bars
    this.healthBarManager.dispose();

    // Dispose all monster meshes
    this.activeMonsters.forEach(monster => {
      if (monster.mesh) {
        monster.mesh.dispose();
      }
    });
    this.activeMonsters.clear();

    // Dispose ground
    if (this.groundMesh) {
      this.groundMesh.dispose();
      this.groundMesh = null;
    }

    this.isLoaded = false;
    console.log('[JanganZone] Zone disposed');
  }

  /**
   * Get health bar manager (for external access)
   */
  getHealthBarManager(): MonsterHealthBarManager {
    return this.healthBarManager;
  }
}
