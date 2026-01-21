/**
 * Analyse complète du format BAN - Version simplifiée
 */

import fs from 'fs';
import path from 'path';

const BAN_FILE_1 = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban';
const BAN_FILE_2 = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\nature\\ruins\\ruin_takla_edimmu1.ban';

function analyzeBAN(filePath: string) {
    const data = fs.readFileSync(filePath);
    const size = data.length;

    console.log('\n' + '='.repeat(60));
    console.log(`Fichier: ${path.basename(filePath)}`);
    console.log(`Taille: ${size} bytes`);
    console.log('='.repeat(60) + '\n');

    // Header
    console.log('HEADER:');
    console.log(`  Signature: ${data.slice(0, 8).toString('ascii')}`);
    console.log(`  Version: ${data.readUInt8(8)}`);
    console.log(`  Frame Count: ${data.readUInt32LE(16)}`);

    // Nom de l'animation
    let nameEnd = 24;
    while (nameEnd < size && data[nameEnd] !== 0) {
        nameEnd++;
    }
    const animName = data.slice(24, nameEnd).toString('ascii');
    console.log(`  Animation: "${animName}"`);

    // Table des offsets (à partir de 0x28)
    console.log('\nOFFSET TABLE:');
    const offsets = [];
    let offset = 0x28;

    while (offset < Math.min(size, 0x100)) {
        const value = data.readUInt16LE(offset);
        if (value === 0) break;

        offsets.push(value);
        console.log(`  0x${offset.toString(16).padStart(4, '0')}: 0x${value.toString(16).padStart(4, '0')}`);
        offset += 2;
    }

    // Analyse des données d'os
    console.log('\nBONE DATA:');
    console.log('  Recherche des noms d\'os...');

    const boneData = [];

    // Scanner pour trouver les noms
    for (let searchOffset = 0x30; searchOffset < Math.min(size, 0x500); searchOffset++) {
        // Vérifier si c'est le début d'un nom d'os
        if (data[searchOffset] >= 65 && data[searchOffset] <= 122) {
            // Trouver la fin du nom
            let end = searchOffset;
            while (end < size && data[end] !== 0) {
                end++;
            }

            const name = data.slice(searchOffset, end).toString('ascii');

            // Filtrer les noms valides (plus de 3 caractères, contient "Bone" ou "Bip")
            if (name.length > 3 && (name.includes('Bone') || name.includes('Bip') || name.includes('one'))) {
                // Extraire les keyframes
                const keyframes = extractKeyframes(data, end + 1, Math.floor((size - end) / 32));

                boneData.push({
                    name,
                    offset: searchOffset,
                    keyframeCount: keyframes.length
                });

                console.log(`  • "${name}" (${keyframes.length} keyframes) à 0x${searchOffset.toString(16)}`);
            }

            searchOffset = end + 1;
        }
    }

    // Analyse détaillée des keyframes pour chaque os
    console.log('\nKEYFRAME DETAILS:');
    boneData.forEach(bone => {
        if (bone.keyframeCount > 0) {
            console.log(`\n  Os: ${bone.name}`);

            const startOffset = bone.offset + bone.name.length + 5;
            const sampleCount = Math.min(3, bone.keyframeCount);

            for (let i = 0; i < sampleCount; i++) {
                const kfOffset = startOffset + (i * 32);

                if (kfOffset + 28 <= size) {
                    const frame = data.readUInt32LE(kfOffset);
                    const px = data.readFloatLE(kfOffset + 4);
                    const py = data.readFloatLE(kfOffset + 8);
                    const pz = data.readFloatLE(kfOffset + 12);
                    const qx = data.readFloatLE(kfOffset + 16);
                    const qy = data.readFloatLE(kfOffset + 20);
                    const qz = data.readFloatLE(kfOffset + 24);
                    const qw = data.readFloatLE(kfOffset + 28);

                    const qMag = Math.sqrt(qx*qx + qy*qy + qz*qz + qw*qw);

                    console.log(`    [${frame}] Pos:(${px.toFixed(2)}, ${py.toFixed(2)}, ${pz.toFixed(2)}) | Quat:(${qx.toFixed(3)}, ${qy.toFixed(3)}, ${qz.toFixed(3)}, ${qw.toFixed(3)}) |Q=${qMag.toFixed(2)}`);
                }
            }
        }
    });

    console.log(`\nTotal os analysés: ${boneData.length}`);
}

function extractKeyframes(data: Buffer, startOffset: number, maxCount: number): any[] {
    const keyframes = [];
    let offset = startOffset;

    for (let i = 0; i < maxCount && offset + 32 < data.length; i++) {
        // Essayer de lire un keyframe
        const frame = data.readUInt32LE(offset);
        const px = data.readFloatLE(offset + 4);

        // Vérifier si ce sont des données valides (pas NaN ou Infinity)
        if (isFinite(frame) && isFinite(px)) {
            keyframes.push({ frame, offset });
        }

        offset += 32; // 32 bytes par keyframe estimé
    }

    return keyframes;
}

function compareBANFiles() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Comparaison de Fichiers BAN                            ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Analyser les deux fichiers
    analyzeBAN(BAN_FILE_1);
    analyzeBAN(BAN_FILE_2);

    console.log('\n✅ Analyse terminée !\n');
}

// Lancer l'analyse
compareBANFiles();
