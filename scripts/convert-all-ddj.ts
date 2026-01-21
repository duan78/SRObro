/**
 * Script de conversion COMPLET de tous les fichiers DDJ vers WebP
 * Couvre: Media.pk2, Particles.pk2, Map.pk2, data_extracted
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

// Toutes les sources DDJ à convertir
const DDJ_SOURCES = [
    {
        name: 'Media.pk2 (main)',
        pattern: 'assets/pk2_media/**/*.ddj',
        outputDir: 'assets/media_ddj_webp',
        count: 26290
    },
    {
        name: 'Particles.pk2',
        pattern: 'assets/pk2_extracted/Particles/**/*.ddj',
        outputDir: 'assets/particles_ddj_webp',
        count: 1000
    },
    {
        name: 'Map.pk2',
        pattern: 'assets/pk2_extracted/Map/**/*.ddj',
        outputDir: 'assets/maps_ddj_webp',
        count: 839
    },
    {
        name: 'data_extracted (dup?)',
        pattern: 'assets/data_extracted/**/*.ddj',
        outputDir: 'assets/data_ddj_webp',
        count: 10699
    },
];

async function findConvertedDDJ(outputDir: string): Promise<Set<string>> {
    try {
        const webpFiles = await glob(`${outputDir}/**/*.webp`);
        const converted = new Set<string>();

        for (const webpFile of webpFiles) {
            // Retrouver le nom original du fichier DDJ
            const relativePath = path.relative(outputDir, webpFile);
            const ddjName = relativePath.replace('.webp', '.ddj');
            converted.add(ddjName);
        }

        return converted;
    } catch {
        return new Set();
    }
}

async function convertDDJToWebP(ddjPath: string, outputPath: string): Promise<boolean> {
    try {
        const pythonScript = `
import sys
import os
from PIL import Image
from io import BytesIO

try:
    with open(r'${ddjPath}', 'rb') as f:
        ddj_data = f.read()

    # Check DDJ signature
    if not ddj_data.startswith(b'JMXVDDJ '):
        sys.exit(1)

    # Skip 20-byte DDJ header
    dds_data = ddj_data[20:]

    # Check DDS signature
    if dds_data[:4] != b'DDS ':
        sys.exit(1)

    # Open with Pillow
    img = Image.open(BytesIO(dds_data))

    # Convert to RGB if needed
    if img.mode not in ('RGB', 'L'):
        img = img.convert('RGB')

    # Save as WebP
    img.save(r'${outputPath}', 'WebP', quality=85, method=6)
    sys.exit(0)

except Exception:
    sys.exit(1)
`;

        const { stdout, stderr } = await execAsync(`python -c "${pythonScript}"`, {
            timeout: 30000,
            maxBuffer: 10 * 1024 * 1024
        });

        return true;

    } catch (error: any) {
        return false;
    }
}

async function convertDDJSource(source: typeof DDJ_SOURCES[0]): Promise<void> {
    console.log(`\n📁 ${source.name}`);
    console.log(`   Pattern: ${source.pattern}`);
    console.log(`   Output: ${source.outputDir}`);

    // Trouver tous les fichiers DDJ
    const ddjFiles = await glob(source.pattern);
    console.log(`   📊 Fichiers DDJ trouvés: ${ddjFiles.length}`);

    if (ddjFiles.length === 0) {
        console.log('   ⚠️  Aucun fichier DDJ trouvé');
        return;
    }

    // Créer dossier de sortie
    await fs.mkdir(source.outputDir, { recursive: true });

    // Trouver les fichiers déjà convertis
    const converted = await findConvertedDDJ(source.outputDir);
    console.log(`   ✅ Déjà convertis: ${converted.size}`);

    // Filtrer les fichiers à convertir
    const toConvert = ddjFiles.filter(ddjPath => {
        const relativePath = path.relative(
            source.pattern.replace('/**/*.ddj', ''),
            ddjPath
        );
        return !converted.has(relativePath);
    });

    console.log(`   ⏳ À convertir: ${toConvert.length}`);

    if (toConvert.length === 0) {
        console.log('   ✅ Tous les fichiers sont déjà convertis!');
        return;
    }

    // Convertir par lots de 100
    let successCount = 0;
    let failCount = 0;
    const batchSize = 100;

    for (let i = 0; i < toConvert.length; i += batchSize) {
        const batch = toConvert.slice(i, Math.min(i + batchSize, toConvert.length));
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(toConvert.length / batchSize);

        console.log(`\n   🔄 Batch ${batchNum}/${totalBatches} (${batch.length} fichiers)`);

        for (const ddjPath of batch) {
            const relativePath = path.relative(
                source.pattern.replace('/**/*.ddj', ''),
                ddjPath
            );
            const outputPath = path.join(source.outputDir, relativePath.replace('.ddj', '.webp'));

            // Créer dossier de sortie si nécessaire
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Convertir
            const success = await convertDDJToWebP(ddjPath, outputPath);

            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            // Progression
            const current = i + batch.indexOf(ddjPath) + 1;
            const progress = (current / toConvert.length * 100).toFixed(1);
            process.stdout.write(`\r   [${current}/${toConvert.length}] (${progress}%) ✅${successCount} ❌${failCount}`);
        }

        console.log('');
    }

    console.log(`\n   ✅ Conversion terminée: ${successCount} succès, ${failCount} échecs`);
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion Complète DDJ → WebP                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log('📋 Sources à convertir:');
    let totalCount = 0;
    DDJ_SOURCES.forEach(source => {
        console.log(`   • ${source.name.padEnd(30)} ${source.count.toLocaleString()} fichiers`);
        totalCount += source.count;
    });
    console.log(`\n   Total: ${totalCount.toLocaleString()} fichiers DDJ\n`);

    // Vérifier combien de WebP existent déjà
    console.log('📊 Fichiers WebP existants:');
    let totalConverted = 0;
    for (const source of DDJ_SOURCES) {
        try {
            const webpFiles = await glob(`${source.outputDir}/**/*.webp`);
            console.log(`   • ${source.name.padEnd(30)} ${webpFiles.length.toLocaleString()} WebP`);
            totalConverted += webpFiles.length;
        } catch {
            console.log(`   • ${source.name.padEnd(30)} 0 WebP`);
        }
    }
    console.log(`\n   Total: ${totalConverted.toLocaleString()} WebP (${(totalConverted/totalCount*100).toFixed(1)}%)\n`);

    console.log('⏳ Conversion en cours...\n');

    // Convertir chaque source
    for (const source of DDJ_SOURCES) {
        await convertDDJSource(source);
    }

    // Rapport final
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport Final                                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    let finalTotal = 0;
    for (const source of DDJ_SOURCES) {
        const webpFiles = await glob(`${source.outputDir}/**/*.webp`);
        console.log(`✅ ${source.name}: ${webpFiles.length}/${source.count} (${(webpFiles.length/source.count*100).toFixed(1)}%)`);
        finalTotal += webpFiles.length;
    }

    console.log(`\n🎉 Total: ${finalTotal.toLocaleString()}/${totalCount.toLocaleString()} (${(finalTotal/totalCount*100).toFixed(1)}%)`);
    console.log('\n✅ Conversion DDJ → WebP terminée!');
}

main().catch(console.error);
