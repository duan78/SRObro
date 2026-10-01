/**
 * SRObro - Main Entry Point
 * Babylon.js WebGL Client
 */

import {
  Engine,
  Scene,
  Vector3,
  Color4,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  SceneLoader,
} from '@babylonjs/core';
// Import GLB loader for .glb file support
import { GLTFFileLoader } from '@babylonjs/loaders/glTF';
import { Game } from './core/Game';

// Register GLTF loader
SceneLoader.RegisterPlugin(new GLTFFileLoader());
import { NetworkManager } from './network/NetworkManager';
import { UIManager } from './ui/UIManager';

// Global app state
interface AppState {
  engine: Engine | null;
  game: Game | null;
  network: NetworkManager | null;
  ui: UIManager | null;
}

const appState: AppState = {
  engine: null,
  game: null,
  network: null,
  ui: null,
};

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Render canvas not found');
  }

  // Initialize Babylon.js engine
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true,
  });

  appState.engine = engine;

  // Initialize network manager
  const network = new NetworkManager('ws://localhost:3001');
  appState.network = network;

  // Initialize UI manager (don't initialize yet, wait for scene)
  const ui = new UIManager();
  appState.ui = ui;

  // Initialize game
  const game = new Game(engine, network, ui);
  appState.game = game;

  // Set up window resize handler
  window.addEventListener('resize', () => {
    engine.resize();
  });

  // Show loading progress
  updateLoadingProgress(10);

  try {
    // MVP: Skip server connection for single-player testing
    updateLoadingProgress(20, 'Starting in single-player mode...');
    // await network.connect();

    // Initialize game scene
    updateLoadingProgress(40, 'Loading game assets...');
    await game.initialize();

    // Initialize UI after scene is created
    updateLoadingProgress(60, 'Creating user interface...');
    ui.initialize();

    updateLoadingProgress(80, 'Preparing game world...');

    // Start the game loop
    updateLoadingProgress(100, 'Ready!');
    await game.start();

    // Hide loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }, 500);

  } catch (error) {
    console.error('Failed to initialize game:', error);
    updateLoadingProgress(0, 'Failed to load. Please refresh.');
  }
}

/**
 * Update loading screen progress
 */
function updateLoadingProgress(percent: number, text?: string): void {
  const progressBar = document.getElementById('progress-bar') as HTMLElement;
  const loadingText = document.querySelector('.loading-text') as HTMLElement;

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }

  if (loadingText && text) {
    loadingText.textContent = text;
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
export default appState;
