/**
 * Test de conversion DDJ → WebP pour un seul fichier
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

const BLENDER_PYTHON = 'C:\\Program Files\\Blender Foundation\\Blender 5.0\\5.0\\python\\bin\\python.exe';
const TEST_FILE = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\pk2_media\\effect\\footstep_sand.ddj';
const OUTPUT_FILE = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\textures_webp\\test_output.webp';

async function testOneDDJ() {
    console.log('🧪 Test de conversion DDJ → WebP');
    console.log(`📂 Fichier: ${TEST_FILE}\n`);

    const pythonScript = `
import sys
import os
from PIL import Image
from io import BytesIO

# Lire le fichier DDJ
ddj_path = r'${TEST_FILE}'
output_path = r'${OUTPUT_FILE}'

with open(ddj_path, 'rb') as f:
    ddj_data = f.read()

print(f"DDJ size: {len(ddj_data)} bytes")
print(f"DDJ header: {ddj_data[:8]}")

# Check DDJ signature (JMXVDDJ followed by space and version)
if not ddj_data.startswith(b'JMXVDDJ '):
    print("Invalid DDJ signature")
    sys.exit(1)

print("Valid DDJ signature")

# Skip 20-byte header
dds_data = ddj_data[20:]
print(f"DDS size: {len(dds_data)} bytes")
print(f"DDS header: {dds_data[:4]}")

# Check DDS signature
if dds_data[:4] != b'DDS ':
    print("Invalid DDS signature")
    sys.exit(1)

print("Valid DDS signature")

# Open with Pillow
img = Image.open(BytesIO(dds_data))
print(f"Image opened: {img.mode} {img.size}")

# Convert to RGB if needed
if img.mode not in ('RGB', 'L'):
    img = img.convert('RGB')
    print("Converted to RGB")

# Save as WebP
img.save(output_path, 'WebP', quality=85, method=6)
print(f"Saved to: {output_path}")

# Verify
if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"SUCCESS: WebP file created ({size} bytes)")
    sys.exit(0)
else:
    print("FAILED: File not created")
    sys.exit(1)
`;

    try {
        // Écrire le script Python dans un fichier temporaire
        const tempScript = 'C:\\Users\\duan7\\Desktop\\SRObro\\temp_ddj_test.py';
        fs.writeFileSync(tempScript, pythonScript);

        const { stdout, stderr } = await execAsync(`"${BLENDER_PYTHON}" "${tempScript}"`, {
            timeout: 30000
        });

        console.log('📤 Python Output:');
        console.log(stdout);

        if (stderr) {
            console.log('\n⚠️  Errors:');
            console.log(stderr);
        }

        // Nettoyer
        fs.unlinkSync(tempScript);

        // Vérifier
        if (fs.existsSync(OUTPUT_FILE)) {
            const stats = fs.statSync(OUTPUT_FILE);
            console.log(`\n✅ SUCCESS! WebP file created: ${stats.size} bytes`);
        } else {
            console.log('\n❌ FAILED - WebP file not created');
        }

    } catch (error: any) {
        console.error('\n❌ Execution error:', error.message);
    }
}

testOneDDJ().catch(console.error);
