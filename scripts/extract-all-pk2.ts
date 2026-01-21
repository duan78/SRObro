/**
 * Extraction rapide des PK2 Silkroad
 * Utilise l'outil Rust veykril-pk2 pour une extraction maximale
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const SILKROAD_DIR = 'C:\\Program Files (x86)\\Silkroad';
const OUTPUT_DIR = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\pk2_media';

// Fichiers PK2 à extraire par ordre de priorité
const PK2_FILES = [
    { name: 'Media.pk2', priority: 1, description: 'Modèles 3D, textures, animations' },
    { name: 'Data.pk2', priority: 2, description: 'Données du jeu' },
    { name: 'Map.pk2', priority: 3, description: 'Cartes' },
];

async function extractPK2(pk2Name: string, outputDir: string): Promise<boolean> {
    const pk2Path = path.join(SILKROAD_DIR, pk2Name);

    console.log(`\n📦 Extraction de ${pk2Name}...`);
    console.log(`   Source: ${pk2Path}`);
    console.log(`   Target: ${outputDir}`);

    if (!fs.existsSync(pk2Path)) {
        console.log(`   ❌ Fichier non trouvé: ${pk2Path}`);
        return false;
    }

    // Créer le dossier de sortie
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        // Utiliser l'outil Rust veykril-pk2
        const toolPath = 'C:\\Users\\duan7\\Desktop\\SRObro\\tools\\veykril-pk2\\target\\release\\pk2_extract.exe';

        const command = `"${toolPath}" "${pk2Path}" "${outputDir}"`;

        console.log(`   ⏳ Extraction en cours...`);
        const { stdout, stderr } = await execAsync(command, {
            cwd: 'C:\\Users\\duan7\\Desktop\\SRObro\\tools\\veykril-pk2',
            timeout: 600000 // 10 minutes
        });

        console.log(`   ✅ Extraction terminée !`);

        // Compter les fichiers extraits
        const { execSync } = require('child_process');
        try {
            const fileCount = execSync(`dir /s /b "${outputDir}" 2>nul | find /c /v ""`).toString().trim();
            console.log(`   📊 ${fileCount} fichiers extraits`);
        } catch {
            console.log(`   📊 Extraction terminée`);
        }

        return true;
    } catch (error: any) {
        console.log(`   ❌ Erreur: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     SRObro - Extraction PK2 Rapide                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log('📁 Source: ' + SILKROAD_DIR);
    console.log('📁 Target: ' + OUTPUT_DIR);
    console.log('');

    for (const pk2 of PK2_FILES) {
        const outputDir = path.join(OUTPUT_DIR, pk2.name.replace('.pk2', ''));
        const success = await extractPK2(pk2.name, outputDir);

        if (success) {
            console.log(`\n✅ ${pk2.name} extrait avec succès (${pk2.description})`);
        } else {
            console.log(`\n❌ Échec de l'extraction de ${pk2.name}`);
        }
    }

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Extraction terminée !                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Lancer l'analyse des fichiers extraits
    console.log('📊 Analyse des fichiers extraits...\n');

    try {
        // Compter les types de fichiers
        const { execSync } = require('child_process');

        let bmsCount = 0, bskCount = 0, ddjCount = 0;

        try {
            bmsCount = parseInt(execSync(`dir /s /b "${OUTPUT_DIR}\\*.bms" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch {}
        try {
            bskCount = parseInt(execSync(`dir /s /b "${OUTPUT_DIR}\\*.bsk" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch {}
        try {
            ddjCount = parseInt(execSync(`dir /s /b "${OUTPUT_DIR}\\*.ddj" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch {}

        console.log(`  📐 BMS (Modèles):    ${bmsCount.toLocaleString()}`);
        console.log(`  🦴 BSK (Squelettes): ${bskCount.toLocaleString()}`);
        console.log(`  🎨 DDJ (Textures):   ${ddjCount.toLocaleString()}`);
        console.log('');

        // Estimer le temps de conversion
        const totalToConvert = bmsCount;
        const filesPerMinute = 200;
        const hoursNeeded = (totalToConvert / filesPerMinute / 60).toFixed(1);

        console.log(`  ⏱️  Temps de conversion estimé: ${hoursNeeded} heures`);
        console.log('');

    } catch (error) {
        console.log('   Impossible d\'analyser les fichiers extraits');
    }
}

main().catch(console.error);
