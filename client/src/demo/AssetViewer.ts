/**
 * Asset Viewer Demo
 *
 * Interactive viewer to test and visualize converted game assets
 */

import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  Vector3,
  Color3,
  HighlightLayer,
  Mesh,
  TransformNode,
  SceneLoader,
  GUI
} from '@babylonjs/core';
import { AdvancedDynamicTexture, Rectangle, TextBlock, Button, Control } from '@babylonjs/gui';

/**
 * Asset Viewer Demo
 */
export class AssetViewer {
  private engine: Engine;
  private scene: Scene;
  private camera: ArcRotateCamera;
  private highlightLayer: HighlightLayer;
  private ui: AdvancedDynamicTexture;

  // Current loaded asset
  private currentAsset: TransformNode | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.highlightLayer = new HighlightLayer('hl1', this.scene);

    this.setupScene();
    this.setupLights();
    this.setupCamera();
    this.setupUI();

    // Start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  /**
   * Set up the scene
   */
  private setupScene(): void {
    this.scene.clearColor = new Color3(0.1, 0.1, 0.15);

    // Create ground plane
    const ground = Mesh.CreateGround('ground', 20, 20, 32, this.scene);
    ground.position.y = -1;
    const groundMaterial = new StandardMaterial('groundMat', this.scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.25);
    groundMaterial.specularColor = new Color4(0.1, 0.1, 0.1, 1.0);
    ground.material = groundMaterial;
  }

