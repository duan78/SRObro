// ============================================
// SRObro - Jangan Zone
// Handles zone loading, monster spawning, and player spawning
// ============================================

import type { Scene } from '@babylonjs/core';
import { Vector3, Color3, Color4, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import type { Position } from '@srobro/shared';
import { JANGAN_CONFIG, getJanganSpawnPoint, isWithinZoneBoundaries } from './JanganConfig';
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
  // private assetLoader: AssetLoader; // Unused - remove for MVP
  private config = JANGAN_CONFIG;

  // Loaded state
  private isLoaded = false;
  private groundMesh: any = null;

  // Monster management
  private activeMonsters: Map<string, SpawnedMonster> = new Map();
  private monsterRespawnTimers: Map<string, NodeJS.Timeout> = new Map();

  // Health bars
  private healthBarManager: MonsterHealthBarManager;

  constructor(scene: Scene, assetLoader?: AssetLoader) {
    this.scene = scene;
    // this.assetLoader = assetLoader; // Unused for now
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

    try {
      // Load ground/heightmap
      await this.loadGround();

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
  private async loadGround(): Promise<void> {
    console.log('[JanganZone] Loading ground...');

    // Create a simple ground for MVP
    // In production, this would load the actual heightmap
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

    console.log('[JanganZone] Ground loaded');
  }

  /**
   * Set up environment (sky, fog, etc.)
   */
  private setupEnvironment(): void {
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

    // MVP: Use simple placeholders instead of GLB files (which have header errors)
    await this.createPlaceholderMonster(uniqueId, monsterId, position, rotation);
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
      box.material = box;

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
   */
  private getMonsterData(monsterId: string): any {
    // This would import from shared data
    // For MVP, return basic data
    const levelMatch = monsterId.match(/lv(\d+)/);
    const level = levelMatch ? parseInt(levelMatch[1]) : 1;

    return {
      level,
      hp: level * 100,
      attackPower: { min: level * 5, max: level * 8 },
      defense: level * 2,
      exp: level * 50,
    };
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
