/**
 * Initialisation du Client avec Assets Blender
 *
 * Ce fichier configure automatiquement l'utilisation des assets Blender
 * avec skinning activé.
 */

// @ts-nocheck
import { AssetConfigManager } from './config/AssetConfig';

/**
 * Configuration du client pour utiliser les assets Blender
 */
export function initializeBlenderAssets(): void {
    console.log('🎨 SRObro: Initialisation des assets Blender...');

    // Activer les assets Blender avec skinning
    AssetConfigManager.enableBlenderAssets();

    console.log('✅ Assets Blender activés !');
    console.log('📦 Emplacement: /assets/glb_blender/');
    console.log('🦴 Skinning: ACTIF');
    console.log('🎨 Textures: En cours de conversion (DDJ → WebP)');

    // Log de configuration
    const config = AssetConfigManager.getConfig();
    console.log('⚙️  Configuration:', {
        source: config.source,
        blenderPath: config.blenderPath,
        characters: config.useBlenderForCharacters ? 'Blender' : 'Standard',
        monsters: config.useBlenderForMonsters ? 'Blender' : 'Standard',
        npcs: config.useBlenderForNPCs ? 'Blender' : 'Standard',
        items: config.useBlenderForItems ? 'Blender' : 'Standard'
    });
}

/**
 * Initialisation en mode hybride (Blender pour animés, Standard pour statiques)
 */
export function initializeHybridAssets(): void {
    console.log('🔄 SRObro: Initialisation des assets hybrides...');

    AssetConfigManager.enableHybridMode();

    console.log('✅ Assets hybrides activés !');
    console.log('📦 Personnages/Monsters/NPCs: Blender (avec skinning)');
    console.log('📦 Objets statiques: Standard');
}

/**
 * Désactiver les assets Blender (revenir aux assets standard)
 */
export function disableBlenderAssets(): void {
    console.log('📦 SRObro: Désactivation des assets Blender...');

    AssetConfigManager.enableStandardAssets();

    console.log('✅ Assets standard activés');
}

/**
 * Vérifier la configuration actuelle
 */
export function checkAssetConfig(): void {
    const source = AssetConfigManager.getSource();
    const config = AssetConfigManager.getConfig();

    console.log('📊 Configuration actuelle des assets:');
    console.log(`   Source: ${source}`);
    console.log(`   Chemin Blender: ${config.blenderPath}`);
}
