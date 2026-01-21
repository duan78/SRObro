/**
 * SRObro Gameplay Demo
 *
 * Complete gameplay implementation with:
 * - Character controller (WASD + Jump)
 * - Third person camera
 * - Collision detection
 * - Asset loading
 */

// Global state
let canvas, engine, scene;
let characterMesh = null;
let characterController = null;
let tpCamera = null;
let ground = null;
let textureMaterialManager = null;

/**
 * TextureMaterialManager - JavaScript version
 * Dynamically applies textures to GLB models that don't have embedded materials
 */
class TextureMaterialManager {
  constructor(scene) {
    this.scene = scene;
    this.textureCache = new Map();
    this.mappings = new Map();
    this.mappingsLoaded = false;
  }

  /**
   * Initialize and load texture mappings
   */
  async init() {
    try {
      const response = await fetch('./assets/texture_mapping.json');
      const data = await response.json();
      if (data.mappings && Array.isArray(data.mappings)) {
        for (const mapping of data.mappings) {
          this.mappings.set(mapping.model, mapping.texture);
        }
      }
      this.mappingsLoaded = true;
      console.log(`TextureMaterialManager: Loaded ${this.mappings.size} texture mappings`);
    } catch (error) {
      console.warn('TextureMaterialManager: Could not load texture_mapping.json', error);
      this.mappingsLoaded = true; // Mark as loaded even on error
    }
  }

  /**
   * Apply textures to a loaded model
   */
  async applyTexturesToModel(rootNode, modelName) {
    // Wait for mappings to load
    if (!this.mappingsLoaded) {
      await this.init();
    }

    const textureName = this.findTextureForModel(modelName);

    if (textureName) {
      await this.applyTextureMaterial(rootNode, modelName, textureName);
    } else {
      this.applyDefaultMaterial(rootNode, modelName);
    }
  }

  /**
   * Find the texture name for a given model
   */
  findTextureForModel(modelName) {
    // First check explicit mappings
    if (this.mappings.has(modelName)) {
      return this.mappings.get(modelName);
    }

    // Fall back to name convention (same base name)
    // Return the model name as texture name (will try .webp, .dds, .png)
    return modelName;
  }

  /**
   * Apply a texture material to all meshes in the model
   */
  async applyTextureMaterial(rootNode, modelName, textureName) {
    try {
      // Try to load the texture
      const texture = await this.loadTexture(textureName);

      // Create material
      const material = new BABYLON.StandardMaterial(`${modelName}_mat`, this.scene);
      material.diffuseTexture = texture;
      material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      material.roughness = 0.6;
      material.backFaceCulling = false;

      // Apply to all meshes
      let meshCount = 0;
      rootNode.getChildren().forEach((child) => {
        if (child instanceof BABYLON.AbstractMesh) {
          child.material = material;
          meshCount++;
        }
      });

      console.log(`TextureMaterialManager: Applied texture '${textureName}' to ${meshCount} meshes`);

    } catch (error) {
      console.warn(`TextureMaterialManager: Failed to load texture '${textureName}', using default material`, error);
      this.applyDefaultMaterial(rootNode, modelName);
    }
  }

  /**
   * Load a texture with caching
   */
  async loadTexture(textureName) {
    // Check cache first
    if (this.textureCache.has(textureName)) {
      return this.textureCache.get(textureName);
    }

    // Try loading texture with different extensions
    const extensions = ['.webp', '.dds', '.png', '.jpg'];
    let lastError = null;

    for (const ext of extensions) {
      try {
        const texturePath = `./assets/textures/${textureName}${ext}`;
        const texture = new BABYLON.Texture(texturePath, this.scene);

        // Cache it
        this.textureCache.set(textureName, texture);
        return texture;
      } catch (e) {
        lastError = e;
        continue;
      }
    }

    throw lastError || new Error('Failed to load texture');
  }

  /**
   * Apply a default colored material when no texture is available
   */
  applyDefaultMaterial(rootNode, modelName) {
    const material = new BABYLON.StandardMaterial(`${modelName}_default`, this.scene);

    // Generate consistent color from model name
    const hash = this.hashCode(modelName);
    const hue = Math.abs(hash) % 360;
    const saturation = 0.5 + (Math.abs(hash >> 8) % 100) / 300;
    const value = 0.6 + (Math.abs(hash >> 16) % 100) / 250;

    // Set color
    const color = BABYLON.Color3.FromHSV(hue / 360, saturation, value);
    material.diffuseColor = color;
    material.emissiveColor = color.scale(0.15); // Slight glow for visibility
    material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    material.roughness = 0.6;
    material.backFaceCulling = false;

    // Apply to all meshes
    let meshCount = 0;
    rootNode.getChildren().forEach((child) => {
      if (child instanceof BABYLON.AbstractMesh) {
        child.material = material;
        meshCount++;
      }
    });

    console.log(`TextureMaterialManager: Applied default material (HSV: ${hue.toFixed(0)}, ${saturation.toFixed(2)}, ${value.toFixed(2)}) to ${meshCount} meshes`);
  }

