// ============================================
// SRObro - Skill Bar
// Displays skill bar with cooldowns and hotkeys
// ============================================

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Button,
  StackPanel,
  Control
} from '@babylonjs/gui';

export interface SkillSlot {
  skillId: string;
  name: string;
  level: number;
  iconId?: string;
  cooldown: number; // milliseconds
  lastUsed?: number; // timestamp
  hotkey: string; // F1-F8, 1-9
}

export class SkillBar {
  private panel: Rectangle | null = null;
  private skillSlots: Map<number, Rectangle> = new Map();
  private cooldownOverlays: Map<number, Rectangle> = new Map();
  private skillData: Map<number, SkillSlot> = new Map();

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createPanel();
  }

  private createPanel(): void {
    // Main panel (bottom center)
    this.panel = new Rectangle('skillBarPanel');
    this.panel.width = '500px';
    this.panel.height = '60px';
    this.panel.cornerRadius = 8;
    this.panel.color = '#4a3728'; // Dark brown
    this.panel.thickness = 2;
    this.panel.background = 'rgba(0,0,0,0.9)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.panel.paddingTop = '5px';
    this.panel.paddingBottom = '5px';
    this.panel.paddingLeft = '10px';
    this.panel.paddingRight = '10px';

    // Skills container
    const skillsContainer = new StackPanel('skillsContainer');
    skillsContainer.width = '100%';
    skillsContainer.height = '100%';
    skillsContainer.isVertical = false;
    skillsContainer.spacing = 5;
    this.panel.addControl(skillsContainer);

    // Create 9 skill slots (F1-F8, 1-9)
    for (let i = 0; i < 9; i++) {
      const slot = this.createSkillSlot(i);
      this.skillSlots.set(i, slot);
      skillsContainer.addControl(slot);
    }

    this.guiTexture.addControl(this.panel);
  }

  private createSkillSlot(index: number): Rectangle {
    const slot = new Rectangle(`skill_slot_${index}`);
    slot.width = '50px';
    slot.height = '50px';
    slot.cornerRadius = 5;
    slot.color = '#6B5344';
    slot.thickness = 2;
    slot.background = 'rgba(0,0,0,0.5)';
    slot.paddingLeft = '5px';
    slot.paddingRight = '5px';
    slot.paddingTop = '5px';
    slot.paddingBottom = '5px';

    // Hotkey label
    const hotkey = index < 8 ? `F${index + 1}` : `${index - 7}`;
    const label = new TextBlock(`skill_hotkey_${index}`);
    label.text = hotkey;
    label.color = '#FFD700';
    label.fontSize = 10;
    label.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    slot.addControl(label);

    // Skill icon placeholder
    const icon = new Rectangle(`skill_icon_${index}`);
    icon.width = '30px';
    icon.height = '30px';
    icon.cornerRadius = 3;
    icon.color = '#00000000';
    icon.thickness = 1;
    icon.background = 'rgba(100,100,100,0.3)';
    icon.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    slot.addControl(icon);

    // Cooldown overlay
    const cooldownOverlay = new Rectangle(`skill_cooldown_${index}`);
    cooldownOverlay.width = '100%';
    cooldownOverlay.height = '100%';
    cooldownOverlay.cornerRadius = 5;
    cooldownOverlay.color = '#00000000';
    cooldownOverlay.thickness = 0;
    cooldownOverlay.background = 'rgba(0,0,0,0.7)';
    cooldownOverlay.alpha = 0;
    cooldownOverlay.isVisible = false;
    slot.addControl(cooldownOverlay);

    this.cooldownOverlays.set(index, cooldownOverlay);

    // Click handler
    slot.onPointerClickObservable.add(() => {
      this.onSkillUse(index);
    });

    return slot;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  setSkill(slotIndex: number, skill: SkillSlot | null): void {
    if (skill) {
      this.skillData.set(slotIndex, skill);
      this.updateSlotVisual(slotIndex, skill);
    } else {
      this.skillData.delete(slotIndex);
      this.clearSlot(slotIndex);
    }
  }

  updateCooldowns(): void {
    const now = Date.now();

    this.skillData.forEach((skill, index) => {
      if (skill.lastUsed) {
        const elapsed = now - skill.lastUsed;
        const remaining = Math.max(0, skill.cooldown - elapsed);

        const overlay = this.cooldownOverlays.get(index);
        if (overlay) {
          if (remaining > 0) {
            const percentage = remaining / skill.cooldown;
            overlay.height = `${percentage * 100}%`;
            overlay.isVisible = true;

            // Update cooldown text
            const seconds = Math.ceil(remaining / 1000);
            const existingText = this.guiTexture.getControlByName(`skill_cd_text_${index}`) as TextBlock;
            if (!existingText) {
              const cdText = new TextBlock(`skill_cd_text_${index}`);
              cdText.text = `${seconds}s`;
              cdText.color = '#FFFFFF';
              cdText.fontSize = 10;
              cdText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
              cdText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
              overlay.addControl(cdText);
            } else {
              existingText.text = `${seconds}s`;
            }
          } else {
            overlay.isVisible = false;
          }
        }
      }
    });
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private updateSlotVisual(index: number, skill: SkillSlot): void {
    const slot = this.skillSlots.get(index);
    if (!slot) return;

    // Update icon background (would use skill icon)
    const icon = this.guiTexture.getControlByName(`skill_icon_${index}`) as Rectangle;
    if (icon) {
      icon.color = '#8B0000'; // Dark red for skills
      icon.background = 'rgba(139,0,0,0.5)';
    }

    // Add skill name tooltip on hover
    slot.onPointerEnterObservable.add(() => {
      // Show tooltip with skill name and level
      console.log(`Skill: ${skill.name} Lv.${skill.level}`);
    });
  }

  private clearSlot(index: number): void {
    const slot = this.skillSlots.get(index);
    if (!slot) return;

    const icon = this.guiTexture.getControlByName(`skill_icon_${index}`) as Rectangle;
    if (icon) {
      icon.background = 'rgba(100,100,100,0.3)';
    }

    this.skillData.delete(index);
  }

  private onSkillUse(index: number): void {
    const skill = this.skillData.get(index);
    if (!skill) return;

    // Check cooldown
    const now = Date.now();
    if (skill.lastUsed && (now - skill.lastUsed) < skill.cooldown) {
      // Still on cooldown
      return;
    }

    // Use skill
    console.log(`Using skill: ${skill.name}`);

    // Set last used timestamp
    skill.lastUsed = now;

    // Start cooldown animation
    const overlay = this.cooldownOverlays.get(index);
    if (overlay) {
      overlay.isVisible = true;
      overlay.height = '100%'; // Full height initially
    }

    // Emit skill use event
    const guiAny = this.guiTexture as any;
    guiAny.onSkillUseObservable?.notifyObservers(skill);
  }

  dispose(): void {
    this.panel?.dispose();
    this.skillSlots.clear();
    this.cooldownOverlays.clear();
    this.skillData.clear();
  }
}

export default SkillBar;
