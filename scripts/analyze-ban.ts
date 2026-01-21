/**
 * Analyseur de fichiers BAN/BAF - Animations Silkroad Online
 *
 * Format BAN : JMXVBAN + header + données d'animation
 */

import fs from 'fs';
import path from 'path';

interface BANHeader {
    signature: string;      // "JMXVBAN 10"
    version: number;        // 01, 02, etc.
    flags: number;
    frameCount: number;     // Nombre de frames
    boneCount: number;      // Nombre d'os
    fps: number;            // Frames par seconde (déduit)
}

interface BoneTrack {
    boneName: string;
    keyframes: KeyFrame[];
}

interface KeyFrame {
    frame: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number }; // Quaternion
    scale?: { x: number; y: number; z: number };
}

export class BANParser {
    private data: Buffer;
    private offset: number = 0;

    constructor(filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        this.data = fs.readFileSync(filePath);
    }

    /**
     * Parse le fichier BAN complet
     */
    parse(): {
        header: BANHeader;
        bones: BoneTrack[];
    } {
        this.offset = 0;

        // Lire le header
        const header = this.readHeader();

        // Lire les tracks d'os
        const bones: BoneTrack[] = [];

        // Pour chaque os, lire les keyframes
        for (let i = 0; i < header.boneCount; i++) {
            const bone = this.readBoneTrack();
            bones.push(bone);
        }

        return { header, bones };
    }

    /**
     * Lit le header du fichier BAN
     */
    private readHeader(): BANHeader {
        // Signature (8 bytes) : "JMXVBAN 10"
        const signatureBytes = this.data.slice(this.offset, this.offset + 8);
        const signature = signatureBytes.toString('ascii').trim();
        this.offset += 8;

        // Version (1 byte)
        const version = this.data.readUInt8(this.offset);
        this.offset += 1;

        // Reserved (3 bytes)
        this.offset += 3;

        // Flags (4 bytes)
        const flags = this.data.readUInt32LE(this.offset);
        this.offset += 4;

        // Frame count (4 bytes)
        const frameCount = this.data.readUInt32LE(this.offset);
        this.offset += 4;

        // Bone count (déduit de la taille du fichier)
        const boneCount = this.data.readUInt32LE(this.offset);
        this.offset += 4;

        // FPS (typiquement 30 pour Silkroad)
        const fps = 30;

        return {
            signature,
            version,
            flags,
            frameCount,
            boneCount,
            fps
        };
    }

    /**
     * Lit les keyframes pour un os
     */
    private readBoneTrack(): BoneTrack {
        // Nom de l'os (string terminée par null)
        const boneName = this.readNullTerminatedString();

        // Nombre de keyframes
        const keyframeCount = this.data.readUInt32LE(this.offset);
        this.offset += 4;

        const keyframes: KeyFrame[] = [];

        // Lire chaque keyframe
        for (let i = 0; i < keyframeCount; i++) {
            const keyframe = this.readKeyFrame();
            keyframes.push(keyframe);
        }

        return { boneName, keyframes };
    }

    /**
     * Lit une keyframe individuelle
     */
    private readKeyFrame(): KeyFrame {
        // Frame index (4 bytes)
        const frame = this.data.readUInt32LE(this.offset);
        this.offset += 4;

        // Position (3 floats = 12 bytes)
        const x = this.data.readFloatLE(this.offset);
        this.offset += 4;
        const y = this.data.readFloatLE(this.offset);
        this.offset += 4;
        const z = this.data.readFloatLE(this.offset);
        this.offset += 4;

        // Rotation en quaternion (4 floats = 16 bytes)
        const qx = this.data.readFloatLE(this.offset);
        this.offset += 4;
        const qy = this.data.readFloatLE(this.offset);
        this.offset += 4;
        const qz = this.data.readFloatLE(this.offset);
        this.offset += 4;
        const qw = this.data.readFloatLE(this.offset);
        this.offset += 4;

        // Scale (optionnel, 3 floats)
        // Pour l'instant, on ignore le scale

        return {
            frame,
            position: { x, y, z },
            rotation: { x: qx, y: qy, z: qz, w: qw }
        };
    }

    /**
     * Lit une string terminée par null
     */
    private readNullTerminatedString(): string {
        const start = this.offset;
        while (this.offset < this.data.length && this.data[this.offset] !== 0x00) {
            this.offset++;
        }
        const str = this.data.slice(start, this.offset).toString('ascii');
        this.offset++; // Skip the null terminator
        return str;
    }

    /**
     * Convertit l'animation BAN en Babylon.js Animation
     */
    static convertToBabylonAnimation(banData: ReturnType<BANParser['parse']>): any[] {
        const animations: any[] = [];

        banData.bones.forEach(boneTrack => {
            boneTrack.keyframes.forEach((keyframe, index) => {
                // Animation de position
                const posKeys = boneTrack.keyframes.map(kf => ({
                    frame: kf.frame,
                    value: new BABYLON.Vector3(
                        kf.position.x,
                        kf.position.y,
                        kf.position.z
                    )
                }));

                // Animation de rotation (quaternion)
                const rotKeys = boneTrack.keyframes.map(kf => ({
                    frame: kf.frame,
                    value: new BABYLON.Quaternion(
                        kf.rotation.x,
                        kf.rotation.y,
                        kf.rotation.z,
                        kf.rotation.w
                    )
                }));

                animations.push({
                    boneName: boneTrack.boneName,
                    positionKeys: posKeys,
                    rotationKeys: rotKeys
                });
            });
        });

        return animations;
    }
}

/**
 * Fonction helper pour analyser un fichier BAN
 */
export function analyzeBANFile(filePath: string): void {
    try {
        const parser = new BANParser(filePath);
        const result = parser.parse();

        console.log('\n╔══════════════════════════════════════════════════════════╗');
        console.log('║     Analyse de Fichier BAN                              ║');
        console.log('╚══════════════════════════════════════════════════════════╝\n');

        console.log(`📄 Fichier: ${path.basename(filePath)}`);
        console.log(`\n📋 Header:`);
        console.log(`   Signature: ${result.header.signature}`);
        console.log(`   Version: ${result.header.version}`);
        console.log(`   Flags: 0x${result.header.flags.toString(16)}`);
        console.log(`   Frames: ${result.header.frameCount}`);
        console.log(`   Os: ${result.header.boneCount}`);
        console.log(`   FPS: ${result.header.fps}`);

        console.log(`\n🦴 Os animés: ${result.bones.length}`);
        result.bones.forEach(bone => {
            console.log(`   • ${bone.boneName} (${bone.keyframes.length} keyframes)`);
        });

        console.log(`\n✅ Analyse réussie !\n`);

    } catch (error) {
        console.error(`❌ Erreur lors de l'analyse:`, error);
    }
}

/**
 * Script principal pour analyser un fichier BAN
 */
async function main() {
    // Analyser un fichier BAN de test
    const testFile = 'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban';

    analyzeBANFile(testFile);
}

if (require.main === module) {
    main().catch(console.error);
}
