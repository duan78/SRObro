/**
 * SRObro Test Suite
 *
 * Ce fichier peut être utilisé via Chrome DevTools pour tester
 * tous les systèmes du jeu.
 *
 * Usage dans Chrome DevTools:
 * 1. Ouvrez la console (F12)
 * 2. Tapez: window.SROBroTest
 * 3. Exemple: window.SROBroTest.spawnCharacter()
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { AssetLoader } from '../core/AssetLoader';
import { Character, EquipmentSlot } from '../game/Character';
import { CharacterFactory, AssembledCharacter } from '../gameplay/CharacterFactory';
import { AnimationManager, AnimationState } from '../animation/AnimationManager';
import { DamageNumberManager, DamageType } from '../combat/DamageNumberManager';
import { SkillEffectManager } from '../effects/SkillEffectManager';

/**
 * Interface de test pour le monde
 */
export interface SROBroTestInterface {
  // Informations système
  info: () => void;

  // Chargement de personnage
  spawnCharacter: (config?: any) => Promise<AssembledCharacter | null>;
  spawnTestCube: () => void;

  // Tests d'équipement
  equipItem: (slot: EquipmentSlot, itemCode: string) => Promise<boolean>;

  // Tests d'animation
  playAnimation: (state: AnimationState) => boolean;

  // Tests de combat
  showDamage: (amount: number, type?: DamageType) => void;
  showSkillEffect: (effectId: string) => void;

  // Utilitaires
  listCharacters: () => void;
  clearAll: () => void;

  // Références internes (pour debug)
  _scene?: Scene;
  _assetLoader?: AssetLoader;
  _characterFactory?: CharacterFactory;
  _currentCharacter?: AssembledCharacter;
  _damageManager?: DamageNumberManager;
  _skillEffectManager?: SkillEffectManager;
}

/**
 * Créer l'interface de test
 */
