/**
 * Script de vérification rapide des conversions
 */

import fs from 'fs/promises';
import path from 'path';

interface HeightmapData {
    metadata: {
        width: number;
        height: number;
        min: number;
        max: number;
    };
    data: number[][];
}

interface MapObject {
    id: number;
    modelId: number;
    position: { x: number; y: number; z: number };
}

interface ObjectFile {
    objectCount: number;
    objects: MapObject[];
}

async function verifyMap(mapId: string) {
    console.log(`\n🔍 Vérification map ${mapId}...`);

    // Vérifier heightmap
    const heightmapPath = path.join('assets/maps_heightmap', mapId, `${mapId}.json`);
    try {
        const heightmapContent = await fs.readFile(heightmapPath, 'utf-8');
        const heightmap: HeightmapData = JSON.parse(heightmapContent);

        console.log(`   ✅ Heightmap: ${heightmap.metadata.width}x${heightmap.metadata.height}`);
        console.log(`      Min: ${heightmap.metadata.min}, Max: ${heightmap.metadata.max}`);

        // Compter les valeurs non-nulles
        let nonZeroCount = 0;
        for (let y = 0; y < heightmap.metadata.height; y++) {
            for (let x = 0; x < heightmap.metadata.width; x++) {
                if (heightmap.data[y][x] > 0) nonZeroCount++;
            }
        }
        console.log(`      Points non-nuls: ${nonZeroCount}/${heightmap.metadata.width * heightmap.metadata.height} (${(nonZeroCount / (heightmap.metadata.width * heightmap.metadata.height) * 100).toFixed(1)}%)`);

    } catch (error: any) {
        console.log(`   ❌ Heightmap: ${error.message}`);
        return false;
    }

    // Vérifier objets .o
    const oObjectPath = path.join('assets/maps_objects', mapId, `${mapId}.o.json`);
    try {
        const oObjectContent = await fs.readFile(oObjectPath, 'utf-8');
        const oObjects: ObjectFile = JSON.parse(oObjectContent);
        console.log(`   ✅ Objets .o: ${oObjects.objectCount}`);
    } catch (error) {
        console.log(`   ℹ️  Pas de fichier .o`);
    }

    // Vérifier objets .o2
    const o2ObjectPath = path.join('assets/maps_objects', mapId, `${mapId}.o2.json`);
    try {
        const o2ObjectContent = await fs.readFile(o2ObjectPath, 'utf-8');
        const o2Objects: ObjectFile = JSON.parse(o2ObjectContent);
        console.log(`   ✅ Objets .o2: ${o2Objects.objectCount}`);

        // Afficher quelques positions d'objets
        if (o2Objects.objectCount > 0) {
            console.log(`      Exemple positions:`);
            for (const obj of o2Objects.objects.slice(0, 3)) {
                console.log(`         ${obj.modelId}: (${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
            }
        }
    } catch (error) {
        console.log(`   ℹ️  Pas de fichier .o2`);
    }

    return true;
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Vérification des Conversions de Maps                 ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

    const mapIds = ['100', '101', '102', '68'];

    for (const mapId of mapIds) {
        await verifyMap(mapId);
    }

    // Stats globales
    console.log('\n📊 Statistiques globales:');

    const heightmapDirs = await fs.readdir('assets/maps_heightmap');
    console.log(`   Maps heightmap: ${heightmapDirs.length}`);

    const objectDirs = await fs.readdir('assets/maps_objects');
    console.log(`   Maps objets: ${objectDirs.length}`);

    console.log('\n✅ Vérification terminée!');
}

main().catch(console.error);
