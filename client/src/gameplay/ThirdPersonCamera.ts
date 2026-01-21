/**
 * Third Person Camera
 *
 * Camera that follows the player character with smooth controls
 * Similar to MMORPG cameras (WoW, GW2, etc.)
 */

import {
  Scene,
  UniversalCamera,
  Vector3,
  Ray,
  AbstractMesh,
  Node,
  PointerEventTypes
} from '@babylonjs/core';

/**
 * Camera configuration
 */
interface ThirdPersonCameraConfig {
  distance: number;
  height: number;
  minHeight: number;
  maxHeight: number;
  minDistance: number;
  maxDistance: number;
  rotationSpeed: number;
  zoomSpeed: number;
  smoothness: number;
  enableCollision: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ThirdPersonCameraConfig = {
  distance: 8,
  height: 3,
  minHeight: 0,
  maxHeight: 10,
  minDistance: 3,
  maxDistance: 20,
  rotationSpeed: 0.003,
  zoomSpeed: 0.5,
  smoothness: 0.1,
  enableCollision: true
};

/**
 * Third Person Camera Class
 *
 * Follows target with orbit controls
 */
export class ThirdPersonCamera {
  private scene: Scene;
  private target: Node | null = null;
  private camera: UniversalCamera;
  private config: ThirdPersonCameraConfig;

  // Camera rotation
  private yaw: number = 0;
  private pitch: number = 0.5;

  // Current values (for smoothing)
  private currentDistance: number;
  private currentHeight: number;

  // Mouse control
  private isRightMouseDown: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  constructor(
    scene: Scene,
    config: Partial<ThirdPersonCameraConfig> = {}
  ) {
    this.scene = scene;
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Create camera
    this.camera = new UniversalCamera(
      'tpCamera',
      new Vector3(0, 5, -10),
      scene
    );

    // Camera setup
    this.camera.setTarget(Vector3.Zero());
    this.camera.minZ = 0.1;
    this.camera.maxZ = 1000;
    this.camera.fov = 1.0;
    this.camera.inertia = 0;

    // Initialize current values
    this.currentDistance = this.config.distance;
    this.currentHeight = this.config.height;

    // Setup controls
    this.setupControls();

    // Start update loop
    this.startUpdate();

    console.log('ThirdPersonCamera initialized');
  }

  /**
   * Setup mouse/touch controls
   */
  private setupControls(): void {
    const canvas = this.scene.getEngine().getRenderingCanvas()!;
    if (!canvas) return;

    // Mouse down - right click for rotation
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 2) { // Right click
        this.isRightMouseDown = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    // Mouse up
    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 2) {
        this.isRightMouseDown = false;
      }
    });

    // Mouse move - rotate camera
    canvas.addEventListener('mousemove', (e) => {
      if (this.isRightMouseDown) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.yaw += deltaX * this.config.rotationSpeed;
        this.pitch -= deltaY * this.config.rotationSpeed;

        // Clamp pitch
        this.pitch = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    // Mouse wheel - zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();

      const delta = e.deltaY * this.config.zoomSpeed;
      this.currentDistance = Math.max(
        this.config.minDistance,
        Math.min(this.config.maxDistance, this.currentDistance + delta)
      );
    });

    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Start camera update loop
   */
  private startUpdate(): void {
    this.scene.onBeforeRenderObservable.add(() => {
      this.update();
    });
  }

  /**
   * Update camera position
   */
  private update(): void {
    if (!this.target) return;

    // Calculate target position
    const targetPos = this.target.position;

    // Calculate camera offset based on rotation
    const offsetX = Math.sin(this.yaw) * Math.cos(this.pitch) * this.currentDistance;
    const offsetZ = Math.cos(this.yaw) * Math.cos(this.pitch) * this.currentDistance;
    const offsetY = Math.sin(this.pitch) * this.currentDistance + this.currentHeight;

    // Desired camera position
    const desiredPosition = new Vector3(
      targetPos.x - offsetX,
      targetPos.y + offsetY,
      targetPos.z - offsetZ
    );

    // Check collision if enabled
    let finalPosition = desiredPosition;
    if (this.config.enableCollision) {
      finalPosition = this.checkCollision(targetPos, desiredPosition);
    }

    // Smooth camera movement
    this.camera.position = Vector3.Lerp(
      this.camera.position,
      finalPosition,
      this.config.smoothness
    );

    // Look at target
    this.camera.setTarget(targetPos);
  }

  /**
   * Check collision between target and camera
   */
  private checkCollision(
    targetPos: Vector3,
    desiredPos: Vector3
  ): Vector3 {
    const direction = desiredPos.subtract(targetPos);
    const distance = direction.length();
    direction.normalize();

    const ray = new Ray(targetPos, direction, distance);

    const hit = this.scene.pickWithRay(ray, (mesh) => {
      // Filter out target mesh
      if (this.target && (mesh === this.target || mesh.isDescendantOf(this.target))) {
        return false;
      }
      return mesh.isPickable && mesh.checkCollisions;
    });

    if (hit?.hit && hit.pickedPoint) {
      // Move camera closer to avoid clipping
      const collisionDistance = hit.distance - 0.5;
      return targetPos.add(direction.scale(Math.max(1, collisionDistance)));
    }

    return desiredPos;
  }

  /**
   * Set the target to follow
   */
  public setTarget(target: Node | null): void {
    this.target = target;

    if (target) {
      // Position camera behind target
      const pos = target.position;
      this.camera.position = new Vector3(
        pos.x,
        pos.y + this.config.height,
        pos.z - this.config.distance
      );
    }
  }

  /**
   * Get the camera (for adding to scene)
   */
  public getCamera(): UniversalCamera {
    return this.camera;
  }

  /**
   * Get camera yaw (for character controller)
   */
  public getYaw(): number {
    return this.yaw;
  }

  /**
   * Set camera yaw
   */
  public setYaw(yaw: number): void {
    this.yaw = yaw;
  }

  /**
   * Set camera pitch
   */
  public setPitch(pitch: number): void {
    this.pitch = Math.max(0.1, Math.min(Math.PI / 2 - 0.1, pitch));
  }

  /**
   * Reset camera to default position
   */
  public reset(): void {
    this.yaw = 0;
    this.pitch = 0.5;
    this.currentDistance = this.config.distance;
    this.currentHeight = this.config.height;
  }

  /**
   * Dispose camera
   */
  public dispose(): void {
    this.camera.dispose();
    console.log('ThirdPersonCamera disposed');
  }
}
