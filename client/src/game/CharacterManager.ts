/**
 * SRObro - Character Manager
 * Manages player character state and behavior
 * Uses AssetLoader to load real character models
 */

import type { Scene } from '@babylonjs/core';
import { Vector3, TransformNode, AbstractMesh, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';
import { InputManager } from '../core/InputManager';
import { AssetLoader } from '../core/AssetLoader';
import { Character } from './Character';
import type { Character as CharacterData, MovementState } from '@srobro/shared';
import type { CombatSystem } from '../systems/CombatSystem';
import { getPlayerAssetPath } from '../config/AssetMapping';

export class CharacterManager {
  private scene: Scene;
  private network: NetworkManager;
  private input: InputManager;
  private assetLoader: AssetLoader;
  private combat: CombatSystem | null = null;

  private player: TransformNode | null = null;
  private playerMesh: AbstractMesh | null = null;
  private playerData: CharacterData | null = null;
  private playerCharacter: Character | null = null;

  // Movement state
  private currentMoveSpeed = 0;
  private targetRotation = 0;
  private isMoving = false;

  // Animation state
  private currentAnimation: string = 'idle';
  private animationBlending = false;

  // Combat state
  private lastAttackTime = 0;
  private attackCooldown = 2000; // 2 seconds

  constructor(scene: Scene, network: NetworkManager, input: InputManager, assetLoader: AssetLoader) {
    this.scene = scene;
    this.network = network;
    this.input = input;
    this.assetLoader = assetLoader;

    this.setupInputHandlers();
  }

  /**
   * Set combat system
   */
  setCombatSystem(combat: CombatSystem): void {
    this.combat = combat;
  }

  /**
   * Set up input handlers
   */
  private setupInputHandlers(): void {
    // Attack on left click
    this.input.onMouseDown((button) => {
      if (button === 0) { // Left click
        this.performAttack();
      }
    });

    // Key handlers for skills
    this.input.onKeyDown((key) => {
      // Number keys for skills
      if (key >= 'Digit1' && key <= 'Digit9') {
        const skillSlot = parseInt(key.replace('Digit', ''));
        this.useSkill(skillSlot);
      }
    });
  }

  /**
   * Spawn player character
   * @param characterId - Character ID from manifest (e.g., 'CH_M_01')
   * @param position - Spawn position
   */
  async spawnPlayer(characterId: string = 'CH_M_01', position: Vector3 = new Vector3(0, 0, 0)): Promise<void> {
    console.log(`Spawning player character: ${characterId}`);

    // Create placeholder first
    this.createPlayerPlaceholder();
    this.player!.position = position;

    console.log(`Player spawned at Jangan zone (${position.x}, ${position.y}, ${position.z})`);

    // Try to load actual 3D model - continue even if it fails
    this.loadCharacterModel(characterId, position);
  }

  /**
   * Load character 3D model directly without strict validation
   */
  private async loadCharacterModel(characterId: string, position: Vector3): Promise<void> {
    try {
      const assetMapping = getPlayerAssetPath(characterId);
      console.log(`[CharacterManager] Loading model: ${assetMapping.modelPath}`);

      // Use fetch + ArrayBuffer to bypass GLB validation
      const response = await fetch(assetMapping.modelPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`[CharacterManager] GLB file loaded: ${arrayBuffer.byteLength} bytes`);

      // Load with BABYLON.SceneLoader using the array buffer directly
      const { SceneLoader } = await import('@babylonjs/core');

      // Create blob URL to bypass validation
      const blob = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
      const blobURL = URL.createObjectURL(blob);

      const result = await SceneLoader.ImportMeshAsync(null, blobURL, undefined, this.scene,
        (evt) => {
          if (evt.lengthComputable) {
            const percent = (evt.loaded / evt.total) * 100;
            console.log(`Loading: ${percent.toFixed(0)}%`);
          }
        }
      );

      // Cleanup blob URL
      URL.revokeObjectURL(blobURL);

      if (result.meshes && result.meshes.length > 0) {
        console.log(`✓ Loaded ${result.meshes.length} meshes from GLB`);

        const rootMesh = result.meshes[0];
        rootMesh.position = position.clone();

        // Scale and orient
        if (assetMapping.scale) {
          rootMesh.scaling = new Vector3(assetMapping.scale, assetMapping.scale, assetMapping.scale);
        }

        // Replace placeholder
        if (this.player) {
          this.player.dispose();
        }
        this.player = rootMesh;
        this.playerMesh = rootMesh;

        console.log('✓ 3D character model loaded successfully!');
      }
    } catch (error) {
      console.warn('[CharacterManager] Could not load 3D model, using placeholder:', error);
      console.log('[CharacterManager] Placeholder is already active, continuing...');
    }
  }

  /**
   * Load full character model in background (non-blocking)
   */
  private async loadCharacterInBackground(characterId: string, position: Vector3): Promise<void> {
    try {
      console.log(`[CharacterManager] Loading character model for: ${characterId}`);

      // Get asset mapping
      const assetMapping = getPlayerAssetPath(characterId);
      console.log(`[CharacterManager] Using asset: ${assetMapping.modelPath}`);

      // Load the GLB model directly
      const { SceneLoader } = await import('@babylonjs/core');
      const result = await SceneLoader.ImportMeshAsync(null, assetMapping.modelPath, this.scene);

      if (result.meshes && result.meshes.length > 0) {
        console.log(`✓ Loaded character model: ${result.meshes.length} meshes`);

        // Get root mesh
        const rootMesh = result.meshes[0];

        // Apply scaling if specified
        if (assetMapping.scale) {
          rootMesh.scaling = new Vector3(assetMapping.scale, assetMapping.scale, assetMapping.scale);
        }

        // Set position
        rootMesh.position = position.clone();
        // Add offset if specified
        if (assetMapping.offset) {
          rootMesh.position.x += assetMapping.offset.x;
          rootMesh.position.y += assetMapping.offset.y;
          rootMesh.position.z += assetMapping.offset.z;
        }

        // Enable shadows and collisions
        rootMesh.receiveShadows = true;
        const childMeshes = rootMesh.getChildMeshes();
        childMeshes.forEach((mesh: AbstractMesh) => {
          mesh.receiveShadows = true;
          (mesh as any).checkCollisions = true;
        });

        // Replace placeholder with loaded character
        if (this.player) {
          this.player.dispose();
        }
        this.player = rootMesh;
        this.playerMesh = rootMesh;

        // Validate skinning data
        if (this.assetLoader) {
          const validation = this.assetLoader.validateSkinnedMesh(rootMesh);
          console.log('Character model validation:', validation);
        }

        // Create Character wrapper for animation support
        this.playerCharacter = new Character(this.assetLoader, "Player");
        await this.playerCharacter.initialize('man');
        this.playerCharacter['root'] = rootMesh;

        // Attach skeleton if available
        if (result.skeletons && result.skeletons.length > 0) {
          this.playerCharacter['skeleton'] = result.skeletons[0];
          console.log(`✓ Skeleton attached: ${result.skeletons[0].name} (${result.skeletons[0].bones.length} bones)`);
        }

        console.log('✓ Full character model loaded and positioned');
      } else {
        console.log('⚠ No meshes in GLB file, using placeholder');
        this.playerMesh = this.player as AbstractMesh;
      }
    } catch (error) {
      console.error('Failed to load player character in background:', error);
      console.log('Continuing with placeholder model');
      this.playerMesh = this.player as AbstractMesh;
    }
  }

  /**
   * Create detailed 3D humanoid placeholder that looks like Silkroad character
   */
  private createPlayerPlaceholder(): void {
    // Chinese male character - detailed humanoid model
    const bodyHeight = 1.7;
    const bodyWidth = 0.5;
    const bodyDepth = 0.3;

    // Body (torso)
    const body = MeshBuilder.CreateBox('player_body', {
      width: bodyWidth,
      height: bodyHeight * 0.5,
      depth: bodyDepth
    }, this.scene);
    body.position.y = bodyHeight * 0.4;

    // Head
    const head = MeshBuilder.CreateBox('player_head', {
      width: 0.25,
      height: 0.3,
      depth: 0.25
    }, this.scene);
    head.position.y = bodyHeight * 0.8;
    head.parent = body;

    // Arms
    const armWidth = 0.12;
    const armHeight = bodyHeight * 0.4;

    const leftArm = MeshBuilder.CreateBox('player_left_arm', {
      width: armWidth,
      height: armHeight,
      depth: armWidth
    }, this.scene);
    leftArm.position.x = -(bodyWidth / 2 + armWidth / 2);
    leftArm.position.y = bodyHeight * 0.45;
    leftArm.parent = body;

    const rightArm = MeshBuilder.CreateBox('player_right_arm', {
      width: armWidth,
      height: armHeight,
      depth: armWidth
    }, this.scene);
    rightArm.position.x = bodyWidth / 2 + armWidth / 2;
    rightArm.position.y = bodyHeight * 0.45;
    rightArm.parent = body;

    // Legs
    const legWidth = 0.15;
    const legHeight = bodyHeight * 0.45;

    const leftLeg = MeshBuilder.CreateBox('player_left_leg', {
      width: legWidth,
      height: legHeight,
      depth: legWidth
    }, this.scene);
    leftLeg.position.x = -0.12;
    leftLeg.position.y = -legHeight / 2;
    leftLeg.parent = body;

    const rightLeg = MeshBuilder.CreateBox('player_right_leg', {
      width: legWidth,
      height: legHeight,
      depth: legWidth
    }, this.scene);
    rightLeg.position.x = 0.12;
    rightLeg.position.y = -legHeight / 2;
    rightLeg.parent = body;

    // Shoulders (padded armor look)
    const leftShoulder = MeshBuilder.CreateBox('player_left_shoulder', {
      width: 0.18,
      height: 0.12,
      depth: 0.18
    }, this.scene);
    leftShoulder.position.x = -(bodyWidth / 2 + 0.05);
    leftShoulder.position.y = bodyHeight * 0.62;
    leftShoulder.parent = body;

    const rightShoulder = MeshBuilder.CreateBox('player_right_shoulder', {
      width: 0.18,
      height: 0.12,
      depth: 0.18
    }, this.scene);
    rightShoulder.position.x = bodyWidth / 2 + 0.05;
    rightShoulder.position.y = bodyHeight * 0.62;
    rightShoulder.parent = body;

    // Materials - Chinese clothing colors (white/red theme)
    const bodyMat = new StandardMaterial('player_body_mat', this.scene);
    bodyMat.diffuseColor = new Color3(0.95, 0.9, 0.85); // Skin tone
    bodyMat.specularColor = new Color3(0.3, 0.3, 0.3);

    const clothesMat = new StandardMaterial('player_clothes_mat', this.scene);
    clothesMat.diffuseColor = new Color3(0.9, 0.9, 0.9); // White/cream Chinese clothes
    clothesMat.specularColor = new Color3(0.2, 0.2, 0.2);

    const armorMat = new StandardMaterial('player_armor_mat', this.scene);
    armorMat.diffuseColor = new Color3(0.6, 0.2, 0.15); // Red/brown armor
    armorMat.specularColor = new Color3(0.4, 0.4, 0.4);
    armorMat.emissiveColor = new Color3(0.05, 0.02, 0.02);

    // Apply materials
    head.material = bodyMat;
    leftArm.material = clothesMat;
    rightArm.material = clothesMat;
    leftLeg.material = clothesMat;
    rightLeg.material = clothesMat;
    body.material = armorMat;
    leftShoulder.material = armorMat;
    rightShoulder.material = armorMat;

    // Enable collisions on all parts
    const allParts = [body, head, leftArm, rightArm, leftLeg, rightLeg, leftShoulder, rightShoulder];
    allParts.forEach(part => {
      part.checkCollisions = true;
      part.isPickable = true;
      part.receiveShadows = true;
    });

    // Set as player
    if (this.player) {
      this.player.dispose();
    }
    this.player = body;
    this.playerMesh = body;

    console.log('✓ Created detailed 3D humanoid (Chinese warrior - full body model)');
  }

  /**
   * Update character
   */
  update(deltaTime: number): void {
    if (!this.player) return;

    // Handle movement
    this.handleMovement(deltaTime);

    // Smooth rotation
    this.handleRotation(deltaTime);

    // Update animations
    this.updateAnimations(deltaTime);
  }

  /**
   * Handle movement input
   */
  private handleMovement(deltaTime: number): void {
    if (!this.player) return;

    const inputState = this.input.getState();
    const isRunning = inputState.shift;

    // Debug: Log input state once when movement starts
    if ((inputState.forward || inputState.backward || inputState.left || inputState.right) && !this.isMoving) {
      console.log('[CharacterManager] Movement detected:', inputState);
      this.isMoving = true;
    } else if (!inputState.forward && !inputState.backward && !inputState.left && !inputState.right) {
      this.isMoving = false;
    }

    // Calculate movement direction
    let moveX = 0;
    let moveZ = 0;

    if (inputState.forward) moveZ += 1;
    if (inputState.backward) moveZ -= 1;
    if (inputState.left) moveX -= 1;
    if (inputState.right) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
      moveX *= 0.707;
      moveZ *= 0.707;
    }

    // Determine move speed
    const moveSpeed = isRunning ? 5.0 : 3.0;
    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      // Calculate target rotation based on movement direction
      const targetRotation = Math.atan2(moveX, moveZ);
      this.targetRotation = targetRotation;

      // Move player
      const movement = new Vector3(
        moveX * moveSpeed * deltaTime,
        0,
        moveZ * moveSpeed * deltaTime
      );

      // Apply rotation to movement direction (relative to camera)
      // TODO: Get camera rotation and apply to movement

      this.player.position.addInPlace(movement);
      console.log('[CharacterManager] Moving to:', this.player.position.toString());

      // Update state
      this.currentMoveSpeed = moveSpeed;

      // Update animation
      this.setAnimation(isRunning ? 'run' : 'walk');

      // Send movement to server
      this.network.sendMove(
        {
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z,
        },
        this.player.rotation.y,
        isRunning
      );
    } else {
      this.isMoving = false;
      this.currentMoveSpeed = 0;
      this.setAnimation('idle');
    }
  }

  /**
   * Handle smooth rotation
   */
  private handleRotation(deltaTime: number): void {
    if (!this.player) return;

    // Smooth rotation interpolation
    const rotationSpeed = 10;
    const currentRotation = this.player.rotation.y;
    const rotationDiff = this.targetRotation - currentRotation;

    // Normalize angle difference
    let normalizedDiff = rotationDiff;
    while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
    while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;

    // Apply rotation
    if (Math.abs(normalizedDiff) > 0.01) {
      this.player.rotation.y += normalizedDiff * rotationSpeed * deltaTime;
    }
  }

  /**
   * Update character animations
   */
  private updateAnimations(deltaTime: number): void {
    if (!this.playerCharacter?.skeleton) return;

    // Babylon.js handles animation updates automatically
    // This is where you would add animation blending logic
  }

  /**
   * Set current animation
   */
  private setAnimation(animationName: string): void {
    if (this.currentAnimation === animationName) return;

    this.playAnimation(animationName);
    this.currentAnimation = animationName;
  }

  /**
   * Play an animation
   */
  private playAnimation(animationName: string): void {
    if (!this.playerCharacter?.skeleton) return;

    // TODO: Implement animation playback
    // For now, this is a placeholder
    console.log(`Playing animation: ${animationName}`);
  }

  /**
   * Perform basic attack
   */
  private performAttack(): void {
    const now = Date.now();

    // Check cooldown
    if (now - this.lastAttackTime < this.attackCooldown) {
      return;
    }

    this.lastAttackTime = now;

    // Play attack animation
    this.playAnimation('attack');

    // Use combat system if available
    if (this.combat && this.player) {
      const success = this.combat.performAttack(this.player.position);
      if (success) {
        console.log('Attack performed via combat system');
      }
    } else {
      // Fallback to network attack (for multiplayer)
      const targetId = 'target_id_here';
      this.network.sendAttack(targetId);
      console.log('Basic attack performed (network mode)');
    }
  }

  /**
   * Use skill from quick slot
   */
  private useSkill(slot: number): void {
    // TODO: Get skill from quick slot
    const skillId = `skill_${slot}`;

    // Play skill animation
    this.playAnimation('attack');

    // TODO: Get target entity
    const targetId = 'target_id_here';

    // Send skill cast packet
    this.network.sendAttack(targetId, skillId);

    console.log(`Used skill from slot ${slot}`);
  }

  /**
   * Get player position
   */
  getPlayerPosition(): Vector3 | null {
    return this.player?.position.clone() || null;
  }

  /**
   * Get player node
   */
  getPlayer(): TransformNode | null {
    return this.player;
  }

  /**
   * Get player mesh (for physics, collisions, etc.)
   */
  getPlayerMesh(): AbstractMesh | null {
    return this.playerMesh;
  }

  /**
   * Set player character data
   */
  setPlayerData(data: Character): void {
    this.playerData = data;
  }

  /**
   * Get player character data
   */
  getPlayerData(): Character | null {
    return this.playerData;
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.player?.dispose();
    this.player = null;
    this.playerMesh = null;
    this.playerCharacter = null;
  }
}
