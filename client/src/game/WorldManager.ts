/**
 * SRObro - World Manager
 * Manages zones, loading, and world navigation
 */

// @ts-nocheck
import type { Scene } from '@babylonjs/core';
import { Vector3, Color3, StandardMaterial, MeshBuilder } from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';
import { EntityManager } from './EntityManager';

export interface ZoneData {
  id: string;
  name: string;
  levelRange: { min: number; max: number };
  size: { width: number; height: number };
}

export class WorldManager {
  private scene: Scene;
  private network: NetworkManager;
  private entityManager: EntityManager;

  private currentZone: string | null = null;
  private zones: Map<string, ZoneData> = new Map();

  // Ground
  private ground: any = null;

  constructor(scene: Scene, network: NetworkManager, entityManager: EntityManager) {
    this.scene = scene;
    this.network = network;
    this.entityManager = entityManager;

    this.initializeZones();
  }

  /**
   * Initialize zone definitions
   */
  private initializeZones(): void {
    // Jangan
    this.zones.set('zone_jangan', {
      id: 'zone_jangan',
      name: 'Jangan',
      levelRange: { min: 1, max: 20 },
      size: { width: 2000, height: 2000 },
    });

    // Donwhang
    this.zones.set('zone_donwhang', {
      id: 'zone_donwhang',
      name: 'Donwhang',
      levelRange: { min: 20, max: 40 },
      size: { width: 2000, height: 2000 },
    });

    // Hotan
    this.zones.set('zone_hotan', {
      id: 'zone_hotan',
      name: 'Hotan',
      levelRange: { min: 40, max: 60 },
      size: { width: 2000, height: 2000 },
    });

    // Constantinople
    this.zones.set('zone_constantinople', {
      id: 'zone_constantinople',
      name: 'Constantinople',
      levelRange: { min: 1, max: 20 },
      size: { width: 2000, height: 2000 },
    });

    // Thief Village
    this.zones.set('zone_thief_village', {
      id: 'zone_thief_village',
      name: 'Thief Village',
      levelRange: { min: 30, max: 50 },
      size: { width: 1500, height: 1500 },
    });
  }

  /**
   * Load a zone
   */
  async loadZone(zoneId: string): Promise<void> {
    try {
      const zoneData = this.zones.get(zoneId);
      if (!zoneData) {
        console.error(`Zone not found: ${zoneId}`);
        return;
      }

      console.log(`Loading zone: ${zoneData.name}`);

      // Unload current zone if any
      if (this.currentZone) {
        await this.unloadZone();
      }

      // Create ground
      console.log('Creating ground...');
      this.createGround(zoneData);

      // Skybox disabled temporarily
      // console.log('Creating skybox...');
      // this.createSkybox();

      // Create environment props
      console.log('Creating environment...');
      this.createEnvironment(zoneData);

      // Request entities from server
      this.network.send({
        type: 'interact',
        timestamp: Date.now(),
        data: { action: 'enter_zone', zoneId },
      });

      // TODO: Load zone assets (buildings, props, etc.)

      this.currentZone = zoneId;
      console.log(`Zone loaded: ${zoneData.name}`);
    } catch (error) {
      console.error('Error loading zone:', error);
      throw error;
    }
  }

  /**
   * Create environment props (trees, buildings, etc.)
   */
  private createEnvironment(zoneData: ZoneData): void {
    try {
      console.log('Creating trees...');
      // Create trees using thin instances for performance
      this.createTrees(zoneData);

      console.log('Creating buildings...');
      // Create buildings/structures
      this.createBuildings(zoneData);

      console.log('Creating details...');
      // Create rocks and details
      this.createDetails(zoneData);

      console.log('Environment created successfully');
    } catch (error) {
      console.error('Error creating environment:', error);
      throw error;
    }
  }

