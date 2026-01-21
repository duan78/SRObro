/**
 * Quick BSR File Analyzer
 *
 * Analyzes the header of BSR files to understand their format
 */

import fs from 'fs';
import path from 'path';

function analyzeBSR(filePath: string) {
    const buffer = fs.readFileSync(filePath);

    console.log('='.repeat(60));
    console.log(`Analyzing: ${path.basename(filePath)}`);
    console.log('='.repeat(60));

    // Read first 100 bytes
    const header = buffer.slice(0, 100);

    console.log(`\nFile Size: ${buffer.length} bytes`);
    console.log(`\nFirst 100 bytes (hex):`);

    // Print hex dump
    for (let i = 0; i < Math.min(100, buffer.length); i += 16) {
        const chunk = buffer.slice(i, Math.min(i + 16, buffer.length));
        const hex = Array.from(chunk)
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ');
        const ascii = Array.from(chunk)
            .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
            .join('');
        console.log(`${(i).toString(16).padStart(4, '0')}:  ${hex.padEnd(47)}  ${ascii}`);
    }

    // Try to read magic as strings
    const magic0 = buffer.readUInt32LE(0);
    const magicStr = Buffer.from([buffer[0], buffer[1], buffer[2], buffer[3]]).toString('ascii');
    const magicStr2 = Buffer.from([buffer[1], buffer[2], buffer[3], buffer[4]]).toString('ascii');

    console.log(`\nMagic Analysis:`);
    console.log(`  UInt32 LE: 0x${magic0.toString(16).toUpperCase()}`);
    console.log(`  Bytes[0-3] as ASCII: "${magicStr}"`);
    console.log(`  Bytes[1-4] as ASCII: "${magicStr2}"`);

    // Check for known formats
    console.log(`\nFormat Detection:`);

    if (magicStr === 'BSR\x02' || magic0 === 0x02525342) {
        console.log(`  ✅ Standard BSR format`);
    } else if (magicStr2 === 'JMXW' || magic0 === 0x56584d4a) {
        console.log(`  ⚠️  JMXW format (XMX compressed/encrypted)`);
        console.log(`     These files need special handling`);
    } else if (magicStr === 'DDS ') {
        console.log(`  ℹ️  This is a DDS file (texture)`);
    } else if (magicStr === 'PK2\0') {
        console.log(`  ℹ️  This is a PK2 archive`);
    } else {
        console.log(`  ❓ Unknown format`);
    }

    // Look for common strings in first 1KB
    const searchSize = Math.min(1024, buffer.length);
    const searchable = buffer.slice(0, searchSize);
    const str = searchable.toString('ascii', 0);

    console.log(`\nSearching for patterns...`);

    if (str.includes('BSR')) {
        console.log(`  - Contains "BSR" string`);
    }
    if (str.includes('bms')) {
        console.log(`  - Contains "bms" string`);
    }
    if (str.includes('XVM')) {
        console.log(`  - Contains "XVM" string`);
    }

    console.log('='.repeat(60));
}

// Analyze the test file
analyzeBSR('C:/Users/duan7/Desktop/SRObro/temp_extraction/Data/easteuropequest_soldier_masimus.bsr');