  /**
   * Simple hash function for consistent color generation
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Clear the texture cache
   */
  clearCache() {
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    this.textureCache.clear();
  }
}

// Input state
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false,
  shift: false
};

// Stats
let lastStatsUpdate = 0;

/**
 * Initialize the game
 */
async function init() {
  console.log('=== SRObro Gameplay Demo ===');
  console.log('Initializing...');

  canvas = document.getElementById('renderCanvas');

  // Create engine
  engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true
  });

  // Create scene
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.5, 0.7, 0.9); // Sky blue

  // Enable collisions
  scene.collisionsEnabled = true;
  scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

  // Create texture material manager
  textureMaterialManager = new TextureMaterialManager(scene);
  textureMaterialManager.init().catch(err => {
    console.warn('Failed to initialize texture material manager:', err);
  });

  // Create environment
  createEnvironment();

  // Setup lighting
  createLighting();

  // Setup camera
  createCamera();

  // Setup controls
  setupInput();

  // Spawn default character
  await spawnCharacter('test_cube');

  // Hide loading screen after character is loaded
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.classList.add('hidden');
  }

  // Start render loop
  engine.runRenderLoop(() => {
    update();
    scene.render();
  });

  // Handle resize
  window.addEventListener('resize', () => {
    engine.resize();
  });

  console.log('✓ Game initialized');
  console.log('Use WASD to move, SPACE to jump');
  console.log('Right click + drag to rotate camera');
}

/**
 * Create environment (ground, objects)
 */
function createEnvironment() {
  // Ground
  ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 100, height: 100, subdivisions: 50 },
    scene
  );
  ground.checkCollisions = true;
  ground.receiveShadows = true;

  // Create grid material for better visibility
  const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.35, 0.5, 0.35);
  groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  groundMat.wireframe = false;

  // Add a grid texture effect using procedural approach
  const gridTexture = new BABYLON.DynamicTexture('gridTexture', 512, scene, true);
  const ctx = gridTexture.getContext();
  ctx.fillStyle = '#4a6b4a';
  ctx.fillRect(0, 0, 512, 512);

  // Draw grid lines
  ctx.strokeStyle = '#3a5a3a';
  ctx.lineWidth = 2;
  const gridSize = 64;

  for (let i = 0; i <= 512; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  gridTexture.update();
  groundMat.diffuseTexture = gridTexture;
  groundMat.diffuseTexture.uScale = 10;
  groundMat.diffuseTexture.vScale = 10;

  ground.material = groundMat;

  console.log('Environment created with visible ground grid');

  // Add some objects
  createTestObjects();
}

/**
 * Create test objects in the scene
 */
function createTestObjects() {
  // Box
  const box = BABYLON.MeshBuilder.CreateBox(
    'box1',
    { size: 2 },
    scene
  );
  box.position = new BABYLON.Vector3(5, 1, 5);
  box.checkCollisions = true;

  const boxMat = new BABYLON.StandardMaterial('boxMat', scene);
  boxMat.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.2);
  box.material = boxMat;

  // Cylinder
  const cylinder = BABYLON.MeshBuilder.CreateCylinder(
    'cylinder1',
    { diameter: 2, height: 3 },
    scene
  );
  cylinder.position = new BABYLON.Vector3(-5, 1.5, 5);
  cylinder.checkCollisions = true;

  const cylMat = new BABYLON.StandardMaterial('cylMat', scene);
  cylMat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
  cylinder.material = cylMat;

  // Platform
  const platform = BABYLON.MeshBuilder.CreateBox(
    'platform',
    { width: 10, height: 0.5, depth: 10 },
    scene
  );
  platform.position = new BABYLON.Vector3(0, 2, -10);
  platform.checkCollisions = true;

  const platMat = new BABYLON.StandardMaterial('platMat', scene);
  platMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
  platform.material = platMat;
}

/**
 * Create lighting
 */
