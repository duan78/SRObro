/**
 * SkillEffectManager
 *
 * Manages visual effects for skills
 * Handles particle effects, mesh effects, and sound for skill usage
 */

import { Scene, Vector3, ParticleSystem, Color4, Mesh, Texture, DynamicTexture } from '@babylonjs/core';

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

    // ---- Phase B V3: descripteurs VFX OFFICIELS (Particles.pk2 .efp) ----
    /** efp key → {life, emit, colors, scales, textures[], blend} */
    private efp: Record<string, Record<string, unknown>> | null = null;
    /** familles de skills → effet officiel (stems réels de l'index efp) */
    private static readonly OFFICIAL_KEYS: Record<string, string> = {
        fire: 'skill/china/fire_attack_motion_shoot_a',
        cold: 'skill/china/cold_attack_motion_shoot_a',
        ice: 'skill/china/cold_attack_motion_shoot_a',
        lightning: 'skill/china/lightning_attack_motion_shoot_a',
        heal: 'skill/china/force_bow_area',
        force: 'skill/china/force_bow_area',
        wizard: 'skill/europe/wizard_cold_bolt_a',
        eu: 'skill/europe/wizard_cold_bolt_a',
        slash: 'hiteffect/hit_1_cut_critical',
    };

    constructor(scene: Scene) {
        this.scene = scene;
        this.registerDefaultEffects();
        // Descripteurs officiels (extraits par scripts/extract-efp-descriptors.ts)
        void fetch('/assets/efp-descriptors.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((d: Record<string, Record<string, unknown>> | null) => { this.efp = d; })
            .catch(() => undefined);
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

        // Slash (coup d'arme / impact physique)
        this.effects.set('slash', {
            id: 'slash',
            name: 'Slash',
            type: 'instant',
            color: new Color4(0.95, 0.95, 1, 1),
            particleCount: 45,
            duration: 0.45
        });
    }

    /**
     * Texture de particule générée localement (dégradé radial blanc).
     * Évite la dépendance à un CDN externe (flare.png) — le jeu doit
     * fonctionner hors-ligne.
     */
    private flareTexture(): Texture {
        if (this._flareTex) return this._flareTex;
        const size = 64;
        const dyn = new DynamicTexture('skillvfx_flare', size, this.scene, false);
        const ctx = dyn.getContext() as CanvasRenderingContext2D;
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.35, 'rgba(255,255,255,0.7)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        dyn.update();
        dyn.hasAlpha = true;
        this._flareTex = dyn;
        return dyn;
    }
    private _flareTex: Texture | null = null;

    /**
     * Texture de particule pour un effet: textures OFFICIELLES extraites de
     * Particles.pk2 (référencées par les .efp des skills), avec repli
     * procédural (dégradé radial) si la famille n'en a pas — le jeu doit
     * fonctionner hors-ligne.
     */
    private textureFor(effectId: string): Texture {
        const cached = this._texCache.get(effectId);
        if (cached) return cached;
        const official = SkillEffectManager.OFFICIAL_TEXTURES[effectId];
        let tex: Texture;
        if (official) {
            tex = new Texture(official, this.scene);
            tex.hasAlpha = true;
        } else {
            tex = this.flareTexture();
        }
        this._texCache.set(effectId, tex);
        return tex;
    }
    private _texCache = new Map<string, Texture>();

    /** Textures officielles (Particles.pk2 → PNG) par famille d'effet. */
    private static readonly OFFICIAL_TEXTURES: Record<string, string> = {
        fire: '/assets/textures/particles/fire.png',
        ice: '/assets/textures/particles/byuk-ice.png',
        lightning: '/assets/textures/particles/cho-light.png',
        heal: '/assets/textures/particles/bumpy_healline.png',
        slash: '/assets/textures/particles/cho-wind-y.png',
    };

    /**
     * Play a skill effect — VFX OFFICIEL en priorité (descripteur .efp +
     * textures officielles, phase B V3), repli procédural sinon.
     */
    public playEffect(effectId: string, start: Vector3, end?: Vector3): void {
        if (this.playOfficial(effectId, start)) return;
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
     * Effet OFFICIEL piloté par le descripteur .efp: textures réelles de
     * Particles.pk2, vie/émission/échelles du fichier, blend additif,
     * couleurs du DiffuseGraph (sanitisées — les denormals de l'extract
     * sont ignorées). Un système « cœur » + un « halo » (2e texture).
     */
    private playOfficial(effectId: string, pos: Vector3): boolean {
        const key = SkillEffectManager.OFFICIAL_KEYS[effectId];
        const d = key ? this.efp?.[key] : undefined;
        if (!d) return false;
        const textures = (d.textures as string[]) ?? [];
        if (textures.length === 0) return false;
        const life = Math.min(Math.max((d.life as number) ?? 1, 0.4), 3);
        const emit = Math.min(Math.max((d.emit as number) ?? 60, 20), 300);
        const scales = (d.scales as number[]) ?? [0.5, 2];
        // Échelle monde: les valeurs efp sont en unités SRO (×10 cm) — un
        // facteur 0.35 donne un burst lisible à l'échelle du perso (~17 u).
        const min = Math.max(0.8, scales[0] * 0.35);
        const max = Math.max(min + 0.4, scales[1] * 0.35 * 0.5);
        const cols = (d.colors as number[][] | undefined) ?? [];
        const clean = cols.filter((q) => q.every((v) => v >= 0.01 && v <= 1));
        const c1 = clean[0] ?? [1, 1, 1, 1];
        const c2 = clean[clean.length - 1] ?? [c1[0], c1[1], c1[2], 0];

        const made: ParticleSystem[] = [];
        const layers = textures.slice(0, 2);
        layers.forEach((tex, i) => {
            const ps = new ParticleSystem(`efp_${effectId}_${i}`, Math.ceil(emit * life), this.scene);
            ps.particleTexture = new Texture(`/assets/textures/particles/${tex}.png`, this.scene, false, false);
            ps.emitter = pos.clone();
            ps.minEmitBox = new Vector3(-1.2, -0.5, -1.2);
            ps.maxEmitBox = new Vector3(1.2, 0.8, 1.2);
            ps.color1 = new Color4(c1[0], c1[1], c1[2], c1[3] ?? 1);
            ps.color2 = new Color4(c2[0], c2[1], c2[2], c2[3] ?? 0.6);
            ps.colorDead = new Color4(c2[0], c2[1], c2[2], 0);
            ps.minSize = min * (i === 0 ? 1 : 1.6);
            ps.maxSize = max * (i === 0 ? 1 : 1.8);
            ps.minLifeTime = life * 0.6;
            ps.maxLifeTime = life;
            ps.emitRate = emit / layers.length;
            ps.blendMode = ParticleSystem.BLENDMODE_ADD;
            ps.gravity = new Vector3(0, effectId === 'fire' ? 4 : -2, 0);
            ps.direction1 = new Vector3(-3, 1, -3);
            ps.direction2 = new Vector3(3, 6, 3);
            ps.minAngularSpeed = -1.5;
            ps.maxAngularSpeed = 1.5;
            ps.disposeOnStop = true;
            ps.start();
            // Ceinture de sécurité: disposeOnStop a un cas limite (stop alors
            // que 0 particule émise) — dispose forcé après la vie max.
            setTimeout(() => { try { ps.dispose(); } catch { /* déjà parti */ } }, life * 1000 + 2500);
            made.push(ps);
        });
        // Auto-stop après la vie de l'effet (une seule salve, pas de fuite)
        setTimeout(() => { for (const ps of made) ps.stop(); }, life * 1000 + 120).unref?.();
        return true;
    }

    /**
     * Play projectile effect
     */
    private playProjectileEffect(effect: SkillEffect, start: Vector3, end?: Vector3): void {
        const particleSystem = new ParticleSystem(`${effect.id}_particles`, effect.particleCount, this.scene);

        // Texture
        particleSystem.particleTexture = this.textureFor(effect.id);

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
        particleSystem.particleTexture = this.textureFor(effect.id);

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
        particleSystem.particleTexture = this.textureFor(effect.id);

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
        particleSystem.particleTexture = this.textureFor(effect.id);

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
