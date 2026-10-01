/**
 * SRObro MVP - Combat Test Script
 * Run in browser console (F12)
 */

console.log('⚔️ SRObro Combat Test Script');

// Find monsters by checking the scene
const testCombat = () => {
  console.log('\n[COMBAT TEST] Searching for monsters...');

  // Sample different areas of the screen to find red monsters
  const canvas = document.getElementById('renderCanvas');
  const gl = canvas?.getContext('webgl2');

  if (!gl) {
    console.error('❌ WebGL not available');
    return;
  }

  // Define test points in a grid pattern
  const testPoints = [
    {x: 200, y: 200, name: 'top-left'},
    {x: 479, y: 223, name: 'top-center'},
    {x: 758, y: 200, name: 'top-right'},
    {x: 200, y: 446, name: 'mid-left'},
    {x: 479, y: 446, name: 'center'},
    {x: 758, y: 446, name: 'mid-right'},
    {x: 200, y: 669, name: 'bottom-left'},
    {x: 479, y: 669, name: 'bottom-center'},
    {x: 758, y: 669, name: 'bottom-right'},
  ];

  console.log('Scanning for red monsters (high R value)...');

  let foundMonsters = 0;
  let foundPlayer = 0;
  let foundGround = 0;

  testPoints.forEach(point => {
    const pixel = new Uint8Array(4);
    gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    const [r, g, b] = pixel;

    // Red = monster (R > 150 and R > G * 1.5 and R > B * 1.5)
    if (r > 150 && r > g * 1.5 && r > b * 1.5) {
      console.log(`🔴 ${point.name}: Monster detected! RGB: [${r}, ${g}, ${b}]`);
      foundMonsters++;
    }
    // Blue = player (B > 150 and B > R * 1.2)
    else if (b > 150 && b > r * 1.2 && b > g) {
      console.log(`🔵 ${point.name}: Player detected! RGB: [${r}, ${g}, ${b}]`);
      foundPlayer++;
    }
    // Green = ground (G > 100 and G > R * 1.2 and G > B)
    else if (g > 100 && g > r * 1.2 && g > b) {
      console.log(`🟢 ${point.name}: Ground detected! RGB: [${r}, ${g}, ${b}]`);
      foundGround++;
    }
    // Sky blue
    else {
      console.log(`🔵 ${point.name}: Sky/background RGB: [${r}, ${g}, ${b}]`);
    }
  });

  console.log(`\n📊 Scan Results:`);
  console.log(`  🔴 Monsters: ${foundMonsters}`);
  console.log(`  🔵 Player: ${foundPlayer}`);
  console.log(`  🟢 Ground: ${foundGround}`);

  return { foundMonsters, foundPlayer, foundGround };
};

// Simulate an attack
const simulateAttack = () => {
  console.log('\n[ATTACK SIMULATION] Simulating monster attack...');

  const canvas = document.getElementById('renderCanvas');

  // Send mouse click event
  const clickEvent = new MouseEvent('mousedown', {
    button: 0, // Left click
    bubbles: true,
    cancelable: true,
    clientX: 479,
    clientY: 446
  });

  if (canvas) {
    canvas.dispatchEvent(clickEvent);
    console.log('✅ Click event sent to canvas');

    // Wait and check for damage numbers or combat logs
    setTimeout(() => {
      console.log('⏱️ Waiting for combat response...');
    }, 500);
  }
};

// Check progression system
const checkProgression = () => {
  console.log('\n[PROGRESSION CHECK] Testing progression systems...');

  // Simulate killing a monster (XP gain)
  console.log('Note: Progression should trigger on monster kill');
  console.log('Expected behavior:');
  console.log('  1. Monster dies → XP gained');
  console.log('  2. XP bar fills up');
  console.log('  3. At max XP → Level up');
  console.log('  4. Stat points awarded');
  console.log('  5. +STR/+INT buttons appear');
};

// Check UI
const checkUI = () => {
  console.log('\n[UI CHECK] Verifying UI elements...');

  const uiElements = {
    'Loading Screen': document.getElementById('loading-screen'),
    'Canvas': document.getElementById('renderCanvas'),
  };

  Object.entries(uiElements).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: Found`);
    } else {
      console.log(`❌ ${name}: Not found`);
    }
  });
};

// Run all tests
console.log('\n🚀 Running combat tests...\n');

setTimeout(() => {
  const results = testCombat();
  simulateAttack();
  checkProgression();
  checkUI();

  console.log('\n📋 COMBAT TEST CHECKLIST:');
  console.log('[ ] 1. Move close to red boxes (monsters)');
  console.log('[ ] 2. Click on monster to attack');
  console.log('[ ] 3. Verify damage number appears');
  console.log('[ ] 4. Kill monster (reduce HP to 0)');
  console.log('[ ] 5. Check XP gain in logs');
  console.log('[ ] 6. Wait for level up notification');
  console.log('[ ] 7. Allocate stat point (+STR/+INT)');
  console.log('[ ] 8. Verify stat increased');

  if (results.foundMonsters > 0) {
    console.log(`\n✅ Found ${results.foundMonsters} monster(s)!`);
    console.log('   You can attack them by clicking near them.');
  } else if (results.foundGround > 0) {
    console.log('\n⚠️  No monsters visible in center area.');
    console.log('   Try moving around (WASD) to find them.');
    console.log('   Monsters spawn around (1000, 0, 1000).');
  }
}, 500);
