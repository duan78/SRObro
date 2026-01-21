/**
 * BAN to Babylon.js Animation Converter
 * Convertit les fichiers BAN (Silkroad Online) en animations Babylon.js
 */

import fs from 'fs';
import path from 'path';

interface BANHeader {
    signature: string;
    version: number;
    flags: number;
    frameCount: number;
    boneCount: number;
    animationName: string;
}

interface BoneData {
    name: string;
    keyframes: KeyFrameData[];
}

interface KeyFrameData {
    frame: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: { x: number; y: number; z: number };
}

interface ConvertedAnimation {
    animationName: string;
    frameCount: number;
    fps: number;
    duration: number;
    bones: {
        name: string;
        keyframes: KeyFrameData[];
    }[];
}

/**
 * Classe principale pour la conversion BAN → Babylon.js
 */
export class BANConverter {
    private data: Buffer;
    private filePath: string;

    constructor(filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        this.filePath = filePath;
        this.data = fs.readFileSync(filePath);
    }

    /**
     * Convertit le fichier BAN en format utilisable par Babylon.js
     */
    convert(): ConvertedAnimation {
        console.log(`Converting: ${path.basename(this.filePath)}`);

        // 1. Lire le header
        const header = this.readHeader();

        // 2. Lire la table des offsets
        const offsets = this.readOffsetTable();

        // 3. Extraire les données d'os
        const bones = this.extractBonesData(offsets);

        return {
            animationName: header.animationName,
            frameCount: header.frameCount,
            fps: 30,
            duration: header.frameCount / 30,
            bones
        };
    }

    /**
     * Lit le header du fichier BAN
     */
    private readHeader(): BANHeader {
        const signature = this.data.slice(0, 8).toString('ascii');
        const version = this.data.readUInt8(8);
        const flags = this.data.readUInt32LE(12);
        const frameCount = this.data.readUInt32LE(16);
        const boneCount = this.data.readUInt32LE(20);

        // Lire le nom de l'animation (string null-terminated)
        let nameEnd = 24;
        while (nameEnd < this.data.length && this.data[nameEnd] !== 0) {
            nameEnd++;
        }
        const animationName = this.data.slice(24, nameEnd).toString('ascii');

        return {
            signature,
            version,
            flags,
            frameCount,
            boneCount,
            animationName
        };
    }

    /**
     * Lit la table des offsets à partir de 0x28
     */
    private readOffsetTable(): number[] {
        const offsets: number[] = [];
        let offset = 0x28;

        while (offset < Math.min(this.data.length, 0x200)) {
            const value = this.data.readUInt16LE(offset);

            if (value === 0x0000) {
                break;
            }

            offsets.push(value);
            offset += 2;
        }

        return offsets;
    }

    /**
     * Extrait les données d'os (noms + keyframes)
     */
    private extractBonesData(offsets: number[]): { name: string; keyframes: KeyFrameData[] }[] {
        const bones: { name: string; keyframes: KeyFrameData[] }[] = [];

        // Scanner pour trouver les noms d'os (même logique que analyze-ban-final.ts)
        const seenOffsets = new Set<number>();

        for (let searchOffset = 0x30; searchOffset < Math.min(this.data.length, 0x500); searchOffset++) {
            // Vérifier si c'est le début d'un nom d'os (caractère alphabétique)
            if (this.data[searchOffset] >= 65 && this.data[searchOffset] <= 122) {
                // Trouver la fin du nom
                let end = searchOffset;
                while (end < this.data.length && this.data[end] !== 0) {
                    end++;
                }

                const name = this.data.slice(searchOffset, end).toString('ascii');

                // Filtrer les noms valides (plus de 3 caractères, contient "Bone" ou "Bip" ou "one")
                if (name.length > 3 && (name.includes('Bone') || name.includes('Bip') || name.includes('one'))) {
                    // Éviter les doublons
                    if (seenOffsets.has(searchOffset)) {
                        continue;
                    }
                    seenOffsets.add(searchOffset);

                    // Lire le nombre de keyframes
                    const keyframeCountOffset = end + 1;
                    const keyframeCount = this.data.readUInt32LE(keyframeCountOffset);

                    // Estimer le nombre maximum de keyframes
                    const maxKeyframes = Math.floor((this.data.length - keyframeCountOffset) / 32);

                    // Extraire les keyframes
                    const keyframes = this.extractKeyframes(
                        keyframeCountOffset + 4,
                        Math.min(keyframeCount, maxKeyframes)
                    );

                    if (keyframes.length > 0) {
                        bones.push({
                            name,
                            keyframes
                        });

                        console.log(`  ✓ Bone "${name}": ${keyframes.length} keyframes`);
                    }
                }

                searchOffset = end + 1;
            }
        }

        return bones;
    }

