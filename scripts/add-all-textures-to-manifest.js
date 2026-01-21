#!/usr/bin/env node
/**
 * Add ALL textures from textures directory to manifest.json
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'client', 'assets', 'manifest.json');
const texturesDir = path.join(__dirname, '..', 'client', 'assets', 'textures');

console.log('=== Adding ALL Textures to Manifest ===\n');

// Read manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Initialize textures object if it doesn't exist
if (!manifest.textures) {
  manifest.textures = {};
}

// Recursively find all texture files
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

// Get all WebP files
const allFiles = findFiles(texturesDir, '.webp');

console.log(`Found ${allFiles.length} texture files\n`);

// Add textures to manifest
let added = 0;
let skipped = 0;

for (const filePath of allFiles) {
  try {
    // Get relative path from textures directory
    const relativePath = path.relative(texturesDir, filePath);
    const key = relativePath.replace(/\.webp$/, '').replace(/\\/g, '/');

    // Check if already in manifest
    if (manifest.textures[key]) {
      skipped++;
      continue;
    }

    manifest.textures[key] = {
      file: `textures\\${relativePath.replace(/\//g, '\\')}`
    };

    added++;
    if (added <= 20 || added % 5000 === 0) {
      console.log(`✅ [${added}] ${key}`);
    }
  } catch (error) {
    console.log(`❌ Failed to process ${filePath}:`, error.message);
  }
}

// Write updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\n✅ ${added} new textures added`);
console.log(`⏭️  ${skipped} already in manifest (skipped)`);
console.log(`📊 Total textures in manifest: ${Object.keys(manifest.textures).length}`);
console.log(`📁 Manifest location: ${manifestPath}`);
