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
  FollowCamera,
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
// import { initializeTestInterface } from '../test';
import { JanganZone } from '../zones/jangan/JanganZone';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { EquipmentSystem } from '../systems/EquipmentSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { TargetingSystem } from '../systems/TargetingSystem';
import type { Character } from '@srobro/shared';
import { CharacterRace } from '@srobro/shared';

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

  // Phase 3 & 4A systems
  private characterFactory: CharacterFactory | null = null;
  private damageNumberManager: DamageNumberManager | null = null;
  private skillEffectManager: SkillEffectManager | null = null;

  // MVP Systems
  private janganZone: JanganZone | null = null;
  private progression: ProgressionSystem | null = null;
  private equipment: EquipmentSystem | null = null;
  private combat: CombatSystem | null = null;
  private targeting: TargetingSystem | null = null;
  private playerCharacter: Character | null = null;

  // Network synchronization systems
  private prediction: ClientPrediction | null = null;
  private interpolation: EntityInterpolation;
  private playerId: string | null = null;

  // Lighting
  private hemisphericLight: HemisphericLight | null = null;
  private directionalLight: DirectionalLight | null = null;
  private shadowGenerator: ShadowGenerator | null = null;

  // Camera (FollowCamera for third-person view)
  private camera: FreeCamera | FollowCamera | null = null;

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
    this.scene.autoClear = true; // Ensure scene clears every frame
    console.log('[Scene] Scene created with clear color:', this.scene.clearColor.toString());

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
    this.assetLoader = new AssetLoader(this.scene);
    await this.assetLoader.initialize();
    console.log('AssetLoader initialized');

    // Create player character data
    this.playerCharacter = this.createPlayerCharacter();

    // Initialize MVP systems
    this.progression = new ProgressionSystem(this.playerCharacter);
    this.equipment = new EquipmentSystem(this.playerCharacter);
    console.log('✓ ProgressionSystem initialized');
    console.log('✓ EquipmentSystem initialized');

    // Initialize Jangan zone
    this.janganZone = new JanganZone(this.scene, this.assetLoader);
    await this.janganZone.load();
    console.log('✓ JanganZone loaded');

    // Initialize core systems
    this.entityManager = new EntityManager(this.scene, this.assetLoader);
    this.worldManager = new WorldManager(this.scene, this.network, this.entityManager);
    this.inputManager = new InputManager(this.scene);
    this.characterManager = new CharacterManager(this.scene, this.network, this.inputManager, this.assetLoader);

    // Set up keyboard shortcuts for UI panels
    this.setupKeyboardShortcuts();

    // Initialize Phase 3 & 4A systems
    this.characterFactory = new CharacterFactory(this.scene, this.assetLoader);
    this.damageNumberManager = new DamageNumberManager(this.scene);
    this.skillEffectManager = new SkillEffectManager(this.scene);

    console.log('✓ CharacterFactory initialized');
    console.log('✓ DamageNumberManager initialized');
    console.log('✓ SkillEffectManager initialized');

    // Initialize combat system
    this.combat = new CombatSystem(this.scene, this.progression, this.equipment);
    this.combat.setDamageNumberManager(this.damageNumberManager);
    this.combat.setJanganZone(this.janganZone); // Connect to JanganZone for health bars
    console.log('✓ CombatSystem initialized');

    // Initialize targeting system (after combat and jangan zone)
    this.targeting = new TargetingSystem(this.scene, this.janganZone, this.combat);
    console.log('✓ TargetingSystem initialized');

    // Connect combat system to character manager
    this.characterManager.setCombatSystem(this.combat);

    // Connect system events
    this.setupSystemEvents();

    // Initialize test interface (for Chrome DevTools)
    // TODO: Fix export issue
    // await initializeTestInterface(this.scene, this.assetLoader);

    // Set up network event handlers
    this.setupNetworkHandlers();

    // Initialize client prediction (will be set up when player spawns)
    console.log('Client prediction and interpolation systems ready');

    this.isInitialized = true;
    console.log('Game initialized');
  }

  /**
   * Create player character data
   */
  private createPlayerCharacter(): Character {
    return {
      id: 'player_1',
      accountId: 'account_1',
      name: 'Player',
      race: CharacterRace.CHINESE,
      level: 1,
      exp: 0,
      sp: 0,
      hp: 200,
      mp: 100,
      maxHp: 200,
      maxMp: 100,
      stats: {
        str: 10,
        int: 10,
      },
      statPoints: 0,
      masteries: [],
      equipment: [],
      inventory: [],
      skills: [],
      position: { x: 1000, y: 0, z: 1000 },
      rotation: 0,
      gold: 10000,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
  }

  /**
   * Set up system events
   */
  private setupSystemEvents(): void {
    if (!this.progression || !this.combat || !this.equipment || !this.ui) {
      return;
    }

    // XP gain event -> update UI
    this.progression.onXPGain.add((data) => {
      this.ui.updateXPSP({
        level: this.progression!.getLevel(),
        currentExp: data.currentXP,
        nextLevelExp: data.nextLevelXP,
        currentSP: 0, // Not used in MVP
        maxSP: 100,
      });
    });

    // Level up event -> show notification
    this.progression.onLevelUp.add((data) => {
      this.ui.showNotification(`Level Up! You are now level ${data.newLevel}`);
      this.ui.animateLevelUp();
    });

    // Stat allocation event -> update UI
    this.progression.onStatAllocation.add((stats) => {
      this.ui.updateCharacterStats({
        str: stats.str,
        int: stats.int,
        statPoints: this.progression!.getStatPoints(),
        level: this.progression!.getLevel(),
        hp: this.progression!.getHP(),
        maxHp: this.progression!.getMaxHP(),
        mp: this.progression!.getMP(),
        maxMp: this.progression!.getMaxMP(),
      });
    });

    // Monster death event -> handle drops
    this.combat.onMonsterDeath.add((data) => {
      console.log(`Monster killed! Gained ${data.xpReward} XP`);
      // TODO: Handle item drops
    });

    // Combat events
    this.combat.onCombatEvent.add((event) => {
      if (event.type === 'death') {
        // Player died
        this.combat!.respawnPlayer();
        this.ui.showNotification('You died! Respawning...');
      }
    });

    // Equipment change event -> update UI
    this.equipment.onEquipmentChange.add((data) => {
      this.ui.updateEquipment(this.equipment!.getEquipment());
    });

    // Inventory change event -> update UI
    this.equipment.onInventoryChange.add((data) => {
      this.ui.updateInventory(this.equipment!.getInventory());
    });

    // UI stat allocation -> progression system
    this.ui.onStatAllocateObservable.add((data) => {
      const success = this.progression!.allocateStat(data.stat);
      if (success) {
        // Update UI with new stats
        this.ui.updateCharacterStats({
          str: this.progression!.getStats().str,
          int: this.progression!.getStats().int,
          statPoints: this.progression!.getStatPoints(),
          level: this.progression!.getLevel(),
          hp: this.progression!.getHP(),
          maxHp: this.progression!.getMaxHP(),
          mp: this.progression!.getMP(),
          maxMp: this.progression!.getMaxMP(),
        });

        // Hide buttons if no more points
        if (this.progression!.getStatPoints() === 0) {
          this.ui.hideStatAllocationButtons();
        }
      }
    });
  }

  /**
   * Set up keyboard shortcuts for UI panels
   */
  private setupKeyboardShortcuts(): void {
    if (!this.inputManager) return;

    // Handle key down events
    this.inputManager.onKeyDown((key) => {
      switch (key) {
        case 'KeyH':
          // Toggle help panel
          this.ui.toggleControlsHelp?.();
          console.log('[Game] Toggled controls help');
          break;
        case 'KeyI':
          // Toggle inventory panel
          this.ui.toggleInventory?.();
          console.log('[Game] Toggled inventory');
          break;
        case 'KeyC':
          // Toggle character panel
          this.ui.toggleCharacter?.();
          console.log('[Game] Toggled character panel');
          break;
      }
    });

    console.log('[Game] Keyboard shortcuts configured');
  }

  /**
   * Set up the camera
   */
  private async setupCamera(): Promise<void> {
    if (!this.scene) return;

    // Create camera - positioned to see the Jangan zone
    const camera = new FreeCamera('camera', new Vector3(1000, 50, 900), this.scene);
    camera.setTarget(new Vector3(1000, 0, 1000)); // Look at player spawn point

    // Disable Babylon camera controls - we use our own InputManager
    camera.attachControl(this.engine.getRenderingCanvas()!, false);
    camera.speed = 0;
    camera.angularSensibility = 0;
    camera.keysUp = []; // Clear default WASD controls
    camera.keysDown = [];
    camera.keysLeft = [];
    camera.keysRight = [];

    // Camera collision
    camera.checkCollisions = false;
    camera.collisionsEnabled = false;

    // Set as main camera
    this.scene.activeCamera = camera;
    this.camera = camera;
    console.log('[Camera] Camera positioned at Jangan zone, looking at spawn point');
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

    // Spawn player at Jangan zone spawn point
    if (this.janganZone && this.characterManager) {
      const spawnPoint = this.janganZone.getPlayerSpawnPoint();
      await this.characterManager.spawnPlayer('CH_M_01', new Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z));
      console.log(`Player spawned at Jangan zone (${spawnPoint.x}, ${spawnPoint.y}, ${spawnPoint.z})`);
    }

    // Load initial zone (for compatibility with existing systems)
    await this.worldManager?.loadZone('zone_jangan');

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

        // Update MVP systems
        this.janganZone?.update();
        this.combat?.update();
        this.targeting?.update();

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

    // Dispose MVP systems
    this.janganZone?.dispose();
    this.progression?.dispose();
    this.equipment?.dispose();
    this.combat?.dispose();
    this.targeting?.dispose();

    console.log('Game disposed');
  }

  /**
   * Get progression system (for external access)
   */
  getProgression(): ProgressionSystem | null {
    return this.progression;
  }

  /**
   * Get equipment system (for external access)
   */
  getEquipment(): EquipmentSystem | null {
    return this.equipment;
  }

  /**
   * Get combat system (for external access)
   */
  getCombat(): CombatSystem | null {
    return this.combat;
  }

  /**
   * Get Jangan zone (for external access)
   */
  getJanganZone(): JanganZone | null {
    return this.janganZone;
  }
}
