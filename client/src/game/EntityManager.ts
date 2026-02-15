/**
 * SRObro - Entity Manager
 * Manages all entities (players, NPCs, monsters) in the game world
 * Uses AssetLoader to load real entity models
 */

// @ts-nocheck
import type { Scene } from '@babylonjs/core';
import { Vector3, TransformNode, MeshBuilder, StandardMaterial, Color3, AbstractMesh } from '@babylonjs/core';
import type { Entity, EntityType } from '@srobro/shared';
import { AssetLoader } from '../core/AssetLoader';

export interface EntityData extends Entity {
  mesh?: AbstractMesh;
  container?: TransformNode;
}

export class EntityManager {
  private scene: Scene;
  private assetLoader: AssetLoader;
  private entities: Map<string, EntityData> = new Map();
  private entityMeshes: Map<string, AbstractMesh> = new Map();

  // Interpolation for smooth movement
  private interpolationFactor = 0.1;

  constructor(scene: Scene, assetLoader: AssetLoader) {
    this.scene = scene;
    this.assetLoader = assetLoader;
  }

  /**
   * Spawn an entity
   */
  async spawnEntity(data: Entity): Promise<void> {
    // Check if entity already exists
    if (this.entities.has(data.id)) {
      console.warn(`Entity already exists: ${data.id}`);
      return;
    }

    // Create container
    const container = new TransformNode(data.id, this.scene);
    container.position = new Vector3(data.position.x, data.position.y, data.position.z);
    container.rotation.y = data.rotation;

    // Create mesh based on entity type
    const mesh = await this.createEntityMesh(data);

    if (mesh) {
      mesh.parent = container;
      this.entityMeshes.set(data.id, mesh);
    }

    // Store entity
    const entityData: EntityData = {
      ...data,
      mesh,
      container,
    };

    this.entities.set(data.id, entityData);

    console.log(`Spawned entity: ${data.name} (${data.type})`);
  }

  /**
   * Create entity mesh based on type
   */
  private async createEntityMesh(data: Entity): Promise<AbstractMesh | null> {
    try {
      // Try to load real model from AssetLoader based on entity type
      let modelId: string | undefined;

      switch (data.type) {
        case 'monster':
          // Use monster ID from data (e.g., 'mangyang_01')
          modelId = data.modelId || `monster_${data.id}`;
          break;
        case 'npc':
          // Use NPC model ID
          modelId = data.modelId || `npc_${data.id}`;
          break;
        case 'player':
          // Use character model ID
          modelId = data.modelId || 'CH_M_01';
          break;
        case 'transport':
          // Use transport model ID
          modelId = data.modelId || `transport_${data.id}`;
          break;
      }

      if (modelId) {
        // Load real model
        const entity = await this.assetLoader.loadGameObject(modelId);
        if (entity) {
            const mainMesh = entity.root;
            this.createNameTag(data, mainMesh);
            return mainMesh;
        }
      }

    } catch (error) {
      console.warn(`Failed to load model for ${data.name}, using placeholder:`, error);
    }

    // Fallback to placeholder mesh
    return this.createPlaceholderMesh(data);
  }

  /**
   * Create placeholder mesh (fallback)
   */
  private createPlaceholderMesh(data: Entity): AbstractMesh {
    let color: Color3;
    let size: Vector3;

    switch (data.type) {
      case 'player':
        color = new Color3(0, 0.5, 1); // Blue
        size = new Vector3(1, 2, 1);
        break;
      case 'npc':
        color = new Color3(0, 1, 0); // Green
        size = new Vector3(1, 2, 1);
        break;
      case 'monster':
        color = new Color3(1, 0, 0); // Red
        size = new Vector3(1.5, 1.5, 1.5);
        break;
      case 'transport':
        color = new Color3(1, 0.5, 0); // Orange
        size = new Vector3(3, 3, 4);
        break;
      default:
        color = new Color3(0.5, 0.5, 0.5); // Gray
        size = new Vector3(1, 1, 1);
    }

    // Create box mesh
    const mesh = MeshBuilder.CreateBox(
      `mesh_${data.id}`,
      { width: size.x, height: size.y, depth: size.z },
      this.scene
    );

    // Create material
    const material = new StandardMaterial(`material_${data.id}`, this.scene);
    material.diffuseColor = color;
    material.specularColor = new Color3(0.1, 0.1, 0.1);

    mesh.material = material;
    mesh.checkCollisions = true;
    mesh.isPickable = true;

    // Add name tag
    this.createNameTag(data, mesh);

    return mesh;
  }

  /**
   * Create name tag above entity
   */
  private createNameTag(data: Entity, mesh: AbstractMesh): void {
    // TODO: Create GUI label above entity
    // For now, just log it
    console.log(`Name tag for: ${data.name}`);
  }

  /**
   * Despawn an entity
   */
  despawnEntity(entityId: string): void {
    const entity = this.entities.get(entityId);
    if (!entity) {
      console.warn(`Entity not found: ${entityId}`);
      return;
    }

    // Dispose mesh
    entity.mesh?.dispose();

    // Dispose container
    entity.container?.dispose();

    // Remove from maps
    this.entities.delete(entityId);
    this.entityMeshes.delete(entityId);

    console.log(`Despawned entity: ${entityId}`);
  }

  /**
   * Update entity state
   */
  updateEntity(data: Partial<Entity> & { id: string }): void {
    const entity = this.entities.get(data.id);
    if (!entity) {
      console.warn(`Entity not found for update: ${data.id}`);
      return;
    }

    // Update position if provided
    if (data.position && entity.container) {
      const targetPos = new Vector3(data.position.x, data.position.y, data.position.z);
      entity.container.position = Vector3.Lerp(
        entity.container.position,
        targetPos,
        this.interpolationFactor
      );
    }

    // Update rotation if provided
    if (data.rotation !== undefined && entity.container) {
      entity.container.rotation.y = data.rotation;
    }

    // Update other properties
    if (data.level !== undefined) {
      entity.level = data.level;
    }

    console.log(`Updated entity: ${data.id}`);
  }

  /**
   * Get entity by ID
   */
  getEntity(entityId: string): EntityData | undefined {
    return this.entities.get(entityId);
  }

  /**
   * Get all entities of a specific type
   */
  getEntitiesByType(type: EntityType): EntityData[] {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  /**
   * Get all entities
   */
  getAllEntities(): EntityData[] {
    return Array.from(this.entities.values());
  }

  /**
   * Clear all entities
   */
  clearAll(): void {
    for (const [id, entity] of this.entities) {
      entity.mesh?.dispose();
      entity.container?.dispose();
    }

    this.entities.clear();
    this.entityMeshes.clear();
  }

  /**
   * Update entity manager (called each frame)
   */
  update(deltaTime: number): void {
    // Interpolate entity movements
    for (const [id, entity] of this.entities) {
      // TODO: Implement smooth interpolation for network updates
    }
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.clearAll();
  }
}
