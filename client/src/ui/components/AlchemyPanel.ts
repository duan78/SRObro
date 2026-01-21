// ============================================
// SRObro - Alchemy Panel
// Interface for equipment enhancement (+1 to +12)
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Control,
  ComboBox
} from '@babylonjs/gui';

export interface AlchemyItem {
  id: string;
  itemId: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  plus: number;
  maxPlus: number;
  rarity: string;
}

export class AlchemyPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  // UI elements
  private itemSlot: Rectangle | null = null;
  private elixirSelector: ComboBox | null = null;
  private luckyPowderSelector: ComboBox | null = null;
  private successRateText: TextBlock | null = null;
  private enhanceButton: Button | null = null;

  // Current item being enhanced
  private currentItem: AlchemyItem | null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('alchemyPanel');
    this.panel.width = '350px';
    this.panel.height = '450px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#8B7355';
    this.panel.thickness = 3;
    this.panel.background = 'rgba(20, 10, 5, 0.95)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel.paddingTop = '10px';
    this.panel.paddingBottom = '10px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Header
    const header = new Rectangle('alchemyHeader');
    header.width = '100%';
    header.height = '40px';
    header.cornerRadius = 5;
    header.color = '#D4AF37';
    header.thickness = 2;
    header.background = 'rgba(0, 0, 0, 0.5)';

    const title = new TextBlock('alchemyTitle');
    title.text = 'ALCHEMY';
    title.color = '#FFFFFF';
    title.fontSize = 20;
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    header.addControl(title);

    // Close button
    const closeButton = Button.CreateSimpleButton('closeAlchemy', 'X');
    closeButton.width = '30px';
    closeButton.height = '30px';
    closeButton.color = '#8B0000';
    closeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    closeButton.onPointerUpObservable.add(() => {
      this.hide();
    });
    header.addControl(closeButton);

    this.panel.addControl(header);

    // Content
    const contentStack = new StackPanel('alchemyContent');
    contentStack.width = '100%';
    contentStack.height = '360px';
    contentStack.isVertical = true;
    contentStack.spacing = 10;
    this.panel.addControl(contentStack);

    // Item slot
    contentStack.addControl(this.createItemSection());

    // Elixir selector
    contentStack.addControl(this.createElixirSelector());

    // Lucky powder selector
    contentStack.addControl(this.createLuckyPowderSelector());

    // Success rate display
    contentStack.addControl(this.createSuccessRateDisplay());

    // Enhance button
    contentStack.addControl(this.createEnhanceButton());

    this.guiTexture.addControl(this.panel);
    this.panel.isVisible = false;
  }

  private createItemSection(): Rectangle {
    const section = new Rectangle('itemSection');
    section.width = '100%';
    section.height = '80px';
    section.cornerRadius = 5;
    section.color = '#4a3728';
    section.thickness = 2;
    section.background = 'rgba(0, 0, 0, 0.3)';
    section.paddingLeft = '10px';
    section.paddingRight = '10px';
    section.paddingTop = '10px';
    section.paddingBottom = '10px';

    const label = new TextBlock('itemLabel');
    label.text = 'Item to Enhance:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(label);

    this.itemSlot = new Rectangle('alchemyItemSlot');
    this.itemSlot.width = '60px';
    this.itemSlot.height = '60px';
    this.itemSlot.cornerRadius = 3;
    this.itemSlot.color = '#6B5344';
    this.itemSlot.thickness = 2;
    this.itemSlot.background = 'rgba(0, 0, 0, 0.3)';
    this.itemSlot.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    section.addControl(this.itemSlot);

    return section;
  }

  private createElixirSelector(): Rectangle {
    const section = new Rectangle('elixirSection');
    section.width = '100%';
    section.height = '60px';
    section.color = '#00000000';
    section.thickness = 0;

    const label = new TextBlock('elixirLabel');
    label.text = 'Elixir:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(label);

    // Create ComboBox for elixir selection
    this.elixirSelector = new ComboBox('elixirSelector');
    this.elixirSelector.width = '200px';
    this.elixirSelector.height = '40px';
    this.elixirSelector.color = '#FFFFFF';
    this.elixirSelector.background = '#6B5344';
    this.elixirSelector.placeholderText = 'Select Elixir';
    this.elixirSelector.options = [
      { label: 'Weapon Elixir', data: 'weapon_elixir' },
      { label: 'Armor Elixir', data: 'armor_elixir' },
      { label: 'Accessory Elixir', data: 'accessory_elixir' }
    ];
    section.addControl(this.elixirSelector);

    return section;
  }

  private createLuckyPowderSelector(): Rectangle {
    const section = new Rectangle('luckyPowderSection');
    section.width = '100%';
    section.height = '60px';
    section.color = '#00000000';
    section.thickness = 0;

    const label = new TextBlock('powderLabel');
    label.text = 'Lucky Powder:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(label);

    // Create ComboBox for lucky powder selection
    this.luckyPowderSelector = new ComboBox('luckyPowderSelector');
    this.luckyPowderSelector.width = '200px';
    this.luckyPowderSelector.height = '40px';
    this.luckyPowderSelector.color = '#FFFFFF';
    this.luckyPowderSelector.background = '#6B5344';
    this.luckyPowderSelector.placeholderText = 'Select Powder';
    this.luckyPowderSelector.options = [
      { label: 'None', data: null },
      { label: 'Lucky Powder (Grade D)', data: 'powder_d' },
      { label: 'Lucky Powder (Grade C)', data: 'powder_c' },
      { label: 'Lucky Powder (Grade B)', data: 'powder_b' },
      { label: 'Lucky Powder (Grade A)', data: 'powder_a' }
    ];
    section.addControl(this.luckyPowderSelector);

    return section;
  }

  private createSuccessRateDisplay(): Rectangle {
    const section = new Rectangle('successRateSection');
    section.width = '100%';
    section.height = '60px';
    section.cornerRadius = 5;
    section.color = '#4a3728';
    section.thickness = 2;
    section.background = 'rgba(0, 0, 0, 0.3)';
    section.paddingLeft = '10px';
    section.paddingRight = '10px';
    section.paddingTop = '10px';
    section.paddingBottom = '10px';

    const label = new TextBlock('successLabel');
    label.text = 'Success Rate:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(label);

    this.successRateText = new TextBlock('successRate');
    this.successRateText.text = '0%';
    this.successRateText.color = '#00FF00';
    this.successRateText.fontSize = 18;
    this.successRateText.fontWeight = 'bold';
    this.successRateText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.successRateText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    section.addControl(this.successRateText);

    return section;
  }

  private createEnhanceButton(): Button {
    this.enhanceButton = Button.CreateSimpleButton('enhanceBtn', 'ENHANCE');
    this.enhanceButton.width = '200px';
    this.enhanceButton.height = '50px';
    this.enhanceButton.color = '#D4AF37';
    this.enhanceButton.background = '#4a3728';
    this.enhanceButton.fontSize = 16;
    this.enhanceButton.onPointerUpObservable.add(() => {
      this.onEnhance();
    });
    return this.enhanceButton;
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

  setItem(item: AlchemyItem): void {
    this.currentItem = item;

    // Update item slot visual
    if (this.itemSlot) {
      this.itemSlot.color = '#8B0000'; // Red for item
      this.itemSlot.background = 'rgba(139, 0, 0, 0.3)';

      // Show item info
      const itemText = new TextBlock('alchemyItemName');
      itemText.text = `${item.name} +${item.plus}`;
      itemText.color = '#FFFFFF';
      itemText.fontSize = 10;
      itemText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      itemText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      this.itemSlot.addControl(itemText);
    }

    this.updateSuccessRate();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private updateSuccessRate(): void {
    if (!this.currentItem || !this.successRateText) return;

    const item = this.currentItem;
    const currentPlus = item.plus;

    // Base success rates
    let baseRate = 0;
    if (currentPlus < 5) {
      baseRate = 100; // +1 to +5 always success
    } else {
      switch (item.type) {
        case 'weapon':
          baseRate = [60, 50, 40, 30, 20, 10, 5][currentPlus - 5] || 0;
          break;
        case 'armor':
          baseRate = [70, 60, 50, 40, 30, 20, 10][currentPlus - 5] || 0;
          break;
        case 'accessory':
          baseRate = [65, 55, 45, 35, 25, 15, 10][currentPlus - 5] || 0;
          break;
      }
    }

    // Add lucky powder bonus
    const powderBonus = this.getLuckyPowderBonus();

    const finalRate = Math.min(100, baseRate + powderBonus);
    this.successRateText.text = `${finalRate}%`;

    // Color code based on success rate
    if (finalRate >= 70) {
      this.successRateText.color = '#00FF00'; // Green
    } else if (finalRate >= 40) {
      this.successRateText.color = '#FFFF00'; // Yellow
    } else {
      this.successRateText.color = '#FF0000'; // Red
    }
  }

  private getLuckyPowderBonus(): number {
    return 0; // Simplified for now
  }

  private onEnhance(): void {
    if (!this.currentItem || !this.successRateText) {
      this.showNotification('No item selected!', '#FF0000');
      return;
    }

    // Validate item can be enhanced
    if (this.currentItem.plus >= this.currentItem.maxPlus) {
      this.showNotification('Item is at max enhancement!', '#FF0000');
      return;
    }

    // Calculate result (simplified - would be server-side)
    const baseRate = parseFloat(this.successRateText.text);
    const roll = Math.random() * 100;

    const guiAny = this.guiTexture as any;

    if (roll <= baseRate) {
      // Success
      this.currentItem.plus++;
      this.showNotification(`Success! Item is now +${this.currentItem.plus}`, '#00FF00');
      this.setItem(this.currentItem);
      guiAny.onAlchemySuccessObservable?.notifyObservers(this.currentItem);
    } else {
      // Fail
      this.showNotification('Enhancement failed!', '#FF0000');

      // Check for destruction (> +6 without protector)
      if (this.currentItem.plus >= 6) {
        const destructionChance = 0.5;
        if (Math.random() < destructionChance) {
          this.showNotification('Item was destroyed!', '#FF0000');
          this.currentItem = null;
          this.clearItemSlot();
        }
      }

      guiAny.onAlchemyFailObservable?.notifyObservers(this.currentItem);
    }
  }

  private showNotification(message: string, color: string): void {
    console.log(`[Alchemy] ${message}`);
  }

  private clearItemSlot(): void {
    if (!this.itemSlot) return;

    const children = [...this.itemSlot.children];
    children.forEach(child => {
      if (child.name !== 'alchemyItemSlot') {
        child.dispose();
      }
    });
  }

  dispose(): void {
    this.panel?.dispose();
  }

  private showNotification(message: string, color: string): void {
    // Reuse UIManager's notification or create simple popup
    console.log(`[Alchemy] ${message}`);
    // TODO: Show in-game notification
  }

  private clearItemSlot(): void {
    if (!this.itemSlot) return;

    const children = [...this.itemSlot.children];
    children.forEach(child => {
      if (child.name !== 'alchemyItemSlot') {
        child.dispose();
      }
    });
  }
}

export default AlchemyPanel;
