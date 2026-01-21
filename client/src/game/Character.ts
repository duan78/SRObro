import { Mesh, Skeleton, AbstractMesh, Vector3 } from "@babylonjs/core";
import { AssetLoader } from "../core/AssetLoader";

/**
 * Equipment slot types
 */
export type EquipmentSlot = 'head' | 'chest' | 'legs' | 'hands' | 'feet' | 'weapon' | 'shield' | 'shoulder' | 'accessory1' | 'accessory2';

/**
 * Equipment data structure
 */
export interface EquipmentData {
    slot: EquipmentSlot;
    itemCode: string;
    resourceId?: string;
}

export class Character {
    private assetLoader: AssetLoader;
    public root: AbstractMesh;
    private skeleton: Skeleton | undefined;

    // Parts (slot name -> mesh)
    // e.g. "head", "chest", "legs", "hands", "feet", "weapon"
    private parts: Map<EquipmentSlot, AbstractMesh> = new Map();

    // Character info
    public readonly name: string;
    public readonly gender: 'man' | 'woman';
    public readonly race: 'CH' | 'EU';

    constructor(assetLoader: AssetLoader, name: string, gender: 'man' | 'woman' = 'man', race: 'CH' | 'EU' = 'CH') {
        this.assetLoader = assetLoader;
        this.name = name;
        this.gender = gender;
        this.race = race;
        this.root = new Mesh("character_" + name, assetLoader.getScene());
    }

    /**
     * Initialize the character with skeleton
     */
    public async initialize(gender: 'man' | 'woman' = 'man'): Promise<void> {
        // Load base skeleton
        const skeletonName = gender === 'man' ? 'europeman_skel' : 'europewoman_skel';

        // We use loadSkeleton directly
        this.skeleton = await this.assetLoader.loadSkeleton(skeletonName, `skeletons/${skeletonName}.json`);

        if (this.skeleton) {
            console.log(`Character ${this.root.name} skeleton loaded: ${skeletonName}`);
        } else {
            console.error(`Failed to load skeleton: ${skeletonName}`);
        }
    }

    /**
     * Equip an item to a specific slot
     */
    public async equip(slot: EquipmentSlot, resourceId: string): Promise<void> {
        // Remove existing item in slot
        if (this.parts.has(slot)) {
            const oldPart = this.parts.get(slot)!;
            oldPart.dispose();
            this.parts.delete(slot);
        }

        if (!resourceId) return;

        // Load new item
        const entity = await this.assetLoader.loadGameObject(resourceId);
        if (entity) {
            const mesh = entity.root;

            // Parent to character root
            mesh.parent = this.root;
            mesh.position = Vector3.Zero(); // Reset relative position

            // Apply character skeleton if the mesh supports it
            // Note: Since our GLB export currently lacks JOINTS/WEIGHTS, this skinning won't deform the mesh yet.
            // But we set it up for when the assets are fixed.
            if (this.skeleton) {
                // Apply to root and children
                if (mesh instanceof Mesh) mesh.skeleton = this.skeleton;
                mesh.getChildMeshes().forEach(m => {
                    if (m instanceof Mesh) m.skeleton = this.skeleton;
                });
            }

            this.parts.set(slot, mesh);
            console.log(`Equipped ${resourceId} to ${slot}`);
        } else {
            console.warn(`Failed to load equipment: ${resourceId}`);
        }
    }

    /**
     * Equip an item by its official game code (e.g., "ITEM_CH_SWORD_01_A")
     */
    public async equipByCode(slot: EquipmentSlot, itemCode: string): Promise<void> {
        const result = await this.assetLoader.loadItemByCode(itemCode);
        if (result) {
            // Extract resource ID from the loaded object
            await this.equip(slot, result.root.name);
        } else {
            console.warn(`Failed to load item by code: ${itemCode}`);
        }
    }

    /**
     * Equip multiple items at once
     */
    public async equipMultiple(equipment: Partial<Record<EquipmentSlot, string>>): Promise<void> {
        for (const [slot, resourceId] of Object.entries(equipment)) {
            if (resourceId) {
                await this.equip(slot as EquipmentSlot, resourceId);
            }
        }
    }

    /**
     * Equip multiple items by their game codes
     */
    public async equipMultipleByCode(equipment: Partial<Record<EquipmentSlot, string>>): Promise<void> {
        for (const [slot, itemCode] of Object.entries(equipment)) {
            if (itemCode) {
                await this.equipByCode(slot as EquipmentSlot, itemCode);
            }
        }
    }

    /**
     * Get the skeleton
     */
    public getSkeleton(): Skeleton | undefined {
        return this.skeleton;
    }

    /**
     * Get all equipped parts
     */
    public getParts(): Map<EquipmentSlot, AbstractMesh> {
        return this.parts;
    }

    /**
     * Get a specific equipped part
     */
    public getPart(slot: EquipmentSlot): AbstractMesh | undefined {
        return this.parts.get(slot);
    }

    /**
     * Check if a slot is equipped
     */
    public hasPart(slot: EquipmentSlot): boolean {
        return this.parts.has(slot);
    }

    /**
     * Unequip an item from a slot
     */
    public unequip(slot: EquipmentSlot): void {
        if (this.parts.has(slot)) {
            const oldPart = this.parts.get(slot)!;
            oldPart.dispose();
            this.parts.delete(slot);
            console.log(`Unequipped ${slot}`);
        }
    }

    /**
     * Unequip all items
     */
    public unequipAll(): void {
        for (const slot of this.parts.keys()) {
            this.unequip(slot);
        }
    }

    /**
     * Dispose of the character and all its parts
     */
    public dispose(): void {
        this.unequipAll();
        this.root.dispose();
        if (this.skeleton) {
            this.skeleton.dispose();
        }
    }

    /**
     * Show/hide the character
     */
    public setVisible(visible: boolean): void {
        this.root.setEnabled(visible);
    }

    /**
     * Set character position
     */
    public setPosition(position: Vector3): void {
        this.root.position = position;
    }

    /**
     * Get character position
     */
    public getPosition(): Vector3 {
        return this.root.position.clone();
    }

    /**
     * Set character rotation
     */
    public setRotation(rotation: Vector3): void {
        this.root.rotation = rotation;
    }

    /**
     * Set character scaling
     */
    public setScaling(scaling: Vector3): void {
        this.root.scaling = scaling;
    }
}
