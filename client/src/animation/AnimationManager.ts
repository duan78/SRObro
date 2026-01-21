/**
 * AnimationManager
 *
 * Manages character animations including states, transitions, and blending
 * Handles playback of .ban animations loaded by BanFileLoader
 */

import { Scene, Skeleton, AnimationGroup } from '@babylonjs/core';
import { BanFileLoader } from './BanFileLoader';

/**
 * Animation states for character
 */
export enum AnimationState {
    IDLE = 'idle',
    WALK = 'walk',
    RUN = 'run',
    JUMP = 'jump',
    ATTACK = 'attack',
    SKILL = 'skill',
    HIT = 'hit',
    DIE = 'die',
    SIT = 'sit',
    DANCE = 'dance',
    CHEER = 'cheer'
}

/**
 * Configuration for animation blending
 */
interface BlendConfig {
    blendSpeed: number;        // How fast to transition between animations (0-1)
    allowBlending: boolean;    // Whether to blend or hard-switch
}

/**
 * Animation data structure
 */
interface AnimationData {
    name: string;              // Animation name
    animationGroup: AnimationGroup;
    loop: boolean;             // Whether to loop the animation
    priority: number;          // Priority for interrupting current animation
    speed: number;             // Playback speed multiplier
}

/**
 * Default animation names (can be overridden per character type)
 */
interface AnimationSet {
    idle: string;
    walk: string;
    run: string;
    jump: string;
    attack: string;
    skill: string;
    hit: string;
    die: string;
    sit?: string;
    dance?: string;
    cheer?: string;
}

/**
 * Default animation sets for different character types
 */
const DEFAULT_ANIMATIONS: AnimationSet = {
    idle: 'idle',
    walk: 'walk',
    run: 'run',
    jump: 'jump',
    attack: 'attack',
    skill: 'skill_01',
    hit: 'hit',
    die: 'die',
    sit: 'sit',
    dance: 'dance',
    cheer: 'cheer'
};

/**
 * AnimationManager class
 */
export class AnimationManager {
    private scene: Scene;
    private skeleton: Skeleton | null = null;
    private banLoader: BanFileLoader;

    // All loaded animations
    private animations: Map<AnimationState, AnimationData> = new Map();

    // Current animation state
    private currentState: AnimationState = AnimationState.IDLE;
    private previousState: AnimationState | null = null;

    // Blend configuration
    private blendConfig: BlendConfig = {
        blendSpeed: 0.2,
        allowBlending: true
    };

    // Animation set for this character
    private animationSet: AnimationSet;

    constructor(scene: Scene, animationSet?: Partial<AnimationSet>) {
        this.scene = scene;
        this.banLoader = new BanFileLoader(scene);
        this.animationSet = { ...DEFAULT_ANIMATIONS, ...animationSet };
    }

    /**
     * Initialize the animation manager with a skeleton
     * Validates that the skeleton is properly set up for animation
     */
    public async initialize(skeleton: Skeleton): Promise<void> {
        // Validate skeleton
        if (!skeleton) {
            throw new Error('AnimationManager: Cannot initialize with null skeleton');
        }

        if (!skeleton.bones || skeleton.bones.length === 0) {
            throw new Error('AnimationManager: Skeleton has no bones');
        }

        this.skeleton = skeleton;

        // Validate bone hierarchy
        const rootBones = skeleton.bones.filter(b => !b.getParent());
        if (rootBones.length === 0) {
            console.warn('AnimationManager: Skeleton has no root bone (no bone hierarchy)');
        } else {
            console.log(`✅ Skeleton has ${rootBones.length} root bones, ${skeleton.bones.length} total bones`);
        }

        // Pre-load common animations
        await this.preloadCommonAnimations();

        console.log(`AnimationManager: Initialized for skeleton '${skeleton.name}' with ${skeleton.bones.length} bones`);
    }

