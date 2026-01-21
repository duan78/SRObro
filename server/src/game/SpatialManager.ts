// ============================================
// SRObro - Spatial Manager
// Optimized spatial queries using grid-based partitioning
// 100x100m grid cells for efficient AOI (Area of Interest) queries
// ============================================

/**
 * Grid cell coordinates
 */
interface GridCell {
  x: number;
  z: number;
}

/**
 * Entity in a grid cell
 */
interface CellEntity {
  entityId: string;
  zoneId: string;
  position: { x: number; y: number; z: number };
}

/**
 * Spatial Manager - Grid-based spatial partitioning
 *
 * Uses a 100x100m grid for efficient spatial queries:
 * - O(1) insertion/removal
 * - O(k) range queries where k is number of cells in range
 * - Perfect for MMORPG with large open worlds
 *
 * Sources:
 * - [Spatial Partitioning](https://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter_Spatial_Partitioning_For_Large_Scale_Worlds.html)
 * - [Grid-Based Spatial Partitioning](https://github.com/microsoft/projectabc/blob/main/Docs/spatial-partitioning.md)
 */
export class SpatialManager {
  private readonly CELL_SIZE: number; // meters
  private grid: Map<string, Set<string>> = new Map();
  private entityPositions: Map<string, { cell: GridCell; position: { x: number; y: number; z: number }; zoneId: string }> = new Map();

  constructor(cellSize: number = 100) {
    this.CELL_SIZE = cellSize;
    console.log(`[SpatialManager] Initialized with cell size: ${this.CELL_SIZE}m`);
  }

  /**
   * Get grid cell key for position
   */
  private getCellKey(x: number, z: number): string {
    const cellX = Math.floor(x / this.CELL_SIZE);
    const cellZ = Math.floor(z / this.CELL_SIZE);
    return `${cellX},${cellZ}`;
  }

  /**
   * Get grid cell for position
   */
  private getCell(x: number, z: number): GridCell {
    return {
      x: Math.floor(x / this.CELL_SIZE),
      z: Math.floor(z / this.CELL_SIZE),
    };
  }

  /**
   * Add entity to spatial manager
   */
  public addEntity(entityId: string, position: { x: number; y: number; z: number }, zoneId: string): void {
    const cell = this.getCell(position.x, position.z);
    const cellKey = this.getCellKey(position.x, position.z);

    // Add to grid
    if (!this.grid.has(cellKey)) {
      this.grid.set(cellKey, new Set());
    }
    this.grid.get(cellKey)!.add(entityId);

    // Store position
    this.entityPositions.set(entityId, {
      cell,
      position: { ...position },
      zoneId,
    });

    // console.log(`[SpatialManager] Added entity ${entityId} to cell ${cellKey} (zone: ${zoneId})`);
  }

  /**
   * Remove entity from spatial manager
   */
  public removeEntity(entityId: string): void {
    const entityData = this.entityPositions.get(entityId);
    if (!entityData) {
      console.warn(`[SpatialManager] Entity not found: ${entityId}`);
      return;
    }

    const cellKey = this.getCellKey(entityData.position.x, entityData.position.z);
    const cell = this.grid.get(cellKey);

    if (cell) {
      cell.delete(entityId);

      // Clean up empty cells
      if (cell.size === 0) {
        this.grid.delete(cellKey);
      }
    }

    this.entityPositions.delete(entityId);

    // console.log(`[SpatialManager] Removed entity ${entityId} from cell ${cellKey}`);
  }

  /**
   * Update entity position
   */
  public updateEntityPosition(entityId: string, newPosition: { x: number; y: number; z: number }): void {
    const entityData = this.entityPositions.get(entityId);
    if (!entityData) {
      console.warn(`[SpatialManager] Entity not found: ${entityId}`);
      return;
    }

    const oldCellKey = this.getCellKey(entityData.position.x, entityData.position.z);
    const newCellKey = this.getCellKey(newPosition.x, newPosition.z);

    // Check if entity changed cells
    if (oldCellKey !== newCellKey) {
      // Remove from old cell
      const oldCell = this.grid.get(oldCellKey);
      if (oldCell) {
        oldCell.delete(entityId);
        if (oldCell.size === 0) {
          this.grid.delete(oldCellKey);
        }
      }

      // Add to new cell
      if (!this.grid.has(newCellKey)) {
        this.grid.set(newCellKey, new Set());
      }
      this.grid.get(newCellKey)!.add(entityId);
    }

    // Update position
    entityData.position = { ...newPosition };
    entityData.cell = this.getCell(newPosition.x, newPosition.z);
  }

