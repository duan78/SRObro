#!/usr/bin/env node
/**
 * Add ALL animations from animations directory to manifest.json
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'client', 'assets', 'manifest.json');
const animationsDir = path.join(__dirname, '..', 'client', 'assets', 'animations');

console.log('=== Adding ALL Animations to Manifest ===\n');

// Read manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Initialize animations object if it doesn't exist
if (!manifest.animations) {
  manifest.animations = {};
}

// Get all JSON files in animations directory
const allFiles = fs.readdirSync(animationsDir).filter(file => file.endsWith('.json'));

console.log(`Found ${allFiles.length} animation files in ${animationsDir}\n`);

// Add animations to manifest
let added = 0;
let skipped = 0;
let failed = 0;

for (const file of allFiles) {
  const animPath = path.join(animationsDir, file);

  try {
    const animData = JSON.parse(fs.readFileSync(animPath, 'utf8'));

    // Generate key from filename (remove extension)
    const key = file.replace('.json', '');

    // Check if already in manifest
    if (manifest.animations[key]) {
      skipped++;
      continue;
    }

    manifest.animations[key] = {
      file: `animations\\${file}`,
      duration: animData.duration || 1.0,
      frames: animData.totalFrames || 30
    };

    added++;
    if (added <= 20 || added % 500 === 0) {
      console.log(`✅ [${added}] ${key} (${animData.duration || 1.0}s, ${animData.totalFrames || 30} frames)`);
    }
  } catch (error) {
    failed++;
    if (failed <= 10) {
      console.log(`❌ Failed to load ${file}:`, error.message);
    }
  }
}

// Write updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n✅ ${added} new animations added`);
console.log(`⏭️  ${skipped} already in manifest (skipped)`);
console.log(`❌ ${failed} failed to load`);
console.log(`📊 Total animations in manifest: ${Object.keys(manifest.animations).length}`);
console.log(`📁 Manifest location: ${manifestPath}`);
