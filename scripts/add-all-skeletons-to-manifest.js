#!/usr/bin/env node
/**
 * Add ALL skeletons from skeletons directory to manifest.json
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'client', 'assets', 'manifest.json');
const skeletonsDir = path.join(__dirname, '..', 'client', 'assets', 'skeletons');

console.log('=== Adding ALL Skeletons to Manifest ===\n');

// Read manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Initialize skeletons object if it doesn't exist
if (!manifest.skeletons) {
  manifest.skeletons = {};
}

// Recursively find all skeleton files
function findFiles(dir, extension, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, extension, results);
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }

  return results;
}

// Get all JSON files
const allFiles = findFiles(skeletonsDir, '.json');

console.log(`Found ${allFiles.length} skeleton files\n`);

// Add skeletons to manifest
let added = 0;
let skipped = 0;

for (const filePath of allFiles) {
  try {
    // Get relative path from skeletons directory
    const relativePath = path.relative(skeletonsDir, filePath);
    const key = relativePath.replace(/\.json$/, '').replace(/\\/g, '/');

    // Check if already in manifest
    if (manifest.skeletons[key]) {
      skipped++;
      continue;
    }

    // Try to read skeleton data
    let boneCount = 0;
    try {
      const skeletonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      boneCount = skeletonData.bones ? skeletonData.bones.length : 0;
    } catch (e) {
      // If we can't parse it, just add the file
    }

    manifest.skeletons[key] = {
      file: `skeletons\\${relativePath.replace(/\//g, '\\')}`,
      bones: boneCount
    };

    added++;
    if (added <= 20 || added % 200 === 0) {
      console.log(`✅ [${added}] ${key} (${boneCount} bones)`);
    }
  } catch (error) {
    console.log(`❌ Failed to process ${filePath}:`, error.message);
  }
}

// Write updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n✅ ${added} new skeletons added`);
console.log(`⏭️  ${skipped} already in manifest (skipped)`);
console.log(`📊 Total skeletons in manifest: ${Object.keys(manifest.skeletons).length}`);
console.log(`📁 Manifest location: ${manifestPath}`);
