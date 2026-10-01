/**
 * SRObro - Hotkey Bar Component
 * 27 customizable hotkey slots (3 rows: F1-F8, 1-9, Ctrl+F1-F8, Alt+1-9)
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control,
  StackPanel
} from '@babylonjs/gui';

import type { HotkeyBinding, HotkeySlotType } from '../../../../shared/src/types';

export interface HotkeySlotData {
  slotIndex: number;
  slotType: HotkeySlotType;
  itemId?: string;
  skillId?: string;
  itemName?: string;
  skillName?: string;
  icon?: string;
  cooldown?: number;
  lastUsed?: number;
}

export class HotkeyBar {
  private panel: Rectangle | null = null;
  private slots: Map<string, Rectangle> = new Map();
  private slotData: Map<string, HotkeySlotData> = new Map();
  private cooldownOverlays: Map<string, Rectangle> = new Map();

  // Slot configuration
  private readonly rows = [
    { type: 'F1-F8' as HotkeySlotType, count: 8, labelPrefix: 'F' },
    { type: '1-9' as HotkeySlotType, count: 9, labelPrefix: '' },
    { type: 'ctrl_F1-F8' as HotkeySlotType, count: 8, labelPrefix: 'CF' },
    { type: 'alt_1-9' as HotkeySlotType, count: 9, labelPrefix: 'A' }
  ];

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel (bottom center, below current skill bar)
    this.panel = new Rectangle('hotkey_bar_panel');
    this.panel.width = '550px';
    this.panel.height = '140px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#4a3728'; // Dark brown
    this.panel.thickness = 2;
    this.panel.background = 'rgba(0,0,0,0.9)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.panel.paddingBottom = '78px'; // 8px marge + 70px au-dessus de l'ancienne barre
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';
    this.panel.paddingTop = '8px';

    this.guiTexture.addControl(this.panel);

    // Create rows
    let yOffset = 0;
    this.rows.forEach((rowConfig, rowIndex) => {
      const rowPanel = this.createRow(rowConfig, rowIndex);
      rowPanel.top = `${yOffset}px`;
      this.panel.addControl(rowPanel);
      yOffset += 35; // 32px slot height + 3px spacing
    });
  }

  private createRow(rowConfig: { type: HotkeySlotType; count: number; labelPrefix: string }, rowIndex: number): StackPanel {
    const row = new StackPanel(`hotkey_row_${rowIndex}`);
    row.width = '100%';
    row.height = '32px';
    row.isVertical = false;
    row.spacing = 4;

    // Create slots for this row
    for (let i = 0; i < rowConfig.count; i++) {
      const slotKey = `${rowConfig.type}_${i}`;
      const slot = this.createSlot(slotKey, rowConfig, i);
      this.slots.set(slotKey, slot);
      row.addControl(slot);
    }

    return row;
  }

  private createSlot(slotKey: string, rowConfig: { type: HotkeySlotType; count: number; labelPrefix: string }, index: number): Rectangle {
    const slot = new Rectangle(`hotkey_slot_${slotKey}`);
    slot.width = '52px';
    slot.height = '32px';
    slot.cornerRadius = 4;
    slot.color = '#6B5344';
    slot.thickness = 1;
    slot.background = 'rgba(0,0,0,0.5)';

    // Hotkey label
    let hotkeyLabel = '';
    if (rowConfig.type === 'F1-F8') {
      hotkeyLabel = `F${index + 1}`;
    } else if (rowConfig.type === '1-9') {
      hotkeyLabel = `${index + 1}`;
    } else if (rowConfig.type === 'ctrl_F1-F8') {
      hotkeyLabel = `^F${index + 1}`;
    } else if (rowConfig.type === 'alt_1-9') {
      hotkeyLabel = `@${index + 1}`;
    }

    const label = new TextBlock(`hotkey_label_${slotKey}`, hotkeyLabel);
    label.color = '#FFD700';
    label.fontSize = 9;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    slot.addControl(label);

    // Icon placeholder
    const icon = new Rectangle(`hotkey_icon_${slotKey}`);
    icon.width = '36px';
    icon.height = '20px';
    icon.cornerRadius = 2;
    icon.color = '#00000000';
    icon.thickness = 1;
    icon.background = 'rgba(100,100,100,0.3)';
    icon.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    slot.addControl(icon);

    // Cooldown overlay
    const cooldownOverlay = new Rectangle(`hotkey_cd_${slotKey}`);
    cooldownOverlay.width = '100%';
    cooldownOverlay.height = '100%';
    cooldownOverlay.cornerRadius = 4;
    cooldownOverlay.color = '#00000000';
    cooldownOverlay.thickness = 0;
    cooldownOverlay.background = 'rgba(0,0,0,0.7)';
    cooldownOverlay.alpha = 0;
    cooldownOverlay.isVisible = false;
    cooldownOverlay.isHitTestVisible = false;
    slot.addControl(cooldownOverlay);

    this.cooldownOverlays.set(slotKey, cooldownOverlay);

    // Click handlers
    slot.onPointerClickObservable.add(() => {
      this.onSlotClick(slotKey);
    });

    slot.onPointerDownObservable.add((info) => {
      // Left click = use, Right click = clear
      if (info.buttonIndex === 2) { // Right click
        this.clearSlot(slotKey);
      }
    });

    return slot;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Set hotkey binding
   */
  setBinding(slotKey: string, data: HotkeySlotData): void {
    this.slotData.set(slotKey, data);
    this.updateSlotVisual(slotKey, data);
  }

  /**
   * Clear a slot
   */
  clearSlot(slotKey: string): void {
    this.slotData.delete(slotKey);

    const icon = this.guiTexture.getControlByName(`hotkey_icon_${slotKey}`) as Rectangle;
    if (icon) {
      icon.background = 'rgba(100,100,100,0.3)';
    }

    console.log(`Cleared slot: ${slotKey}`);
  }

  /**
   * Get all bindings
   */
  getAllBindings(): HotkeyBinding[] {
    const bindings: HotkeyBinding[] = [];

    this.slotData.forEach((data, slotKey) => {
      const [type, indexStr] = slotKey.split('_');
      bindings.push({
        slotIndex: parseInt(indexStr),
        slotType: type as HotkeySlotType,
        itemId: data.itemId,
        skillId: data.skillId
      });
    });

    return bindings;
  }

  /**
   * Use hotkey by key
   */
  useHotkey(slotType: HotkeySlotType, index: number): void {
    const slotKey = `${slotType}_${index}`;
    const data = this.slotData.get(slotKey);

    if (!data) {
      console.log(`No binding for: ${slotKey}`);
      return;
    }

    // Check cooldown
    if (data.cooldown && data.lastUsed) {
      const elapsed = Date.now() - data.lastUsed;
      if (elapsed < data.cooldown) {
        console.log(`${slotKey} is on cooldown`);
        return;
      }
    }

    // Use item/skill
    const guiAny = this.guiTexture as any;
    if (data.skillId) {
      console.log(`Using skill: ${data.skillName} (${data.skillId})`);
      guiAny.onSkillUseObservable?.notifyObservers({
        skillId: data.skillId,
        name: data.skillName
      });
    } else if (data.itemId) {
      console.log(`Using item: ${data.itemName} (${data.itemId})`);
      guiAny.onInventoryUseObservable?.notifyObservers({
        itemId: data.itemId,
        name: data.itemName
      });
    }

    // Update last used
    if (data.cooldown) {
      data.lastUsed = Date.now();
      this.startCooldown(slotKey, data.cooldown);
    }
  }

  /**
   * Update cooldowns (call every frame)
   */
  updateCooldowns(): void {
    const now = Date.now();

    this.slotData.forEach((data, slotKey) => {
      if (data.cooldown && data.lastUsed) {
        const elapsed = now - data.lastUsed;
        const remaining = Math.max(0, data.cooldown - elapsed);

        const overlay = this.cooldownOverlays.get(slotKey);
        if (overlay) {
          if (remaining > 0) {
            const percentage = remaining / data.cooldown;
            overlay.height = `${percentage * 100}%`;
            overlay.isVisible = true;
            overlay.alpha = 0.7;
          } else {
            overlay.isVisible = false;
          }
        }
      }
    });
  }

  /**
   * Toggle visibility
   */
  toggle(): void {
    if (this.panel) {
      this.panel.isVisible = !this.panel.isVisible;
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private updateSlotVisual(slotKey: string, data: HotkeySlotData): void {
    const icon = this.guiTexture.getControlByName(`hotkey_icon_${slotKey}`) as Rectangle;
    if (!icon) return;

    // Update icon background based on type
    if (data.skillId) {
      icon.background = 'rgba(139,0,0,0.5)'; // Red for skills
      icon.color = '#8B0000';
    } else if (data.itemId) {
      icon.background = 'rgba(0,100,0,0.5)'; // Green for items
      icon.color = '#006400';
    }
  }

  private onSlotClick(slotKey: string): void {
    // Get row and index from slotKey
    const [type, indexStr] = slotKey.split('_');
    const index = parseInt(indexStr);

    this.useHotkey(type as HotkeySlotType, index);
  }

  private startCooldown(slotKey: string, cooldown: number): void {
    const overlay = this.cooldownOverlays.get(slotKey);
    if (overlay) {
      overlay.isVisible = true;
      overlay.height = '100%';
      overlay.alpha = 0.7;
    }
  }

  dispose(): void {
    this.panel?.dispose();
    this.slots.clear();
    this.cooldownOverlays.clear();
    this.slotData.clear();
  }
}

export default HotkeyBar;
