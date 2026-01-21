/**
 * Script d'extraction des PK2 restants
 * - Music.pk2 (69 MB) - Audio files
 * - Particles.pk2 (168 MB) - Particle effects
 * - Map.pk2 (1.3 GB) - Map data, textures, geometry
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

// Configuration
const PK2_MATE = path.join(process.cwd(), 'tools/veykril-pk2/target/release/pk2_mate.exe');
const SOURCE_DIR = 'C:/Program Files (x86)/Silkroad';
const OUTPUT_BASE = path.join(process.cwd(), 'assets/pk2_extracted');

// Fichiers PK2 à extraire
const PK2_FILES = [
    { name: 'Music.pk2', size: '69 MB', expected: 'audio' },
    { name: 'Particles.pk2', size: '168 MB', expected: 'particles' },
    { name: 'Map.pk2', size: '1.3 GB', expected: 'maps' },
];

async function extractPK2(pk2File: string, outputPath: string): Promise<boolean> {
    const archivePath = path.join(SOURCE_DIR, pk2File);

    console.log(`\n📦 Extraction de ${pk2File}...`);
    console.log(`   Source: ${archivePath}`);
    console.log(`   Destination: ${outputPath}`);

    try {
        const command = `"${PK2_MATE}" extract --archive "${archivePath}" --out "${outputPath}" --write-time`;

        const { stdout, stderr } = await execAsync(command, {
            timeout: 600000, // 10 minutes timeout
            maxBuffer: 10 * 1024 * 1024, // 10 MB buffer
        });

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        console.log(`✅ ${pk2File} extrait avec succès!`);
        return true;

    } catch (error: any) {
        console.error(`❌ Erreur lors de l'extraction de ${pk2File}:`, error.message);
        return false;
    }
}

async function analyzeExtraction(outputPath: string, expectedType: string): Promise<void> {
    console.log(`\n🔍 Analyse du contenu (${expectedType})...`);

    try {
        // Lister les fichiers extraits
        const { stdout } = await execAsync(`Get-ChildItem -Path "${outputPath}" -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count`, {
            shell: 'powershell.exe',
        });

        const fileCount = parseInt(stdout.trim()) || 0;
        console.log(`   📁 Fichiers extraits: ${fileCount}`);

        // Lister les extensions
        const { stdout: extOutput } = await execAsync(`Get-ChildItem -Path "${outputPath}" -Recurse -File | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 10 | Format-Table -HideTableHeaders`, {
            shell: 'powershell.exe',
        });

        if (extOutput.trim()) {
            console.log(`   📋 Extensions les plus courantes:`);
            console.log(extOutput.split('\n').map(l => '      ' + l).join('\n'));
        }

    } catch (error: any) {
        console.log(`   ⚠️  Impossible d'analyser le contenu: ${error.message}`);
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Extraction des PK2 Restants                           ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log('📋 Fichiers à extraire:');
    PK2_FILES.forEach(pk2 => {
        console.log(`   • ${pk2.name.padEnd(20)} (${pk2.size}) - ${pk2.expected}`);
    });
    console.log('');

    // Créer dossier de sortie
    await fs.mkdir(OUTPUT_BASE, { recursive: true });

    // Extraire chaque PK2
    for (const pk2 of PK2_FILES) {
        const outputPath = path.join(OUTPUT_BASE, pk2.name.replace('.pk2', ''));

        const success = await extractPK2(pk2.name, outputPath);

        if (success) {
            await analyzeExtraction(outputPath, pk2.expected);
        }
    }

    // Rapport final
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport d\'Extraction                                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log(`📁 Dossier de sortie: ${OUTPUT_BASE}`);
    console.log('');
    console.log('📋 PK2 extraits:');
    for (const pk2 of PK2_FILES) {
        const outputPath = path.join(OUTPUT_BASE, pk2.name.replace('.pk2', ''));
        const exists = await fs.access(outputPath).then(() => true).catch(() => false);
        console.log(`   ${exists ? '✅' : '❌'} ${pk2.name}`);
    }

    console.log('\n🎉 Extraction terminée!');
}

main().catch(console.error);
