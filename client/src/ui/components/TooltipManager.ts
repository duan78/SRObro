/**
 * SRObro - Tooltip Manager
 * Manages display of tooltips for items, skills, and entities
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control,
  Observable
} from '@babylonjs/gui';

import type {
  ItemTooltipData,
  SkillTooltipData,
  EntityTooltipData,
  ItemRarity,
  ItemType
} from '@srobro/shared';

export class TooltipManager {
  private currentTooltip: Rectangle | null = null;
  private hoverTimeout: NodeJS.Timeout | null = null;
  private isVisible: boolean = false;
  private lastHoverTarget: Control | null = null;

  // Tooltip configuration
  private config = {
    delay: 300, // milliseconds before showing
    maxWidth: 300,
    padding: 10
  };

  // Rarity colors (SRO-style)
  private readonly rarityColors: Record<ItemRarity, string> = {
    common: '#FFFFFF',      // White
    rare: '#00FF00',        // Green
    legendary: '#0070DD',   // Blue
    unique: '#FF8000'       // Orange
  };

  // Type colors
  private readonly typeColors: Record<ItemType, string> = {
    weapon: '#FF0000',
    shield: '#FF0000',
    helmet: '#FF0000',
    chest: '#FF0000',
    shoulder: '#FF0000',
    legs: '#FF0000',
    boots: '#FF0000',
    ring: '#0070DD',
    necklace: '#0070DD',
    earring: '#0070DD',
    potion: '#FF8000',
    skill: '#800080',
    material: '#9D9D9D',
    quest: '#FFFF00',
    amm: '#9D9D9D',
    arrow: '#9D9D9D',
    bolt: '#9D9D9D',
    general: '#FFFFFF'
  };

  constructor(private guiTexture: AdvancedDynamicTexture) {}

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Register hover handler for a control
   */
  registerItemTooltip(control: Control, data: ItemTooltipData): void {
    control.onPointerEnterObservable.add(() => {
      this.scheduleTooltip(() => this.showItemTooltip(data), control);
    });

    control.onPointerOutObservable.add(() => {
      this.hideTooltip();
    });
  }

  registerSkillTooltip(control: Control, data: SkillTooltipData): void {
    control.onPointerEnterObservable.add(() => {
      this.scheduleTooltip(() => this.showSkillTooltip(data), control);
    });

    control.onPointerOutObservable.add(() => {
      this.hideTooltip();
    });
  }

  registerEntityTooltip(control: Control, data: EntityTooltipData): void {
    control.onPointerEnterObservable.add(() => {
      this.scheduleTooltip(() => this.showEntityTooltip(data), control);
    });

    control.onPointerOutObservable.add(() => {
      this.hideTooltip();
    });
  }

  /**
   * Show item tooltip
   */
  showItemTooltip(data: ItemTooltipData): void {
    if (this.isVisible) return;

    // Create tooltip container
    const tooltip = this.createTooltipContainer();
    this.currentTooltip = tooltip;

    // Item name (colored by rarity)
    const nameText = new TextBlock('item_name', data.name);
    nameText.color = this.rarityColors[data.rarity];
    nameText.fontSize = 14;
    nameText.fontWeight = 'bold';
    nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    nameText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    tooltip.addControl(nameText);

    let yOffset = 25;

    // Type and required level
    const typeText = new TextBlock('item_type', `${this.formatItemType(data.type)} (Lv.${data.requiredLevel})`);
    typeText.color = '#AAAAAA';
    typeText.fontSize = 11;
    typeText.top = `${yOffset}px`;
    tooltip.addControl(typeText);
    yOffset += 18;

    // Plus indicator
    if (data.plus > 0) {
      const plusText = new TextBlock('item_plus', `+${data.plus}`);
      plusText.color = data.plus >= 9 ? '#FF0000' : '#00FF00';
      plusText.fontSize = 12;
      plusText.fontWeight = 'bold';
      plusText.top = `${yOffset}px`;
      tooltip.addControl(plusText);
      yOffset += 18;
    }

    // Separator
    this.addSeparator(tooltip, yOffset);
    yOffset += 8;

    // Stats
    if (data.stats) {
      if (data.stats.attackPower) {
        this.addStatLine(tooltip, yOffset, 'Attack', `${data.stats.attackPower.min}-${data.stats.attackPower.max}`);
        yOffset += 16;
      }
      if (data.stats.magicalAttack) {
        this.addStatLine(tooltip, yOffset, 'Magical Attack', `${data.stats.magicalAttack.min}-${data.stats.magicalAttack.max}`);
        yOffset += 16;
      }
      if (data.stats.defense) {
        this.addStatLine(tooltip, yOffset, 'Defense', data.stats.defense.toString());
        yOffset += 16;
      }
      if (data.stats.magicalDefense) {
        this.addStatLine(tooltip, yOffset, 'Magical Defense', data.stats.magicalDefense.toString());
        yOffset += 16;
      }
      if (data.stats.str) {
        this.addStatLine(tooltip, yOffset, 'STR', `+${data.stats.str}`);
        yOffset += 16;
      }
      if (data.stats.int) {
        this.addStatLine(tooltip, yOffset, 'INT', `+${data.stats.int}`);
        yOffset += 16;
      }
      if (data.stats.critical) {
        this.addStatLine(tooltip, yOffset, 'Critical', `+${data.stats.critical}%`);
        yOffset += 16;
      }
    }

    // Durability
    if (data.durability >= 0) {
      const durText = new TextBlock('durability', `Durability: ${data.durability}/${data.maxDurability}`);
      durText.color = data.durability < data.maxDurability * 0.3 ? '#FF0000' : '#FFFFFF';
      durText.fontSize = 10;
      durText.top = `${yOffset}px`;
      tooltip.addControl(durText);
      yOffset += 18;
    }

    // Sockets
    if (data.sockets.length > 0) {
      this.addSeparator(tooltip, yOffset);
      yOffset += 8;
      const socketText = new TextBlock('sockets', `Sockets: ${data.sockets.length}`);
      socketText.color = '#00FFFF';
      socketText.fontSize = 10;
      socketText.top = `${yOffset}px`;
      tooltip.addControl(socketText);
      yOffset += 18;
    }

    // Separator
    this.addSeparator(tooltip, yOffset);
    yOffset += 8;

    // Price
    const priceText = new TextBlock('price', `Price: ${this.formatNumber(data.price)} Gold`);
    priceText.color = '#FFD700';
    priceText.fontSize = 10;
    priceText.top = `${yOffset}px`;
    tooltip.addControl(priceText);

    // Position tooltip
    this.positionTooltip(tooltip);
  }

  /**
   * Show skill tooltip
   */
  showSkillTooltip(data: SkillTooltipData): void {
    if (this.isVisible) return;

    const tooltip = this.createTooltipContainer();
    this.currentTooltip = tooltip;

    // Skill name
    const nameText = new TextBlock('skill_name', data.name);
    nameText.color = '#FFD700';
    nameText.fontSize = 13;
    nameText.fontWeight = 'bold';
    nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    tooltip.addControl(nameText);

    let yOffset = 20;

    // Level and type
    const levelText = new TextBlock('skill_level', `Lv.${data.level} ${this.formatSkillType(data.type)}`);
    levelText.color = '#AAAAAA';
    levelText.fontSize = 11;
    levelText.top = `${yOffset}px`;
    tooltip.addControl(levelText);
    yOffset += 18;

    // Element
    if (data.element) {
      const elemText = new TextBlock('skill_element', `Element: ${this.capitalize(data.element)}`);
      elemText.color = this.getElementColor(data.element);
      elemText.fontSize = 10;
      elemText.top = `${yOffset}px`;
      tooltip.addControl(elemText);
      yOffset += 16;
    }

    // Separator
    this.addSeparator(tooltip, yOffset);
    yOffset += 8;

    // Damage
    const dmgText = new TextBlock('skill_damage', `Damage: ${data.damage}`);
    dmgText.color = '#FF6600';
    dmgText.fontSize = 11;
    dmgText.top = `${yOffset}px`;
    tooltip.addControl(dmgText);
    yOffset += 16;

    // MP Cost
    const mpText = new TextBlock('skill_mp', `MP Cost: ${data.mpCost}`);
    mpText.color = '#4169E1';
    mpText.fontSize = 11;
    mpText.top = `${yOffset}px`;
    tooltip.addControl(mpText);
    yOffset += 16;

    // Cast Time
    const castText = new TextBlock('skill_cast', `Cast Time: ${(data.castTime / 1000).toFixed(1)}s`);
    castText.color = '#FFFFFF';
    castText.fontSize = 10;
    castText.top = `${yOffset}px`;
    tooltip.addControl(castText);
    yOffset += 16;

    // Cooldown
    const cdText = new TextBlock('skill_cd', `Cooldown: ${(data.cooldown / 1000).toFixed(1)}s`);
    cdText.color = '#FF0000';
    cdText.fontSize = 10;
    cdText.top = `${yOffset}px`;
    tooltip.addControl(cdText);
    yOffset += 16;

    // Range
    const rangeText = new TextBlock('skill_range', `Range: ${data.range}m`);
    rangeText.color = '#FFFFFF';
    rangeText.fontSize = 10;
    rangeText.top = `${yOffset}px`;
    tooltip.addControl(rangeText);

    // Position tooltip
    this.positionTooltip(tooltip);
  }

  /**
   * Show entity tooltip
   */
  showEntityTooltip(data: EntityTooltipData): void {
    if (this.isVisible) return;

    const tooltip = this.createTooltipContainer();
    this.currentTooltip = tooltip;

    // Entity name (color by type)
    let nameColor = '#FFFFFF';
    if (data.type === 'monster') {
      nameColor = data.isAggressive ? '#FF0000' : '#FFFF00';
    } else if (data.type === 'npc') {
      nameColor = '#00FF00';
    } else if (data.type === 'player') {
      nameColor = data.pkStatus ? this.getPKColor(data.pkStatus.murdererLevel) : '#FFFFFF';
    }

    const nameText = new TextBlock('entity_name', data.name);
    nameText.color = nameColor;
    nameText.fontSize = 13;
    nameText.fontWeight = 'bold';
    tooltip.addControl(nameText);

    let yOffset = 18;

    // Title or guild
    if (data.title) {
      const titleText = new TextBlock('entity_title', data.title);
      titleText.color = '#FFD700';
      titleText.fontSize = 11;
      titleText.top = `${yOffset}px`;
      tooltip.addControl(titleText);
      yOffset += 16;
    } else if (data.guildName) {
      const guildText = new TextBlock('entity_guild', `<${data.guildName}>`);
      guildText.color = '#00FF00';
      guildText.fontSize = 11;
      guildText.top = `${yOffset}px`;
      tooltip.addControl(guildText);
      yOffset += 16;
    }

    // Level
    const levelText = new TextBlock('entity_level', `Lv.${data.level}`);
    levelText.color = '#AAAAAA';
    levelText.fontSize = 11;
    levelText.top = `${yOffset}px`;
    tooltip.addControl(levelText);
    yOffset += 16;

    // Monster special status
    if (data.type === 'monster') {
      let statusText = '';
      if (data.isUnique) {
        statusText = '[UNIQUE]';
      } else if (data.isGiant) {
        statusText = '[GIANT]';
      } else if (data.isChampion) {
        statusText = '[CHAMPION]';
      }

      if (statusText) {
        const status = new TextBlock('monster_status', statusText);
        status.color = '#FF8000';
        status.fontSize = 10;
        status.top = `${yOffset}px`;
        tooltip.addControl(status);
        yOffset += 16;
      }
    }

    // HP bar
    const hpPercent = data.maxHp > 0 ? (data.hp / data.maxHp) * 100 : 0;
    const hpContainer = new Rectangle('hp_bar_container');
    hpContainer.width = '100%';
    hpContainer.height = '12px';
    hpContainer.top = `${yOffset}px`;
    hpContainer.cornerRadius = 2;
    hpContainer.background = 'rgba(0, 0, 0, 0.8)';
    hpContainer.color = '#000000';
    hpContainer.thickness = 1;
    tooltip.addControl(hpContainer);

    const hpFill = new Rectangle('hp_bar_fill');
    hpFill.width = `${hpPercent}%`;
    hpFill.height = '100%';
    hpFill.cornerRadius = 1;
    hpFill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    hpFill.background = hpPercent > 50 ? '#00FF00' : hpPercent > 20 ? '#FFFF00' : '#FF0000';
    hpContainer.addControl(hpFill);

    // HP text
    const hpText = new TextBlock('hp_text', `${this.formatNumber(data.hp)} / ${this.formatNumber(data.maxHp)}`);
    hpText.color = '#FFFFFF';
    hpText.fontSize = 9;
    hpText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    hpText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    hpContainer.addControl(hpText);

    // Position tooltip
    this.positionTooltip(tooltip);
  }

  /**
   * Hide current tooltip
   */
  hideTooltip(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    if (this.currentTooltip) {
      this.currentTooltip.dispose();
      this.currentTooltip = null;
    }

    this.isVisible = false;
    this.lastHoverTarget = null;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private createTooltipContainer(): Rectangle {
    const tooltip = new Rectangle('tooltip');
    tooltip.width = `${this.config.maxWidth}px`;
    tooltip.cornerRadius = 6;
    tooltip.color = '#4a3728';
    tooltip.thickness = 2;
    tooltip.background = 'rgba(10, 10, 20, 0.95)';
    tooltip.paddingLeft = `${this.config.padding}px`;
    tooltip.paddingRight = `${this.config.padding}px`;
    tooltip.paddingTop = `${this.config.padding}px`;
    tooltip.paddingBottom = `${this.config.padding}px`;
    tooltip.isVisible = false;

    this.guiTexture.addControl(tooltip);
    this.isVisible = true;

    return tooltip;
  }

  private positionTooltip(tooltip: Rectangle): void {
    // Position near mouse cursor but keep on screen
    // Default to top-right for now
    tooltip.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    tooltip.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    tooltip.left = '-320px';
    tooltip.top = '50px';
    tooltip.isVisible = true;
  }

  private scheduleTooltip(showFn: () => void, target: Control): void {
    // Clear existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // If hovering same target, show immediately
    if (this.lastHoverTarget === target && this.currentTooltip) {
      showFn();
      return;
    }

    // Schedule tooltip
    this.hoverTimeout = setTimeout(() => {
      showFn();
    }, this.config.delay);

    this.lastHoverTarget = target;
  }

  private addSeparator(tooltip: Rectangle, top: number): void {
    const separator = new Rectangle('separator');
    separator.width = '100%';
    separator.height = '1px';
    separator.top = `${top}px`;
    separator.color = '#444444';
    separator.thickness = 1;
    tooltip.addControl(separator);
  }

  private addStatLine(tooltip: Rectangle, top: number, label: string, value: string): void {
    const statText = new TextBlock(`stat_${label}`, `${label}: ${value}`);
    statText.color = '#FFFFFF';
    statText.fontSize = 10;
    statText.top = `${top}px`;
    tooltip.addControl(statText);
  }

  private formatItemType(type: ItemType): string {
    return this.capitalize(type.replace('_', ' '));
  }

  private formatSkillType(type: string): string {
    return this.capitalize(type);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private getElementColor(element: string): string {
    const colors: Record<string, string> = {
      physical: '#FFFFFF',
      fire: '#FF4500',
      cold: '#00BFFF',
      lightning: '#FFD700',
      force: '#00FF00'
    };
    return colors[element] || '#FFFFFF';
  }

  private getPKColor(murdererLevel: number): string {
    const colors: Record<number, string> = {
      0: '#FFFFFF',  // Normal
      1: '#0000FF',  // Murderer 1
      2: '#800080',  // Murderer 2
      3: '#FF0000',  // Murderer 3
      4: '#8B0000'   // Murderer 4
    };
    return colors[murdererLevel] || '#FFFFFF';
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }
}

export default TooltipManager;
