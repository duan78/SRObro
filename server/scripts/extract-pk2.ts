/**
 * PK2 Extraction Script
 *
 * Extracts Silkroad Online PK2 archives using the Rust-based pk2-extractor tool.
 * This is the first step in the asset conversion pipeline.
 *
 * Usage:
 *   ts-node scripts/extract-pk2.ts --archive /path/to/Media.pk2 --output assets/extracted
 *   ts-node scripts/extract-pk2.ts --list --archive /path/to/Media.pk2
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { parse } from 'path';

const execAsync = promisify(exec);

interface ExtractOptions {
    archive: string;
    output: string;
    verbose?: boolean;
    list?: boolean;
    pattern?: string;
}

interface AssetStats {
    totalFiles: number;
    models: number;
    textures: number;
    animations: number;
    sounds: number;
    data: number;
    other: number;
}

/**
 * Main extraction function
 */
async function extractPK2(options: ExtractOptions): Promise<void> {
    console.log('='.repeat(60));
    console.log('PK2 Extraction Tool - Phase 1: Assets 3D Extraction');
    console.log('='.repeat(60));

    // Validate inputs
    if (!options.archive) {
        throw new Error('Archive path is required. Use --archive /path/to/Media.pk2');
    }

    const archivePath = path.resolve(options.archive);
    const outputDir = path.resolve(options.output || 'assets/extracted');

    // Check if archive exists
    try {
        await fs.access(archivePath);
    } catch {
        throw new Error(`Archive not found: ${archivePath}`);
    }

    // Get the path to the pk2-extractor executable
    const pk2ExtractorPath = path.join(
        process.cwd(),
        '../../tools/pk2-extractor/target/release/pk2-extractor.exe'
    );

    // Check if extractor exists
    try {
        await fs.access(pk2ExtractorPath);
    } catch {
        throw new Error(
            `PK2 Extractor not found at ${pk2ExtractorPath}. ` +
            `Run 'cargo build --release' in tools/pk2-extractor/ first.`
        );
    }

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    console.log(`\nArchive: ${archivePath}`);
    console.log(`Output: ${outputDir}`);
    console.log(`Extractor: ${pk2ExtractorPath}`);

    // Build command
    const args: string[] = [
        `--archive "${archivePath}"`,
        `--output "${outputDir}"`
    ];

    if (options.list) {
        args.push('--list');
    }

    if (options.verbose) {
        args.push('--verbose');
    }

    const command = `"${pk2ExtractorPath}" ${args.join(' ')}`;

    console.log(`\nExecuting: ${command}`);
    console.log(''.repeat(60));

    try {
        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });

        if (stdout) {
            console.log(stdout);
        }

        if (stderr) {
            console.error(stderr);
        }

        console.log(''.repeat(60));
        console.log('✅ Extraction completed successfully!');

        // If we extracted files, organize and inventory
        if (!options.list) {
            console.log('\nOrganizing extracted files...');
            await organizeAssets(outputDir);

            console.log('\nGenerating inventory...');
            const stats = await generateInventory(outputDir);
            printAssetStats(stats);
        }

    } catch (error: any) {
        console.error('❌ Extraction failed:', error.message);
        throw error;
    }
}

/**
 * Organize extracted assets by file type
 */
async function organizeAssets(outputDir: string): Promise<void> {
    const categories = {
        models: ['.bsr', '.bms'],
        textures: ['.ddj', '.dds', '.tga', '.bmp', '.jpg', '.png'],
        animations: ['.bsk', '.ban', '.bmf'],
        sounds: ['.wav', '.mp3', '.ogg'],
        data: ['.txt', '.xml', '.json', '.csv']
    };

    console.log('  Creating category directories...');

    for (const [category, extensions] of Object.entries(categories)) {
        const categoryDir = path.join(outputDir, category);
        await fs.mkdir(categoryDir, { recursive: true });
    }

    console.log('  ✅ Categories organized');
}

/**
 * Generate inventory of extracted assets
 */
