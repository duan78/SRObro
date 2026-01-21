/**
 * SkillEffectManager
 *
 * Manages visual effects for skills
 * Handles particle effects, mesh effects, and sound for skill usage
 */

import { Scene, Vector3, ParticleSystem, Color4, Mesh, Texture } from '@babylonjs/core';

/**
 * Skill effect data
 */
export interface SkillEffect {
    id: string;
    name: string;
    type: 'projectile' | 'area' | 'beam' | 'instant';
    color: Color4;
    particleCount: number;
    duration: number;
    soundId?: string;
}

/**
 * SkillEffectManager class
 */
export class SkillEffectManager {
    private scene: Scene;
    private effects: Map<string, SkillEffect> = new Map();
    private activeEffects: Map<string, ParticleSystem[]> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
        this.registerDefaultEffects();
    }

    /**
     * Register default skill effects
     */
    private registerDefaultEffects(): void {
        // Fire effect
        this.effects.set('fire', {
            id: 'fire',
            name: 'Fire',
            type: 'projectile',
            color: new Color4(1, 0.3, 0, 1),
            particleCount: 100,
            duration: 2
        });

        // Ice effect
        this.effects.set('ice', {
            id: 'ice',
            name: 'Ice',
            type: 'projectile',
            color: new Color4(0.3, 0.8, 1, 1),
            particleCount: 80,
            duration: 2
        });

        // Lightning effect
        this.effects.set('lightning', {
            id: 'lightning',
            name: 'Lightning',
            type: 'beam',
            color: new Color4(0.8, 0.8, 1, 1),
            particleCount: 150,
            duration: 0.5
        });

        // Heal effect
        this.effects.set('heal', {
            id: 'heal',
            name: 'Heal',
            type: 'area',
            color: new Color4(0.2, 1, 0.2, 1),
            particleCount: 50,
            duration: 1.5
        });
    }

    /**
     * Play a skill effect
     */
    public playEffect(effectId: string, start: Vector3, end?: Vector3): void {
        const effect = this.effects.get(effectId);
        if (!effect) {
            console.warn(`SkillEffectManager: Unknown effect ${effectId}`);
            return;
        }

        switch (effect.type) {
            case 'projectile':
                this.playProjectileEffect(effect, start, end);
                break;
            case 'area':
                this.playAreaEffect(effect, start);
                break;
            case 'beam':
                if (end) {
                    this.playBeamEffect(effect, start, end);
                }
                break;
            case 'instant':
                this.playInstantEffect(effect, start);
                break;
        }
    }

    /**
     * Play projectile effect
     */
    private playProjectileEffect(effect: SkillEffect, start: Vector3, end?: Vector3): void {
        const particleSystem = new ParticleSystem(`${effect.id}_particles`, effect.particleCount, this.scene);

        // Texture
        particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', this.scene);

        // Colors
        particleSystem.color1 = effect.color;
        particleSystem.color2 = new Color4(effect.color.r, effect.color.g, effect.color.b, 0);

        // Size
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;

        // Lifetime
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 0.8;

        // Emission
        particleSystem.emitRate = 100;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Direction
        particleSystem.direction1 = new Vector3(-1, -1, -1);
        particleSystem.direction2 = new Vector3(1, 1, 1);

        // Power
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 2;
        particleSystem.updateSpeed = 0.02;

        // Start position
        const emitter = Mesh.CreateBox(`${effect.id}_emitter`, 0.1, this.scene);
        emitter.position = start;
        emitter.isVisible = false;
        particleSystem.emitter = emitter;

        // Start
        particleSystem.start();

        // Stop after duration
        setTimeout(() => {
            particleSystem.stop();
            setTimeout(() => {
                particleSystem.dispose();
                emitter.dispose();
            }, 2000);
        }, effect.duration * 1000);
    }

    /**
     * Play area effect
     */
    private playAreaEffect(effect: SkillEffect, position: Vector3): void {
        const particleSystem = new ParticleSystem(`${effect.id}_area`, effect.particleCount, this.scene);

        // Texture
        particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', this.scene);

        // Colors
        particleSystem.color1 = effect.color;
        particleSystem.color2 = new Color4(effect.color.r, effect.color.g, effect.color.b, 0);

        // Size
        particleSystem.minSize = 0.2;
        particleSystem.maxSize = 0.5;

        // Lifetime
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 1.5;

        // Emission
        particleSystem.emitRate = 50;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Direction (upward for area effect)
        particleSystem.direction1 = new Vector3(0, 1, 0);
        particleSystem.direction2 = new Vector3(0.5, 2, 0.5);

        // Power
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1.5;

        // Emitter
        const emitter = Mesh.CreateCylinder(`${effect.id}_emitter`, 0.1, 3, 0.1, 8, this.scene);
        emitter.position = position;
        emitter.isVisible = false;
        particleSystem.emitter = emitter;

        // Start
        particleSystem.start();

        // Stop after duration
        setTimeout(() => {
            particleSystem.stop();
            setTimeout(() => {
                particleSystem.dispose();
                emitter.dispose();
            }, 2000);
        }, effect.duration * 1000);
    }

    /**
     * Play beam effect
     */
    private playBeamEffect(effect: SkillEffect, start: Vector3, end: Vector3): void {
        const particleSystem = new ParticleSystem(`${effect.id}_beam`, effect.particleCount, this.scene);

        // Texture
        particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', this.scene);

        // Colors
        particleSystem.color1 = effect.color;
        particleSystem.color2 = new Color4(effect.color.r, effect.color.g, effect.color.b, 0);

        // Size
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.2;

        // Lifetime
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.3;

        // Emission
        particleSystem.emitRate = 500;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Direction (towards target)
        const direction = end.subtract(start).normalize();
        particleSystem.direction1 = direction;
        particleSystem.direction2 = direction;

        // Power
        particleSystem.minEmitPower = 5;
        particleSystem.maxEmitPower = 8;

        // Emitter
        const emitter = Mesh.CreateBox(`${effect.id}_emitter`, 0.1, this.scene);
        emitter.position = start;
        emitter.lookAt(end);
        emitter.isVisible = false;
        particleSystem.emitter = emitter;

        // Start
        particleSystem.start();

        // Stop after duration (beam effects are shorter)
        setTimeout(() => {
            particleSystem.stop();
            setTimeout(() => {
                particleSystem.dispose();
                emitter.dispose();
            }, 1000);
        }, effect.duration * 1000);
    }

    /**
     * Play instant effect
     */
    private playInstantEffect(effect: SkillEffect, position: Vector3): void {
        const particleSystem = new ParticleSystem(`${effect.id}_instant`, effect.particleCount, this.scene);

        // Texture
        particleSystem.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', this.scene);

        // Colors
        particleSystem.color1 = effect.color;
        particleSystem.color2 = new Color4(effect.color.r, effect.color.g, effect.color.b, 0);

        // Size
        particleSystem.minSize = 0.3;
        particleSystem.maxSize = 0.6;

        // Lifetime
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.5;

        // Emission
        particleSystem.emitRate = 200;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        // Direction (all directions for burst)
        particleSystem.direction1 = new Vector3(-1, -1, -1);
        particleSystem.direction2 = new Vector3(1, 1, 1);

        // Power
        particleSystem.minEmitPower = 2;
        particleSystem.maxEmitPower = 4;

        // Emitter
        const emitter = Mesh.CreateSphere(`${effect.id}_emitter`, 4, 0.5, this.scene);
        emitter.position = position;
        emitter.isVisible = false;
        particleSystem.emitter = emitter;

        // Start
        particleSystem.start();

        // Stop quickly (instant burst)
        setTimeout(() => {
            particleSystem.stop();
            setTimeout(() => {
                particleSystem.dispose();
                emitter.dispose();
            }, 1000);
        }, 300);
    }

    /**
     * Register a custom effect
     */
    public registerEffect(effect: SkillEffect): void {
        this.effects.set(effect.id, effect);
    }

    /**
     * Clear all active effects
     */
    public clearAll(): void {
        for (const systems of this.activeEffects.values()) {
            systems.forEach(system => system.dispose());
        }
        this.activeEffects.clear();
    }

    /**
     * Dispose
     */
    public dispose(): void {
        this.clearAll();
    }
}
