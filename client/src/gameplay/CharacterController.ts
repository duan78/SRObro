/**
 * Character Controller
 *
 * Handles character movement with WASD controls and jump
 * Uses Babylon.js physics for smooth movement
 * Integrated with AnimationManager for state-based animation playback
 */

import {
  Scene,
  Vector3,
  TransformNode,
  AbstractMesh,
  Ray,
  Mesh,
  Quaternion
} from '@babylonjs/core';

import { AnimationManager, AnimationState } from '../animation/AnimationManager';

/**
 * Movement state
 */
interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
}

/**
 * Character controller configuration
 */
interface CharacterControllerConfig {
  walkSpeed: number;
  runSpeed: number;
  jumpForce: number;
  gravity: number;
  rotationSpeed: number;
  enableCollisions: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: CharacterControllerConfig = {
  walkSpeed: 5,
  runSpeed: 10,
  jumpForce: 8,
  gravity: -20,
  rotationSpeed: 0.1,
  enableCollisions: true
};

/**
 * Character Controller Class
 *
 * Provides FPS/TPS style character controls
 */
export class CharacterController {
  private scene: Scene;
  private mesh: TransformNode;
  private config: CharacterControllerConfig;
  private animationManager: AnimationManager | null = null;

  // Movement state
  private movement: MovementState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false
  };

  // Physics
  private velocity: Vector3 = Vector3.Zero();
  private isGrounded: boolean = true;
  private verticalVelocity: number = 0;

  // Rotation
  private targetRotation: number = 0;
  private currentRotation: number = 0;

  // Camera reference
  private cameraYaw: number = 0;

  // Animation state tracking
  private wasMovingLastFrame: boolean = false;

  constructor(
    scene: Scene,
    characterMesh: TransformNode,
    animationManager: AnimationManager | null = null,
    config: Partial<CharacterControllerConfig> = {}
  ) {
    this.scene = scene;
    this.mesh = characterMesh;
    this.animationManager = animationManager;
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Enable collisions on character
    if (this.config.enableCollisions) {
      this.enableCollision();
    }

    // Setup input listeners
    this.setupInput();

    console.log('CharacterController initialized');
  }

  /**
   * Set the animation manager
   */
  public setAnimationManager(animationManager: AnimationManager): void {
    this.animationManager = animationManager;
  }

  /**
   * Enable collision detection
   */
  private enableCollision(): void {
    // Check if mesh is an AbstractMesh
    if (this.mesh instanceof AbstractMesh) {
      this.mesh.checkCollisions = true;
      this.mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
      this.mesh.ellipsoidOffset = new Vector3(0, 1, 0);
    }

    // Enable collisions on all children
    this.mesh.getChildren().forEach(child => {
      if (child instanceof AbstractMesh) {
        child.checkCollisions = true;
        child.ellipsoid = new Vector3(0.5, 1, 0.5);
      }
    });
  }

  /**
   * Setup input listeners
   */
  private setupInput(): void {
    this.scene.onBeforeRenderObservable.add(() => {
      this.update();
    });
  }

  /**
   * Update character movement
   */
  private update(): void {
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

    // Calculate movement direction
    const moveDirection = this.calculateMoveDirection();

    // Update animation state based on movement
    this.updateAnimationState(moveDirection);

    // Apply rotation
    this.updateRotation();

    // Apply movement
    if (moveDirection.length() > 0) {
      this.applyMovement(moveDirection, deltaTime);
    }

    // Apply gravity and jumping
    this.applyVerticalMovement(deltaTime);

    // Update mesh position
    this.mesh.position.addInPlace(this.velocity.scale(deltaTime));

    // Update animation manager if exists
    if (this.animationManager) {
      this.animationManager.update(deltaTime);
    }
  }

  /**
   * Update animation state based on movement
   */
  private updateAnimationState(moveDirection: Vector3): void {
    if (!this.animationManager) return;

    const isMoving = moveDirection.length() > 0.1;
    const isJumping = !this.isGrounded;

    // Priority: Jump > Attack/Action > Run/Walk > Idle
    if (isJumping) {
      if (this.animationManager.getCurrentState() !== AnimationState.JUMP) {
        this.animationManager.play(AnimationState.JUMP);
      }
    } else if (isMoving) {
      // Check if sprinting
      const targetState = this.movement.sprint ? AnimationState.RUN : AnimationState.WALK;
      if (this.animationManager.getCurrentState() !== targetState) {
        this.animationManager.play(targetState);
      }
    } else if (!isMoving && this.wasMovingLastFrame) {
      // Just stopped moving, go back to idle
      this.animationManager.play(AnimationState.IDLE);
    }

    this.wasMovingLastFrame = isMoving;
  }

  /**
   * Calculate movement direction based on input and camera
   */
  private calculateMoveDirection(): Vector3 {
    const direction = Vector3.Zero();

    // Get camera forward/right vectors (ignore Y)
    const forward = Vector3.Forward();
    forward.y = 0;
    forward.normalize();

    const right = Vector3.Right();
    right.y = 0;
    right.normalize();

    // Calculate input direction
    if (this.movement.forward) {
      direction.addInPlace(forward);
    }
    if (this.movement.backward) {
      direction.subtractInPlace(forward);
    }
    if (this.movement.left) {
      direction.subtractInPlace(right);
    }
    if (this.movement.right) {
      direction.addInPlace(right);
    }

    // Rotate direction by camera yaw
    if (direction.length() > 0) {
      direction.normalize();
      const rotatedDirection = this.rotateVector(direction, this.cameraYaw);
      return rotatedDirection;
    }

    return Vector3.Zero();
  }

