/**
 * SRObro Character & Gameplay Test
 *
 * Page de test complète pour les systèmes Phase 3 & 4A
 * Utilise character-test.html pour accéder à cette interface
 */

// @ts-nocheck
import {
  Engine,
  Scene,
  Vector3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  DynamicTexture
} from '@babylonjs/core';

import { AssetLoader } from '../core/AssetLoader';
import { AnimationManager, AnimationState } from '../animation';
import { DamageNumberManager, DamageType } from '../combat';
import { SkillEffectManager } from '../effects';

// Global state for testing
let engine: Engine;
let scene: Scene;
let assetLoader: AssetLoader;
let animationManager: AnimationManager;
let damageManager: DamageNumberManager;
let skillEffectManager: SkillEffectManager;
let currentCharacterMesh: any = null;
let ground: any = null;

// Console logging override
const originalConsoleLog = console.log;
const consoleLogs: string[] = [];

function addToConsole(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}`;
  consoleLogs.push(logEntry);

  // Update UI
  const consoleDiv = document.getElementById('console-logs');
  if (consoleDiv) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    p.className = `log-${type}`;
    consoleDiv.appendChild(p);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }
}

/**
 * Initialize the test scene
 */
async function init(): Promise<void> {
  addToConsole('=== SRObro Test Suite Initializing ===', 'info');

  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Canvas not found');
  }

  // Create engine
  engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true
  });

  // Create scene
  scene = new Scene(engine);
  scene.clearColor = new Color4(0.53, 0.8, 0.92, 1.0);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.9, 0);

  // Create environment
  createEnvironment();
  createLighting();

  // Initialize systems
  addToConsole('Initializing AssetLoader...', 'info');
  assetLoader = new AssetLoader(scene);
  await assetLoader.initialize();

  addToConsole('Initializing AnimationManager...', 'info');
  animationManager = new AnimationManager(scene);

  addToConsole('Initializing DamageNumberManager...', 'info');
  damageManager = new DamageNumberManager(scene);

  addToConsole('Initializing SkillEffectManager...', 'info');
  skillEffectManager = new SkillEffectManager(scene);

  // Spawn default test cube
  await spawnTestCube();

  // Setup input
  setupInput();

  // Start render loop
  engine.runRenderLoop(() => {
    update();
    scene.render();
  });

  // Handle resize
  window.addEventListener('resize', () => {
    engine.resize();
  });

  // Expose to window for testing
  (window as any).SROBroTest = {
    spawnCharacter: spawnTestCharacter,
    spawnTestCube,
    equipItem: equipItemFromUI,
    playAnimation: playAnimationFromUI,
    showDamage: showDamageFromUI,
    showSkillEffect: showSkillEffectFromUI,
    listCharacters: listAvailableCharacters,
    clearAll,
    scene,
    assetLoader
  };

  // Hide loading screen
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
    }
    addToConsole('✓ Test suite ready!', 'success');
  }, 500);

  addToConsole('=== Test Suite Initialized ===', 'success');
}

/**
 * Create environment
 */
function createEnvironment(): void {
  // Ground with grid
  ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 50 }, scene);
  ground.checkCollisions = true;

  const groundMat = new StandardMaterial('groundMat', scene);
  groundMat.diffuseColor = new Color3(0.35, 0.5, 0.35);
  groundMat.specularColor = new Color3(0.1, 0.1, 0.1);

  // Grid texture
  const gridTexture = new DynamicTexture('grid', 512, scene, true);
  const ctx = gridTexture.getContext();
  ctx.fillStyle = '#4a6b4a';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#3a5a3a';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
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

  // Add some test objects
  const box = MeshBuilder.CreateBox('box1', { size: 2 }, scene);
  box.position = new Vector3(5, 1, 5);
  box.checkCollisions = true;
  const boxMat = new StandardMaterial('boxMat', scene);
  boxMat.diffuseColor = new Color3(0.8, 0.4, 0.2);
  box.material = boxMat;
}

/**
 * Create lighting
 */
function createLighting(): void {
  const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
  hemiLight.intensity = 1.2;
  hemiLight.diffuse = new Color3(1, 1, 1);
  hemiLight.groundColor = new Color3(0.3, 0.3, 0.4);

  const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
  dirLight.position = new Vector3(20, 40, 20);
  dirLight.intensity = 1.0;
  dirLight.diffuse = new Color3(1, 0.95, 0.9);
}

/**
 * Setup keyboard input
 */
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };

function setupInput(): void {
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = true;
    if (e.code === 'Space') keys.space = true;
    if (e.key === 'Shift') keys.shift = true;
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = false;
    if (e.code === 'Space') keys.space = false;
    if (e.key === 'Shift') keys.shift = false;
  });
}

/**
 * Update loop
 */
let verticalVelocity = 0;

function update(): void {
  const deltaTime = engine.getDeltaTime() / 1000;

  if (currentCharacterMesh) {
    // Movement
    const moveDir = new Vector3(0, 0, 0);
    if (keys.w) moveDir.z += 1;
    if (keys.s) moveDir.z -= 1;
    if (keys.a) moveDir.x -= 1;
    if (keys.d) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      const speed = keys.shift ? 8 : 4;
      currentCharacterMesh.position.addInPlace(moveDir.scale(speed * deltaTime));
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      currentCharacterMesh.rotation.y = targetRotation;
    }

    // Jump & Gravity
    if (keys.space && currentCharacterMesh.position.y <= 0.1) {
      verticalVelocity = 6;
    }

    verticalVelocity += scene.gravity.y * deltaTime;
    currentCharacterMesh.position.y += verticalVelocity * deltaTime;

    if (currentCharacterMesh.position.y < 0) {
      currentCharacterMesh.position.y = 0;
      verticalVelocity = 0;
    }
  }

  // Update stats
  updateStats();
}

/**
 * Update stats display
 */
let lastStatsUpdate = 0;

function updateStats(): void {
  const now = Date.now();
  if (now - lastStatsUpdate < 100) return;

  lastStatsUpdate = now;

  const statsDiv = document.getElementById('stats-content');
  if (statsDiv && currentCharacterMesh) {
    const pos = currentCharacterMesh.position;
    const rotation = (currentCharacterMesh.rotation.y * 180 / Math.PI).toFixed(0);
    const fps = engine.getFps().toFixed(0);
    const isMoving = keys.w || keys.a || keys.s || keys.d;
    const speed = isMoving ? (keys.shift ? '8.00' : '4.00') : '0.00';

    statsDiv.innerHTML = `
      Position: ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}<br>
      Rotation: ${rotation}°<br>
      Speed: ${speed}<br>
      FPS: ${fps}<br>
      Entities: ${scene.meshes.length}
    `;
  }
}

/**
 * Test functions
 */
async function spawnTestCube(): Promise<void> {
  addToConsole('Spawning test cube...', 'info');

  if (currentCharacterMesh) {
    currentCharacterMesh.dispose();
  }

  try {
    const result = await import('@babylonjs/core').then(async ({ MeshBuilder, StandardMaterial, Color3 }) => {
      const cube = MeshBuilder.CreateBox('test_cube', { size: 2 }, scene);
      cube.position.y = 1;
      cube.checkCollisions = true;

      const material = new StandardMaterial('test_mat', scene);
      material.diffuseColor = new Color3(0.2, 0.6, 1);
      material.emissiveColor = new Color3(0.1, 0.2, 0.3);
      material.specularColor = new Color3(0.2, 0.2, 0.2);
      cube.material = material;

      return cube;
    });

    currentCharacterMesh = result;
    addToConsole('✓ Test cube spawned successfully', 'success');
  } catch (error) {
    addToConsole('Failed to spawn test cube: ' + error, 'error');
  }
}

async function spawnTestCharacter(): Promise<void> {
  addToConsole('Spawning test character...', 'info');

  // For now, spawn a capsule as placeholder character
  if (currentCharacterMesh) {
    currentCharacterMesh.dispose();
  }

  try {
    const capsule = MeshBuilder.CreateCapsule('player', { radius: 0.5, height: 2 }, scene);
    capsule.position.y = 1;
    capsule.checkCollisions = true;

    const material = new StandardMaterial('player_mat', scene);
    material.diffuseColor = new Color3(0.8, 0.6, 0.4);
    material.emissiveColor = new Color3(0.1, 0.07, 0.05);
    capsule.material = material;

    currentCharacterMesh = capsule;
    addToConsole('✓ Test character (capsule) spawned', 'success');
    addToConsole('Note: Full character loading requires converted assets', 'warning');
  } catch (error) {
    addToConsole('Failed to spawn character: ' + error, 'error');
  }
}

async function equipItemFromUI(slot: string, itemCode: string): Promise<void> {
  addToConsole(`Equipping ${itemCode} to ${slot}...`, 'info');
  addToConsole('Equipment system requires Character & mappings.json', 'warning');
}

function playAnimationFromUI(stateStr: string): void {
  addToConsole(`Playing animation: ${stateStr}`, 'info');
  // Animation system needs skeleton + .ban files
  addToConsole('Animation system requires converted .ban files', 'warning');
}

function showDamageFromUI(): void {
  const amount = parseInt((document.getElementById('damage-amount') as HTMLInputElement).value);
  const type = (document.getElementById('damage-type') as HTMLSelectElement).value as DamageType;

  const position = new Vector3(0, 2, 0);
  if (currentCharacterMesh) {
    position.copyFrom(currentCharacterMesh.position);
    position.y += 2;
  }

  damageManager.showDamage(amount, position, type);
  addToConsole(`✓ Show damage: ${amount} (${type})`, 'success');
}

function showMiss(): void {
  const position = new Vector3(0, 2, 0);
  if (currentCharacterMesh) {
    position.copyFrom(currentCharacterMesh.position);
    position.y += 2;
  }

  damageManager.showMiss(position);
  addToConsole('✓ Show MISS', 'success');
}

function showSkillEffectFromUI(effectId: string): void {
  const position = new Vector3(0, 1, 0);
  if (currentCharacterMesh) {
    position.copyFrom(currentCharacterMesh.position);
  }

  skillEffectManager.playEffect(effectId, position);
  addToConsole(`✓ Show skill effect: ${effectId}`, 'success');
}

function listAvailableCharacters(): void {
  addToConsole('=== Available Characters ===', 'info');
  addToConsole('Test Models:', 'info');
  addToConsole('  - test_cube (simple box)', 'info');
  addToConsole('  - capsule (placeholder character)', 'info');
  addToConsole('', 'info');
  addToConsole('Official characters require mappings.json:', 'info');
  addToConsole('  - ITEM_CH_SWORD_01_A through ITEM_CH_SWORD_10_C', 'info');
  addToConsole('  - ITEM_CH_M_CLOTHES_* (armor)', 'info');
  addToConsole('', 'info');
  addToConsole('Use window.SROBroTest for direct access', 'info');
}

function clearAll(): void {
  if (currentCharacterMesh) {
    currentCharacterMesh.dispose();
    currentCharacterMesh = null;
  }
  damageManager.clear();
  addToConsole('✓ All entities cleared', 'success');
}

// UI Wrapper functions
(window as any).spawnTestCharacter = spawnTestCharacter;
(window as any).spawnTestCube = spawnTestCube;
(window as any).equipItem = () => {
  const slot = (document.getElementById('equip-slot') as HTMLSelectElement).value;
  const code = (document.getElementById('equip-code') as HTMLInputElement).value;
  equipItemFromUI(slot, code);
};
(window as any).playAnimation = (state: string) => playAnimationFromUI(state);
(window as any).showDamage = showDamageFromUI;
(window as any).showMiss = showMiss;
(window as any).showSkillEffect = (id: string) => showSkillEffectFromUI(id);
(window as any).clearAll = clearAll;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('🎮 SRObro Character Test Suite loaded');