  /**
   * Create trees using simple mesh instances
   */
  private createTrees(zoneData: ZoneData): void {
    try {
      console.log('Creating trees...');
      const treeCount = 50; // Reduced count for performance

      for (let i = 0; i < treeCount; i++) {
        const x = (Math.random() - 0.5) * zoneData.size.width * 0.8;
        const z = (Math.random() - 0.5) * zoneData.size.height * 0.8;

        // Avoid spawn area
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter < 50) continue;

        // Create simple tree
        this.createSimpleTree(x, z);
      }

      console.log('Trees created successfully');
    } catch (error) {
      console.error('Error creating trees:', error);
      throw error;
    }
  }

  /**
   * Create a simple tree at position
   */
  private createSimpleTree(x: number, z: number): void {
    // Trunk
    const trunk = MeshBuilder.CreateCylinder('trunk', {
      height: 4,
      diameter: 0.6,
      tessellation: 6
    }, this.scene);

    const trunkMat = new StandardMaterial('trunkMat', this.scene);
    trunkMat.diffuseColor = new Color3(0.4, 0.3, 0.2); // Brown
    trunkMat.specularColor = new Color3(0.1, 0.1, 0.1);
    trunk.material = trunkMat;
    trunk.position = new Vector3(x, 2, z);

    // Foliage
    const foliage = MeshBuilder.CreateSphere('foliage', {
      diameter: 4,
      segments: 8
    }, this.scene);

    const foliageMat = new StandardMaterial('foliageMat', this.scene);
    foliageMat.diffuseColor = new Color3(0.2, 0.5, 0.15); // Dark green
    foliageMat.specularColor = new Color3(0.05, 0.05, 0.05);
    foliage.material = foliageMat;
    foliage.position = new Vector3(x, 5, z);
  }

  /**
   * Create a single tree mesh
   */
  private createTreeMesh(): Mesh {
    // Trunk
    const trunk = MeshBuilder.CreateCylinder('trunk', {
      height: 4,
      diameter: 0.6,
      tessellation: 6
    }, this.scene);

    const trunkMat = new StandardMaterial('trunkMat', this.scene);
    trunkMat.diffuseColor = new Color3(0.4, 0.3, 0.2); // Brown
    trunkMat.specularColor = new Color3(0.1, 0.1, 0.1);
    trunk.material = trunkMat;

    // Foliage
    const foliage = MeshBuilder.CreateSphere('foliage', {
      diameter: 4,
      segments: 8
    }, this.scene);

    const foliageMat = new StandardMaterial('foliageMat', this.scene);
    foliageMat.diffuseColor = new Color3(0.2, 0.5, 0.15); // Dark green
    foliageMat.specularColor = new Color3(0.05, 0.05, 0.05);
    foliage.material = foliageMat;

    foliage.position.y = 3;

    // Merge meshes for better performance
    const tree = Mesh.MergeMeshes([trunk, foliage], true, true);

    if (!tree) {
      throw new Error('Failed to merge tree meshes');
    }

    tree.name = 'tree';
    return tree;
  }

  /**
   * Create buildings/structures
   */
  private createBuildings(zoneData: ZoneData): void {
    // Create some building placeholders
    const buildingCount = 10;

    for (let i = 0; i < buildingCount; i++) {
      const width = 10 + Math.random() * 15;
      const height = 8 + Math.random() * 10;
      const depth = 10 + Math.random() * 15;

      const x = (Math.random() - 0.5) * zoneData.size.width * 0.6;
      const z = (Math.random() - 0.5) * zoneData.size.height * 0.6;

      // Avoid spawn area
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 30) continue;

      const building = MeshBuilder.CreateBox('building', {
        width,
        height,
        depth
      }, this.scene);

      const buildingMat = new StandardMaterial('buildingMat', this.scene);
      buildingMat.diffuseColor = new Color3(0.6, 0.5, 0.4); // Adobe/stucco color
      buildingMat.specularColor = new Color3(0.1, 0.1, 0.1);
      building.material = buildingMat;

      building.position = new Vector3(x, height / 2, z);
      building.checkCollisions = true;
    }
  }

  /**
   * Create environmental details (rocks, etc.)
   */
  private createDetails(zoneData: ZoneData): void {
    // Add some rocks
    const rockCount = 30;

    for (let i = 0; i < rockCount; i++) {
      const diameter = 1 + Math.random() * 2;
      const rock = MeshBuilder.CreateSphere('rock', {
        diameter,
        segments: 4
      }, this.scene);

      const rockMat = new StandardMaterial('rockMat', this.scene);
      rockMat.diffuseColor = new Color3(0.4, 0.38, 0.35); // Gray
      rockMat.specularColor = new Color3(0.1, 0.1, 0.1);
      rock.material = rockMat;

      const x = (Math.random() - 0.5) * zoneData.size.width * 0.9;
      const z = (Math.random() - 0.5) * zoneData.size.height * 0.9;

      rock.position = new Vector3(x, diameter / 2, z);
    }
  }

  /**
   * Create ground mesh
   */
  private createGround(zoneData: ZoneData): void {
    // Create ground with subdivisions for better texture
    this.ground = MeshBuilder.CreateGround(
      'ground',
      { width: zoneData.size.width, height: zoneData.size.height, subdivisions: 100 },
      this.scene
    );

    // Create improved ground material with texture pattern
    const groundMaterial = new StandardMaterial('groundMaterial', this.scene);

    // Base grass color
    groundMaterial.diffuseColor = new Color3(0.35, 0.55, 0.25); // Natural grass green
    groundMaterial.specularColor = new Color3(0.05, 0.05, 0.05);

    // Add wireframe for texture pattern (simulating grass blades)
    groundMaterial.wireframe = false;

    this.ground.material = groundMaterial;
    this.ground.checkCollisions = true;
    this.ground.isPickable = true;
    this.ground.receiveShadows = true; // Ground receives shadows

    // Create grass texture pattern procedurally
    try {
      this.createGrassTexture();
    } catch (error) {
      console.warn('Failed to create grass texture:', error);
    }
  }

  /**
   * Create procedural grass texture
   */
  private createGrassTexture(): void {
    // Create a dynamic texture for grass pattern
    const grassSize = 512;
    const grassTexture = new DynamicTexture('grassTexture', grassSize, this.scene, true);

    const ctx = grassTexture.getContext();

    // Base grass color
    ctx.fillStyle = '#3a7a28';
    ctx.fillRect(0, 0, grassSize, grassSize);

    // Add grass blade variations
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * grassSize;
      const y = Math.random() * grassSize;
      const length = 5 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Grass blade
      ctx.fillStyle = Math.random() > 0.5 ? '#4a8a38' : '#2a6a18';
      ctx.fillRect(0, 0, 2, length);

      ctx.restore();
    }

    grassTexture.update();
    this.ground.material.diffuseTexture = grassTexture;
    grassTexture.vScale = grassSize / 10; // Repeat texture
  }

  /**
   * Create skybox with gradient sky
   */
  private createSkybox(): void {
    try {
      console.log('Creating skybox mesh...');
      // Create skybox
      const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, this.scene);

      console.log('Creating sky material...');
      const skyMaterial = new StandardMaterial('skyMaterial', this.scene);
      skyMaterial.backFaceCulling = false;

      // Sky blue color
      skyMaterial.diffuseColor = new Color3(0.5, 0.7, 1.0);
      skyMaterial.specularColor = new Color3(0, 0, 0);

      console.log('Applying material to skybox...');
      skybox.material = skyMaterial;
      skybox.infiniteDistance = true;

      console.log('Skybox created successfully');
    } catch (error) {
      console.error('Error creating skybox:', error);
      throw error;
    }
  }

  /**
   * Unload current zone
   */
  async unloadZone(): Promise<void> {
    // Clear all entities
    this.entityManager.clearAll();

    // Dispose ground
    if (this.ground) {
      this.ground.dispose();
      this.ground = null;
    }

    // Dispose skybox
    const skybox = this.scene.getMeshByName('skyBox');
    if (skybox) {
      skybox.dispose();
    }

    this.currentZone = null;
  }

  /**
   * Get current zone ID
   */
  getCurrentZone(): string | null {
    return this.currentZone;
  }

  /**
   * Get zone data
   */
  getZoneData(zoneId: string): ZoneData | undefined {
    return this.zones.get(zoneId);
  }

  /**
   * Update world manager
   */
  update(deltaTime: number): void {
    // Placeholder for world updates
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.unloadZone();
    this.zones.clear();
  }
}
