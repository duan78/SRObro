#!/usr/bin/env node
/**
 * Quick Build Check Script
 * Vérifie que tous les fichiers TypeScript sont corrects
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== SRObro Build Check ===\n');

// Check TypeScript compilation
console.log('🔍 Checking TypeScript compilation...');
try {
  execSync('cd client && npm run build', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful!\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed!\n');
  process.exit(1);
}

// Check if critical files exist
console.log('🔍 Checking critical files...');

const criticalFiles = [
  'client/src/animation/BanFileLoader.ts',
  'client/src/animation/AnimationManager.ts',
  'client/src/animation/index.ts',
  'client/src/combat/DamageNumberManager.ts',
  'client/src/combat/index.ts',
  'client/src/effects/SkillEffectManager.ts',
  'client/src/effects/index.ts',
  'client/src/gameplay/TextureMaterialManager.ts',
  'client/src/gameplay/CharacterFactory.ts',
  'client/src/gameplay/MovementSync.ts',
  'client/src/gameplay/SkillController.ts',
  'client/src/test/TestInterface.ts',
  'client/src/test/index.ts',
  'client/character-test.html',
  'client/TESTING_GUIDE.md'
];

let allFilesExist = true;
for (const file of criticalFiles) {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
}

console.log('');

// Check asset files
console.log('🔍 Checking assets...');
const assetsDir = path.join(__dirname, '..', 'client', 'assets');
const requiredAssets = [
  'manifest.json',
  'mappings.json',
  'texture_mapping.json'
];

for (const asset of requiredAssets) {
  const assetPath = path.join(assetsDir, asset);
  if (fs.existsSync(assetPath)) {
    const size = (fs.statSync(assetPath).size / 1024).toFixed(1);
    console.log(`  ✅ ${asset} (${size} KB)`);
  } else {
    console.log(`  ⚠️  ${asset} - Not found (will be created during asset conversion)`);
  }
}

console.log('\n=== Summary ===');
if (allFilesExist) {
  console.log('✅ All critical files present!');
  console.log('\n📖 Testing Guide: See TESTING_GUIDE.md');
  console.log('🌐 Test Page: Open http://localhost:5173/character-test.html in your browser');
} else {
  console.log('❌ Some files are missing. Please check the output above.');
  process.exit(1);
}
