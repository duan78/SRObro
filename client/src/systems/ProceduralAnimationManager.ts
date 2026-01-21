/**
 * Procedural Animation Manager
 * Crée des animations procédurales pour tester le skinning des GLB
 * En attendant le convertisseur BAN complet
 */

import { Scene, Skeleton, Animation, Quaternion, Vector3 } from '@babylonjs/core';

export class ProceduralAnimationManager {
    private scene: Scene;
    private skeleton: Skeleton | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Attache un squelette à ce manager
     */
    attachSkeleton(skeleton: Skeleton): void {
        this.skeleton = skeleton;
        console.log(`✅ Skeleton attached: ${skeleton.name} with ${skeleton.bones.length} bones`);
    }

    /**
     * Crée une animation Idle (respiration légère)
     */
    createIdleAnimation(): void {
        if (!this.skeleton) return;

        const fps = 30;
        const spineBone = this.findBone(['Spine', 'spine', 'Bip01_Spine']);

        if (!spineBone) {
            console.warn('Spine bone not found for idle animation');
            return;
        }

        // Animation de rotation légère pour simuler la respiration
        const idleAnim = new Animation(
            'idleRotation',
            'rotation',
            fps,
            Animation.ANIMATIONTYPE_QUATERNION,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [
            {
                frame: 0,
                value: spineBone.rotation.clone()
            },
            {
                frame: 15,
                value: new Quaternion(0, Math.sin(0.02) * 0.5, 0, Math.cos(0.02) * 0.5).multiply(spineBone.rotation)
            },
            {
                frame: 30,
                value: spineBone.rotation.clone()
            }
        ];

        idleAnim.setKeys(keys);
        spineBone.animations.push(idleAnim);

        console.log('✅ Idle animation created');
    }

    /**
     * Crée une animation de marche simple
     */
    createWalkAnimation(): void {
        if (!this.skeleton) return;

        const fps = 30;

        // Trouver les os des jambes
        const leftThigh = this.findBone(['L_Thigh', 'LThigh', 'Bip01_L_Thigh', 'Thigh_L']);
        const rightThigh = this.findBone(['R_Thigh', 'RThigh', 'Bip01_R_Thigh', 'Thigh_R']);

        if (!leftThigh || !rightThigh) {
            console.warn('Thigh bones not found for walk animation');
            return;
        }

        // Animation jambe gauche
        const leftThighAnim = this.createLimbSwingAnimation(leftThigh, 'left', fps);
        leftThigh.animations.push(leftThighAnim);

        // Animation jambe droite (décalée)
        const rightThighAnim = this.createLimbSwingAnimation(rightThigh, 'right', fps);
        rightThigh.animations.push(rightThighAnim);

        // Animation du bassin (léger mouvement de haut en bas)
        const pelvis = this.findBone(['Pelvis', 'pelvis', 'Bip01_Pelvis']);
        if (pelvis) {
            const pelvisAnim = new Animation(
                'walkPelvis',
                'position',
                fps,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CYCLE
            );

            const pelvisKeys = [
                { frame: 0, value: pelvis.position.clone() },
                { frame: 15, value: pelvis.position.add(new Vector3(0, -0.05, 0)) },
                { frame: 30, value: pelvis.position.clone() }
            ];

            pelvisAnim.setKeys(pelvisKeys);
            pelvis.animations.push(pelvisAnim);
        }

        console.log('✅ Walk animation created');
    }

    /**
     * Crée une animation d'attaque simple
     */
    createAttackAnimation(): void {
        if (!this.skeleton) return;

        const fps = 30;

        // Trouver le bras
        const rightArm = this.findBone(['R_UpperArm', 'R_UpperArm', 'Bip01_R_UpperArm', 'R_ARM']);

        if (!rightArm) {
            console.warn('Right arm bone not found for attack animation');
            return;
        }

        const attackAnim = new Animation(
            'attackRotation',
            'rotation',
            fps,
            Animation.ANIMATIONTYPE_QUATERNION,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const baseRotation = rightArm.rotation.clone();

        const keys = [
            { frame: 0, value: baseRotation.clone() },
            { frame: 10, value: baseRotation.multiply(Quaternion.FromEulerAngles(0, 0, Math.PI / 4)) },
            { frame: 20, value: baseRotation.multiply(Quaternion.FromEulerAngles(0, 0, -Math.PI / 2)) },
            { frame: 30, value: baseRotation.clone() }
        ];

        attackAnim.setKeys(keys);
        rightArm.animations.push(attackAnim);

        console.log('✅ Attack animation created');
    }

    /**
     * Joue une animation spécifique
     */
    playAnimation(animName: 'idle' | 'walk' | 'attack', loop: boolean = true): void {
        if (!this.skeleton) {
            console.warn('No skeleton attached');
            return;
        }

        // Arrêter toutes les animations en cours
        this.scene.stopAnimation(this.skeleton);

        // Créer et jouer l'animation demandée
        switch (animName) {
            case 'idle':
                this.createIdleAnimation();
                this.scene.beginAnimation(this.skeleton, 0, 30, loop, 1.0);
                break;
            case 'walk':
                this.createWalkAnimation();
                this.scene.beginAnimation(this.skeleton, 0, 30, loop, 1.0);
                break;
            case 'attack':
                this.createAttackAnimation();
                this.scene.beginAnimation(this.skeleton, 0, 30, loop, 1.0);
                break;
        }

        console.log(`▶️ Playing ${animName} animation (loop: ${loop})`);
    }

    /**
     * Arrête toutes les animations
     */
    stopAllAnimations(): void {
        if (this.skeleton) {
            this.scene.stopAnimation(this.skeleton);
            console.log('⏹️ All animations stopped');
        }
    }

    /**
     * Helper: Trouve un os par son nom
     */
    private findBone(possibleNames: string[]): any {
        if (!this.skeleton) return null;

        for (const name of possibleNames) {
            const bone = this.skeleton.bones.find((b: any) =>
                b.name.includes(name)
            );
            if (bone) return bone;
        }

        return null;
    }

    /**
     * Helper: Crée une animation de balancement pour un membre
     */
    private createLimbSwingAnimation(bone: any, side: 'left' | 'right', fps: number): Animation {
        const anim = new Animation(
            `${side}ThighSwing`,
            'rotation',
            fps,
            Animation.ANIMATIONTYPE_QUATERNION,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const baseRotation = bone.rotation.clone();
        const phase = side === 'left' ? 0 : Math.PI; // Décalage de phase

        const keys = [
            {
                frame: 0,
                value: baseRotation.multiply(Quaternion.FromEulerAngles(0, 0, Math.sin(phase) * 0.5))
            },
            {
                frame: 15,
                value: baseRotation.multiply(Quaternion.FromEulerAngles(0, 0, Math.sin(phase + Math.PI / 2) * 0.5))
            },
            {
                frame: 30,
                value: baseRotation.multiply(Quaternion.FromEulerAngles(0, 0, Math.sin(phase + Math.PI) * 0.5))
            }
        ];

        anim.setKeys(keys);
        return anim;
    }

    /**
     * Liste tous les os du squelette (pour debug)
     */
    listAllBones(): void {
        if (!this.skeleton) {
            console.log('No skeleton attached');
            return;
        }

        console.log(`\n🦴 Skeleton: ${this.skeleton.name}`);
        console.log(`   Total bones: ${this.skeleton.bones.length}\n`);

        this.skeleton.bones.forEach((bone: any, index: number) => {
            const parent = bone.getParent();
            const parentName = parent ? parent.name : 'none';
            console.log(`   [${index.toString().padStart(2, '0')}] ${bone.name.padEnd(30)} (parent: ${parentName})`);
        });
        console.log('');
    }
}