    /**
     * Vérifie si une position ressemble à un nom d'os
     */
    private looksLikeBoneName(offset: number): boolean {
        for (let i = 0; i < Math.min(20, this.data.length - offset); i++) {
            const byte = this.data[offset + i];

            if (byte === 0x00) return true;

            if (!((byte >= 65 && byte <= 90) ||
                  (byte >= 97 && byte <= 122) ||
                  (byte === 95))) {
                return false;
            }
        }

        return false;
    }

    /**
     * Lit un nom d'os
     */
    private readBoneName(offset: number): string {
        let end = offset;
        while (end < this.data.length && this.data[end] !== 0x00) {
            end++;
        }
        return this.data.slice(offset, end).toString('ascii');
    }

    /**
     * Extrait les keyframes pour un os
     */
    private extractKeyframes(startOffset: number, count: number): KeyFrameData[] {
        const keyframes: KeyFrameData[] = [];
        let foundInvalid = false;

        for (let i = 0; i < count && (startOffset + i * 32 + 32) <= this.data.length; i++) {
            const offset = startOffset + (i * 32);

            const frame = this.data.readUInt32LE(offset);
            const px = this.data.readFloatLE(offset + 4);
            const py = this.data.readFloatLE(offset + 8);
            const pz = this.data.readFloatLE(offset + 12);
            const qx = this.data.readFloatLE(offset + 16);
            const qy = this.data.readFloatLE(offset + 20);
            const qz = this.data.readFloatLE(offset + 24);
            const qw = this.data.readFloatLE(offset + 28);
            const sx = 1.0; // Scale optionnel, supposé 1.0
            const sy = 1.0;
            const sz = 1.0;

            // Vérifier la validité des données
            const quatMag = Math.sqrt(qx*qx + qy*qy + qz*qz + qw*qw);
            const validFrame = isFinite(frame) && frame >= 0 && frame < 100000; // Frame indices should be reasonable
            const validPos = isFinite(px) && isFinite(py) && isFinite(pz);
            const validQuat = quatMag > 0.1 && quatMag < 10.0;

            // Si on trouve des données invalides, on arrête
            if (!validFrame || !validPos || !validQuat) {
                // Mais on continue si c'est juste le début qui est faux (padding)
                if (keyframes.length > 0) {
                    foundInvalid = true;
                    break;
                }
                continue;
            }

            keyframes.push({
                frame,
                position: { x: px, y: py, z: pz },
                rotation: { x: qx, y: qy, z: qz, w: qw },
                scale: { x: sx, y: sy, z: sz }
            });
        }

        return keyframes;
    }

    /**
     * Exporte en JSON pour utilisation dans le client
     */
    exportToJSON(outputPath: string): void {
        const converted = this.convert();
        const json = JSON.stringify(converted, null, 2);
        fs.writeFileSync(outputPath, json, 'utf-8');
        console.log(`\n✅ Exported to: ${outputPath}`);
    }
}

/**
 * Génère du code TypeScript pour Babylon.js
 */
