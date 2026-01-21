/**
 * Analyseur simplifié de fichiers BAN - Animations Silkroad Online
 *
 * Version d'exploration pour comprendre le format
 */

import fs from 'fs';
import path from 'path';

export function analyzeBANStructure(filePath: string): void {
    const data = fs.readFileSync(filePath);
    const size = data.length;

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Analyse Structurelle BAN                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log(`📄 Fichier: ${path.basename(filePath)}`);
    console.log(`📏 Taille: ${size} bytes\n`);

    // Header
    console.log('📋 Header (0x00-0x1F):');
    console.log(`   Signature: ${data.slice(0, 8).toString('ascii')}`);
    console.log(`   Version: ${data.readUInt8(8)}`);
    console.log(`   Flags: 0x${data.readUInt32LE(12).toString(16)}`);

    // Frame count
    const frameCount = data.readUInt32LE(16);
    console.log(`   Frame Count: ${frameCount}`);

    // Animation name (semble commencer à 0x14)
    let nameOffset = 20; // 0x14
    let nameEnd = nameOffset;
    while (nameEnd < size && data[nameEnd] !== 0x00) {
        nameEnd++;
    }
    const animName = data.slice(nameOffset, nameEnd).toString('ascii');
    console.log(`   Animation Name: "${animName}"`);

    console.log('\n🔍 Recherche des os:');

    // Chercher des motifs répétitifs
    const boneNames: string[] = [];
    let offset = 0x30; // Commencer après le header

    // Scanner pour trouver les noms d'os
    while (offset < Math.min(size, 0x500)) { // Limiter à 0x500 pour l'instant
        // Chercher "Bone" ou des patterns similaires
        if (data[offset] === 0x42 && offset + 4 < size) { // 'B'
            const str = data.slice(offset, Math.min(offset + 20, size)).toString('ascii', 0, 20);
            if (str.includes('Bone') || str.includes('one')) {
                // Trouver la fin du string
                let end = offset;
                while (end < size && data[end] !== 0x00) {
                    end++;
                }
                const name = data.slice(offset, end).toString('ascii');
                if (name.length > 3 && name.length < 30 && !boneNames.includes(name)) {
                    boneNames.push(name);
                }
                offset = end + 1;
                continue;
            }
        }
        offset++;
    }

    boneNames.forEach(name => {
        console.log(`   • ${name}`);
    });

    // Afficher les données de transformation si présentes
    console.log('\n📊 Données de transformation (échantillon):');

    if (boneNames.length > 0) {
        // Afficher quelques bytes après un nom d'os
        const firstBone = 'one10_LRoom';
        const searchStr = Buffer.from(firstBone);

        for (let i = 0; i < size - searchStr.length; i++) {
            let match = true;
            for (let j = 0; j < searchStr.length; j++) {
                if (data[i + j] !== searchStr[j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                console.log(`   Trouvé "${firstBone}" à l'offset 0x${i.toString(16)}`);

                // Afficher les 64 bytes suivants
                const sampleStart = i + firstBone.length + 1;
                const sampleSize = 64;

                console.log('   Bytes suivants:');
                for (let row = 0; row < 4; row++) {
                    const rowStart = sampleStart + row * 16;
                    if (rowStart + 16 <= size) {
                        const hex = Array.from({ length: 16 }, (_, k) => {
                            const byte = data[rowStart + k];
                            return byte.toString(16).padStart(2, '0').toUpperCase();
                        }).join(' ');
                        const ascii = Array.from({ length: 16 }, (_, k) => {
                            const byte = data[rowStart + k];
                            return (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                        }).join('');
                        console.log(`      ${hex}  ${ascii}`);
                    }
                }
                break;
            }
        }
    }

    // Analyser les types de données
    console.log('\n📈 Analyse des données:');
    const floatCount = Math.floor(size / 4);
    console.log(`   Nombre total de floats: ${floatCount}`);

    // Chercher des valeurs de quaternion valides (doivent être normalisées)
    let validQuatCount = 0;
    for (let i = 0; i < size - 15; i += 4) {
        const x = data.readFloatLE(i);
        const y = data.readFloatLE(i + 4);
        const z = data.readFloatLE(i + 8);
        const w = data.readFloatLE(i + 12);

        // Vérifier si c'est un quaternion valide (magnitude ≈ 1)
        const mag = Math.sqrt(x*x + y*y + z*z + w*w);
        if (mag > 0.9 && mag < 1.1) {
            validQuatCount++;
        }
    }

    console.log(`   Quaternions valides trouvés: ~${validQuatCount}`);

    console.log('\n✅ Analyse terminée !\n');
}

// Lancer l'analyse
const testFile = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban';

try {
    analyzeBANStructure(testFile);
} catch (error) {
    console.error('❌ Erreur:', error);
}
