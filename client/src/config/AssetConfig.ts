/**
 * Asset Configuration
 *
 * Central configuration for asset loading paths and sources
 */

export enum AssetSource {
    STANDARD = 'standard',      // Original assets without skinning
    BLENDER = 'blender',        // Blender-converted assets with skinning
    HYBRID = 'hybrid'           // Mix of both (Blender for characters, standard for props)
}

export interface AssetPathConfig {
    source: AssetSource;
    baseUrl: string;
    blenderPath: string;
    useBlenderForCharacters: boolean;
    useBlenderForMonsters: boolean;
    useBlenderForNPCs: boolean;
    useBlenderForItems: boolean;
}

/**
 * Default configuration - use standard assets
 */
export const DEFAULT_ASSET_CONFIG: AssetPathConfig = {
    source: AssetSource.STANDARD,
    baseUrl: '/assets/',
    blenderPath: '/assets/glb_blender/',
    useBlenderForCharacters: false,
    useBlenderForMonsters: false,
    useBlenderForNPCs: false,
    useBlenderForItems: false,
};

/**
 * Blender assets configuration - use Blender-converted GLBs with skinning
 */
export const BLENDER_ASSET_CONFIG: AssetPathConfig = {
    source: AssetSource.BLENDER,
    baseUrl: '/assets/',
    blenderPath: '/assets/glb_blender/',
    useBlenderForCharacters: true,
    useBlenderForMonsters: true,
    useBlenderForNPCs: true,
    useBlenderForItems: true,
};

/**
 * Hybrid configuration - Blender for animated assets, standard for static
 */
export const HYBRID_ASSET_CONFIG: AssetPathConfig = {
    source: AssetSource.HYBRID,
    baseUrl: '/assets/',
    blenderPath: '/assets/glb_blender/',
    useBlenderForCharacters: true,   // Characters need skinning
    useBlenderForMonsters: true,      // Monsters need skinning
    useBlenderForNPCs: true,          // NPCs need skinning
    useBlenderForItems: false,        // Items/weapons usually static
};

/**
 * Asset configuration manager
 */
export class AssetConfigManager {
    private static currentConfig: AssetPathConfig = { ...DEFAULT_ASSET_CONFIG };

    /**
     * Set the asset configuration
     */
    static setConfig(config: Partial<AssetPathConfig>): void {
        this.currentConfig = {
            ...this.currentConfig,
            ...config
        };

        console.log('🔧 AssetConfig: Configuration updated');
        console.log(`   Source: ${this.currentConfig.source}`);
        console.log(`   Characters: ${this.currentConfig.useBlenderForCharacters ? '🎨 Blender' : '📦 Standard'}`);
        console.log(`   Monsters: ${this.currentConfig.useBlenderForMonsters ? '🎨 Blender' : '📦 Standard'}`);
        console.log(`   NPCs: ${this.currentConfig.useBlenderForNPCs ? '🎨 Blender' : '📦 Standard'}`);
        console.log(`   Items: ${this.currentConfig.useBlenderForItems ? '🎨 Blender' : '📦 Standard'}`);
    }

    /**
     * Get the current configuration
     */
    static getConfig(): AssetPathConfig {
        return { ...this.currentConfig };
    }

    /**
     * Check if Blender assets should be used for a specific asset type
     */
    static shouldUseBlender(assetType: 'character' | 'monster' | 'npc' | 'item'): boolean {
        switch (assetType) {
            case 'character':
                return this.currentConfig.useBlenderForCharacters;
            case 'monster':
                return this.currentConfig.useBlenderForMonsters;
            case 'npc':
                return this.currentConfig.useBlenderForNPCs;
            case 'item':
                return this.currentConfig.useBlenderForItems;
            default:
                return false;
        }
    }

    /**
     * Get the asset path for a given relative path
     */
    static getAssetPath(relativePath: string, assetType?: 'character' | 'monster' | 'npc' | 'item'): string {
        const useBlender = assetType ? this.shouldUseBlender(assetType) : this.currentConfig.source === AssetSource.BLENDER;

        if (useBlender) {
            return this.currentConfig.blenderPath + relativePath.replace(/\\/g, '/');
        }

        return this.currentConfig.baseUrl + relativePath.replace(/\\/g, '/');
    }

    /**
     * Enable Blender assets for all types
     */
    static enableBlenderAssets(): void {
        this.setConfig(BLENDER_ASSET_CONFIG);
    }

    /**
     * Enable standard assets for all types
     */
    static enableStandardAssets(): void {
        this.setConfig(DEFAULT_ASSET_CONFIG);
    }

    /**
     * Enable hybrid mode (Blender for animated, standard for static)
     */
    static enableHybridMode(): void {
        this.setConfig(HYBRID_ASSET_CONFIG);
    }

    /**
     * Get current asset source
     */
    static getSource(): AssetSource {
        return this.currentConfig.source;
    }
}
