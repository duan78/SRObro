/**
 * Asset Validation Script
 *
 * Validates GLB files to ensure they contain proper skinning data (JOINTS and WEIGHTS).
 * This is critical for ensuring that animations will work in Babylon.js.
 *
 * Usage:
 *   ts-node scripts/validate-assets.ts --input assets/converted
 *   ts-node scripts/validate-assets.ts --input assets/converted --detailed
 */

import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { parse } from 'path';

interface ValidationOptions {
    input: string;
    detailed?: boolean;
    verbose?: boolean;
    exportReport?: string;
}

interface ValidationResult {
    file: string;
    hasJoints: boolean;
    hasWeights: boolean;
    hasSkeleton: boolean;
    boneCount: number;
    meshCount: number;
    vertexCount: number;
    issues: string[];
    valid: boolean;
}

interface ValidationReport {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    results: ValidationResult[];
    summary: {
        withJoints: number;
        withWeights: number;
        withSkeleton: number;
        totalBones: number;
        averageBones: number;
    };
}

/**
 * Main validation function
 */
async function validateAssets(options: ValidationOptions): Promise<void> {
    console.log('='.repeat(60));
    console.log('GLB Skinning Validation Tool');
    console.log('='.repeat(60));

    const inputDir = path.resolve(options.input);

    // Validate inputs
    try {
        const stats = await fs.stat(inputDir);
        if (!stats.isDirectory()) {
            throw new Error(`Input path is not a directory: ${inputDir}`);
        }
    } catch (error) {
        throw new Error(`Input directory not found: ${inputDir}`);
    }

    console.log(`\nInput: ${inputDir}`);

    // Find all GLB files
    console.log('\nScanning for GLB files...');
    const glbFiles = await findGLBFiles(inputDir);
    console.log(`Found ${glbFiles.length} GLB files`);

    if (glbFiles.length === 0) {
        console.log('No GLB files found to validate.');
        return;
    }

    // Validate files
    console.log('\nValidating skinning data...');
    const results: ValidationResult[] = [];

    for (let i = 0; i < glbFiles.length; i++) {
        const glbFile = glbFiles[i];
        const relativePath = path.relative(inputDir, glbFile);

        console.log(`\n[${i + 1}/${glbFiles.length}] ${relativePath}`);

        try {
            const result = await validateGLBFile(glbFile, options.detailed || false);
            results.push(result);

            if (result.valid) {
                console.log(`  ✅ Valid - Joints: ${result.hasJoints}, Weights: ${result.hasWeights}, Bones: ${result.boneCount}`);
            } else {
                console.log(`  ❌ Invalid - Issues: ${result.issues.length}`);
                for (const issue of result.issues) {
                    console.log(`     - ${issue}`);
                }
            }
        } catch (error: any) {
            console.error(`  ❌ Error validating file: ${error.message}`);
            results.push({
                file: relativePath,
                hasJoints: false,
                hasWeights: false,
                hasSkeleton: false,
                boneCount: 0,
                meshCount: 0,
                vertexCount: 0,
                issues: [error.message],
                valid: false
            });
        }
    }

    // Generate report
    const report = generateReport(results);

    // Print summary
    printValidationSummary(report);

    // Export detailed report if requested
    if (options.exportReport) {
        await exportReport(report, options.exportReport);
        console.log(`\n✅ Detailed report exported to ${options.exportReport}`);
    }

    // Exit with error code if any files are invalid
    if (report.invalidFiles > 0) {
        process.exit(1);
    }
}

/**
 * Validate a single GLB file for skinning data
 */
