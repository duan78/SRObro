/**
 * SRObro - Spatial Manager
 * Handles spatial partitioning for efficient entity queries
 * Uses a grid-based sector system for O(1) nearby entity lookups
 */

import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';

const logger = createLogger('SpatialManager');

/**
 * Spatial position
 */
export interface SpatialPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Spatial entity
 */
export interface SpatialEntity {
  id: string;
  position: SpatialPosition;
  type: string;
  zoneId: string;
}

/**
 * Sector (grid cell) for spatial partitioning
 */
interface Sector {
  id: string;
  x: number;
  z: number;
  entities: Map<string, SpatialEntity>;
}

/**
 * Spatial Manager options
 */
export interface SpatialManagerOptions {
  sectorSize: number; // Size of each sector in meters (default: 100)
  aoiRadius: number; // Area of Interest radius in sectors (default: 1 = 3x3 grid)
}

/**
 * Spatial Manager class
 */
export class SpatialManager extends EventEmitter {
  private sectors: Map<string, Sector> = new Map();
  private entitySectorMap: Map<string, string> = new Map();
  private options: Required<SpatialManagerOptions>;

  constructor(options?: Partial<SpatialManagerOptions>) {
    super();
    this.options = {
      sectorSize: 100,
      aoiRadius: 1,
      ...options,
    };
  }

  /**
   * Add an entity to the spatial manager
   */
  addEntity(entity: SpatialEntity): void {
    const sectorId = this.getSectorId(entity.position);

    // Get or create sector
    let sector = this.sectors.get(sectorId);
    if (!sector) {
      sector = this.createSector(sectorId, entity.position);
    }

    // Add entity to sector
    sector.entities.set(entity.id, entity);
    this.entitySectorMap.set(entity.id, sectorId);

    logger.debug(`Entity added to spatial manager: ${entity.id}`, {
      position: entity.position,
      sector: sectorId,
    });

    this.emit('entityAdded', { entity, sectorId });
  }

  /**
   * Remove an entity from the spatial manager
   */
  removeEntity(entityId: string): void {
    const sectorId = this.entitySectorMap.get(entityId);
    if (!sectorId) {
      logger.warn(`Entity not found in spatial manager: ${entityId}`);
      return;
    }

    const sector = this.sectors.get(sectorId);
    if (sector) {
      sector.entities.delete(entityId);

      // Remove empty sector
      if (sector.entities.size === 0) {
        this.sectors.delete(sectorId);
      }
    }

    this.entitySectorMap.delete(entityId);

    logger.debug(`Entity removed from spatial manager: ${entityId}`, { sectorId });

    this.emit('entityRemoved', { entityId, sectorId });
  }

  /**
   * Update entity position
   */
  updateEntityPosition(entityId: string, newPosition: SpatialPosition): void {
    const oldSectorId = this.entitySectorMap.get(entityId);
    const newSectorId = this.getSectorId(newPosition);

    // Get entity from old sector
    let entity: SpatialEntity | undefined;
    if (oldSectorId) {
      const oldSector = this.sectors.get(oldSectorId);
      entity = oldSector?.entities.get(entityId);
    }

    if (!entity) {
      logger.warn(`Entity not found for position update: ${entityId}`);
      return;
    }

    // Check if entity moved to a different sector
    if (oldSectorId !== newSectorId) {
      // Remove from old sector
      const oldSector = this.sectors.get(oldSectorId);
      if (oldSector) {
        oldSector.entities.delete(entityId);
        if (oldSector.entities.size === 0) {
          this.sectors.delete(oldSectorId);
        }
      }

      // Add to new sector
      let newSector = this.sectors.get(newSectorId);
      if (!newSector) {
        newSector = this.createSector(newSectorId, newPosition);
      }
      newSector.entities.set(entityId, entity);
      this.entitySectorMap.set(entityId, newSectorId);

      logger.debug(`Entity moved to new sector: ${entityId}`, {
        oldSector: oldSectorId,
        newSector: newSectorId,
        newPosition,
      });

      this.emit('entityChangedSector', { entityId, oldSectorId, newSectorId });
    }

    // Update entity position
    entity.position = newPosition;
  }

  /**
   * Get nearby entities
   */
  getNearbyEntities(position: SpatialPosition, radius: number): SpatialEntity[] {
    const nearbyEntities: SpatialEntity[] = [];
    const sectorId = this.getSectorId(position);
    const { x, z } = this.parseSectorId(sectorId);

    // Calculate sector range based on radius
    const sectorRadius = Math.ceil(radius / this.options.sectorSize);

    // Check sectors in range
    for (let dx = -sectorRadius; dx <= sectorRadius; dx++) {
      for (let dz = -sectorRadius; dz <= sectorRadius; dz++) {
        const checkSectorId = this.formatSectorId(x + dx, z + dz);
        const sector = this.sectors.get(checkSectorId);

        if (sector) {
          for (const entity of sector.entities.values()) {
            const distance = this.calculateDistance(position, entity.position);
            if (distance <= radius) {
              nearbyEntities.push(entity);
            }
          }
        }
      }
    }

    return nearbyEntities;
  }

