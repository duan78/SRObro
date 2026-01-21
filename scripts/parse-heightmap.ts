/**
 * Parser de fichiers heightmap .t de Silkroad Online
 * Format: Header "JMXVMAPT1001" + data
 */

import fs from 'fs/promises';
import path from 'path';

interface HeightmapData {
    width: number;
    height: number;
    values: number[][];
    min: number;
    max: number;
}

async function parseHeightmap(tFilePath: string): Promise<HeightmapData> {
    const data = await fs.readFile(tFilePath);

    // Vérifier le header
    const header = data.slice(0, 12).toString('ascii');
    if (header !== 'JMXVMAPT1001') {
        throw new Error(`Invalid header: ${header}`);
    }

    console.log(`   Header: ${header}`);

    // Données après le header
    const heightData = data.slice(12);

    // Deviner la taille de la grille
    // Les fichiers .t semblent être des grilles carrées
    // On va essayer différentes tailles
    const dataLength = heightData.length;

    // Essayer comme uint16 (2 bytes par valeur)
    const uint16Count = dataLength / 2;

    // Chercher une taille de grille carrée proche
    const possibleSizes = [];
    for (let size = 128; size <= 512; size += 64) {
        if (uint16Count % size === 0) {
            const otherDim = uint16Count / size;
            if (Math.abs(size - otherDim) < 64) { // Presque carré
                possibleSizes.push({ width: size, height: otherDim });
            }
        }
    }

    console.log(`   Data length: ${dataLength} bytes`);
    console.log(`   Possible grid sizes (uint16):`);
    possibleSizes.forEach(size => {
        console.log(`      ${size.width}x${size.height} = ${size.width * size.height} tiles`);
    });

    // Utiliser la première taille plausible (ou 256x256 par défaut)
    const gridSize = possibleSizes[0] || { width: 256, height: 256 };

    console.log(`   Using grid size: ${gridSize.width}x${gridSize.height}`);

    // Parser les données comme uint16
    const values: number[][] = [];
    let minValue = Infinity;
    let maxValue = -Infinity;

    for (let y = 0; y < gridSize.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < gridSize.width; x++) {
            const offset = (y * gridSize.width + x) * 2;
            if (offset + 2 <= heightData.length) {
                let value = heightData.readUInt16LE(offset);

                // 65535 (0xFFFF) semble être une valeur sentinelle
                // On le remplace par 0 pour l'instant
                if (value === 65535) {
                    value = 0;
                }

                row.push(value);
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
            }
        }
        values.push(row);
    }

    console.log(`   Min value: ${minValue}, Max value: ${maxValue}`);

    return {
        width: gridSize.width,
        height: gridSize.height,
        values,
        min: minValue,
        max: maxValue
    };
}

async function convertHeightmapToJSON(tFilePath: string, outputJsonPath: string): Promise<void> {
    console.log(`\n📄 Parsing: ${path.basename(tFilePath)}`);

    const heightmap = await parseHeightmap(tFilePath);

    // Créer l'objet JSON
    const jsonData = {
        metadata: {
            source: tFilePath,
            width: heightmap.width,
            height: heightmap.height,
            min: heightmap.min,
            max: heightmap.max
        },
        data: heightmap.values
    };

    // Écrire le JSON
    await fs.writeFile(outputJsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`   ✅ Exporté: ${outputJsonPath}`);
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Parser Heightmap .t → JSON                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Trouver tous les fichiers .t
    const { glob } = await import('glob');
    const tFiles = await glob('assets/pk2_extracted/Map/**/*.t');

    console.log(`📊 Fichiers .t trouvés: ${tFiles.length}\n`);

    if (tFiles.length === 0) {
        console.log('⚠️  Aucun fichier .t trouvé');
        return;
    }

    // Créer dossier de sortie
    const outputDir = 'assets/maps_heightmap';
    await fs.mkdir(outputDir, { recursive: true });

    // Convertir TOUS les fichiers
    const toConvert = tFiles;

    console.log(`⏳ Conversion des ${toConvert.length} fichiers...\n`);

    for (const tFile of toConvert) {
        const relativePath = path.relative('assets/pk2_extracted/Map', tFile);
        const outputPath = path.join(outputDir, relativePath.replace('.t', '.json'));
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        try {
            await convertHeightmapToJSON(tFile, outputPath);
        } catch (error: any) {
            console.error(`   ❌ Erreur: ${error.message}`);
        }
    }

    console.log('\n✅ Conversion terminée!');
    console.log(`\n📁 Dossier de sortie: ${outputDir}`);
    console.log(`📊 Fichiers convertis: ${toConvert.length}\n`);
}

main().catch(console.error);