async function validateGLBFile(filePath: string, detailed: boolean): Promise<ValidationResult> {
    const result: ValidationResult = {
        file: path.basename(filePath),
        hasJoints: false,
        hasWeights: false,
        hasSkeleton: false,
        boneCount: 0,
        meshCount: 0,
        vertexCount: 0,
        issues: [],
        valid: true
    };

    try {
        // Read GLB file
        const buffer = await fs.readFile(filePath);

        // Parse GLB header
        const header = parseGLBHeader(buffer);
        if (!header) {
            result.issues.push('Invalid GLB header');
            result.valid = false;
            return result;
        }

        // Parse JSON chunk
        const jsonChunk = parseJSONChunk(buffer, header);
        if (!jsonChunk) {
            result.issues.push('No JSON chunk found');
            result.valid = false;
            return result;
        }

        const gltf = JSON.parse(jsonChunk);

        // Check for skins (skeleton definitions)
        if (gltf.skins && gltf.skins.length > 0) {
            result.hasSkeleton = true;
            result.boneCount = gltf.skins[0].joints?.length || 0;

            // Check if skin references joints and inverseBindMatrices
            const skin = gltf.skins[0];
            if (skin.joints && skin.joints.length > 0) {
                result.hasJoints = true;
            }

            if (!skin.inverseBindMatrices) {
                result.issues.push('Skin missing inverseBindMatrices');
            }
        } else {
            result.issues.push('No skin definition found');
        }

        // Check meshes for JOINTS and WEIGHTS attributes
        let foundJoints = false;
        let foundWeights = false;

        for (const mesh of gltf.meshes || []) {
            result.meshCount++;

            for (const primitive of mesh.primitives || []) {
                const attributes = primitive.attributes || {};

                // Check for JOINTS_0 accessor
                if (attributes.JOINTS_0 !== undefined) {
                    foundJoints = true;
                    result.hasJoints = true;
                }

                // Check for WEIGHTS_0 accessor
                if (attributes.WEIGHTS_0 !== undefined) {
                    foundWeights = true;
                    result.hasWeights = true;
                }

                // Count vertices
                if (attributes.POSITION !== undefined) {
                    const accessor = gltf.accessors?.[attributes.POSITION];
                    if (accessor) {
                        result.vertexCount += accessor.count || 0;
                    }
                }
            }
        }

        if (!foundJoints) {
            result.issues.push('No JOINTS_0 attribute found in any mesh primitive');
        }

        if (!foundWeights) {
            result.issues.push('No WEIGHTS_0 attribute found in any mesh primitive');
        }

        // Detailed validation
        if (detailed) {
            // Validate accessors
            if (gltf.accessors) {
                for (let i = 0; i < gltf.accessors.length; i++) {
                    const accessor = gltf.accessors[i];

                    // Check if accessor is for joints or weights
                    if (accessor.name?.includes('joint') || accessor.name?.includes('weight')) {
                        // Validate component type
                        if (accessor.componentType === undefined) {
                            result.issues.push(`Accessor ${i} (${accessor.name}) missing componentType`);
                        }

                        // Validate count
                        if (accessor.count === undefined || accessor.count === 0) {
                            result.issues.push(`Accessor ${i} (${accessor.name}) has invalid count`);
                        }
                    }
                }
            }

            // Validate skinning data consistency
            if (result.hasSkeleton) {
                const skin = gltf.skins[0];

                // Check if all joints referenced in skin exist
                for (const jointIndex of skin.joints || []) {
                    if (gltf.nodes && gltf.nodes[jointIndex] === undefined) {
                        result.issues.push(`Skin references invalid joint node ${jointIndex}`);
                    }
                }
            }
        }

        // Determine if valid
        result.valid = result.hasJoints && result.hasWeights && result.hasSkeleton;

        // Add critical issues if invalid
        if (!result.hasJoints) {
            result.issues.push('CRITICAL: Missing JOINTS data - animation will not work');
        }
        if (!result.hasWeights) {
            result.issues.push('CRITICAL: Missing WEIGHTS data - vertices will not deform');
        }
        if (!result.hasSkeleton) {
            result.issues.push('CRITICAL: Missing skeleton definition - no bone hierarchy');
        }

    } catch (error: any) {
        result.issues.push(`Failed to parse GLB: ${error.message}`);
        result.valid = false;
    }

    return result;
}

/**
 * Parse GLB file header
 */
function parseGLBHeader(buffer: Buffer): { magic: number; version: number; length: number } | null {
    if (buffer.length < 12) {
        return null;
    }

    const magic = buffer.readUInt32LE(0);
    const version = buffer.readUInt32LE(4);
    const length = buffer.readUInt32LE(8);

    // Validate magic (should be "glTF" = 0x46546C67)
    if (magic !== 0x46546C67) {
        return null;
    }

    return { magic, version, length };
}

/**
 * Parse JSON chunk from GLB
 */
function parseJSONChunk(buffer: Buffer, header: { length: number }): string | null {
    if (buffer.length < 20) {
        return null;
    }

    // First chunk starts at offset 12
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.readUInt32LE(16);

    // JSON chunk has type 0x4E4F534A ("JSON")
    if (chunkType !== 0x4E4F534A) {
        return null;
    }

    // Read JSON data
    const jsonStart = 20;
    const jsonEnd = jsonStart + chunkLength;

    if (jsonEnd > buffer.length) {
        return null;
    }

    return buffer.subarray(jsonStart, jsonEnd).toString('utf-8');
}

