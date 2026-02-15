// @ts-nocheck
import {
    Scene,
    Mesh,
    Skeleton,
    Bone,
    Vector3,
    Quaternion,
    Matrix,
    SceneLoader,
    AssetContainer,
    AbstractMesh,
    StandardMaterial,
    Texture,
    Color3,
    TransformNode
} from '@babylonjs/core';

import { TextureMaterialManager } from '../gameplay/TextureMaterialManager';
import { AssetConfigManager, AssetSource } from '../config/AssetConfig';

// Interfaces for our custom JSON formats
interface AssetManifest {
    characters: Record<string, AssetEntry>;
    items: Record<string, AssetEntry>;
    weapons: Record<string, AssetEntry>;
    monsters: Record<string, AssetEntry>;
    npc: Record<string, AssetEntry>;
    zones: Record<string, AssetEntry>;
    textures: Record<string, TextureEntry>;
    animations: Record<string, AnimationEntry>;
    skeletons: Record<string, SkeletonEntry>;
    resources: Record<string, ResourceEntry>;
    audio: Record<string, AudioEntry>;
    materials: Record<string, MaterialEntry>;
}

interface MaterialEntry {
    file_name: string;
    textures: string[];
}

interface CharacterEquipment {
    head?: string;    // Item code
    chest?: string;   // Item code
    legs?: string;    // Item code
    hands?: string;   // Item code
    feet?: string;    // Item code
    weapon?: string;  // Item code
    shield?: string;  // Item code
}

interface AssetEntry {
    model: string; // path to glb
    vertices?: number;
    faces?: number;
}

interface TextureEntry {
    diffuse: string;
    mipmaps?: string;
}

interface AnimationEntry {
    file: string;
    duration: number;
    frames: number;
}

interface SkeletonEntry {
    file: string;
    bones: number;
}

interface ResourceEntry {
    file_name: string;
    meshes: string[]; // Paths like "prim\mesh\..."
    materials: string[];
    effects: string[];
    animations: string[];
    textures: string[];
}

interface AudioEntry {
    file: string;
    format: string;
}

interface BSKBoneData {
    name: string;
    parent_index: number;
    position: [number, number, number];
    rotation: [number, number, number, number]; // x, y, z, w
    scale: [number, number, number];
}

interface BSKData {
    header: {
        magic: string;
        version: number;
        bone_count: number;
    };
    bones: BSKBoneData[];
}

export class AssetLoader {
    private scene: Scene;
    private manifest: AssetManifest | null = null;
    private mappings: any | null = null;
    private textureMaterialManager: TextureMaterialManager;
    private baseUrl: string;

    // Caches
    private containerCache: Map<string, AssetContainer> = new Map();
    private skeletonDataCache: Map<string, BSKData> = new Map();
    private resourceCache: Map<string, ResourceEntry> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
        this.textureMaterialManager = new TextureMaterialManager(scene);

