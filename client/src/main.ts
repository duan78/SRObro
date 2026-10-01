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
import { DomHud } from './ui/dom/DomHud';

// Register GLTF loader
SceneLoader.RegisterPlugin(new GLTFFileLoader());
import { NetworkManager } from './network/NetworkManager';
import { UIManager } from './ui/UIManager';
import { AuthScreen } from './ui/dom/AuthScreen';
import { NetworkCombat } from './game/NetworkCombat';

// Collecte des erreurs console pour diagnostic navigateur (window.__errors)
(function installErrorCollector(): void {
  const w = window as unknown as { __errors: string[] };
  w.__errors = [];
  const wrap = (orig: (...args: unknown[]) => void, level: string): ((...a: unknown[]) => void) => {
    return (...args: unknown[]) => {
      try {
        w.__errors.push(level + ': ' + args.map((a) => {
          if (a instanceof Error) return a.message;
          if (typeof a === 'string') return a;
          try { return JSON.stringify(a)?.slice(0, 300) ?? String(a); } catch { return String(a); }
        }).join(' '));
        if (w.__errors.length > 200) w.__errors.shift();
      } catch { /* ne jamais casser console */ }
      orig(...args);
    };
  };
  (window as unknown as { console: Record<string, (...a: unknown[]) => void> }).console.error = wrap(console.error.bind(console), 'error');
  (window as unknown as { console: Record<string, (...a: unknown[]) => void> }).console.warn = wrap(console.warn.bind(console), 'warn');
})();

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

  // Initialize network manager (127.0.0.1 explicite: le serveur écoute en
  // IPv4 et "localhost" peut résoudre en ::1 sur cette machine)
  const network = new NetworkManager('ws://127.0.0.1:3001');
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
    // Re-layout the GUI after a canvas resize
    appState.ui?.guiTexture?.markAsDirty();
  });

  // Show loading progress
  updateLoadingProgress(10);

  try {
    // Authentification réseau: connexion Socket.io puis écran de login /
    // sélection de personnage. Le jeu démarre avec un perso chargé, ou en
    // mode dégradé (null) si l'utilisateur choisit explicitement "hors-ligne".
    updateLoadingProgress(20, 'Connexion au serveur...');
    const authScreen = new AuthScreen(network);
    const character = await new Promise<{
      id: string; name: string; race: string; gender: string; level: number;
      hp: number; mp: number; maxHp: number; maxMp: number; str: number; int: number;
      exp: number; sp: number; gold: number;
      position: { x: number; y: number; z: number }; rotation: number;
    } | null>((resolve) => {
      authScreen.onComplete = (c) => resolve(c ?? null);
      void authScreen.start().catch((err) => {
        console.error('Auth failed:', err);
        resolve(null);
      });
    });

    const singlePlayer = character === null;
    if (singlePlayer) {
      console.warn('[Main] Mode dégradé: démarrage local de test (sans serveur)');
    }

    // Initialize game scene
    updateLoadingProgress(40, 'Loading game assets...');
    await game.initialize(character ?? undefined);

    updateLoadingProgress(80, 'Preparing game world...');

    // Start the game loop
    updateLoadingProgress(100, 'Ready!');
    await game.start();

    // Initialize UI AFTER the render loop runs: une ADT fullscreen créée avant
    // le premier render() peut rester vierge (texture jamais redessinée).
    updateLoadingProgress(90, 'Creating user interface...');
    ui.initialize();
    ui.guiTexture?.markAsDirty();

    // HUD DOM overlay (fiable) branché sur l'état du jeu
    const hud = new DomHud();
    (window as unknown as { hud: DomHud }).hud = hud;

    // Combat réseau (monstres serveur, ciblage, skills, HUD, mort, loot)
    let netCombat: NetworkCombat | null = null;
    if (!singlePlayer && game.getScene() && game.getAssetLoader()) {
      netCombat = new NetworkCombat(game.getScene()!, network, game.getAssetLoader()!, hud, game.getJanganZone());
      netCombat.playerName = character?.name ?? 'Aventurier';
      (window as unknown as { netCombat: NetworkCombat }).netCombat = netCombat;
      game.getScene()!.onBeforeRenderObservable.add(() => netCombat!.update());
    }
    const g = game as unknown as {
      progression?: {
        getLevel(): number; getHP(): number; getMaxHP(): number;
        getMP(): number; getMaxMP(): number; getCurrentXP(): number;
        getCurrentLevelXP(): number; getNextLevelXP(): number;
      };
      combat?: { currentTarget?: { name?: string; level?: number; hp: number; maxHp: number; isDead: boolean } | null };
      scene?: { activeCamera?: { position: { x: number; z: number } } };
    };
    const refreshHud = (): void => {
      // En mode réseau, l'état serveur est la source (HUD exact)
      if (netCombat?.playerState) {
        netCombat.refreshHud();
      } else {
        const p = g.progression;
        if (p) {
          const cur = p.getCurrentLevelXP();
          const next = p.getNextLevelXP();
          hud.setStats({
            name: character?.name ?? 'Adventurer',
            level: p.getLevel(),
            hp: p.getHP(),
            maxHp: p.getMaxHP(),
            mp: p.getMP(),
            maxMp: p.getMaxMP(),
            exp: Math.max(0, p.getCurrentXP() - cur),
            maxExp: Math.max(1, next - cur),
            gold: character?.gold ?? 0,
          });
        }
      }
      const t = g.combat?.currentTarget;
      if (t && !t.isDead && t.hp > 0) {
        hud.showTarget({ name: t.name ?? 'Monster', level: t.level ?? 1, hp: t.hp, maxHp: t.maxHp || t.hp });
      } else {
        hud.showTarget(null);
      }
      const cam = g.scene?.activeCamera;
      if (cam) hud.setCoords(cam.position.x, cam.position.z);
    };
    refreshHud();
    window.setInterval(refreshHud, 400);

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
    // Ne pas laisser l'engine consommer le contexte WebGL après un échec d'init
    try {
      appState.game?.dispose();
    } catch { /* la scène a pu ne jamais être créée */ }
    appState.engine?.dispose();
    appState.engine = null;
    appState.game = null;
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

// Expose for live diagnostics (browser console / tests)
(window as unknown as { appState: typeof appState }).appState = appState;
