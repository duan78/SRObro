// ============================================
// SRObro - Client Game Loop
// Babylon.js-based game loop for client-side updates
// ============================================

import type { Scene } from '@babylonjs/core';
import { EventEmitter } from 'events';

/**
 * Update event data
 */
export interface UpdateEvent {
  delta: number;
  timestamp: number;
  frame: number;
}

/**
 * Render event data
 */
export interface RenderEvent {
  delta: number;
  timestamp: number;
  frame: number;
  fps: number;
}

/**
 * GameLoop configuration
 */
export interface GameLoopConfig {
  /**
   * Target FPS
   * @default 60
   */
  targetFPS?: number;

  /**
   * Enable FPS monitoring
   * @default true
   */
  enableFPSMonitoring?: boolean;

  /**
   * Fixed timestep for physics (in seconds)
   * @default 1/60
   */
  fixedTimestep?: number;

  /**
   * Maximum frame time to prevent spiral of death
   * @default 0.25 (250ms)
   */
  maxFrameTime?: number;
}

/**
 * GameLoop
 *
 * Client-side game loop that integrates with Babylon.js render loop.
 * Handles update and render callbacks at appropriate rates.
 */
export class GameLoop extends EventEmitter {
  private scene: Scene;
  private config: Required<GameLoopConfig>;

  private _isRunning: boolean = false;
  private currentFrame: number = 0;
  private lastTime: number = 0;
  private accumulator: number = 0;

  // FPS monitoring
  private fpsUpdateInterval: number = 1000; // Update FPS display every 1 second
  private lastFPSUpdate: number = 0;
  private framesSinceLastUpdate: number = 0;
  private currentFPS: number = 60;

  // Register/unregister tokens for Babylon.js
  private onBeforeRenderObservableToken: any = null;

  constructor(scene: Scene, config: GameLoopConfig = {}) {
    super();

    this.scene = scene;

    // Set default config
    this.config = {
      targetFPS: config.targetFPS ?? 60,
      enableFPSMonitoring: config.enableFPSMonitoring ?? true,
      fixedTimestep: config.fixedTimestep ?? 1 / 60,
      maxFrameTime: config.maxFrameTime ?? 0.25,
    };

    console.log('[GameLoop] Initialized with config:', this.config);
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this._isRunning) {
      console.warn('[GameLoop] Already running');
      return;
    }

    this._isRunning = true;
    this.lastTime = performance.now();
    this.lastFPSUpdate = this.lastTime;

    // Register with Babylon.js render loop
    this.onBeforeRenderObservableToken = this.scene.onBeforeRenderObservable.add(() => {
      this.onBeforeRender();
    });

    console.log('[GameLoop] Started');
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;

    // Unregister from Babylon.js render loop
    if (this.onBeforeRenderObservableToken !== null) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObservableToken);
      this.onBeforeRenderObservableToken = null;
    }

    console.log('[GameLoop] Stopped');
  }

  /**
   * Check if the game loop is running
   */
  public isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Get the current frame number
   */
  public getCurrentFrame(): number {
    return this.currentFrame;
  }

  /**
   * Get the current FPS
   */
  public getCurrentFPS(): number {
    return this.currentFPS;
  }

  /**
   * Reset the game loop state
   */
  public reset(): void {
    this.currentFrame = 0;
    this.accumulator = 0;
    this.lastTime = performance.now();
    console.log('[GameLoop] Reset');
  }

  /**
   * Called before each frame by Babylon.js
   */
  private onBeforeRender(): void {
    const currentTime = performance.now();
    let frameTime = (currentTime - this.lastTime) / 1000; // Convert to seconds

    // Cap frame time to prevent spiral of death
    if (frameTime > this.config.maxFrameTime) {
      frameTime = this.config.maxFrameTime;
    }

    this.lastTime = currentTime;

    // Update FPS counter
    this.framesSinceLastUpdate++;
    if (this.config.enableFPSMonitoring && currentTime - this.lastFPSUpdate >= this.fpsUpdateInterval) {
      this.currentFPS = this.framesSinceLastUpdate / ((currentTime - this.lastFPSUpdate) / 1000);
      this.lastFPSUpdate = currentTime;
      this.framesSinceLastUpdate = 0;

      // Emit FPS update event
      this.emit('fps', this.currentFPS);
    }

    // Fixed timestep update loop
    this.accumulator += frameTime;

    while (this.accumulator >= this.config.fixedTimestep) {
      // Emit update event
      this.emit('update', {
        delta: this.config.fixedTimestep,
        timestamp: currentTime,
        frame: this.currentFrame,
      } as UpdateEvent);

      this.accumulator -= this.config.fixedTimestep;
    }

    // Emit render event (with interpolation factor)
    const alpha = this.accumulator / this.config.fixedTimestep;

    this.emit('render', {
      delta: frameTime,
      timestamp: currentTime,
      frame: this.currentFrame,
      fps: this.currentFPS,
    } as RenderEvent);

    // Emit interpolation factor for smooth rendering
    this.emit('interpolate', alpha);

    this.currentFrame++;
  }

  /**
   * Update the game loop configuration at runtime
   */
  public updateConfig(config: Partial<GameLoopConfig>): void {
    if (config.targetFPS !== undefined) {
      this.config.targetFPS = config.targetFPS;
    }
    if (config.enableFPSMonitoring !== undefined) {
      this.config.enableFPSMonitoring = config.enableFPSMonitoring;
    }
    if (config.fixedTimestep !== undefined) {
      this.config.fixedTimestep = config.fixedTimestep;
    }
    if (config.maxFrameTime !== undefined) {
      this.config.maxFrameTime = config.maxFrameTime;
    }

    console.log('[GameLoop] Config updated:', this.config);
  }

  /**
   * Get the current configuration
   */
  public getConfig(): Readonly<Required<GameLoopConfig>> {
    return this.config;
  }

  /**
   * Dispose of the game loop and clean up resources
   */
  public dispose(): void {
    this.stop();
    this.removeAllListeners();
    console.log('[GameLoop] Disposed');
  }
}

/**
 * Create a game loop attached to a scene
 *
 * @param scene - Babylon.js scene
 * @param config - Game loop configuration
 * @returns GameLoop instance
 */
export function createGameLoop(scene: Scene, config?: GameLoopConfig): GameLoop {
  return new GameLoop(scene, config);
}