  /**
   * Rotate vector by angle
   */
  private rotateVector(vector: Vector3, angle: number): Vector3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Vector3(
      vector.x * cos - vector.z * sin,
      vector.y,
      vector.x * sin + vector.z * cos
    );
  }

  /**
   * Update character rotation
   */
  private updateRotation(): void {
    // Smooth rotation towards target
    const rotationDiff = this.targetRotation - this.currentRotation;

    // Handle wrap-around
    let adjustedDiff = rotationDiff;
    if (adjustedDiff > Math.PI) {
      adjustedDiff -= 2 * Math.PI;
    } else if (adjustedDiff < -Math.PI) {
      adjustedDiff += 2 * Math.PI;
    }

    // Apply rotation speed
    this.currentRotation += adjustedDiff * this.config.rotationSpeed;

    // Apply to mesh
    this.mesh.rotation.y = this.currentRotation;
  }

  /**
   * Apply horizontal movement
   */
  private applyMovement(direction: Vector3, deltaTime: number): void {
    // Calculate speed
    const speed = this.movement.sprint ? this.config.runSpeed : this.config.walkSpeed;

    // Set velocity
    this.velocity.x = direction.x * speed;
    this.velocity.z = direction.z * speed;

    // Rotate character to face movement direction
    if (direction.length() > 0.1) {
      this.targetRotation = Math.atan2(direction.x, direction.z);
    }
  }

  /**
   * Apply vertical movement (gravity + jump)
   */
  private applyVerticalMovement(deltaTime: number): void {
    // Check if grounded
    this.checkGrounded();

    // Jump input
    if (this.movement.jump && this.isGrounded) {
      this.verticalVelocity = this.config.jumpForce;
      this.isGrounded = false;
      this.movement.jump = false; // Prevent continuous jumping
    }

    // Apply gravity
    if (!this.isGrounded) {
      this.verticalVelocity += this.config.gravity * deltaTime;
    } else {
      // Reset vertical velocity when grounded
      if (this.verticalVelocity < 0) {
        this.verticalVelocity = 0;
      }
    }

    this.velocity.y = this.verticalVelocity;
  }

  /**
   * Check if character is on the ground
   */
  private checkGrounded(): void {
    // Raycast down from character position
    const ray = new Ray(
      this.mesh.position.add(new Vector3(0, 0.5, 0)),
      Vector3.Down(),
      1.0
    );

    const hit = this.scene.pickWithRay(ray, (mesh) => {
      // Filter out character mesh
      if (mesh === this.mesh || mesh.isDescendantOf(this.mesh)) {
        return false;
      }
      return mesh.isPickable;
    });

    this.isGrounded = hit?.hit ?? false;
  }

  /**
   * Set camera yaw (for movement direction calculation)
   */
  public setCameraYaw(yaw: number): void {
    this.cameraYaw = yaw;
  }

  /**
   * Play attack animation
   */
  public attack(): boolean {
    if (this.animationManager) {
      return this.animationManager.play(AnimationState.ATTACK);
    }
    return false;
  }

  /**
   * Play skill animation
   */
  public useSkill(): boolean {
    if (this.animationManager) {
      return this.animationManager.play(AnimationState.SKILL);
    }
    return false;
  }

  /**
   * Play hit animation
   */
  public hit(): boolean {
    if (this.animationManager) {
      return this.animationManager.play(AnimationState.HIT);
    }
    return false;
  }

  /**
   * Play die animation
   */
  public die(): boolean {
    if (this.animationManager) {
      return this.animationManager.play(AnimationState.DIE);
    }
    return false;
  }

  /**
   * Get the animation manager
   */
  public getAnimationManager(): AnimationManager | null {
    return this.animationManager;
  }

  /**
   * Input handlers
   */
  public setForward(active: boolean): void { this.movement.forward = active; }
  public setBackward(active: boolean): void { this.movement.backward = active; }
  public setLeft(active: boolean): void { this.movement.left = active; }
  public setRight(active: boolean): void { this.movement.right = active; }
  public setJump(active: boolean): void { this.movement.jump = active; }
  public setSprint(active: boolean): void { this.movement.sprint = active; }

  /**
   * Get current velocity
   */
  public getVelocity(): Vector3 {
    return this.velocity;
  }

  /**
   * Check if character is moving
   */
  public isMoving(): boolean {
    return this.movement.forward || this.movement.backward ||
           this.movement.left || this.movement.right;
  }

  /**
   * Get character position
   */
  public getPosition(): Vector3 {
    return this.mesh.position;
  }

  /**
   * Set character position
   */
  public setPosition(position: Vector3): void {
    this.mesh.position = position;
  }

  /**
   * Dispose controller
   */
  public dispose(): void {
    // Input will be cleaned up by scene
    console.log('CharacterController disposed');
  }
}