function createLighting() {
  // Hemispheric light - increased intensity for better visibility
  const hemiLight = new BABYLON.HemisphericLight(
    'hemi',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  hemiLight.intensity = 1.2; // Increased from 0.7
  hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
  hemiLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.4);

  // Directional light (sun) - increased intensity
  const dirLight = new BABYLON.DirectionalLight(
    'dir',
    new BABYLON.Vector3(-1, -2, -1),
    scene
  );
  dirLight.position = new BABYLON.Vector3(20, 40, 20);
  dirLight.intensity = 1.0; // Increased from 0.8
  dirLight.diffuse = new BABYLON.Color3(1, 0.95, 0.9);

  // Shadow generator
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
  shadowGenerator.useBlurExponentialShadowMap = true;

  // Add point light near the character for better visibility
  const pointLight = new BABYLON.PointLight(
    'point',
    new BABYLON.Vector3(0, 3, 0),
    scene
  );
  pointLight.intensity = 0.5;
  pointLight.diffuse = new BABYLON.Color3(1, 1, 1);
  pointLight.range = 20;

  console.log('Lighting created with enhanced visibility');
}

/**
 * Create camera
 */
function createCamera() {
  // Create simple camera for now
  const camera = new BABYLON.UniversalCamera(
    'camera',
    new BABYLON.Vector3(0, 5, -10),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  scene.activeCamera = camera;

  // Store reference
  tpCamera = {
    camera: camera,
    yaw: 0,
    pitch: 0.3,
    distance: 8,
    height: 3,
    target: null
  };
}

/**
 * Setup keyboard input
 */
function setupInput() {
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
      keys[key] = true;
    }
    if (e.code === 'Space') {
      keys.space = true;
    }
    if (e.key === 'Shift') {
      keys.shift = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
      keys[key] = false;
    }
    if (e.code === 'Space') {
      keys.space = false;
    }
    if (e.key === 'Shift') {
      keys.shift = false;
    }
  });

  // Camera rotation with right mouse
  let isRightMouseDown = false;
  let lastMouseX = 0;

  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
      isRightMouseDown = true;
      lastMouseX = e.clientX;
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
      isRightMouseDown = false;
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isRightMouseDown) {
      const deltaX = e.clientX - lastMouseX;
      tpCamera.yaw += deltaX * 0.003;
      lastMouseX = e.clientX;

      // Update camera position
      updateCameraPosition();
    }
  });

  // Prevent context menu
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Mouse wheel zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    tpCamera.distance = Math.max(3, Math.min(20, tpCamera.distance + e.deltaY * 0.01));
    updateCameraPosition();
  });
}

/**
 * Update camera position
 */
function updateCameraPosition() {
  if (!characterMesh) return;

  const targetPos = characterMesh.position;

  const offsetX = Math.sin(tpCamera.yaw) * Math.cos(tpCamera.pitch) * tpCamera.distance;
  const offsetZ = Math.cos(tpCamera.yaw) * Math.cos(tpCamera.pitch) * tpCamera.distance;
  const offsetY = Math.sin(tpCamera.pitch) * tpCamera.distance + tpCamera.height;

  tpCamera.camera.position = new BABYLON.Vector3(
    targetPos.x - offsetX,
    targetPos.y + offsetY,
    targetPos.z - offsetZ
  );

  tpCamera.camera.setTarget(targetPos);
}

/**
 * Spawn character
 */
async function spawnCharacter(modelName) {
  console.log(`Loading character: ${modelName}`);

  // Remove previous character
  if (characterMesh) {
    characterMesh.dispose();
  }

  try {
    // Try loading from converted assets
    // Use SceneLoader.ImportMeshAsync with loadingOptions to disable cache
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      './assets/models/',
      `${modelName}.glb`,
      scene,
      null,
      '.glb'
    );

    if (result.meshes.length > 0) {
      // Create root node
      characterMesh = new BABYLON.TransformNode('character', scene);

      // Parent all meshes
      for (const mesh of result.meshes) {
        mesh.parent = characterMesh;
      }

      // Position
      characterMesh.position = new BABYLON.Vector3(0, 0, 0);

      // Apply textures using the material manager
      if (textureMaterialManager) {
        await textureMaterialManager.applyTexturesToModel(characterMesh, modelName);
      } else {
        console.warn('TextureMaterialManager not initialized, applying basic material');
        applyBasicMaterial(characterMesh, modelName);
      }

      // Scale to fit - increase scale for better visibility
      const boundingInfo = characterMesh.getHierarchyBoundingVectors();
      const size = boundingInfo.max.subtract(boundingInfo.min);
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 4.0 / maxDimension; // Increased from 2.0 to 4.0 for better visibility
      characterMesh.scaling = new BABYLON.Vector3(scale, scale, scale);

      // Enable collisions
      for (const mesh of result.meshes) {
        if (mesh instanceof BABYLON.Mesh) {
          mesh.checkCollisions = true;
        }
      }

      console.log(`✓ Character loaded: ${result.meshes.length} meshes, scale: ${scale.toFixed(3)}`);

      // Update camera target
      tpCamera.target = characterMesh;
      updateCameraPosition();

    } else {
      console.warn('No meshes loaded, creating placeholder');
      createPlaceholderCharacter();
    }

  } catch (error) {
    console.error(`Failed to load ${modelName}:`, error);
    console.log('Creating placeholder character');
    createPlaceholderCharacter();
  }
}

