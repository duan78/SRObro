/**
 * SRObro - Controls Help Panel
 * Shows keyboard and mouse controls to the player
 */

import {
  AdvancedDynamicTexture,
  Rectangle,
  TextBlock,
  Control,
  StackPanel
} from '@babylonjs/gui';

export class ControlsHelpPanel {
  private guiTexture: AdvancedDynamicTexture;
  private panel: Rectangle | null = null;
  private isVisible: boolean = false;

  constructor(guiTexture: AdvancedDynamicTexture) {
    this.guiTexture = guiTexture;
    this.createPanel();
  }

  /**
   * Create the help panel
   */
  private createPanel(): void {
    this.panel = new Rectangle('controls_help_panel');
    this.panel.width = '350px';
    this.panel.height = '450px';
    this.panel.cornerRadius = 10;
    this.panel.color = '#FFD700'; // Gold
    this.panel.thickness = 2;
    this.panel.background = 'rgba(0,0,0,0.85)';
    this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.panel.paddingLeft = '15px';
    this.panel.paddingRight = '15px';
    this.panel.paddingTop = '15px';
    this.panel.paddingBottom = '15px';

    // Title
    const title = new TextBlock('controls_title', '⚔️ CONTROLS ⚔️');
    title.color = '#FFD700';
    title.fontSize = 20;
    title.fontWeight = 'bold';
    title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.panel.addControl(title);

    // Controls list
    const stackPanel = new StackPanel('controls_stack');
    stackPanel.width = '100%';
    stackPanel.isVertical = true;
    stackPanel.spacing = 8;
    stackPanel.paddingTop = '15px';
    this.panel.addControl(stackPanel);

    // Add controls
    this.addControlEntry(stackPanel, 'Movement', 'W A S D', '#00BFFF');
    this.addControlEntry(stackPanel, 'Run', 'SHIFT', '#00BFFF');
    this.addControlEntry(stackPanel, 'Select/Attack', 'Left Click', '#FF6347');
    this.addControlEntry(stackPanel, 'Camera', 'Right Click + Drag', '#FF6347');
    this.addControlEntry(stackPanel, 'Inventory', 'I', '#98FB98');
    this.addControlEntry(stackPanel, 'Character', 'C', '#98FB98');
    this.addControlEntry(stackPanel, 'Skills', '1 - 9', '#98FB98');
    this.addControlEntry(stackPanel, 'Help Panel', 'H', '#FFD700');
    this.addControlEntry(stackPanel, 'HP Potion', 'F1', '#FF69B4');
    this.addControlEntry(stackPanel, 'MP Potion', 'F2', '#FF69B4');

    // Footer
    const footer = new TextBlock('controls_footer', 'Press H to toggle');
    footer.color = '#888888';
    footer.fontSize = 12;
    footer.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    footer.paddingTop = '10px';
    this.panel.addControl(footer);

    // Initially hide
    this.panel.isVisible = false;
    this.guiTexture.addControl(this.panel);
  }

  /**
   * Add a control entry to the stack panel
   */
  private addControlEntry(stackPanel: StackPanel, action: string, key: string, color: string): void {
    const entry = new Rectangle(`control_${action}`);
    entry.width = '100%';
    entry.height = '30px';
    entry.color = 'transparent';
    entry.background = 'transparent';
    entry.thickness = 0;

    const actionText = new TextBlock(`action_${action}`, action);
    actionText.color = '#FFFFFF';
    actionText.fontSize = 14;
    actionText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    actionText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    entry.addControl(actionText);

    const keyText = new TextBlock(`key_${action}`, key);
    keyText.color = color;
    keyText.fontSize = 14;
    keyText.fontWeight = 'bold';
    keyText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    keyText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    entry.addControl(keyText);

    stackPanel.addControl(entry);
  }

  /**
   * Toggle panel visibility
   */
  toggle(): void {
    this.isVisible = !this.isVisible;
    if (this.panel) {
      this.panel.isVisible = this.isVisible;
    }
  }

  /**
   * Show panel
   */
  show(): void {
    this.isVisible = true;
    if (this.panel) {
      this.panel.isVisible = true;
    }
  }

  /**
   * Hide panel
   */
  hide(): void {
    this.isVisible = false;
    if (this.panel) {
      this.panel.isVisible = false;
    }
  }

  /**
   * Dispose
   */
  dispose(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = null;
    }
  }
}