  /**
   * Set up lights
   */
  private setupLights(): void {
    // Hemispheric light for ambient
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), this.scene);
    hemiLight.intensity = 0.6;
    hemiLight.diffuse = new Color3(1, 1, 1);

    // Directional light for shadows
    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), this.scene);
    dirLight.position = new Vector3(10, 20, 10);
    dirLight.intensity = 0.8;
    dirLight.diffuse = new Color3(1, 0.95, 0.9);

    // Enable shadows
    const shadowGenerator = new ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
  }

  /**
   * Set up camera
   */
  private setupCamera(): void {
    this.camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      5,
      Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(this.engine.getRenderingCanvas() as HTMLElement, true);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 20;
    this.camera.wheelPrecision = 50;
  }

  /**
   * Set up UI
   */
  private setupUI(): void {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI('UI');

    // Title
    const titleRect = new Rectangle();
    titleRect.width = '300px';
    titleRect.height = '60px';
    titleRect.thickness = 2;
    titleRect.cornerRadius = 10;
    titleRect.color = '#ffd700';
    titleRect.background = 'rgba(0, 0, 0, 0.7)';
    titleRect.adaptWidthToChildren = true;
    titleRect.paddingTop = '10px';
    titleRect.paddingBottom = '10px';
    titleRect.paddingLeft = '20px';
    titleRect.paddingRight = '20px';
    this.ui.addControl(titleRect);
    titleRect.linkOffsetY = -280;

    const titleText = new TextBlock();
    titleText.text = 'Asset Viewer Demo';
    titleText.color = '#ffd700';
    titleText.fontSize = 28;
    titleText.fontWeight = 'bold';
    titleRect.addControl(titleText);

    // Info panel
    const infoRect = new Rectangle();
    infoRect.width = '400px';
    infoRect.height = '200px';
    infoRect.thickness = 2;
    infoRect.cornerRadius = 10;
    infoRect.color = '#ffd700';
    infoRect.background = 'rgba(0, 0, 0, 0.8)';
    this.ui.addControl(infoRect);
    infoRect.linkOffsetY = 200;
    infoRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    infoRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    infoRect.paddingLeft = '20px';
    infoRect.paddingBottom = '20px';

    this.infoText = new TextBlock();
    this.infoText.text = 'Press SPACE to load random asset\nArrow keys to rotate camera\nMouse wheel to zoom';
    this.infoText.color = '#ffffff';
    this.infoText.fontSize = 18;
    this.infoText.textWrapping = true;
    infoRect.addControl(this.infoText);

    // Load button
    const loadBtn = Button.CreateSimpleButton('loadBtn', 'Load Random Asset');
    loadBtn.width = '200px';
    loadBtn.height = '40px';
    loadBtn.color = '#ffd700';
    loadBtn.cornerRadius = 20;
    loadBtn.background = 'rgba(255, 215, 0, 0.2)';
    loadBtn.onPointerUpObservable.add(() => {
      this.loadRandomAsset();
    });
    this.ui.addControl(loadBtn);
    loadBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    loadBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    loadBtn.paddingTop = '20px';
    loadBtn.paddingRight = '20px';

    // Wireframe toggle
    const wireframeBtn = Button.CreateSimpleButton('wireBtn', 'Toggle Wireframe');
    wireframeBtn.width = '200px';
    wireframeBtn.height = '40px';
    wireframeBtn.color = '#ffd700';
    wireframeBtn.cornerRadius = 20;
    wireframeBtn.background = 'rgba(255, 215, 0, 0.2)';
    wireframeBtn.onPointerUpObservable.add(() => {
      this.toggleWireframe();
    });
    this.ui.addControl(wireframeBtn);
    wireframeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    wireframeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    wireframeBtn.paddingTop = '70px';
    wireframeBtn.paddingRight = '20px';
  }

  /**
   * Load a random asset from the manifest
   */
  private async loadRandomAsset(): Promise<void> {
    // For demo, load from a list of known assets
    const assets = [
      'models/avatar_m_amalun.glb',
      'models/avatar_w_europe.glb',
      'models/chair_wood01.glb',
      'models/table_wood01.glb',
      'models/rock_mt01.glb',
      'models/tree_pine01.glb'
    ];

    const randomAsset = assets[Math.floor(Math.random() * assets.length)];

    try {
      // Update info text
      this.infoText.text = `Loading: ${randomAsset}\nPlease wait...`;

      // Load asset
      const result = await SceneLoader.ImportMeshAsync(null, './assets/', randomAsset, this.scene);

      // Remove previous asset
      if (this.currentAsset) {
        this.currentAsset.dispose();
      }

      // Set new asset
      if (result.meshes.length > 0) {
        // Create root node
        this.currentAsset = new TransformNode('assetRoot', this.scene);

        // Parent all meshes to root
        for (const mesh of result.meshes) {
          mesh.parent = this.currentAsset;
        }

        // Center and scale
        this.centerAsset(this.currentAsset);

        // Add highlight
        for (const mesh of result.meshes) {
          if (mesh instanceof Mesh) {
            this.highlightLayer.addMesh(mesh, Color3.Yellow());
          }
        }
      }

      // Update info
      const meshCount = result.meshes.length;
      const info = `Asset: ${randomAsset}\nMeshes: ${meshCount}\n\nControls:\nSPACE - Load random asset\nW - Toggle wireframe\nMouse - Rotate camera\nScroll - Zoom`;

      this.infoText.text = info;

    } catch (error) {
      console.error('Failed to load asset:', error);
      this.infoText.text = `Failed to load: ${randomAsset}\n\nCheck console for details`;
    }
  }

  /**
   * Center asset and adjust scale
   */
  private centerAsset(asset: TransformNode): void {
    // Get bounding box
    const boundingInfo = asset.getHierarchyBoundingVectors();

    // Calculate center
    const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);

    // Calculate size
    const size = boundingInfo.max.subtract(boundingInfo.min);

    // Move to center
    asset.position = center.negate();

    // Scale to fit in view
    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetSize = 3;
    const scale = targetSize / maxDimension;
    asset.scaling = new Vector3(scale, scale, scale);
  }

  /**
   * Toggle wireframe mode
   */
  private toggleWireframe(): void {
    if (!this.currentAsset) return;

    const meshes = this.currentAsset.getChildren();
    for (const child of meshes) {
      if (child instanceof Mesh) {
        const material = child.material as any;
        if (material) {
          material.wireframe = !material.wireframe;
        }
      }
    }
  }

  /**
   * Load a specific asset by path
   */
  public async loadAsset(assetPath: string): Promise<void> {
    try {
      const result = await SceneLoader.ImportMeshAsync(null, './assets/', assetPath, this.scene);

      if (this.currentAsset) {
        this.currentAsset.dispose();
      }

      if (result.meshes.length > 0) {
        this.currentAsset = new TransformNode('assetRoot', this.scene);

        for (const mesh of result.meshes) {
          mesh.parent = this.currentAsset;
        }

        this.centerAsset(this.currentAsset);

        for (const mesh of result.meshes) {
          if (mesh instanceof Mesh) {
            this.highlightLayer.addMesh(mesh, Color3.Yellow());
          }
        }
      }
    } catch (error) {
      console.error('Failed to load asset:', error);
    }
  }

  /**
   * Get scene (for external access)
   */
  public getScene(): Scene {
    return this.scene;
  }
}
