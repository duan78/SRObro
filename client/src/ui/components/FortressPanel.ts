// ============================================
// SRObro - Fortress Panel
// Interface for fortress war registration, status, and tax management
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Control,
  ScrollViewer
} from '@babylonjs/gui';

export interface FortressInfo {
  id: string;
  name: string;
  level: number;
  ownerGuild: string | null;
  taxRate: number;
  state: 'peace' | 'registration' | 'preparation' | 'active' | 'ended';
  nextWarTime: Date;
  warDuration: number;
  maxGuilds: number;
}

export interface FortressRegistration {
  fortressId: string;
  guildId: string;
  guildName: string;
  registeredAt: Date;
}

export class FortressPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  // Current fortress
  private currentFortress: FortressInfo | null = null;

  // UI elements
  private fortressList: StackPanel | null = null;
  private registrationList: StackPanel | null = null;
  private selectedFortressId: string | null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('fortressPanel');
    this.panel.width = '500px';
    this.panel.height = '600px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#8B7355'; // Brown/SRO style
    this.panel.thickness = 3;
    this.panel.background = 'rgba(20,10,50,0.95)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel.paddingTop = '10px';
    this.panel.paddingBottom = '10px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Header
    const header = this.createHeader();
    this.panel.addControl(header);

    // Fortress list
    const listSection = this.createFortressList();
    this.panel.addControl(listSection);

    // Fortress details
    const detailsSection = this.createFortressDetails();
    this.panel.addControl(detailsSection);

    // Registration section
    const registrationSection = this.createRegistrationSection();
    this.panel.addControl(registrationSection);

    // Close button
    const closeButton = Button.CreateSimpleButton('closeFortress', 'X');
    closeButton.width = '30px';
    closeButton.height = '30px';
    closeButton.color = '#8B0000';
    closeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    closeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    closeButton.onPointerUpObservable.add(() => {
      this.hide();
    });
    this.panel.addControl(closeButton);

    this.guiTexture.addControl(this.panel);
    this.panel.isVisible = false;
  }

  private createHeader(): Rectangle {
    const header = new Rectangle('fortressHeader');
    header.width = '100%';
    header.height = '40px';
    header.cornerRadius = 5;
    header.color = '#D4AF37'; // Gold
    header.thickness = 2;
    header.background = 'rgba(0,0,0,0.5)';

    const title = new TextBlock('fortressTitle');
    title.text = 'FORTRESS WAR';
    title.color = '#FFFFFF';
    title.fontSize = 20;
    title.fontWeight = 'bold';
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    header.addControl(title);

    return header;
  }

  private createFortressList(): Rectangle {
    const section = new Rectangle('fortressListSection');
    section.width = '100%';
    section.height = '150px';
    section.color = '#4a3728';
    section.thickness = 2;
    section.cornerRadius = 5;
    section.background = 'rgba(0,0,0,0.3)';
    section.paddingTop = '5px';
    section.paddingBottom = '5px';

    const label = new TextBlock('fortressListLabel');
    label.text = 'Select Fortress:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeft = '10px';
    section.addControl(label);

    const scrollViewer = new ScrollViewer('fortressListScroll');
    scrollViewer.width = '95%';
    scrollViewer.height = '110px';
    scrollViewer.thickness = 1;
    scrollViewer.color = '#6B5344';
    scrollViewer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    section.addControl(scrollViewer);

    this.fortressList = new StackPanel('fortressList');
    this.fortressList.width = '100%';
    this.fortressList.isVertical = true;
    this.fortressList.spacing = 3;
    scrollViewer.addControl(this.fortressList);

    return section;
  }

  private createFortressRow(fortress: FortressInfo): Rectangle {
    const row = new Rectangle(`fortress_row_${fortress.id}`);
    row.width = '100%';
    row.height = '40px';
    row.cornerRadius = 3;
    row.color = this.selectedFortressId === fortress.id ? '#D4AF37' : '#6B5344';
    row.thickness = 2;
    row.background = 'rgba(0,0,0,0.3)';
    row.paddingLeft = '10px';
    row.paddingRight = '10px';

    const content = new StackPanel(`fortress_content_${fortress.id}`);
    content.width = '100%';
    content.height = '100%';
    content.isVertical = false;
    content.spacing = 10;
    row.addControl(content);

    // Fortress name
    const nameText = new TextBlock(`fortress_name_${fortress.id}`);
    nameText.text = fortress.name;
    nameText.color = '#FFFFFF';
    nameText.fontSize = 13;
    nameText.fontWeight = 'bold';
    nameText.width = '40%';
    content.addControl(nameText);

    // Level
    const levelText = new TextBlock(`fortress_level_${fortress.id}`);
    levelText.text = `Lv.${fortress.level}`;
    levelText.color = '#FFD700';
    levelText.fontSize = 12;
    levelText.width = '20%';
    content.addControl(levelText);

    // State
    const stateText = new TextBlock(`fortress_state_${fortress.id}`);
    stateText.text = this.getStateDisplay(fortress.state);
    stateText.color = this.getStateColor(fortress.state);
    stateText.fontSize = 11;
    stateText.width = '35%';
    content.addControl(stateText);

    // Click handler
    row.onPointerUpObservable.add(() => {
      this.selectFortress(fortress);
    });

    return row;
  }

  private createFortressDetails(): Rectangle {
    const section = new Rectangle('fortressDetailsSection');
    section.width = '100%';
    section.height = '200px';
    section.color = '#4a3728';
    section.thickness = 2;
    section.cornerRadius = 5;
    section.background = 'rgba(0,0,0,0.3)';
    section.paddingTop = '10px';
    section.paddingBottom = '10px';

    const label = new TextBlock('fortressDetailsLabel');
    label.text = 'Fortress Details:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeft = '10px';
    section.addControl(label);

    const content = new StackPanel('fortressDetailsContent');
    content.width = '95%';
    content.height = '160px';
    content.isVertical = true;
    content.spacing = 8;
    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    section.addControl(content);

    // Owner guild
    const ownerText = new TextBlock('fortressOwner');
    ownerText.text = 'Owner: None';
    ownerText.color = '#FFFFFF';
    ownerText.fontSize = 12;
    ownerText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(ownerText);

    // Tax rate
    const taxText = new TextBlock('fortressTax');
    taxText.text = 'Tax Rate: 0%';
    taxText.color = '#FFD700';
    taxText.fontSize = 12;
    taxText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(taxText);

    // Next war time
    const warTimeText = new TextBlock('fortressWarTime');
    warTimeText.text = 'Next War: -';
    warTimeText.color = '#FFFFFF';
    warTimeText.fontSize = 12;
    warTimeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(warTimeText);

    // War duration
    const durationText = new TextBlock('fortressDuration');
    durationText.text = 'Duration: -';
    durationText.color = '#FFFFFF';
    durationText.fontSize = 12;
    durationText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(durationText);

    // Max guilds
    const maxGuildsText = new TextBlock('fortressMaxGuilds');
    maxGuildsText.text = 'Max Guilds: -';
    maxGuildsText.color = '#FFFFFF';
    maxGuildsText.fontSize = 12;
    maxGuildsText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(maxGuildsText);

    // Rewards
    const rewardsText = new TextBlock('fortressRewards');
    rewardsText.text = 'Daily Rewards: -';
    rewardsText.color = '#00FF00';
    rewardsText.fontSize = 12;
    rewardsText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(rewardsText);

    return section;
  }

  private createRegistrationSection(): Rectangle {
    const section = new Rectangle('fortressRegistrationSection');
    section.width = '100%';
    section.height = '150px';
    section.color = '#4a3728';
    section.thickness = 2;
    section.cornerRadius = 5;
    section.background = 'rgba(0,0,0,0.3)';
    section.paddingTop = '10px';
    section.paddingBottom = '10px';

    const label = new TextBlock('registrationLabel');
    label.text = 'War Registration:';
    label.color = '#D4AF37';
    label.fontSize = 14;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.paddingLeft = '10px';
    section.addControl(label);

    const content = new StackPanel('registrationContent');
    content.width = '100%';
    content.height = '110px';
    content.isVertical = true;
    content.spacing = 10;
    section.addControl(content);

    // Registration status
    const statusText = new TextBlock('registrationStatus');
    statusText.text = 'Select a fortress to view status';
    statusText.color = '#FFFFFF';
    statusText.fontSize = 12;
    statusText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(statusText);

    // Registered guilds
    const scrollViewer = new ScrollViewer('registeredGuildsScroll');
    scrollViewer.width = '95%';
    scrollViewer.height = '60px';
    scrollViewer.thickness = 1;
    scrollViewer.color = '#6B5344';
    scrollViewer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(scrollViewer);

    this.registrationList = new StackPanel('registrationList');
    this.registrationList.width = '100%';
    this.registrationList.isVertical = true;
    this.registrationList.spacing = 3;
    scrollViewer.addControl(this.registrationList);

    // Action button
    const actionBtn = Button.CreateSimpleButton('fortressActionBtn', 'Register');
    actionBtn.width = '150px';
    actionBtn.height = '30px';
    actionBtn.color = '#D4AF37';
    actionBtn.background = '#4a3728';
    actionBtn.fontSize = 12;
    actionBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    actionBtn.onPointerUpObservable.add(() => {
      this.onFortressAction();
    });
    content.addControl(actionBtn);

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

  updateFortressList(fortresses: FortressInfo[]): void {
    if (!this.fortressList) return;

    // Clear existing
    this.fortressList.children.forEach(child => child.dispose());

    // Add fortress rows
    fortresses.forEach(fortress => {
      const row = this.createFortressRow(fortress);
      this.fortressList?.addControl(row);
    });
  }

  selectFortress(fortress: FortressInfo): void {
    this.selectedFortressId = fortress.id;
    this.currentFortress = fortress;

    // Update UI to show selection
    this.updateFortressDetails(fortress);

    // Refresh fortress list to show selection
    this.updateFortressRowStyles(fortress.id);
  }

  updateFortressDetails(fortress: FortressInfo): void {
    // Update owner
    const ownerText = this.guiTexture.getControlByName('fortressOwner') as TextBlock;
    if (ownerText) {
      ownerText.text = `Owner: ${fortress.ownerGuild || 'None'}`;
    }

    // Update tax rate
    const taxText = this.guiTexture.getControlByName('fortressTax') as TextBlock;
    if (taxText) {
      const taxSign = fortress.taxRate >= 0 ? '+' : '';
      taxText.text = `Tax Rate: ${taxSign}${fortress.taxRate}%`;
    }

    // Update next war time
    const warTimeText = this.guiTexture.getControlByName('fortressWarTime') as TextBlock;
    if (warTimeText) {
      const date = new Date(fortress.nextWarTime);
      warTimeText.text = `Next War: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    // Update duration
    const durationText = this.guiTexture.getControlByName('fortressDuration') as TextBlock;
    if (durationText) {
      durationText.text = `Duration: ${fortress.warDuration} minutes`;
    }

    // Update max guilds
    const maxGuildsText = this.guiTexture.getControlByName('fortressMaxGuilds') as TextBlock;
    if (maxGuildsText) {
      maxGuildsText.text = `Max Guilds: ${fortress.maxGuilds}`;
    }

    // Update rewards
    const rewardsText = this.guiTexture.getControlByName('fortressRewards') as TextBlock;
    if (rewardsText) {
      const rewards = this.getFortressRewards(fortress.level);
      rewardsText.text = `Daily Rewards: ${rewards.exp} EXP, ${rewards.gold} Gold`;
    }

    // Update registration status
    this.updateRegistrationStatus(fortress);
  }

  updateRegistrations(registrations: FortressRegistration[]): void {
    if (!this.registrationList) return;

    // Clear existing
    this.registrationList.children.forEach(child => child.dispose());

    // Add registration rows
    registrations.forEach(reg => {
      const row = this.createRegistrationRow(reg);
      this.registrationList?.addControl(row);
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private createRegistrationRow(reg: FortressRegistration): Rectangle {
    const row = new Rectangle(`reg_row_${reg.guildId}`);
    row.width = '100%';
    row.height = '25px';
    row.cornerRadius = 2;
    row.color = '#6B5344';
    row.thickness = 1;
    row.background = 'rgba(0,0,0,0.2)';

    const text = new TextBlock(`reg_text_${reg.guildId}`);
    text.text = reg.guildName;
    text.color = '#FFFFFF';
    text.fontSize = 11;
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    row.addControl(text);

    return row;
  }

  private updateFortressRowStyles(selectedId: string): void {
    // Refresh all rows to update colors
    // This is a simplified version - in production would be more efficient
    if (this.fortressList) {
      this.fortressList.children.forEach(child => {
        const row = child as Rectangle;
        if (row.name) {
          const fortressId = row.name.replace('fortress_row_', '');
          row.color = fortressId === selectedId ? '#D4AF37' : '#6B5344';
        }
      });
    }
  }

  private updateRegistrationStatus(fortress: FortressInfo): void {
    const statusText = this.guiTexture.getControlByName('registrationStatus') as TextBlock;
    const actionBtn = this.guiTexture.getControlByName('fortressActionBtn') as Button;

    if (!statusText || !actionBtn) return;

    const state = fortress.state;

    switch (state) {
      case 'peace':
        statusText.text = 'Registration period: Not open';
        statusText.color = '#808080';
        actionBtn.isEnabled = false;
        break;
      case 'registration':
        statusText.text = 'Registration is OPEN!';
        statusText.color = '#00FF00';
        actionBtn.isEnabled = true;
        const btnText = actionBtn.getChildByName('fortressActionBtn_button') as TextBlock;
        if (btnText) btnText.text = 'Register';
        break;
      case 'preparation':
        statusText.text = 'War preparation in progress';
        statusText.color = '#FFD700';
        actionBtn.isEnabled = false;
        break;
      case 'active':
        statusText.text = 'Fortress war is ACTIVE!';
        statusText.color = '#FF0000';
        actionBtn.isEnabled = false;
        break;
      case 'ended':
        statusText.text = 'War has ended';
        statusText.color = '#808080';
        actionBtn.isEnabled = false;
        break;
    }
  }

  private getStateDisplay(state: string): string {
    switch (state) {
      case 'peace': return 'Peace';
      case 'registration': return 'Registration';
      case 'preparation': return 'Preparation';
      case 'active': return 'Active';
      case 'ended': return 'Ended';
      default: return state;
    }
  }

  private getStateColor(state: string): string {
    switch (state) {
      case 'peace': return '#FFFFFF';
      case 'registration': return '#00FF00';
      case 'preparation': return '#FFD700';
      case 'active': return '#FF0000';
      case 'ended': return '#808080';
      default: return '#FFFFFF';
    }
  }

  private getFortressRewards(level: number): { exp: bigint; gold: bigint } {
    switch (level) {
      case 1:
        return { exp: 100000n, gold: 1000000n }; // Jangan
      case 3:
        return { exp: 500000n, gold: 5000000n }; // Hotan
      case 5:
        return { exp: 1000000n, gold: 10000000n }; // Bandit
      default:
        return { exp: 0n, gold: 0n };
    }
  }

  private onFortressAction(): void {
    if (!this.currentFortress || !this.selectedFortressId) return;

    console.log(`Fortress action for: ${this.currentFortress.name}`);

    const guiAny = this.guiTexture as any;
    guiAny.onFortressActionObservable?.notifyObservers({
      fortressId: this.selectedFortressId,
      action: 'register'
    });
  }

  dispose(): void {
    this.panel?.dispose();
    this.fortressList = null;
    this.registrationList = null;
  }
}

export default FortressPanel;
