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
  TransformNode,
  Observer
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
  private target: TransformNode | null = null;
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

  // Update observer (retiré au dispose)
  private updateObserver: Observer<Scene> | null = null;

  // Vecteurs de travail pré-alloués: la boucle d'update ne doit allouer
  // aucun objet (GC churn à 60 FPS).
  private readonly _desired = new Vector3();
  private readonly _look = new Vector3();
  private readonly _direction = new Vector3();
  private readonly _ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1);

  // Mémo du dernier raycast de collision: inutile de re-raycaster ~2900 meshes
  // si ni l'orbite ni le zoom ni la cible n'ont bougé depuis le dernier frame.
  private _lastCollisionResult = new Vector3();
  private _lastRaycastKey = '';

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
    // Far plane élargi pour inclure la skybox (rayon ~9000) et les bâtiments
    // chargés jusqu'à 2600 m — sinon tout est clippé à 1000 m.
    this.camera.maxZ = 12000;
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
    const canvas = this.scene.getEngine().getRenderingCanvas();
    if (!canvas) return;

    // Mouse down - right click for rotation (avec capture du pointeur pour
    // que le drag continue même si la souris quitte le canvas)
    canvas.addEventListener('pointerdown', this.handlePointerDown);

    // Mouse up
    canvas.addEventListener('pointerup', this.endDrag);
    canvas.addEventListener('pointercancel', this.endDrag);

    // Mouse move - rotate camera
    canvas.addEventListener('pointermove', this.handlePointerMove);

    // Mouse wheel - zoom (permissif: de très près à vue de ville)
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });

    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', this.preventContextMenu);
  }

  private handlePointerDown = (e: PointerEvent): void => {
    if (e.button === 2) { // Right click
      this.isRightMouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      const canvas = this.scene.getEngine().getRenderingCanvas();
      try { canvas?.setPointerCapture(e.pointerId); } catch { /* non critique */ }
    }
  };

  private endDrag = (e: PointerEvent): void => {
    if (e.button === 2) {
      this.isRightMouseDown = false;
      const canvas = this.scene.getEngine().getRenderingCanvas();
      try { canvas?.releasePointerCapture(e.pointerId); } catch { /* non critique */ }
    }
  };

  private handlePointerMove = (e: PointerEvent): void => {
    if (this.isRightMouseDown) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      this.yaw += deltaX * this.config.rotationSpeed;
      // Convention MMO (SRO/WoW): glisser vers le BAS élève la caméra
      // (vue plongeante), glisser vers le HAUT la descend (vue rasante).
      this.pitch += deltaY * this.config.rotationSpeed;

      // Clamp pitch: légèrement au-dessus de l'horizon jusqu'à la verticale
      this.pitch = Math.max(-0.25, Math.min(1.52, this.pitch));

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  };

  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault();

    const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    this.currentDistance = Math.max(
      this.config.minDistance,
      Math.min(this.config.maxDistance, this.currentDistance * factor)
    );
  };

  private preventContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  /**
   * Start camera update loop
   */
  private startUpdate(): void {
    this.updateObserver = this.scene.onBeforeRenderObservable.add(() => {
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

    // Desired camera position (vecteur pré-alloué)
    this._desired.set(
      targetPos.x - offsetX,
      targetPos.y + offsetY,
      targetPos.z - offsetZ
    );

    // Check collision if enabled
    if (this.config.enableCollision) {
      this.checkCollision(targetPos, this._desired, this._desired);
    }

    // Smooth camera movement (sans allocation)
    Vector3.LerpToRef(
      this.camera.position,
      this._desired,
      this.config.smoothness,
      this.camera.position
    );

    // Look at target (tête du personnage, pas les pieds)
    this._look.set(targetPos.x, targetPos.y + 1.2, targetPos.z);
    this.camera.setTarget(this._look);
  }

  /**
   * Check collision between target and camera.
   * Écrit le résultat dans outPosition (aucune allocation).
   */
  private checkCollision(
    targetPos: Vector3,
    desiredPos: Vector3,
    outPosition: Vector3
  ): void {
    this._direction.set(
      desiredPos.x - targetPos.x,
      desiredPos.y - targetPos.y,
      desiredPos.z - targetPos.z
    );
    const distance = this._direction.length();
    if (distance < 1e-6) {
      outPosition.copyFrom(desiredPos);
      return;
    }
    this._direction.scaleInPlace(1 / distance);

    // Ne re-raycast que si l'état caméra/cible a changé depuis le dernier
    // frame: le pick parcourt les bounding boxes de ~2900 meshes de scène.
    const key = `${this.yaw.toFixed(3)}|${this.pitch.toFixed(3)}|${this.currentDistance.toFixed(2)}|${targetPos.x.toFixed(1)}|${targetPos.y.toFixed(1)}|${targetPos.z.toFixed(1)}`;
    if (key === this._lastRaycastKey) {
      outPosition.copyFrom(this._lastCollisionResult);
      return;
    }

    this._ray.origin.copyFrom(targetPos);
    this._ray.direction.copyFrom(this._direction);
    this._ray.length = distance;

    const hit = this.scene.pickWithRay(this._ray, (mesh) => {
      // Tests bon marché d'abord: la plupart des meshes sortent ici.
      if (!mesh.isPickable || !mesh.checkCollisions) return false;
      // Filter out target mesh
      if (this.target && (mesh === this.target || mesh.isDescendantOf(this.target))) {
        return false;
      }
      return true;
    });

    // Ignorer les contacts immédiats (< 8 u ≈ envergure du perso natif ~17 u):
    // le point de départ du rayon peut être à l'intérieur d'un mesh (couture
    // de terrain, propre corps) et écraserait la caméra contre le personnage.
    if (hit?.hit && hit.pickedPoint && hit.distance > 8) {
      const collisionDistance = Math.max(8, hit.distance - 4);
      const d = Math.min(collisionDistance, distance);
      outPosition.set(
        targetPos.x + this._direction.x * d,
        targetPos.y + this._direction.y * d,
        targetPos.z + this._direction.z * d
      );
    } else {
      outPosition.copyFrom(desiredPos);
    }

    this._lastRaycastKey = key;
    this._lastCollisionResult.copyFrom(outPosition);
  }

  /** Caméra interne (pour définir comme caméra active de la scène). */
  public get sceneCamera(): UniversalCamera {
    return this.camera;
  }

  /** Cible suivie (pour resynchroniser quand le modèle joueur est remplacé). */
  public getTarget(): TransformNode | null {
    return this.target;
  }

  /**
   * Set the target to follow
   */
  public setTarget(target: TransformNode | null): void {
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
    // Même plage que le clamp du drag (cohérence orbite programmatique/souris)
    this.pitch = Math.max(-0.25, Math.min(1.52, pitch));
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
    if (this.updateObserver) {
      this.scene.onBeforeRenderObservable.remove(this.updateObserver);
      this.updateObserver = null;
    }
    const canvas = this.scene.getEngine().getRenderingCanvas();
    if (canvas) {
      canvas.removeEventListener('pointerdown', this.handlePointerDown);
      canvas.removeEventListener('pointerup', this.endDrag);
      canvas.removeEventListener('pointercancel', this.endDrag);
      canvas.removeEventListener('pointermove', this.handlePointerMove);
      canvas.removeEventListener('wheel', this.handleWheel);
      canvas.removeEventListener('contextmenu', this.preventContextMenu);
    }
    this.camera.dispose();
    console.log('ThirdPersonCamera disposed');
  }
}
