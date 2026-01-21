// ============================================
// SRObro - Babylon.js 8.0 Scene Configuration
// Based on 2025 best practices for MMORPG scenes
// ============================================

import {
  Scene,
  SceneOptions,
  Vector3,
  Color4,
  HemisphericLight,
  ShadowGenerator,
  DirectionalLight,
  PostProcess,
  PipelineManager,
  DefaultRenderingPipeline,
  GlowLayer,
  SSAO2RenderingPipeline,
  SSAORenderingPipeline,
  FreeCamera,
  // 2025 optimizations
  SceneOptimizer,
  SceneOptimizerOptions,
} from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { Engine } from './Engine';

/**
 * Scene configuration options
 */
export interface SROSceneConfig {
  /**
   * Scene ID/identifier
   */
  sceneId?: string;

  /**
   * Enable shadows
   * @default true
   */
  enableShadows?: boolean;

  /**
   * Enable post-processing
   * @default false (expensive, enable for high-end)
   */
  enablePostProcessing?: boolean;

  /**
   * Enable SSAO (Screen Space Ambient Occlusion)
   * @default false
   */
  enableSSAO?: boolean;

  /**
   * Enable glow layer for effects
   * @default true
   */
  enableGlow?: boolean;

  /**
   * Shadow map size
   * @default 2048
   */
  shadowMapSize?: number;

  /**
   * Environment color
   */
  environmentColor?: Color4;

  /**
   * Gravity vector
   */
  gravity?: Vector3;

  /**
   * Collisions enabled
   * @default true
   */
  enableCollisions?: boolean;
}

/**
 * Creates an optimized Babylon.js scene for MMORPG gameplay
 *
 * Optimizations based on 2025 best practices:
 * - Merged meshes for static geometry
 * - Thin instances for repeated objects
 * - Level of Detail (LOD)
 * - Frustum culling (automatic)
 * - Optimized shadow maps
 *
 * @param engine - Babylon.js engine
 * @param config - Scene configuration
 * @returns Optimized scene
 */
export async function createSROScene(
  engine: Engine,
  config: SROSceneConfig = {}
): Promise<Scene> {
  const {
    sceneId = 'default',
    enableShadows = true,
    enablePostProcessing = false,
    enableSSAO = false,
    enableGlow = true,
    shadowMapSize = 2048,
    environmentColor = new Color4(0.5, 0.7, 1.0, 1.0),
    gravity = new Vector3(0, -9.81, 0),
    enableCollisions = true,
  } = config;

  // Create scene
  const sceneOptions: SceneOptions = {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: true,
    // Performance optimizations
    clampUVs: false,
    createSceneOnCanvas: true,
  };

  const scene = new Scene(engine, sceneOptions);

  // Clear color (sky color)
  scene.clearColor = environmentColor;

  // Gravity and collisions
  scene.gravity = gravity;
  scene.collisionsEnabled = enableCollisions;

  // Performance monitoring
  scene.onReadyObservable.add(() => {
    console.log(`[SRObro] Scene "${sceneId}" ready`);
  });

  // ============================================
  // LIGHTING (Optimized for MMORPG)
  // ============================================

  // Hemispheric light (ambient lighting)
  const hemisphericLight = new HemisphericLight(
    'hemisphericLight',
    new Vector3(0, 1, 0),
    scene
  );
  hemisphericLight.intensity = 0.6;
  hemisphericLight.diffuse = new Color4(1.0, 0.95, 0.9, 1.0);
  hemisphericLight.groundColor = new Color4(0.2, 0.2, 0.2, 1.0);

  // Directional light (sun)
  const sunLight = new DirectionalLight(
    'sunLight',
    new Vector3(-1, -2, -1),
    scene
  );
  sunLight.intensity = 0.8;
  sunLight.diffuse = new Color4(1.0, 0.95, 0.8, 1.0);

  // ============================================
  // SHADOWS (Optimized shadow maps)
  // ============================================

  if (enableShadows) {
    const shadowGenerator = new ShadowGenerator(shadowMapSize, sunLight);

    // 2025 optimization: Filter quality for soft shadows
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.transparencyShadow = true;

    // Optimizations
    shadowGenerator.filter = ShadowGenerator.FILTER_BLUREXPONENTIAL;
    shadowGenerator.frustumEdgeFalloff = 0.1;

    scene.metadata = { shadowGenerator };
  }

  // ============================================
  // POST-PROCESSING (Optional for high-end)
  // ============================================

  if (enablePostProcessing) {
    const pipeline = new DefaultRenderingPipeline(
      'postProcess',
      true,
      scene,
      [scene.activeCamera!]
    );

    // Anti-aliasing
    pipeline.fxaaEnabled = true;

    // Bloom (glow)
    pipeline.glowLayerEnabled = true;
    pipeline.glowLayerIntensity = 0.5;

    // Color grading
    pipeline.colorCurveEnabled = false;
    pipeline.colorGradingEnabled = false;

    // Sharpening
    pipeline.sharpenEnabled = true;
    pipeline.sharpenEdgeAmount = 0.2;

    // Depth of field (expensive, disabled by default)
    pipeline.depthOfFieldEnabled = false;
  }

  // ============================================
  // GLOW LAYER (For skill effects)
  // ============================================

  if (enableGlow) {
    const glowLayer = new GlowLayer('glow', scene);
    glowLayer.intensity = 0.5;
    glowLayer.blurKernelSize = 32;
  }

  // ============================================
  // SSAO (Ambient occlusion)
  // ============================================

  if (enableSSAO) {
    const ssao = new SSAO2RenderingPipeline('ssao', scene, {
      ssaoRatio: 0.5,
      blurRatio: 0.5,
    });
    ssao.froxel_blur_froxel_amount = 1;
    ssao.froxel_blur_size = 2;
  }

  // ============================================
  // SCENE OPTIMIZER (Auto-adjust quality)
  // ============================================

  const optimizerOptions = new SceneOptimizerOptions(60, 2000);
  optimizerOptions.addOptimization(new SceneOptimizerOptions.HighPrioritizeSceneOptimization());

  const optimizer = new SceneOptimizer(scene, optimizerOptions);
  optimizer.start();

  // ============================================
  // PERFORMANCE MONITORING
  // ============================================

  scene.registerBeforeRender(() => {
    // Monitor performance
    const fps = engine.getFps();
    if (fps < 30) {
      // Auto-disable effects if FPS drops
      if (enablePostProcessing) {
        const pipeline = scene.getPipelineByName('postProcess');
        if (pipeline) {
          (pipeline as DefaultRenderingPipeline).enabled = false;
        }
      }
    }
  });

  // ============================================
  // GUI LAYER
  // ============================================

  const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  guiTexture.idealHeight = 720; // Reference height for responsive UI

  scene.metadata = {
    ...scene.metadata,
    guiTexture,
  };

  return scene;
}

