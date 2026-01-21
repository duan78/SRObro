/**
 * Analyseur complet de fichiers BAN - Animations Silkroad Online
 * Objectif : Comprendre complètement le format pour créer un convertisseur
 */

import fs from 'fs';
import path from 'path';

interface BANFileInfo {
    filePath: string;
    size: number;
}

interface BANHeader {
    signature: string;
    version: number;
    unknown1: number;
    unknown2: number;
    frameCount: number;
    boneCount: number;
    fps: number;
    animationName: string;
}

interface BoneAnimationData {
    boneName: string;
    keyframeCount: number;
    keyframes: KeyFrameData[];
}

interface KeyFrameData {
    frame: number;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number; w: number };
    scale?: { x: number; y: number; z: number };
    rawBytes: Buffer;
}

export class BANAnalyzer {
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
     * Analyse complète du fichier BAN
     */
    analyze(): void {
        console.log('\n╔══════════════════════════════════════════════════════════╗');
        console.log(`║     Analyse BAN Complète : ${path.basename(this.filePath)}                ║`);
        console.log('╚══════════════════════════════════════════════════════════╝\n');

        // 1. Header
        const header = this.analyzeHeader();

        // 2. Table des offsets
        const offsetTable = this.analyzeOffsetTable();

        // 3. Données d'os
        const bones = this.analyzeBones(offsetTable);

        // 4. Afficher le résumé
        this.displaySummary(header, bones, offsetTable);
    }

    /**
     * Analyse le header du fichier BAN
     */
    private analyzeHeader(): BANHeader {
        console.log('📋 HEADER:');

        // Signature (8 bytes) : "JMXVBAN "
        const signature = this.data.slice(0, 8).toString('ascii');

        // Version (1 byte à l'offset 8)
        const version = this.data.readUInt8(8);

        // Inconnu (3 bytes)
        const unknown1 = this.data.readUInt16LE(9);

        // Flags (4 bytes à l'offset 12)
        const flags = this.data.readUInt32LE(12);

        // Frame count (4 bytes à l'offset 16)
        const frameCount = this.data.readUInt32LE(16);

        // Bone count (4 bytes à l'offset 20)
        const boneCount = this.data.readUInt32LE(20);

        // Animation name (commence à l'offset 24)
        let nameOffset = 24;
        while (nameOffset < this.data.length && this.data[nameOffset] !== 0x00) {
            nameOffset++;
        }
        const animationName = this.data.slice(24, nameOffset).toString('ascii');

        console.log(`   Signature:      ${signature}`);
        console.log(`   Version:         ${version}`);
        console.log(`   Flags:           0x${flags.toString(16).padStart(8, '0')}`);
        console.log(`   Frame Count:     ${frameCount}`);
        console.log(`   Bone Count:      ${boneCount}`);
        console.log(`   Animation Name:  "${animationName}"`);
        console.log(`   FPS (estimé):    30\n`);

        return {
            signature,
            version,
            unknown1,
            unknown2: flags,
            frameCount,
            boneCount,
            fps: 30,
            animationName
        };
    }

    /**
     * Analyse la table des offsets
     */
    private analyzeOffsetTable(): number[] {
        console.log('📊 TABLE DES OFFSETS:');

        const offsets: number[] = [];
        let offset = 0x28; // La table semble commencer après le nom

        // Lecture des offsets jusqu'à ce qu'on trouve 0x0000
        while (offset < Math.min(this.data.length, 0x200)) {
            const value = this.data.readUInt16LE(offset);

            if (value === 0x0000) {
                break;
            }

            offsets.push(offset);
            console.log(`   Offset 0x${offset.toString(16).padStart(4, '0')}: 0x${value.toString(16).padStart(4, '0')}`);

            offset += 2;
        }

        console.log(`   Total offsets: ${offsets.length}\n`);
        return offsets;
    }

    /**
     * Analyse les données d'os
     */
    private analyzeBones(offsetTable: number[]): BoneAnimationData[] {
        console.log('🦴 DONNÉES D\'OS:\n');

        const bones: BoneAnimationData[] = [];

        // Chercher les noms d'os et leurs données
        let offset = 0x30; // Commencer après la table des offsets

        while (offset < Math.min(this.data.length, 0x1000)) {
            // Chercher un motif qui ressemble à un nom d'os
            // (commence souvent par "Bone", "Bip", etc.)

            if (this.looksLikeBoneName(offset)) {
                const boneName = this.readBoneName(offset);

                if (!boneName) {
                    offset++;
                    continue;
                }

                // Trouver le nombre de keyframes
                // (souvent stocké après le nom)
                const keyframeInfoOffset = offset + boneName.length + 1;
                const keyframeCount = this.data.readUInt32LE(keyframeInfoOffset);

                console.log(`   ╔══ Os: "${boneName}"`);
                console.log(`   ║ Keyframes: ${keyframeCount}`);
                console.log(`   ║ Offset: 0x${offset.toString(16)}`);

                // Analyser les keyframes
                const keyframes = this.analyzeKeyframes(
                    keyframeInfoOffset + 4,
                    keyframeCount,
                    boneName
                );

                bones.push({
                    boneName,
                    keyframeCount,
                    keyframes
                });

                console.log(`   ╚═══════════════════════════════════════`);

                // Sauter à la fin des données de cet os
                // (estimation basée sur la taille des keyframes)
                const keyframesDataSize = keyframeCount * 32; // ~32 bytes par keyframe
                offset = keyframeInfoOffset + 4 + keyframesDataSize;
            } else {
                offset++;
            }
        }

        console.log(`\n   Total os trouvés: ${bones.length}\n`);
        return bones;
    }

