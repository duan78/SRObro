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
import { ThirdPersonCamera } from '../gameplay/ThirdPersonCamera';
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
  private thirdPersonCamera: ThirdPersonCamera | null = null;
  // Déplacement au clic
  private moveDestination: import('@babylonjs/core').Vector3 | null = null;
  private playerAnimState: 'idle' | 'walk' | 'run' | null = null;
  private playerScaleDone = false;
  private normalizedPlayerRef: unknown = null;
  private lastNormalizeAttempt = 0;
  /** Signature bbox locale + horodatage de stabilité du recalage du perso */
  private lastNormalizeSignature = '';
  private lastNormalizeStableSince = 0;
  private animGeneration = 0;
  private clickMoveHandler: ((e: PointerEvent) => void) | null = null;
  private renderErrorCount = 0;
  // Vitesse de déplacement en UNITÉS SRO (1 u ≈ 10 cm — même échelle que le
  // terrain 1920 u/région, les monstres BMS natifs et les vitesses
  // officielles: mangnyang marche 8, course médiane 66). Marche 8 u/s ≈ la
  // foulée du clip walkforward (1,166 s/cycle); course Shift 17 ≈ le run
  // 100% officiel (16,6).
  private readonly baseMoveSpeed = 8.0;
  private moveSpeed = 8.0;
  // En mode réseau, les monstres/joueurs distants sont gérés par NetworkCombat:
  // l'EntityManager legacy (monstres locaux) ne doit rien recréer (warns + meshes en double)
  legacyEntities = true;
  private progression: ProgressionSystem | null = null;
  private equipment: EquipmentSystem | null = null;
  private combat: CombatSystem | null = null;
  private targeting: TargetingSystem | null = null;
  private playerCharacter: Character | null = null;
  // État du personnage fourni par le serveur (auth) — null en mode dégradé
  private serverCharacter: {
    id: string; name: string; race: string; gender: string; level: number;
    hp: number; mp: number; maxHp: number; maxMp: number; str: number; int: number;
    exp: number; sp: number; gold: number;
    position: { x: number; y: number; z: number }; rotation: number;
  } | null = null;
  // Envoi de position réseau throttlé (le clic-bouge tourne à chaque frame)
  private lastMoveSent = 0;

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
   * @param serverCharacter - état du personnage sélectionné côté serveur (auth)
   */
  async initialize(serverCharacter?: {
    id: string; name: string; race: string; gender: string; level: number;
    hp: number; mp: number; maxHp: number; maxMp: number; str: number; int: number;
    exp: number; sp: number; gold: number;
    position: { x: number; y: number; z: number }; rotation: number;
  }): Promise<void> {
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

    // Create player character data (état serveur si disponible)
    this.serverCharacter = serverCharacter ?? null;
    this.playerCharacter = this.createPlayerCharacter();

    // Initialize MVP systems
    this.progression = new ProgressionSystem(this.playerCharacter);
    this.equipment = new EquipmentSystem(this.playerCharacter);
    console.log('✓ ProgressionSystem initialized');
    console.log('✓ EquipmentSystem initialized');

    // Initialize Jangan zone
    this.janganZone = new JanganZone(this.scene, this.assetLoader);
    // En mode réseau, les monstres viennent du serveur (NetworkCombat)
    this.janganZone.disableLocalMonsters = this.network.getIsConnected();
    await this.janganZone.load();
    console.log('✓ JanganZone loaded');

    // Initialize core systems
    this.entityManager = new EntityManager(this.scene, this.assetLoader);
    this.worldManager = new WorldManager(this.scene, this.network, this.entityManager);
    this.inputManager = new InputManager(this.scene);
    this.characterManager = new CharacterManager(this.scene, this.network, this.inputManager, this.assetLoader);

    // Caméra troisième personne orbitale: clic droit = rotation, molette = zoom.
    // Collision activée: la caméra ne traverse pas les bâtiments.
    // Distances en unités SRO (perso natif ~17 u de haut).
    this.thirdPersonCamera = new ThirdPersonCamera(this.scene, {
      distance: 48,
      height: 11,
      minDistance: 8,
      maxDistance: 400,
      rotationSpeed: 0.005,
      zoomSpeed: 1.2,
      smoothness: 0.2,
      enableCollision: true,
    });

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
    // Personnage réel sélectionné via l'écran de connexion
    const sc = this.serverCharacter;
    if (sc) {
      return {
        id: sc.id,
        accountId: 'server',
        name: sc.name,
        race: sc.race === 'european' ? CharacterRace.EUROPEAN : CharacterRace.CHINESE,
        level: sc.level,
        exp: sc.exp,
        sp: sc.sp,
        hp: sc.hp,
        mp: sc.mp,
        maxHp: sc.maxHp,
        maxMp: sc.maxMp,
        stats: { str: sc.str, int: sc.int },
        statPoints: 0,
        masteries: [],
        equipment: [],
        inventory: [],
        skills: [],
        position: { ...sc.position },
        rotation: sc.rotation,
        gold: sc.gold,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
    }
    // Repli hors-ligne (dégradé): aventurier de test
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

    // Create camera - recentrée sur le point d'apparition de Jangan
    const spawn = this.janganZone ? this.janganZone.getPlayerSpawnPoint() : { x: 0, y: 0, z: 0 };
    const camera = new FreeCamera('camera', new Vector3(spawn.x, spawn.y + 30, spawn.z - 45), this.scene);
    camera.setTarget(new Vector3(spawn.x, spawn.y + 5, spawn.z)); // Look at player spawn point

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
    // Les textures officielles DDJ→PNG converties sont sombres (gamma non
    // corrigé) — éclairage renforcé pour rester lisible en attendant la
    // correction du convertisseur (phase 7).
    this.hemisphericLight.intensity = 1.15;
    this.hemisphericLight.diffuse = new Color3(1, 1, 1);
    this.hemisphericLight.groundColor = new Color3(0.45, 0.45, 0.45);

    // Directional light (sun)
    this.directionalLight = new DirectionalLight(
      'dirLight',
      new Vector3(-1, -2, -1),
      this.scene
    );
    this.directionalLight.position = new Vector3(20, 40, 20);
    this.directionalLight.intensity = 1.3;
    this.directionalLight.diffuse = new Color3(1, 0.97, 0.88);
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
      // Socket.io reessaie tout seul (reconnection: true). On garde le rendu
      // local actif — tuer la boucle sur une coupure transient cassait tout.
      console.warn('Disconnected from server — local rendering continues, retrying...');
    });

    this.network.on('error', (error) => {
      console.error('Network error:', error);
    });

    // Game events — le serveur envoie le packet ENVELOPPÉ {type,timestamp,data}:
    // déballer avant usage (sinon data.id est undefined et spamme les warns)
    this.network.on('spawn', (raw) => {
      const data = raw?.data ?? raw;

      // Set up client prediction for local player
      if (data.isLocalPlayer) {
        this.playerId = data.id;
        this.setupClientPrediction(data);
      }

      if (this.legacyEntities) {
        this.entityManager?.spawnEntity(data);
      }
    });

    this.network.on('despawn', (raw) => {
      const data = raw?.data ?? raw;
      if (this.legacyEntities) {
        this.entityManager?.despawnEntity(data.id);
      }

      // Remove from interpolation
      this.interpolation.removeEntity(data.id);
    });

    this.network.on('update', (raw) => {
      const data = raw?.data ?? raw;
      // Update entity interpolation
      if (data.entities) {
        this.interpolation.onServerUpdate(data.entities);
      }

      // Update client prediction for local player
      if (this.prediction && this.playerId) {
        this.prediction.onServerUpdate(data, this.playerId);
      }

      if (this.legacyEntities && data.id && this.entityManager?.getEntity?.(data.id)) {
        this.entityManager.updateEntity(data);
      }
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

    // Vitesse GM (/speed): le module réseau relaie le multiplicateur serveur
    window.addEventListener('srobro:speed', (e) => {
      const m = Number((e as CustomEvent).detail ?? 1);
      if (m >= 0.5 && m <= 10) this.moveSpeed = this.baseMoveSpeed * m;
    });

    // Spawn player at Jangan zone spawn point (posé sur le relief réel).
    // Position serveur (dernière sauvegarde) si disponible, sinon spawn sûr.
    if (this.janganZone && this.characterManager) {
      const spawnPoint = this.janganZone.getSafeSpawnPoint();
      const terrain = this.janganZone.realTerrain;
      const sc = this.serverCharacter;
      const hasSavedPosition = !!sc && (Math.abs(sc.position.x) > 0.5 || Math.abs(sc.position.z) > 0.5);
      const spawnX = hasSavedPosition ? sc!.position.x : spawnPoint.x;
      const spawnZ = hasSavedPosition ? sc!.position.z : spawnPoint.z;
      const groundY = terrain ? terrain.heightAt(spawnX, spawnZ) : spawnPoint.y;
      // Modèle officiel selon race + genre (EU_M/EU_W → europeman/woman)
      const modelId = sc?.race === 'european'
        ? (sc?.gender === 'female' ? 'EU_W_01' : 'EU_M_01')
        : (sc?.gender === 'female' ? 'CH_W_01' : 'CH_M_01');
      await this.characterManager.spawnPlayer(modelId, new Vector3(spawnX, groundY, spawnZ));
      if (this.characterManager.player) {
        this.characterManager.player.rotation.y = sc?.rotation ?? 0;
      }
      this.normalizePlayerScale();
      console.log(`Player spawned at (${spawnX.toFixed(1)}, ${groundY.toFixed(1)}, ${spawnZ.toFixed(1)}) [${hasSavedPosition ? 'position sauvegardée' : 'spawn sûr'}]`);

      // Caméra troisième personne orbitale (molette = zoom, clic droit = orbite)
      if (this.thirdPersonCamera) {
        this.thirdPersonCamera.setTarget(this.characterManager.player);
        this.scene.activeCamera = this.thirdPersonCamera.sceneCamera;
        // CRITIQUE: sans cela le picking (clic-pour-bouger, ciblage) continue
        // d'utiliser la FreeCamera de boot → les clics atterrissent près du
        // spawn d'origine, pas là où le joueur clique réellement.
        this.scene.cameraToUseForPointers = this.thirdPersonCamera.sceneCamera;
      } else if (this.camera) {
        this.camera.position.set(spawnPoint.x, groundY + 30, spawnPoint.z - 45);
        this.camera.setTarget(new Vector3(spawnPoint.x, groundY + 5, spawnPoint.z));
      }

      this.setupClickToMove();
      // Clavier + clic unifiés dans updateClickToMove: couper le chemin
      // legacy de CharacterManager (double déplacement sinon).
      this.characterManager.legacyKeyboardMovement = false;
    }

    // Apparence (phase A): quand l'équipement visuel change (armures par
    // pièce), rafraîchir les groupes d'animation pour y inclure les
    // squelettes des nouvelles pièces.
    window.addEventListener('srobro:player-appearance', () => {
      if (this.playerAnimState) {
        // forcer la re-sélection (les groupes sont recréés avec TOUS les
        // squelettes courants, armures comprises)
        this.playerAnimState = null;
        void this.switchPlayerAnim('idle').then(() => { this.playerAnimState = 'idle'; }).catch(() => undefined);
      }
    });

    // NOTE: pas de worldManager.loadZone('zone_jangan') — JanganZone fournit
    // déjà le vrai terrain officiel; la zone procédurale se superposait
    // (double géométrie: sol 2000², 50 arbres, 10 bâtiments, 30 rochers).

    this.isRunning = true;

    // Start render loop
    // Protection: Babylon n'attrape pas les exceptions des callbacks de
    // runRenderLoop — sans ce try/catch, une seule erreur tue le rendu
    // définitivement (bug historique du projet).
    this.engine.runRenderLoop(() => {
      if (!this.scene || !this.isRunning) return;
      try {
        // Update delta time
        const deltaTime = this.engine.getDeltaTime() / 1000;

        // Déplacement du joueur vers la destination cliquée
        this.updateClickToMove(deltaTime);

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
        this.renderErrorCount = 0;
      } catch (error) {
        this.renderErrorCount++;
        console.error(`[Game] Render loop error (#${this.renderErrorCount}):`, error);
        if (this.renderErrorCount >= 30) {
          console.error('[Game] Too many consecutive render errors — stopping the loop');
          this.stop();
        }
      }
    });

    console.log('Game started');
  }

  /**
   * Stop the game
   */
  stop(): void {
    if (!this.isRunning && this.engine.activeRenderLoops.length === 0) return;
    this.isRunning = false;
    this.engine.stopRenderLoop();
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

    // Retirer le listener du click-to-move
    const canvas = this.engine.getRenderingCanvas();
    if (canvas && this.clickMoveHandler) {
      canvas.removeEventListener('pointerdown', this.clickMoveHandler);
      this.clickMoveHandler = null;
    }

    // Dispose systems (avant la scène: ils référencent des meshes de la scène)
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
    this.thirdPersonCamera?.dispose();

    this.scene?.dispose();
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

  /**
   * Maillage du JOUEUR LOCAL (source de vérité). ⚠️ Ne JAMAIS chercher le
   * joueur par nom de mesh « chinaman_* »: les PNJ et joueurs distants
   * utilisent les mêmes modèles officiels (chinaman_adventurer___root__) —
   * les handlers attrapaient un PNJ/joueur distant à la place du perso
   * (PNJ « téléportés en l'air », attaques/tp appliqués au mauvais mesh).
   */
  getLocalPlayerMesh(): import('@babylonjs/core/Meshes/transformNode').TransformNode | null {
    return this.characterManager?.player ?? null;
  }

  /**
   * Asset loader (pour les systèmes externes: NetworkCombat...)
   */
  getAssetLoader(): AssetLoader | null {
    return this.assetLoader;
  }

  /**
   * Normalise le personnage officiel: échelle ~1.8 m ET recalage vertical
   * (le squelette SRO a son origine en hauteur, pas aux pieds). Appelé en
   * différé car le modèle se charge en arrière-plan.
   *
   * Robustesse (bug perso enterré, oct. 2026): le recalage n'est validé
   * (playerScaleDone) que lorsque la bbox LOCALE du modèle est stable ~1,5 s
   * — l'assemblage multi-parties et la pose du squelette arrivent en différé,
   * et marquer "terminé" sur une mesure partielle figeait une échelle 2× et
   * un pivot au milieu du corps.
   */
  private normalizePlayerScale(): void {
    const player = this.characterManager?.player;
    if (!player) return;
    const meshes = player.getChildMeshes() as import('@babylonjs/core').Mesh[];
    const real = meshes.filter((m) => m.getTotalVertices() > 0);
    if (real.length === 0) return; // modèle pas encore chargé: réessai au tick suivant

    // Bbox des VERTICES BRUTS (statique): insensible à la pose animée. Mesurer
    // la bbox monde (refreshBoundingInfo) couplait le recalage des enfants à
    // la frame d'animation courante → le perso sautait verticalement au repos
    // dès que les animations jouaient (bug « oscille de haut en bas », oct.
    // 2026 — invisible avant car les anims étaient figées par le bug fps).
    let min = Infinity;
    let max = -Infinity;
    for (const m of real) {
      const pos = m.getVerticesData('position');
      if (!pos) continue;
      for (let i = 1; i < pos.length; i += 3) {
        if (pos[i] < min) min = pos[i];
        if (pos[i] > max) max = pos[i];
      }
    }
    const localHeight = max - min;
    if (!(localHeight > 0.01) || !Number.isFinite(localHeight)) return;

    // Garde-fou: un humanoïde SRO fait ~15-35 unités locales. Une mesure
    // explosive (pose d'animation corrompue, squelette éclaté) ne doit JAMAIS
    // piloter l'échelle — sinon boucle de rétroaction qui rétrécit le perso
    // (bug oct. 2026: échelle 0.011, perso invisible).
    if (!(localHeight >= 5 && localHeight <= 60)) {
      console.warn(`[Game] Recalage: hauteur locale aberrante ${localHeight.toFixed(1)} u ignorée`);
      return;
    }

    const hKey = `${min.toFixed(2)}/${localHeight.toFixed(2)}`;
    const now = performance.now();
    if (hKey !== this.lastNormalizeSignature) {
      this.lastNormalizeSignature = hKey;
      this.lastNormalizeStableSince = 0;
    } else if (!this.lastNormalizeStableSince) {
      this.lastNormalizeStableSince = now;
    }

    // ÉCHELLE NATIVE BMS (~17 u ≈ 1,7 m en unités SRO): le monde (régions
    // 1920 u, monstres natifs, vitesses officielles walk 8-20) est en unités
    // SRO — l'ancienne cible 1,8 rendait le perso ~9× trop petit face aux
    // mobs (mangnyang « géant », déplacement rampant).
    player.scaling.setAll(1.0);
    // Pieds au niveau du root (les vertices montent jusqu'à ~min localement).
    const yShift = -min;
    for (const child of player.getChildTransformNodes(true)) {
      child.position.y = yShift;
    }

    // Validation uniquement si la signature n'a plus bougé depuis 1,5 s
    // (les 9 parties arrivent en différé: la bbox brute grandit à chaque
    // partie chargée puis se fige).
    if (this.lastNormalizeStableSince && now - this.lastNormalizeStableSince > 1500) {
      this.playerScaleDone = true;
      console.log(`[Game] Perso recalé (stable): hauteur locale ${localHeight.toFixed(2)}, décalage ${yShift.toFixed(2)}`);
    }
  }

  /**
   * Clic gauche sur le terrain: le personnage s'y rend (click-to-move SRO).
   */
  private setupClickToMove(): void {
    const canvas = this.engine.getRenderingCanvas();
    if (!canvas) return;
    this.clickMoveHandler = (e: PointerEvent) => {
      if (e.button !== 0) return; // clic gauche uniquement
      if (!this.scene || !this.characterManager?.player) return;
      // Coordonnées relatives au canvas (le HUD DOM peut le décaler)
      const rect = canvas.getBoundingClientRect();
      const pick = this.scene.pick(e.clientX - rect.left, e.clientY - rect.top, (m) =>
        m.isPickable && m.name.startsWith('terrain_'));
      if (pick?.hit && pick.pickedPoint) {
        this.moveDestination = pick.pickedPoint.clone();
      }
    };
    canvas.addEventListener('pointerdown', this.clickMoveHandler);
  }

  /**
   * Déplace le joueur vers la destination cliquée, posé sur le relief,
   * orienté vers sa direction, avec bascule walk/idle des animations.
   */
  private updateClickToMove(dt: number): void {
    const player = this.characterManager?.player;
    if (!player) return;

    // Mort: aucun déplacement tant que le respawn n'est pas fait (l'overlay
    // ne bloque pas le clavier — phase A V3).
    const netCombat = (window as unknown as { netCombat?: { playerDead: boolean } }).netCombat;
    if (netCombat?.playerDead) {
      this.moveDestination = null;
      return;
    }

    // Recalage du perso une fois le modèle officiel chargé (arrière-plan):
    // le placeholder est remplacé par le chinaman après coup, on suit la référence.
    if (player !== this.normalizedPlayerRef) {
      this.normalizedPlayerRef = player;
      this.playerScaleDone = false;
      this.lastNormalizeSignature = '';
      this.lastNormalizeStableSince = 0;
      // La bascule d'animation ne se déclenche qu'une fois par état: si elle
      // a tiré pendant le placeholder (aucun squelette), il faut la rejouer
      // pour le vrai modèle.
      this.playerAnimState = null;
      // La caméra doit suivre le NOUVEAU modèle (sinon le perso paraît décentré)
      if (this.thirdPersonCamera && this.thirdPersonCamera.getTarget() !== player) {
        this.thirdPersonCamera.setTarget(player);
      }
    }
    if (!this.playerScaleDone) {
      // Throttle: le recalage parcourt les vertices — inutile chaque frame
      const now = performance.now();
      if (now - this.lastNormalizeAttempt > 250) {
        this.lastNormalizeAttempt = now;
        this.normalizePlayerScale();
      }
    }
    // Pas de correction de dérive périodique: l'ancienne version recalait les
    // enfants depuis la bbox ANIMÉE (refreshBoundingInfo) → sauts verticaux
    // au repos dès que les clips jouaient. Le recalage est désormais calculé
    // sur les vertices bruts (statiques) et n'a plus rien à corriger.
    // Déplacement unifié: CLAVIER (ZQSD/WASD/flèches, relatif à la caméra,
    // Shift = course) prioritaire sur la destination cliquée. Historiquement
    // le clavier vivait dans CharacterManager.handleMovement avec des
    // animations placeholder → le perso glissait en pose idle (bug
    // « déplacements pas naturels », oct. 2026). Tout passe désormais par
    // cette boucle: mêmes animations BAN, même terrain, même sync serveur.
    let moving = false;
    let effectiveSpeed = this.moveSpeed; // unités/s (/speed GM ajuste le multiplicateur)
    const input = this.inputManager?.getState();
    if (input && (input.forward || input.backward || input.left || input.right)) {
      // Le clavier annule une destination cliquée en cours
      this.moveDestination = null;
      // Direction caméra-relative: avant = projection XZ de l'axe de visée
      const cam = this.scene.activeCamera;
      let fwd = { x: 0, z: 1 };
      let right = { x: 1, z: 0 };
      if (cam) {
        const dir = cam.getForwardRay().direction;
        const len = Math.hypot(dir.x, dir.z);
        if (len > 0.001) {
          fwd = { x: dir.x / len, z: dir.z / len };
          right = { x: fwd.z, z: -fwd.x };
        }
      }
      let dx = fwd.x * ((input.forward ? 1 : 0) - (input.backward ? 1 : 0))
        + right.x * ((input.right ? 1 : 0) - (input.left ? 1 : 0));
      let dz = fwd.z * ((input.forward ? 1 : 0) - (input.backward ? 1 : 0))
        + right.z * ((input.right ? 1 : 0) - (input.left ? 1 : 0));
      const dl = Math.hypot(dx, dz);
      if (dl > 0.001) {
        dx /= dl; dz /= dl;
        // Shift = course (17 u/s ≈ run officiel 100%, anim runforward)
        effectiveSpeed = this.moveSpeed * (input.shift ? 2.125 : 1.0);
        const step = effectiveSpeed * dt;
        player.position.x += dx * step;
        player.position.z += dz * step;
        player.rotation.y = Math.atan2(dx, dz);
        moving = true;
      }
    } else if (this.moveDestination) {
      const dx = this.moveDestination.x - player.position.x;
      const dz = this.moveDestination.z - player.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 5) {
        this.moveDestination = null;
      } else {
        const step = Math.min(effectiveSpeed * dt, dist);
        player.position.x += (dx / dist) * step;
        player.position.z += (dz / dist) * step;
        // Orientation vers la direction de marche
        player.rotation.y = Math.atan2(dx, dz);
        moving = true;
      }
    }

    // Hauteur du terrain sous le joueur + streaming des régions autour de lui
    const terrain = this.janganZone?.realTerrain;
    if (terrain) {
      player.position.y = terrain.heightAt(player.position.x, player.position.z);
      terrain.update(player.position.x, player.position.z);
    }

    // Ciel (phase B V3): dérive des nuages + teinte par continent (throttlé
    // par l'update interne du SkyDome).
    this.janganZone?.sky?.update(player.position.x, player.position.z, dt);

    // Synchronisation réseau throttlée (le serveur fait autorité sur la position)
    if (this.network.getIsConnected()) {
      const now = performance.now();
      if (now - this.lastMoveSent > 200) {
        this.lastMoveSent = now;
        this.network.sendMove(
          { x: player.position.x, y: player.position.y, z: player.position.z },
          player.rotation.y,
          moving
        );
      }
    }

    // Bascule des animations officielles selon l'état de déplacement:
    // idle ↔ walk, et run quand la vitesse effective dépasse la marche
    // (Shift, monture ×1.67, zerk ×2, /speed GM) — le perso court.
    const wanted: 'idle' | 'walk' | 'run' = !moving
      ? 'idle'
      : effectiveSpeed > 10 ? 'run' : 'walk';
    if (wanted !== this.playerAnimState) {
      this.playerAnimState = wanted;
      void this.switchPlayerAnim(wanted).catch((err) =>
        console.error('[Game] Failed to switch player animation:', err));
    }
  }

  private async switchPlayerAnim(state: 'idle' | 'walk' | 'run'): Promise<void> {
    const player = this.characterManager?.player;
    const scene = this.scene;
    if (!player || !scene) return;
    // Token de génération: deux bascules rapides ne doivent pas laisser deux
    // groupes d'animation jouer simultanément sur les mêmes squelettes.
    const gen = ++this.animGeneration;
    // Arrêter les groupes actuels du perso
    const myGroups = scene.animationGroups.filter(g =>
      g.name.startsWith('player_anim_'));
    for (const g of myGroups) {
      g.stop();
      g.dispose();
    }
    // Squelettes du perso (un par partie assemblée)
    const skeletons: import('@babylonjs/core').Skeleton[] = [];
    for (const m of player.getChildMeshes()) {
      const sk = (m as import('@babylonjs/core').Mesh).skeleton;
      if (sk && !skeletons.includes(sk)) skeletons.push(sk);
    }
    if (skeletons.length === 0) return;
    const { AnimationService } = await import('../animation/BanAnimationService');
    if (gen !== this.animGeneration) return; // bascule plus récente en cours
    // Genre du perso (femme → rig chinawoman) pour les clips dédiés
    const female = this.serverCharacter?.gender === 'female';
    const action = state === 'run' ? 'runforward' : state === 'walk' ? 'walkforward' : 'standcity';
    const clip = AnimationService.playerClip(action, female);
    const groups = await AnimationService.loadAndPlay(scene, skeletons, clip, true, 1.0);
    if (gen !== this.animGeneration) {
      // Obsolète: une bascule plus récente a déjà pris le relais
      for (const g of groups) {
        g.stop();
        g.dispose();
      }
      return;
    }
    for (const g of groups) g.name = 'player_anim_' + g.name;
  }
}
