/**
 * Quick PK2 Extraction Verification
 *
 * Vérifie que l'extraction PK2 Editor a réussi
 */

import fs from 'fs';
import path from 'path';

function checkExtraction(dir: string) {
    console.log('='.repeat(70));
    console.log('🔍 Vérification Extraction PK2 Editor');
    console.log('='.repeat(70));

    const extractDir = 'C:/Users/duan7/Desktop/SRObro/assets/pk2_extracted';

    // Vérifier si le dossier existe
    try {
        const stats = fs.statSync(extractDir);
        if (!stats.isDirectory()) {
            console.log(`❌ Dossier non trouvé: ${extractDir}`);
            console.log(`\n📋 Suivez le guide: docs/GUIDE_PK2_EDITOR.md`);
            return false;
        }
    } catch {
        console.log(`❌ Dossier non trouvé: ${extractDir}`);
        console.log(`\n📋 Suivez le guide: docs/GUIDE_PK2_EDITOR.md`);
        return false;
    }

    console.log(`✅ Dossier trouvé: ${extractDir}`);

    // Compter les fichiers par type
    const files = {
        bsr: 0,
        bms: 0,
        ddj: 0,
        total: 0
    };

    function scanDir(currentDir: string, depth = 0) {
        if (depth > 10) return; // Limiter la profondeur

        try {
            const entries = fs.readdirSync(currentDir);

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry);

                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    scanDir(fullPath, depth + 1);
                } else {
                    files.total++;

                    const ext = path.extname(entry).toLowerCase();
                    if (ext === '.bsr') files.bsr++;
                    else if (ext === '.bms') files.bms++;
                    else if (ext === '.ddj') files.ddj++;
                }
            }
        } catch (e) {
            // Ignorer les erreurs d'accès
        }
    }

    scanDir(extractDir);

    console.log(`\n📊 Statistiques:`);
    console.log(`   Fichiers BSR: ${files.bsr.toLocaleString()}`);
    console.log(`   Fichiers BMS: ${files.bms.toLocaleString()}`);
    console.log(`   Fichiers DDJ: ${files.ddj.toLocaleString()}`);
    console.log(`   Total: ${files.total.toLocaleString()} fichiers`);

    // Vérifier s'il y a des dossiers Character/Mob/NPC
    const hasCharacter = fs.existsSync(path.join(extractDir, 'Character'));
    const hasMob = fs.existsSync(path.join(extractDir, 'Mob'));
    const hasNPC = fs.existsSync(path.join(extractDir, 'NPC'));

    console.log(`\n📁 Dossiers trouvés:`);
    console.log(`   Character/: ${hasCharacter ? '✅' : '❌'}`);
    console.log(`   Mob/:       ${hasMob ? '✅' : '❌'}`);
    console.log(`   NPC/:       ${hasNPC ? '✅' : '❌'}`);

    // Analyser un fichier si disponible
    const findFile = (ext: string) => {
        let found: string | null = null;
        function search(dir: string) {
            try {
                const entries = fs.readdirSync(dir);
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry);
                    const stats = fs.statSync(fullPath);
                    if (stats.isDirectory()) {
                        const result = search(fullPath);
                        if (result) return result;
                    } else if (entry.endsWith(ext)) {
                        return fullPath;
                    }
                }
            } catch (e) {}
            return null;
        }
        return search(extractDir);
    };

    console.log(`\n🔬 Analyse de format:`);

    const bsrFile = findFile('.bsr');
    if (bsrFile) {
        const buffer = fs.readFileSync(bsrFile);
        const magic = Buffer.from([buffer[0], buffer[1], buffer[2], buffer[3]]).toString('ascii');
        const magicNum = buffer.readUInt32LE(0);

        console.log(`   Fichier testé: ${path.basename(bsrFile)}`);
        console.log(`   Magic String: "${magic}"`);
        console.log(`   Magic Hex:    0x${magicNum.toString(16).toUpperCase()}`);

        if (magic === 'BSR\x02' || magic === 'BSR\x00' || magicNum === 0x02525342) {
            console.log(`   ✅ Format BSR standard - PARFAIT !`);
            console.log(`\n🎉 Les fichiers sont au bon format pour notre pipeline !`);
            return true;
        } else if (magic === 'JMXV' || magic === 'JMXW') {
            console.log(`   ❌ Format XMX compressé - PAS BON`);
            console.log(`\n⚠️  Les fichiers ne sont pas au bon format.`);
            console.log(`   Il faut les extraire avec PK2 Editor.`);
            return false;
        } else {
            console.log(`   ❓ Format inconnu - à analyser`);
            return false;
        }
    } else {
        console.log(`   ⚠️  Aucun fichier .bsr trouvé`);
        console.log(`   Avez-vous extrait les bons dossiers depuis Media.pk2 ?`);
        return false;
    }

    console.log('='.repeat(70));
}

// Lancer la vérification
checkExtraction('C:/Users/duan7/Desktop/SRObro/assets/pk2_extracted');
