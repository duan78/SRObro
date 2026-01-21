/**
 * Copy Blender Assets to Client Public Folder
 *
 * This script copies the Blender-converted GLB files
 * from assets/glb_blender/ to client/public/assets/glb_blender/
 *
 * Usage: npx tsx scripts/copy-blender-assets.ts
 *
 * Author: SRObro Team
 * Date: 21 January 2026
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../assets/glb_blender');
const DEST_DIR = path.resolve(__dirname, '../client/public/assets/glb_blender');
const LOG_FILE = path.resolve(__dirname, '../asset_copy_log.txt');

// Counters
let totalFiles = 0;
let copiedFiles = 0;
let skippedFiles = 0;
let errors = 0;

/**
 * Calculate MD5 hash of a file
 */
async function getFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = createHash('md5');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

/**
 * Copy a single file
 */
async function copyFile(sourcePath: string, destPath: string, relativePath: string): Promise<void> {
    try {
        // Create destination directory if needed
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Check if file exists and is identical
        if (fs.existsSync(destPath)) {
            const sourceHash = await getFileHash(sourcePath);
            const destHash = await getFileHash(destPath);

            if (sourceHash === destHash) {
                skippedFiles++;
                process.stdout.write('\x1b[33m⏭️\x1b[0m');
                return;
            }
        }

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles++;
        process.stdout.write('\x1b[32m✅\x1b[0m');
    } catch (error) {
        errors++;
        process.stdout.write('\x1b[31m❌\x1b[0m');
        const errorMsg = `ERROR: Failed to copy ${relativePath} - ${error}`;
        console.error(`\n${errorMsg}`);
        fs.appendFileSync(LOG_FILE, errorMsg + '\n');
    }
}

/**
 * Recursively find all GLB files
 */
function findGlbFiles(dir: string, basePath: string = dir): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...findGlbFiles(fullPath, basePath));
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.glb')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Main copy function
 */
async function copyAssets(): Promise<void> {
    const startTime = new Date();

    console.log('\x1b[36m========================================\x1b[0m');
    console.log('\x1b[36m SRObro - Asset Copy Script\x1b[0m');
    console.log('\x1b[36m========================================\x1b[0m');
    console.log('');

    // Initialize log
    fs.writeFileSync(LOG_FILE, '=== Asset Copy Log ===\n');
    fs.appendFileSync(LOG_FILE, `Started: ${startTime.toISOString()}\n\n`);

    // Check if source directory exists
    if (!fs.existsSync(SOURCE_DIR)) {
        console.log(`\x1b[31m❌ ERROR: Source directory not found: ${SOURCE_DIR}\x1b[0m`);
        console.log('   Make sure the Blender conversion has completed!');
        process.exit(1);
    }

    console.log(`\x1b[32m✅ Source directory found:\x1b[0m ${SOURCE_DIR}`);
    console.log('');

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(DEST_DIR)) {
        console.log(`\x1b[33m📁 Creating destination directory:\x1b[0m ${DEST_DIR}`);
        fs.mkdirSync(DEST_DIR, { recursive: true });
        fs.appendFileSync(LOG_FILE, `Created destination directory: ${DEST_DIR}\n`);
    }

    console.log(`\x1b[36m📁 Destination directory:\x1b[0m ${DEST_DIR}`);
    console.log('');

    // Find all GLB files
    console.log('\x1b[33m📊 Scanning source directory...\x1b[0m');
    const glbFiles = findGlbFiles(SOURCE_DIR);
    totalFiles = glbFiles.length;

    console.log(`   Found \x1b[32m${totalFiles}\x1b[0m GLB files`);
    fs.appendFileSync(LOG_FILE, `Total GLB files: ${totalFiles}\n\n`);

    if (totalFiles === 0) {
        console.log('\n\x1b[33m⚠️  No GLB files found to copy!\x1b[0m');
        process.exit(0);
    }

    // Copy files
    console.log('\n\x1b[36m🚀 Starting copy operation...\x1b[0m');
    console.log('');

    let processed = 0;
    const updateInterval = Math.max(1, Math.floor(totalFiles / 100));

    for (const sourceFile of glbFiles) {
        processed++;
        const relativePath = path.relative(SOURCE_DIR, sourceFile);
        const destFile = path.join(DEST_DIR, relativePath);

        await copyFile(sourceFile, destFile, relativePath);

        // Progress bar
        if (processed % updateInterval === 0 || processed === totalFiles) {
            const percent = Math.round((processed / totalFiles) * 100);
            const barLength = 40;
            const filled = Math.round((percent / 100) * barLength);
            const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

            process.stdout.write(`\r   [${bar}] ${processed}/${totalFiles} (${percent}%)`);
        }
    }

    // Summary
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const durationSeconds = (duration / 1000).toFixed(2);

    console.log('\n');
    console.log('\x1b[36m========================================\x1b[0m');
    console.log('\x1b[36m Copy Summary\x1b[0m');
    console.log('\x1b[36m========================================\x1b[0m');
    console.log('');
    console.log(`\x1b[32m✅ Copied:\x1b[0m     ${copiedFiles} files`);
    console.log(`\x1b[33m⏭️  Skipped:\x1b[0m    ${skippedFiles} files`);
    console.log(`\x1b[31m❌ Errors:\x1b[0m     ${errors} files`);
    console.log(`\x1b[36m📊 Total:\x1b[0m      ${totalFiles} files`);
    console.log('');
    console.log(`\x1b[36m⏱️  Duration:\x1b[0m   ${durationSeconds}s`);
    console.log('');

    // Log summary
    fs.appendFileSync(LOG_FILE, '\n=== Summary ===\n');
    fs.appendFileSync(LOG_FILE, `Copied: ${copiedFiles}\n`);
    fs.appendFileSync(LOG_FILE, `Skipped: ${skippedFiles}\n`);
    fs.appendFileSync(LOG_FILE, `Errors: ${errors}\n`);
    fs.appendFileSync(LOG_FILE, `Total: ${totalFiles}\n`);
    fs.appendFileSync(LOG_FILE, `Duration: ${durationSeconds}s\n`);
    fs.appendFileSync(LOG_FILE, `Completed: ${endTime.toISOString()}\n`);

    if (errors === 0) {
        console.log('\x1b[32m🎉 SUCCESS! All assets copied successfully!\x1b[0m');
        console.log('');
        console.log('\x1b[36mNext steps:\x1b[0m');
        console.log('1. Start the Vite dev server: cd client && npm run dev');
        console.log('2. Enable Blender assets in your game initialization:');
        console.log('   \x1b[33mAssetConfigManager.enableBlenderAssets();\x1b[0m');
        console.log('3. Test character loading in browser');
    } else {
        console.log(`\x1b[33m⚠️  Completed with ${errors} errors. Check log: ${LOG_FILE}\x1b[0m`);
    }

    console.log('');
}

// Run the script
copyAssets().catch((error) => {
    console.error('\x1b[31m❌ Fatal error:\x1b[0m', error);
    process.exit(1);
});