/**
 * Apply a basic visible material (fallback when TextureMaterialManager is not available)
 */
function applyBasicMaterial(rootNode, modelName) {
  const material = new BABYLON.StandardMaterial(`${modelName}_basic`, scene);
  material.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.3);
  material.emissiveColor = new BABYLON.Color3(0.1, 0.07, 0.05);
  material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  material.backFaceCulling = false;

  let meshCount = 0;
  rootNode.getChildren().forEach((child) => {
    if (child instanceof BABYLON.AbstractMesh) {
      child.material = material;
      meshCount++;
    }
  });

  console.log(`Applied basic material to ${meshCount} meshes`);
}

/**
 * Create placeholder character
 */
function createPlaceholderCharacter() {
  // Remove previous
  if (characterMesh) {
    characterMesh.dispose();
  }

  // Create simple character
  const body = BABYLON.MeshBuilder.CreateCapsule(
    'body',
    { radius: 0.5, height: 2 },
    scene
  );
  body.position.y = 1;

  characterMesh = body;
  characterMesh.checkCollisions = true;

  console.log('✓ Placeholder character created');

  // Update camera target
  tpCamera.target = characterMesh;
  updateCameraPosition();
}

/**
 * Spawn selected character from dropdown
 */
async function spawnSelectedCharacter() {
  const selector = document.getElementById('character-selector');
  const selected = selector.value;
  await spawnCharacter(selected);
}

/**
 * Update game loop
 */
function update() {
  const deltaTime = engine.getDeltaTime() / 1000;

  if (characterMesh) {
    // Calculate movement direction
    const moveDir = new BABYLON.Vector3(0, 0, 0);

    if (keys.w) moveDir.z += 1;
    if (keys.s) moveDir.z -= 1;
    if (keys.a) moveDir.x -= 1;
    if (keys.d) moveDir.x += 1;

    // Rotate movement by camera yaw
    if (moveDir.length() > 0) {
      moveDir.normalize();
      const cos = Math.cos(tpCamera.yaw);
      const sin = Math.sin(tpCamera.yaw);

      const rotatedDir = new BABYLON.Vector3(
        moveDir.x * cos - moveDir.z * sin,
        0,
        moveDir.x * sin + moveDir.z * cos
      );

      // Apply movement
      const speed = keys.shift ? 8 : 4;
      characterMesh.position.addInPlace(rotatedDir.scale(speed * deltaTime));

      // Rotate character to face movement
      const targetRotation = Math.atan2(rotatedDir.x, rotatedDir.z);
      characterMesh.rotation.y = targetRotation;
    }

    // Handle jump
    if (keys.space && characterMesh.position.y <= 0.1) {
      verticalVelocity = 6;
    }

    // Apply gravity
    if (!verticalVelocity) verticalVelocity = 0;
    verticalVelocity += scene.gravity.y * deltaTime;
    characterMesh.position.y += verticalVelocity * deltaTime;

    // Ground check
    if (characterMesh.position.y < 0) {
      characterMesh.position.y = 0;
      verticalVelocity = 0;
    }

    // Update camera
    updateCameraPosition();
  }

  // Update stats display
  updateStats();
}

let verticalVelocity = 0;

/**
 * Update stats display
 */
function updateStats() {
  const now = Date.now();
  if (now - lastStatsUpdate < 100) return; // Update 10 times per second

  lastStatsUpdate = now;

  if (characterMesh) {
    const pos = characterMesh.position;
    const rotation = (characterMesh.rotation.y * 180 / Math.PI).toFixed(0);
    const speed = keys.shift ? '8.00' : '4.00';
    const fps = engine.getFps().toFixed(0);

    const isMoving = keys.w || keys.a || keys.s || keys.d;

    document.getElementById('stats').innerHTML = `
      Position: ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}<br>
      Rotation: ${rotation}°<br>
      Speed: ${isMoving ? speed : '0.00'}<br>
      FPS: ${fps}
    `;
  }
}

// Make spawn function global
window.spawnSelectedCharacter = spawnSelectedCharacter;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('🎮 SRObro Gameplay Demo loaded');
console.log('Initializing game...');
