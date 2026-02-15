/**
 * SRObro - Character Manager
 * Manages player character state and behavior
 * Uses AssetLoader to load real character models
 */

// @ts-nocheck
import type { Scene } from '@babylonjs/core';
import { Vector3, TransformNode, AbstractMesh } from '@babylonjs/core';
import { NetworkManager } from '../network/NetworkManager';
import { InputManager } from '../core/InputManager';
import { AssetLoader } from '../core/AssetLoader';
import { Character } from './Character';
import type { Character as CharacterData, MovementState } from '@srobro/shared'; // Renamed import to avoid conflict

export class CharacterManager {
  private scene: Scene;
  private network: NetworkManager;
  private input: InputManager;
  private assetLoader: AssetLoader;

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

    try {
      this.playerCharacter = new Character(this.assetLoader, "Player");
      // Default to european male for test
      await this.playerCharacter.initialize('man');
      
      // Equip default items
      await this.playerCharacter.equip('chest', 'clothes_01_la'); // Test item
      await this.playerCharacter.equip('legs', 'clothes_01_ba');
      await this.playerCharacter.equip('feet', 'clothes_01_fa');
      await this.playerCharacter.equip('hands', 'clothes_01_aa');
      
      // Get the root mesh
      this.player = this.playerCharacter.root;
      this.player.position = position;

      // Find the main mesh for animations (root is usually a container, animations on children?)
      // For now, assume root or first child
      this.playerMesh = this.player as AbstractMesh;

      console.log('Player spawned successfully');

    } catch (error) {
      console.error('Failed to load player character:', error);
      console.log('Falling back to placeholder model');
      this.createPlayerPlaceholder();
    }
  }

  /**
   * Create placeholder player model (fallback if asset loading fails)
   */
  private createPlayerPlaceholder(): void {
    if (!this.player) {
      this.player = new TransformNode('player_placeholder', this.scene);
    }
    this.player.position = new Vector3(0, 0, 0);

    // TODO: Create a simple mesh placeholder if needed
    // For now, just use the empty TransformNode

    console.log('Player placeholder created (models will be loaded later)');
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

      // Update state
      this.isMoving = true;
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

    // TODO: Get target entity from raycast or selection
    const targetId = 'target_id_here';

    // Send attack packet
    this.network.sendAttack(targetId);

    console.log('Basic attack performed');
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
