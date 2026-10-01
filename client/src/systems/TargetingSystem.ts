// ============================================
// SRObro - Targeting System
// Handles selecting targets (monsters, NPCs, etc.) via click
// ============================================

import type { Scene, AbstractMesh } from '@babylonjs/core';
import { Vector3, PointerEventTypes } from '@babylonjs/core';
import type { SpawnedMonster } from '../zones/jangan/JanganZone';
import type { JanganZone } from '../zones/jangan/JanganZone';
import type { CombatSystem } from './CombatSystem';
import type { MonsterHealthBarManager } from '../ui/components/MonsterHealthBar';

export class TargetingSystem {
  private scene: Scene;
  private janganZone: JanganZone;
  private combatSystem: CombatSystem;

  // Current target
  private currentTarget: SpawnedMonster | null = null;
  private targetMarker: AbstractMesh | null = null;
  private healthBarManager: MonsterHealthBarManager;
  // Mesh joueur résolu une fois (évite un scan de scène par frame)
  private cachedPlayerMesh: import('@babylonjs/core').AbstractMesh | null = null;

  // Callbacks
  private onTargetChangeCallback?: (target: SpawnedMonster | null) => void;

  constructor(scene: Scene, janganZone: JanganZone, combatSystem: CombatSystem) {
    this.scene = scene;
    this.janganZone = janganZone;
    this.combatSystem = combatSystem;
    this.healthBarManager = janganZone.getHealthBarManager();

    this.setupPointerEvents();
    this.createTargetMarker();
  }

  /**
   * Set up pointer events for clicking on monsters
   */
  private setupPointerEvents(): void {
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh) {
          const pickedMesh = pointerInfo.pickInfo.pickedMesh;

          // Check if we clicked on a monster
          const monster = this.findMonsterByMesh(pickedMesh);
          if (monster) {
            this.setTarget(monster);
            console.log(`[TargetingSystem] Targeted: ${monster.monsterId}`);
          } else {
            // Clicked on nothing or ground, clear target
            this.clearTarget();
          }
        }
      }
    });
  }

  /**
   * Create a visual marker for the current target
   */
  private async createTargetMarker(): Promise<void> {
    const { MeshBuilder, StandardMaterial, Color3 } = await import('@babylonjs/core');

    // Create a torus as a target reticle
    this.targetMarker = MeshBuilder.CreateTorus(
      'target_marker',
      { diameter: 3, thickness: 0.1 },
      this.scene
    );

    const material = new StandardMaterial('target_marker_mat', this.scene);
    material.diffuseColor = new Color3(1, 0, 0); // Red
    material.emissiveColor = new Color3(1, 0, 0);
    material.alpha = 0.8;
    this.targetMarker.material = material;

    // Initially hide the marker
    this.targetMarker.setEnabled(false);
  }

  /**
   * Find a monster by its mesh
   */
  private findMonsterByMesh(mesh: AbstractMesh): SpawnedMonster | undefined {
    const allMonsters = this.janganZone.getAllMonsters();

    // Check if the mesh or any of its parents belongs to a monster
    let currentMesh: AbstractMesh | null = mesh;
    while (currentMesh) {
      const monster = allMonsters.find(m => m.mesh === currentMesh);
      if (monster) {
        return monster;
      }
      currentMesh = currentMesh.parent as AbstractMesh | null;
    }

    return undefined;
  }

  /**
   * Set a target
   */
  setTarget(monster: SpawnedMonster): void {
    this.currentTarget = monster;

    // Update combat system target
    this.combatSystem.setTarget(monster);

    // Show and position target marker
    if (this.targetMarker) {
      this.targetMarker.setEnabled(true);
      this.updateTargetMarkerPosition();
    }

    // Show health bar when targeted
    this.healthBarManager.showHealthBar(monster.id);

    // Notify callback
    this.onTargetChangeCallback?.(monster);

    console.log(`[TargetingSystem] Target set: ${monster.monsterId} (HP: ${monster.hp}/${monster.maxHp})`);
  }

  /**
   * Clear current target
   */
  clearTarget(): void {
    // Hide health bar of previous target
    if (this.currentTarget) {
      this.healthBarManager.hideHealthBar(this.currentTarget.id);
    }

    this.currentTarget = null;

    // Clear combat system target
    this.combatSystem.setTarget(null);

    // Hide target marker
    if (this.targetMarker) {
      this.targetMarker.setEnabled(false);
    }

    // Notify callback
    this.onTargetChangeCallback?.(null);

    console.log('[TargetingSystem] Target cleared');
  }

  /**
   * Get current target
   */
  getTarget(): SpawnedMonster | null {
    return this.currentTarget;
  }

  /**
   * Update target marker position (call every frame)
   */
  update(): void {
    if (this.currentTarget && this.targetMarker) {
      this.updateTargetMarkerPosition();

      // Auto-attack if in range (for MVP, automatic basic attacks)
      // In a full game, this would be configurable
      if (this.currentTarget && !this.currentTarget.isDead) {
        // Check if player is in attack range
        const playerPosition = this.getPlayerPosition();
        if (playerPosition) {
          const distance = Vector3.Distance(
            playerPosition,
            new Vector3(this.currentTarget.position.x, 0, this.currentTarget.position.z)
          );

          // If in range, perform attack (handled by combat system with cooldown)
          if (distance <= 3) {
            // Combat system handles cooldown internally
            this.combatSystem.performAttack(playerPosition);
          }
        }
      }
    }
  }

  /**
   * Update target marker position to follow the target
   */
  private updateTargetMarkerPosition(): void {
    if (!this.currentTarget || !this.targetMarker) return;

    // Position marker at monster's feet
    this.targetMarker.position = new Vector3(
      this.currentTarget.position.x,
      0.1, // Slightly above ground
      this.currentTarget.position.z
    );

    // Rotate marker for visual effect
    this.targetMarker.rotation.y += 0.02;

    // Check if target is dead, if so, clear target
    if (this.currentTarget.isDead) {
      this.clearTarget();
    }
  }

  /**
   * Get player position (helper method)
   * Le mesh joueur est mis en cache: sinon chaque frame scanne les ~2500
   * meshes de la scène à la recherche d'un nom contenant "player".
   */
  private getPlayerPosition(): Vector3 | null {
    if (this.cachedPlayerMesh) {
      if (!this.cachedPlayerMesh.isDisposed()) {
        return this.cachedPlayerMesh.position;
      }
      this.cachedPlayerMesh = null;
    }

    // Try to get player position from scene
    const playerMesh = this.scene.getMeshByName('player_placeholder');
    if (playerMesh) {
      this.cachedPlayerMesh = playerMesh;
      return playerMesh.position;
    }

    // Try alternative player mesh names (vrai modèle: chinaman_adventurer_*)
    for (const mesh of this.scene.meshes) {
      if (mesh.name.includes('player') || mesh.name.includes('Player') || mesh.name.includes('adventurer')) {
        this.cachedPlayerMesh = mesh;
        return mesh.position;
      }
    }

    return null;
  }

  /**
   * Set callback for target changes
   */
  onTargetChange(callback: (target: SpawnedMonster | null) => void): void {
    this.onTargetChangeCallback = callback;
  }

  /**
   * Dispose
   */
  dispose(): void {
    if (this.targetMarker) {
      this.targetMarker.dispose();
      this.targetMarker = null;
    }
    this.currentTarget = null;
  }
}
