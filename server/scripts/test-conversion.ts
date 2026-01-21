/**
 * Test Conversion Script
 *
 * Tests the BSR to GLB conversion pipeline with a small sample of files.
 * This is a quick test to verify everything works before running the full pipeline.
 *
 * Usage:
 *   ts-node scripts/test-conversion.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface TestResult {
    file: string;
    converted: boolean;
    hasJoints: boolean;
    hasWeights: boolean;
    boneCount: number;
    meshCount: number;
    fileSize: number;
    error?: string;
}

/**
 * Main test function
 */
async function runTests(): Promise<void> {
    console.log('='.repeat(80));
    console.log('BSR TO GLB CONVERSION - TEST RUN');
    console.log('='.repeat(80));

    const blenderPath = `C:\\Program Files\\Blender Foundation\\Blender 5.0\\blender.exe`;
    const testFiles = [
        'C:\\Users\\duan7\\Desktop\\SRObro\\temp_extraction\\Data\\easteuropequest_soldier_masimus.bsr',
        'C:\\Users\\duan7\\Desktop\\SRObro\\temp_extraction\\Data\\res\\artifact\\china\\jangan\\cj_lamp01.bsr',
        'C:\\Users\\duan7\\Desktop\\SRObro\\temp_extraction\\Data\\res\\artifact\\china\\jangan\\cj_table01.bsr'
    ];

    const testOutputDir = path.resolve(path.join(__dirname, '../../assets/test-converted'));
    await fs.mkdir(testOutputDir, { recursive: true });

    console.log(`\nBlender Path: ${blenderPath}`);
    console.log(`Test Output: ${testOutputDir}`);
    console.log(`Test Files: ${testFiles.length}`);

    // Verify Blender exists
    try {
        await fs.access(blenderPath);
        console.log('✅ Blender found');
    } catch {
        console.error('❌ Blender not found at:', blenderPath);
        console.error('Please install Blender or update the path in this script');
        process.exit(1);
    }

    const results: TestResult[] = [];

    // Test each file
    for (let i = 0; i < testFiles.length; i++) {
        const inputFile = testFiles[i];
        const fileName = path.basename(inputFile, '.bsr');
        const outputFile = path.join(testOutputDir, `${fileName}.glb`);

        console.log(`\n${'='.repeat(80)}`);
        console.log(`TEST ${i + 1}/${testFiles.length}: ${fileName}`);
        console.log('='.repeat(80));

        const result = await testConvertFile(inputFile, outputFile, blenderPath);
        results.push(result);

        if (result.converted) {
            console.log(`✅ Conversion successful`);
            console.log(`   File size: ${(result.fileSize / 1024).toFixed(2)} KB`);
            console.log(`   Meshes: ${result.meshCount}`);
            console.log(`   Bones: ${result.boneCount}`);
            console.log(`   Has JOINTS: ${result.hasJoints ? '✅' : '❌'}`);
            console.log(`   Has WEIGHTS: ${result.hasWeights ? '✅' : '❌'}`);

            if (!result.hasJoints || !result.hasWeights) {
                console.warn(`   ⚠️  Warning: Missing skinning data - animation may not work!`);
            }
        } else {
            console.log(`❌ Conversion failed: ${result.error}`);
        }
    }

    // Print summary
    printTestSummary(results);

    // Save results
    const resultsPath = path.join(testOutputDir, 'test-results.json');
    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Test results saved to: ${resultsPath}`);
}

/**
 * Test converting a single file
 */
async function testConvertFile(
    inputFile: string,
    outputFile: string,
    blenderPath: string
): Promise<TestResult> {
    const result: TestResult = {
        file: path.basename(inputFile),
        converted: false,
        hasJoints: false,
        hasWeights: false,
        boneCount: 0,
        meshCount: 0,
        fileSize: 0
    };

    try {
        // Get importer path - use absolute path
        const projectRoot = path.resolve(path.join(__dirname, '../..'));
        const importerPath = path.join(
            projectRoot,
            'tools/blender-bsr-importer/__init__.py'
        ).replace(/\\/g, '/');

        // Check if importer exists
        await fs.access(importerPath);

        // Create Blender script
        const blenderScript = `
import bpy
import sys
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import BSR
importer_path = '${importerPath}'
import importlib.util
spec = importlib.util.spec_from_file_location("bsr_importer", importer_path)
bsr_importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bsr_importer)

# Import BSR file
mesh_obj, arm_obj = bsr_importer.import_bsr_to_blender(bpy.context, '${inputFile.replace(/\\/g, '/')}', scale=1.0)

