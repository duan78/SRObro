/**
 * SRObro - Monster Health Bar
 * Floating HP bar above monster meshes
 */

import type { Scene, AbstractMesh } from '@babylonjs/core';
import { Vector3, DynamicTexture, StandardMaterial, Color3, Color4, MeshBuilder } from '@babylonjs/core';

export interface HealthBarOptions {
  width: number;
  height: number;
  yOffset: number; // Height above mesh
  backgroundColor: string;
  healthColor: string;
  criticalColor: string; // When HP is low
}

export class MonsterHealthBar {
  private scene: Scene;
  private mesh: AbstractMesh;
  private plane: AbstractMesh | null = null;
  private dynamicTexture: DynamicTexture | null = null;
  private yOffset: number;

  private currentHP: number;
  private maxHP: number;

  private options: HealthBarOptions;

  constructor(scene: Scene, mesh: AbstractMesh, maxHP: number, options?: Partial<HealthBarOptions>) {
    this.scene = scene;
    this.mesh = mesh;
    this.maxHP = maxHP;
    this.currentHP = maxHP;

    this.options = {
      width: 64,
      height: 8,
      yOffset: 2.5,
      backgroundColor: '#333333',
      healthColor: '#00FF00',
      criticalColor: '#FF0000',
      ...options,
    };

    this.yOffset = this.options.yOffset;

    this.createHealthBar();
  }

  /**
   * Create the health bar plane and texture
   */
  private createHealthBar(): void {
    // Create plane for health bar
    this.plane = MeshBuilder.CreatePlane(`${this.mesh.name}_hp_bar`, {
      width: this.options.width / 20, // Scale down for world space
      height: this.options.height / 20,
    }, this.scene);

    // Create dynamic texture
    this.dynamicTexture = new DynamicTexture(
      `${this.mesh.name}_hp_texture`,
      { width: this.options.width, height: this.options.height },
      this.scene
    );

    // Create material with texture
    const material = new StandardMaterial(`${this.mesh.name}_hp_mat`, this.scene);
    material.diffuseTexture = this.dynamicTexture;
    material.specularColor = new Color3(0, 0, 0);
    material.emissiveColor = new Color3(1, 1, 1);
    material.disableLighting = true; // Always bright
    material.backFaceCulling = false; // Visible from all angles

    this.plane.material = material;
    this.plane.isPickable = false;

    // Initial draw
    this.updateTexture();

    // Position above mesh
    this.updatePosition();
  }

  /**
   * Update the texture with current HP
   */
  private updateTexture(): void {
    if (!this.dynamicTexture) return;

    const ctx = this.dynamicTexture.getContext();
    const { width, height, backgroundColor, healthColor, criticalColor } = this.options;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background (dark gray)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Health bar
    const hpPercent = this.currentHP / this.maxHP;
    const hpWidth = Math.max(0, width * hpPercent);

    // Color based on HP percentage
    if (hpPercent <= 0.25) {
      ctx.fillStyle = criticalColor; // Red
    } else if (hpPercent <= 0.5) {
      ctx.fillStyle = '#FFFF00'; // Yellow
    } else {
      ctx.fillStyle = healthColor; // Green
    }

    ctx.fillRect(1, 1, hpWidth - 2, height - 2);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

    // Update texture
    this.dynamicTexture.update();
  }

  /**
   * Update position to follow mesh
   */
  private updatePosition(): void {
    if (!this.plane || !this.mesh) return;

    const meshPosition = this.mesh.getAbsolutePosition();
    this.plane.position = new Vector3(
      meshPosition.x,
      meshPosition.y + this.yOffset,
      meshPosition.z
    );

    // Make plane always face camera (billboard)
    this.plane.lookAt(this.scene.activeCamera!.position);
  }

  /**
   * Set current HP
   */
  setHP(hp: number): void {
    this.currentHP = Math.max(0, Math.min(hp, this.maxHP));
    this.updateTexture();
  }

  /**
   * Set max HP (for level ups, etc.)
   */
  setMaxHP(maxHP: number): void {
    this.maxHP = maxHP;
    this.currentHP = Math.min(this.currentHP, this.maxHP);
    this.updateTexture();
  }

  /**
   * Update position (call every frame)
   */
  update(): void {
    this.updatePosition();
  }

  /**
   * Show health bar
   */
  show(): void {
    if (this.plane) {
      this.plane.setEnabled(true);
    }
  }

  /**
   * Hide health bar
   */
  hide(): void {
    if (this.plane) {
      this.plane.setEnabled(false);
    }
  }

  /**
   * Dispose
   */
  dispose(): void {
    if (this.plane) {
      this.plane.dispose();
      this.plane = null;
    }
    if (this.dynamicTexture) {
      this.dynamicTexture.dispose();
      this.dynamicTexture = null;
    }
  }
}

/**
 * Manager for all monster health bars
 */
export class MonsterHealthBarManager {
  private scene: Scene;
  private healthBars: Map<string, MonsterHealthBar> = new Map();
  private visibleBars: Set<string> = new Set();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Create health bar for a monster
   */
  createHealthBar(monsterId: string, mesh: AbstractMesh, maxHP: number): MonsterHealthBar {
    const healthBar = new MonsterHealthBar(this.scene, mesh, maxHP);
    this.healthBars.set(monsterId, healthBar);

    // Initially hide
    healthBar.hide();

    return healthBar;
  }

  /**
   * Get health bar by monster ID
   */
  getHealthBar(monsterId: string): MonsterHealthBar | undefined {
    return this.healthBars.get(monsterId);
  }

  /**
   * Show health bar (when targeted or damaged)
   */
  showHealthBar(monsterId: string): void {
    const healthBar = this.healthBars.get(monsterId);
    if (healthBar) {
      healthBar.show();
      this.visibleBars.add(monsterId);
    }
  }

  /**
   * Hide health bar
   */
  hideHealthBar(monsterId: string): void {
    const healthBar = this.healthBars.get(monsterId);
    if (healthBar) {
      healthBar.hide();
      this.visibleBars.delete(monsterId);
    }
  }

  /**
   * Hide all health bars
   */
  hideAllHealthBars(): void {
    this.visibleBars.forEach(id => this.hideHealthBar(id));
    this.visibleBars.clear();
  }

  /**
   * Update all visible health bars
   */
  update(): void {
    this.visibleBars.forEach(id => {
      const healthBar = this.healthBars.get(id);
      if (healthBar) {
        healthBar.update();
      }
    });
  }

  /**
   * Remove health bar
   */
  removeHealthBar(monsterId: string): void {
    const healthBar = this.healthBars.get(monsterId);
    if (healthBar) {
      healthBar.dispose();
      this.healthBars.delete(monsterId);
      this.visibleBars.delete(monsterId);
    }
  }

  /**
   * Dispose all health bars
   */
  dispose(): void {
    this.healthBars.forEach(bar => bar.dispose());
    this.healthBars.clear();
    this.visibleBars.clear();
  }
}
