/**
 * Surveillance de la progression DDJ → WebP
 *
 * Script pour monitorer la progression de conversion en temps réel
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TEXTURE_DIR = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\textures_webp';
const OUTPUT_FILE = 'C:\\Users\\duan7\\Desktop\\SRObro\\texture_conversion_stats.json';

interface ConversionStats {
    totalDDJ: number;
    webpCreated: number;
    percentage: number;
    lastUpdate: string;
    folders: { [key: string]: number };
}

async function countWebPFiles(): Promise<number> {
    const { stdout } = await execAsync(`find "${TEXTURE_DIR}" -name "*.webp" -type f 2>&1 | wc -l`);
    return parseInt(stdout.trim()) || 0;
}

async function countByFolder(): Promise<{ [key: string]: number }> {
    const folders: { [key: string]: number } = {};

    const { stdout } = await execAsync(`find "${TEXTURE_DIR}" -type d 2>&1`);

    const dirPaths = stdout.trim().split('\n').filter(p => p);

    for (const dirPath of dirPaths) {
        const folderName = path.basename(dirPath);
        try {
            const { stdout: count } = await execAsync(`find "${dirPath}" -name "*.webp" -type f 2>&1 | wc -l`);
            folders[folderName] = parseInt(count.trim()) || 0;
        } catch (error) {
            folders[folderName] = 0;
        }
    }

    return folders;
}

async function updateStats(): Promise<ConversionStats> {
    console.clear();

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Surveillance Conversion DDJ → WebP                   ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const webpCreated = await countWebPFiles();
    const folders = await countByFolder();
    const totalDDJ = 26290;
    const percentage = (webpCreated / totalDDJ * 100).toFixed(1);

    const stats: ConversionStats = {
        totalDDJ,
        webpCreated,
        percentage: parseFloat(percentage),
        lastUpdate: new Date().toISOString(),
        folders
    };

    console.log(`📊 Statistiques de Conversion:\n`);
    console.log(`   Total DDJ:     ${totalDDJ.toLocaleString()}`);
    console.log(`   WebP créés:    ${webpCreated.toLocaleString()} (${percentage}%)`);
    console.log(`   Estimation:    ${calculateTimeRemaining(percentage)}`);
    console.log(`   Dernière MAJ:  ${new Date().toLocaleString('fr-FR')}\n`);

    console.log(`📁 Par dossier:`);
    const sortedFolders = Object.entries(folders)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    sortedFolders.forEach(([folder, count]) => {
        if (count > 0) {
            const bar = '█'.repeat(Math.floor(count / 50));
            console.log(`   ${folder.padEnd(15)} ${count.toString().padStart(5)} ${bar}`);
        }
    });

    console.log(`\n✅ Statistiques sauvegardées dans: ${OUTPUT_FILE}`);

    // Sauvegarder les stats
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));

    return stats;
}

function calculateTimeRemaining(percentage: number): string {
    if (parseFloat(percentage) >= 100) {
        return '✅ Terminé !';
    }

    const totalSeconds = (100 / parseFloat(percentage)) * 40 * 60; // Basé sur 40min écoulées pour 8%
    const remainingSeconds = totalSeconds * (1 - parseFloat(percentage) / 100);

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);

    if (hours > 0) {
        return `~${hours}h ${minutes}min restantes`;
    }
    return `~${minutes}min restantes`;
}

async function watchProgress(): Promise<void> {
    let lastCount = 0;

    while (true) {
        try {
            const stats = await updateStats();

            // Afficher seulement si changement significatif
            if (stats.webpCreated > lastCount + 100) {
                console.log(`\n🔄 Progression: +${stats.webpCreated - lastCount} fichiers depuis la dernière vérification`);
                lastCount = stats.webpCreated;
            }

        } catch (error) {
            console.error('❌ Erreur:', error);
        }

        // Attendre 30 secondes avant la prochaine vérification
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
}

// Lancer la surveillance
if (require.main === module) {
    console.log('🔍 Démarrage de la surveillance...\n');

    // Vérification immédiate
    updateStats().then(() => {
        console.log('\n🔄 Surveillance en cours (vérification toutes les 30 secondes)...');
        console.log('   Ctrl+C pour arrêter\n');

        watchProgress().catch(console.error);
    }).catch(console.error);
}

export { updateStats, ConversionStats };