# Export to GLB
bpy.ops.export_scene.gltf(
    filepath='${outputFile.replace(/\\/g, '/')}',
    export_format='GLB',
    use_selection=False,
    export_texcoords=True,
    export_normals=True,
    export_tangents=True,
    export_skins=True,
    export_morph=False,
    export_cameras=False,
    export_lights=False
)

print("EXPORT_SUCCESS")
`;

        // Write script to temp file
        const scriptPath = path.join(
            process.env.TEMP || '/tmp',
            `blender-test-${Date.now()}.py`
        );

        await fs.writeFile(scriptPath, blenderScript);

        try {
            // Execute Blender
            const command = `"${blenderPath}" -b -P "${scriptPath}"`;
            console.log(`Executing Blender...`);

            const { stdout, stderr } = await execAsync(command, {
                maxBuffer: 10 * 1024 * 1024,
                timeout: 60000
            });

            if (stdout && stdout.includes('EXPORT_SUCCESS')) {
                result.converted = true;
            }

            // Check for errors
            if (stderr && stderr.toLowerCase().includes('error')) {
                console.warn('Blender stderr:', stderr);
            }

        } finally {
            // Clean up temp script
            try {
                await fs.unlink(scriptPath);
            } catch {}
        }

        // Validate output
        if (result.converted) {
            const validation = await validateGLB(outputFile);
            result.hasJoints = validation.hasJoints;
            result.hasWeights = validation.hasWeights;
            result.boneCount = validation.boneCount;
            result.meshCount = validation.meshCount;

            // Get file size
            const stats = await fs.stat(outputFile);
            result.fileSize = stats.size;
        }

    } catch (error: any) {
        result.error = error.message;
        console.error(`Error: ${error.message}`);
    }

    return result;
}

/**
 * Validate GLB file for skinning data
 */
async function validateGLB(filePath: string): Promise<{
    hasJoints: boolean;
    hasWeights: boolean;
    boneCount: number;
    meshCount: number;
}> {
    const validation = {
        hasJoints: false,
        hasWeights: false,
        boneCount: 0,
        meshCount: 0
    };

    try {
        const buffer = await fs.readFile(filePath);

        // Parse GLB header
        const magic = buffer.readUInt32LE(0);
        if (magic !== 0x46546C67) { // "glTF"
            return validation;
        }

        // Read JSON chunk
        const chunkLength = buffer.readUInt32LE(12);
        const chunkType = buffer.readUInt32LE(16);

        if (chunkType !== 0x4E4F534A) { // "JSON"
            return validation;
        }

        const jsonStart = 20;
        const jsonEnd = jsonStart + chunkLength;
        const jsonStr = buffer.subarray(jsonStart, jsonEnd).toString('utf-8');
        const gltf = JSON.parse(jsonStr);

        // Check for skins
        if (gltf.skins && gltf.skins.length > 0) {
            validation.boneCount = gltf.skins[0].joints?.length || 0;
        }

        // Check meshes for JOINTS and WEIGHTS
        for (const mesh of gltf.meshes || []) {
            validation.meshCount++;

            for (const primitive of mesh.primitives || []) {
                const attributes = primitive.attributes || {};

                if (attributes.JOINTS_0 !== undefined) {
                    validation.hasJoints = true;
                }

                if (attributes.WEIGHTS_0 !== undefined) {
                    validation.hasWeights = true;
                }
            }
        }

    } catch (error) {
        console.error('Validation error:', error);
    }

    return validation;
}

/**
 * Print test summary
 */
function printTestSummary(results: TestResult[]): void {
    const converted = results.filter(r => r.converted).length;
    const withJoints = results.filter(r => r.hasJoints).length;
    const withWeights = results.filter(r => r.hasWeights).length;
    const withSkins = results.filter(r => r.hasJoints && r.hasWeights).length;

    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total files:        ${results.length}`);
    console.log(`Converted:          ${converted} ✅`);
    console.log(`Failed:             ${results.length - converted} ❌`);
    console.log(`With JOINTS:        ${withJoints} ✅`);
    console.log(`With WEIGHTS:       ${withWeights} ✅`);
    console.log(`Complete Skinning:  ${withSkins} ✅`);
    console.log('='.repeat(80));

    if (withSkins === results.length) {
        console.log('\n🎉 ALL TESTS PASSED! Pipeline is ready for full conversion.');
    } else if (withSkins > 0) {
        console.log('\n⚠️  PARTIAL SUCCESS: Some files have skinning, others do not.');
        console.log('   This may be normal - not all BSR files contain animation data.');
    } else {
        console.log('\n❌ ALL TESTS FAILED: No skinning data found in any converted files.');
        console.log('   The Blender importer may need debugging.');
    }
}

// Run tests
runTests().catch(console.error);