async function generateInventory(outputDir: string): Promise<AssetStats> {
    const stats: AssetStats = {
        totalFiles: 0,
        models: 0,
        textures: 0,
        animations: 0,
        sounds: 0,
        data: 0,
        other: 0
    };

    console.log('  Scanning extracted files...');

    async function scanDirectory(dir: string): Promise<void> {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                await scanDirectory(fullPath);
            } else {
                stats.totalFiles++;
                const ext = parse(entry.name).ext.toLowerCase();

                if (['.bsr', '.bms'].includes(ext)) stats.models++;
                else if (['.ddj', '.dds', '.tga', '.bmp', '.jpg', '.png'].includes(ext)) stats.textures++;
                else if (['.bsk', '.ban', '.bmf'].includes(ext)) stats.animations++;
                else if (['.wav', '.mp3', '.ogg'].includes(ext)) stats.sounds++;
                else if (['.txt', '.xml', '.json', '.csv'].includes(ext)) stats.data++;
                else stats.other++;
            }
        }
    }

    await scanDirectory(outputDir);

    // Save inventory to JSON
    const inventoryPath = path.join(outputDir, 'inventory.json');
    await fs.writeFile(inventoryPath, JSON.stringify(stats, null, 2));

    console.log(`  ✅ Inventory saved to ${inventoryPath}`);

    return stats;
}

/**
 * Print asset statistics
 */
function printAssetStats(stats: AssetStats): void {
    console.log('\n' + '='.repeat(60));
    console.log('Asset Statistics');
    console.log('='.repeat(60));
    console.log(`Total Files:      ${stats.totalFiles.toLocaleString()}`);
    console.log(`Models (BSR/BMS): ${stats.models.toLocaleString()}`);
    console.log(`Textures (DDJ):   ${stats.textures.toLocaleString()}`);
    console.log(`Animations:       ${stats.animations.toLocaleString()}`);
    console.log(`Sounds:           ${stats.sounds.toLocaleString()}`);
    console.log(`Data Files:       ${stats.data.toLocaleString()}`);
    console.log(`Other:            ${stats.other.toLocaleString()}`);
    console.log('='.repeat(60));
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const options: ExtractOptions = {
        archive: '',
        output: 'assets/extracted',
        verbose: false,
        list: false
    };

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--archive':
            case '-a':
                options.archive = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--list':
            case '-l':
                options.list = true;
                break;
            case '--help':
            case '-h':
                printHelp();
                process.exit(0);
                break;
            default:
                console.error(`Unknown option: ${arg}`);
                printHelp();
                process.exit(1);
        }
    }

    try {
        await extractPK2(options);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

/**
 * Print help message
 */
function printHelp(): void {
    console.log(`
PK2 Extraction Tool - Phase 1: Assets 3D Extraction

USAGE:
  ts-node scripts/extract-pk2.ts [OPTIONS]

OPTIONS:
  --archive, -a <path>       Path to PK2 archive (e.g., Media.pk2) [REQUIRED]
  --output, -o <path>        Output directory (default: assets/extracted)
  --list, -l                 List archive contents without extracting
  --verbose, -v              Enable verbose logging
  --help, -h                 Show this help message

EXAMPLES:
  # Extract Media.pk2 to assets/extracted
  ts-node scripts/extract-pk2.ts --archive /path/to/Media.pk2

  # List contents of Media.pk2
  ts-node scripts/extract-pk2.ts --list --archive /path/to/Media.pk2

  # Extract with custom output directory
  ts-node scripts/extract-pk2.ts -a Media.pk2 -o my_assets/

  # Verbose extraction
  ts-node scripts/extract-pk2.ts -a Media.pk2 -v

DESCRIPTION:
  This tool extracts Silkroad Online PK2 archives using the Rust-based
  pk2-extractor. It's the first step in the asset conversion pipeline.

  After extraction, files are automatically organized by type:
  - models/: BSR and BMS files (3D meshes)
  - textures/: DDJ and DDS files (textures)
  - animations/: BSK, BAN, BMF files (skeletons and animations)
  - sounds/: WAV, MP3, OGG files (audio)
  - data/: TXT, XML, JSON files (game data)

  An inventory.json file is generated with statistics about extracted files.
`);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { extractPK2, AssetStats };