/**
 * Merges static meshes into a single mesh for performance
 * Reduces draw calls from 100+ to 1
 *
 * @param scene - Babylon.js scene
 * @param meshes - Array of meshes to merge
 * @returns Merged mesh or null if merge failed
 */
export function mergeStaticMeshes(
  scene: Scene,
  meshes: import('@babylonjs/core').AbstractMesh[]
): import('@babylonjs/core').AbstractMesh | null {
  try {
    // Filter out meshes that shouldn't be merged
    const mergeableMeshes = meshes.filter(
      (mesh) =>
        !mesh.isAnInstance &&
        mesh.getTotalVertices() > 0 &&
        mesh.isSerializable()
    );

    if (mergeableMeshes.length === 0) return null;

    // Merge meshes
    const merged = import('@babylonjs/core').Mesh.MergeMeshes(
      mergeableMeshes,
      true, // allow32BitsIndex
      true, // disposeSource
      undefined,
      true, // ignoreHelper
      scene
    );

    if (merged) {
      merged.name = 'MergedStaticGeometry';
      merged.doNotSyncBoundingInfo = true;
      merged.alwaysSelectAsActiveMesh = false;

      console.log(`[SRObro] Merged ${mergeableMeshes.length} meshes into one`);
    }

    return merged;
  } catch (error) {
    console.error('[SRObro] Mesh merge failed:', error);
    return null;
  }
}

/**
 * Creates thin instances for repeated objects (trees, rocks, etc.)
 * Reduces draw calls from 1000+ to 1
 *
 * @param sourceMesh - Mesh to instance
 * @param matrices - Array of transformation matrices
 * @returns Number of instances created
 */
export function createThinInstances(
  sourceMesh: import('@babylonjs/core').Mesh,
  matrices: Float32Array
): number {
  const count = matrices.length / 16;

  sourceMesh.thinInstanceSetBuffer('matrix', matrices, 16);

  console.log(`[SRObro] Created ${count} thin instances for ${sourceMesh.name}`);

  return count;
}

/**
 * Sets up Level of Detail (LOD) for a mesh
 * Automatically switches to lower-poly meshes based on distance
 *
 * @param mesh - Mesh to add LOD to
 * @param lods - Array of [distance, mesh] tuples
 */
export function setupLOD(
  mesh: import('@babylonjs/core').AbstractMesh,
  lods: [number, import('@babylonjs/core').AbstractMesh][]
): void {
  for (const [distance, lodMesh] of lods) {
    mesh.addLODLevel(distance, lodMesh);
  }

  console.log(`[SRObro] Added ${lods.length} LOD levels to ${mesh.name}`);
}

/**
 * Freezes all active meshes to optimize rendering
 * Static meshes won't be updated every frame
 *
 * @param scene - Babylon.js scene
 */
export function freezeStaticMeshes(scene: Scene): void {
  for (const mesh of scene.meshes) {
    if (mesh.isEnabled() && !mesh.__originalIsPickable) {
      mesh.isPickable = false;
      mesh.__originalIsPickable = false;
    }
  }

  scene.freezeActiveMeshes();

  console.log('[SRObro] Froze active meshes for optimization');
}

/**
 * Unfreezes all active meshes
 *
 * @param scene - Babylon.js scene
 */
export function unfreezeStaticMeshes(scene: Scene): void {
  scene.unfreezeActiveMeshes();

  for (const mesh of scene.meshes) {
    if (mesh.__originalIsPickable === false) {
      mesh.isPickable = true;
    }
  }

  console.log('[SRObro] Unfroze active meshes');
}
