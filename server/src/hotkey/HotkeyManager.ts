/**
 * SRObro - Hotkey Manager (Server-Side)
 * Manages player hotkey bindings persistence and validation
 */

import { HotkeySlotType, HotkeyBinding, Item, Skill } from '../database/types';
import { HotkeyBindingHelpers, ItemHelpers, SkillHelpers } from '../database/helpers';
import { query } from '../database/sql';

export interface HotkeyBindingData {
  slotIndex: number;
  slotType: HotkeySlotType;
  itemId?: string;
  skillId?: string;
}

export class HotkeyManager {
  private static instance: HotkeyManager | null = null;
  private characterBindings: Map<string, Map<string, HotkeyBindingData>> = new Map();

  private constructor() {}

  static getInstance(): HotkeyManager {
    if (!HotkeyManager.instance) {
      HotkeyManager.instance = new HotkeyManager();
    }
    return HotkeyManager.instance;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Load all hotkey bindings for a character
   */
  async loadCharacterBindings(characterId: string): Promise<Map<string, HotkeyBindingData>> {
    const bindings = await query<HotkeyBinding>(
      `SELECT * FROM hotkey_bindings WHERE "characterId" = $1 ORDER BY "slotType" ASC, "slotIndex" ASC`,
      [characterId]
    );

    const bindingMap = new Map<string, HotkeyBindingData>();

    bindings.rows.forEach(binding => {
      const key = `${binding.slotType}_${binding.slotIndex}`;
      bindingMap.set(key, {
        slotIndex: binding.slotIndex,
        slotType: binding.slotType,
        itemId: binding.itemId || undefined,
        skillId: binding.skillId || undefined
      });
    });

    // Cache in memory
    this.characterBindings.set(characterId, bindingMap);

    console.log(`Loaded ${bindings.rows.length} hotkey bindings for character ${characterId}`);
    return bindingMap;
  }

  /**
   * Save a hotkey binding
   */
  async saveBinding(
    characterId: string,
    slotType: HotkeySlotType,
    slotIndex: number,
    itemId?: string,
    skillId?: string
  ): Promise<boolean> {
    // Validate: must have either item or skill, not both
    if (!itemId && !skillId) {
      // Clear the binding
      await query(
        `DELETE FROM hotkey_bindings WHERE "characterId" = $1 AND "slotType" = $2 AND "slotIndex" = $3`,
        [characterId, slotType, slotIndex]
      );

      // Update cache
      const bindings = this.characterBindings.get(characterId);
      if (bindings) {
        const key = `${slotType}_${slotIndex}`;
        bindings.delete(key);
      }

      console.log(`Cleared hotkey ${slotType}_${slotIndex} for character ${characterId}`);
      return true;
    }

    if (itemId && skillId) {
      console.error('Cannot bind both item and skill to same slot');
      return false;
    }

    // Validate item/skill exists
    if (itemId) {
      const itemResult = await query<Item>('SELECT * FROM items WHERE "id" = $1', [itemId]);
      if (!itemResult.rows[0]) {
        console.error(`Item not found: ${itemId}`);
        return false;
      }
    }

    if (skillId) {
      const skillResult = await query<Skill>('SELECT * FROM skills WHERE "id" = $1', [skillId]);
      if (!skillResult.rows[0]) {
        console.error(`Skill not found: ${skillId}`);
        return false;
      }
    }

    // Upsert binding
    await query(
      `INSERT INTO hotkey_bindings ("characterId", "slotType", "slotIndex", "itemId", "skillId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("characterId", "slotType", "slotIndex")
       DO UPDATE SET "itemId" = $4, "skillId" = $5, "updatedAt" = NOW()`,
      [characterId, slotType, slotIndex, itemId || null, skillId || null]
    );

    // Update cache
    let bindings = this.characterBindings.get(characterId);
    if (!bindings) {
      bindings = new Map();
      this.characterBindings.set(characterId, bindings);
    }

    const key = `${slotType}_${slotIndex}`;
    bindings.set(key, { slotIndex, slotType, itemId, skillId });

    console.log(`Saved hotkey ${slotType}_${slotIndex} for character ${characterId}`);
    return true;
  }

  /**
   * Get all bindings for a character
   */
  getBindings(characterId: string): Map<string, HotkeyBindingData> {
    let bindings = this.characterBindings.get(characterId);

    if (!bindings) {
      // Load from database
      bindings = new Map();
      // This will be async, so return empty map for now
      this.loadCharacterBindings(characterId);
    }

    return bindings;
  }

  /**
   * Get a specific binding
   */
  getBinding(characterId: string, slotType: HotkeySlotType, slotIndex: number): HotkeyBindingData | undefined {
    const bindings = this.getBindings(characterId);
    const key = `${slotType}_${slotIndex}`;
    return bindings.get(key);
  }

  /**
   * Use a hotkey
   */
  async useHotkey(
    characterId: string,
    slotType: HotkeySlotType,
    slotIndex: number
  ): Promise<{
    success: boolean;
    type: 'item' | 'skill' | null;
    id?: string;
    error?: string;
  }> {
    const binding = this.getBinding(characterId, slotType, slotIndex);

    if (!binding) {
      return { success: false, type: null, error: 'No binding for this slot' };
    }

    if (binding.itemId) {
      // Use item
      // TODO: Validate item is in character's inventory
      // TODO: Check item cooldown
      return {
        success: true,
        type: 'item',
        id: binding.itemId
      };
    }

    if (binding.skillId) {
      // Use skill
      // TODO: Validate character has learned skill
      // TODO: Check skill cooldown
      // TODO: Check MP cost
      return {
        success: true,
        type: 'skill',
        id: binding.skillId
      };
    }

    return { success: false, type: null, error: 'Invalid binding' };
  }

  /**
   * Clear all bindings for a character
   */
  async clearAllBindings(characterId: string): Promise<boolean> {
    await query(`DELETE FROM hotkey_bindings WHERE "characterId" = $1`, [characterId]);

    this.characterBindings.delete(characterId);

    console.log(`Cleared all hotkey bindings for character ${characterId}`);
    return true;
  }

  /**
   * Set default bindings for a new character
   */
  async setDefaultBindings(characterId: string): Promise<boolean> {
    // Common default bindings for new characters
    const defaults: Array<{ slotType: HotkeySlotType; slotIndex: number; skillId?: string; itemId?: string }> = [
      // HP Potion on slot 1
      { slotType: 'ONE_NINE', slotIndex: 0, itemId: 'POTION_HP_1' },
      // Basic attack on F1
      { slotType: 'F1_F8', slotIndex: 0, skillId: 'BASIC_ATTACK' }
    ];

    for (const def of defaults) {
      await this.saveBinding(characterId, def.slotType, def.slotIndex, def.itemId, def.skillId);
    }

    console.log(`Set default hotkey bindings for character ${characterId}`);
    return true;
  }

  /**
   * Remove character from cache (when disconnecting)
   */
  unloadCharacterBindings(characterId: string): void {
    this.characterBindings.delete(characterId);
  }

  /**
   * Get statistics
   */
  getStats(): { cachedCharacters: number } {
    return {
      cachedCharacters: this.characterBindings.size
    };
  }
}

export default HotkeyManager;
