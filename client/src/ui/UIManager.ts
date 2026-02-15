/**
 * SRObro - UI Manager
 * Handles all Babylon.js GUI elements
 */

// @ts-nocheck
import { Observable } from '@babylonjs/core';
import {
  AdvancedDynamicTexture,
  Control,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Ellipse
} from '@babylonjs/gui';

import { InventoryPanel } from './components/InventoryPanel';
import { EquipmentPanel } from './components/EquipmentPanel';
import { SkillBar } from './components/SkillBar';
// import { AlchemyPanel } from './components/AlchemyPanel'; // TODO: Fix ComboBox/DropDownList issue
import { GuildPanel } from './components/GuildPanel';
import { QuestPanel } from './components/QuestPanel';
import { FortressPanel } from './components/FortressPanel';
import { XPSPBars } from './components/XPSPBars';
import { TooltipManager } from './components/TooltipManager';
import { CastingBar } from './components/CastingBar';
import { MinimapPanel } from './components/MinimapPanel';
import { HotkeyBar } from './components/HotkeyBar';

export class UIManager {
  private guiTexture: AdvancedDynamicTexture | null = null;
  private uiElements: Map<string, Control> = new Map();
  private isInitialized: boolean = false;

  // UI Panels
  private mainPanel: Rectangle | null = null;
  private chatPanel: Rectangle | null = null;
  private statsPanel: Rectangle | null = null;

  // Game System Panels
  private inventoryPanel: InventoryPanel | null = null;
  private equipmentPanel: EquipmentPanel | null = null;
  private skillBar: SkillBar | null = null;
  private alchemyPanel: any | null = null;
  private guildPanel: GuildPanel | null = null;
  private questPanel: QuestPanel | null = null;
  private fortressPanel: FortressPanel | null = null;

  // Priority 1 Features
  private xpspBars: XPSPBars | null = null;
  private tooltipManager: TooltipManager | null = null;
  private castingBar: CastingBar | null = null;
  private minimapPanel: MinimapPanel | null = null;
  private hotkeyBar: HotkeyBar | null = null;

  // Observables for game events
  public onInventoryUseObservable = new Observable<any>();
  public onSkillUseObservable = new Observable<any>();
  public onAlchemySuccessObservable = new Observable<any>();
  public onAlchemyFailObservable = new Observable<any>();
  public onGuildInviteObservable = new Observable<any>();
  public onGuildNoticeUpdateObservable = new Observable<any>();
  public onUnionCreateObservable = new Observable<any>();
  public onQuestAcceptObservable = new Observable<any>();
  public onQuestAbandonObservable = new Observable<any>();
  public onQuestCompleteObservable = new Observable<any>();
  public onFortressActionObservable = new Observable<any>();

  constructor() {
    // Don't initialize in constructor - wait for scene to be ready
  }

