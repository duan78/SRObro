#!/usr/bin/env node
/**
 * Add animations to manifest.json
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'client', 'assets', 'manifest.json');
const animationsDir = path.join(__dirname, '..', 'client', 'assets', 'animations');

console.log('=== Adding Animations to Manifest ===\n');

// Read manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Animation files to add
const animationFiles = [
  'ch_man_idle.json',
  'ch_man_walk.json',
  'ch_man_run.json',
  'ch_man_jump.json',
  'ch_man_attack.json',
  'ch_man_hit.json',
  'ch_man_die.json',
  'ch_woman_idle.json',
  'ch_woman_walk.json',
  'ch_woman_run.json',
  'ch_woman_jump.json',
  'ch_woman_attack.json',
  'ch_woman_hit.json',
  'ch_woman_die.json',
  'eu_man_idle.json',
  'eu_man_walk.json',
  'eu_man_run.json',
  'eu_man_jump.json',
  'eu_man_attack.json',
  'eu_man_hit.json',
  'eu_man_die.json',
  'eu_woman_idle.json',
  'eu_woman_walk.json',
  'eu_woman_run.json',
  'eu_woman_jump.json',
  'eu_woman_attack.json',
  'eu_woman_hit.json',
  'eu_woman_die.json'
];

// Add animations to manifest
let count = 0;
for (const file of animationFiles) {
  const animPath = path.join(animationsDir, file);

  if (!fs.existsSync(animPath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }

  try {
    const animData = JSON.parse(fs.readFileSync(animPath, 'utf8'));

    // Generate key from filename (remove extension)
    const key = file.replace('.json', '');

    manifest.animations[key] = {
      file: `animations\\${file}`,
      duration: animData.duration,
      frames: animData.totalFrames
    };

    count++;
    console.log(`✅ Added: ${key} (${animData.duration}s, ${animData.totalFrames} frames)`);
  } catch (error) {
    console.log(`❌ Failed to load ${file}:`, error.message);
  }
}

// Write updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n✅ ${count} animations added to manifest.json`);
console.log(`📁 Manifest location: ${manifestPath}`);
