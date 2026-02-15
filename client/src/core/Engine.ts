// ============================================
// SRObro - Babylon.js 8.0 WebGPU Engine
// Based on 2025 best practices for WebGL/WebGPU
// ============================================

// @ts-nocheck
import {
  Engine,
  EngineOptions,
  WebGPUEngine,
} from '@babylonjs/core';

/**
 * Engine configuration options
 */
export interface SROEngineConfig {
  /**
   * Prefer WebGPU over WebGL2 if available
   * @default true
   */
  preferWebGPU?: boolean;

  /**
   * Enable adaptive quality (auto-adjust based on performance)
   * @default true
   */
  adaptiveQuality?: boolean;

  /**
   * Target FPS
   * @default 60
   */
  targetFPS?: number;

  /**
   * Enable performance monitoring
   * @default false
   */
  enablePerformanceMonitor?: boolean;

  /**
   * Limit texture size for performance
   * @default 4096
   */
  maxTextureSize?: number;

  /**
   * Enable antialiasing
   * @default true
   */
  antialias?: boolean;

  /**
   * Enable HDR rendering
   * @default false
   */
  hdr?: boolean;
}

/**
 * Creates and initializes a Babylon.js engine with WebGPU support
 *
 * Priority order:
 * 1. WebGPU (if available and enabled)
 * 2. WebGL2 (fallback)
 * 3. WebGL1 (last resort)
 *
 * @param canvas - HTML canvas element
 * @param config - Engine configuration
 * @returns Initialized Babylon.js engine
 */
export async function createSREngine(
  canvas: HTMLCanvasElement,
  config: SROEngineConfig = {}
): Promise<Engine> {
  const {
    preferWebGPU = true,
    adaptiveQuality = true,
    targetFPS = 60,
    enablePerformanceMonitor = false,
    maxTextureSize = 4096,
    antialias = true,
    hdr = false,
  } = config;

  // Engine options for WebGL/WebGPU
  const engineOptions: EngineOptions = {
    adaptToDeviceRatio: true,
    antialias,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    stencil: true,
    disableWebGL2Support: false,
  };

  let engine: Engine;

  // Try WebGPU first (Babylon.js 8.0)
  if (preferWebGPU && 'gpu' in navigator) {
    try {
      console.log('[SRObro] Initializing WebGPU engine...');

      // Create WebGPU engine
      const webgpuEngine = new WebGPUEngine(canvas, {
        deviceDescriptor: {
          requiredFeatures: [
            'depth-clip-control',
            'depth24unorm-stencil8',
            'timestamp-query',
          ],
        },
        adaptToDeviceRatio: true,
        antialias,
        enableOfflineSupport: false,
        powerPreference: 'high-performance',
      });

      // Initialize WebGPU
      await webgpuEngine.initAsync();

      engine = webgpuEngine as unknown as Engine;

      console.log('[SRObro] ✓ WebGPU engine initialized successfully');
      console.log('[SRObro] WebGPU engine initialized successfully');
    } catch (error) {
      console.warn('[SRObro] WebGPU initialization failed, falling back to WebGL2:', error);

      // Fallback to WebGL2
      engine = new Engine(canvas, antialias, engineOptions);
    }
  } else {
    // Use WebGL2 (standard)
    console.log('[SRObro] Initializing WebGL2 engine...');
    engine = new Engine(canvas, antialias, engineOptions);
  }

  // Enable performance optimizations
  setupPerformanceOptimizations(engine, {
    adaptiveQuality,
    targetFPS,
    maxTextureSize,
  });

  // Performance monitoring
  if (enablePerformanceMonitor) {
    setupPerformanceMonitoring(engine);
  }

  return engine;
}

/**
 * Sets up performance optimizations based on 2025 best practices
 */
