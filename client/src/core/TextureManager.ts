/**
 * TextureManager - Gestionnaire de textures pour assets SRObro
 *
 * Gère le chargement et le mapping des textures WebP pour les modèles 3D
 */

import {
    Scene,
    Texture,
    StandardMaterial,
    Color3,
    Material
} from '@babylonjs/core';

/**
 * Configuration de mapping pour les textures
 * Associe les noms de matériaux aux chemins de textures WebP
 */
interface TextureMapping {
    materialName: string;
    texturePath: string;
    normalMapPath?: string;
}

export class TextureManager {
    private scene: Scene;
    private textureCache: Map<string, Texture> = new Map();
    private materialCache: Map<string, StandardMaterial> = new Map();

    // Base URL pour les textures
    private readonly TEXTURE_BASE_URL = './assets/textures_webp';

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Charge une texture depuis le cache ou depuis le fichier
     */
    async loadTexture(relativePath: string): Promise<Texture | null> {
        // Vérifier le cache
        if (this.textureCache.has(relativePath)) {
            return this.textureCache.get(relativePath)!;
        }

        try {
            const fullPath = `${this.TEXTURE_BASE_URL}/${relativePath}`;
            const texture = new Texture(fullPath, this.scene);

            // Optimiser la texture
            texture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
            texture.anisotropicFilteringLevel = 4;

            // Ajouter au cache
            this.textureCache.set(relativePath, texture);

            return texture;
        } catch (error) {
            console.warn(`⚠️ Failed to load texture: ${relativePath}`, error);
            return null;
        }
    }

    /**
     * Applique les textures à un matériau basé sur le nom du mesh
     */
    async applyTexturesToMesh(meshName: string, material: StandardMaterial): Promise<void> {
        // Déterminer le type de mesh
        const texturePath = this.getTexturePathForMesh(meshName);

        if (!texturePath) {
            return; // Pas de texture pour ce mesh
        }

        // Charger la texture diffuse
        const diffuseTexture = await this.loadTexture(texturePath);
        if (diffuseTexture) {
            material.diffuseTexture = diffuseTexture;
        }

        // Essayer de charger une normal map
        const normalMapPath = this.getNormalMapPath(meshName);
        if (normalMapPath) {
            const normalTexture = await this.loadTexture(normalMapPath);
            if (normalTexture) {
                material.bumpTexture = normalTexture;
            }
        }
    }

    /**
     * Obtient le chemin de texture pour un mesh donné
     * Basé sur les conventions de nommage Silkroad
     */
    private getTexturePathForMesh(meshName: string): string | null {
        // Personnages masculins
        if (meshName.includes('avatar_m_')) {
            const charName = meshName.replace('avatar_m_', '').replace('_Mesh', '');
            return `prim/avatar_m_${charName}.webp`;
        }

        // Personnages féminins
        if (meshName.includes('avatar_w_')) {
            const charName = meshName.replace('avatar_w_', '').replace('_Mesh', '');
            return `prim/avatar_w_${charName}.webp`;
        }

        // Chinois masculin
        if (meshName.includes('chinaman_')) {
            const charName = meshName.replace('chinaman_', '').replace('_Mesh', '');
            return `prim/chinaman_${charName}.webp`;
        }

        // Chinoise féminine
        if (meshName.includes('chinawoman_')) {
            const charName = meshName.replace('chinawoman_', '').replace('_Mesh', '');
            return `prim/chinawoman_${charName}.webp`;
        }

        // Monstres
        if (meshName.includes('mob_')) {
            const mobName = meshName.replace('mob_', '').replace('_Mesh', '');
            return `mob/${mobName}.webp`;
        }

        // NPCs
        if (meshName.includes('npc_')) {
            const npcName = meshName.replace('npc_', '').replace('_Mesh', '');
            return `npc/${npcName}.webp`;
        }

        return null;
    }

    /**
     * Obtient le chemin de la normal map pour un mesh
     */
    private getNormalMapPath(meshName: string): string | null {
        // Les normal maps suivent souvent la convention _n ou _norm
        const texturePath = this.getTexturePathForMesh(meshName);

        if (!texturePath) {
            return null;
        }

        // Remplacer l'extension par _n.webp
        const basePath = texturePath.replace('.webp', '');
        return `${basePath}_n.webp`;
    }

    /**
     * Crée un matériau standard avec configuration optimisée
     */
    createStandardMaterial(materialName: string, baseColor: Color3 = new Color3(1, 1, 1)): StandardMaterial {
        // Vérifier le cache
        if (this.materialCache.has(materialName)) {
            return this.materialCache.get(materialName)!;
        }

        const material = new StandardMaterial(materialName, this.scene);

        // Configuration par défaut
        material.diffuseColor = baseColor;
        material.specularColor = new Color3(0.2, 0.2, 0.2);
        material.emissiveColor = new Color3(0, 0, 0);
        material.ambientColor = new Color3(0.3, 0.3, 0.3);

        // Optimisations
        material.freeze(); // Optimisation : ne pas mettre à jour chaque frame

        // Ajouter au cache
        this.materialCache.set(materialName, material);

        return material;
    }

    /**
     * Applique automatiquement les textures à tous les meshes d'un modèle
     */
    async applyTexturesToModel(rootMesh: any): Promise<void> {
        if (!rootMesh) {
            return;
        }

        // Parcourir tous les meshes enfants
        rootMesh.getChildMeshes().forEach(async (mesh: any) => {
            if (mesh.material) {
                await this.applyTexturesToMesh(mesh.name, mesh.material);
            }
        });
    }

    /**
     * Nettoie les ressources (textures et matériaux)
     */
    dispose(): void {
        // Nettoyer les textures
        this.textureCache.forEach(texture => texture.dispose());
        this.textureCache.clear();

        // Nettoyer les matériaux
        this.materialCache.forEach(material => material.dispose());
        this.materialCache.clear();
    }

    /**
     * Précharge une liste de textures
     */
    async preloadTextures(texturePaths: string[]): Promise<void> {
        const promises = texturePaths.map(path => this.loadTexture(path));
        await Promise.all(promises);
    }

    /**
     * Obtient des statistiques sur le cache
     */
    getCacheStats(): { textures: number; materials: number } {
        return {
            textures: this.textureCache.size,
            materials: this.materialCache.size
        };
    }
}

/**
 * Helper pour créer un matériau texturé pour un personnage
 */
export async function createTexturedCharacterMaterial(
    meshName: string,
    textureManager: TextureManager,
    baseColor?: Color3
): Promise<StandardMaterial> {
    const material = textureManager.createStandardMaterial(
        `${meshName}_material`,
        baseColor
    );

    await textureManager.applyTexturesToMesh(meshName, material);

    return material;
}
