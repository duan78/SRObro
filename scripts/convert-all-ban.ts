/**
 * Script de conversion batch de tous les fichiers BAN
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import { promisify as fsPromisify } from 'fs';

const execAsync = promisify(exec);

// Configuration
const RUST_PROJECT = path.join(process.cwd(), 'ban-re');
const BAN_CONVERTER = path.join(RUST_PROJECT, 'target', 'release', 'ban-convert.exe');

// Dossiers contenant des fichiers BAN
const BAN_SEARCH_PATTERNS = [
    'assets/data_extracted/**/*.ban',
    'assets/pk2_extracted/Particles/**/*.ban',
    'assets/pk2_data/**/*.ban',
];

async function findAllBANFiles(): Promise<string[]> {
    console.log('🔍 Recherche des fichiers BAN...\n');

    const allFiles: string[] = [];

    for (const pattern of BAN_SEARCH_PATTERNS) {
        const files = await glob(pattern);
        allFiles.push(...files);
    }

    console.log(`✅ ${allFiles.length} fichiers BAN trouvés\n`);
    return allFiles;
}

async function buildBANConverter() {
    console.log('🔨 Vérification du convertisseur BAN...\n');

    // Vérifier si le convertisseur existe déjà
    if (fs.existsSync(BAN_CONVERTER)) {
        console.log('✅ Converteur BAN déjà compilé\n');
        return;
    }

    console.log('⚠️  Converteur non trouvé, compilation en cours...');
    console.log('Cela peut prendre quelques minutes...\n');

    try {
        const { stdout, stderr } = await execAsync('cargo build --release --bin ban-convert', {
            cwd: RUST_PROJECT,
            timeout: 300000
        });

        if (stderr && stderr.includes('error')) {
            console.error('❌ Erreur de compilation:', stderr);
            throw new Error('Compilation failed');
        }

        console.log('✅ Converteur BAN compilé avec succès\n');
    } catch (error) {
        console.error('❌ Erreur lors de la compilation:', error);
        throw error;
    }
}

async function convertBANFile(banPath: string, index: number, total: number): Promise<boolean> {
    const basename = path.basename(banPath);
    const progress = `[${index + 1}/${total}]`.padStart(8);

    try {
        // Convertir en JSON
        const { stdout, stderr } = await execAsync(`"${BAN_CONVERTER}" "${banPath}" json`, {
            timeout: 30000
        });

        if (stderr && stderr.includes('Error')) {
            console.error(`${progress} ❌ ${basename}: ${stderr}`);
            return false;
        }

        console.log(`${progress} ✅ ${basename}`);
        return true;

    } catch (error) {
        console.error(`${progress} ❌ ${basename}:`, error);
        return false;
    }
}

async function convertAllBANFiles() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion Batch BAN → JSON/Babylon.js                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // 1. Trouver tous les fichiers BAN
    const banFiles = await findAllBANFiles();

    if (banFiles.length === 0) {
        console.log('⚠️  Aucun fichier BAN trouvé !');
        return;
    }

    // 2. Compiler le convertisseur si nécessaire
    await buildBANConverter();

    // 3. Convertir tous les fichiers
    console.log('🎨 Conversion en cours...\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < banFiles.length; i++) {
        const success = await convertBANFile(banFiles[i], i, banFiles.length);

        if (success) {
            successCount++;
        } else {
            failCount++;
        }

        // Afficher un résumé tous les 50 fichiers
        if ((i + 1) % 50 === 0) {
            console.log(`\n📊 Progression: ${i + 1}/${banFiles.length} (${((i + 1) / banFiles.length * 100).toFixed(1)}%)\n`);
        }
    }

    // 4. Rapport final
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport de Conversion                                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log(`✅ Conversions réussies : ${successCount}/${banFiles.length} (${(successCount / banFiles.length * 100).toFixed(1)}%)`);
    console.log(`❌ Échecs              : ${failCount}/${banFiles.length} (${(failCount / banFiles.length * 100).toFixed(1)}%)`);

    if (successCount > 0) {
        console.log(`\n📁 Fichiers générés dans les mêmes dossiers que les fichiers BAN`);
        console.log(`   - .json (données brutes)`);
        console.log(`   - .babylon.ts (code Babylon.js)`);
    }
}

// Lancer la conversion
convertAllBANFiles().catch(console.error);
