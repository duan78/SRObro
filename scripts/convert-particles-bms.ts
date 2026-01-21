/**
 * Conversion des modèles BMS de Particles.pk2 vers GLB
 * Utilise le script Blender existant
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

const BLENDER_IMPORTER = path.join(process.cwd(), 'tools/silkroad-blender-importer.py');
const OUTPUT_DIR = 'assets/particles_glb';

async function convertBMStoGLB(bmsPath: string): Promise<boolean> {
    const relativePath = path.relative(process.cwd(), bmsPath);
    const outputPath = relativePath
        .replace('pk2_extracted/Particles', 'particles_glb')
        .replace('.bms', '.glb');

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const blenderScript = `
import bpy
import sys
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import BMS
sys.path.append('${path.dirname(BLENDER_IMPORTER)}')
from silkroad_blender_importer import import_bms

try:
    result = import_bms('${bmsPath}')

    if result and len(result) > 0:
        # Select all imported objects
        bpy.ops.object.select_all(action='SELECT')

        # Export to GLB
        bpy.ops.export_scene.gltf(
            filepath='${outputPath}',
            export_format='GLB',
            export_selected=True,
            export_texcoords=True,
            export_normals=True,
            export_tangents=True,
            export_skins=True,
        )

        print('SUCCESS')
    else:
        print('NO_OBJECTS')
except Exception as e:
    print(f'ERROR: {e}')
`;

    try {
        const scriptPath = `/tmp/blender-bms-${Date.now()}.py`;
        await fs.writeFile(scriptPath, blenderScript);

        const { stdout, stderr } = await execAsync(
            `blender -b -P ${scriptPath} 2>&1`,
            { timeout: 60000 }
        );

        // Check for SUCCESS in output
        if (stdout.includes('SUCCESS')) {
            return true;
        } else if (stdout.includes('NO_OBJECTS')) {
            return false; // No objects in file
        } else {
            console.error(`Blender output:`, stdout);
            return false;
        }

    } catch (error: any) {
        console.error(`Error converting ${bmsPath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion BMS → GLB (Particles.pk2)                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Trouver tous les fichiers BMS
    const bmsFiles = await glob('assets/pk2_extracted/Particles/**/*.bms');

    console.log(`📊 Fichiers BMS trouvés: ${bmsFiles.length}\n`);

    if (bmsFiles.length === 0) {
        console.log('⚠️  Aucun fichier BMS trouvé');
        return;
    }

    // Créer dossier de sortie
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Vérifier les fichiers déjà convertis
    const existingGLB = await glob(`${OUTPUT_DIR}/**/*.glb`);
    console.log(`✅ Déjà convertis: ${existingGLB.length}`);

    // Filtrer les fichiers à convertir
    const toConvert = bmsFiles.filter(bmsPath => {
        const basename = path.basename(bmsPath, '.bms');
        return !existingGLB.some(glb => glb.includes(basename));
    });

    console.log(`⏳ À convertir: ${toConvert.length}\n`);

    if (toConvert.length === 0) {
        console.log('✅ Tous les fichiers BMS sont déjà convertis!');
        return;
    }

    // Convertir
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < toConvert.length; i++) {
        const bmsPath = toConvert[i];
        const basename = path.basename(bmsPath);
        const progress = `(${i + 1}/${toConvert.length})`;

        process.stdout.write(`\r🔄 ${progress} Converting: ${basename.padEnd(40)} ✅${successCount} ❌${failCount}`);

        const success = await convertBMStoGLB(bmsPath);

        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log('\n');

    // Rapport final
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport de Conversion                                 ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const finalGLB = await glob(`${OUTPUT_DIR}/**/*.glb`);
    console.log(`✅ Succès: ${successCount}/${toConvert.length}`);
    console.log(`❌ Échecs: ${failCount}/${toConvert.length}`);
    console.log(`📁 Total GLB: ${finalGLB.length}/${bmsFiles.length} (${(finalGLB.length/bmsFiles.length*100).toFixed(1)}%)`);
    console.log(`\n📁 Dossier de sortie: ${OUTPUT_DIR}`);
}

main().catch(console.error);