/**
 * Find all GLB files in directory
 */
async function findGLBFiles(dir: string): Promise<string[]> {
    const glbFiles: string[] = [];

    async function scan(currentDir: string): Promise<void> {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                await scan(fullPath);
            } else if (entry.name.toLowerCase().endsWith('.glb') || entry.name.toLowerCase().endsWith('.gltf')) {
                glbFiles.push(fullPath);
            }
        }
    }

    await scan(dir);
    return glbFiles;
}

/**
 * Generate validation report
 */
function generateReport(results: ValidationResult[]): ValidationReport {
    const validFiles = results.filter(r => r.valid).length;
    const invalidFiles = results.filter(r => !r.valid).length;

    const summary = {
        withJoints: results.filter(r => r.hasJoints).length,
        withWeights: results.filter(r => r.hasWeights).length,
        withSkeleton: results.filter(r => r.hasSkeleton).length,
        totalBones: results.reduce((sum, r) => sum + r.boneCount, 0),
        averageBones: 0
    };

    if (summary.withSkeleton > 0) {
        summary.averageBones = summary.totalBones / summary.withSkeleton;
    }

    return {
        totalFiles: results.length,
        validFiles,
        invalidFiles,
        results,
        summary
    };
}

/**
 * Print validation summary
 */
function printValidationSummary(report: ValidationReport): void {
    console.log('\n' + '='.repeat(60));
    console.log('Validation Summary');
    console.log('='.repeat(60));
    console.log(`Total files:           ${report.totalFiles}`);
    console.log(`Valid files:           ${report.validFiles} ✅`);
    console.log(`Invalid files:         ${report.invalidFiles} ❌`);
    console.log('');
    console.log(`Files with JOINTS:     ${report.summary.withJoints}`);
    console.log(`Files with WEIGHTS:    ${report.summary.withWeights}`);
    console.log(`Files with SKELETON:   ${report.summary.withSkeleton}`);
    console.log(`Total bones:           ${report.summary.totalBones}`);
    console.log(`Average bones/model:   ${report.summary.averageBones.toFixed(1)}`);
    console.log('='.repeat(60));

    // List invalid files
    if (report.invalidFiles > 0) {
        console.log('\n❌ Invalid Files:');
        for (const result of report.results) {
            if (!result.valid) {
                console.log(`  ${result.file}`);
                for (const issue of result.issues) {
                    console.log(`    - ${issue}`);
                }
            }
        }
    }
}

/**
 * Export validation report to JSON
 */
async function exportReport(report: ValidationReport, outputPath: string): Promise<void> {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const options: ValidationOptions = {
        input: 'assets/converted',
        detailed: false,
        verbose: false
    };

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--input':
            case '-i':
                options.input = args[++i];
                break;
            case '--detailed':
            case '-d':
                options.detailed = true;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--export':
            case '-e':
                options.exportReport = args[++i];
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
        await validateAssets(options);
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
GLB Skinning Validation Tool

USAGE:
  ts-node scripts/validate-assets.ts [OPTIONS]

OPTIONS:
  --input, -i <path>       Input directory with GLB files (default: assets/converted)
  --detailed, -d           Enable detailed validation (checks accessors, etc.)
  --verbose, -v            Enable verbose logging
  --export, -e <path>      Export validation report to JSON file
  --help, -h               Show this help message

EXAMPLES:
  # Validate all GLB files
  ts-node scripts/validate-assets.ts -i assets/converted

  # Detailed validation with report export
  ts-node scripts/validate-assets.ts -i assets/converted -d -e validation-report.json

DESCRIPTION:
  This tool validates GLB files to ensure they contain proper skinning data
  (JOINTS and WEIGHTS) required for skeletal animation in Babylon.js.

  It checks for:
  - JOINTS_0 accessor in mesh primitives
  - WEIGHTS_0 accessor in mesh primitives
  - Skin definition with skeleton
  - Inverse bind matrices
  - Proper bone hierarchy

  This is the critical validation step after conversion to ensure that
  animations will actually work. Without proper JOINTS and WEIGHTS data,
  meshes will be static and cannot be animated.

  Exit codes:
  - 0: All files valid
  - 1: One or more files invalid (or error occurred)
`);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { validateAssets, ValidationResult, ValidationReport };