export function createTestInterface(
  scene: Scene,
  assetLoader: AssetLoader
): SROBroTestInterface {

  // Créer les managers
  const characterFactory = new CharacterFactory(scene, assetLoader);
  const damageManager = new DamageNumberManager(scene);
  const skillEffectManager = new SkillEffectManager(scene);

  // Personnage courant
  let currentCharacter: AssembledCharacter | null = null;

  return {
    _scene: scene,
    _assetLoader: assetLoader,
    _characterFactory: characterFactory,
    get _currentCharacter() { return currentCharacter; },
    _damageManager: damageManager,
    _skillEffectManager: skillEffectManager,

    /**
     * Afficher les informations système
     */
    info() {
      console.log('=== SRObro Test Suite ===');
      console.log('Scene:', scene ? 'Loaded' : 'Not loaded');
      console.log('AssetLoader:', assetLoader ? 'Initialized' : 'Not initialized');
      console.log('CharacterFactory:', characterFactory ? 'Ready' : 'Not ready');
      console.log('');
      console.log('Available commands:');
      console.log('  window.SROBroTest.spawnCharacter() - Spawn a character');
      console.log('  window.SROBroTest.spawnTestCube() - Spawn a test cube');
      console.log('  window.SROBroTest.equipItem("weapon", "ITEM_CH_SWORD_01_A") - Equip an item');
      console.log('  window.SROBroTest.playAnimation("walk") - Play an animation');
      console.log('  window.SROBroTest.showDamage(100, "critical") - Show damage number');
      console.log('  window.SROBroTest.showSkillEffect("fire") - Show skill effect');
      console.log('  window.SROBroTest.listCharacters() - List available characters');
      console.log('  window.SROBroTest.clearAll() - Clear all entities');
    },

    /**
     * Créer un personnage complet
     */
    async spawnCharacter(config: any = {}) {
      const defaultConfig = {
        name: 'TestPlayer',
        gender: 'man',
        race: 'CH',
        equipment: {},
        position: new Vector3(0, 0, 0),
        ...config
      };

      try {
        console.log('Spawning character:', defaultConfig);

        const character = await characterFactory.createCharacter(defaultConfig);
        currentCharacter = character;

        console.log('✓ Character spawned successfully!', character);

        // Afficher les commandes disponibles pour ce personnage
        console.log('Character commands:');
        console.log('  - character.moveTo(new Vector3(x, y, z))');
        console.log('  - character.playAnimation("walk")');
        console.log('  - character.equip("weapon", "ITEM_...")');

        return character;
      } catch (error) {
        console.error('Failed to spawn character:', error);
        return null;
      }
    },

    /**
     * Créer un cube de test simple
     */
    spawnTestCube() {
      import('@babylonjs/core').then(({ MeshBuilder, StandardMaterial, Color3 }) => {
        const cube = MeshBuilder.CreateBox('test_cube', { size: 2 }, scene);
        cube.position.y = 1;

        const material = new StandardMaterial('test_mat', scene);
        material.diffuseColor = new Color3(0.2, 0.6, 1);
        material.emissiveColor = new Color3(0.1, 0.2, 0.3);
        cube.material = material;

        console.log('✓ Test cube spawned at position (0, 1, 0)');
      });
    },

    /**
     * Équiper un item
     */
    async equipItem(slot: EquipmentSlot, itemCode: string) {
      if (!currentCharacter) {
        console.warn('No character spawned. Call spawnCharacter() first.');
        return false;
      }

      try {
        await currentCharacter.equip(slot, itemCode);
        console.log(`✓ Equipped ${itemCode} to ${slot}`);
        return true;
      } catch (error) {
        console.error(`Failed to equip ${itemCode}:`, error);
        return false;
      }
    },

    /**
     * Jouer une animation
     */
    playAnimation(state: AnimationState) {
      if (!currentCharacter) {
        console.warn('No character spawned. Call spawnCharacter() first.');
        return false;
      }

      const result = currentCharacter.playAnimation(state);
      if (result) {
        console.log(`✓ Playing animation: ${state}`);
      } else {
        console.warn(`Failed to play animation: ${state}`);
      }
      return result;
    },

    /**
     * Afficher un nombre de dégâts
     */
    showDamage(amount: number, type: DamageType = DamageType.PHYSICAL) {
      const position = new Vector3(0, 2, 0);
      if (currentCharacter) {
        position.copyFrom(currentCharacter.character.getPosition());
        position.y += 2;
      }

      damageManager.showDamage(amount, position, type);
      console.log(`✓ Show damage: ${amount} (${type})`);
    },

    /**
     * Afficher un effet de skill
     */
    showSkillEffect(effectId: string) {
      const position = new Vector3(0, 1, 0);
      if (currentCharacter) {
        position.copyFrom(currentCharacter.character.getPosition());
      }

      skillEffectManager.playEffect(effectId, position);
      console.log(`✓ Show skill effect: ${effectId}`);
    },

    /**
     * Lister les personnages disponibles
     */
    listCharacters() {
      console.log('=== Available Characters ===');
      console.log('Test Models:');
      console.log('  - test_cube (working!)');
      console.log('');
      console.log('Official Game Codes (requires mappings.json):');
      console.log('  - ITEM_CH_SWORD_01_A (Chinese Sword)');
      console.log('  - ITEM_CH_M_CLOTHES_01_AA_A (Chinese Armor)');
      console.log('  - Use spawnCharacter() with equipment codes');
    },

    /**
     * Nettoyer tous les entities
     */
    clearAll() {
      if (currentCharacter) {
        currentCharacter.dispose();
        currentCharacter = null;
      }

      characterFactory.destroyAll();
      damageManager.clear();

      console.log('✓ All entities cleared');
    }
  };
}

/**
 * Fonction d'initialisation pour le test
 * Cette fonction sera appelée automatiquement au chargement de la page
 */
export async function initializeTestInterface(scene: Scene, assetLoader: AssetLoader): Promise<void> {
  const testInterface = createTestInterface(scene, assetLoader);

  // Exposer globalement pour Chrome DevTools
  (window as any).SROBroTest = testInterface;

  console.log('=== SRObro Test Suite Loaded ===');
  console.log('Type window.SROBroTest.info() for available commands');

  // Afficher les infos automatiquement
  testInterface.info();
}
