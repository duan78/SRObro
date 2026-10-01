/**
 * Système de chargement de modèles GLB pour les maps
 * Gère le chargement intelligent des modèles 3D basé sur les modelIds
 */

import { Scene, Mesh, Vector3, SceneLoader, TransformNode, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

interface ModelMapping {
    modelId: number;
    glbPath: string;
    resourceType: string;
}

interface ModelCache {
    container: any;
    rootMesh: Mesh;
}

export class GLModelLoader {
    private scene: Scene;
    private mappingCache: Map<number, ModelMapping> = new Map();
    private modelCache: Map<string, ModelCache> = new Map();
    private baseUrl: string = 'assets/';
    private fallbackModels: string[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Initialize le loader en chargeant le mapping
     */
    async initialize(): Promise<void> {
        try {
            // Charger le mapping modelId → GLB
            const response = await fetch(this.baseUrl + 'modelid-glb-mapping.json');
            if (response.ok) {
                const data = await response.json();
                for (const [modelIdStr, mapping] of Object.entries(data.mappings)) {
                    this.mappingCache.set(parseInt(modelIdStr), mapping as ModelMapping);
                }
                console.log(`✅ ${this.mappingCache.size} modelIds chargés`);
            }

            // Charger la liste des modèles disponibles pour fallback
            const fallbackResponse = await fetch(this.baseUrl + 'glb Converted/manifest.json');
            if (fallbackResponse.ok) {
                const manifest = await fallbackResponse.json();
                this.fallbackModels = manifest.models || [];
                console.log(`✅ ${this.fallbackModels.length} modèles de fallback disponibles`);
            }

        } catch (e) {
            console.warn('⚠️  Impossible de charger le mapping, utilisation de fallbacks:', e);

            // Fallback: scanner directement les GLB
            await this.scanAvailableModels();
        }
    }

    /**
     * Scanne les modèles GLB disponibles
     */
    private async scanAvailableModels(): Promise<void> {
        try {
            // Pour l'instant, utiliser une liste statique de modèles courants
            // Plus tard, on pourrait générer ça dynamiquement
            this.fallbackModels = [
                'glb Converted/prim/mesh/bldg/europe/castle_test.glb',
                'glb Converted/prim/mesh/bldg/europe/constantinople/ayasofya/euro_constan_ayasofya01.glb',
                'glb Converted/prim/avatar_m_nasrun.glb',
            ];

            console.log(`✅ ${this.fallbackModels.length} modèles fallback chargés`);
        } catch (e) {
            console.warn('⚠️  Erreur scan modèles:', e);
        }
    }

    /**
     * Charge un modèle 3D par son modelId
     */
    async loadModelById(modelId: number, position: Vector3, rotation?: Vector3, scale?: Vector3): Promise<Mesh | null> {
        // 1. Chercher dans le mapping
        if (this.mappingCache.has(modelId)) {
            const mapping = this.mappingCache.get(modelId)!;
            if (mapping.glbPath) {
                return this.loadModel(mapping.glbPath, position, rotation, scale);
            }
        }

        // 2. Fallback: utiliser un modèle aléatoire de la liste
        const fallbackModel = this.fallbackModels[modelId % this.fallbackModels.length];
        if (fallbackModel) {
            console.log(`ℹ️  ModelId ${modelId} non mappé, utilisation de fallback`);
            return this.loadModel(fallbackModel, position, rotation, scale);
        }

        // 3. Dernier recours: créer un marqueur simple
        return this.createPlaceholder(modelId, position);
    }

    /**
     * Charge un modèle GLB depuis un chemin
     */
    private async loadModel(
        glbPath: string,
        position: Vector3,
        rotation?: Vector3,
        scale?: Vector3
    ): Promise<Mesh | null> {
        const fullPath = this.baseUrl + glbPath;

        try {
            // Utiliser SceneLoader pour importer le GLB
            const result = await SceneLoader.ImportMeshAsync(null, this.baseUrl, glbPath, this.scene);

            if (result.meshes.length === 0) {
                console.warn(`⚠️  Aucun mesh trouvé dans ${glbPath}`);
                return null;
            }

            // Le premier mesh est généralement la racine
            const rootMesh = result.meshes[0] as Mesh;

            // Appliquer la transformation
            rootMesh.position = position;

            if (rotation) {
                rootMesh.rotation = rotation;
            }

            if (scale) {
                rootMesh.scaling = scale;
            } else {
                // Échelle par défaut pour les objets de map
                rootMesh.scaling = new Vector3(1, 1, 1);
            }

            // Activer les collisions
            rootMesh.checkCollisions = true;

            console.log(`✅ Modèle chargé: ${glbPath}`);
            return rootMesh;

        } catch (e) {
            console.error(`❌ Erreur chargement modèle ${glbPath}:`, e);
            return null;
        }
    }

    /**
     * Crée un marqueur placeholder (cube coloré) pour les modelId inconnus
     */
    private createPlaceholder(modelId: number, position: Vector3): Mesh {
        const placeholder = MeshBuilder.CreateBox(
            `placeholder_${modelId}`,
            { size: 2 },
            this.scene
        );

        placeholder.position = position;

        // Couleur basée sur le modelId (pour variabilité visuelle)
        const hue = (modelId * 137.508) % 360; // Golden ratio pour distribution
        const color = Color3.FromHSV(hue / 360, 0.7, 0.9);

        const material = new StandardMaterial(`placeholderMat_${modelId}`, this.scene);
        material.diffuseColor = color;
        material.specularColor = new Color3(0.1, 0.1, 0.1);
        placeholder.material = material;

        console.log(`ℹ️  Placeholder créé pour modelId ${modelId}`);
        return placeholder;
    }

    /**
     * Libère les ressources
     */
    dispose(): void {
        this.modelCache.forEach(cache => {
            if (cache.rootMesh) {
                cache.rootMesh.dispose();
            }
        });
        this.modelCache.clear();
    }
}