export function generateBabylonJSCode(converted: ConvertedAnimation): string {
    const lines: string[] = [];

    lines.push(`// Auto-generated from BAN file: ${converted.animationName}`);
    lines.push(`// Frame count: ${converted.frameCount}, FPS: ${converted.fps}\n`);
    lines.push(`import { Animation, Quaternion, Vector3 } from '@babylonjs/core';\n`);
    lines.push(`export function create${toPascalCase(converted.animationName)}Animations(skeleton: any): Animation[] {`);
    lines.push(`    const animations: Animation[] = [];\n`);

    for (const bone of converted.bones) {
        const varName = toCamelCase(bone.name);
        const animName = `${toPascalCase(bone.name)}Animation`;

        lines.push(`    // Animation for bone: ${bone.name}`);
        lines.push(`    const ${varName}Anim = new Animation(`);
        lines.push(`        "${bone.name}_anim",`);
        lines.push(`        "rotation",`);
        lines.push(`        ${converted.fps},`);
        lines.push(`        Animation.ANIMATIONTYPE_QUATERNION,`);
        lines.push(`        Animation.ANIMATIONLOOPMODE_CYCLE`);
        lines.push(`    );`);

        // Générer les keys
        lines.push(`    ${varName}Anim.setKeys([`);
        for (const kf of bone.keyframes) {
            const { x, y, z, w } = kf.rotation;
            lines.push(`        { frame: ${kf.frame}, value: new Quaternion(${x.toFixed(6)}, ${y.toFixed(6)}, ${z.toFixed(6)}, ${w.toFixed(6)}) },`);
        }
        lines.push(`    ]);`);

        lines.push(`    animations.push(${varName}Anim);\n`);
    }

    lines.push(`    return animations;`);
    lines.push(`}\n`);

    // Générer une fonction helper
    lines.push(`export function play${toPascalCase(converted.animationName)}(skeleton: any, fromFrame: number = 0, toFrame: number = ${converted.frameCount}, loop: boolean = true) {`);
    lines.push(`    const animations = create${toPascalCase(converted.animationName)}Animations(skeleton);`);
    lines.push(`    skeleton.bones.forEach((bone: any, index: number) => {`);
    lines.push(`        const boneAnim = animations.find((a: any) => a.targetProperty === "${converted.animationName}");`);
    lines.push(`        if (boneAnim) {`);
    lines.push(`            bone.animations = [boneAnim];`);
    lines.push(`        }`);
    lines.push(`    });`);
    lines.push(`    return skeleton.getScene().beginAnimation(skeleton, fromFrame, toFrame, loop);`);
    lines.push(`}`);

    return lines.join('\n');
}

/**
 * Convertit une string en PascalCase
 */
function toPascalCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]/g, '_')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

/**
 * Convertit une string en camelCase
 */
function toCamelCase(str: string): string {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Fonction principale de conversion batch
 */
export async function convertBANFiles(banFiles: string[], outputDir: string): Promise<void> {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     BAN → Babylon.js Converter                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Créer le dossier de sortie
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const banFile of banFiles) {
        try {
            const converter = new BANConverter(banFile);
            const converted = converter.convert();

            // Exporter en JSON
            const baseName = path.basename(banFile, '.ban');
            const jsonPath = path.join(outputDir, `${baseName}.json`);
            converter.exportToJSON(jsonPath);

            // Générer le code TypeScript
            const tsPath = path.join(outputDir, `${baseName}.ts`);
            const tsCode = generateBabylonJSCode(converted);
            fs.writeFileSync(tsPath, tsCode, 'utf-8');

            console.log(`✅ Converted: ${baseName}\n`);

        } catch (error) {
            console.error(`❌ Failed: ${path.basename(banFile)}`, error);
        }
    }

    console.log('\n✅ Conversion complete!\n');
}

/**
 * Exemple d'utilisation
 */
if (require.main === module) {
    const banFiles = [
        'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban',
        'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\nature\\ruins\\ruin_takla_edimmu1.ban'
    ];

    const outputDir = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\animations_converted';

    convertBANFiles(banFiles, outputDir)
        .then(() => console.log('Done!'))
        .catch(console.error);
}