  /**
   * Initialize UI (call after scene is created)
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create full-screen GUI texture
      this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
      this.isInitialized = true;

      // Create main panels
      this.createMainPanel();
      this.createChatPanel();
      this.createStatsPanel();

      // Create game system panels
      this.inventoryPanel = new InventoryPanel(this.guiTexture);
      this.equipmentPanel = new EquipmentPanel(this.guiTexture);
      this.skillBar = new SkillBar(this.guiTexture);
      // this.alchemyPanel = new AlchemyPanel(this.guiTexture); // TODO: Fix ComboBox/DropDownList issue
      this.guildPanel = new GuildPanel(this.guiTexture);
      this.questPanel = new QuestPanel(this.guiTexture);
      this.fortressPanel = new FortressPanel(this.guiTexture);

      // Priority 1 Features
      this.xpspBars = new XPSPBars(this.guiTexture);
      this.tooltipManager = new TooltipManager(this.guiTexture);
      this.castingBar = new CastingBar(this.guiTexture);
      this.minimapPanel = new MinimapPanel(this.guiTexture);
      this.hotkeyBar = new HotkeyBar(this.guiTexture);

      // Attach observables to GUI texture for easy access
      const guiAny = this.guiTexture as any;
      guiAny.onInventoryUseObservable = this.onInventoryUseObservable;
      guiAny.onSkillUseObservable = this.onSkillUseObservable;
      guiAny.onAlchemySuccessObservable = this.onAlchemySuccessObservable;
      guiAny.onAlchemyFailObservable = this.onAlchemyFailObservable;
      guiAny.onGuildInviteObservable = this.onGuildInviteObservable;
      guiAny.onGuildNoticeUpdateObservable = this.onGuildNoticeUpdateObservable;
      guiAny.onUnionCreateObservable = this.onUnionCreateObservable;
      guiAny.onQuestAcceptObservable = this.onQuestAcceptObservable;
      guiAny.onQuestAbandonObservable = this.onQuestAbandonObservable;
      guiAny.onQuestCompleteObservable = this.onQuestCompleteObservable;
      guiAny.onFortressActionObservable = this.onFortressActionObservable;
    } catch (error) {
      console.error('Failed to initialize UI:', error);
    }
  }

  /**
   * Create main UI panel
   */
  private createMainPanel(): void {
    this.mainPanel = new Rectangle('mainPanel');
    this.mainPanel.width = '200px';
    this.mainPanel.height = '400px';
    this.mainPanel.cornerRadius = 20;
    this.mainPanel.color = '#C0C0C0';
    this.mainPanel.thickness = 2;
    this.mainPanel.background = 'rgba(0, 0, 0, 0.5)';
    this.mainPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.mainPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.mainPanel.paddingLeft = '10px';
    this.mainPanel.paddingRight = '10px';
    this.mainPanel.paddingTop = '10px';
    this.mainPanel.paddingBottom = '10px';

    this.guiTexture!.addControl(this.mainPanel);

    // Quick slots
    const quickSlots = this.createQuickSlots();
    this.mainPanel.addControl(quickSlots);
  }

  /**
   * Create quick slots bar
   */
  private createQuickSlots(): StackPanel {
    const stackPanel = new StackPanel('quickSlots');
    stackPanel.width = '100%';
    stackPanel.height = '100%';
    stackPanel.isVertical = false;
    stackPanel.spacing = '5px';

    // Create 5 quick slot buttons
    for (let i = 1; i <= 5; i++) {
      const slot = this.createSlotButton(i);
      stackPanel.addControl(slot);
    }

    return stackPanel;
  }

  /**
   * Create a slot button
   */
  private createSlotButton(index: number): Rectangle {
    const slot = new Rectangle(`slot_${index}`);
    slot.width = '40px';
    slot.height = '40px';
    slot.cornerRadius = 5;
    slot.color = '#C0C0C0';
    slot.thickness = 1;
    slot.background = 'rgba(0, 0, 0, 0.3)';
    slot.paddingLeft = '5px';
    slot.paddingRight = '5px';
    slot.paddingTop = '5px';
    slot.paddingBottom = '5px';

    // Slot number
    const number = new TextBlock(`slot_num_${index}`, `${index}`);
    number.color = '#FFFFFF';
    number.fontSize = 14;
    number.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    number.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    slot.addControl(number);

    this.uiElements.set(`slot_${index}`, slot);

    return slot;
  }

  /**
   * Create chat panel
   */
  private createChatPanel(): void {
    this.chatPanel = new Rectangle('chatPanel');
    this.chatPanel.width = '400px';
    this.chatPanel.height = '200px';
    this.chatPanel.cornerRadius = 10;
    this.chatPanel.color = '#C0C0C0';
    this.chatPanel.thickness = 2;
    this.chatPanel.background = 'rgba(0, 0, 0, 0.5)';
    this.chatPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.chatPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.chatPanel.paddingLeft = '10px';
    this.chatPanel.paddingRight = '10px';
    this.chatPanel.paddingTop = '10px';
    this.chatPanel.paddingBottom = '10px';
    this.chatPanel.alpha = 0.8;

    this.guiTexture!.addControl(this.chatPanel);

    // Chat messages
    const chatMessages = new Rectangle('chatMessages');
    chatMessages.width = '100%';
    chatMessages.height = '160px';
    chatMessages.color = '#00000000';
    chatMessages.thickness = 0;
    this.chatPanel.addControl(chatMessages);

    // Welcome message
    const welcome = new TextBlock('welcome', 'Welcome to SRObro!');
    welcome.color = '#FFD700';
    welcome.fontSize = 16;
    welcome.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    welcome.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    welcome.textWrapping = true;
    chatMessages.addControl(welcome);

    // Chat input placeholder
    const chatInput = new Rectangle('chatInput');
    chatInput.width = '100%';
    chatInput.height = '30px';
    chatInput.cornerRadius = 5;
    chatInput.color = '#808080';
    chatInput.thickness = 1;
    chatInput.background = 'rgba(0, 0, 0, 0.3)';
    chatInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.chatPanel.addControl(chatInput);

    const inputHint = new TextBlock('inputHint', 'Press Enter to chat...');
    inputHint.color = '#FFFFFF';
    inputHint.fontSize = 12;
    inputHint.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    inputHint.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    chatInput.addControl(inputHint);
  }

