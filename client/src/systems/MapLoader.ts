/**
 * Système de chargement de maps pour Babylon.js
 * Charge les heightmaps et les objets de placement
 */

import { Scene, Vector3, Color3, DynamicTexture, MeshBuilder, StandardMaterial, VertexBuffer } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { GLModelLoader } from './GLModelLoader';

interface HeightmapData {
    metadata: {
        source: string;
        width: number;
        height: number;
        min: number;
        max: number;
    };
    data: number[][];
}

interface MapObject {
    id: number;
    modelId: number;
    position: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
}

interface ObjectFile {
    header: string;
    objectCount: number;
    objects: MapObject[];
}

interface MapData {
    mapId: string;
    heightmap: HeightmapData;
    objects: ObjectFile;
}

export class MapLoader {
    private scene: Scene;
    private loadedMaps: Map<string, Mesh> = new Map();
    private modelLoader: GLModelLoader;

    constructor(scene: Scene) {
        this.scene = scene;
        this.modelLoader = new GLModelLoader(scene);
    }

    /**
     * Initialize le MapLoader
     */
    async initialize(): Promise<void> {
        await this.modelLoader.initialize();
        console.log('✅ MapLoader initialisé');
    }

    /**
     * Charge une map complète depuis les fichiers JSON
     */
    async loadMap(mapId: string): Promise<{ ground: Mesh; objects: Mesh[] }> {
        console.log(`🗺️  Chargement de la map ${mapId}...`);

        try {
            // Charger le heightmap
            const heightmapPath = `assets/maps_heightmap/${mapId}/${mapId}.json`;
            const heightmapResponse = await fetch(heightmapPath);
            if (!heightmapResponse.ok) {
                throw new Error(`Heightmap not found: ${heightmapPath}`);
            }
            const heightmap: HeightmapData = await heightmapResponse.json();

            // Charger les objets
            const objectsPath = `assets/maps_objects/${mapId}/${mapId}.o2.json`;
            const objectsResponse = await fetch(objectsPath);
            const objects: ObjectFile = objectsResponse.ok ? await objectsResponse.json() : { header: '', objectCount: 0, objects: [] };

            console.log(`   ✅ Heightmap: ${heightmap.metadata.width}x${heightmap.metadata.height}`);
            console.log(`   ✅ Objets: ${objects.objectCount}`);

            // Créer le terrain depuis le heightmap
            const ground = this.createGroundFromHeightmap(mapId, heightmap);

            // Placer les objets
            const objectMeshes = await this.placeObjects(objects);

            this.loadedMaps.set(mapId, ground);

            console.log(`✅ Map ${mapId} chargée avec succès`);

            return { ground, objects: objectMeshes };

        } catch (error: any) {
            console.error(`❌ Erreur lors du chargement de la map ${mapId}:`, error.message);
            throw error;
        }
    }

    /**
     * Crée un terrain 3D depuis les données de heightmap
     */
    private createGroundFromHeightmap(mapId: string, heightmap: HeightmapData): Mesh {
        const { width, height, data, min, max } = heightmap;

        console.log(`   📐 Création du terrain ${width}x${height}...`);

        // Normaliser les hauteurs pour Babylon.js
        // Les valeurs vont de min à max, on les mappe à [0, 1] puis à l'échelle du monde
        const range = max - min || 1;
        const scale = 100; // 1 unité heightmap = 100 unités monde

        const subdivisionsX = width - 1;
        const subdivisionsY = height - 1;

        // Créer le mesh avec Babylon.js
        const ground = MeshBuilder.CreateGround(
            `${mapId}_ground`,
            { width: width * 10, height: height * 10, subdivisionsX, subdivisionsY },
            this.scene
        );

        // Modifier les vertices du terrain selon le heightmap
        const positionsArray = ground.getVerticesData(VertexBuffer.PositionKind);

        // Babylon.js CreateGround génère vertices ligne par ligne
        // On doit mapper correctement les coordonnées heightmap aux vertices
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const heightValue = data[y][x];
                const normalizedHeight = (heightValue - min) / range;
                const worldHeight = normalizedHeight * scale;

                // Babylon.js CreateGround ordonne les vertices différemment
                // L'index du vertex dans le mesh = y * width + x
                const vertexIndex = y * width + x;

                // Modifier la composante Y (hauteur) du vertex
                positionsArray[vertexIndex * 3 + 1] = worldHeight;
            }
        }

        ground.updateVerticesData(VertexBuffer.PositionKind, positionsArray);
        ground.updateBoundingInfo();

        // Créer un matériau de terrain simple
        const groundMat = new StandardMaterial('groundMat', this.scene);

        groundMat.diffuseColor = new Color3(0.3, 0.5, 0.3);
        groundMat.specularColor = new Color3(0.1, 0.1, 0.1);
        groundMat.wireframe = false;

        ground.material = groundMat;

        console.log(`   ✅ Terrain créé avec ${width * height} vertices`);

        return ground;
    }

    /**
     * Place les objets 3D sur la map
     */
    private async placeObjects(objectFile: ObjectFile): Promise<Mesh[]> {
        if (objectFile.objects.length === 0) {
            return [];
        }

        console.log(`   📦 Placement de ${objectFile.objects.length} objets...`);

        const meshes: Mesh[] = [];
        const objectsToPlace = objectFile.objects.slice(0, 100); // Augmenté à 100

        for (const obj of objectsToPlace) {
            // Convertir la position
            const position = new Vector3(
                obj.position.x * 10,
                obj.position.y * 10,
                obj.position.z * 10
            );

            // Convertir la rotation si disponible
            const rotation = obj.rotation
                ? new Vector3(obj.rotation.x, obj.rotation.y, obj.rotation.z)
                : undefined;

            // Convertir l'échelle si disponible
            const scale = obj.scale
                ? new Vector3(obj.scale.x, obj.scale.y, obj.scale.z)
                : new Vector3(1, 1, 1);

            // Charger le modèle 3D
            const mesh = await this.modelLoader.loadModelById(
                obj.modelId,
                position,
                rotation,
                scale
            );

            if (mesh) {
                meshes.push(mesh);
            }
        }

        console.log(`   ✅ ${meshes.length} modèles 3D créés`);

        return meshes;
    }

    /**
     * Nettoie une map chargée
     */
    unloadMap(mapId: string): void {
        const map = this.loadedMaps.get(mapId);
        if (map) {
            map.dispose();
            this.loadedMaps.delete(mapId);
            console.log(`🗑️  Map ${mapId} déchargée`);
        }
    }

    /**
     * Nettoie toutes les ressources
     */
    dispose(): void {
        this.loadedMaps.forEach(map => map.dispose());
        this.loadedMaps.clear();
        this.modelLoader.dispose();
    }

    /**
     * Charge plusieurs maps et retourne la première disponible
     */
    async loadAnyMap(mapIds: string[]): Promise<{ ground: Mesh; objects: Mesh[] } | null> {
        for (const mapId of mapIds) {
            try {
                return await this.loadMap(mapId);
            } catch (error) {
                console.warn(`⚠️  Impossible de charger ${mapId}, essai suivant...`);
                continue;
            }
        }
        return null;
    }
}
