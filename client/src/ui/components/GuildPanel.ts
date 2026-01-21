// ============================================
// SRObro - Guild Panel
// Interface for guild management, members, storage
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  ScrollViewer,
  Control,
  InputText
} from '@babylonjs/gui';

export interface GuildInfo {
  id: string;
  name: string;
  level: number;
  exp: bigint;
  notice: string;
  memberCount: number;
  maxMembers: number;
  ownerId: string;
  createdAt: Date;
}

export interface GuildMember {
  characterId: string;
  name: string;
  level: number;
  rank: string;
  contribution: bigint;
  online: boolean;
  lastSeen?: Date;
}

export interface GuildStorageItem {
  itemId: string;
  name: string;
  quantity: number;
  slot: number;
  rarity: string;
}

export class GuildPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  // Tabs
  private currentTab: string = 'info'; // info, members, storage, union

  // UI elements
  private infoTab: Rectangle | null = null;
  private membersTab: Rectangle | null = null;
  private storageTab: Rectangle | null = null;
  private unionTab: Rectangle | null = null;

  // Member list
  private memberList: StackPanel | null = null;

  // Storage grid
  private storageSlots: Map<number, Rectangle> = new Map();

  // Current guild data
  private currentGuild: GuildInfo | null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('guildPanel');
    this.panel.width = '500px';
    this.panel.height = '600px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#8B7355'; // Brown/SRO style
    this.panel.thickness = 3;
    this.panel.background = 'rgba(20, 10, 5, 0.95)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.panel.paddingTop = '10px';
    this.panel.paddingBottom = '10px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Header
    const header = this.createHeader();
    this.panel.addControl(header);

    // Tab buttons
    const tabButtons = this.createTabButtons();
    this.panel.addControl(tabButtons);

    // Content area
    this.createContentArea();

    // Close button
    const closeButton = Button.CreateSimpleButton('closeGuild', 'X');
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
    const header = new Rectangle('guildHeader');
    header.width = '100%';
    header.height = '50px';
    header.cornerRadius = 5;
    header.color = '#D4AF37'; // Gold
    header.thickness = 2;
    header.background = 'rgba(0, 0, 0, 0.5)';

    const title = new TextBlock('guildTitle');
    title.text = 'GUILD';
    title.color = '#FFFFFF';
    title.fontSize = 24;
    title.fontWeight = 'bold';
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    header.addControl(title);

    const guildName = new TextBlock('guildNameDisplay');
    guildName.text = '';
    guildName.color = '#FFD700';
    guildName.fontSize = 16;
    guildName.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    guildName.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guildName.paddingTop = '30px';
    header.addControl(guildName);

    return header;
  }

  private createTabButtons(): StackPanel {
    const container = new StackPanel('tabButtons');
    container.width = '100%';
    container.height = '40px';
    container.isVertical = false;
    container.spacing = 5;
    container.paddingTop = '5px';
    container.paddingBottom = '5px';

    const tabs = [
      { name: 'Info', id: 'info' },
      { name: 'Members', id: 'members' },
      { name: 'Storage', id: 'storage' },
      { name: 'Union', id: 'union' }
    ];

    tabs.forEach(tab => {
      const button = Button.CreateSimpleButton(`tab_${tab.id}`, tab.name);
      button.width = '23%';
      button.height = '100%';
      button.color = '#4a3728';
      button.background = 'rgba(0, 0, 0, 0.5)';
      button.fontSize = 12;
      button.onPointerUpObservable.add(() => {
        this.switchTab(tab.id);
      });
      container.addControl(button);
    });

    return container;
  }

  private createContentArea(): void {
    const contentArea = new Rectangle('guildContent');
    contentArea.width = '100%';
    contentArea.height = '490px';
    contentArea.color = '#00000000';
    contentArea.thickness = 0;
    contentArea.paddingTop = '10px';

    // Info tab
    this.infoTab = this.createInfoTab();
    contentArea.addControl(this.infoTab);

    // Members tab
    this.membersTab = this.createMembersTab();
    contentArea.addControl(this.membersTab);
    this.membersTab.isVisible = false;

    // Storage tab
    this.storageTab = this.createStorageTab();
    contentArea.addControl(this.storageTab);
    this.storageTab.isVisible = false;

    // Union tab
    this.unionTab = this.createUnionTab();
    contentArea.addControl(this.unionTab);
    this.unionTab.isVisible = false;

    this.panel?.addControl(contentArea);
  }

  private createInfoTab(): Rectangle {
    const tab = new Rectangle('infoTab');
    tab.width = '100%';
    tab.height = '100%';
    tab.color = '#00000000';
    tab.thickness = 0;

    const content = new StackPanel('infoContent');
    content.width = '100%';
    content.height = '100%';
    content.isVertical = true;
    content.spacing = 10;
    tab.addControl(content);

    // Guild level
    const levelText = new TextBlock('guildLevel');
    levelText.text = 'Level: 1';
    levelText.color = '#FFD700';
    levelText.fontSize = 16;
    levelText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(levelText);

    // Guild EXP
    const expText = new TextBlock('guildExp');
    expText.text = 'EXP: 0 / 100000';
    expText.color = '#FFFFFF';
    expText.fontSize = 14;
    expText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(expText);

    // Members count
    const membersText = new TextBlock('guildMembers');
    membersText.text = 'Members: 0 / 40';
    membersText.color = '#FFFFFF';
    membersText.fontSize = 14;
    membersText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(membersText);

    // Guild notice section
    const noticeLabel = new TextBlock('noticeLabel');
    noticeLabel.text = 'Guild Notice:';
    noticeLabel.color = '#D4AF37';
    noticeLabel.fontSize = 14;
    noticeLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    noticeLabel.paddingTop = '10px';
    content.addControl(noticeLabel);

    const noticeBox = new InputText('guildNoticeBox');
    noticeBox.width = '100%';
    noticeBox.height = '80px';
    noticeBox.color = '#6B5344';
    noticeBox.background = 'rgba(0, 0, 0, 0.3)';
    noticeBox.text = '';
    // noticeBox.isMultiline = true; // InputText doesn't have isMultiline, InputTextArea might but it's not standard
    content.addControl(noticeBox);

    // Update notice button
    const updateNoticeBtn = Button.CreateSimpleButton('updateNoticeBtn', 'Update Notice');
    updateNoticeBtn.width = '150px';
    updateNoticeBtn.height = '30px';
    updateNoticeBtn.color = '#D4AF37';
    updateNoticeBtn.background = '#4a3728';
    updateNoticeBtn.fontSize = 12;
    updateNoticeBtn.onPointerUpObservable.add(() => {
      this.onUpdateNotice();
    });
    content.addControl(updateNoticeBtn);

    // Guild creation date
    const createdText = new TextBlock('guildCreated');
    createdText.text = 'Founded: -';
    createdText.color = '#FFFFFF';
    createdText.fontSize = 12;
    createdText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(createdText);

    return tab;
  }

  private createMembersTab(): Rectangle {
    const tab = new Rectangle('membersTab');
    tab.width = '100%';
    tab.height = '100%';
    tab.color = '#00000000';
    tab.thickness = 0;

    // Scroll viewer for member list
    const scrollViewer = new ScrollViewer('membersScroll');
    scrollViewer.width = '100%';
    scrollViewer.height = '400px';
    scrollViewer.thickness = 2;
    scrollViewer.color = '#4a3728';
    tab.addControl(scrollViewer);

    this.memberList = new StackPanel('memberList');
    this.memberList.width = '100%';
    this.memberList.isVertical = true;
    this.memberList.spacing = 5;
    scrollViewer.addControl(this.memberList);

    // Invite button
    const inviteBtn = Button.CreateSimpleButton('inviteMemberBtn', 'Invite Member');
    inviteBtn.width = '150px';
    inviteBtn.height = '35px';
    inviteBtn.color = '#D4AF37';
    inviteBtn.background = '#4a3728';
    inviteBtn.fontSize = 12;
    inviteBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    inviteBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    inviteBtn.paddingTop = '10px';
    inviteBtn.onPointerUpObservable.add(() => {
      this.onInviteMember();
    });
    tab.addControl(inviteBtn);

    return tab;
  }

  private createMemberRow(member: GuildMember): Rectangle {
    const row = new Rectangle(`member_${member.characterId}`);
    row.width = '100%';
    row.height = '40px';
    row.cornerRadius = 3;
    row.color = '#6B5344';
    row.thickness = 1;
    row.background = 'rgba(0, 0, 0, 0.3)';
    row.paddingLeft = '10px';
    row.paddingRight = '10px';

    const content = new StackPanel(`member_content_${member.characterId}`);
    content.width = '100%';
    content.height = '100%';
    content.isVertical = false;
    content.spacing = 10;
    row.addControl(content);

    // Name
    const nameText = new TextBlock(`member_name_${member.characterId}`);
    nameText.text = member.name;
    nameText.color = '#FFFFFF';
    nameText.fontSize = 12;
    nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    nameText.width = '30%';
    content.addControl(nameText);

    // Level
    const levelText = new TextBlock(`member_level_${member.characterId}`);
    levelText.text = `Lv.${member.level}`;
    levelText.color = '#FFD700';
    levelText.fontSize = 12;
    levelText.width = '15%';
    content.addControl(levelText);

    // Rank
    const rankText = new TextBlock(`member_rank_${member.characterId}`);
    rankText.text = member.rank;
    rankText.color = this.getRankColor(member.rank);
    rankText.fontSize = 12;
    rankText.width = '20%';
    content.addControl(rankText);

    // Online status
    const statusColor = member.online ? '#00FF00' : '#FF0000';
    const statusText = new TextBlock(`member_status_${member.characterId}`);
    statusText.text = member.online ? 'Online' : 'Offline';
    statusText.color = statusColor;
    statusText.fontSize = 12;
    statusText.width = '20%';
    content.addControl(statusText);

    // Action button (for leaders/assistants)
    if (this.canManageMembers()) {
      const actionBtn = Button.CreateSimpleButton(`member_action_${member.characterId}`, '...');
      actionBtn.width = '10%';
      actionBtn.height = '25px';
      actionBtn.fontSize = 10;
      actionBtn.onPointerUpObservable.add(() => {
        this.onMemberAction(member.characterId);
      });
      content.addControl(actionBtn);
    }

    return row;
  }

  private createStorageTab(): Rectangle {
    const tab = new Rectangle('storageTab');
    tab.width = '100%';
    tab.height = '100%';
    tab.color = '#00000000';
    tab.thickness = 0;

    const content = new StackPanel('storageContent');
    content.width = '100%';
    content.height = '100%';
    content.isVertical = true;
    content.spacing = 10;
    tab.addControl(content);

    // Storage gold
    const goldText = new TextBlock('storageGold');
    goldText.text = 'Storage Gold: 0';
    goldText.color = '#FFD700';
    goldText.fontSize = 14;
    goldText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(goldText);

    // Storage grid (10x10 = 100 slots)
    const gridContainer = new Rectangle('storageGridContainer');
    gridContainer.width = '100%';
    gridContainer.height = '350px';
    gridContainer.color = '#4a3728';
    gridContainer.thickness = 2;
    gridContainer.background = 'rgba(0, 0, 0, 0.3)';
    content.addControl(gridContainer);

    const grid = new StackPanel('storageGrid');
    grid.width = '100%';
    grid.height = '100%';
    grid.isVertical = true;
    grid.spacing = 2;
    gridContainer.addControl(grid);

    // Create 10 rows with 10 slots each
    for (let row = 0; row < 10; row++) {
      const rowPanel = new StackPanel(`storage_row_${row}`);
      rowPanel.width = '100%';
      rowPanel.height = '35px';
      rowPanel.isVertical = false;
      rowPanel.spacing = 2;
      grid.addControl(rowPanel);

      for (let col = 0; col < 10; col++) {
        const slotIndex = row * 10 + col;
        const slot = this.createStorageSlot(slotIndex);
        this.storageSlots.set(slotIndex, slot);
        rowPanel.addControl(slot);
      }
    }

    // Deposit/Withdraw buttons
    const buttonRow = new StackPanel('storageButtonRow');
    buttonRow.width = '100%';
    buttonRow.height = '40px';
    buttonRow.isVertical = false;
    buttonRow.spacing = 10;
    content.addControl(buttonRow);

    const depositBtn = Button.CreateSimpleButton('depositGoldBtn', 'Deposit Gold');
    depositBtn.width = '48%';
    depositBtn.height = '100%';
    depositBtn.color = '#D4AF37';
    depositBtn.background = '#4a3728';
    depositBtn.fontSize = 12;
    depositBtn.onPointerUpObservable.add(() => {
      this.onDepositGold();
    });
    buttonRow.addControl(depositBtn);

    const withdrawBtn = Button.CreateSimpleButton('withdrawGoldBtn', 'Withdraw Gold');
    withdrawBtn.width = '48%';
    withdrawBtn.height = '100%';
    withdrawBtn.color = '#D4AF37';
    withdrawBtn.background = '#4a3728';
    withdrawBtn.fontSize = 12;
    withdrawBtn.onPointerUpObservable.add(() => {
      this.onWithdrawGold();
    });
    buttonRow.addControl(withdrawBtn);

    return tab;
  }

  private createStorageSlot(slotIndex: number): Rectangle {
    const slot = new Rectangle(`storage_slot_${slotIndex}`);
    slot.width = '35px';
    slot.height = '35px';
    slot.cornerRadius = 2;
    slot.color = '#6B5344';
    slot.thickness = 1;
    slot.background = 'rgba(0, 0, 0, 0.3)';

    slot.onPointerClickObservable.add(() => {
      this.onStorageSlotClick(slotIndex);
    });

    return slot;
  }

  private createUnionTab(): Rectangle {
    const tab = new Rectangle('unionTab');
    tab.width = '100%';
    tab.height = '100%';
    tab.color = '#00000000';
    tab.thickness = 0;

    const content = new StackPanel('unionContent');
    content.width = '100%';
    content.height = '100%';
    content.isVertical = true;
    content.spacing = 15;
    tab.addControl(content);

    // Union info
    const unionTitle = new TextBlock('unionTitle');
    unionTitle.text = 'Union Information';
    unionTitle.color = '#FFD700';
    unionTitle.fontSize = 18;
    unionTitle.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(unionTitle);

    const unionStatus = new TextBlock('unionStatus');
    unionStatus.text = 'Not in union';
    unionStatus.color = '#FFFFFF';
    unionStatus.fontSize = 14;
    unionStatus.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(unionStatus);

    // Create union button
    const createUnionBtn = Button.CreateSimpleButton('createUnionBtn', 'Create Union');
    createUnionBtn.width = '200px';
    createUnionBtn.height = '35px';
    createUnionBtn.color = '#D4AF37';
    createUnionBtn.background = '#4a3728';
    createUnionBtn.fontSize = 12;
    createUnionBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    createUnionBtn.onPointerUpObservable.add(() => {
      this.onCreateUnion();
    });
    content.addControl(createUnionBtn);

    // Union members list
    const unionList = new ScrollViewer('unionListScroll');
    unionList.width = '100%';
    unionList.height = '300px';
    unionList.thickness = 2;
    unionList.color = '#4a3728';
    content.addControl(unionList);

    const unionMembers = new StackPanel('unionMembers');
    unionMembers.width = '100%';
    unionMembers.isVertical = true;
    unionMembers.spacing = 5;
    unionList.addControl(unionMembers);

    return tab;
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

  setGuildInfo(guild: GuildInfo): void {
    this.currentGuild = guild;

    // Update header
    const guildNameDisplay = this.guiTexture.getControlByName('guildNameDisplay') as TextBlock;
    if (guildNameDisplay) {
      guildNameDisplay.text = guild.name;
    }

    // Update info tab
    const levelText = this.guiTexture.getControlByName('guildLevel') as TextBlock;
    if (levelText) {
      levelText.text = `Level: ${guild.level}`;
    }

    const expText = this.guiTexture.getControlByName('guildExp') as TextBlock;
    if (expText) {
      const expNeeded = BigInt(guild.level * 100000);
      expText.text = `EXP: ${guild.exp} / ${expNeeded}`;
    }

    const membersText = this.guiTexture.getControlByName('guildMembers') as TextBlock;
    if (membersText) {
      membersText.text = `Members: ${guild.memberCount} / ${guild.maxMembers}`;
    }

    const createdText = this.guiTexture.getControlByName('guildCreated') as TextBlock;
    if (createdText) {
      const date = new Date(guild.createdAt).toLocaleDateString();
      createdText.text = `Founded: ${date}`;
    }

    const noticeBox = this.guiTexture.getControlByName('guildNoticeBox') as InputText;
    if (noticeBox) {
      noticeBox.text = guild.notice;
    }
  }

  updateMembers(members: GuildMember[]): void {
    if (!this.memberList) return;

    // Clear existing members
    this.memberList.children.forEach(child => child.dispose());

    // Add member rows
    members.forEach(member => {
      const row = this.createMemberRow(member);
      this.memberList?.addControl(row);
    });
  }

  updateStorage(items: GuildStorageItem[]): void {
    // Clear all slots
    this.storageSlots.forEach((slot, index) => {
      const children = [...slot.children];
      children.forEach(child => child.dispose());
    });

    // Populate slots with items
    items.forEach(item => {
      const slot = this.storageSlots.get(item.slot);
      if (slot) {
        const itemBg = new Rectangle(`storage_item_${item.slot}`);
        itemBg.width = '30px';
        itemBg.height = '30px';
        itemBg.cornerRadius = 2;
        itemBg.color = '#6B5344';
        itemBg.thickness = 1;
        itemBg.background = 'rgba(0, 0, 0, 0.5)';
        slot.addControl(itemBg);

        const qtyText = new TextBlock(`storage_qty_${item.slot}`);
        qtyText.text = `${item.quantity}`;
        qtyText.color = '#FFFFFF';
        qtyText.fontSize = 10;
        qtyText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        qtyText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        slot.addControl(qtyText);
      }
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private switchTab(tabId: string): void {
    this.currentTab = tabId;

    // Hide all tabs
    if (this.infoTab) this.infoTab.isVisible = false;
    if (this.membersTab) this.membersTab.isVisible = false;
    if (this.storageTab) this.storageTab.isVisible = false;
    if (this.unionTab) this.unionTab.isVisible = false;

    // Show selected tab
    switch (tabId) {
      case 'info':
        if (this.infoTab) this.infoTab.isVisible = true;
        break;
      case 'members':
        if (this.membersTab) this.membersTab.isVisible = true;
        break;
      case 'storage':
        if (this.storageTab) this.storageTab.isVisible = true;
        break;
      case 'union':
        if (this.unionTab) this.unionTab.isVisible = true;
        break;
    }
  }

  private getRankColor(rank: string): string {
    switch (rank.toLowerCase()) {
      case 'leader': return '#FF0000'; // Red
      case 'assistant': return '#FF8C00'; // Dark orange
      case 'senior': return '#FFD700'; // Gold
      case 'member': return '#FFFFFF'; // White
      default: return '#808080'; // Gray
    }
  }

  private canManageMembers(): boolean {
    // TODO: Check if player is leader or assistant
    return true;
  }

  private onUpdateNotice(): void {
    const noticeBox = this.guiTexture.getControlByName('guildNoticeBox') as InputText;
    if (noticeBox) {
      console.log(`Updating guild notice: ${noticeBox.text}`);
      const guiAny = this.guiTexture as any;
      guiAny.onGuildNoticeUpdateObservable?.notifyObservers({
        guildId: this.currentGuild?.id,
        notice: noticeBox.text
      });
    }
  }

  private onInviteMember(): void {
    console.log('Inviting member...');
    const guiAny = this.guiTexture as any;
    guiAny.onGuildInviteObservable?.notifyObservers({
      guildId: this.currentGuild?.id
    });
  }

  private onMemberAction(characterId: string): void {
    console.log(`Member action for: ${characterId}`);
    // Show context menu: Promote, Demote, Kick
  }

  private onStorageSlotClick(slotIndex: number): void {
    console.log(`Storage slot clicked: ${slotIndex}`);
    // Show item details or deposit/withdraw dialog
  }

  private onDepositGold(): void {
    console.log('Depositing gold...');
    // Show deposit dialog
  }

  private onWithdrawGold(): void {
    console.log('Withdrawing gold...');
    // Show withdraw dialog
  }

  private onCreateUnion(): void {
    console.log('Creating union...');
    const guiAny = this.guiTexture as any;
    guiAny.onUnionCreateObservable?.notifyObservers({
      guildId: this.currentGuild?.id
    });
  }

  dispose(): void {
    this.panel?.dispose();
    this.memberList = null;
    this.storageSlots.clear();
  }
}

export default GuildPanel;