  /**
   * Create stats panel
   */
  private createStatsPanel(): void {
    this.statsPanel = new Rectangle('statsPanel');
    this.statsPanel.width = '200px';
    this.statsPanel.height = '120px';
    this.statsPanel.cornerRadius = 10;
    this.statsPanel.color = '#C0C0C0';
    this.statsPanel.thickness = 2;
    this.statsPanel.background = 'rgba(0, 0, 0, 0.5)';
    this.statsPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.statsPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.statsPanel.paddingLeft = '10px';
    this.statsPanel.paddingRight = '10px';
    this.statsPanel.paddingTop = '10px';
    this.statsPanel.paddingBottom = '10px';
    this.statsPanel.alpha = 0.8;

    this.guiTexture!.addControl(this.statsPanel);

    // HP bar
    const hpBar = this.createStatusBar('hpBar', 'HP', '#FF0000', 100, 100);
    this.statsPanel.addControl(hpBar);

    // MP bar
    const mpBar = this.createStatusBar('mpBar', 'MP', '#0000FF', 100, 100);
    mpBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.statsPanel.addControl(mpBar);

    // EXP bar
    const expBar = this.createStatusBar('expBar', 'EXP', '#FFFF00', 50, 100);
    expBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.statsPanel.addControl(expBar);
  }

  /**
   * Create a status bar (HP/MP/EXP)
   */
  private createStatusBar(name: string, label: string, color: string, value: number, maxValue: number): Rectangle {
    const bar = new Rectangle(name);
    bar.width = '100%';
    bar.height = '25px';
    bar.cornerRadius = 3;
    bar.color = '#000000';
    bar.thickness = 1;
    bar.background = 'rgba(0, 0, 0, 0.5)';

    // Label
    const labelBlock = new TextBlock(`${name}_label`, label);
    labelBlock.color = '#FFFFFF';
    labelBlock.fontSize = 12;
    labelBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    labelBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    bar.addControl(labelBlock);

    // Background fill
    const background = new Rectangle(`${name}_bg`);
    background.width = '90%';
    background.height = '60%';
    background.cornerRadius = 2;
    background.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    background.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    background.color = '#00000000';
    background.thickness = 0;
    background.background = 'rgba(50, 50, 50, 0.8)';
    bar.addControl(background);

    // Fill
    const fillWidth = (value / maxValue) * 100;
    const fill = new Rectangle(`${name}_fill`);
    fill.width = `${fillWidth}%`;
    fill.height = '100%';
    fill.cornerRadius = 2;
    fill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    fill.color = '#00000000';
    fill.thickness = 0;
    fill.background = color;
    background.addControl(fill);

    // Value text
    const valueText = new TextBlock(`${name}_value`, `${value}/${maxValue}`);
    valueText.color = '#FFFFFF';
    valueText.fontSize = 10;
    valueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    valueText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    bar.addControl(valueText);

    return bar;
  }

  /**
   * Update status bar
   */
  updateStatusBar(name: string, value: number, maxValue: number): void {
    const fill = this.guiTexture!.getControlByName(`${name}_fill`) as Rectangle;
    const valueText = this.guiTexture!.getControlByName(`${name}_value`) as TextBlock;

    if (fill && valueText) {
      const fillWidth = Math.max(0, Math.min(100, (value / maxValue) * 100));
      fill.width = `${fillWidth}%`;
      valueText.text = `${value}/${maxValue}`;
    }
  }

