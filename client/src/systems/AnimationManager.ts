/**
 * Système de gestion des animations pour SRObro
 * Charge et gère les animations BAN converties
 */

import { Scene, AnimationGroup, Vector3, Quaternion, Mesh } from '@babylonjs/core';

interface BANAnimationData {
    header: {
        magic: string;
        version: number;
        boneCount: number;
        frameCount: number;
        duration: number;
    };
    bones: string[];
    frames: AnimationFrame[];
}

interface AnimationFrame {
    timestamp: number;
    rotations: number[][]; // Quaternion [x, y, z, w] par bone
    translations?: number[][]; // [x, y, z] par bone (optionnel)
    scales?: number[][]; // [x, y, z] par bone (optionnel)
}

interface AnimationConfig {
    name: string;
    loop?: boolean;
    speedRatio?: number;
}

export class AnimationManager {
    private scene: Scene;
    private animations: Map<string, BANAnimationData> = new Map();
    private animationGroups: Map<string, AnimationGroup> = new Map();
    private baseUrl: string = 'assets/';

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Initialize le AnimationManager
     */
    async initialize(): Promise<void> {
        console.log('🎬 Initialisation AnimationManager...');

        try {
            // Charger la liste des animations disponibles
            const banFiles = await this.findBANFiles();
            console.log(`✅ ${banFiles.length} animations BAN trouvées`);

            // Charger les métadonnées (pas toutes les frames pour le moment)
            await this.loadAnimationMetadata(banFiles.slice(0, 10)); // 10 premières pour test

            console.log(`✅ AnimationManager initialisé avec ${this.animations.size} animations`);

        } catch (e) {
            console.warn('⚠️  Erreur initialisation AnimationManager:', e);
        }
    }

    /**
     * Trouve tous les fichiers BAN convertis
     */
    private async findBANFiles(): Promise<string[]> {
        // Chercher les fichiers .json générés par la conversion BAN
        const response = await fetch(this.baseUrl + 'animations/manifest.json');

        if (response.ok) {
            const manifest = await response.json();
            return manifest.animations || [];
        }

        // Fallback: chercher avec glob pattern depuis le serveur
        // Pour l'instant, retourner une liste statique
        return [
            'assets/pk2_extracted/Particles/animations/ruin_takla_edimmu1.ban.json',
            'assets/pk2_data/prim/ani/mob/china/bandit/bandit.ban.json'
        ];
    }

    /**
     * Charge les métadonnées des animations
     */
    private async loadAnimationMetadata(banFiles: string[]): Promise<void> {
        for (const banFile of banFiles) {
            try {
                const response = await fetch(banFile);
                if (!response.ok) continue;

                const data: BANAnimationData = await response.json();

                // Stocker les métadonnées
                const animationName = this.extractAnimationName(banFile);
                this.animations.set(animationName, data);

                console.log(`   ✅ Animation chargée: ${animationName} (${data.header.frameCount} frames)`);

            } catch (e) {
                console.warn(`   ⚠️  Erreur chargement ${banFile}:`, e);
            }
        }
    }

    /**
     * Extrait le nom de l'animation depuis le chemin
     */
    private extractAnimationName(banPath: string): string {
        // Ex: "assets/.../bandit.ban.json" -> "bandit"
        const parts = banPath.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.ban.json', '').replace('.BAN.json', '');
    }

