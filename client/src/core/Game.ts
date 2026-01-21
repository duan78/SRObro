/**
 * SRObro - Core Game Class
 * Manages the game loop, scene, and core systems
 */

import {
  Engine,
  Scene,
  Vector3,
  Color4,
  FreeCamera,
  HemisphericLight,
  DirectionalLight,
  ShadowGenerator,
  Color3,
  AssetContainer,
} from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';
import { UIManager } from '../ui/UIManager';
import { CharacterManager } from '../game/CharacterManager';
import { WorldManager } from '../game/WorldManager';
import { InputManager } from './InputManager';
import { EntityManager } from '../game/EntityManager';
import { AssetLoader } from './AssetLoader';
import { ClientPrediction, LocalPlayerState } from './ClientPrediction';
import { EntityInterpolation } from './EntityInterpolation';
import { CharacterFactory } from '../gameplay/CharacterFactory';
import { DamageNumberManager } from '../combat/DamageNumberManager';
import { SkillEffectManager } from '../effects/SkillEffectManager';
import { initializeTestInterface } from '../test';

export class Game {
  private engine: Engine;
  private scene: Scene | null = null;
  private network: NetworkManager;
  private ui: UIManager;

  // Core systems
  private assetLoader: AssetLoader | null = null;
  private characterManager: CharacterManager | null = null;
  private worldManager: WorldManager | null = null;
  private inputManager: InputManager | null = null;
  private entityManager: EntityManager | null = null;

  // New Phase 3 & 4A systems
  private characterFactory: CharacterFactory | null = null;
  private damageNumberManager: DamageNumberManager | null = null;
  private skillEffectManager: SkillEffectManager | null = null;

  // Network synchronization systems
  private prediction: ClientPrediction | null = null;
  private interpolation: EntityInterpolation;
  private playerId: string | null = null;

  // Lighting
  private hemisphericLight: HemisphericLight | null = null;
  private directionalLight: DirectionalLight | null = null;
  private shadowGenerator: ShadowGenerator | null = null;

  // State
  private isRunning = false;
  private isInitialized = false;

  constructor(engine: Engine, network: NetworkManager, ui: UIManager) {
    this.engine = engine;
    this.network = network;
    this.ui = ui;

    // Initialize entity interpolation
    this.interpolation = new EntityInterpolation();
  }

  /**
   * Initialize the game
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Game already initialized');
      return;
    }

    // Create scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.53, 0.8, 0.92, 1.0); // Sky blue

    // Enable collision
    this.scene.collisionsEnabled = true;
    this.scene.gravity = new Vector3(0, -0.9, 0);

    // Set up camera
    await this.setupCamera();

    // Set up lighting
    this.setupLighting();

    // Set up shadow generator
    this.setupShadows();

    // Initialize asset loader
    this.assetLoader = new AssetLoader(this.scene, './assets');
    await this.assetLoader.initialize();
    console.log('AssetLoader initialized');

    // TEST: Load a monster (Mangnyang)
    console.log("Testing AssetLoader: Loading Mangnyang...");
    const entity = await this.assetLoader.loadGameObject('mangnyang');
    if (entity) {
        console.log("Mangnyang loaded successfully!", entity);
        entity.root.position = new Vector3(0, 0, 0);
    } else {
        console.error("Failed to load Mangnyang.");
    }

    // Initialize core systems
    this.entityManager = new EntityManager(this.scene, this.assetLoader);
    this.worldManager = new WorldManager(this.scene, this.network, this.entityManager);
    this.inputManager = new InputManager(this.scene);
    this.characterManager = new CharacterManager(this.scene, this.network, this.inputManager, this.assetLoader);

    // Initialize Phase 3 & 4A systems
    this.characterFactory = new CharacterFactory(this.scene, this.assetLoader);
    this.damageNumberManager = new DamageNumberManager(this.scene);
    this.skillEffectManager = new SkillEffectManager(this.scene);

    console.log('✓ CharacterFactory initialized');
    console.log('✓ DamageNumberManager initialized');
    console.log('✓ SkillEffectManager initialized');

    // Initialize test interface (for Chrome DevTools)
    await initializeTestInterface(this.scene, this.assetLoader);

    // Set up network event handlers
    this.setupNetworkHandlers();

    // Initialize client prediction (will be set up when player spawns)
    console.log('Client prediction and interpolation systems ready');

    this.isInitialized = true;
    console.log('Game initialized');
  }

  /**
   * Set up the camera
   */
  private async setupCamera(): Promise<void> {
    if (!this.scene) return;

    // Create camera - positioned higher and further back for better view
    const camera = new FreeCamera('camera', new Vector3(0, 50, -100), this.scene);
    camera.setTarget(new Vector3(0, 0, 0));

    // Camera controls
    camera.attachControl(this.engine.getRenderingCanvas()!, true);
    camera.speed = 1;
    camera.angularSensibility = 1000;
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1, 1, 1);

    // Camera collision
    camera.collisionsEnabled = true;