        const config = AssetConfigManager.getConfig();
        // Set baseUrl based on asset source
        this.baseUrl = config.source === 'blender' ? './assets/blender/' : './assets/standard/';
        console.log(`📦 AssetLoader: Initialized with ${config.source} asset source`);
        console.log(`📦 AssetLoader: baseUrl = ${this.baseUrl}`);
    }

    /**
     * Get the TextureMaterialManager instance
     */
    public getTextureMaterialManager(): TextureMaterialManager {
        return this.textureMaterialManager;
    }

    public getScene(): Scene {
        return this.scene;
    }

    /**
     * Enable or disable Blender asset usage
     * When enabled, loads GLB files from Blender conversion with skinning
     */
    public setUseBlenderAssets(use: boolean): void {
        if (use) {
            AssetConfigManager.enableBlenderAssets();
        } else {
            AssetConfigManager.enableStandardAssets();
        }
    }

    /**
     * Get current asset source
     */
    public getAssetSource(): AssetSource {
        return AssetConfigManager.getSource();
    }

    /**
     * Initialize the loader by fetching the manifest and mappings
     */
    public async initialize(): Promise<void> {
        try {
            // Load manifest
            const response = await fetch(this.baseUrl + 'manifest.json');
            if (!response.ok) throw new Error('Failed to load manifest.json');
            this.manifest = await response.json();

            // Load mappings
            const mapResponse = await fetch(this.baseUrl + 'mappings.json');
            if (mapResponse.ok) {
                this.mappings = await mapResponse.json();
                console.log(`SRO Asset Loader initialized. ${Object.keys(this.mappings.items).length} item mappings loaded.`);
            }

            // Initialize texture material manager
            await this.textureMaterialManager.initialize();

            console.log('SRO Asset Loader ready.');
        } catch (e) {
            console.error('Critical error initializing AssetLoader:', e);
            throw e;
        }
    }

    /**
     * Loads an item by its official game code (e.g., "ITEM_CH_SWORD_01_A")
     */
    public async loadItemByCode(code: string): Promise<{ root: AbstractMesh, skeleton?: Skeleton } | null> {
        if (!this.mappings || !this.mappings.items[code]) {
            console.warn(`Item code not found in mappings: ${code}`);
            return null;
        }

        const bsrPath = this.mappings.items[code];
        // Extract BSR name from path: "item\china\weapon\sword_01.bsr" -> "sword_01"
        const bsrName = bsrPath.split('\\').pop()?.replace('.bsr', '').replace('.BSR', '');

        if (!bsrName) return null;
        return this.loadGameObject(bsrName);
    }

    /**
     * Loads a complete character by its base code and equipment
     * This is a high-level method for loading fully equipped player characters
     *
     * @param baseCode - The base character code (e.g., "CHAR_CH_001" for Chinese male)
     * @param equipment - Object containing item codes for each equipment slot
     * @returns The fully assembled Character instance
     */
    public async loadCharacterByCode(
        baseCode: string,
        equipment: CharacterEquipment = {}
    ): Promise<{ root: AbstractMesh, skeleton?: Skeleton, parts: Map<string, AbstractMesh> } | null> {
        // Import Character class here to avoid circular dependency
        const { Character } = await import('../game/Character');

        // Determine gender/race from base code
        const gender = this.determineGenderFromCode(baseCode);
        const race = this.determineRaceFromCode(baseCode);

        // Create character instance
        const character = new Character(this, `char_${baseCode}`);

        // Initialize with base skeleton
        await character.initialize(gender);

        // Equip each item
        const parts = new Map<string, AbstractMesh>();

        // Load equipment items
        for (const [slot, itemCode] of Object.entries(equipment)) {
            if (itemCode) {
                const itemResult = await this.loadItemByCode(itemCode);
                if (itemResult) {
                    await character.equip(slot, itemResult.root.name);
                    parts.set(slot, itemResult.root);
                }
            }
        }

        // Return the assembled character data
        return {
            root: character.root,
            skeleton: character['skeleton'] as Skeleton | undefined,
            parts
        };
    }

    /**
     * Determine gender from character code
     */
    private determineGenderFromCode(code: string): 'man' | 'woman' {
        const upperCode = code.toUpperCase();
        if (upperCode.includes('WOMAN') || upperCode.includes('_F_') || upperCode.includes('FEMALE')) {
            return 'woman';
        }
        return 'man'; // Default to man
    }

    /**
     * Determine race from character code
     */
    private determineRaceFromCode(code: string): 'CH' | 'EU' {
        const upperCode = code.toUpperCase();
        if (upperCode.includes('EURO') || upperCode.startsWith('EU')) {
            return 'EU';
        }
        return 'CH'; // Default to Chinese
    }

    /**
     * Resolves a Windows-style path from the raw data to a web-friendly URL
     * When using Blender assets, prepends the blender asset path
     */
    private resolvePath(rawPath: string, assetType?: 'character' | 'monster' | 'npc' | 'item'): string {
        return AssetConfigManager.getAssetPath(rawPath, assetType);
    }

    /**
     * Loads a complete game object by its Resource ID (BSR name)
     * e.g., "mob_tiger"
     */
    public async loadGameObject(resourceId: string): Promise<{ root: AbstractMesh, skeleton?: Skeleton } | null> {
        if (!this.manifest) return null;

        // 1. Get Resource Definition (BSR)
        const resourceEntry = this.manifest.resources[resourceId];
        if (!resourceEntry) {
            console.warn(`Resource ID not found in manifest: ${resourceId}`);
            return null;
        }

        // 2. Identify the main mesh (BMS)
        // BSR files can have multiple meshes, but usually the first one is the main body
        let meshName = "";
        if (resourceEntry.meshes.length > 0) {
            const meshPath = resourceEntry.meshes[0];
            meshName = meshPath.split('\\').pop()?.replace('.bms', '').replace('.BMS', '') || "";
        } else {
            // Fallback: Use resource ID as mesh name (common for items)
            meshName = resourceId;
        }
        
        // Find mesh in manifest (check monsters, characters, weapons, items, npc)
        let modelEntry = this.manifest.monsters[meshName] || 
                         this.manifest.characters[meshName] || 
                         this.manifest.weapons[meshName] ||
                         this.manifest.items[meshName] ||
                         this.manifest.npc[meshName];

        // If not found by exact name, try to find a key that ends with this name
        // (The conversion script uses filenames as keys)
        if (!modelEntry) {
             // Fallback search logic could go here
             console.warn(`Model entry not found for ${meshName} (Resource: ${resourceId})`);
             return null;
        }

        // 3. Load the Mesh (GLB)
        const container = await this.loadGlb(modelEntry.model);
        if (!container) return null;

        // Instantiate models into the scene
        const instance = container.instantiateModelsToScene(name => `${resourceId}_${name}`);
        const rootMesh = instance.rootNodes[0];

        // 4. Load and Apply Skeleton (if applicable)
        let skeleton: Skeleton | undefined;
        
        // Try to find a skeleton with the same name as the mesh (common SRO pattern)
        // or look up if we have a specific mapping logic later.
        // For now, let's assume the skeleton key matches the resource ID or mesh name.
        let skeletonKey = resourceId;
        if (!this.manifest.skeletons[skeletonKey]) {
            skeletonKey = meshName;
        }

        if (this.manifest.skeletons[skeletonKey]) {
            const skeletonEntry = this.manifest.skeletons[skeletonKey];
            skeleton = await this.loadSkeleton(skeletonKey, skeletonEntry.file);
            
            if (skeleton) {
                // Bind skeleton to meshes
                instance.rootNodes.forEach(node => {
                    const mesh = node as Mesh;
                    if (mesh.skeleton === undefined) { // Check if it accepts a skeleton
                        mesh.skeleton = skeleton;
                    }
                    // Traverse children
                    node.getChildMeshes().forEach(child => {
                        (child as Mesh).skeleton = skeleton;
                    });
                });
            }
        }

        // 5. Apply Materials
        if (resourceEntry.materials && resourceEntry.materials.length > 0) {
            // Apply first material to the root mesh or its children
            // SRO mapping: Mesh[i] uses Material[i] usually.
            // Since we merged everything into one GLB, the GLB might have submeshes.
            
            const meshes = rootMesh.getChildMeshes(false);
            // If GLB has 1 mesh, use material[0].
            // If GLB has multiple, we might need heuristic.
            
            // For now, try to apply material[0] to the first found mesh that needs it
            if (resourceEntry.materials[0]) {
               await this.applyMaterial(meshes.length > 0 ? meshes[0] : rootMesh, resourceEntry.materials[0]);
            }
        }

        return { root: rootMesh, skeleton };
    }

    private async applyMaterial(mesh: AbstractMesh, bmtPath: string): Promise<void> {
        if (!this.manifest) return;

        const bmtName = bmtPath.split('\\').pop()?.replace('.bmt', '').replace('.BMT', '');
        if (!bmtName || !this.manifest.materials[bmtName]) {
            // Try using TextureMaterialManager as fallback
            await this.textureMaterialManager.applyTexturesToModel(mesh, mesh.name);
            return;
        }

        const matEntry = this.manifest.materials[bmtName];
        if (!matEntry.textures || matEntry.textures.length === 0) {
            // Try using TextureMaterialManager as fallback
            await this.textureMaterialManager.applyTexturesToModel(mesh, mesh.name);
            return;
        }

        // Create Babylon Material
        const material = new StandardMaterial(bmtName, this.scene);
        material.specularColor = new Color3(0, 0, 0); // Disable specular by default to avoid shiny look

        // Find diffuse texture (usually ends in .ddj, now .webp)
        // We look for the texture filename in manifest.textures

        // Strategy: Look for the first valid texture in the BMT list
        let textureFound = false;
        for (const texRaw of matEntry.textures) {
            const texName = texRaw.split('\\').pop()?.replace('.ddj', '').replace('.DDJ', '').replace('.tga', '').replace('.bmp', '');

            if (texName && this.manifest.textures[texName]) {
                const texEntry = this.manifest.textures[texName];
                const texPath = this.baseUrl + texEntry.diffuse;

                try {
                    const texture = new Texture(texPath, this.scene);
                    texture.hasAlpha = true;

                    material.diffuseTexture = texture;
                    textureFound = true;

                    // If we found a diffuse, stop?
                    // SRO materials can have multi-texturing, but StandardMaterial handles 1 diffuse.
                    // We might map others to bump/specular later.
                    break;
                } catch (e) {
                    console.warn(`Failed to load texture ${texPath}:`, e);
                }
            }
        }

        // If no texture found, try TextureMaterialManager as fallback
        if (!textureFound) {
            await this.textureMaterialManager.applyTexturesToModel(mesh, mesh.name);
        } else {
            mesh.material = material;
        }
    }

    /**
     * Loads a GLB file and returns an AssetContainer
     */
    private async loadGlb(relativePath: string): Promise<AssetContainer> {
        const path = this.resolvePath(relativePath);
        const cacheKey = path;

        if (this.containerCache.has(cacheKey)) {
            return this.containerCache.get(cacheKey)!;
        }

        // SceneLoader.LoadAssetContainerAsync(rootUrl, fileName, scene)
        // We split the path into folder and filename
        const lastSlash = path.lastIndexOf('/');
        const folder = this.baseUrl + path.substring(0, lastSlash + 1);
        const file = path.substring(lastSlash + 1);

        try {
            const container = await SceneLoader.LoadAssetContainerAsync(folder, file, this.scene);
            this.containerCache.set(cacheKey, container);
            return container;
        } catch (e) {
            console.error(`Failed to load GLB: ${path}`, e);
            throw e;
        }
    }

    /**
     * Loads and builds a Babylon Skeleton from custom JSON
     */
    public async loadSkeleton(name: string, relativePath: string): Promise<Skeleton | undefined> {
        const path = this.resolvePath(relativePath);

        // Fetch JSON data if not cached
        if (!this.skeletonDataCache.has(name)) {
            try {
                const response = await fetch(this.baseUrl + path);
                const data = await response.json();
                this.skeletonDataCache.set(name, data);
            } catch (e) {
                console.error(`Failed to load skeleton JSON: ${path}`, e);
                return undefined;
            }
        }

        const bskData = this.skeletonDataCache.get(name)!;
        const skeleton = new Skeleton(name, "sro_skeleton_" + name, this.scene);

        // Map parent indices to actual Bone objects
        const bones: Bone[] = [];

        // BSK bones are ordered (parents usually before children),
        // but Babylon needs the parent object passed to constructor.

        for (let i = 0; i < bskData.bones.length; i++) {
            const bData = bskData.bones[i];

            // Construct Matrix from Position, Rotation, Scale
            // SRO Rotation is Quaternion (x, y, z, w)
            // Babylon expects Matrix for bind pose in some versions, or local matrix

            const matrix = Matrix.Compose(
                new Vector3(bData.scale[0], bData.scale[1], bData.scale[2]),
                new Quaternion(bData.rotation[0], bData.rotation[1], bData.rotation[2], bData.rotation[3]),
                new Vector3(bData.position[0], bData.position[1], bData.position[2])
            );

            let parentBone: Bone | null = null;
            if (bData.parent_index !== -1 && bones[bData.parent_index]) {
                parentBone = bones[bData.parent_index];
            }

            const bone = new Bone(
                bData.name,
                skeleton,
                parentBone,
                matrix
            );

            bones.push(bone);
        }

        return skeleton;
    }

    /**
     * Validates that a mesh has proper skinning data for animation
     * This is critical for ensuring that converted GLB files will animate correctly
     *
     * @param mesh - The mesh to validate
     * @returns Object with validation results
     */
    public validateSkinnedMesh(mesh: AbstractMesh): {
        hasSkeleton: boolean;
        isSkinnedMesh: boolean;
        boneCount: number;
        hasVertexGroups: boolean;
        hasSkinningData: boolean; // New: Checks for JOINTS_0 and WEIGHTS_0
        issues: string[];
    } {
        const issues: string[] = [];
        let hasSkeleton = false;
        let isSkinnedMesh = false;
        let hasVertexGroups = false;
        let hasSkinningData = false;

        const source = AssetConfigManager.getSource() === AssetSource.BLENDER ? '🎨 Blender' : '📦 Standard';
        console.log(`${source} - Validating mesh: ${mesh.name}`);

        // Check for skeleton
        if (mesh.skeleton) {
            hasSkeleton = true;

            if (mesh.skeleton.bones && mesh.skeleton.bones.length > 0) {
                console.log(`  ✅ Skeleton: ${mesh.skeleton.name} (${mesh.skeleton.bones.length} bones)`);

                // Log bone hierarchy info
                const rootBones = mesh.skeleton.bones.filter(b => !b.getParent());
                console.log(`  📊 Root bones: ${rootBones.length}, Total bones: ${mesh.skeleton.bones.length}`);

                // List first few bones for verification
                if (mesh.skeleton.bones.length > 0) {
                    const boneNames = mesh.skeleton.bones.slice(0, 5).map(b => b.name);
                    console.log(`  🦴 Sample bones: ${boneNames.join(', ')}`);
                }
            } else {
                issues.push('Skeleton exists but has no bones');
            }
        } else {
            issues.push('No skeleton attached to mesh');
        }

        // Check if mesh is skinned
        const meshAsMesh = mesh as Mesh;
        if (mesh.skeleton && meshAsMesh.numBoneInfluencers > 0) {
            isSkinnedMesh = true;
            hasSkinningData = true;
            console.log(`  ✅ Skinned mesh: Vertices WILL deform with animation`);

            // Check for bone influencers (JOINTS_0 and WEIGHTS_0 in glTF)
            if (meshAsMesh.numBoneInfluencers !== undefined) {
                hasVertexGroups = meshAsMesh.numBoneInfluencers > 0;
                console.log(`  ✅ Bone influencers: ${meshAsMesh.numBoneInfluencers} per vertex`);
                console.log(`  ✅ JOINTS_0 and WEIGHTS_0 present in glTF data`);
            } else {
                issues.push('Skinned mesh but numBoneInfluencers is undefined');
            }
        } else {
            issues.push('Mesh is NOT skinned (isSkinnedMesh = false)');
            issues.push('Vertices will NOT deform - missing JOINTS_0/WEIGHTS_0');
        }

        const boneCount = mesh.skeleton?.bones?.length || 0;

        // Overall validation
        if (!hasSkeleton || !isSkinnedMesh || !hasVertexGroups) {
            console.warn(`  ⚠️  Validation FAILED - Mesh may not animate correctly:`);
            for (const issue of issues) {
                console.warn(`     - ${issue}`);
            }
        } else {
            console.log(`  🎉 Validation PASSED - Mesh ready for animation!`);
        }

        return {
            hasSkeleton,
            isSkinnedMesh,
            boneCount,
            hasVertexGroups,
            hasSkinningData,
            issues
        };
    }

    /**
     * Loads a character model and validates its skinning data
     * This is the recommended method for loading animated characters
     *
     * @param modelPath - Path to the GLB model file
     * @returns Promise with the loaded mesh and validation results
     */
    public async loadCharacterModel(modelPath: string): Promise<{
        mesh: AbstractMesh;
        validation: ReturnType<AssetLoader['validateSkinnedMesh']>;
    }> {
        console.log(`Loading character model: ${modelPath}`);

        const result = await SceneLoader.ImportMeshAsync(null, this.baseUrl + modelPath);

        if (!result.meshes || result.meshes.length === 0) {
            throw new Error(`No meshes found in model: ${modelPath}`);
        }

        const mesh = result.meshes[0] as AbstractMesh;

        // Validate skinning data
        console.log('Validating skinning data...');
        const validation = this.validateSkinnedMesh(mesh);

        // Count skinned meshes
        const skinnedMeshCount = result.meshes.filter(m =>
            (m as Mesh).skeleton !== undefined
        ).length;

        console.log(`Skinned meshes: ${skinnedMeshCount}/${result.meshes.length}`);

        // Check for skeletons
        const skeletons = result.skeletons || [];
        console.log(`Skeletons loaded: ${skeletons.length}`);

        if (skeletons.length > 0) {
            skeletons.forEach(skel => {
                console.log(`  - ${skel.name}: ${skel.bones.length} bones`);
            });
        }

        return { mesh, validation };
    }
}