  /**
   * Show notification message
   */
  showNotification(message: string, duration: number = 3000): void {
    if (!this.guiTexture) return;

    const notification = new Rectangle('notification');
    notification.width = '300px';
    notification.height = '50px';
    notification.cornerRadius = 10;
    notification.color = '#FFD700';
    notification.thickness = 2;
    notification.background = 'rgba(0, 0, 0, 0.8)';
    notification.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    notification.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    notification.top = '100px';

    const text = new TextBlock('notification_text', message);
    text.color = '#FFD700';
    text.fontSize = 16;
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    notification.addControl(text);

    this.guiTexture.addControl(notification);

    // Auto-hide
    setTimeout(() => {
      notification.dispose();
    }, duration);
  }

  // ============================================
  // PANEL TOGGLE METHODS
  // ============================================

  /**
   * Toggle inventory panel
   */
  toggleInventory(): void {
    this.inventoryPanel?.toggle();
  }

  /**
   * Toggle equipment panel
   */
  toggleEquipment(): void {
    this.equipmentPanel?.toggle();
  }

  /**
   * Toggle alchemy panel
   */
  toggleAlchemy(): void {
    this.alchemyPanel?.toggle();
  }

  /**
   * Toggle guild panel
   */
  toggleGuild(): void {
    this.guildPanel?.toggle();
  }

  /**
   * Toggle quest panel
   */
  toggleQuest(): void {
    this.questPanel?.toggle();
  }

  /**
   * Toggle fortress panel
   */
  toggleFortress(): void {
    this.fortressPanel?.toggle();
  }

  /**
   * Toggle minimap panel
   */
  toggleMinimap(): void {
    this.minimapPanel?.toggle();
  }

  /**
   * Toggle hotkey bar
   */
  toggleHotkeyBar(): void {
    this.hotkeyBar?.toggle();
  }

  // ============================================
  // PANEL UPDATE METHODS
  // ============================================

  /**
   * Update inventory items
   */
  updateInventory(items: any[]): void {
    if (this.inventoryPanel) {
      this.inventoryPanel.setItems(items);
    }
  }

  /**
   * Update equipment
   */
  updateEquipment(equipment: any): void {
    if (this.equipmentPanel) {
      this.equipmentPanel.setEquipment(equipment);
    }
  }

  /**
   * Update character stats
   */
  updateCharacterStats(stats: any): void {
    if (this.equipmentPanel) {
      this.equipmentPanel.updateStats(stats);
    }
  }

  /**
   * Update skill bar
   */
  updateSkillBar(slotIndex: number, skill: any): void {
    if (this.skillBar) {
      this.skillBar.setSkill(slotIndex, skill);
    }
  }

  /**
   * Update guild info
   */
  updateGuildInfo(guild: any): void {
    if (this.guildPanel) {
      this.guildPanel.setGuildInfo(guild);
    }
  }

  /**
   * Update guild members
   */
  updateGuildMembers(members: any[]): void {
    if (this.guildPanel) {
      this.guildPanel.updateMembers(members);
    }
  }

  /**
   * Update guild storage
   */
  updateGuildStorage(items: any[]): void {
    if (this.guildPanel) {
      this.guildPanel.updateStorage(items);
    }
  }

  /**
   * Update available quests
   */
  updateAvailableQuests(quests: any[]): void {
    if (this.questPanel) {
      this.questPanel.updateAvailableQuests(quests);
    }
  }

  /**
   * Update in-progress quests
   */
  updateInProgressQuests(quests: any[]): void {
    if (this.questPanel) {
      this.questPanel.updateInProgressQuests(quests);
    }
  }

  /**
   * Update completed quests
   */
  updateCompletedQuests(quests: any[]): void {
    if (this.questPanel) {
      this.questPanel.updateCompletedQuests(quests);
    }
  }

  /**
   * Update fortress list
   */
  updateFortressList(fortresses: any[]): void {
    if (this.fortressPanel) {
      this.fortressPanel.updateFortressList(fortresses);
    }
  }

  /**
   * Update fortress registrations
   */
  updateFortressRegistrations(registrations: any[]): void {
    if (this.fortressPanel) {
      this.fortressPanel.updateRegistrations(registrations);
    }
  }

