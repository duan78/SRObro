// ============================================
// SRObro - Equipment System
// Handles items, equipment, and inventory management
// ============================================

import type { Character, CharacterStats, EquipmentSlot, EquipmentSlotType, InventoryItem, Item } from '@srobro/shared';
import { Observable } from '@babylonjs/core';

export interface EquipmentChange {
  slot: EquipmentSlotType;
  item: Item | null;
}

export interface InventoryChange {
  action: 'add' | 'remove' | 'update';
  item: InventoryItem;
}

export class EquipmentSystem {
  private character: Character;

  // Observables for events
  public onEquipmentChange = new Observable<EquipmentChange>();
  public onInventoryChange = new Observable<InventoryChange>();

  constructor(character: Character) {
    this.character = character;
    this.initializeInventory();
  }

  /**
   * Initialize inventory with starter items
   */
  private initializeInventory(): void {
    // For MVP, give player some basic potions
    this.addStarterItems();
  }

  /**
   * Add starter items for new players
   */
  private addStarterItems(): void {
    // Add 10 HP potions
    for (let i = 0; i < 10; i++) {
      this.addItem({
        id: `starter_hp_potion_${i}`,
        item: {
          id: 'potion_hp_10',
          name: 'HP Potion (Small)',
          type: 'potion',
          rarity: 'common',
          requiredLevel: 1,
          price: 50,
          stackable: true,
          maxStack: 50,
          quantity: 1,
        },
        slot: this.getEmptyInventorySlot(),
      });
    }

    console.log('[EquipmentSystem] Starter items added');
  }

  /**
   * Get empty inventory slot
   */
  private getEmptyInventorySlot(): number {
    const usedSlots = new Set(this.character.inventory.map(item => item.slot));
    for (let i = 0; i < 45; i++) { // 45 slots for MVP
      if (!usedSlots.has(i)) {
        return i;
      }
    }
    return -1; // Inventory full
  }

  /**
   * Add item to inventory
   */
  addItem(inventoryItem: InventoryItem): boolean {
    // Check if stackable and already exists
    const existingItem = this.character.inventory.find(item =>
      item.item.id === inventoryItem.item.id &&
      item.item.stackable &&
      (item.item.quantity || 0) < (item.item.maxStack || 1)
    );

    if (existingItem && inventoryItem.item.quantity) {
      // Stack with existing item
      const currentQuantity = existingItem.item.quantity || 0;
      const addQuantity = inventoryItem.item.quantity;
      const maxStack = existingItem.item.maxStack || 1;

      const newQuantity = Math.min(currentQuantity + addQuantity, maxStack);
      existingItem.item.quantity = newQuantity;

      this.onInventoryChange.notifyObservers({
        action: 'update',
        item: existingItem,
      });

      console.log(`[EquipmentSystem] Stacked item: ${inventoryItem.item.name} (${newQuantity}/${maxStack})`);
      return true;
    }

    // Add to new slot
    const slot = this.getEmptyInventorySlot();
    if (slot === -1) {
      console.warn('[EquipmentSystem] Inventory full');
      return false;
    }

    inventoryItem.slot = slot;
    this.character.inventory.push(inventoryItem);

    this.onInventoryChange.notifyObservers({
      action: 'add',
      item: inventoryItem,
    });

    console.log(`[EquipmentSystem] Added item: ${inventoryItem.item.name} to slot ${slot}`);
    return true;
  }

  /**
   * Remove item from inventory
   */
  removeItem(inventoryItemId: string): boolean {
    const index = this.character.inventory.findIndex(item => item.id === inventoryItemId);

    if (index === -1) {
      console.warn(`[EquipmentSystem] Item not found: ${inventoryItemId}`);
      return false;
    }

    const item = this.character.inventory[index];
    this.character.inventory.splice(index, 1);

    this.onInventoryChange.notifyObservers({
      action: 'remove',
      item,
    });

    console.log(`[EquipmentSystem] Removed item: ${item.item.name}`);
    return true;
  }

  /**
   * Use consumable item (potion, etc.)
   */
  useItem(inventoryItemId: string): { success: boolean; effect?: any } {
    const item = this.character.inventory.find(i => i.id === inventoryItemId);

    if (!item) {
      console.warn(`[EquipmentSystem] Item not found: ${inventoryItemId}`);
      return { success: false };
    }

    // Handle potions
    if (item.item.type === 'potion') {
      if (item.item.id.startsWith('potion_hp')) {
        const restoreAmount = 100; // Small HP potion restores 100 HP
        return {
          success: true,
          effect: { type: 'restore_hp', amount: restoreAmount },
        };
      } else if (item.item.id.startsWith('potion_mp')) {
        const restoreAmount = 50; // Small MP potion restores 50 MP
        return {
          success: true,
          effect: { type: 'restore_mp', amount: restoreAmount },
        };
      }
    }

    console.warn(`[EquipmentSystem] Item not usable: ${item.item.name}`);
    return { success: false };
  }

