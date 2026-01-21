/**
 * SRObro - Drop Manager (Server-Side)
 * Handles item drops from monsters, NPCs, and players
 */

import { DroppedItem, Item, Character, InventoryItem } from '../database/types';
import { query, transaction } from '../database/sql';

export interface DropOptions {
  ownerId?: string; // Character ID who can pick up first
  duration?: number; // Seconds before item expires (default: 300 = 5 minutes)
}

export class DropManager {
  private static instance: DropManager | null = null;

  private constructor() {}

  static getInstance(): DropManager {
    if (!DropManager.instance) {
      DropManager.instance = new DropManager();
    }
    return DropManager.instance;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Drop an item in the world
   */
  async dropItem(
    zoneId: string,
    itemId: string,
    position: { x: number; y: number; z: number },
    options: DropOptions = {}
  ): Promise<string> {
    // Get item data
    const itemResult = await query<Item>('SELECT * FROM items WHERE "id" = $1', [itemId]);
    const item = itemResult.rows[0];

    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }

    // Calculate expiration time
    const duration = options.duration || 300; // 5 minutes default
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + duration);

    // Create dropped item
    const droppedItemResult = await query<DroppedItem>(
      `INSERT INTO dropped_items ("zoneId", "itemId", "itemData", "positionX", "positionY", "positionZ", "ownerId", "expiresAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        zoneId,
        itemId,
        JSON.stringify({
          name: item.name,
          type: item.type,
          rarity: item.rarity,
          requiredLevel: item.requiredLevel,
          price: item.price.toString(),
          stackable: item.stackable,
          maxStack: item.maxStack,
          plus: 0,
          durability: item.durability,
          quantity: 1
        }),
        position.x,
        position.y,
        position.z,
        options.ownerId || null,
        expiresAt
      ]
    );

    const droppedItem = droppedItemResult.rows[0];

    console.log(`Item dropped: ${item.name} at (${position.x}, ${position.z}), expires: ${expiresAt}`);

    return droppedItem.id;
  }

  /**
   * Drop multiple items (e.g., from monster kill)
   */
  async dropItems(
    zoneId: string,
    items: Array<{ itemId: string; quantity?: number; min?: number; max?: number }>,
    position: { x: number; y: number; z: number },
    options: DropOptions = {}
  ): Promise<string[]> {
    const droppedIds: string[] = [];

    for (const item of items) {
      const quantity = item.quantity || (item.min && item.max
        ? Math.floor(Math.random() * (item.max - item.min + 1)) + item.min
        : 1);

      // Random offset for each item to prevent stacking
      const offset = {
        x: position.x + (Math.random() - 0.5) * 2,
        y: position.y,
        z: position.z + (Math.random() - 0.5) * 2
      };

      const id = await this.dropItem(zoneId, item.itemId, offset, options);
      droppedIds.push(id);
    }

    return droppedIds;
  }

  /**
   * Pick up an item
   */
  async pickupItem(droppedItemId: string, characterId: string): Promise<{
    success: boolean;
    itemId?: string;
    itemData?: any;
    message?: string;
  }> {
    // Get dropped item
    const droppedItemResult = await query<DroppedItem>(
      'SELECT * FROM dropped_items WHERE "id" = $1',
      [droppedItemId]
    );
    const droppedItem = droppedItemResult.rows[0];

    if (!droppedItem) {
      return { success: false, message: 'Item not found or already picked up' };
    }

    // Check if expired
    if (droppedItem.expiresAt < new Date()) {
      await query('DELETE FROM dropped_items WHERE "id" = $1', [droppedItemId]);
      return { success: false, message: 'Item has expired' };
    }

    // Check ownership
    if (droppedItem.ownerId && droppedItem.ownerId !== characterId) {
      // Allow pickup if 30 seconds have passed
      const timeSinceDrop = Date.now() - droppedItem.createdAt.getTime();
      if (timeSinceDrop < 30000) {
        return { success: false, message: 'Item is owned by another player' };
      }
    }

    // Check if player has inventory space
    const characterResult = await query<Character>(
      'SELECT * FROM characters WHERE "id" = $1',
      [characterId]
    );
    const character = characterResult.rows[0];

    if (!character) {
      return { success: false, message: 'Character not found' };
    }

    // Get inventory items to find empty slot
    const inventoryResult = await query<InventoryItem>(
      'SELECT * FROM inventory_items WHERE "characterId" = $1',
      [characterId]
    );

    // Find empty slot
    const usedSlots = inventoryResult.rows.map(item => item.slot);
    let emptySlot: number | undefined;
    for (let i = 0; i < 45; i++) {
      if (!usedSlots.includes(i)) {
        emptySlot = i;
        break;
      }
    }

    if (emptySlot === undefined && usedSlots.length >= 45) {
      return { success: false, message: 'Inventory is full' };
    }

    const targetSlot = emptySlot !== undefined ? emptySlot : usedSlots.length;

    // Use transaction to add inventory and remove dropped item
    await transaction(async (client) => {
      // Add to inventory
      await client.query(
        `INSERT INTO inventory_items ("characterId", "itemId", "slot", "quantity", "plus", "durability", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          characterId,
          droppedItem.itemId,
          targetSlot,
          (droppedItem.itemData as any).quantity || 1,
          (droppedItem.itemData as any).plus || 0,
          (droppedItem.itemData as any).durability || -1
        ]
      );

      // Remove dropped item
      await client.query('DELETE FROM dropped_items WHERE "id" = $1', [droppedItemId]);
    });

    console.log(`Character ${characterId} picked up item ${droppedItem.itemId}`);

    return {
      success: true,
      itemId: droppedItem.itemId,
      itemData: droppedItem.itemData
    };
  }

  /**
   * Get all dropped items in a zone
   */
  async getDroppedItemsInZone(zoneId: string): Promise<Array<{
    id: string;
    itemId: string;
    itemData: any;
    position: { x: number; y: number; z: number };
    ownerId?: string;
    expiresAt: Date;
  }>> {
    const result = await query<DroppedItem>(
      'SELECT * FROM dropped_items WHERE "zoneId" = $1 AND "expiresAt" > NOW()',
      [zoneId]
    );

    return result.rows.map(item => ({
      id: item.id,
      itemId: item.itemId,
      itemData: item.itemData,
      position: {
        x: item.positionX,
        y: item.positionY,
        z: item.positionZ
      },
      ownerId: item.ownerId || undefined,
      expiresAt: item.expiresAt
    }));
  }

  /**
   * Clean up expired items
   */
  async cleanupExpiredItems(): Promise<number> {
    const result = await query('DELETE FROM dropped_items WHERE "expiresAt" < NOW()');

    const count = result.rowCount || 0;
    if (count > 0) {
      console.log(`Cleaned up ${count} expired dropped items`);
    }

    return count;
  }

  /**
   * Start cleanup interval
   */
  startCleanupInterval(intervalMs: number = 60000): void {
    setInterval(() => {
      this.cleanupExpiredItems();
    }, intervalMs);

    console.log(`Drop item cleanup interval started: ${intervalMs}ms`);
  }
}

export default DropManager;