    /**
     * Pre-load common animations for faster playback
     */
    private async preloadCommonAnimations(): Promise<void> {
        const animationsToLoad = [
            this.animationSet.idle,
            this.animationSet.walk,
            this.animationSet.run,
            this.animationSet.attack
        ];

        const loadPromises = animationsToLoad.map(name =>
            this.banLoader.loadAnimation(name).catch(e => {
                console.warn(`Failed to preload animation '${name}':`, e);
                return null;
            })
        );

        await Promise.all(loadPromises);
        console.log('AnimationManager: Preloaded common animations');
    }

    /**
     * Load an animation by name
     */
    public async loadAnimation(
        state: AnimationState,
        animationName?: string,
        loop: boolean = true,
        priority: number = 0
    ): Promise<boolean> {
        if (!this.skeleton) {
            console.warn('AnimationManager: No skeleton set');
            return false;
        }

        // Use provided name or get from animation set
        const name = animationName || this.getAnimationNameForState(state);

        // Load animation data
        const animData = await this.banLoader.loadAnimation(name);
        if (!animData) {
            console.warn(`AnimationManager: Failed to load animation '${name}'`);
            return false;
        }

        // Apply to skeleton
        const animationGroup = this.banLoader.applyAnimationToSkeleton(this.skeleton, animData);

        // Store animation data
        this.animations.set(state, {
            name,
            animationGroup,
            loop,
            priority,
            speed: 1.0
        });

        return true;
    }

    /**
     * Get animation name for a state
     */
    private getAnimationNameForState(state: AnimationState): string {
        switch (state) {
            case AnimationState.IDLE: return this.animationSet.idle;
            case AnimationState.WALK: return this.animationSet.walk;
            case AnimationState.RUN: return this.animationSet.run;
            case AnimationState.JUMP: return this.animationSet.jump;
            case AnimationState.ATTACK: return this.animationSet.attack;
            case AnimationState.SKILL: return this.animationSet.skill;
            case AnimationState.HIT: return this.animationSet.hit;
            case AnimationState.DIE: return this.animationSet.die;
            case AnimationState.SIT: return this.animationSet.sit || 'sit';
            case AnimationState.DANCE: return this.animationSet.dance || 'dance';
            case AnimationState.CHEER: return this.animationSet.cheer || 'cheer';
            default: return 'idle';
        }
    }

    /**
     * Play an animation state
     * Validates that skeleton and skinning data are present
     */
    public play(state: AnimationState, force: boolean = false): boolean {
        if (!this.skeleton) {
            console.warn('AnimationManager: No skeleton set');
            return false;
        }

        // Validate skeleton has bones before playing
        if (!this.skeleton.bones || this.skeleton.bones.length === 0) {
            console.error('AnimationManager: Skeleton has no bones - cannot animate');
            return false;
        }

        // Get animation for this state
        const animData = this.animations.get(state);

        if (!animData) {
            console.warn(`AnimationManager: No animation loaded for state '${state}'`);
            return false;
        }

        // Check if we can interrupt current animation
        if (!force && this.currentState === state) {
            return true; // Already playing this animation
        }

        const currentAnim = this.animations.get(this.currentState);
        if (currentAnim && !force && currentAnim.priority > animData.priority) {
            console.warn(`AnimationManager: Cannot interrupt '${this.currentState}' with lower priority '${state}'`);
            return false;
        }

        // Stop current animation
        this.stop();

        // Store previous state
        this.previousState = this.currentState;
        this.currentState = state;

        // Start new animation
        if (animData.loop) {
            animData.animationGroup.play(true);
        } else {
            animData.animationGroup.play(false);

            // Auto-transition back to idle after one-shot animation completes
            animData.animationGroup.onAnimationGroupEndObservable.addOnce(() => {
                if (this.currentState === state) {
                    this.play(AnimationState.IDLE);
                }
            });
        }

        console.log(`AnimationManager: Playing '${state}' on skeleton '${this.skeleton.name}'`);
        return true;
    }

    /**
     * Stop current animation
     */
    public stop(): void {
        const currentAnim = this.animations.get(this.currentState);
        if (currentAnim) {
            currentAnim.animationGroup.stop();
        }
    }

    /**
     * Pause current animation
     */
    public pause(): void {
        const currentAnim = this.animations.get(this.currentState);
        if (currentAnim) {
            currentAnim.animationGroup.pause();
        }
    }