  // ============================================
  // PRIORITY 1 FEATURES - UPDATE METHODS
  // ============================================

  /**
   * Update XP/SP bars
   */
  updateXPSP(data: { level: number; currentExp: number; nextLevelExp: number; currentSP: number; maxSP: number }): void {
    if (this.xpspBars) {
      this.xpspBars.update(data);
    }
  }

  /**
   * Animate XP gain
   */
  animateXPGain(amount: number): void {
    this.xpspBars?.animateXPGain(amount);
  }

  /**
   * Animate SP gain
   */
  animateSPGain(amount: number): void {
    this.xpspBars?.animateSPGain(amount);
  }

  /**
   * Animate level up
   */
  animateLevelUp(): void {
    this.xpspBars?.animateLevelUp();
  }

  /**
   * Update minimap
   */
  updateMinimap(update: any): void {
    if (this.minimapPanel) {
      this.minimapPanel.update(update);
    }
  }

  /**
   * Update casting bar
   */
  updateCasting(casting: any): void {
    if (this.castingBar) {
      if (casting.isCasting) {
        this.castingBar.startCasting(casting);
      } else {
        this.castingBar.hide();
      }
    }
  }

  /**
   * Interrupt casting
   */
  interruptCasting(): void {
    this.castingBar?.interrupt();
  }

  /**
   * Update hotkey bar cooldowns
   */
  updateHotkeyCooldowns(): void {
    this.hotkeyBar?.updateCooldowns();
  }

  /**
   * Use hotkey by key
   */
  useHotkey(slotType: string, index: number): void {
    this.hotkeyBar?.useHotkey(slotType as any, index);
  }

  /**
   * Get GUI texture
   */
  getGuiTexture(): AdvancedDynamicTexture | null {
    return this.guiTexture;
  }

  /**
   * Get UI element
   */
  getElement(name: string): Control | undefined {
    return this.uiElements.get(name);
  }

  /**
   * Get inventory panel
   */
  getInventoryPanel(): InventoryPanel | null {
    return this.inventoryPanel;
  }

  /**
   * Get equipment panel
   */
  getEquipmentPanel(): EquipmentPanel | null {
    return this.equipmentPanel;
  }

  /**
   * Get skill bar
   */
  getSkillBar(): SkillBar | null {
    return this.skillBar;
  }

  /**
   * Get alchemy panel
   */
  // getAlchemyPanel(): AlchemyPanel | null { // TODO: Fix ComboBox/DropDownList issue
  //   return this.alchemyPanel;
  // }

  /**
   * Get guild panel
   */
  getGuildPanel(): GuildPanel | null {
    return this.guildPanel;
  }

  /**
   * Get quest panel
   */
  getQuestPanel(): QuestPanel | null {
    return this.questPanel;
  }

  /**
   * Get fortress panel
   */
  getFortressPanel(): FortressPanel | null {
    return this.fortressPanel;
  }

  /**
   * Get XP/SP bars
   */
  getXPSPBars(): XPSPBars | null {
    return this.xpspBars;
  }

  /**
   * Get tooltip manager
   */
  getTooltipManager(): TooltipManager | null {
    return this.tooltipManager;
  }

  /**
   * Get casting bar
   */
  getCastingBar(): CastingBar | null {
    return this.castingBar;
  }

  /**
   * Get minimap panel
   */
  getMinimapPanel(): MinimapPanel | null {
    return this.minimapPanel;
  }

  /**
   * Get hotkey bar
   */
  getHotkeyBar(): HotkeyBar | null {
    return this.hotkeyBar;
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.inventoryPanel?.dispose();
    this.equipmentPanel?.dispose();
    this.skillBar?.dispose();
    this.alchemyPanel?.dispose();
    this.guildPanel?.dispose();
    this.questPanel?.dispose();
    this.fortressPanel?.dispose();
    this.xpspBars?.dispose();
    this.castingBar?.dispose();
    this.minimapPanel?.dispose();
    this.hotkeyBar?.dispose();
    // Tooltip manager doesn't need dispose as it manages existing tooltips
    this.guiTexture?.dispose();
    this.uiElements.clear();
  }
}
