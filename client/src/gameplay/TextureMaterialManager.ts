/**
 * TextureMaterialManager
 *
 * Dynamically applies textures to GLB models.
 * Since the GLB files don't contain embedded materials,
 * this manager loads and applies WebP textures at runtime.
 */

import {
  Scene,
  Texture,
  StandardMaterial,
  Color3,
  TransformNode,
  AbstractMesh
} from '@babylonjs/core';

export interface TextureMapping {
  model: string;
  texture: string;
}

export class TextureMaterialManager {
  private scene: Scene;
  private textureCache: Map<string, Texture> = new Map();
  private mappings: Map<string, string> = new Map();
  private initialized: boolean = false;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Initialize the manager by loading texture mappings
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const response = await fetch('./assets/texture_mapping.json');
      if (!response.ok) {
        throw new Error(`Failed to load texture_mapping.json: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.mappings && Array.isArray(data.mappings)) {
        for (const mapping of data.mappings) {
          this.mappings.set(mapping.model, mapping.texture);
        }
      }
      this.initialized = true;
      console.log(`TextureMaterialManager: Loaded ${this.mappings.size} texture mappings`);
    } catch (error) {
      console.warn('TextureMaterialManager: Could not load texture_mapping.json', error);
      // Still mark as initialized to avoid repeated attempts
      this.initialized = true;
    }
  }

  /**
   * Check if manager is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Apply textures to a loaded model
   */
  async applyTexturesToModel(rootNode: TransformNode, modelName: string): Promise<void> {
    const textureName = this.findTextureForModel(modelName);

    if (textureName) {
      await this.applyTextureMaterial(rootNode, modelName, textureName);
    } else {
      this.applyDefaultMaterial(rootNode, modelName);
    }
  }

  /**
   * Find the texture name for a given model
   */
  private findTextureForModel(modelName: string): string | null {
    // First check explicit mappings
    if (this.mappings.has(modelName)) {
      return this.mappings.get(modelName)!;
    }

    // Fall back to name convention (same base name)
    // Try WebP first, then DDS, then PNG
    const extensions = ['.webp', '.dds', '.png'];
    for (const ext of extensions) {
      const textureName = modelName + ext;
      // We don't check if file exists here - we'll try loading it
      return textureName;
    }

    return null;
  }

  /**
   * Apply a texture material to all meshes in the model
   */
  private async applyTextureMaterial(
    rootNode: TransformNode,
    modelName: string,
    textureName: string
  ): Promise<void> {
    try {
      // Try to load the texture
      const texture = await this.loadTexture(textureName);

      // Create material
      const material = new StandardMaterial(`${modelName}_mat`, this.scene);
      material.diffuseTexture = texture;
      material.specularColor = new Color3(0.2, 0.2, 0.2);
      material.roughness = 0.6;
      material.backFaceCulling = false;

      // Apply to all meshes
      let meshCount = 0;
      rootNode.getChildren().forEach((child) => {
        if (child instanceof AbstractMesh) {
          child.material = material;
          meshCount++;
        }
      });

      console.log(`TextureMaterialManager: Applied texture '${textureName}' to ${meshCount} meshes`);

    } catch (error) {
      console.warn(`TextureMaterialManager: Failed to load texture '${textureName}', using default material`, error);
      this.applyDefaultMaterial(rootNode, modelName);
    }
  }

  /**
   * Load a texture with caching
   */
  private async loadTexture(textureName: string): Promise<Texture> {
    // Check cache first
    if (this.textureCache.has(textureName)) {
      return this.textureCache.get(textureName)!;
    }

    // Load texture
    const texturePath = `./assets/textures/${textureName}`;
    const texture = new Texture(texturePath, this.scene);

    // Cache it
    this.textureCache.set(textureName, texture);

    return texture;
  }

  /**
   * Apply a default colored material when no texture is available
   * Uses a hash of the model name to generate a consistent color
   */
  private applyDefaultMaterial(rootNode: TransformNode, modelName: string): void {
    const material = new StandardMaterial(`${modelName}_default`, this.scene);

    // Generate consistent color from model name
    const hash = this.hashCode(modelName);
    const hue = Math.abs(hash) % 360;
    const saturation = 0.5 + (Math.abs(hash >> 8) % 100) / 300; // 0.5-0.83
    const value = 0.6 + (Math.abs(hash >> 16) % 100) / 250; // 0.6-1.0

    // Set color
    const color = Color3.FromHSV(hue / 360, saturation, value);
    material.diffuseColor = color;
    material.emissiveColor = color.scale(0.1); // Slight glow for visibility
    material.specularColor = new Color3(0.2, 0.2, 0.2);
    material.roughness = 0.6;
    material.backFaceCulling = false;

    // Apply to all meshes
    let meshCount = 0;
    rootNode.getChildren().forEach((child) => {
      if (child instanceof AbstractMesh) {
        child.material = material;
        meshCount++;
      }
    });

    console.log(`TextureMaterialManager: Applied default material (HSV: ${hue.toFixed(0)}, ${saturation.toFixed(2)}, ${value.toFixed(2)}) to ${meshCount} meshes`);
  }

  /**
   * Simple hash function for consistent color generation
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Clear the texture cache (useful for memory management)
   */
  clearCache(): void {
    this.textureCache.forEach((texture) => {
      texture.dispose();
    });
    this.textureCache.clear();
  }

  /**
   * Dispose of the manager and clean up resources
   */
  dispose(): void {
    this.clearCache();
  }
}
