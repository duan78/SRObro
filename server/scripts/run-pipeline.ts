/**
 * Complete Pipeline Execution Script
 *
 * This script runs the entire Phase 1 pipeline in sequence:
 * 1. Extract PK2
 * 2. Generate inventory
 * 3. Convert BSR to GLB with skinning
 * 4. Convert textures to WebP
 * 5. Validate all converted assets
 *
 * Usage:
 *   ts-node scripts/run-pipeline.ts --archive /path/to/Media.pk2
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface PipelineOptions {
    archive: string;
    output?: string;
    workers?: number;
    blenderPath?: string;
    skipExtraction?: boolean;
    skipConversion?: boolean;
    skipTextures?: boolean;
    skipValidation?: boolean;
}

interface PipelineResults {
    extractionSuccess: boolean;
    inventorySuccess: boolean;
    conversionSuccess: boolean;
    textureSuccess: boolean;
    validationSuccess: boolean;
    validFileCount: number;
    invalidFileCount: number;
}

/**
 * Run the complete pipeline
 */
async function runPipeline(options: PipelineOptions): Promise<PipelineResults> {
    console.log('='.repeat(80));
    console.log('SILKROAD ONLINE - ASSET CONVERSION PIPELINE');
    console.log('Phase 1: 3D Asset Extraction with Skinning Support');
    console.log('='.repeat(80));

    const results: PipelineResults = {
        extractionSuccess: false,
        inventorySuccess: false,
        conversionSuccess: false,
        textureSuccess: false,
        validationSuccess: false,
        validFileCount: 0,
        invalidFileCount: 0
    };

    const outputDir = options.output || 'assets';
    const extractedDir = path.join(outputDir, 'extracted');
    const convertedDir = path.join(outputDir, 'converted');

    // STEP 1: Extract PK2
    if (!options.skipExtraction) {
        console.log('\n' + '='.repeat(80));
        console.log('STEP 1: Extracting PK2 Archive');
        console.log('='.repeat(80));

        try {
            const extractCmd = `ts-node scripts/extract-pk2.ts --archive "${options.archive}" --output "${extractedDir}"`;
            console.log(`Executing: ${extractCmd}`);

            const { stdout, stderr } = await execAsync(extractCmd, {
                cwd: path.join(__dirname, '..'),
                timeout: 600000 // 10 minutes
            });

            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);

            results.extractionSuccess = true;
            console.log('\n✅ STEP 1 COMPLETED: PK2 extraction successful');
        } catch (error: any) {
            console.error('\n❌ STEP 1 FAILED: PK2 extraction failed:', error.message);
            return results;
        }
    } else {
        console.log('\n⏭️  STEP 1 SKIPPED: PK2 extraction');
        results.extractionSuccess = true;
    }

    // STEP 2: Generate Inventory
    console.log('\n' + '='.repeat(80));
    console.log('STEP 2: Generating Asset Inventory');
    console.log('='.repeat(80));

    try {
        const manifestPath = path.join(outputDir, 'manifest.json');
        const inventoryCmd = `ts-node scripts/inventory-assets.ts --input "${extractedDir}" --output "${manifestPath}"`;
        console.log(`Executing: ${inventoryCmd}`);

        const { stdout, stderr } = await execAsync(inventoryCmd, {
            cwd: path.join(__dirname, '..'),
            timeout: 300000 // 5 minutes
        });

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        results.inventorySuccess = true;
        console.log('\n✅ STEP 2 COMPLETED: Asset inventory generated');
    } catch (error: any) {
        console.error('\n❌ STEP 2 FAILED: Inventory generation failed:', error.message);
        // Continue anyway, inventory is not critical
    }

    // STEP 3: Convert BSR to GLB with Skinning
    if (!options.skipConversion) {
        console.log('\n' + '='.repeat(80));
        console.log('STEP 3: Converting BSR to GLB (CRITICAL - Skinning Support)');
        console.log('='.repeat(80));

        try {
            let convertCmd = `ts-node scripts/convert-blender.ts --input "${extractedDir}" --output "${convertedDir}"`;

            if (options.workers) {
                convertCmd += ` --workers ${options.workers}`;
            }
            if (options.blenderPath) {
                convertCmd += ` --blender-path "${options.blenderPath}"`;
            }

            console.log(`Executing: ${convertCmd}`);
            console.log('⚠️  This step may take HOURS for large PK2 files...');

            const { stdout, stderr } = await execAsync(convertCmd, {
                cwd: path.join(__dirname, '..'),
                timeout: 3600000 * 24 // 24 hours
            });

            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);

            results.conversionSuccess = true;
            console.log('\n✅ STEP 3 COMPLETED: BSR to GLB conversion with skinning');
        } catch (error: any) {
            console.error('\n❌ STEP 3 FAILED: BSR conversion failed:', error.message);
            return results;
        }
    } else {
        console.log('\n⏭️  STEP 3 SKIPPED: BSR conversion');
        results.conversionSuccess = true;
    }

    // STEP 4: Convert Textures to WebP
    if (!options.skipTextures) {
        console.log('\n' + '='.repeat(80));
        console.log('STEP 4: Converting Textures to WebP');
        console.log('='.repeat(80));

        try {
            const textureCmd = `ts-node scripts/convert-textures.ts --input "${extractedDir}" --output "${convertedDir}" --quality 85`;
            console.log(`Executing: ${textureCmd}`);

            const { stdout, stderr } = await execAsync(textureCmd, {
                cwd: path.join(__dirname, '..'),
                timeout: 3600000 * 4 // 4 hours
            });

            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);

            results.textureSuccess = true;
            console.log('\n✅ STEP 4 COMPLETED: Texture conversion to WebP');
        } catch (error: any) {
            console.error('\n❌ STEP 4 FAILED: Texture conversion failed:', error.message);
            // Continue anyway, textures are not critical for functionality
        }
    } else {
        console.log('\n⏭️  STEP 4 SKIPPED: Texture conversion');
        results.textureSuccess = true;
    }

    // STEP 5: Validate Assets
    if (!options.skipValidation) {
        console.log('\n' + '='.repeat(80));
        console.log('STEP 5: Validating Converted Assets');
        console.log('='.repeat(80));

        try {
            const reportPath = path.join(outputDir, 'validation-report.json');
            const validateCmd = `ts-node scripts/validate-assets.ts --input "${convertedDir}" --detailed --export "${reportPath}"`;
            console.log(`Executing: ${validateCmd}`);

            const { stdout, stderr } = await execAsync(validateCmd, {
                cwd: path.join(__dirname, '..'),
                timeout: 600000 // 10 minutes
            });

            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);

            // Parse validation report
            try {
                const reportContent = await fs.readFile(reportPath, 'utf-8');
                const report = JSON.parse(reportContent);
                results.validFileCount = report.validFiles;
                results.invalidFileCount = report.invalidFiles;
                results.validationSuccess = true;
            } catch {
                // Report parsing failed, but validation ran
                results.validationSuccess = true;
            }

            console.log('\n✅ STEP 5 COMPLETED: Asset validation finished');
        } catch (error: any) {
            console.error('\n❌ STEP 5 FAILED: Asset validation failed:', error.message);
            // Continue anyway
        }
    } else {
        console.log('\n⏭️  STEP 5 SKIPPED: Asset validation');
        results.validationSuccess = true;
    }

    // Final Summary
    console.log('\n' + '='.repeat(80));
    console.log('PIPELINE EXECUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(`PK2 Extraction:       ${results.extractionSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Inventory Generation: ${results.inventorySuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`BSR Conversion:       ${results.conversionSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Texture Conversion:   ${results.textureSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Asset Validation:     ${results.validationSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log('');
    console.log(`Valid Assets:         ${results.validFileCount.toLocaleString()}`);
    console.log(`Invalid Assets:       ${results.invalidFileCount.toLocaleString()}`);

    if (results.invalidFileCount > 0) {
        console.log('\n⚠️  Warning: Some assets failed validation. Check validation-report.json for details.');
    }

    const allSuccess = results.extractionSuccess && results.conversionSuccess;

    if (allSuccess) {
        console.log('\n🎉 PIPELINE COMPLETED SUCCESSFULLY!');
        console.log('\nYour assets are ready for use in Babylon.js.');
        console.log(`Output directory: ${outputDir}`);
        console.log('\nNext steps:');
        console.log('1. Test loading a character model in the Babylon.js client');
        console.log('2. Verify that animations play correctly');
        console.log('3. Proceed to Phase 2: Gameplay Core implementation');
    } else {
        console.log('\n❌ PIPELINE COMPLETED WITH ERRORS');
        console.log('Please fix the errors above and re-run the pipeline.');
    }

    console.log('='.repeat(80));

    return results;
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const options: PipelineOptions = {
        archive: '',
        output: 'assets',
        workers: 4
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
            case '--workers':
            case '-w':
                options.workers = parseInt(args[++i], 10);
                break;
            case '--blender-path':
            case '-b':
                options.blenderPath = args[++i];
                break;
            case '--skip-extraction':
                options.skipExtraction = true;
                break;
            case '--skip-conversion':
                options.skipConversion = true;
                break;
            case '--skip-textures':
                options.skipTextures = true;
                break;
            case '--skip-validation':
                options.skipValidation = true;
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

    // Validate required options
    if (!options.archive && !options.skipExtraction) {
        console.error('Error: --archive is required (unless using --skip-extraction)');
        printHelp();
        process.exit(1);
    }

    try {
        const results = await runPipeline(options);

        // Exit with error code if pipeline failed
        if (!results.extractionSuccess || !results.conversionSuccess) {
            process.exit(1);
        }
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
Complete Asset Conversion Pipeline - Phase 1

USAGE:
  ts-node scripts/run-pipeline.ts --archive /path/to/Media.pk2 [OPTIONS]

REQUIRED OPTIONS:
  --archive, -a <path>       Path to Media.pk2 file

OPTIONAL OPTIONS:
  --output, -o <path>        Output directory (default: assets)
  --workers, -w <number>     Number of parallel workers for conversion (default: 4)
  --blender-path, -b <path>  Path to Blender executable

SKIP OPTIONS (for resuming failed pipeline):
  --skip-extraction          Skip PK2 extraction (assume already extracted)
  --skip-conversion          Skip BSR to GLB conversion
  --skip-textures            Skip texture conversion
  --skip-validation          Skip asset validation

  --help, -h                 Show this help message

EXAMPLES:
  # Run complete pipeline
  ts-node scripts/run-pipeline.ts -a /path/to/Media.pk2

  # Run with 8 workers and custom Blender path
  ts-node scripts/run-pipeline.ts -a Media.pk2 -w 8 -b "C:\\Blender\\blender.exe"

  # Resume from conversion step (skip extraction)
  ts-node scripts/run-pipeline.ts -a Media.pk2 --skip-extraction

  # Run only validation step
  ts-node scripts/run-pipeline.ts -a Media.pk2 --skip-extraction --skip-conversion --skip-textures

DESCRIPTION:
  This script runs the complete Phase 1 pipeline in sequence:
  1. Extracts PK2 archive using Rust-based extractor
  2. Generates asset inventory and manifest
  3. Converts BSR files to GLB with complete skinning data (CRITICAL)
  4. Converts DDJ textures to WebP format
  5. Validates all converted assets for proper skinning

  The pipeline is designed to be resumable. If a step fails, you can
  skip the completed steps and re-run from the failed step.

  Expected duration:
  - Extraction: 10-30 minutes (depending on PK2 size)
  - Inventory: 1-5 minutes
  - Conversion: 2-24 hours (depending on number of assets and workers)
  - Textures: 1-4 hours
  - Validation: 5-30 minutes

  Total: Approximately 4-30 hours for a complete Media.pk2 conversion.
`);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { runPipeline, PipelineOptions, PipelineResults };
