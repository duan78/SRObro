/**
 * SRObro - Casting Bar Component
 * Displays skill casting progress with interrupt notification
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control
} from '@babylonjs/gui';

import type { CastingState } from '../../../../shared/src/types';

export class CastingBar {
  private container: Rectangle | null = null;
  private barFill: Rectangle | null = null;
  private skillNameText: TextBlock | null = null;
  private timeText: TextBlock | null = null;
  private interruptOverlay: Rectangle | null = null;

  private currentCasting: CastingState | null = null;
  private updateInterval: number | null = null;

  constructor(private guiTexture: AdvancedDynamicTexture) {
    this.createContainer();
  }

  private createContainer(): void {
    // Main container (positioned above character/center screen)
    this.container = new Rectangle('casting_bar_container');
    this.container.width = '250px';
    this.container.height = '40px';
    this.container.cornerRadius = 6;
    this.container.color = '#4a3728';
    this.container.thickness = 2;
    this.container.background = 'rgba(0,0,0,0.9)';
    this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.container.top = '-100px'; // Above center
    this.container.isVisible = false; // Hidden by default
    this.container.alpha = 0.95;

    this.guiTexture.addControl(this.container);

    // Skill name
    this.skillNameText = new TextBlock('casting_skill_name', '');
    this.skillNameText.color = '#FFD700';
    this.skillNameText.fontSize = 12;
    this.skillNameText.fontWeight = 'bold';
    this.skillNameText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.skillNameText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.skillNameText.left = '5px';
    this.skillNameText.top = '3px';
    this.container.addControl(this.skillNameText);

    // Cast time remaining
    this.timeText = new TextBlock('casting_time', '');
    this.timeText.color = '#FFFFFF';
    this.timeText.fontSize = 10;
    this.timeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.timeText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.timeText.paddingRight = '5px';
    this.timeText.top = '3px';
    this.container.addControl(this.timeText);

    // Progress bar container
    const barContainer = new Rectangle('casting_bar_bg');
    barContainer.width = '240px';
    barContainer.height = '12px';
    barContainer.top = '18px';
    barContainer.cornerRadius = 3;
    barContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    barContainer.color = '#000000';
    barContainer.thickness = 1;
    barContainer.background = 'rgba(30,30,30,0.9)';
    this.container.addControl(barContainer);

    // Progress fill (changes color based on progress)
    this.barFill = new Rectangle('casting_bar_fill');
    this.barFill.width = '0%';
    this.barFill.height = '100%';
    this.barFill.cornerRadius = 2;
    this.barFill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.barFill.color = '#00000000';
    this.barFill.thickness = 0;
    this.barFill.background = '#00FF00'; // Start green
    barContainer.addControl(this.barFill);

    // Interrupt overlay (red flash when interrupted)
    this.interruptOverlay = new Rectangle('casting_interrupt');
    this.interruptOverlay.width = '100%';
    this.interruptOverlay.height = '100%';
    this.interruptOverlay.cornerRadius = 6;
    this.interruptOverlay.color = '#00000000';
    this.interruptOverlay.thickness = 0;
    this.interruptOverlay.background = 'rgba(255,0,0,0.5)';
    this.interruptOverlay.isVisible = false;
    this.interruptOverlay.isHitTestVisible = false;
    this.container.addControl(this.interruptOverlay);
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Start casting a skill
   */
  startCasting(casting: CastingState): void {
    if (!casting.isCasting || !casting.skillId) {
      this.hide();
      return;
    }

    this.currentCasting = casting;

    // Update UI
    if (this.skillNameText) {
      this.skillNameText.text = casting.skillName || 'Casting...';
    }

    if (this.container) {
      this.container.isVisible = true;
    }

    // Reset bar
    if (this.barFill) {
      this.barFill.width = '0%';
      this.barFill.background = '#00FF00';
    }

    // Hide interrupt overlay
    if (this.interruptOverlay) {
      this.interruptOverlay.isVisible = false;
    }

    // Start update loop
    this.startUpdateLoop();
  }

  /**
   * Update casting progress
   */
  updateProgress(casting: CastingState): void {
    if (!casting.isCasting) {
      this.hide();
      return;
    }

    this.currentCasting = casting;

    // Update progress bar
    const percent = casting.progress * 100;
    if (this.barFill) {
      this.barFill.width = `${percent}%`;

      // Change color based on progress
      if (percent < 33) {
        this.barFill.background = '#00FF00'; // Green
      } else if (percent < 66) {
        this.barFill.background = '#FFFF00'; // Yellow
      } else {
        this.barFill.background = '#FF8C00'; // Orange
      }
    }

    // Update time text
    if (this.timeText) {
      const elapsed = Date.now() - casting.startTime;
      const remaining = Math.max(0, casting.castTime - elapsed);
      this.timeText.text = `${(remaining / 1000).toFixed(1)}s`;
    }
  }

  /**
   * Interrupt the current cast
   */
  interrupt(): void {
    if (!this.currentCasting || !this.currentCasting.isCasting) {
      return;
    }

    // Show interrupt overlay
    if (this.interruptOverlay) {
      this.interruptOverlay.isVisible = true;
    }

    // Flash red
    if (this.container) {
      this.container.color = '#FF0000';
    }

    // Show interrupted text
    if (this.skillNameText) {
      this.skillNameText.text = 'Interrupted!';
      this.skillNameText.color = '#FF0000';
    }

    // Hide after short delay
    setTimeout(() => {
      this.hide();
    }, 500);

    // Clear casting state
    this.currentCasting = null;
    this.stopUpdateLoop();
  }

  /**
   * Complete the cast successfully
   */
  complete(): void {
    // Fill bar completely
    if (this.barFill) {
      this.barFill.width = '100%';
      this.barFill.background = '#00FF00';
    }

    // Clear casting state
    this.currentCasting = null;
    this.stopUpdateLoop();

    // Hide after short delay
    setTimeout(() => {
      this.hide();
    }, 200);
  }

  /**
   * Hide the casting bar
   */
  hide(): void {
    if (this.container) {
      this.container.isVisible = false;
    }

    // Reset colors
    if (this.container) {
      this.container.color = '#4a3728';
    }

    if (this.skillNameText) {
      this.skillNameText.color = '#FFD700';
    }

    if (this.interruptOverlay) {
      this.interruptOverlay.isVisible = false;
    }

    this.currentCasting = null;
    this.stopUpdateLoop();
  }

  /**
   * Check if currently casting
   */
  isCasting(): boolean {
    return this.currentCasting !== null && this.currentCasting.isCasting;
  }

  /**
   * Get current casting state
   */
  getCurrentCasting(): CastingState | null {
    return this.currentCasting;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private startUpdateLoop(): void {
    this.stopUpdateLoop();

    this.updateInterval = window.setInterval(() => {
      if (!this.currentCasting) {
        this.stopUpdateLoop();
        return;
      }

      // Calculate progress
      const elapsed = Date.now() - this.currentCasting.startTime;
      const progress = Math.min(1, elapsed / this.currentCasting.castTime);
      this.currentCasting.progress = progress;

      // Update UI
      this.updateProgress(this.currentCasting);

      // Check if complete
      if (progress >= 1) {
        this.complete();
      }
    }, 50); // Update 20 times per second
  }

  private stopUpdateLoop(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  dispose(): void {
    this.stopUpdateLoop();
    this.container?.dispose();
    this.barFill = null;
    this.skillNameText = null;
    this.timeText = null;
    this.interruptOverlay = null;
    this.currentCasting = null;
  }
}

export default CastingBar;