    // Set as main camera
    this.scene.activeCamera = camera;
  }

  /**
   * Set up lighting
   */
  private setupLighting(): void {
    if (!this.scene) return;

    // Hemispheric light (ambient + directional)
    this.hemisphericLight = new HemisphericLight(
      'hemiLight',
      new Vector3(0, 1, 0),
      this.scene
    );
    this.hemisphericLight.intensity = 0.7;
    this.hemisphericLight.diffuse = new Color3(1, 1, 1);
    this.hemisphericLight.groundColor = new Color3(0.2, 0.2, 0.2);

    // Directional light (sun)
    this.directionalLight = new DirectionalLight(
      'dirLight',
      new Vector3(-1, -2, -1),
      this.scene
    );
    this.directionalLight.position = new Vector3(20, 40, 20);
    this.directionalLight.intensity = 0.8;
    this.directionalLight.diffuse = new Color3(1, 0.95, 0.8);
  }

  /**
   * Set up shadow generator
   */
  private setupShadows(): void {
    if (!this.scene || !this.directionalLight) return;

    // Create shadow generator
    this.shadowGenerator = new ShadowGenerator(1024, this.directionalLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurKernel = 32;
    this.shadowGenerator.transparencyShadow = true;
  }

  /**
   * Set up network event handlers
   */
  private setupNetworkHandlers(): void {
    // Connection events
    this.network.on('connected', () => {
      console.log('Connected to server');
    });

    this.network.on('disconnected', () => {
      console.log('Disconnected from server');
      this.stop();
    });

    this.network.on('error', (error) => {
      console.error('Network error:', error);
    });

    // Game events
    this.network.on('spawn', (data) => {
      this.entityManager?.spawnEntity(data);

      // Set up client prediction for local player
      if (data.isLocalPlayer) {
        this.playerId = data.id;
        this.setupClientPrediction(data);
      }
    });

    this.network.on('despawn', (data) => {
      this.entityManager?.despawnEntity(data.id);

      // Remove from interpolation
      this.interpolation.removeEntity(data.id);
    });

    this.network.on('update', (data) => {
      // Update entity interpolation
      if (data.entities) {
        this.interpolation.onServerUpdate(data.entities);
      }

      // Update client prediction for local player
      if (this.prediction && this.playerId) {
        this.prediction.onServerUpdate(data, this.playerId);
      }

      this.entityManager?.updateEntity(data);
    });
  }

  /**
   * Setup client prediction for local player
   */
  private setupClientPrediction(data: any): void {
    const initialState: LocalPlayerState = {
      position: new Vector3(
        data.position?.x || 0,
        data.position?.y || 0,
        data.position?.z || 0
      ),
      rotation: data.rotation || 0,
      velocity: new Vector3(0, 0, 0),
      action: data.action || 'idle',
      timestamp: Date.now(),
    };

    this.prediction = new ClientPrediction(initialState);

    // Set up callbacks
    this.prediction.setStateUpdateCallback((state) => {
      // Update local player entity position
      const playerEntity = this.entityManager?.getEntity(this.playerId!);
      if (playerEntity && playerEntity.mesh) {
        playerEntity.mesh.position = state.position;
        playerEntity.mesh.rotation.y = state.rotation;
      }
    });

    this.prediction.setCorrectionCallback((correction) => {
      console.log('[Game] Applying position correction:', correction);
    });

    console.log('[Game] Client prediction initialized for local player');
  }

  /**
   * Start the game loop
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Game must be initialized before starting');
    }

    if (this.isRunning) {
      console.warn('Game already running');
      return;
    }

    // Load initial zone
    await this.worldManager?.loadZone('zone_jangan');

    // Spawn player character
    await this.characterManager?.spawnPlayer();

    this.isRunning = true;

    // Start render loop
    this.engine.runRenderLoop(() => {
      if (this.scene && this.isRunning) {
        // Update delta time
        const deltaTime = this.engine.getDeltaTime() / 1000;

        // Update entity interpolation
        this.interpolation.update(deltaTime);

        // Update client prediction corrections
        if (this.prediction) {
          this.prediction.updateCorrections(deltaTime);
        }

        // Update systems
        this.characterManager?.update(deltaTime);
        this.inputManager?.update(deltaTime);
        this.worldManager?.update(deltaTime);
        this.entityManager?.update(deltaTime);

        // Render scene
        this.scene.render();
      }
    });

    console.log('Game started');
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.isRunning = false;
    this.network.disconnect();
    console.log('Game stopped');
  }

  /**
   * Get the current scene
   */
  getScene(): Scene | null {
    return this.scene;
  }

  /**
   * Get the shadow generator
   */
  getShadowGenerator(): ShadowGenerator | null {
    return this.shadowGenerator;
  }

  /**
   * Check if game is running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.scene?.dispose();
    this.characterManager?.dispose();
    this.worldManager?.dispose();
    this.inputManager?.dispose();
    this.entityManager?.dispose();

    // Dispose Phase 3 & 4A systems
    this.characterFactory?.destroyAll();
    this.damageNumberManager?.dispose();
    this.skillEffectManager?.dispose();

    console.log('Game disposed');
  }
}
