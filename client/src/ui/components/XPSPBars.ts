/**
 * SRObro - XP/SP Bars Component
 * Displays experience and skill point progress bars with percentages
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control
} from '@babylonjs/gui';

export interface XPSPData {
  level: number;
  currentExp: number;
  nextLevelExp: number;
  currentSP: number;
  maxSP: number;
}

export class XPSPBars {
  private container: Rectangle | null = null;
  private xpBarFill: Rectangle | null = null;
  private spBarFill: Rectangle | null = null;
  private xpPercentageText: TextBlock | null = null;
  private spPercentageText: TextBlock | null = null;
  private xpValueText: TextBlock | null = null;
  private spValueText: TextBlock | null = null;
  private levelText: TextBlock |null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createContainer();
  }

  private createContainer(): void {
    // Main container (positioned at top-center like SRO)
    this.container = new Rectangle('xpsp_container');
    this.container.width = '400px';
    this.container.height = '80px';
    this.container.cornerRadius = 8;
    this.container.color = '#4a3728'; // Dark brown border
    this.container.thickness = 2;
    this.container.background = 'rgba(0,0,0,0.85)';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.container.top = '60px'; // Below the stats panel
    this.container.paddingLeft = '10px';
    this.container.paddingRight = '10px';
    this.container.paddingTop = '8px';
    this.container.paddingBottom = '8px';

    this.guiTexture.addControl(this.container);

    // Level indicator
    this.levelText = new TextBlock('level_text', 'Lv.1');
    this.levelText.color = '#FFD700'; // Gold
    this.levelText.fontSize = 18;
    this.levelText.fontWeight = 'bold';
    this.levelText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.levelText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.container.addControl(this.levelText);

    // XP Bar
    this.createXPBar();

    // SP Bar
    this.createSPBar();
  }

  private createXPBar(): void {
    // XP bar container
    const xpContainer = new Rectangle('xp_bar_container');
    xpContainer.width = '100%';
    xpContainer.height = '28px';
    xpContainer.top = '22px';
    xpContainer.cornerRadius = 4;
    xpContainer.color = '#000000';
    xpContainer.thickness = 1;
    xpContainer.background = 'rgba(30,30,30,0.9)';
    this.container!.addControl(xpContainer);

    // XP label
    const xpLabel = new TextBlock('xp_label', 'EXP');
    xpLabel.color = '#FFFFFF';
    xpLabel.fontSize = 11;
    xpLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    xpLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    xpLabel.left = '5px';
    xpContainer.addControl(xpLabel);

    // XP background fill
    const xpBg = new Rectangle('xp_bar_bg');
    xpBg.width = '88%';
    xpBg.height = '70%';
    xpBg.cornerRadius = 2;
    xpBg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    xpBg.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    xpBg.color = '#00000000';
    xpBg.thickness = 0;
    xpBg.background = 'rgba(50,50,50,0.8)';
    xpContainer.addControl(xpBg);

    // XP fill (yellow)
    this.xpBarFill = new Rectangle('xp_bar_fill');
    this.xpBarFill.width = '0%';
    this.xpBarFill.height = '100%';
    this.xpBarFill.cornerRadius = 2;
    this.xpBarFill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.xpBarFill.color = '#00000000';
    this.xpBarFill.thickness = 0;
    this.xpBarFill.background = '#FFD700'; // Gold/Yellow like SRO
    xpBg.addControl(this.xpBarFill);

    // XP percentage text
    this.xpPercentageText = new TextBlock('xp_percent', '0%');
    this.xpPercentageText.color = '#FFFFFF';
    this.xpPercentageText.fontSize = 10;
    this.xpPercentageText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.xpPercentageText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    xpBg.addControl(this.xpPercentageText);

    // XP value text (right side of container)
    this.xpValueText = new TextBlock('xp_value', '0 / 0');
    this.xpValueText.color = '#AAAAAA';
    this.xpValueText.fontSize = 9;
    this.xpValueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.xpValueText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.xpValueText.left = '-5px';
    xpContainer.addControl(this.xpValueText);
  }

  private createSPBar(): void {
    // SP bar container
    const spContainer = new Rectangle('sp_bar_container');
    spContainer.width = '100%';
    spContainer.height = '28px';
    spContainer.top = '52px';
    spContainer.cornerRadius = 4;
    spContainer.color = '#000000';
    spContainer.thickness = 1;
    spContainer.background = 'rgba(30,30,30,0.9)';
    this.container!.addControl(spContainer);

    // SP label
    const spLabel = new TextBlock('sp_label', 'SP');
    spLabel.color = '#FFFFFF';
    spLabel.fontSize = 11;
    spLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    spLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    spLabel.left = '5px';
    spContainer.addControl(spLabel);

    // SP background fill
    const spBg = new Rectangle('sp_bar_bg');
    spBg.width = '88%';
    spBg.height = '70%';
    spBg.cornerRadius = 2;
    spBg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    spBg.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    spBg.color = '#00000000';
    spBg.thickness = 0;
    spBg.background = 'rgba(50,50,50,0.8)';
    spContainer.addControl(spBg);

    // SP fill (blue)
    this.spBarFill = new Rectangle('sp_bar_fill');
    this.spBarFill.width = '0%';
    this.spBarFill.height = '100%';
    this.spBarFill.cornerRadius = 2;
    this.spBarFill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.spBarFill.color = '#00000000';
    this.spBarFill.thickness = 0;
    this.spBarFill.background = '#4169E1'; // Royal blue like SRO
    spBg.addControl(this.spBarFill);

    // SP percentage text
    this.spPercentageText = new TextBlock('sp_percent', '0%');
    this.spPercentageText.color = '#FFFFFF';
    this.spPercentageText.fontSize = 10;
    this.spPercentageText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.spPercentageText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    spBg.addControl(this.spPercentageText);

    // SP value text (right side of container)
    this.spValueText = new TextBlock('sp_value', '0 / 0');
    this.spValueText.color = '#AAAAAA';
    this.spValueText.fontSize = 9;
    this.spValueText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.spValueText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.spValueText.left = '-5px';
    spContainer.addControl(this.spValueText);
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Update XP/SP bars with new data
   */
  update(data: XPSPData): void {
    // Update level
    if (this.levelText) {
      this.levelText.text = `Lv.${data.level}`;
    }

    // Calculate XP percentage (cap at 99.9% to prevent overflow)
    const xpPercent = data.nextLevelExp > 0
      ? Math.min(99.9, (data.currentExp / data.nextLevelExp) * 100)
      : 0;

    // Update XP bar
    if (this.xpBarFill) {
      this.xpBarFill.width = `${xpPercent}%`;
    }

    // Update XP percentage text
    if (this.xpPercentageText) {
      this.xpPercentageText.text = `${xpPercent.toFixed(1)}%`;
    }

    // Update XP value text (use K notation for large numbers)
    if (this.xpValueText) {
      const current = this.formatNumber(data.currentExp);
      const next = this.formatNumber(data.nextLevelExp);
      this.xpValueText.text = `${current} / ${next}`;
    }

    // Calculate SP percentage
    const spPercent = data.maxSP > 0
      ? Math.min(100, (data.currentSP / data.maxSP) * 100)
      : 0;

    // Update SP bar
    if (this.spBarFill) {
      this.spBarFill.width = `${spPercent}%`;
    }

    // Update SP percentage text
    if (this.spPercentageText) {
      this.spPercentageText.text = `${spPercent.toFixed(1)}%`;
    }

    // Update SP value text
    if (this.spValueText) {
      const current = this.formatNumber(data.currentSP);
      const max = this.formatNumber(data.maxSP);
      this.spValueText.text = `${current} / ${max}`;
    }
  }

  /**
   * Animate XP gain (flash effect)
   */
  animateXPGain(amount: number): void {
    if (!this.xpBarFill) return;

    // Flash effect
    const originalBackground = this.xpBarFill.background;
    this.xpBarFill.background = '#FFFFFF'; // Flash white

    setTimeout(() => {
      if (this.xpBarFill) {
        this.xpBarFill.background = originalBackground;
      }
    }, 200);

    console.log(`+${this.formatNumber(amount)} XP gained!`);
  }

  /**
   * Animate SP gain (flash effect)
   */
  animateSPGain(amount: number): void {
    if (!this.spBarFill) return;

    // Flash effect
    const originalBackground = this.spBarFill.background;
    this.spBarFill.background = '#FFFFFF'; // Flash white

    setTimeout(() => {
      if (this.spBarFill) {
        this.spBarFill.background = originalBackground;
      }
    }, 200);

    console.log(`+${this.formatNumber(amount)} SP gained!`);
  }

  /**
   * Level up animation
   */
  animateLevelUp(): void {
    if (!this.container || !this.levelText) return;

    // Pulse animation
    let scale = 1.0;
    let growing = true;
    const animationInterval = setInterval(() => {
      if (growing) {
        scale += 0.1;
        if (scale >= 1.3) growing = false;
      } else {
        scale -= 0.1;
        if (scale <= 1.0) {
          scale = 1.0;
          clearInterval(animationInterval);
        }
      }
      this.levelText!.fontSize = 18 * scale;
    }, 50);

    // Show notification
    console.log('LEVEL UP!');
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  dispose(): void {
    this.container?.dispose();
    this.xpBarFill = null;
    this.spBarFill = null;
    this.xpPercentageText = null;
    this.spPercentageText = null;
    this.xpValueText = null;
    this.spValueText = null;
    this.levelText = null;
  }
}

export default XPSPBars;
