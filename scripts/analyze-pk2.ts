/**
 * Analyse complète des fichiers PK2 Silkroad
 * et inventaire des assets à convertir
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SILKROAD_DIR = 'C:\\Program Files (x86)\\Silkroad';
const PROJECT_DIR = 'C:\\Users\\duan7\\Desktop\\SRObro';
const EXTRACTED_DIR = path.join(PROJECT_DIR, 'assets', 'data_extracted');
const GLB_DIR = path.join(PROJECT_DIR, 'assets', 'glb_blender');

const PK2_FILES = [
    { name: 'Data.pk2', size: '3.0 GB', priority: 1, description: 'Données du jeu' },
    { name: 'Map.pk2', size: '1.2 GB', priority: 3, description: 'Cartes et géométrie' },
    { name: 'Media.pk2', size: '884 MB', priority: 2, description: 'Modèles, textures, animations' },
    { name: 'Music.pk2', size: '69 MB', priority: 5, description: 'Musiques et sons' },
    { name: 'Particles.pk2', size: '167 MB', priority: 4, description: 'Effets visuels' }
];

interface PK2Stats {
    name: string;
    path: string;
    size: string;
    exists: boolean;
    extracted: boolean;
    fileCount?: number;
}

interface ConversionStats {
    bmsFiles: number;
    bskFiles: number;
    ddjFiles: number;
    glbFiles: number;
    convertedPercent: number;
}

async function getFileCount(dir: string, extension: string): Promise<number> {
    try {
        const { exec } = await import('child_process');
        return new Promise((resolve, reject) => {
            exec(`dir /s /b "${dir}\\*${extension}" 2>nul | find /c /v ""`, (error, stdout) => {
                if (error) {
                    resolve(0);
                } else {
                    resolve(parseInt(stdout.trim()) || 0);
                }
            });
        });
    } catch {
        return 0;
    }
}

async function getDirectorySize(dir: string): Promise<string> {
    try {
        const { exec } = await import('child_process');
        return new Promise((resolve) => {
            exec(`powershell -Command "Get-ChildItem -Path '${dir}' -Recurse | Measure-Object -Property Length -Sum | Select-Object Sum"`, (error, stdout) => {
                if (error || !stdout) {
                    resolve('0 GB');
                } else {
                    const match = stdout.match(/Sum\s+(\d+)/);
                    if (match) {
                        const bytes = parseInt(match[1]);
                        const gb = (bytes / (1024 ** 3)).toFixed(2);
                        resolve(`${gb} GB`);
                    } else {
                        resolve('0 GB');
                    }
                }
            });
        });
    } catch {
        return '0 GB';
    }
}

async function main() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     SRObro - Analyse PK2 Silkroad                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Analyser les fichiers PK2
    console.log('📦 FICHIERS PK2 SOURCES:\n');
    const pk2Stats: PK2Stats[] = [];

    for (const pk2 of PK2_FILES) {
        const pk2Path = path.join(SILKROAD_DIR, pk2.name);
        const exists = fs.existsSync(pk2Path);
        const extractedPath = path.join(EXTRACTED_DIR, pk2.name.replace('.pk2', ''));
        const extracted = fs.existsSync(extractedPath);

        const stat: PK2Stats = {
            name: pk2.name,
            path: pk2Path,
            size: pk2.size,
            exists,
            extracted
        };

        if (extracted) {
            try {
                const size = await getDirectorySize(extractedPath);
                console.log(`  ${exists ? '✅' : '❌'} ${pk2.name.padEnd(20)} (${pk2.size})`);
                console.log(`     └─> Extrait: ${size}`);
                stat.fileCount = 0; // À calculer avec un outil PK2
            } catch {
                console.log(`  ${exists ? '✅' : '❌'} ${pk2.name.padEnd(20)} (${pk2.size})`);
                console.log(`     └─> Extrait: Oui`);
            }
        } else {
            console.log(`  ${exists ? '✅' : '❌'} ${pk2.name.padEnd(20)} (${pk2.size})`);
            console.log(`     └─> ⚠️  Non extrait`);
        }

        pk2Stats.push(stat);
        console.log('');
    }

    // Analyser les fichiers extraits
    console.log('\n📁 FICHIERS EXTRAITS:\n');

    let bmsCount = 0;
    let bskCount = 0;
    let ddjCount = 0;
    let glbCount = 0;

    try {
        const { execSync } = await import('child_process');

        try {
            bmsCount = parseInt(execSync(`dir /s /b "${EXTRACTED_DIR}\\*.bms" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch { bmsCount = 0; }

        try {
            bskCount = parseInt(execSync(`dir /s /b "${EXTRACTED_DIR}\\*.bsk" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch { bskCount = 0; }

        try {
            ddjCount = parseInt(execSync(`dir /s /b "${EXTRACTED_DIR}\\*.ddj" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch { ddjCount = 0; }

        try {
            glbCount = parseInt(execSync(`dir /s /b "${GLB_DIR}\\*.glb" 2>nul | find /c /v ""`).toString().trim()) || 0;
        } catch { glbCount = 0; }

    } catch {
        // Fallback: utiliser find si disponible
        try {
            const { execSync } = await import('child_process');
            bmsCount = parseInt(execSync(`find "${EXTRACTED_DIR}" -name "*.bms" 2>/dev/null | wc -l`).toString().trim()) || 0;
            bskCount = parseInt(execSync(`find "${EXTRACTED_DIR}" -name "*.bsk" 2>/dev/null | wc -l`).toString().trim()) || 0;
            ddjCount = parseInt(execSync(`find "${EXTRACTED_DIR}" -name "*.ddj" 2>/dev/null | wc -l`).toString().trim()) || 0;
            glbCount = parseInt(execSync(`find "${GLB_DIR}" -name "*.glb" 2>/dev/null | wc -l`).toString().trim()) || 0;
        } catch { }
    }

    console.log(`  📐 BMS (Modèles):    ${bmsCount.toLocaleString()}`);
    console.log(`  🦴 BSK (Squelettes): ${bskCount.toLocaleString()}`);
    console.log(`  🎨 DDJ (Textures):   ${ddjCount.toLocaleString()}`);
    console.log(`  📦 GLB (Convertis):  ${glbCount.toLocaleString()}`);

    // Calculer le pourcentage de conversion
    const conversionPercent = bmsCount > 0 ? ((glbCount / bmsCount) * 100).toFixed(1) : 0;
    console.log(`\n  📊 Taux de conversion: ${conversionPercent}%`);

    // Résumé
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     RÉSUMÉ                                         ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const needsExtraction = pk2Stats.filter(p => p.exists && !p.extracted).length;
    const needsConversion = bmsCount - glbCount;

    console.log(`  📦 PK2 à extraire:     ${needsExtraction}`);
    console.log(`  🔄 BMS à convertir:    ${needsConversion.toLocaleString()}`);
    console.log(`  🎨 DDJ à convertir:    ${ddjCount.toLocaleString()}`);

    // Estimer le temps restant
    if (needsConversion > 0) {
        const filesPerMinute = 200; // Basé sur nos tests
        const minutesRemaining = Math.ceil(needsConversion / filesPerMinute);
        const hoursRemaining = (minutesRemaining / 60).toFixed(1);

        console.log(`  ⏱️  Temps estimé:      ${hoursRemaining} heures`);
    }

    console.log('\n📋 PROCHAINES ÉTAPES:\n');
    console.log('  1. ✅ Installer Pillow pour les textures');
    console.log('  2. 📤 Extraire les PK2 manquants');
    console.log('  3. 🔄 Convertir les BMS/BSK restants');
    console.log('  4. 🎨 Convertir les DDJ en WebP');
    console.log('  5. 📋 Copier les assets vers le client');

    console.log('\n');
}

main().catch(console.error);
