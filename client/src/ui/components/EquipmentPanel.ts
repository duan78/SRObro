// ============================================
// SRObro - Equipment Panel
// Displays character equipment (paper doll) and stats
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Control
} from '@babylonjs/gui';

export interface EquipmentItem {
  id: string;
  itemId: string;
  name: string;
  plus: number;
  rarity: string;
  slot: 'weapon' | 'shield' | 'helmet' | 'chest' | 'shoulder' | 'legs' | 'boots' | 'ring1' | 'ring2' | 'necklace' | 'earring1' | 'earring2';
}

export interface CharacterStats {
  minAttack: number;
  maxAttack: number;
  minMagicAttack: number;
  maxMagicAttack: number;
  defense: number;
  magicDefense: number;
  critical: number;
  parry: number;
  block: number;
}

export class EquipmentPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  // Equipment slots
  private equipmentSlots: Map<string, Rectangle> = new Map();

  // Stats display
  private statsDisplay: Map<string, TextBlock> = new Map();

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('equipmentPanel');
    this.panel.width = '350px';
    this.panel.height = '600px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#8B7355'; // Brown/SRO style
    this.panel.thickness = 3;
    this.panel.background = 'rgba(20, 10, 5, 0.95)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel.paddingTop = '10px';
    this.panel.paddingBottom = '10px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Header
    const header = new Rectangle('equipmentHeader');
    header.width = '100%';
    header.height = '40px';
    header.cornerRadius = 5;
    header.color = '#D4AF37'; // Gold
    header.thickness = 2;
    header.background = 'rgba(0, 0, 0, 0.5)';

    const title = new TextBlock('equipmentTitle');
    title.text = 'EQUIPMENT';
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

    // Paper doll (equipment slots arranged in humanoid shape)
    const paperDoll = this.createPaperDoll();
    this.panel.addControl(paperDoll);

    // Stats section
    const statsSection = this.createStatsSection();
    this.panel.addControl(statsSection);

    this.guiTexture.addControl(this.panel);
    this.panel.isVisible = false;
  }

  private createPaperDoll(): StackPanel {
    const doll = new StackPanel('paperDoll');
    doll.width = '100%';
    doll.height = '350px';
    doll.isVertical = true;
    doll.spacing = 5;

    // Head (helmet)
    const headRow = this.createEquipmentRow('head', ['helmet']);
    doll.addControl(headRow);

    // Neck & shoulders (necklace + shoulder)
    const neckRow = this.createEquipmentRow('neck', ['necklace', 'shoulder']);
    doll.addControl(neckRow);

    // Body (chest)
    const chestRow = this.createEquipmentRow('chest', ['chest']);
    doll.addControl(chestRow);

    // Hands (weapon + shield)
    const handsRow = this.createEquipmentRow('hands', ['weapon', 'shield']);
    doll.addControl(handsRow);

    // Legs
    const legsRow = this.createEquipmentRow('legs', ['legs']);
    doll.addControl(legsRow);

    // Feet (boots + rings)
    const feetRow = this.createEquipmentRow('feet', ['boots', 'ring1', 'ring2']);
    doll.addControl(feetRow);

    // Accessories (earrings)
    const accRow = this.createEquipmentRow('accessories', ['earring1', 'earring2']);
    doll.addControl(accRow);

    return doll;
  }

  private createEquipmentRow(rowName: string, slotNames: string[]): Rectangle {
    const row = new Rectangle(`equip_row_${rowName}`);
    row.width = '100%';
    row.height = '50px';
    row.color = '#00000000';
    row.thickness = 0;
    row.paddingTop = '5px';
    row.paddingBottom = '5px';

    const stackPanel = new StackPanel(`equip_stack_${rowName}`);
    stackPanel.width = '100%';
    stackPanel.height = '100%';
    stackPanel.isVertical = false;
    stackPanel.spacing = 5;
    row.addControl(stackPanel);

    slotNames.forEach(slotName => {
      const slot = this.createEquipmentSlot(slotName);
      this.equipmentSlots.set(slotName, slot);
      stackPanel.addControl(slot);
    });

    return row;
  }

  private createEquipmentSlot(slotName: string): Rectangle {
    const slot = new Rectangle(`equip_slot_${slotName}`);
    slot.width = '50px';
    slot.height = '50px';
    slot.cornerRadius = 3;
    slot.color = '#6B5344'; // Darker brown
    slot.thickness = 2;
    slot.background = 'rgba(0, 0, 0, 0.3)';
    slot.paddingLeft = '5px';
    slot.paddingRight = '5px';
    slot.paddingTop = '5px';
    slot.paddingBottom = '5px';

    // Slot name abbreviation
    const abbreviations: Record<string, string> = {
      helmet: 'HLM',
      shield: 'SHD',
      chest: 'CHST',
      shoulder: 'SHL',
      legs: 'LGS',
      boots: 'BTS',
      ring1: 'R1',
      ring2: 'R2',
      necklace: 'NCK',
      earring1: 'ER1',
      earring2: 'ER2',
      weapon: 'WP'
    };

    const label = new TextBlock(`slot_label_${slotName}`);
    label.text = abbreviations[slotName] || slotName.toUpperCase().substring(0, 3);
    label.color = '#FFFFFF';
    label.fontSize = 10;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    label.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    slot.addControl(label);

    // Click handler
    slot.onPointerClickObservable.add(() => {
      this.onSlotClick(slotName);
    });

    return slot;
  }

  private createStatsSection(): Rectangle {
    const section = new Rectangle('statsSection');
    section.width = '100%';
    section.height = '200px';
    section.cornerRadius = 5;
    section.color = '#4a3728'; // Dark brown
    section.thickness = 2;
    section.background = 'rgba(0, 0, 0, 0.5)';
    section.paddingLeft = '10px';
    section.paddingRight = '10px';
    section.paddingTop = '10px';
    section.paddingBottom = '10px';

    const statsTitle = new TextBlock('statsTitle');
    statsTitle.text = 'CHARACTER STATS';
    statsTitle.color = '#D4AF37';
    statsTitle.fontSize = 16;
    statsTitle.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    section.addControl(statsTitle);

    // Attack power
    const attackLabel = new TextBlock('stat_attack');
    attackLabel.text = 'Attack: 0 - 0';
    attackLabel.color = '#FFFFFF';
    attackLabel.fontSize = 12;
    attackLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(attackLabel);
    this.statsDisplay.set('attack', attackLabel);

    // Magic attack
    const magicAttackLabel = new TextBlock('stat_magicAttack');
    magicAttackLabel.text = 'Magic Attack: 0 - 0';
    magicAttackLabel.color = '#87CEEB';
    magicAttackLabel.fontSize = 12;
    magicAttackLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(magicAttackLabel);
    this.statsDisplay.set('magicAttack', magicAttackLabel);

    // Defense
    const defenseLabel = new TextBlock('stat_defense');
    defenseLabel.text = 'Defense: 0';
    defenseLabel.color = '#FFFFFF';
    defenseLabel.fontSize = 12;
    defenseLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(defenseLabel);
    this.statsDisplay.set('defense', defenseLabel);

    // Magic defense
    const magicDefenseLabel = new TextBlock('stat_magicDefense');
    magicDefenseLabel.text = 'Magic Defense: 0';
    magicDefenseLabel.color = '#87CEEB';
    magicDefenseLabel.fontSize = 12;
    magicDefenseLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(magicDefenseLabel);
    this.statsDisplay.set('magicDefense', magicDefenseLabel);

    // Critical
    const criticalLabel = new TextBlock('stat_critical');
    criticalLabel.text = 'Critical: 0%';
    criticalLabel.color = '#FFD700';
    criticalLabel.fontSize = 12;
    criticalLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(criticalLabel);
    this.statsDisplay.set('critical', criticalLabel);

    // Parry
    const parryLabel = new TextBlock('stat_parry');
    parryLabel.text = 'Parry: 0%';
    parryLabel.color = '#FFD700';
    parryLabel.fontSize = 12;
    parryLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(parryLabel);
    this.statsDisplay.set('parry', parryLabel);

    // Block
    const blockLabel = new TextBlock('stat_block');
    blockLabel.text = 'Block: 0%';
    blockLabel.color = '#FFD700';
    blockLabel.fontSize = 12;
    blockLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    section.addControl(blockLabel);
    this.statsDisplay.set('block', blockLabel);

    return section;
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

  setEquipment(equipment: Record<string, EquipmentItem | null>): void {
    Object.entries(equipment).forEach(([slotName, item]) => {
      const slot = this.equipmentSlots.get(slotName);
      if (slot && item) {
        this.populateSlot(slotName, slot, item);
      } else if (slot) {
        this.clearSlot(slotName, slot);
      }
    });
  }

  updateStats(stats: CharacterStats): void {
    this.statsDisplay.get('attack')!.text = `Attack: ${stats.minAttack} - ${stats.maxAttack}`;
    this.statsDisplay.get('magicAttack')!.text = `Magic Attack: ${stats.minMagicAttack} - ${stats.maxMagicAttack}`;
    this.statsDisplay.get('defense')!.text = `Defense: ${stats.defense}`;
    this.statsDisplay.get('magicDefense')!.text = `Magic Defense: ${stats.magicDefense}`;
    this.statsDisplay.get('critical')!.text = `Critical: ${stats.critical}%`;
    this.statsDisplay.get('parry')!.text = `Parry: ${stats.parry}%`;
    this.statsDisplay.get('block')!.text = `Block: ${stats.block}%`;
  }

  // ============================================
  // SLOT MANAGEMENT
  // ============================================

  private populateSlot(slotName: string, slot: Rectangle, item: EquipmentItem): void {
    // Clear previous content
    const children = [...slot.children];
    children.forEach(child => {
      if (child.name !== `slot_label_${slotName}`) {
        child.dispose();
      }
    });

    // Item background
    const itemBg = new Rectangle(`item_bg_${slotName}`);
    itemBg.width = '40px';
    itemBg.height = '40px';
    itemBg.cornerRadius = 2;
    itemBg.color = '#6B5344';
    itemBg.thickness = 1;
    itemBg.background = 'rgba(0, 0, 0, 0.5)';
    slot.addControl(itemBg);

    // Plus indicator
    if (item.plus > 0) {
      const plusText = new TextBlock(`item_plus_${slotName}`);
      plusText.text = `+${item.plus}`;
      plusText.color = '#FFD700';
      plusText.fontSize = 10;
      plusText.fontWeight = 'bold';
      plusText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      plusText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      slot.addControl(plusText);
    }

    // Hover tooltip (simplified - would show full item stats)
    slot.onPointerEnterObservable.add(() => {
      itemBg.background = 'rgba(255, 215, 0, 0.3)';
    });

    slot.onPointerOutObservable.add(() => {
      itemBg.background = 'rgba(0, 0, 0, 0.5)';
    });
  }

  private clearSlot(slotName: string, slot: Rectangle): void {
    const children = [...slot.children];
    children.forEach(child => {
      if (child.name !== `slot_label_${slotName}`) {
        child.dispose();
      }
    });

    slot.background = 'rgba(0, 0, 0, 0.3)';
  }

  private onSlotClick(slotName: string): void {
    // TODO: Show item details, allow unequip
    console.log(`Equipment slot clicked: ${slotName}`);
  }

  dispose(): void {
    this.panel?.dispose();
    this.equipmentSlots.clear();
    this.statsDisplay.clear();
  }
}

export default EquipmentPanel;