  /**
   * Get entities in Area of Interest (AOI) - 3x3 grid around position
   */
  getEntitiesInAOI(position: SpatialPosition): SpatialEntity[] {
    return this.getNearbyEntities(
      position,
      this.options.aoiRadius * this.options.sectorSize
    );
  }

  /**
   * Get entities in a specific sector
   */
  getEntitiesInSector(position: SpatialPosition): SpatialEntity[] {
    const sectorId = this.getSectorId(position);
    const sector = this.sectors.get(sectorId);
    return sector ? Array.from(sector.entities.values()) : [];
  }

  /**
   * Get entities by type
   */
  getEntitiesByType(type: string, position?: SpatialPosition, radius?: number): SpatialEntity[] {
    let entities: SpatialEntity[];

    if (position && radius) {
      entities = this.getNearbyEntities(position, radius);
    } else {
      // Get all entities
      entities = [];
      for (const sector of this.sectors.values()) {
        entities.push(...Array.from(sector.entities.values()));
      }
    }

    return entities.filter((e) => e.type === type);
  }

  /**
   * Get entities by zone
   */
  getEntitiesByZone(zoneId: string): SpatialEntity[] {
    const entities: SpatialEntity[] = [];

    for (const sector of this.sectors.values()) {
      for (const entity of sector.entities.values()) {
        if (entity.zoneId === zoneId) {
          entities.push(entity);
        }
      }
    }

    return entities;
  }

  /**
   * Find closest entity
   */
  findClosestEntity(
    position: SpatialPosition,
    type?: string,
    maxDistance: number = 100
  ): SpatialEntity | null {
    let closestEntity: SpatialEntity | null = null;
    let closestDistance = maxDistance;

    const nearbyEntities = this.getNearbyEntities(position, maxDistance);

    for (const entity of nearbyEntities) {
      if (type && entity.type !== type) {
        continue;
      }

      const distance = this.calculateDistance(position, entity.position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEntity = entity;
      }
    }

    return closestEntity;
  }

  /**
   * Count entities
   */
  countEntities(): number {
    let count = 0;
    for (const sector of this.sectors.values()) {
      count += sector.entities.size;
    }
    return count;
  }

  /**
   * Count entities by type
   */
  countEntitiesByType(type: string): number {
    let count = 0;
    for (const sector of this.sectors.values()) {
      for (const entity of sector.entities.values()) {
        if (entity.type === type) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Clear all entities
   */
  clear(): void {
    this.sectors.clear();
    this.entitySectorMap.clear();
    logger.info('Spatial manager cleared');
    this.emit('cleared');
  }

  /**
   * Get sector ID from position
   */
  private getSectorId(position: SpatialPosition): string {
    const x = Math.floor(position.x / this.options.sectorSize);
    const z = Math.floor(position.z / this.options.sectorSize);
    return this.formatSectorId(x, z);
  }

  /**
   * Parse sector ID to coordinates
   * Séparateur ',' (et pas '-'): les coordonnées négatives produiraient
   * "−1--2" → split('-') = ['','1','','2'] → mauvaise cellule.
   */
  private parseSectorId(sectorId: string): { x: number; z: number } {
    const [x, z] = sectorId.split(',').map(Number);
    return { x, z };
  }

  /**
   * Format sector ID from coordinates
   */
  private formatSectorId(x: number, z: number): string {
    return `${x},${z}`;
  }

  /**
   * Create a new sector
   */
  private createSector(sectorId: string, _position: SpatialPosition): Sector {
    const { x, z } = this.parseSectorId(sectorId);
    const sector: Sector = {
      id: sectorId,
      x,
      z,
      entities: new Map(),
    };
    this.sectors.set(sectorId, sector);
    return sector;
  }

  /**
   * Calculate distance between two positions
   */
  private calculateDistance(pos1: SpatialPosition, pos2: SpatialPosition): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Get debug info
   */
  getDebugInfo(): {
    sectorCount: number;
    entityCount: number;
    sectorSize: number;
    aoiRadius: number;
  } {
    return {
      sectorCount: this.sectors.size,
      entityCount: this.countEntities(),
      sectorSize: this.options.sectorSize,
      aoiRadius: this.options.aoiRadius,
    };
  }

  /**
   * Get all sectors
   */
  getAllSectors(): Sector[] {
    return Array.from(this.sectors.values());
  }
}

/**
 * Create a spatial manager for a zone
 */
export function createZoneSpatialManager(options?: Partial<SpatialManagerOptions>): SpatialManager {
  return new SpatialManager(options);
}

/**
 * Global spatial manager instance
 */
export const globalSpatialManager = new SpatialManager();