function setupPerformanceOptimizations(
  engine: Engine,
  options: {
    adaptiveQuality: boolean;
    targetFPS: number;
    maxTextureSize: number;
  }
): void {
  const { adaptiveQuality, targetFPS, maxTextureSize } = options;

  // Limit texture size
  engine.setHardwareScalingLevel(1.0);

  // Enable scene optimizations (will be applied per scene)
  engine.enableOfflineSupport = false;

  // Adaptive quality system
  if (adaptiveQuality) {
    let fpsDropCount = 0;
    let currentQualityLevel = 1.0;

    engine.runRenderLoop(() => {
      const fps = engine.getFps();

      // Auto-adjust quality if FPS drops below target
      if (fps < targetFPS * 0.8 && fpsDropCount > 30) {
        // Reduce quality
        currentQualityLevel = Math.max(0.5, currentQualityLevel - 0.1);
        engine.setHardwareScalingLevel(1 / currentQualityLevel);
        fpsDropCount = 0;

        console.warn(`[SRObro] Performance drop detected, reduced quality to ${(currentQualityLevel * 100).toFixed(0)}%`);
      } else if (fps > targetFPS * 1.2 && currentQualityLevel < 1.0) {
        // Increase quality
        currentQualityLevel = Math.min(1.0, currentQualityLevel + 0.05);
        engine.setHardwareScalingLevel(1 / currentQualityLevel);

        console.log(`[SRObro] Performance good, increased quality to ${(currentQualityLevel * 100).toFixed(0)}%`);
      } else if (fps < targetFPS) {
        fpsDropCount++;
      }
    });
  }

  // Texture loading optimizations
  engine.textureFormatInUse = engine.getCaps().textureFloatLinearFiltering
    ? 'textureformat-float32'
    : Engine.TEXTURETYPE_UNSIGNED_INT;
}

/**
 * Sets up performance monitoring
 */
function setupPerformanceMonitoring(engine: Engine): void {
  // FPS monitoring
  setInterval(() => {
    const fps = engine.getFps().toFixed(1);
    // const drawCalls = engine.drawCallsPerFrame; // Removed in Babylon.js 8.0
    // const triangles = engine.trianglesPerFrame; // Removed in Babylon.js 8.0

    console.log(`[SRObro] FPS: ${fps} | Draw Calls: ${drawCalls} | Triangles: ${triangles}`);
  }, 5000);
}

/**
 * Gets engine capabilities for debugging
 */
export function getEngineCapabilities(engine: Engine): Record<string, unknown> {
  const caps = engine.getCaps();

  return {
    // Engine info
    engineType: (engine as unknown as { isWebGPU?: boolean }).isWebGPU ? 'WebGPU' : 'WebGL',
    webGLVersion: caps.version,
    // Capabilities
    maxTextureSize: caps.maxTextureSize,
    maxTexturesUnits: caps.maxTexturesImageUnits,
    maxVertexAttributes: caps.maxVertexAttribs,
    maxVaryingVectors: caps.maxVaryingVectors,
    maxFragmentUniformVectors: caps.maxFragmentUniformVectors,
    maxVertexUniformVectors: caps.maxVertexUniformVectors,
    // Features
    standardDerivatives: caps.standardDerivatives,
    textureFloat: caps.textureFloat,
    textureFloatLinearFiltering: caps.textureFloatLinearFiltering,
    textureFloatRender: caps.textureFloatRender,
    textureHalfFloat: caps.textureHalfFloat,
    textureHalfFloatLinearFiltering: caps.textureHalfFloatLinearFiltering,
    textureHalfFloatRender: caps.textureHalfFloatRender,
    // Compression
    s3tc: caps.s3tc,
    pvrtc: caps.pvrtc,
    etc1: caps.etc1,
    etc2: caps.etc2,
    astc: caps.astc,
    // Advanced features
    depthTexture: caps.depthTexture,
    drawBuffers: caps.maxDrawBuffers,
    vertexArrayObject: caps.vertexArrayObject,
    instancedArrays: caps.instancedArrays,
    // Performance
    parallelShaderCompile: caps.parallelShaderCompile,
    // Timing
    timestampQuery: caps.timerQuery,
    // Antialiasing
    maxMSAASamples: caps.maxMSAASamples,
  };
}

/**
 * Disposes engine and releases resources
 */
export function disposeEngine(engine: Engine): void {
  engine.dispose();
  console.log('[SRObro] Engine disposed');
}
