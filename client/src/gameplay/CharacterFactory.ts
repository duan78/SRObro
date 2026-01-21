/**
 * CharacterFactory
 *
 * Factory class for creating fully assembled characters
 * Combines skeleton, equipment, animations, and controller into a complete character entity
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Character, EquipmentSlot } from '../game/Character';
import { AssetLoader } from '../core/AssetLoader';
import { AnimationManager, AnimationState } from '../animation';
import { CharacterController } from './CharacterController';

/**
 * Character configuration
 */
export interface CharacterConfig {
    name: string;
    gender: 'man' | 'woman';
    race: 'CH' | 'EU';
    baseCode?: string;        // Optional: Base character code for loading presets

    // Equipment (item codes)
    equipment?: Partial<Record<EquipmentSlot, string>>;

    // Initial state
    position?: Vector3;
    scale?: Vector3;

    // Animation set (optional overrides)
    animationSet?: Record<string, string>;

    // Controller config
    controllerEnabled?: boolean;
}

/**
 * Fully assembled character
 */
export interface AssembledCharacter {
    character: Character;
    animationManager: AnimationManager;
    controller: CharacterController | null;

    // Helper methods
    equip: (slot: EquipmentSlot, itemCode: string) => Promise<void>;
    moveTo: (position: Vector3) => void;
    playAnimation: (state: AnimationState) => boolean;
    dispose: () => void;
}

/**
 * CharacterFactory class
 */
export class CharacterFactory {
    private scene: Scene;
    private assetLoader: AssetLoader;

    // Cache for created characters
    private characterCache: Map<string, AssembledCharacter> = new Map();

    constructor(scene: Scene, assetLoader: AssetLoader) {
        this.scene = scene;
        this.assetLoader = assetLoader;
    }

    /**
     * Create a fully assembled character
     */
    public async createCharacter(config: CharacterConfig): Promise<AssembledCharacter> {
        const {
            name,
            gender,
            race,
            equipment = {},
            position = Vector3.Zero(),
            scale = new Vector3(1, 1, 1),
            animationSet,
            controllerEnabled = true
        } = config;

        console.log(`CharacterFactory: Creating character '${name}' (${race} ${gender})`);

        // 1. Create base character
        const character = new Character(this.assetLoader, name, gender, race);

        // 2. Initialize with skeleton
        await character.initialize(gender);

        // 3. Equip items
        if (Object.keys(equipment).length > 0) {
            await character.equipMultipleByCode(equipment);
            console.log(`CharacterFactory: Equipped ${Object.keys(equipment).length} items`);
        }

        // 4. Set initial transform
        character.setPosition(position);
        character.setScaling(scale);

        // 5. Create animation manager
        const animManager = new AnimationManager(this.scene, animationSet);

        // Initialize animation manager with skeleton
        const skeleton = character.getSkeleton();
        if (skeleton) {
            await animManager.initialize(skeleton);

            // Load basic animations
            await this.loadBasicAnimations(animManager, race, gender);

            // Start idle animation
            animManager.play(AnimationState.IDLE);
        }

        // 6. Create controller if enabled
        let controller: CharacterController | null = null;
        if (controllerEnabled) {
            controller = new CharacterController(this.scene, character.root, animManager);
        }

        // 7. Create assembled character object with helper methods
        const assembled: AssembledCharacter = {
            character,
            animationManager: animManager,
            controller,

            // Helper methods
            equip: async (slot: EquipmentSlot, itemCode: string) => {
                await character.equipByCode(slot, itemCode);
            },

            moveTo: (pos: Vector3) => {
                character.setPosition(pos);
                if (controller) {
                    controller.setPosition(pos);
                }
            },

            playAnimation: (state: AnimationState) => {
                return animManager.play(state);
            },

            dispose: () => {
                if (controller) {
                    controller.dispose();
                }
                animManager.dispose();
                character.dispose();
            }
        };

        // Cache the character
        this.characterCache.set(name, assembled);

        console.log(`CharacterFactory: Character '${name}' created successfully`);

        return assembled;
    }

    /**
     * Load basic animations for a character
     */
    private async loadBasicAnimations(
        animManager: AnimationManager,
        race: string,
        gender: string
    ): Promise<void> {
        // Animation names follow a pattern based on race and gender
        // For now, we'll load a basic set

        const animations = [
            { state: AnimationState.IDLE, name: 'idle' },
            { state: AnimationState.WALK, name: 'walk' },
            { state: AnimationState.RUN, name: 'run' },
            { state: AnimationState.JUMP, name: 'jump' },
            { state: AnimationState.ATTACK, name: 'attack' }
        ];

        // Try to load each animation
        const loadPromises = animations.map(async ({ state, name }) => {
            try {
                const animName = `${race.toLowerCase()}_${gender}_${name}`;
                await animManager.loadAnimation(state, animName, true, 0);
            } catch (e) {
                // Try fallback animation names
                try {
                    await animManager.loadAnimation(state, name, true, 0);
                } catch (e2) {
                    console.warn(`Failed to load animation '${name}' for ${race} ${gender}`);
                }
            }
        });

        await Promise.all(loadPromises);
    }

    /**
     * Create a player character (interactive)
     */
    public async createPlayer(config: CharacterConfig): Promise<AssembledCharacter> {
        return this.createCharacter({
            ...config,
            controllerEnabled: true
        });
    }

    /**
     * Create an NPC character (non-interactive)
     */
    public async createNPC(config: CharacterConfig): Promise<AssembledCharacter> {
        return this.createCharacter({
            ...config,
            controllerEnabled: false
        });
    }

    /**
     * Get a cached character by name
     */
    public getCharacter(name: string): AssembledCharacter | undefined {
        return this.characterCache.get(name);
    }

    /**
     * Remove a character from cache and dispose it
     */
    public destroyCharacter(name: string): boolean {
        const character = this.characterCache.get(name);
        if (character) {
            character.dispose();
            this.characterCache.delete(name);
            return true;
        }
        return false;
    }

    /**
     * Clear all cached characters
     */
    public destroyAll(): void {
        for (const [name, character] of this.characterCache) {
            character.dispose();
        }
        this.characterCache.clear();
    }

    /**
     * Get count of cached characters
     */
    public getCharacterCount(): number {
        return this.characterCache.size;
    }
}
