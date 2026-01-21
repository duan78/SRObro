// ============================================
// SRObro - Quest Panel
// Interface for quest tracking, objectives, and rewards
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  ScrollViewer,
  Control
} from '@babylonjs/gui';

export interface QuestInfo {
  id: string;
  name: string;
  description: string;
  type: string;
  level: number;
  objectives: QuestObjective[];
  rewards: QuestReward;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  canRepeat: boolean;
  repeatCooldown?: number;
  timeLimit?: number; // seconds
}

export interface QuestObjective {
  type: 'kill' | 'collect' | 'talk' | 'reach' | 'use';
  targetId: string;
  targetName: string;
  currentCount: number;
  requiredCount: number;
  isCompleted: boolean;
}

export interface QuestReward {
  exp: bigint;
  gold: bigint;
  items?: Array<{ itemId: string; name: string; quantity: number }>;
  sp?: bigint;
}

export class QuestPanel {
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  // Tabs
  private currentTab: string = 'available'; // available, in_progress, completed

  // Quest lists
  private availableQuestsList: StackPanel | null = null;
  private inProgressQuestsList: StackPanel | null = null;
  private completedQuestsList: StackPanel | null = null;

  // Current quest detail view
  private currentQuest: QuestInfo | null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel
    this.panel = new Rectangle('questPanel');
    this.panel.width = '450px';
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
    const header = this.createHeader();
    this.panel.addControl(header);

    // Tab buttons
    const tabButtons = this.createTabButtons();
    this.panel.addControl(tabButtons);

    // Content area
    this.createContentArea();

    // Close button
    const closeButton = Button.CreateSimpleButton('closeQuest', 'X');
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
    const header = new Rectangle('questHeader');
    header.width = '100%';
    header.height = '40px';
    header.cornerRadius = 5;
    header.color = '#D4AF37'; // Gold
    header.thickness = 2;
    header.background = 'rgba(0, 0, 0, 0.5)';

    const title = new TextBlock('questTitle');
    title.text = 'QUESTS';
    title.color = '#FFFFFF';
    title.fontSize = 20;
    title.fontWeight = 'bold';
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    header.addControl(title);