    /**
     * Applique une animation à un mesh
     */
    async applyAnimation(
        mesh: Mesh,
        animationName: string,
        config: AnimationConfig = {}
    ): Promise<boolean> {
        if (!this.animations.has(animationName)) {
            console.warn(`⚠️  Animation inconnue: ${animationName}`);
            return false;
        }

        const animationData = this.animations.get(animationName)!;

        console.log(`🎬 Application animation: ${animationName} sur ${mesh.name}`);

        // Créer un AnimationGroup Babylon.js
        const animationGroup = new BABYLON.AnimationGroup(animationName, this.scene);

        // Pour chaque frame de l'animation
        const frameRate = 30; // 30 FPS standard
        const frameStep = 1000 / frameRate;

        for (let frameIdx = 0; frameIdx < Math.min(animationData.frames.length, 100); frameIdx++) {
            const frame = animationData.frames[frameIdx];

            // Créer une animation pour chaque bone
            for (let boneIdx = 0; boneIdx < animationData.header.boneCount; boneIdx++) {
                const boneName = animationData.bones[boneIdx];

                // Trouver le bone dans le squelette du mesh
                const skeleton = mesh.skeleton;
                if (!skeleton) continue;

                const bone = skeleton.bones.find(b => b.name === boneName);
                if (!bone) continue;

                // Créer les animations de transformation
                const rotation = frame.rotations[boneIdx];
                const translation = frame.translations?.[boneIdx];
                const scale = frame.scales?.[boneIdx];

                // Rotation (quaternion)
                if (rotation && rotation.length === 4) {
                    const quaternion = new Quaternion(
                        rotation[0],
                        rotation[1],
                        rotation[2],
                        rotation[3]
                    );

                    // Créer animation de rotation
                    const rotationAnimation = new BABYLON.Animation(
                        'rotation',
                        frameIdx * frameStep,
                        frameIdx * frameStep + frameStep,
                        0
                    );

                    rotationAnimation.setKeys([
                        {
                            frame: frameIdx * frameStep,
                            value: quaternion
                        },
                        {
                            frame: frameIdx * frameStep + frameStep,
                            value: quaternion
                        }
                    ], Animation.ANIMATIONTYPE_QUATERNION);

                    animationGroup.addTargetedAnimation(rotationAnimation, bone);
                }

                // Translation (position)
                if (translation && translation.length === 3) {
                    const position = new Vector3(
                        translation[0],
                        translation[1],
                        translation[2]
                    );

                    const translationAnimation = new BABYLON.Animation(
                        'position',
                        frameIdx * frameStep,
                        frameIdx * frameStep + frameStep,
                        0
                    );

                    translationAnimation.setKeys([
                        {
                            frame: frameIdx * frameStep,
                            value: position
                        },
                        {
                            frame: frameIdx * frameStep + frameStep,
                            value: position
                        }
                    ], Animation.ANIMATIONTYPE_VECTOR3);

                    animationGroup.addTargetedAnimation(translationAnimation, bone);
                }

                // Scale (taille)
                if (scale && scale.length === 3) {
                    const scaling = new Vector3(
                        scale[0],
                        scale[1],
                        scale[2]
                    );

                    const scaleAnimation = new BABYLON.Animation(
                        'scaling',
                        frameIdx * frameStep,
                        frameIdx * frameStep + frameStep,
                        0
                    );

                    scaleAnimation.setKeys([
                        {
                            frame: frameIdx * frameStep,
                            value: scaling
                        },
                        {
                            frame: frameIdx * frameStep + frameStep,
                            value: scaling
                        }
                    ], Animation.ANIMATIONTYPE_VECTOR3);

                    animationGroup.addTargetedAnimation(scaleAnimation, bone);
                }
            }
        }

        // Configurer l'animation
        if (config.loop === undefined) config.loop = true;

        this.animationGroups.set(animationName, animationGroup);

        // Démarrer l'animation
        scene.beginAnimation(mesh, 0, animationData.header.frameCount / frameRate, config.loop);

        console.log(`✅ Animation appliquée: ${animationName}`);
        return true;
    }

    /**
     * Crée une animation simple de test
     */
    createTestAnimation(mesh: Mesh): void {
        const animationBox = new BABYLON.AnimationBox(
            'testRotation',
            60,
            60,
            0
        );

        const animationKeys = [];
        const keyFrames = [0, 30, 60];

        for (const frame of keyFrames) {
            const rotationY = (frame / 60) * Math.PI * 2;
            const quaternion = Quaternion.RotationAxis(Vector3.Up(), rotationY);

            animationKeys.push({
                frame: frame,
                value: quaternion
            });
        }

        animationBox.setKeys(animationKeys, Animation.ANIMATIONTYPE_QUATERNION);

        const animationGroup = new BABYLON.AnimationGroup('testRotation', this.scene);
        animationGroup.addTargetedAnimation(animationBox, mesh);

        this.animationGroups.set('testRotation', animationGroup);

        scene.beginAnimation(mesh, 0, 60, true);
    }

    /**
     * Arrête toutes les animations
     */
    stopAllAnimations(): void {
        this.scene.stopAllAnimations();
    }

    /**
     * Nettoie les ressources
     */
    dispose(): void {
        this.stopAllAnimations();

        this.animationGroups.forEach(group => {
            group.dispose();
        });
        this.animationGroups.clear();

        this.animations.clear();
    }
}
