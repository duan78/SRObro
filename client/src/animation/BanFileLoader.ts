/**
 * BanFileLoader
 *
 * Loads .ban animation files from Silkroad Online
 * .ban files contain skeletal animation data (keyframes for bones)
 *
 * This loader provides the infrastructure for parsing .ban files
 * and converting them to Babylon.js animations.
 */

import { Scene, Animation, AnimationGroup, Skeleton } from '@babylonjs/core';

/**
 * Structure representing a bone animation track
 */
interface BoneAnimationTrack {
    boneName: string;
    keyframes: BoneKeyframe[];
}

/**
 * Individual keyframe for a bone
 */
interface BoneKeyframe {
    frame: number;
    position: [number, number, number];  // x, y, z
    rotation: [number, number, number, number];  // quaternion x, y, z, w
    scale: [number, number, number];  // x, y, z
}

/**
 * Parsed .ban file structure
 */
interface BanAnimationData {
    name: string;
    duration: number;        // in seconds
    frameRate: number;       // frames per second
    totalFrames: number;
    tracks: BoneAnimationTrack[];
}

/**
 * BanFileLoader class
 */
export class BanFileLoader {
    private scene: Scene;
    private baseUrl: string = '/assets/animations/';

    // Cache for loaded animations
    private animationCache: Map<string, BanAnimationData> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Load a .ban animation file
     * @param animationName - Name of the animation (without .ban extension)
     * @returns Parsed animation data or null if failed
     */
    public async loadAnimation(animationName: string): Promise<BanAnimationData | null> {
        // Check cache first
        if (this.animationCache.has(animationName)) {
            return this.animationCache.get(animationName)!;
        }

        try {
            // Try to load JSON converted version first
            const jsonPath = `${this.baseUrl}${animationName}.json`;
            const response = await fetch(jsonPath);

            if (!response.ok) {
                console.warn(`BanFileLoader: Animation file not found: ${jsonPath}`);
                return null;
            }

            const data = await response.json();

            // Validate and parse the animation data
            const animationData = this.parseAnimationData(data, animationName);

            // Cache it
            this.animationCache.set(animationName, animationData);

            console.log(`BanFileLoader: Loaded animation '${animationName}' (${animationData.totalFrames} frames)`);
            return animationData;

        } catch (error) {
            console.error(`BanFileLoader: Failed to load animation '${animationName}':`, error);
            return null;
        }
    }

    /**
     * Parse raw JSON animation data into structured format
     */
    private parseAnimationData(data: any, animationName: string): BanAnimationData {
        // The JSON format will depend on how we convert .ban files
        // For now, we'll support a flexible format

        const duration: number = data.duration || 1.0;
        const frameRate: number = data.frameRate || 30;
        const totalFrames: number = data.totalFrames || Math.floor(duration * frameRate);
        const tracks: BoneAnimationTrack[] = [];

        // Parse animation tracks
        if (data.tracks && Array.isArray(data.tracks)) {
            for (const track of data.tracks) {
                tracks.push({
                    boneName: track.boneName || track.bone || 'unknown',
                    keyframes: track.keyframes || []
                });
            }
        }

        return {
            name: animationName,
            duration,
            frameRate,
            totalFrames,
            tracks
        };
    }

    /**
     * Apply animation to a skeleton
     * Creates Babylon.js Animation objects for each bone
     */
    public applyAnimationToSkeleton(
        skeleton: Skeleton,
        animationData: BanAnimationData
    ): AnimationGroup {
        const animationGroup = new AnimationGroup(animationData.name, this.scene);

        // For each bone in the skeleton
        for (let boneIndex = 0; boneIndex < skeleton.bones.length; boneIndex++) {
            const bone = skeleton.bones[boneIndex];
            const boneName = bone.name;

            // Find animation track for this bone
            const track = animationData.tracks.find(t => t.boneName === boneName);

            if (!track || track.keyframes.length === 0) {
                continue; // No animation for this bone
            }

            // Create keyframe arrays for Babylon animations
            const positionKeys: { frame: number; value: number[] }[] = [];
            const rotationKeys: { frame: number; value: number[] }[] = [];
            const scalingKeys: { frame: number; value: number[] }[] = [];

            for (const keyframe of track.keyframes) {
                const frame = keyframe.frame;
                positionKeys.push({ frame, value: keyframe.position });
                rotationKeys.push({ frame, value: keyframe.rotation });
                scalingKeys.push({ frame, value: keyframe.scale });
            }

            // Create Babylon animations
            if (positionKeys.length > 0) {
                const positionAnim = new Animation(
                    `${boneName}_position`,
                    'position',
                    animationData.frameRate,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CYCLE
                );
                positionAnim.setKeys(positionKeys);
                bone.animations.push(positionAnim);
                animationGroup.addTargetedAnimation(positionAnim, bone);
            }

            if (rotationKeys.length > 0) {
                const rotationAnim = new Animation(
                    `${boneName}_rotation`,
                    'rotationQuaternion',
                    animationData.frameRate,
                    Animation.ANIMATIONTYPE_QUATERNION,
                    Animation.ANIMATIONLOOPMODE_CYCLE
                );
                rotationAnim.setKeys(rotationKeys);
                bone.animations.push(rotationAnim);
                animationGroup.addTargetedAnimation(rotationAnim, bone);
            }

            if (scalingKeys.length > 0) {
                const scalingAnim = new Animation(
                    `${boneName}_scaling`,
                    'scaling',
                    animationData.frameRate,
                    Animation.ANIMATIONTYPE_VECTOR3,
                    Animation.ANIMATIONLOOPMODE_CYCLE
                );
                scalingAnim.setKeys(scalingKeys);
                bone.animations.push(scalingAnim);
                animationGroup.addTargetedAnimation(scalingAnim, bone);
            }
        }

        console.log(`BanFileLoader: Applied animation '${animationData.name}' to skeleton with ${animationGroup.targetedAnimations.length} bone animations`);

        return animationGroup;
    }

    /**
     * Clear animation cache
     */
    public clearCache(): void {
        this.animationCache.clear();
    }

    /**
     * Get cached animation data
     */
    public getCachedAnimations(): string[] {
        return Array.from(this.animationCache.keys());
    }
}