    /**
     * Vérifie si une position ressemble à un nom d'os
     */
    private looksLikeBoneName(offset: number): boolean {
        // Vérifier si les premiers caractères sont alphabétiques
        for (let i = 0; i < Math.min(20, this.data.length - offset); i++) {
            const byte = this.data[offset + i];

            // Si on trouve un null, c'est la fin du string
            if (byte === 0x00) return true;

            // Si ce n'est pas une lettre, ce n'est pas un nom d'os
            if (!((byte >= 65 && byte <= 90) ||   // A-Z
                  (byte >= 97 && byte <= 122) ||  // a-z
                  (byte === 95)) {               // _
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
     * Analyse les keyframes pour un os
     */
    private analyzeKeyframes(
        startOffset: number,
        count: number,
        boneName: string
    ): KeyFrameData[] {
        const keyframes: KeyFrameData[] = [];

        console.log(`      Analyzing ${count} keyframes from 0x${startOffset.toString(16)}...`);

        // Pour chaque keyframe
        let currentOffset = startOffset;

        for (let i = 0; i < Math.min(count, 10); i++) { // Limiter à 10 pour l'affichage
            // Frame index
            const frame = this.data.readUInt32LE(currentOffset);
            currentOffset += 4;

            // Position (3 floats = 12 bytes)
            const px = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const py = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const pz = this.data.readFloatLE(currentOffset);
            currentOffset += 4;

            // Rotation quaternion (4 floats = 16 bytes)
            const qx = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const qy = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const qz = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const qw = this.data.readFloatLE(currentOffset);
            currentOffset += 4;

            // Scale (optionnel, 3 floats = 12 bytes)
            const sx = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const sy = this.data.readFloatLE(currentOffset);
            currentOffset += 4;
            const sz = this.data.readFloatLE(currentOffset);
            currentOffset += 4;

            // Vérifier si c'est un quaternion valide
            const quatMag = Math.sqrt(qx*qx + qy*qy + qz*qz + qw*qw);

            keyframes.push({
                frame,
                position: { x: px, y: py, z: pz },
                rotation: { x: qx, y: qy, z: qz, w: qw },
                scale: { x: sx, y: sy, z: sz },
                rawBytes: this.data.slice(currentOffset - 64, currentOffset) // 64 bytes de contexte
            });

            // Afficher les 3 premières keyframes
            if (i < 3) {
                console.log(`         [${frame}] Pos:(${px.toFixed(2)}, ${py.toFixed(2)}, ${pz.toFixed(2)}) Quat:[${qx.toFixed(3)}, ${qy.toFixed(3)}, ${qz.toFixed(3)}, ${qw.toFixed(3)}] |Q=${quatMag.toFixed(2)}`);
            }
        }

        return keyframes;
    }

    /**
     * Affiche un résumé de l'analyse
     */
    private displaySummary(
        header: BANHeader,
        bones: BoneAnimationData[],
        offsetTable: number[]
    ): void {
        console.log('📊 RÉSUMÉ:\n');
        console.log(`   Animation: ${header.animationName}`);
        console.log(`   Durée: ${header.frameCount / header.fps} secondes`);
        console.log(`   Os: ${bones.length} différents`);
        console.log(`   Keyframes totales: ${bones.reduce((sum, b) => sum + b.keyframeCount, 0)}`);
        console.log(`   Taille du fichier: ${this.data.length} bytes`);
        console.log('');
    }

    /**
     * Exporte les données en format JSON pour traitement ultérieur
     */
    exportToJSON(): any {
        return {
            filePath: this.filePath,
            fileName: path.basename(this.filePath),
            size: this.data.length,
            header: this.analyzeHeader(),
            bones: this.analyzeBones([]),
            rawHex: this.data.slice(0, 512).toString('hex')
        };
    }
}

/**
 * Fonction utilitaire pour analyser plusieurs fichiers BAN
 */
export function analyzeMultipleBANFiles(directory: string): void {
    const files = [
        'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\dun\\property\\flame\\lroom\\flame_lroom_mid.ban',
        'C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted\\prim\\skel\\nature\\ruins\\ruin_takla_edimmu1.ban'
    ];

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║     Analyse Multiple de Fichiers BAN                       ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    const results = [];

    files.forEach((file, index) => {
        console.log(`\n[${index + 1}/${files.length}] ${path.basename(file)}\n`);

        try {
            const analyzer = new BANAnalyzer(file);
            analyzer.analyze();
        } catch (error) {
            console.error(`   ❌ Erreur: ${error}`);
        }
    });

    console.log('\n✅ Analyse terminée !\n');
}

// Lancer l'analyse
analyzeMultipleBANFiles('C:\\Users\\duan7\\Desktop\\SRObro\\assets\\data_extracted');
