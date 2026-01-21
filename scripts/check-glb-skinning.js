/**
 * Quick GLB skinning check
 */

import fs from 'fs';
import path from 'path';

function checkGLBSkinning(glbPath) {
    console.log(`Checking: ${glbPath}\n`);

    const buffer = fs.readFileSync(glbPath);

    // Read GLB header
    const magic = buffer.toString('ascii', 0, 4);
    const version = buffer.readUInt32LE(4);
    const totalLength = buffer.readUInt32LE(8);

    console.log(`Magic: ${magic}`);
    console.log(`Version: ${version}`);
    console.log(`Total Length: ${totalLength}\n`);

    let offset = 12; // After header
    let foundJSON = false;
    let jsonChunk = null;

    // Read chunks
    while (offset < buffer.length) {
        const chunkLength = buffer.readUInt32LE(offset);
        const chunkType = buffer.toString('ascii', offset + 4, offset + 8);

        console.log(`Chunk: ${chunkType}, Length: ${chunkLength}`);

        if (chunkType === 'JSON') {
            foundJSON = true;
            const chunkData = buffer.toString('utf8', offset + 8, offset + 8 + chunkLength);
            jsonChunk = JSON.parse(chunkData);
            break;
        }

        offset += 8 + chunkLength;
    }

    if (!jsonChunk) {
        console.log('No JSON chunk found!');
        return false;
    }

    // Check for skinning data
    console.log('\n=== CHECKING FOR SKINNING DATA ===\n');

    let hasJoints = false;
    let hasWeights = false;
    let hasSkins = false;
    let hasSkeleton = false;

    // Check meshes for JOINTS and WEIGHTS attributes
    if (jsonChunk.meshes) {
        console.log(`Found ${jsonChunk.meshes.length} mesh(es)`);

        for (let i = 0; i < jsonChunk.meshes.length; i++) {
            const mesh = jsonChunk.meshes[i];
            console.log(`\nMesh ${i}: ${mesh.name || '(unnamed)'}`);

            if (mesh.primitives) {
                for (let j = 0; j < mesh.primitives.length; j++) {
                    const primitive = mesh.primitives[j];
                    const attributes = primitive.attributes || {};

                    console.log(`  Primitive ${j} attributes:`);
                    console.log(`    POSITION: ${attributes.POSITION !== undefined ? 'YES' : 'NO'}`);
                    console.log(`    NORMAL: ${attributes.NORMAL !== undefined ? 'YES' : 'NO'}`);
                    console.log(`    TEXCOORD_0: ${attributes.TEXCOORD_0 !== undefined ? 'YES' : 'NO'}`);
                    console.log(`    JOINTS_0: ${attributes.JOINTS_0 !== undefined ? 'YES ✓' : 'NO ✗'}`);
                    console.log(`    WEIGHTS_0: ${attributes.WEIGHTS_0 !== undefined ? 'YES ✓' : 'NO ✗'}`);

                    if (attributes.JOINTS_0) hasJoints = true;
                    if (attributes.WEIGHTS_0) hasWeights = true;
                }
            }
        }
    }

    // Check for skins
    if (jsonChunk.skins) {
        console.log(`\nFound ${jsonChunk.skins.length} skin(s) ✓`);
        hasSkins = true;

        for (let i = 0; i < jsonChunk.skins.length; i++) {
            const skin = jsonChunk.skins[i];
            console.log(`  Skin ${i}:`);
            console.log(`    Joints: ${skin.joints ? skin.joints.length : 0}`);
            console.log(`    InverseBindMatrices: ${skin.inverseBindMatrices !== undefined}`);
            console.log(`    Skeleton: ${skin.skeleton !== undefined}`);
            if (skin.skeleton) hasSkeleton = true;
        }
    } else {
        console.log('\nNo skins found ✗');
    }

    // Check for nodes with skin
    if (jsonChunk.nodes) {
        const skinnedNodes = jsonChunk.nodes.filter(n => n.skin !== undefined);
        if (skinnedNodes.length > 0) {
            console.log(`\nFound ${skinnedNodes.length} node(s) with skin reference ✓`);
        }
    }

    console.log('\n=== RESULT ===');
    console.log(`JOINTS_0 attribute: ${hasJoints ? 'YES ✓' : 'NO ✗'}`);
    console.log(`WEIGHTS_0 attribute: ${hasWeights ? 'YES ✓' : 'NO ✗'}`);
    console.log(`Skins defined: ${hasSkins ? 'YES ✓' : 'NO ✗'}`);
    console.log(`Skeleton reference: ${hasSkeleton ? 'YES ✓' : 'NO ✗'}`);

    if (hasJoints && hasWeights) {
        console.log('\n🎉 SUCCESS: GLB contains skinning data!');
        return true;
    } else {
        console.log('\n❌ FAILURE: GLB does NOT have complete skinning data');
        console.log('   Mesh will be static without animation capability');
        return false;
    }
}

// Check the file
const glbPath = process.argv[2] || 'client/assets/characters/chinaman_adventurer_face.glb';
checkGLBSkinning(glbPath);
