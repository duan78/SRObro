/**
 * SRObro - Input Manager
 * Handles all keyboard and mouse input
 */

import type { Scene } from '@babylonjs/core';

export interface InputState {
  // Movement keys
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;

  // Action keys
  jump: boolean;
  attack: boolean;

  // Modifier keys
  shift: boolean;
  ctrl: boolean;
  alt: boolean;

  // Mouse
  mouseX: number;
  mouseY: number;
  mouseButtonLeft: boolean;
  mouseButtonRight: boolean;
  mouseButtonMiddle: boolean;
}

export class InputManager {
  private scene: Scene;
  private state: InputState;
  private canvas: HTMLCanvasElement;

  // Callbacks
  private onKeyDownCallback?: (key: string) => void;
  private onKeyUpCallback?: (key: string) => void;
  private onMouseMoveCallback?: (x: number, y: number) => void;
  private onMouseDownCallback?: (button: number) => void;
  private onMouseUpCallback?: (button: number) => void;

  // Priority 1: Hotkey callbacks
  private onHotkeyUseCallback?: (slotType: string, slotIndex: number) => void;
  private onPickupAllCallback?: () => void;

  // Track function key presses for Ctrl modifier
  private functionKeyPressed: string | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.canvas = this.scene.getEngine().getRenderingCanvas()!;

    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      attack: false,
      shift: false,
      ctrl: false,
      alt: false,
      mouseX: 0,
      mouseY: 0,
      mouseButtonLeft: false,
      mouseButtonRight: false,
      mouseButtonMiddle: false,
    };

    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Keyboard events
    this.canvas.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('keyup', this.handleKeyUp);

    // Mouse events
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);

    // Prevent context menu
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Handle key down event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = event.code;

    // Update state
    switch (key) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = true;
        break;
      case 'Space':
        this.state.jump = true;
        // Priority 1: Space = Pickup all nearby items
        this.onPickupAllCallback?.();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.state.shift = true;
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.state.ctrl = true;
        break;
      case 'AltLeft':
      case 'AltRight':
        this.state.alt = true;
        break;
    }

    // Priority 1: Hotkeys - F1-F8
    if (key.startsWith('F') && key.length === 2) {
      const fKeyNum = parseInt(key.slice(1));
      if (fKeyNum >= 1 && fKeyNum <= 8) {
        if (this.state.ctrl) {
          // Ctrl+F1-F8
          this.onHotkeyUseCallback?.('ctrl_F1-F8', fKeyNum - 1);
        } else {
          // F1-F8
          this.functionKeyPressed = key;
          this.onHotkeyUseCallback?.('F1-F8', fKeyNum - 1);
        }
      }
    }

    // Priority 1: Hotkeys - 1-9
    if (key.startsWith('Digit') && key.length === 5) {
      const digitNum = parseInt(key.slice(5));
      if (this.state.alt) {
        // Alt+1-9
        this.onHotkeyUseCallback?.('alt_1-9', digitNum - 1);
      } else {
        // 1-9
        this.onHotkeyUseCallback?.('1-9', digitNum - 1);
      }
    }

    this.onKeyDownCallback?.(key);
  };

  /**
   * Handle key up event
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = event.code;

    // Update state
    switch (key) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = false;
        break;
      case 'Space':
        this.state.jump = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.state.shift = false;
        break;
      case 'ControlLeft':
      case 'ControlRight':
        this.state.ctrl = false;
        break;
      case 'AltLeft':
      case 'AltRight':
        this.state.alt = false;
        break;
    }

    this.onKeyUpCallback?.(key);
  };

  /**
   * Handle mouse move event
   */
  private handleMouseMove = (event: MouseEvent): void => {
    this.state.mouseX = event.clientX;
    this.state.mouseY = event.clientY;

    this.onMouseMoveCallback?.(event.clientX, event.clientY);
  };

  /**
   * Handle mouse down event
   */
  private handleMouseDown = (event: MouseEvent): void => {
    switch (event.button) {
      case 0:
        this.state.mouseButtonLeft = true;
        break;
      case 1:
        this.state.mouseButtonMiddle = true;
        break;
      case 2:
        this.state.mouseButtonRight = true;
        break;
    }

    this.onMouseDownCallback?.(event.button);
  };

  /**
   * Handle mouse up event
   */
  private handleMouseUp = (event: MouseEvent): void => {
    switch (event.button) {
      case 0:
        this.state.mouseButtonLeft = false;
        break;
      case 1:
        this.state.mouseButtonMiddle = false;
        break;
      case 2:
        this.state.mouseButtonRight = false;
        break;
    }

    this.onMouseUpCallback?.(event.button);
  };

  /**
   * Get input state
   */
  getState(): Readonly<InputState> {
    return this.state;
  };

  /**
   * Check if a key is pressed
   */
  isKeyPressed(key: string): boolean {
    switch (key) {
      case 'forward':
        return this.state.forward;
      case 'backward':
        return this.state.backward;
      case 'left':
        return this.state.left;
      case 'right':
        return this.state.right;
      case 'jump':
        return this.state.jump;
      case 'shift':
        return this.state.shift;
      case 'ctrl':
        return this.state.ctrl;
      case 'alt':
        return this.state.alt;
      default:
        return false;
    }
  }

  /**
   * Check if a mouse button is pressed
   */
  isMouseButtonPressed(button: 'left' | 'right' | 'middle'): boolean {
    switch (button) {
      case 'left':
        return this.state.mouseButtonLeft;
      case 'right':
        return this.state.mouseButtonRight;
      case 'middle':
        return this.state.mouseButtonMiddle;
      default:
        return false;
    }
  }

  /**
   * Set callback for key down events
   */
  onKeyDown(callback: (key: string) => void): void {
    this.onKeyDownCallback = callback;
  }

  /**
   * Set callback for key up events
   */
  onKeyUp(callback: (key: string) => void): void {
    this.onKeyUpCallback = callback;
  }

  /**
   * Set callback for mouse move events
   */
  onMouseMove(callback: (x: number, y: number) => void): void {
    this.onMouseMoveCallback = callback;
  }

  /**
   * Set callback for mouse down events
   */
  onMouseDown(callback: (button: number) => void): void {
    this.onMouseDownCallback = callback;
  }

  /**
   * Set callback for mouse up events
   */
  onMouseUp(callback: (button: number) => void): void {
    this.onMouseUpCallback = callback;
  }

  // ============================================
  // PRIORITY 1 FEATURE CALLBACKS
  // ============================================

  /**
   * Set callback for hotkey use
   */
  onHotkeyUse(callback: (slotType: string, slotIndex: number) => void): void {
    this.onHotkeyUseCallback = callback;
  }

  /**
   * Set callback for pickup all
   */
  onPickupAll(callback: () => void): void {
    this.onPickupAllCallback = callback;
  }

  /**
   * Update input manager
   */
  update(deltaTime: number): void {
    // Placeholder for any per-frame updates
  }

  /**
   * Clean up event listeners
   */
  dispose(): void {
    this.canvas.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
  }
}
