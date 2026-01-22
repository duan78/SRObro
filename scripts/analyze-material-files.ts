/**
 * Script pour analyser le format des fichiers .m (materials/texture indices)
 * Ces fichiers définissent quelles textures sont utilisées sur chaque tile du terrain
 */

import fs from 'fs/promises';
import path from 'path';

async function analyzeMaterialFile(filePath: string) {
    console.log(`🔍 Analyse de ${path.basename(filePath)}...`);

    const buffer = await fs.readFile(filePath);
    const view = new DataView(buffer.buffer);

    console.log(`   Taille: ${buffer.length} bytes`);

    // Analyser les premiers bytes
    console.log(`\n   Header (premiers 32 bytes):`);
    for (let i = 0; i < Math.min(32, buffer.length); i++) {
        const byte = buffer[i];
        process.stdout.write(byte.toString(16).padStart(2, '0') + ' ');
        if ((i + 1) % 16 === 0) console.log('');
    }

    // Hypothèse: uint16 array (texture indices)
    const uint16Count = Math.floor(buffer.length / 2);
    console.log(`\n   📊 Analyse structurée:`);
    console.log(`   Tiles possibles (uint16): ${uint16Count}`);

    const uint16Values: number[] = [];
    for (let i = 0; i < Math.min(100, uint16Count); i++) {
        uint16Values.push(view.getUint16(i * 2, true)); // little-endian
    }
    console.log(`   Valeurs uint16 (premiers 20): ${uint16Values.slice(0, 20).join(', ')}`);

    // Analyser les fréquences
    const freq = new Map<number, number>();
    for (let i = 0; i < Math.min(uint16Count, 1000); i++) {
        const val = view.getUint16(i * 2, true);
        freq.set(val, (freq.get(val) || 0) + 1);
    }

    console.log(`\n   📈 Top 10 fréquences:`);
    const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
    for (const [val, count] of sorted.slice(0, 10)) {
        const percentage = ((count / uint16Count) * 100).toFixed(1);
        console.log(`      ${val}: ${count} fois (${percentage}%)`);
    }

    return {
        size: buffer.length,
        uint16Count,
        topValues: sorted.slice(0, 10)
    };
}

async function analyzeAllMaterialFiles() {
    const mapDir = 'assets/pk2_extracted/Map';

    try {
        const files = await fs.readdir(mapDir);
        const mFiles = files.filter(f => f.endsWith('.m') && !f.startsWith('.')).slice(0, 3);

        console.log(`🔍 Analyse de ${mFiles.length} fichiers .m...\n`);

        for (const file of mFiles) {
            const filePath = path.join(mapDir, file);
            try {
                await analyzeMaterialFile(filePath);
                console.log('');
            } catch (e) {
                console.error(`❌ Erreur analyse ${file}:`, e);
            }
        }
    } catch (e) {
        console.error('❌ Erreur lecture dossier:', e);
    }
}

analyzeAllMaterialFiles().catch(console.error);