    return header;
  }

  private createTabButtons(): StackPanel {
    const container = new StackPanel('questTabButtons');
    container.width = '100%';
    container.height = '40px';
    container.isVertical = false;
    container.spacing = 5;
    container.paddingTop = '5px';
    container.paddingBottom = '5px';

    const tabs = [
      { name: 'Available', id: 'available' },
      { name: 'In Progress', id: 'in_progress' },
      { name: 'Completed', id: 'completed' }
    ];

    tabs.forEach(tab => {
      const button = Button.CreateSimpleButton(`quest_tab_${tab.id}`, tab.name);
      button.width = '32%';
      button.height = '100%';
      button.color = '#4a3728';
      button.background = 'rgba(0, 0, 0, 0.5)';
      button.fontSize = 11;
      button.onPointerUpObservable.add(() => {
        this.switchTab(tab.id);
      });
      container.addControl(button);
    });

    return container;
  }

  private createContentArea(): void {
    const contentArea = new Rectangle('questContent');
    contentArea.width = '100%';
    contentArea.height = '510px';
    contentArea.color = '#00000000';
    contentArea.thickness = 0;
    contentArea.paddingTop = '10px';

    // Available quests tab
    const availableTab = this.createQuestListTab('available');
    this.availableQuestsList = availableTab.list;
    contentArea.addControl(availableTab.tab);

    // In progress quests tab
    const inProgressTab = this.createQuestListTab('in_progress');
    this.inProgressQuestsList = inProgressTab.list;
    contentArea.addControl(inProgressTab.tab);
    inProgressTab.tab.isVisible = false;

    // Completed quests tab
    const completedTab = this.createQuestListTab('completed');
    this.completedQuestsList = completedTab.list;
    contentArea.addControl(completedTab.tab);
    completedTab.tab.isVisible = false;

    this.panel?.addControl(contentArea);
  }

  private createQuestListTab(tabId: string): { tab: Rectangle; list: StackPanel } {
    const tab = new Rectangle(`${tabId}_tab`);
    tab.width = '100%';
    tab.height = '100%';
    tab.color = '#00000000';
    tab.thickness = 0;

    const scrollViewer = new ScrollViewer(`${tabId}_scroll`);
    scrollViewer.width = '100%';
    scrollViewer.height = '100%';
    scrollViewer.thickness = 2;
    scrollViewer.color = '#4a3728';
    tab.addControl(scrollViewer);

    const list = new StackPanel(`${tabId}_list`);
    list.width = '100%';
    list.isVertical = true;
    list.spacing = 5;
    scrollViewer.addControl(list);

    return { tab, list };
  }

  private createQuestRow(quest: QuestInfo): Rectangle {
    const row = new Rectangle(`quest_row_${quest.id}`);
    row.width = '100%';
    row.height = quest.status === 'in_progress' ? '120px' : '60px';
    row.cornerRadius = 5;
    row.color = '#6B5344';
    row.thickness = 2;
    row.background = 'rgba(0, 0, 0, 0.3)';
    row.paddingLeft = '10px';
    row.paddingRight = '10px';
    row.paddingTop = '5px';
    row.paddingBottom = '5px';

    const content = new StackPanel(`quest_content_${quest.id}`);
    content.width = '100%';
    content.height = '100%';
    content.isVertical = true;
    content.spacing = 5;
    row.addControl(content);

    // Quest name and level
    const headerRow = new StackPanel(`quest_header_${quest.id}`);
    headerRow.width = '100%';
    headerRow.isVertical = false;
    headerRow.spacing = 10;
    content.addControl(headerRow);

    const questName = new TextBlock(`quest_name_${quest.id}`);
    questName.text = quest.name;
    questName.color = this.getQuestTypeColor(quest.type);
    questName.fontSize = 14;
    questName.fontWeight = 'bold';
    questName.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    questName.width = '70%';
    headerRow.addControl(questName);

    const questLevel = new TextBlock(`quest_level_${quest.id}`);
    questLevel.text = `Lv.${quest.level}`;
    questLevel.color = '#FFD700';
    questLevel.fontSize = 12;
    questLevel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    headerRow.addControl(questLevel);

    // Quest description (truncated)
    const descText = new TextBlock(`quest_desc_${quest.id}`);
    descText.text = this.truncateText(quest.description, 60);
    descText.color = '#FFFFFF';
    descText.fontSize = 11;
    descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    descText.textWrapping = true;
    descText.height = '30px';
    content.addControl(descText);

    // Show objectives if in progress
    if (quest.status === 'in_progress' && quest.objectives.length > 0) {
      const objHeader = new TextBlock(`quest_obj_header_${quest.id}`);
      objHeader.text = 'Objectives:';
      objHeader.color = '#D4AF37';
      objHeader.fontSize = 12;
      objHeader.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      content.addControl(objHeader);

      quest.objectives.forEach((obj, index) => {
        const objText = new TextBlock(`quest_obj_${quest.id}_${index}`);
        objText.text = `${obj.targetName}: ${obj.currentCount}/${obj.requiredCount}`;
        objText.color = obj.isCompleted ? '#00FF00' : '#FFFFFF';
        objText.fontSize = 11;
        objText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        content.addControl(objText);
      });
    }

    // Action button
    const buttonRow = new StackPanel(`quest_button_row_${quest.id}`);
    buttonRow.width = '100%';
    buttonRow.isVertical = false;
    buttonRow.spacing = 10;
    content.addControl(buttonRow);

    if (quest.status === 'available') {
      const acceptBtn = Button.CreateSimpleButton(`accept_quest_${quest.id}`, 'Accept');
      acceptBtn.width = '100px';
      acceptBtn.height = '25px';
      acceptBtn.color = '#D4AF37';
      acceptBtn.background = '#4a3728';
      acceptBtn.fontSize = 11;
      acceptBtn.onPointerUpObservable.add(() => {
        this.onAcceptQuest(quest.id);
      });
      buttonRow.addControl(acceptBtn);

      const detailsBtn = Button.CreateSimpleButton(`quest_details_${quest.id}`, 'Details');
      detailsBtn.width = '100px';
      detailsBtn.height = '25px';
      detailsBtn.color = '#6B5344';
      detailsBtn.background = 'rgba(0, 0, 0, 0.3)';
      detailsBtn.fontSize = 11;
      detailsBtn.onPointerUpObservable.add(() => {
        this.showQuestDetails(quest);
      });
      buttonRow.addControl(detailsBtn);
    } else if (quest.status === 'in_progress') {
      const abandonBtn = Button.CreateSimpleButton(`abandon_quest_${quest.id}`, 'Abandon');
      abandonBtn.width = '100px';
      abandonBtn.height = '25px';
      abandonBtn.color = '#FF0000';
      abandonBtn.background = '#4a3728';
      abandonBtn.fontSize = 11;
      abandonBtn.onPointerUpObservable.add(() => {
        this.onAbandonQuest(quest.id);
      });
      buttonRow.addControl(abandonBtn);

      if (quest.objectives.every(obj => obj.isCompleted)) {
        const completeBtn = Button.CreateSimpleButton(`complete_quest_${quest.id}`, 'Complete');
        completeBtn.width = '100px';
        completeBtn.height = '25px';
        completeBtn.color = '#00FF00';
        completeBtn.background = '#4a3728';
        completeBtn.fontSize = 11;
        completeBtn.onPointerUpObservable.add(() => {
          this.onCompleteQuest(quest.id);
        });
        buttonRow.addControl(completeBtn);
      }
    } else if (quest.status === 'completed' && quest.canRepeat) {
      const repeatBtn = Button.CreateSimpleButton(`repeat_quest_${quest.id}`, 'Repeat');
      repeatBtn.width = '100px';
      repeatBtn.height = '25px';
      repeatBtn.color = '#D4AF37';
      repeatBtn.background = '#4a3728';
      repeatBtn.fontSize = 11;
      repeatBtn.onPointerUpObservable.add(() => {
        this.onAcceptQuest(quest.id);
      });
      buttonRow.addControl(repeatBtn);
    }

    return row;
  }

  private createQuestDetailPopup(quest: QuestInfo): Rectangle {
    const popup = new Rectangle('questDetailPopup');
    popup.width = '400px';
    popup.height = '500px';
    popup.cornerRadius = 10;
    popup.color = '#D4AF37';
    popup.thickness = 3;
    popup.background = 'rgba(20, 10, 5, 0.98)';
    popup.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    popup.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    const content = new StackPanel('questDetailContent');
    content.width = '100%';
    content.height = '100%';
    content.isVertical = true;
    content.spacing = 10;
    content.paddingTop = '15px';
    content.paddingBottom = '15px';
    content.paddingLeft = '15px';
    content.paddingRight = '15px';
    popup.addControl(content);

    // Quest name
    const nameText = new TextBlock('detail_name');
    nameText.text = quest.name;
    nameText.color = this.getQuestTypeColor(quest.type);
    nameText.fontSize = 18;
    nameText.fontWeight = 'bold';
    nameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(nameText);

    // Quest type and level
    const typeText = new TextBlock('detail_type');
    typeText.text = `${quest.type} - Level ${quest.level}`;
    typeText.color = '#FFD700';
    typeText.fontSize = 14;
    typeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.addControl(typeText);

    // Description
    const descLabel = new TextBlock('detail_desc_label');
    descLabel.text = 'Description:';
    descLabel.color = '#D4AF37';
    descLabel.fontSize = 12;
    descLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(descLabel);

    const descText = new TextBlock('detail_desc');
    descText.text = quest.description;
    descText.color = '#FFFFFF';
    descText.fontSize = 12;
    descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    descText.textWrapping = true;
    descText.height = '80px';
    content.addControl(descText);

    // Objectives
    const objLabel = new TextBlock('detail_obj_label');
    objLabel.text = 'Objectives:';
    objLabel.color = '#D4AF37';
    objLabel.fontSize = 12;
    objLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(objLabel);

    quest.objectives.forEach((obj, index) => {
      const objText = new TextBlock(`detail_obj_${index}`);
      objText.text = `${obj.targetName}: ${obj.currentCount}/${obj.requiredCount}`;
      objText.color = obj.isCompleted ? '#00FF00' : '#FFFFFF';
      objText.fontSize = 11;
      objText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      content.addControl(objText);
    });

    // Rewards
    const rewardLabel = new TextBlock('detail_reward_label');
    rewardLabel.text = 'Rewards:';
    rewardLabel.color = '#D4AF37';
    rewardLabel.fontSize = 12;
    rewardLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(rewardLabel);

    const expText = new TextBlock('detail_reward_exp');
    expText.text = `EXP: ${quest.rewards.exp}`;
    expText.color = '#FFFFFF';
    expText.fontSize = 11;
    expText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(expText);

    const goldText = new TextBlock('detail_reward_gold');
    goldText.text = `Gold: ${quest.rewards.gold}`;
    goldText.color = '#FFD700';
    goldText.fontSize = 11;
    goldText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    content.addControl(goldText);

    if (quest.rewards.sp) {
      const spText = new TextBlock('detail_reward_sp');
      spText.text = `SP: ${quest.rewards.sp}`;
      spText.color = '#87CEEB';
      spText.fontSize = 11;
      spText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      content.addControl(spText);
    }

    if (quest.rewards.items && quest.rewards.items.length > 0) {
      quest.rewards.items.forEach(item => {
        const itemText = new TextBlock(`detail_reward_item_${item.itemId}`);
        itemText.text = `${item.name} x${item.quantity}`;
        itemText.color = '#FFFFFF';
        itemText.fontSize = 11;
        itemText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        content.addControl(itemText);
      });
    }

    // Time limit if applicable
    if (quest.timeLimit) {
      const timeText = new TextBlock('detail_time');
      timeText.text = `Time Limit: ${Math.floor(quest.timeLimit / 60)} minutes`;
      timeText.color = '#FF0000';
      timeText.fontSize = 11;
      timeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      content.addControl(timeText);
    }

    // Close button
    const closeBtn = Button.CreateSimpleButton('closeDetailPopup', 'Close');
    closeBtn.width = '100px';
    closeBtn.height = '30px';
    closeBtn.color = '#D4AF37';
    closeBtn.background = '#4a3728';
    closeBtn.fontSize = 12;
    closeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    closeBtn.onPointerUpObservable.add(() => {
      popup.dispose();
    });
    content.addControl(closeBtn);

    this.guiTexture.addControl(popup);

    return popup;
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

  updateAvailableQuests(quests: QuestInfo[]): void {
    if (!this.availableQuestsList) return;

    // Clear existing
    this.availableQuestsList.children.forEach(child => child.dispose());

    // Add quest rows
    quests.forEach(quest => {
      const row = this.createQuestRow(quest);
      this.availableQuestsList?.addControl(row);
    });
  }

  updateInProgressQuests(quests: QuestInfo[]): void {
    if (!this.inProgressQuestsList) return;

    // Clear existing
    this.inProgressQuestsList.children.forEach(child => child.dispose());

    // Add quest rows
    quests.forEach(quest => {
      const row = this.createQuestRow(quest);
      this.inProgressQuestsList?.addControl(row);
    });
  }

  updateCompletedQuests(quests: QuestInfo[]): void {
    if (!this.completedQuestsList) return;

    // Clear existing
    this.completedQuestsList.children.forEach(child => child.dispose());

    // Add quest rows
    quests.forEach(quest => {
      const row = this.createQuestRow(quest);
      this.completedQuestsList?.addControl(row);
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private switchTab(tabId: string): void {
    this.currentTab = tabId;

    // Hide all tabs
    const availableTab = this.guiTexture.getControlByName('available_tab');
    const inProgressTab = this.guiTexture.getControlByName('in_progress_tab');
    const completedTab = this.guiTexture.getControlByName('completed_tab');

    if (availableTab) availableTab.isVisible = false;
    if (inProgressTab) inProgressTab.isVisible = false;
    if (completedTab) completedTab.isVisible = false;

    // Show selected tab
    switch (tabId) {
      case 'available':
        if (availableTab) availableTab.isVisible = true;
        break;
      case 'in_progress':
        if (inProgressTab) inProgressTab.isVisible = true;
        break;
      case 'completed':
        if (completedTab) completedTab.isVisible = true;
        break;
    }
  }

  private getQuestTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'tutorial': return '#00FF00'; // Green
      case 'daily': return '#FFD700'; // Gold
      case 'story': return '#FF8C00'; // Dark orange
      case 'collection': return '#87CEEB'; // Sky blue
      case 'hunting': return '#FF4500'; // Orange red
      case 'delivery': return '#9370DB'; // Medium purple
      default: return '#FFFFFF'; // White
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private showQuestDetails(quest: QuestInfo): void {
    this.createQuestDetailPopup(quest);
  }

  private onAcceptQuest(questId: string): void {
    console.log(`Accepting quest: ${questId}`);
    const guiAny = this.guiTexture as any;
    guiAny.onQuestAcceptObservable?.notifyObservers({ questId });
  }

  private onAbandonQuest(questId: string): void {
    console.log(`Abandoning quest: ${questId}`);
    const guiAny = this.guiTexture as any;
    guiAny.onQuestAbandonObservable?.notifyObservers({ questId });
  }

  private onCompleteQuest(questId: string): void {
    console.log(`Completing quest: ${questId}`);
    const guiAny = this.guiTexture as any;
    guiAny.onQuestCompleteObservable?.notifyObservers({ questId });
  }

  dispose(): void {
    this.panel?.dispose();
    this.availableQuestsList = null;
    this.inProgressQuestsList = null;
    this.completedQuestsList = null;
  }
}

export default QuestPanel;
