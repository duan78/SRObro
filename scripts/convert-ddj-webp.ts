/**
 * Conversion DDJ vers WebP
 * Utilise Pillow (Python) via Blender Python
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const BLENDER_PYTHON = 'C:\\Program Files\\Blender Foundation\\Blender 5.0\\5.0\\python\\bin\\python.exe';
const SOURCE_DIR = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\pk2_media';
const OUTPUT_DIR = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\textures_webp';

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

    # Check DDJ signature (JMXVDDJ followed by space)
    if not ddj_data.startswith(b'JMXVDDJ '):
        sys.exit(1)

    # Skip 20-byte DDJ header to get DDS data
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

        // Write to temp file
        const tempScript = path.join(__dirname, '../temp_convert.py');
        fs.writeFileSync(tempScript, pythonScript);

        const { stdout, stderr } = await execAsync(`"${BLENDER_PYTHON}" "${tempScript}"`, {
            timeout: 10000
        });

        // Clean up
        fs.unlinkSync(tempScript);

        return fs.existsSync(outputPath);
    } catch (error) {
        return false;
    }
}

async function findAllDDJ(dir: string): Promise<string[]> {
    const ddjFiles: string[] = [];

    async function scanDir(currentDir: string) {
        try {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    await scanDir(fullPath);
                } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.ddj')) {
                    ddjFiles.push(fullPath);
                }
            }
        } catch (error) {
            // Ignore permission errors
        }
    }

    await scanDir(dir);
    return ddjFiles;
}

async function main() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Conversion DDJ → WebP                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    if (!fs.existsSync(BLENDER_PYTHON)) {
        console.log(`❌ Blender Python non trouvé: ${BLENDER_PYTHON}`);
        return;
    }

    // Créer le dossier de sortie
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('📂 Recherche des fichiers DDJ...');
    const ddjFiles = await findAllDDJ(SOURCE_DIR);

    console.log(`   ✅ ${ddjFiles.length} fichiers DDJ trouvés`);
    console.log('');
    console.log('🎨 Conversion en cours...\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < ddjFiles.length; i++) {
        const ddjPath = ddjFiles[i];
        const relativePath = path.relative(SOURCE_DIR, ddjPath);
        const outputPath = path.join(OUTPUT_DIR, relativePath.replace(/\.ddj$/i, '.webp'));

        // Créer le dossier de sortie
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Skip si déjà converti
        if (fs.existsSync(outputPath)) {
            process.stdout.write('\r⏭️  ');
            continue;
        }

        const success = await convertDDJToWebP(ddjPath, outputPath);

        if (success) {
            successCount++;
        } else {
            failCount++;
        }

        // Progress every 100 files
        if (i % 100 === 0 || i === ddjFiles.length - 1) {
            const percent = ((i + 1) / ddjFiles.length * 100).toFixed(1);
            process.stdout.write(`\r[${i + 1}/${ddjFiles.length}] (${percent}%)`);
        }
    }

    console.log('\n\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Rapport de Conversion                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    console.log(`Total:      ${ddjFiles.length}`);
    console.log(`✅ Succès:   ${successCount}`);
    console.log(`❌ Échecs:   ${failCount}`);
    console.log(`\n📁 Output: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
