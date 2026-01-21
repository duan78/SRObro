/**
 * Analyse des fichiers .o et .o2 (Object placement)
 */

import fs from 'fs/promises';

async function analyzeObjectFiles() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Analyse Fichiers .o et .o2                              ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Analyser 100.o
    const oData = await fs.readFile('assets/pk2_extracted/Map/100/100.o');
    console.log('📄 Fichier: 100.o');
    console.log('   Taille:', oData.length, 'bytes (1.9 KB)\n');

    console.log('   Header (64 bytes hex):');
    console.log('   ' + oData.slice(0, 64).toString('hex').match(/.{1,32}/g).join('\n   '));

    console.log('\n   Analyse structurée:');

    // Essayer different formats
    console.log('\n   Essai 1: uint32 LE (IDs/Position):');
    for (let i = 0; i < Math.min(40, oData.length); i += 4) {
        const val = oData.readUInt32LE(i);
        console.log(`      Offset ${i.toString().padStart(2)}: ${val}`);
    }

    console.log('\n   Essai 2: float32 LE (Positions):');
    for (let i = 0; i < Math.min(40, oData.length); i += 4) {
        const val = oData.readFloatLE(i);
        if (Number.isFinite(val) && Math.abs(val) < 10000) {
            console.log(`      Offset ${i.toString().padStart(2)}: ${val.toFixed(2)}`);
        }
    }

    // Analyser 100.o2
    const o2Data = await fs.readFile('assets/pk2_extracted/Map/100/100.o2');
    console.log('\n\n📄 Fichier: 100.o2');
    console.log('   Taille:', o2Data.length, 'bytes (3.7 KB)\n');

    console.log('   Header (64 bytes hex):');
    console.log('   ' + o2Data.slice(0, 64).toString('hex').match(/.{1,32}/g).join('\n   '));

    console.log('\n   Essai 1: uint32 LE:');
    for (let i = 0; i < Math.min(40, o2Data.length); i += 4) {
        const val = o2Data.readUInt32LE(i);
        console.log(`      Offset ${i.toString().padStart(2)}: ${val}`);
    }

    console.log('\n   Essai 2: float32 LE:');
    for (let i = 0; i < Math.min(40, o2Data.length); i += 4) {
        const val = o2Data.readFloatLE(i);
        if (Number.isFinite(val) && Math.abs(val) < 10000) {
            console.log(`      Offset ${i.toString().padStart(2)}: ${val.toFixed(2)}`);
        }
    }

    // Compter les objets potentiels
    console.log('\n📊 Estimation nombre d\'objets:');

    // 100.o: probablement un header + liste d'objets
    const possibleObjectSizeO = 16; // hypothèse: 4 floats (x, y, z, rotation)
    const estimatedObjectsO = Math.floor(oData.length / possibleObjectSizeO);
    console.log(`   100.o: ~${estimatedObjectsO} objets (hypothèse ${possibleObjectSizeO} bytes/objet)`);

    // 100.o2: données étendues
    const possibleObjectSizeO2 = 32; // hypothèse: 8 floats (position + rotation + scale + ???)
    const estimatedObjectsO2 = Math.floor(o2Data.length / possibleObjectSizeO2);
    console.log(`   100.o2: ~${estimatedObjectsO2} objets (hypothèse ${possibleObjectSizeO2} bytes/objet)`);

    return {
        oSize: oData.length,
        o2Size: o2Data.length,
        estimatedObjectsO,
        estimatedObjectsO2
    };
}

analyzeObjectFiles().catch(console.error);
