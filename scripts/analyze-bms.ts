/**
 * Quick BMS File Analyzer
 */

import fs from 'fs';
import path from 'path';

function analyzeBMS(filePath: string) {
    const buffer = fs.readFileSync(filePath);

    console.log('='.repeat(60));
    console.log(`Analyzing: ${path.basename(filePath)}`);
    console.log('='.repeat(60));

    // Read first 200 bytes
    const header = buffer.slice(0, 200);

    console.log(`\nFile Size: ${buffer.length} bytes`);
    console.log(`\nFirst 200 bytes (hex):`);

    // Print hex dump
    for (let i = 0; i < Math.min(200, buffer.length); i += 16) {
        const chunk = buffer.slice(i, Math.min(i + 16, buffer.length));
        const hex = Array.from(chunk)
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ');
        const ascii = Array.from(chunk)
            .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
            .join('');
        console.log(`${(i).toString(16).padStart(4, '0')}:  ${hex.padEnd(47)}  ${ascii}`);
    }

    // Check magic
    const magic0 = buffer.readUInt32LE(0);
    const magicStr = Buffer.from([buffer[0], buffer[1], buffer[2], buffer[3]]).toString('ascii');

    console.log(`\nMagic Analysis:`);
    console.log(`  UInt32 LE: 0x${magic0.toString(16).toUpperCase()}`);
    console.log(`  Bytes[0-3] as ASCII: "${magicStr}"`);

    // Try BMS magic
    if (magicStr === 'BMS\x00' || magicStr === 'BMS\x02') {
        console.log(`  ✅ BMS format detected`);

        // Try to parse BMS header
        console.log(`\nPossible BMS Header Structure:`);

        const version = buffer.readUInt32LE(4);
        const vertexCount = buffer.readUInt32LE(8);
        const faceCount = buffer.readUInt32LE(12);
        const boneCount = buffer.readUInt32LE(16);

        console.log(`  Version: ${version}`);
        console.log(`  Vertices: ${vertexCount}`);
        console.log(`  Faces: ${faceCount}`);
        console.log(`  Bones: ${boneCount}`);
    } else {
        console.log(`  ❓ Unknown format (not standard BMS)`);
    }

    console.log('='.repeat(60));
}

// Analyze a BMS file
analyzeBMS('C:/Users/duan7/Desktop/SRObro/temp_extraction/Data/prim/mesh/mob/arabia/curse_fire_01.BMS');