  /**
   * Query entities in radius (AOI - Area of Interest)
   */
  public queryRadius(center: { x: number; y: number; z: number }, radius: number): string[] {
    const results: string[] = [];

    // Calculate cell range
    const minCell = this.getCell(center.x - radius, center.z - radius);
    const maxCell = this.getCell(center.x + radius, center.z + radius);

    // Query cells in range
    for (let cellX = minCell.x; cellX <= maxCell.x; cellX++) {
      for (let cellZ = minCell.z; cellZ <= maxCell.z; cellZ++) {
        const cellKey = `${cellX},${cellZ}`;
        const cell = this.grid.get(cellKey);

        if (cell) {
          // Check each entity in cell
          for (const entityId of cell) {
            const entityData = this.entityPositions.get(entityId);
            if (!entityData) continue;

            // Calculate distance
            const dx = entityData.position.x - center.x;
            const dz = entityData.position.z - center.z;
            const distanceSquared = dx * dx + dz * dz;

            // Check if in radius
            if (distanceSquared <= radius * radius) {
              results.push(entityId);
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Query entities in rectangle
   */
  public queryRectangle(min: { x: number; z: number }, max: { x: number; z: number }): string[] {
    const results: string[] = [];

    // Calculate cell range
    const minCell = this.getCell(min.x, min.z);
    const maxCell = this.getCell(max.x, max.z);

    // Query cells in range
    for (let cellX = minCell.x; cellX <= maxCell.x; cellX++) {
      for (let cellZ = minCell.z; cellZ <= maxCell.z; cellZ++) {
        const cellKey = `${cellX},${cellZ}`;
        const cell = this.grid.get(cellKey);

        if (cell) {
          // Add all entities in cell
          for (const entityId of cell) {
            const entityData = this.entityPositions.get(entityId);
            if (!entityData) continue;

            // Check if in rectangle
            if (
              entityData.position.x >= min.x &&
              entityData.position.x <= max.x &&
              entityData.position.z >= min.z &&
              entityData.position.z <= max.z
            ) {
              results.push(entityId);
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Query entities in zone
   */
  public queryZone(zoneId: string): string[] {
    const results: string[] = [];

    for (const [entityId, entityData] of this.entityPositions) {
      if (entityData.zoneId === zoneId) {
        results.push(entityId);
      }
    }

    return results;
  }

  /**
   * Get nearest entity to position
   */
  public findNearest(
    center: { x: number; y: number; z: number },
    radius: number,
    filter?: (entityId: string) => boolean
  ): string | null {
    const nearby = this.queryRadius(center, radius);

    let nearestEntityId: string | null = null;
    let nearestDistanceSquared = radius * radius;

    for (const entityId of nearby) {
      // Apply filter
      if (filter && !filter(entityId)) {
        continue;
      }

      const entityData = this.entityPositions.get(entityId);
      if (!entityData) continue;

      // Calculate distance
      const dx = entityData.position.x - center.x;
      const dz = entityData.position.z - center.z;
      const distanceSquared = dx * dx + dz * dz;

      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
        nearestEntityId = entityId;
      }
    }

    return nearestEntityId;
  }

  /**
   * Get entity position
   */
  public getEntityPosition(entityId: string): { x: number; y: number; z: number } | null {
    const entityData = this.entityPositions.get(entityId);
    return entityData ? { ...entityData.position } : null;
  }

  /**
   * Get entity zone
   */
  public getEntityZone(entityId: string): string | null {
    const entityData = this.entityPositions.get(entityId);
    return entityData ? entityData.zoneId : null;
  }

  /**
   * Clear all entities
   */
  public clear(): void {
    this.grid.clear();
    this.entityPositions.clear();
    console.log('[SpatialManager] Cleared all entities');
  }

  /**
   * Get statistics
   */
  public getStats(): {
    totalEntities: number;
    totalCells: number;
    entitiesPerCell: number;
    cellSize: number;
  } {
    const totalEntities = this.entityPositions.size;
    const totalCells = this.grid.size;
    const entitiesPerCell = totalCells > 0 ? totalEntities / totalCells : 0;

    return {
      totalEntities,
      totalCells,
      entitiesPerCell,
      cellSize: this.CELL_SIZE,
    };
  }

  /**
   * Log statistics
   */
  public logStats(): void {
    const stats = this.getStats();
    console.log('[SpatialManager] Statistics:');
    console.log(`  Total Entities: ${stats.totalEntities}`);
    console.log(`  Total Cells: ${stats.totalCells}`);
    console.log(`  Entities Per Cell: ${stats.entitiesPerCell.toFixed(2)}`);
    console.log(`  Cell Size: ${stats.cellSize}m`);
  }
}