  /**
   * Consume item (reduce quantity or remove)
   */
  consumeItem(inventoryItemId: string): boolean {
    const item = this.character.inventory.find(i => i.id === inventoryItemId);

    if (!item) {
      return false;
    }

    if (item.item.quantity && item.item.quantity > 1) {
      item.item.quantity--;
      this.onInventoryChange.notifyObservers({
        action: 'update',
        item,
      });
      console.log(`[EquipmentSystem] Consumed 1 ${item.item.name} (${item.item.quantity} left)`);
      return true;
    } else {
      return this.removeItem(inventoryItemId);
    }
  }

  /**
   * Equip item
   */
  equipItem(inventoryItemId: string, slot: EquipmentSlotType): boolean {
    const inventoryItem = this.character.inventory.find(i => i.id === inventoryItemId);

    if (!inventoryItem) {
      console.warn(`[EquipmentSystem] Item not found: ${inventoryItemId}`);
      return false;
    }

    // Check if item type matches slot
    if (!this.isSlotValidForItem(slot, inventoryItem.item.type)) {
      console.warn(`[EquipmentSystem] Invalid slot for item type`);
      return false;
    }

    // Unequip existing item in slot
    const existingEquipment = this.character.equipment.find(e => e.slot === slot);
    if (existingEquipment) {
      this.unequipItem(slot);
    }

    // Remove from inventory and equip
    this.character.inventory = this.character.inventory.filter(i => i.id !== inventoryItemId);

    const equipmentSlot: EquipmentSlot = {
      slot,
      item: {
        ...inventoryItem.item,
        plus: inventoryItem.item.plus || 0,
        durability: inventoryItem.item.durability || 100,
        maxDurability: inventoryItem.item.maxDurability || 100,
      },
    };

    this.character.equipment.push(equipmentSlot);

    this.onEquipmentChange.notifyObservers({
      slot,
      item: equipmentSlot.item,
    });

    console.log(`[EquipmentSystem] Equipped: ${inventoryItem.item.name} to ${slot}`);
    return true;
  }

  /**
   * Unequip item
   */
  unequipItem(slot: EquipmentSlotType): boolean {
    const index = this.character.equipment.findIndex(e => e.slot === slot);

    if (index === -1) {
      console.warn(`[EquipmentSystem] No item equipped in slot: ${slot}`);
      return false;
    }

    const equipment = this.character.equipment[index];

    // Try to add back to inventory
    const emptySlot = this.getEmptyInventorySlot();
    if (emptySlot === -1) {
      console.warn('[EquipmentSystem] Cannot unequip, inventory full');
      return false;
    }

    // Remove from equipment
    this.character.equipment.splice(index, 1);

    // Add to inventory
    this.addItem({
      id: `unequipped_${Date.now()}`,
      item: {
        ...equipment.item,
        quantity: 1,
      },
      slot: emptySlot,
    });

    this.onEquipmentChange.notifyObservers({
      slot,
      item: null,
    });

    console.log(`[EquipmentSystem] Unequipped item from: ${slot}`);
    return true;
  }

  /**
   * Check if slot is valid for item type
   */
  private isSlotValidForItem(slot: EquipmentSlotType, itemType: string): boolean {
    const slotTypeMap: Record<string, EquipmentSlotType[]> = {
      weapon: ['weapon'],
      shield: ['shield'],
      helmet: ['helmet'],
      chest: ['chest'],
      shoulder: ['shoulder'],
      legs: ['legs'],
      boots: ['boots'],
      ring: ['ring1', 'ring2'],
      necklace: ['necklace'],
      earring: ['earring1', 'earring2'],
    };

    const validSlots = slotTypeMap[itemType] || [];
    return validSlots.includes(slot);
  }

  /**
   * Get total stats (base + equipment)
   */
  getTotalStats(): CharacterStats {
    const totalStats: CharacterStats = {
      str: this.character.stats.str,
      int: this.character.stats.int,
    };

    // Add stats from equipment
    this.character.equipment.forEach(equipment => {
      if (equipment.item.stats) {
        if (equipment.item.stats.str) {
          totalStats.str += equipment.item.stats.str;
        }
        if (equipment.item.stats.int) {
          totalStats.int += equipment.item.stats.int;
        }
      }
    });

    return totalStats;
  }

  /**
   * Get inventory
   */
  getInventory(): InventoryItem[] {
    return [...this.character.inventory];
  }

  /**
   * Get equipment
   */
  getEquipment(): EquipmentSlot[] {
    return [...this.character.equipment];
  }

  /**
   * Get item in slot
   */
  getItemInSlot(slot: EquipmentSlotType): EquipmentSlot | undefined {
    return this.character.equipment.find(e => e.slot === slot);
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.onEquipmentChange.clear();
    this.onInventoryChange.clear();
  }
}
