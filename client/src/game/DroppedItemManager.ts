/**
 * SRObro - Dropped Item Manager
 * Manages visualization and interaction with dropped items on the ground
 */

import { MeshBuilder, Vector3, StandardMaterial, Color3 } from '@babylonjs/core';
import type {
  DroppedItem,
  Position,
  Item
} from '../../../shared/src/types';

export interface DroppedItemVisual {
  id: string;
  droppedItem: DroppedItem;
  mesh?: any; // Babylon.js Mesh
  label?: any; // Babylon.js GUI label
  marker?: any; // Babylon.js GUI marker
}

export class DroppedItemManager {
  private droppedItems: Map<string, DroppedItemVisual> = new Map();
  private pickupRange: number = 3.0; // meters
  private autoPickup: boolean = false;
  private lootFilter = {
    common: true,
    rare: true,
    legendary: true,
    unique: true
  };

  // Singleton instance
  private static instance: DroppedItemManager | null = null;

  private constructor() {}

  static getInstance(): DroppedItemManager {
    if (!DroppedItemManager.instance) {
      DroppedItemManager.instance = new DroppedItemManager();
    }
    return DroppedItemManager.instance;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Add a dropped item to the world
   */
  addDroppedItem(droppedItem: DroppedItem, scene?: any): void {
    if (!scene) return;

    const visual: DroppedItemVisual = {
      id: droppedItem.id,
      droppedItem
    };

    // Create 3D representation
    this.createItemMesh(visual, scene);

    // Create label
    this.createItemLabel(visual, scene);

    this.droppedItems.set(droppedItem.id, visual);

    console.log(`Dropped item added: ${droppedItem.itemData.name} at (${droppedItem.position.x}, ${droppedItem.position.z})`);
  }

  /**
   * Remove a dropped item
   */
  removeDroppedItem(itemId: string): void {
    const visual = this.droppedItems.get(itemId);
    if (!visual) return;

    // Dispose mesh
    if (visual.mesh) {
      visual.mesh.dispose();
    }

    // Dispose label
    if (visual.label) {
      visual.label.dispose();
    }

    // Dispose marker
    if (visual.marker) {
      visual.marker.dispose();
    }

    this.droppedItems.delete(itemId);

    console.log(`Dropped item removed: ${itemId}`);
  }

  /**
   * Get all dropped items near player
   */
  getItemsInRange(playerPosition: Position): DroppedItem[] {
    const itemsInRange: DroppedItem[] = [];

    this.droppedItems.forEach((visual) => {
      const distance = this.getDistance(playerPosition, visual.droppedItem.position);

      if (distance <= this.pickupRange) {
        itemsInRange.push(visual.droppedItem);
      }
    });

    return itemsInRange;
  }

  /**
   * Pick up an item
   */
  pickupItem(itemId: string, playerPosition: Position): boolean {
    const visual = this.droppedItems.get(itemId);
    if (!visual) return false;

    // Check range
    const distance = this.getDistance(playerPosition, visual.droppedItem.position);
    if (distance > this.pickupRange) {
      console.log('Item too far to pick up');
      return false;
    }

    // Check loot filter
    const itemData = visual.droppedItem.itemData;
    if (!this.lootFilter[itemData.rarity]) {
      console.log(`Item rarity ${itemData.rarity} is filtered`);
      return false;
    }

    // Check ownership
    if (visual.droppedItem.ownerId) {
      // TODO: Check if player is owner
      console.log('Item has owner protection');
      // For now, allow anyone to pick up after a delay
    }

    // Success - remove from scene
    this.removeDroppedItem(itemId);

    console.log(`Picked up: ${itemData.name}`);
    return true;
  }

  /**
   * Pick up all nearby items
   */
  pickupAllNearby(playerPosition: Position): number {
    let pickedUp = 0;
    const itemsToPickup: string[] = [];

    this.droppedItems.forEach((visual, id) => {
      const distance = this.getDistance(playerPosition, visual.droppedItem.position);

      if (distance <= this.pickupRange) {
        itemsToPickup.push(id);
      }
    });

    itemsToPickup.forEach(id => {
      if (this.pickupItem(id, playerPosition)) {
        pickedUp++;
      }
    });

    console.log(`Picked up ${pickedUp} items`);
    return pickedUp;
  }

  /**
   * Update expired items
   */
  updateExpiredItems(): void {
    const now = new Date();
    const expiredIds: string[] = [];

    this.droppedItems.forEach((visual, id) => {
      if (visual.droppedItem.expiresAt < now) {
        expiredIds.push(id);
      }
    });

    expiredIds.forEach(id => {
      this.removeDroppedItem(id);
      console.log(`Item expired: ${id}`);
    });
  }

  /**
   * Update item visuals (rotation, floating animation)
   */
  update(deltaTime: number): void {
    this.droppedItems.forEach((visual) => {
      // Rotate item mesh
      if (visual.mesh) {
        visual.mesh.rotation.y += deltaTime * 1; // 1 radian per second

        // Floating animation
        const time = Date.now() / 1000;
        visual.mesh.position.y = visual.droppedItem.position.y + Math.sin(time * 2) * 0.1;
      }

      // Update label position
      if (visual.label && visual.mesh) {
        visual.label.linkWithMesh(visual.mesh);
        visual.label.position.y = 2; // Above the item
      }
    });
  }

  /**
   * Set pickup range
   */
  setPickupRange(range: number): void {
    this.pickupRange = Math.max(1, Math.min(10, range)); // Clamp between 1-10m
  }

  /**
   * Set auto-pickup mode
   */
  setAutoPickup(enabled: boolean): void {
    this.autoPickup = enabled;
  }

  /**
   * Set loot filter
   */
  setLootFilter(filter: { common: boolean; rare: boolean; legendary: boolean; unique: boolean }): void {
    this.lootFilter = filter;
  }

  /**
   * Get all dropped items
   */
  getAllDroppedItems(): DroppedItem[] {
    const items: DroppedItem[] = [];
    this.droppedItems.forEach((visual) => {
      items.push(visual.droppedItem);
    });
    return items;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private createItemMesh(visual: DroppedItemVisual, scene: any): void {
    // Create a simple placeholder mesh for the item
    // In production, this would load the actual item model
    const itemData = visual.droppedItem.itemData;

    // Create box as placeholder
    const mesh = MeshBuilder.CreateBox(`dropped_${visual.id}`, { size: 0.5 }, scene);

    // Set position
    mesh.position = new Vector3(
      visual.droppedItem.position.x,
      visual.droppedItem.position.y + 0.25,
      visual.droppedItem.position.z
    );

    // Set color based on rarity
    const color = this.getRarityColor(itemData.rarity);
    const material = new StandardMaterial(`item_mat_${visual.id}`, scene);
    material.diffuseColor = Color3.FromHexString(color);
    mesh.material = material;

    visual.mesh = mesh;
  }

  private createItemLabel(visual: DroppedItemVisual, _scene: any): void {
    // TODO: Create Babylon.js GUI label (visual.label stays undefined until then)
    void visual;
  }

  private getDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      common: '#FFFFFF',
      rare: '#00FF00',
      legendary: '#0070DD',
      unique: '#FF8000'
    };
    return colors[rarity] || '#FFFFFF';
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.droppedItems.forEach((visual) => {
      if (visual.mesh) visual.mesh.dispose();
      if (visual.label) visual.label.dispose();
      if (visual.marker) visual.marker.dispose();
    });
    this.droppedItems.clear();
  }
}

export default DroppedItemManager;
