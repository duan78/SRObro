/**
 * SRObro - Minimap Manager (Server-Side)
 * Tracks entities for minimap updates
 */

import type { MinimapMarker, MinimapUpdate } from '../../../shared/src/types';

export interface EntityData {
  id: string;
  type: 'player' | 'npc' | 'monster' | 'party' | 'transport';
  name: string;
  level: number;
  position: { x: number; y: number; z: number };
  zoneId: string;
  guildId?: string;
  partyId?: string;
  isAggressive?: boolean;
  isChampion?: boolean;
  isGiant?: boolean;
  isUnique?: boolean;
}

export class MinimapManager {
  private static instance: MinimapManager | null = null;
  private zoneEntities: Map<string, Map<string, EntityData>> = new Map();

  // Configuration
  private readonly updateRate = 10; // Hz (10 updates per second)
  private readonly playerRange = 200; // Send entities within 200m

  private constructor() {}

  static getInstance(): MinimapManager {
    if (!MinimapManager.instance) {
      MinimapManager.instance = new MinimapManager();
    }
    return MinimapManager.instance;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Register an entity in a zone
   */
  registerEntity(entity: EntityData): void {
    let zoneEntities = this.zoneEntities.get(entity.zoneId);

    if (!zoneEntities) {
      zoneEntities = new Map();
      this.zoneEntities.set(entity.zoneId, zoneEntities);
    }

    zoneEntities.set(entity.id, entity);
  }

  /**
   * Update entity position
   */
  updateEntityPosition(
    entityId: string,
    zoneId: string,
    position: { x: number; y: number; z: number }
  ): void {
    const zoneEntities = this.zoneEntities.get(zoneId);

    if (!zoneEntities) {
      return;
    }

    const entity = zoneEntities.get(entityId);

    if (entity) {
      entity.position = position;
    }
  }

  /**
   * Remove entity from zone
   */
  removeEntity(entityId: string, zoneId: string): void {
    const zoneEntities = this.zoneEntities.get(zoneId);

    if (!zoneEntities) {
      return;
    }

    zoneEntities.delete(entityId);
  }

  /**
   * Remove entity from all zones
   */
  removeEntityFromAllZones(entityId: string): void {
    this.zoneEntities.forEach((zoneEntities, zoneId) => {
      zoneEntities.delete(entityId);
    });
  }

  /**
   * Get minimap update for a player
   */
  getMinimapUpdate(
    playerId: string,
    zoneId: string,
    playerPosition: { x: number; z: number }
  ): MinimapUpdate | null {
    const zoneEntities = this.zoneEntities.get(zoneId);

    if (!zoneEntities) {
      return null;
    }

    const player = zoneEntities.get(playerId);

    if (!player) {
      return null;
    }

    const markers: MinimapMarker[] = [];

    zoneEntities.forEach((entity, id) => {
      // Skip the player themselves
      if (id === playerId) {
        return;
      }

      // Calculate distance
      const dx = entity.position.x - playerPosition.x;
      const dz = entity.position.z - playerPosition.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // Skip if out of range
      if (distance > this.playerRange) {
        return;
      }

      // Determine marker color
      const color = this.getMarkerColor(entity);

      // Create marker
      const marker: MinimapMarker = {
        entityId: entity.id,
        type: entity.type,
        position: { x: entity.position.x, z: entity.position.z },
        color,
        name: entity.type === 'party' ? entity.name : undefined,
        level: entity.level
      };

      markers.push(marker);
    });

    // Get zone name from zone ID
    const zoneName = this.getZoneName(zoneId);

    return {
      playerPosition: { x: playerPosition.x, z: playerPosition.z },
      markers,
      zoneName
    };
  }

  /**
   * Get all entities in a zone
   */
  getZoneEntities(zoneId: string): Map<string, EntityData> {
    return this.zoneEntities.get(zoneId) || new Map();
  }

  /**
   * Get nearby entities for a player
   */
  getNearbyEntities(
    zoneId: string,
    playerPosition: { x: number; z: number },
    range?: number
  ): EntityData[] {
    const zoneEntities = this.zoneEntities.get(zoneId);

    if (!zoneEntities) {
      return [];
    }

    const searchRange = range || this.playerRange;
    const nearby: EntityData[] = [];

    zoneEntities.forEach((entity) => {
      const dx = entity.position.x - playerPosition.x;
      const dz = entity.position.z - playerPosition.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance <= searchRange) {
        nearby.push(entity);
      }
    });

    return nearby;
  }

  /**
   * Bulk update entity positions (for zone transfer)
   */
  bulkUpdatePositions(updates: Array<{ entityId: string; zoneId: string; position: { x: number; y: number; z: number } }>): void {
    updates.forEach(update => {
      this.updateEntityPosition(update.entityId, update.zoneId, update.position);
    });
  }

  /**
   * Clear all entities in a zone
   */
  clearZone(zoneId: string): void {
    const zoneEntities = this.zoneEntities.get(zoneId);

    if (zoneEntities) {
      console.log(`Cleared ${zoneEntities.size} entities from zone ${zoneId}`);
    }

    this.zoneEntities.delete(zoneId);
  }

  /**
   * Get statistics
   */
  getStats(): { zones: number; totalEntities: number } {
    let totalEntities = 0;

    this.zoneEntities.forEach((zoneEntities) => {
      totalEntities += zoneEntities.size;
    });

    return {
      zones: this.zoneEntities.size,
      totalEntities
    };
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private getMarkerColor(entity: EntityData): string {
    // Priority: Unique > Giant > Champion > Party > Type-based

    if (entity.isUnique) {
      return '#FF00FF'; // Magenta for uniques
    }

    if (entity.isGiant) {
      return '#FF4500'; // Orange-red for giants
    }

    if (entity.isChampion) {
      return '#FF8C00'; // Dark orange for champions
    }

    // Type-based colors
    switch (entity.type) {
      case 'player':
        return '#FFFFFF'; // White
      case 'npc':
        return '#00FF00'; // Green
      case 'monster':
        return entity.isAggressive ? '#FF0000' : '#FFFF00'; // Red (aggressive) or Yellow (passive)
      case 'party':
        return '#00FFFF'; // Cyan
      case 'transport':
        return '#FF8000'; // Orange
      default:
        return '#FFFFFF';
    }
  }

  private getZoneName(zoneId: string): string {
    // Map zone IDs to readable names
    const zoneNames: Record<string, string> = {
      'zone_jangan': 'Jangan',
      'zone_donwhang': 'Donwhang',
      'zone_hotan': 'Hotan',
      'zone_jangan_cave': 'Jangan Cave',
      'zone_tomb': 'Tomb',
      'zone_job_cave': 'Job Cave',
      'zone_fortress_jangan': 'Jangan Fortress',
      'zone_fortress_hotan': 'Hotan Fortress',
      'zone_fortress_bandit': 'Bandit Fortress'
    };

    return zoneNames[zoneId] || zoneId.replace('zone_', '').replace('_', ' ');
  }
}

export default MinimapManager;