    /**
     * Resume current animation
     */
    public resume(): void {
        const currentAnim = this.animations.get(this.currentState);
        if (currentAnim) {
            currentAnim.animationGroup.play(true);
        }
    }

    /**
     * Set animation speed
     */
    public setSpeed(state: AnimationState, speed: number): void {
        const animData = this.animations.get(state);
        if (animData) {
            animData.speed = speed;
            animData.animationGroup.speedRatio = speed;
        }
    }

    /**
     * Get current animation state
     */
    public getCurrentState(): AnimationState {
        return this.currentState;
    }

    /**
     * Check if currently playing a specific state
     */
    public isPlaying(state: AnimationState): boolean {
        return this.currentState === state;
    }

    /**
     * Check if animation is loaded for a state
     */
    public hasAnimation(state: AnimationState): boolean {
        return this.animations.has(state);
    }

    /**
     * Get animation set
     */
    public getAnimationSet(): AnimationSet {
        return { ...this.animationSet };
    }

    /**
     * Update animation manager (call every frame)
     */
    public update(deltaTime: number): void {
        // Placeholder for any per-frame updates
        // Could handle blending here if we implement animation blending
    }

    /**
     * Dispose of animation manager
     */
    public dispose(): void {
        // Stop all animations
        for (const animData of this.animations.values()) {
            animData.animationGroup.dispose();
        }
        this.animations.clear();
    }

    /**
     * Validate that a mesh can be animated by this manager
     * This checks that the mesh has a skeleton with proper skinning data
     *
     * @param mesh - The mesh to validate
     * @returns Object with validation results
     */
    public validateMeshForAnimation(mesh: any): {
        canAnimate: boolean;
        hasSkeleton: boolean;
        boneCount: number;
        isSkinnedMesh: boolean;
        issues: string[];
    } {
        const issues: string[] = [];
        let hasSkeleton = false;
        let isSkinnedMesh = false;
        const boneCount = mesh.skeleton?.bones?.length || 0;

        // Check for skeleton
        if (mesh.skeleton) {
            hasSkeleton = true;

            if (mesh.skeleton.bones && mesh.skeleton.bones.length > 0) {
                console.log(`✅ Mesh has skeleton '${mesh.skeleton.name}' with ${mesh.skeleton.bones.length} bones`);
            } else {
                issues.push('Skeleton exists but has no bones');
            }
        } else {
            issues.push('Mesh has no skeleton attached');
        }

        // Check if mesh is skinned
        if (mesh.isSkinnedMesh === true) {
            isSkinnedMesh = true;
            console.log(`✅ Mesh is a skinned mesh (vertices will deform with animation)`);
        } else {
            issues.push('Mesh is not a skinned mesh (vertices will NOT deform)');
        }

        // Check for bone influencers (number of bones that can influence each vertex)
        if (mesh.numBoneInfluencers !== undefined && mesh.numBoneInfluencers > 0) {
            console.log(`✅ Mesh has ${mesh.numBoneInfluencers} bone influencers per vertex`);
        } else {
            issues.push('Mesh has no bone influencers (no skinning weights)');
        }

        const canAnimate = hasSkeleton && boneCount > 0;

        if (!canAnimate) {
            console.error(`❌ Mesh cannot be animated:`);
            for (const issue of issues) {
                console.error(`     - ${issue}`);
            }
        }

        return {
            canAnimate,
            hasSkeleton,
            boneCount,
            isSkinnedMesh,
            issues
        };
    }

    /**
     * Get skeleton information for debugging
     */
    public getSkeletonInfo(): {
        name: string;
        boneCount: number;
        bones: Array<{ name: string; hasParent: boolean; children: number }>;
    } | null {
        if (!this.skeleton) {
            return null;
        }

        return {
            name: this.skeleton.name,
            boneCount: this.skeleton.bones.length,
            bones: this.skeleton.bones.map(bone => ({
                name: bone.name,
                hasParent: bone.getParent() !== null,
                children: bone.children?.length || 0
            }))
        };
    }
}
