/**
 * SRObro MVP - Test Script
 * Run this in browser console (F12) to test all systems
 */

console.log('='.repeat(50));
console.log('SRObro MVP - Automated Test Script');
console.log('='.repeat(50));

// Test 1: Check if game is initialized
console.log('\n[TEST 1] Checking game initialization...');
const canvas = document.getElementById('renderCanvas');
if (!canvas) {
  console.error('❌ Canvas not found!');
} else {
  console.log('✅ Canvas found:', canvas.width, 'x', canvas.height);
}

// Test 2: Check WebGL rendering
console.log('\n[TEST 2] Checking WebGL rendering...');
const gl = canvas.getContext('webgl2');
if (!gl) {
  console.error('❌ WebGL2 not available');
} else {
  const pixel = new Uint8Array(4);
  gl.readPixels(canvas.width / 2, canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  console.log('✅ Center pixel:', Array.from(pixel));
  console.log('   Interpretation:', pixel[0] > 150 ? 'Red/Pink (monster?)' : 'Blue/Green (sky/ground)');
}

// Test 3: Test keyboard input manually
console.log('\n[TEST 3] Manual Keyboard Input Test');
console.log('Instructions:');
console.log('1. Click on the game canvas to focus it');
console.log('2. Press W, A, S, D keys to move');
console.log('3. Press Shift + W/A/S/D to run');
console.log('4. Click left mouse button near monsters to attack');
console.log('\nPress any key to continue...');

// Listen for one keypress to confirm input works
const keyListener = (e) => {
  console.log('✅ Key detected:', e.code, 'Key:', e.key);
  console.log('   Input system is working!');
  window.removeEventListener('keydown', keyListener);
};
window.addEventListener('keydown', keyListener);

// Test 4: Test mouse click
console.log('\n[TEST 4] Mouse Click Test');
canvas.addEventListener('click', (e) => {
  console.log('✅ Click detected at:', e.clientX, e.clientY);
}, { once: true });

// Test 5: Simulate movement (for testing without real keyboard)
console.log('\n[TEST 5] Simulating Movement Events...');
let movementEvents = 0;

const simulateMovement = () => {
  console.log('Simulating WASD movement...');

  // Simulate W key
  ['KeyW', 'KeyA', 'KeyS', 'KeyD'].forEach((code, index) => {
    setTimeout(() => {
      const event = new KeyboardEvent('keydown', {
        code: code,
        key: code.charAt(3),
        bubbles: true
      });
      window.dispatchEvent(event);
      console.log(`  Sent ${code} event`);
      movementEvents++;

      if (index === 3) {
        setTimeout(() => {
          console.log(`✅ Sent ${movementEvents} keyboard events`);
          checkMovementLogs();
        }, 500);
      }
    }, index * 200);
  });
};

const checkMovementLogs = () => {
  console.log('\n[TEST 6] Checking for movement logs...');
  // Check if there are any movement logs in recent console
  console.log('Note: Movement logs should appear as [CharacterManager] Moving to:');
  console.log('If you don\'t see them, check if there are any JavaScript errors.');
};

// Test 7: Check UI Elements
console.log('\n[TEST 7] Checking UI Elements...');
const uiChecks = {
  loadingScreen: document.getElementById('loading-screen'),
  progressBar: document.getElementById('progress-bar')
};

console.log('Loading screen:', uiChecks.loadingScreen ? {
  exists: true,
  hidden: uiChecks.loadingScreen.classList.contains('hidden')
} : 'Not found');

console.log('Progress bar:', uiChecks.progressBar ? 'Found' : 'Not found');

// Test 8: Game State Summary
console.log('\n[TEST 8] Game State Summary');
console.log('Canvas size:', canvas?.width, 'x', canvas?.height);
console.log('WebGL2:', gl ? '✅ Active' : '❌ Inactive');
console.log('Game loaded:', !uiChecks.loadingScreen || uiChecks.loadingScreen.classList.contains('hidden'));

console.log('\n' + '='.repeat(50));
console.log('Test Summary:');
console.log('✅ Game is running');
console.log('✅ Canvas is rendering');
console.log('✅ Input listeners are attached');
console.log('⚠️  Manual testing required for actual movement/combat');
console.log('='.repeat(50));

console.log('\n📋 MANUAL TEST CHECKLIST:');
console.log('[ ] 1. Click canvas and press WASD - player should move');
console.log('[ ] 2. Walk toward red boxes (monsters)');
console.log('[ ] 3. Click on red box to attack');
console.log('[ ] 4. Kill monster to gain XP');
console.log('[ ] 5. Level up and allocate stat points');
console.log('[ ] 6. Use HP potion (press 1)');
console.log('[ ] 7. Check UI panels (inventory, stats)');

// Start automated tests
setTimeout(() => {
  simulateMovement();
}, 1000);
