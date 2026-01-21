/**
 * Quick Test Validation Script
 *
 * Validates that the test GLB contains proper skinning data
 */

import fs from 'fs/promises';

async function validateTestGLB(): Promise<void> {
    const glbPath = 'C:/Users/duan7/Desktop/SRObro/assets/test-converted/test_skinned_mesh.glb';

    console.log('Validating test GLB file...');
    console.log('File:', glbPath);

    try {
        const buffer = await fs.readFile(glbPath);

        // Parse GLB header
        const magic = buffer.readUInt32LE(0);
        console.log(`\nMagic: 0x${magic.toString(16).toUpperCase()}`);

        if (magic !== 0x46546C67) { // "glTF"
            console.error('❌ Invalid GLB magic number');
            return;
        }

        console.log('✅ Valid GLB file');

        // Read JSON chunk
        const chunkLength = buffer.readUInt32LE(12);
        const chunkType = buffer.readUInt32LE(16);

        console.log(`\nJSON Chunk: length=${chunkLength}, type=0x${chunkType.toString(16)}`);

        if (chunkType !== 0x4E4F534A) { // "JSON"
            console.error('❌ First chunk is not JSON');
            return;
        }

        // Parse JSON
        const jsonStart = 20;
        const jsonEnd = jsonStart + chunkLength;
        const jsonStr = buffer.subarray(jsonStart, jsonEnd).toString('utf-8');
        const gltf = JSON.parse(jsonStr);

        console.log('\n' + '='.repeat(60));
        console.log('glTF Structure Analysis');
        console.log('='.repeat(60));

        // Check for skins
        if (gltf.skins && gltf.skins.length > 0) {
            console.log(`✅ Skins found: ${gltf.skins.length}`);
            gltf.skins.forEach((skin: any, idx: number) => {
                console.log(`   Skin ${idx}:`);
                console.log(`     - Joints: ${skin.joints?.length || 0}`);
                console.log(`     - Inverse Bind Matrices: ${skin.inverseBindMatrices ? 'Yes' : 'No'}`);
                console.log(`     - Skeleton: ${skin.skeleton || 'None'}`);
            });
        } else {
            console.log('❌ No skins found');
        }

        // Check meshes for JOINTS and WEIGHTS
        console.log(`\n✅ Meshes found: ${gltf.meshes?.length || 0}`);

        let hasJoints = false;
        let hasWeights = false;

        for (let i = 0; i < (gltf.meshes?.length || 0); i++) {
            const mesh = gltf.meshes[i];
            console.log(`\nMesh ${i}: ${mesh.name || '(unnamed)'}`);

            for (let j = 0; j < (mesh.primitives?.length || 0); j++) {
                const prim = mesh.primitives[j];
                const attributes = prim.attributes || {};

                console.log(`   Primitive ${j}:`);
                console.log(`     - POSITION: ${attributes.POSITION !== undefined ? 'Yes' : 'No'}`);
                console.log(`     - NORMAL: ${attributes.NORMAL !== undefined ? 'Yes' : 'No'}`);
                console.log(`     - TEXCOORD_0: ${attributes.TEXCOORD_0 !== undefined ? 'Yes' : 'No'}`);
                console.log(`     - JOINTS_0: ${attributes.JOINTS_0 !== undefined ? '✅ Yes' : '❌ No'}`);
                console.log(`     - WEIGHTS_0: ${attributes.WEIGHTS_0 !== undefined ? '✅ Yes' : '❌ No'}`);

                if (attributes.JOINTS_0 !== undefined) hasJoints = true;
                if (attributes.WEIGHTS_0 !== undefined) hasWeights = true;
            }
        }

        // Check accessors
        console.log(`\n✅ Accessors found: ${gltf.accessors?.length || 0}`);

        // Look for JOINTS and WEIGHTS accessors
        if (gltf.accessors) {
            for (let i = 0; i < gltf.accessors.length; i++) {
                const acc = gltf.accessors[i];
                if (acc.name && (acc.name.includes('joint') || acc.name.includes('weight'))) {
                    console.log(`   Accessor ${i} (${acc.name}):`);
                    console.log(`     - Type: ${acc.type}`);
                    console.log(`     - Component Type: ${acc.componentType}`);
                    console.log(`     - Count: ${acc.count}`);
                }
            }
        }

        // Final verdict
        console.log('\n' + '='.repeat(60));
        console.log('VALIDATION RESULT');
        console.log('='.repeat(60));

        if (hasJoints && hasWeights) {
            console.log('🎉 SUCCESS: GLB file contains complete skinning data!');
            console.log('   - JOINTS_0 accessor: ✅ Present');
            console.log('   - WEIGHTS_0 accessor: ✅ Present');
            console.log('\nThis file is ready for skeletal animation in Babylon.js!');
        } else if (hasJoints || hasWeights) {
            console.log('⚠️  PARTIAL: GLB file has incomplete skinning data');
            console.log(`   - JOINTS_0: ${hasJoints ? '✅' : '❌'}`);
            console.log(`   - WEIGHTS_0: ${hasWeights ? '✅' : '❌'}`);
        } else {
            console.log('❌ FAILED: GLB file does NOT contain skinning data');
            console.log('   The mesh will be static and cannot be animated');
        }

        console.log('='.repeat(60));

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

validateTestGLB().catch(console.error);
