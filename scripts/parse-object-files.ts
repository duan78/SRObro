/**
 * Parser de fichiers .o et .o2 (Object Placement)
 * Format: Header "JMXMAPO1001" + données objets
 */

import fs from 'fs/promises';
import { glob } from 'glob';
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

    // Header (JMXVMAPO1001 avec V)
    const header = data.slice(0, 15).toString('ascii');
    if (!header.startsWith('JMXVMAPO')) {
        throw new Error(`Invalid header: ${header}`);
    }

    // Skip padding (jusqu'à l'offset 16)
    let offset = 16;

    // Lire les objets
    const objects: MapObject[] = [];

    while (offset + 16 <= data.length) {
        // Essayer de lire un objet (16 bytes minimum)
        const modelId = data.readUInt32LE(offset);
        const x = data.readFloatLE(offset + 4);
        const y = data.readFloatLE(offset + 8);
        const z = data.readFloatLE(offset + 12);

        // Vérifier si les valeurs sont valides
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
            break;
        }

        // Si toutes les valeurs sont 0, on a probablement fini
        if (modelId === 0 && x === 0 && y === 0 && z === 0) {
            break;
        }

        // Ignorer les valeurs extrêmes (probablement des erreurs de lecture)
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

    return {
        header,
        objectCount: objects.length,
        objects
    };
}

async function parseObjectFileExtended(filePath: string): Promise<ObjectFile> {
    const data = await fs.readFile(filePath);

    // Header (JMXVMAPO1001 avec V)
    const header = data.slice(0, 15).toString('ascii');
    if (!header.startsWith('JMXVMAPO')) {
        throw new Error(`Invalid header: ${header}`);
    }

    // Skip padding
    let offset = 16;

    // Lire les objets étendus
    const objects: MapObject[] = [];

    while (offset + 32 <= data.length) {
        // Format étendu: 32 bytes par objet
        const modelId = data.readUInt32LE(offset);
        const x = data.readFloatLE(offset + 4);
        const y = data.readFloatLE(offset + 8);
        const z = data.readFloatLE(offset + 12);
        const rotX = data.readFloatLE(offset + 16);
        const rotY = data.readFloatLE(offset + 20);
        const rotZ = data.readFloatLE(offset + 24);
        const scaleX = data.readFloatLE(offset + 28);

        // Vérifier validité
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

    return {
        header,
        objectCount: objects.length,
        objects
    };
}

async function convertAllObjectFiles() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion .o/.o2 → JSON                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Trouver tous les fichiers .o
    const oFiles = await glob('assets/pk2_extracted/Map/**/*.o');
    console.log(`📊 Fichiers .o trouvés: ${oFiles.length}`);

    const o2Files = await glob('assets/pk2_extracted/Map/**/*.o2');
    console.log(`📊 Fichiers .o2 trouvés: ${o2Files.length}\n`);

    // Analyser quelques fichiers pour test
    const testCount = 10;
    console.log(`🔍 Analyse des ${testCount} premiers fichiers...\n`);

    let totalObjects = 0;

    for (let i = 0; i < Math.min(testCount, oFiles.length); i++) {
        const oFile = oFiles[i];
        try {
            const result = await parseObjectFile(oFile);
            console.log(`✅ ${path.basename(oFile)}: ${result.objectCount} objets`);
            totalObjects += result.objectCount;
        } catch (error: any) {
            console.log(`❌ ${path.basename(oFile)}: ${error.message}`);
        }
    }

    console.log(`\n📊 Total objets (échantillon): ${totalObjects}`);
    console.log(`   Moyenne par fichier: ${(totalObjects / testCount).toFixed(1)} objets\n`);

    // Convertir un fichier test en JSON
    console.log('📄 Conversion test fichier 100.o → JSON...');

    try {
        const result = await parseObjectFile('assets/pk2_extracted/Map/100/100.o');

        const outputPath = 'assets/maps_objects/100/100.o.json';
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

        console.log(`✅ Exporté: ${outputPath}`);
        console.log(`   Objets: ${result.objectCount}`);

        if (result.objects.length > 0) {
            console.log('\n   Exemples d\'objets:');
            result.objects.slice(0, 5).forEach(obj => {
                console.log(`      ID ${obj.id}: Model ${obj.modelId} @ (${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
            });
        }

    } catch (error: any) {
        console.error(`❌ Erreur: ${error.message}`);
    }

    // Convertir un fichier .o2 test
    console.log('\n📄 Conversion test fichier 100.o2 → JSON...');

    try {
        const result = await parseObjectFileExtended('assets/pk2_extracted/Map/100/100.o2');

        const outputPath = 'assets/maps_objects/100/100.o2.json';
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

        console.log(`✅ Exporté: ${outputPath}`);
        console.log(`   Objets: ${result.objectCount}`);

        if (result.objects.length > 0) {
            console.log('\n   Exemples d\'objets:');
            result.objects.slice(0, 5).forEach(obj => {
                console.log(`      ID ${obj.id}: Model ${obj.modelId}`);
                console.log(`         Position: (${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
                console.log(`         Rotation: (${obj.rotation?.x.toFixed(2)}, ${obj.rotation?.y.toFixed(2)}, ${obj.rotation?.z.toFixed(2)})`);
                console.log(`         Scale: ${obj.scale?.x.toFixed(2)}`);
            });
        }

    } catch (error: any) {
        console.error(`❌ Erreur: ${error.message}`);
    }

    console.log('\n💡 Pour convertir TOUS les fichiers, décommenter la boucle complète dans le code.\n');
}

convertAllObjectFiles().catch(console.error);
