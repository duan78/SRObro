/**
 * Conversion complète de tous les fichiers .o/.o2 vers JSON
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

interface MapObject {
    id: number;
    modelId: number;
    position: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
}

interface ObjectFile {
    header: string;
    objectCount: number;
    objects: MapObject[];
}

async function parseObjectFile(filePath: string): Promise<ObjectFile> {
    const data = await fs.readFile(filePath);

    // Header (JMXVMAPO1001)
    const header = data.slice(0, 15).toString('ascii');
    if (!header.startsWith('JMXVMAPO')) {
        throw new Error(`Invalid header: ${header}`);
    }

    let offset = 16;
    const objects: MapObject[] = [];

    while (offset + 16 <= data.length) {
        const modelId = data.readUInt32LE(offset);
        const x = data.readFloatLE(offset + 4);
        const y = data.readFloatLE(offset + 8);
        const z = data.readFloatLE(offset + 12);

        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
            break;
        }

        if (modelId === 0 && x === 0 && y === 0 && z === 0) {
            break;
        }

        if (Math.abs(x) > 100000 || Math.abs(y) > 100000 || Math.abs(z) > 100000) {
            offset += 16;
            continue;
        }

        objects.push({
            id: objects.length,
            modelId,
            position: { x, y, z }
        });

        offset += 16;
    }

    return { header, objectCount: objects.length, objects };
}

async function parseObjectFileExtended(filePath: string): Promise<ObjectFile> {
    const data = await fs.readFile(filePath);

    const header = data.slice(0, 15).toString('ascii');
    if (!header.startsWith('JMXVMAPO')) {
        throw new Error(`Invalid header: ${header}`);
    }

    let offset = 16;
    const objects: MapObject[] = [];

    while (offset + 32 <= data.length) {
        const modelId = data.readUInt32LE(offset);
        const x = data.readFloatLE(offset + 4);
        const y = data.readFloatLE(offset + 8);
        const z = data.readFloatLE(offset + 12);
        const rotX = data.readFloatLE(offset + 16);
        const rotY = data.readFloatLE(offset + 20);
        const rotZ = data.readFloatLE(offset + 24);
        const scaleX = data.readFloatLE(offset + 28);

        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
            break;
        }

        if (modelId === 0 && x === 0 && y === 0 && z === 0) {
            break;
        }

        if (Math.abs(x) > 100000 || Math.abs(y) > 100000 || Math.abs(z) > 100000) {
            offset += 32;
            continue;
        }

        objects.push({
            id: objects.length,
            modelId,
            position: { x, y, z },
            rotation: { x: rotX, y: rotY, z: rotZ },
            scale: { x: scaleX, y: scaleX, z: scaleX }
        });

        offset += 32;
    }

    return { header, objectCount: objects.length, objects };
}

async function convertAllObjectFiles() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion Complète .o/.o2 → JSON                       ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const oFiles = await glob('assets/pk2_extracted/Map/**/*.o');
    const o2Files = await glob('assets/pk2_extracted/Map/**/*.o2');

    console.log(`📊 Fichiers .o: ${oFiles.length}`);
    console.log(`📊 Fichiers .o2: ${o2Files.length}`);
    console.log(`📊 Total: ${oFiles.length + o2Files.length} fichiers\n`);

    const outputDir = 'assets/maps_objects';
    await fs.mkdir(outputDir, { recursive: true });

    // Convertir tous les fichiers .o
    console.log('🔄 Conversion fichiers .o...\n');
    let successO = 0;
    let failO = 0;
    let totalObjectsO = 0;

    for (let i = 0; i < oFiles.length; i++) {
        const oFile = oFiles[i];
        const relativePath = path.relative('assets/pk2_extracted/Map', oFile);
        const outputPath = path.join(outputDir, relativePath + '.json');

        try {
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            const result = await parseObjectFile(oFile);
            await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
            successO++;
            totalObjectsO += result.objectCount;

            if ((i + 1) % 500 === 0) {
                console.log(`   Progression: ${i + 1}/${oFiles.length} (${((i + 1) / oFiles.length * 100).toFixed(1)}%)`);
            }
        } catch (error: any) {
            failO++;
        }
    }

    console.log(`\n✅ .o: ${successO}/${oFiles.length} (${(successO / oFiles.length * 100).toFixed(1)}%)`);
    console.log(`   Total objets: ${totalObjectsO}\n`);

    // Convertir tous les fichiers .o2
    console.log('🔄 Conversion fichiers .o2...\n');
    let successO2 = 0;
    let failO2 = 0;
    let totalObjectsO2 = 0;

    for (let i = 0; i < o2Files.length; i++) {
        const o2File = o2Files[i];
        const relativePath = path.relative('assets/pk2_extracted/Map', o2File);
        const outputPath = path.join(outputDir, relativePath + '.json');

        try {
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            const result = await parseObjectFileExtended(o2File);
            await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
            successO2++;
            totalObjectsO2 += result.objectCount;

            if ((i + 1) % 500 === 0) {
                console.log(`   Progression: ${i + 1}/${o2Files.length} (${((i + 1) / o2Files.length * 100).toFixed(1)}%)`);
            }
        } catch (error: any) {
            failO2++;
        }
    }

    console.log(`\n✅ .o2: ${successO2}/${o2Files.length} (${(successO2 / o2Files.length * 100).toFixed(1)}%)`);
    console.log(`   Total objets: ${totalObjectsO2}\n`);

    // Rapport final
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport Final                                           ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const totalSuccess = successO + successO2;
    const totalFiles = oFiles.length + o2Files.length;
    const totalObjets = totalObjectsO + totalObjectsO2;

    console.log(`✅ Conversions réussies : ${totalSuccess}/${totalFiles} (${(totalSuccess / totalFiles * 100).toFixed(1)}%)`);
    console.log(`❌ Échecs             : ${(failO + failO2)}/${totalFiles}`);
    console.log(`📊 Total objets       : ${totalObjets}`);
    console.log(`   - Fichiers .o      : ${totalObjectsO}`);
    console.log(`   - Fichiers .o2     : ${totalObjectsO2}`);
    console.log(`\n📁 Dossier de sortie: ${outputDir}\n`);
}

convertAllObjectFiles().catch(console.error);
