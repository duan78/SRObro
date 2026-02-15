// ============================================
// SRObro - Inventory Panel
// Displays character inventory with drag-drop support
// ============================================

// @ts-nocheck
import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  ScrollViewer,
  Control
} from '@babylonjs/gui';

export interface InventoryItem {
  id: string;
  itemId: string;
  slot: number;
  quantity: number;
  plus: number;
  name: string;
  iconId?: string;
  rarity: string;
  type: string;
}

export class InventoryPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;
  private inventoryGrid: StackPanel | null = null;
  private slots: Map<number, Rectangle> = new Map();
  private selectedItem: number | null = null;

  // Callbacks
  private onItemUse: (item: InventoryItem) => void = () => {};
  private onItemEquip: (item: InventoryItem) => void = () => {};
  private onItemDrop: (item: InventoryItem) => void = () => {};

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('inventoryPanel');
    this.panel.width = '400px';
    this.panel.height = '500px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#8B7355'; // Brown/SRO style
    this.panel.thickness = 3;
    this.panel.background = 'rgba(20, 10, 5, 0.95)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.panel.paddingTop = '10px';
    this.panel.paddingBottom = '10px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Header
    const header = new Rectangle('inventoryHeader');
    header.width = '100%';
    header.height = '40px';
    header.cornerRadius = 5;
    header.color = '#D4AF37'; // Gold
    header.thickness = 2;
    header.background = 'rgba(0, 0, 0, 0.5)';

    const title = new TextBlock('inventoryTitle');
    title.text = 'INVENTORY';
    title.color = '#FFFFFF';
    title.fontSize = 20;
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    header.addControl(title);

    // Close button
    const closeButton = Button.CreateSimpleButton('closeInventory', 'X');
    closeButton.width = '30px';
    closeButton.height = '30px';
    closeButton.color = '#8B0000';
    closeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    closeButton.onPointerUpObservable.add(() => {
      this.hide();
    });
    header.addControl(closeButton);

    this.panel.addControl(header);

    // Gold display
    const goldDisplay = this.createGoldDisplay();
    this.panel.addControl(goldDisplay);

    // Weight display
    const weightDisplay = this.createWeightDisplay();
    this.panel.addControl(weightDisplay);

    // Inventory grid (5x9 = 45 slots)
    const scrollViewer = new ScrollViewer('inventoryScroll');
    scrollViewer.width = '380px';
    scrollViewer.height = '350px';
    scrollViewer.thickness = 2;
    scrollViewer.color = '#000000';
    this.panel.addControl(scrollViewer);

    this.inventoryGrid = new StackPanel('inventoryGrid');
    this.inventoryGrid.width = '100%';
    this.inventoryGrid.isVertical = false;
    // this.inventoryGrid.wrapPanel = true; // wrapPanel is not a standard property of StackPanel in GUI 2D
    scrollViewer.addControl(this.inventoryGrid);

    // Create 45 slots
    for (let i = 0; i < 45; i++) {
      const slot = this.createSlot(i);
      this.inventoryGrid.addControl(slot);
      this.slots.set(i, slot);
    }

    // Context menu (hidden by default)
    this.createContextMenu();

    this.guiTexture.addControl(this.panel);
    this.panel.isVisible = false;
  }

  private createGoldDisplay(): Rectangle {
    const display = new Rectangle('goldDisplay');
    display.width = '100%';
    display.height = '30px';
    display.color = '#00000000';
    display.thickness = 0;

    const label = new TextBlock('goldLabel');
    label.text = 'Gold: 0';
    label.color = '#FFD700';
    label.fontSize = 16;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    display.addControl(label);

    return display;
  }

  private createWeightDisplay(): Rectangle {
    const display = new Rectangle('weightDisplay');
    display.width = '100%';
    display.height = '30px';
    display.color = '#00000000';
    display.thickness = 0;

    const label = new TextBlock('weightLabel');
    label.text = 'Weight: 0/100';
    label.color = '#FFFFFF';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    display.addControl(label);

    return display;
  }

  private createSlot(slotIndex: number): Rectangle {
    const slot = new Rectangle(`inv_slot_${slotIndex}`);
    slot.width = '60px';
    slot.height = '60px';
    slot.cornerRadius = 3;
    slot.color = '#6B5344'; // Darker brown
    slot.thickness = 2;
    slot.background = 'rgba(0, 0, 0, 0.3)';
    slot.paddingLeft = '5px';
    slot.paddingRight = '5px';
    slot.paddingTop = '5px';
    slot.paddingBottom = '5px';

    // Slot number
    const number = new TextBlock(`slot_num_${slotIndex}`);
    number.text = `${slotIndex + 1}`;
    number.color = '#FFFFFF';
    number.fontSize = 10;
    number.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    number.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    slot.addControl(number);

    // Click handler
    slot.onPointerClickObservable.add(() => {
      this.onSlotClick(slotIndex);
    });

    // Right-click handler
    slot.onPointerDownObservable.add((info: any) => {
      // type is not standard on Vector2WithInfo, checking for button index or similar
      if (info.buttonIndex === 2) { // Standard for right click in some Babylon versions
        this.onSlotRightClick(slotIndex);
      }
    });

    return slot;
  }

  private createContextMenu(): void {
    const menu = new Rectangle('inventoryContextMenu');
    menu.width = '150px';
    menu.height = '120px';
    menu.cornerRadius = 5;
    menu.color = '#8B7355';
    menu.thickness = 2;
    menu.background = 'rgba(0, 0, 0, 0.95)';
    menu.isVisible = false;

    const menuStack = new StackPanel('contextMenuStack');
    menuStack.width = '100%';
    menuStack.isVertical = true;
    menu.addControl(menuStack);

    // Menu items
    const useBtn = Button.CreateSimpleButton('menuUse', 'Use');
    useBtn.height = '30px';
    useBtn.onPointerUpObservable.add(() => {
      this.onContextMenuItemSelected('use');
      menu.isVisible = false;
    });
    menuStack.addControl(useBtn);

    const equipBtn = Button.CreateSimpleButton('menuEquip', 'Equip');
    equipBtn.height = '30px';
    equipBtn.onPointerUpObservable.add(() => {
      this.onContextMenuItemSelected('equip');
      menu.isVisible = false;
    });
    menuStack.addControl(equipBtn);

    const dropBtn = Button.CreateSimpleButton('menuDrop', 'Drop');
    dropBtn.height = '30px';
    dropBtn.onPointerUpObservable.add(() => {
      this.onContextMenuItemSelected('drop');
      menu.isVisible = false;
    });
    menuStack.addControl(dropBtn);

    this.guiTexture.addControl(menu);
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  show(): void {
    if (this.panel) {
      this.panel.isVisible = true;
      this.isVisible = true;
    }
  }

  hide(): void {
    if (this.panel) {
      this.panel.isVisible = false;
      this.isVisible = false;
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  setItems(items: InventoryItem[]): void {
    // Clear all slots
    this.slots.forEach((slot, index) => {
      this.clearSlot(index);
    });

    // Populate with items
    items.forEach(item => {
      if (item.slot >= 0 && item.slot < 45) {
        this.populateSlot(item.slot, item);
      }
    });
  }

  setGold(amount: number): void {
    const goldLabel = this.guiTexture.getControlByName('goldLabel') as TextBlock;
    if (goldLabel) {
      goldLabel.text = `Gold: ${amount.toLocaleString()}`;
    }
  }

  setWeight(current: number, max: number): void {
    const weightLabel = this.guiTexture.getControlByName('weightLabel') as TextBlock;
    if (weightLabel) {
      weightLabel.text = `Weight: ${current}/${max}`;
    }
  }

  // ============================================
  // SLOT MANAGEMENT
  // ============================================

  private clearSlot(slotIndex: number): void {
    const slot = this.slots.get(slotIndex);
    if (!slot) return;

    // Remove all controls except slot number
    const children = [...slot.children];
    children.forEach(child => {
      if (child.name !== `slot_num_${slotIndex}`) {
        child.dispose();
      }
    });
  }

  private populateSlot(slotIndex: number, item: InventoryItem): void {
    const slot = this.slots.get(slotIndex);
    if (!slot) return;

    this.clearSlot(slotIndex);

    // Item icon/background
    const itemBg = new Rectangle(`item_bg_${slotIndex}`);
    itemBg.width = '50px';
    itemBg.height = '50px';
    itemBg.cornerRadius = 3;

    // Color based on rarity
    const rarityColors = {
      common: '#808080',
      rare: '#0070DD',
      legendary: '#A335EE',
      unique: '#FF8000'
    };
    itemBg.color = rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.common;
    itemBg.thickness = 1;
    itemBg.background = 'rgba(0, 0, 0, 0.5)';
    slot.addControl(itemBg);

    // Quantity text
    if (item.quantity > 1) {
      const qtyText = new TextBlock(`item_qty_${slotIndex}`, `${item.quantity}`, {
        color: '#FFFFFF',
        fontSize: 12
      });
      qtyText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      qtyText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      slot.addControl(qtyText);
    }

    // Plus indicator
    if (item.plus > 0) {
      const plusText = new TextBlock(`item_plus_${slotIndex}`, `+${item.plus}`, {
        color: '#FFD700',
        fontSize: 10,
        fontStyle: 'bold'
      });
      plusText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      plusText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      slot.addControl(plusText);
    }
  }

  // ============================================
  // INTERACTION HANDLERS
  // ============================================

  private onSlotClick(slotIndex: number): void {
    // Clear previous selection
    if (this.selectedItem !== null) {
      const prevSlot = this.slots.get(this.selectedItem);
      if (prevSlot) {
        prevSlot.color = '#6B5344';
      }
    }

    // Select new slot
    this.selectedItem = slotIndex;
    const slot = this.slots.get(slotIndex);
    if (slot) {
      slot.color = '#FFD700'; // Gold highlight
    }

    // TODO: Show item tooltip
  }

  private onSlotRightClick(slotIndex: number): void {
    this.selectedItem = slotIndex;

    // Show context menu at mouse position
    const menu = this.guiTexture.getControlByName('inventoryContextMenu') as Rectangle;
    if (menu) {
      menu.isVisible = true;
      // TODO: Position menu at mouse pointer
    }
  }

  private onContextMenuItemSelected(action: string): void {
    if (this.selectedItem === null) return;

    // TODO: Get item data and execute action
    switch (action) {
      case 'use':
        // this.onItemUse(item);
        break;
      case 'equip':
        // this.onItemEquip(item);
        break;
      case 'drop':
        // this.onItemDrop(item);
        break;
    }
  }

  // ============================================
  // CALLBACK REGISTRATION
  // ============================================

  setOnItemUse(callback: (item: InventoryItem) => void): void {
    this.onItemUse = callback;
  }

  setOnItemEquip(callback: (item: InventoryItem) => void): void {
    this.onItemEquip = callback;
  }

  setOnItemDrop(callback: (item: InventoryItem) => void): void {
    this.onItemDrop = callback;
  }

  dispose(): void {
    this.panel?.dispose();
    this.slots.clear();
  }
}

export default InventoryPanel;
