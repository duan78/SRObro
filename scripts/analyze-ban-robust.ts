/**
 * Analyseur BAN robust - Trouve correctement les noms et keyframes
 */

import fs from 'fs';
import path from 'path';

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

    // Trouver les noms d'os de manière robuste
    console.log('\nBONE DATA (Recherche robuste):');
    const bones = [];

    // Scanner pour trouver des strings qui ressemblent à des noms d'os
    for (let offset = 0x30; offset < Math.min(size, 0x1000); offset++) {
        // Chercher un début de string valide (lettre majuscule ou minuscule)
        const firstChar = data[offset];
        if (!((firstChar >= 65 && firstChar <= 90) || (firstChar >= 97 && firstChar <= 122))) {
            continue;
        }

        // Extraire la string jusqu'à null ou caractère invalide
        let end = offset;
        let hasInvalidChar = false;

        while (end < size && data[end] !== 0) {
            const byte = data[end];
            if (!((byte >= 65 && byte <= 90) ||
                  (byte >= 97 && byte <= 122) ||
                  (byte >= 48 && byte <= 57) ||  // chiffres
                  (byte === 95) ||                // underscore
                  (byte === 8))) {                // backspace
                hasInvalidChar = true;
                break;
            }
            end++;
        }

        const name = data.slice(offset, end).toString('ascii').replace(/\x08/g, ''); // Enlever backspaces

        // Filtrer: doit contenir "Bone" ou "Bip" ou "one", et avoir > 3 caractères
        if (name.length > 3 && (name.includes('Bone') || name.includes('Bip') || name.includes('one'))) {
            // Déjà trouvé?
            if (bones.find(b => b.name === name)) {
                offset = end;
                continue;
            }

            console.log(`\n  Os: "${name}" à 0x${offset.toString(16)}`);

            // Chercher les keyframes après le nom
            // On cherche des patterns qui ressemblent à des keyframes valides
            const keyframes = findKeyframesAfter(data, end);

            if (keyframes.length > 0) {
                bones.push({ name, offset, keyframes });
                console.log(`    ✓ ${keyframes.length} keyframes trouvées`);

                // Afficher les 3 premières
                keyframes.slice(0, 3).forEach(kf => {
                    console.log(`      [${kf.frame}] Pos:(${kf.px.toFixed(2)}, ${kf.py.toFixed(2)}, ${kf.pz.toFixed(2)}) Quat:(${kf.qx.toFixed(3)}, ${kf.qy.toFixed(3)}, ${kf.qz.toFixed(3)}, ${kf.qw.toFixed(3)})`);
                });
            }

            offset = end;
        } else {
            offset++;
        }
    }

    console.log(`\nTotal os trouvés: ${bones.length}`);
    return bones;
}

function findKeyframesAfter(data: Buffer, startOffset: number): any[] {
    const keyframes = [];
    const maxToScan = Math.min(5000, (data.length - startOffset) / 32); // Max 5000 keyframes

    for (let i = 0; i < maxToScan; i++) {
        const offset = startOffset + (i * 32);

        if (offset + 32 > data.length) break;

        const frame = data.readUInt32LE(offset);
        const px = data.readFloatLE(offset + 4);
        const py = data.readFloatLE(offset + 8);
        const pz = data.readFloatLE(offset + 12);
        const qx = data.readFloatLE(offset + 16);
        const qy = data.readFloatLE(offset + 20);
        const qz = data.readFloatLE(offset + 24);
        const qw = data.readFloatLE(offset + 28);

        // Validation plus stricte
        const quatMag = Math.sqrt(qx*qx + qy*qy + qz*qz + qw*qw);
        const validFrame = frame >= 0 && frame < 10000 && Number.isInteger(frame);
        const validPos = Math.abs(px) < 10000 && Math.abs(py) < 10000 && Math.abs(pz) < 10000;
        const validQuat = quatMag > 0.5 && quatMag < 2.0;

        if (validFrame && validPos && validQuat) {
            keyframes.push({ frame, px, py, pz, qx, qy, qz, qw });

            // Arrêter si on trouve trop d'invalides (fin des keyframes)
            if (keyframes.length > 10) {
                break; // On a trouvé suffisamment de keyframes valides
            }
        } else if (keyframes.length > 0) {
            // On a déjà trouvé des keyframes, mais celle-ci est invalide
            // C'est peut-être la fin
            break;
        }
    }

    return keyframes;
}

// Test
const BAN_FILE_1 = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban';
const BAN_FILE_2 = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\nature\\ruins\\ruin_takla_edimmu1.ban';

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║     Analyseur BAN Robust                                  ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

analyzeBAN(BAN_FILE_1);
analyzeBAN(BAN_FILE_2);

console.log('\n✅ Analyse terminée!\n');
