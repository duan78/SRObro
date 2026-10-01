// ============================================
// SRObro - Combat System
// Handles damage calculation, attacks, and combat flow
// ============================================

import type { Scene } from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { Observable } from '@babylonjs/core';
import type { SpawnedMonster } from '../zones/jangan/JanganZone';
import type { JanganZone } from '../zones/jangan/JanganZone';
import type { ProgressionSystem } from './ProgressionSystem';
import type { DamageNumberManager } from '../combat/DamageNumberManager';
import type { EquipmentSystem } from './EquipmentSystem';
import type { MonsterHealthBarManager } from '../ui/components/MonsterHealthBar';

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  targetHP: number;
  targetMaxHP: number;
  isDead: boolean;
}

export interface CombatEvent {
  type: 'attack' | 'damage' | 'kill' | 'death';
  attackerId: string;
  targetId?: string;
  damage?: number;
  xpGained?: number;
}

export class CombatSystem {
  private progression: ProgressionSystem;
  private equipment: EquipmentSystem;
  private damageNumberManager: DamageNumberManager | null = null;
  private healthBarManager: MonsterHealthBarManager | null = null;
  private janganZone: JanganZone | null = null;

  // Combat state
  private attackCooldown = 2000; // 2 seconds
  private lastAttackTime = 0;

  // Observables for combat events
  public onCombatEvent = new Observable<CombatEvent>();
  public onMonsterDeath = new Observable<{ monsterId: string; xpReward: number }>();

  // Active targets
  private currentTarget: SpawnedMonster | null = null;

  constructor(
    _scene: Scene,
    progression: ProgressionSystem,
    equipment: EquipmentSystem
  ) {
    this.progression = progression;
    this.equipment = equipment;
  }

  /**
   * Set Jangan Zone reference (for monster management)
   */
  setJanganZone(zone: JanganZone): void {
    this.janganZone = zone;
    this.healthBarManager = zone.getHealthBarManager();
  }

  /**
   * Set damage number manager for visual feedback
   */
  setDamageNumberManager(manager: DamageNumberManager): void {
    this.damageNumberManager = manager;
  }

  /**
   * Set current target
   */
  setTarget(monster: SpawnedMonster | null): void {
    this.currentTarget = monster;
  }

  /**
   * Get current target
   */
  getTarget(): SpawnedMonster | null {
    return this.currentTarget;
  }

  /**
   * Perform basic attack
   */
  performAttack(attackerPosition: Vector3): boolean {
    const now = Date.now();

    // Check cooldown
    if (now - this.lastAttackTime < this.attackCooldown) {
      console.warn('[CombatSystem] Attack on cooldown');
      return false;
    }

    // Check if target exists and is in range
    if (!this.currentTarget || this.currentTarget.isDead) {
      console.warn('[CombatSystem] No valid target');
      return false;
    }

    // Check range
    const distance = Vector3.Distance(
      attackerPosition,
      new Vector3(this.currentTarget.position.x, 0, this.currentTarget.position.z)
    );

    if (distance > 3) { // 3 unit attack range
      console.warn('[CombatSystem] Target out of range');
      return false;
    }

    // Calculate damage
    const attackPower = this.progression.getPhysicalAttackPower();
    const baseDamage = Math.floor(
      Math.random() * (attackPower.max - attackPower.min + 1) + attackPower.min
    );

    // Check for critical hit (5% chance)
    const isCritical = Math.random() < 0.05;
    const finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;

    // Apply damage to monster
    this.currentTarget.hp = Math.max(0, this.currentTarget.hp - finalDamage);
    const isDead = this.currentTarget.hp <= 0;

    // Update health bar
    if (this.healthBarManager && this.currentTarget) {
      const healthBar = this.healthBarManager.getHealthBar(this.currentTarget.id);
      if (healthBar) {
        healthBar.setHP(this.currentTarget.hp);
      }
    }

    console.log(`[CombatSystem] Dealt ${finalDamage} damage${isCritical ? ' (CRITICAL!)' : ''} to ${this.currentTarget.monsterId}`);

    // Show damage number
    if (this.damageNumberManager) {
      const targetPosition = new Vector3(
        this.currentTarget.position.x,
        2, // Above monster
        this.currentTarget.position.z
      );
      const { DamageType } = require('../combat/DamageNumberManager');
      const damageType = isCritical ? DamageType.CRITICAL : DamageType.PHYSICAL;
      this.damageNumberManager.showDamage(finalDamage, targetPosition, damageType);
    }

    // Emit combat event
    this.onCombatEvent.notifyObservers({
      type: isDead ? 'kill' : 'damage',
      attackerId: 'player',
      targetId: this.currentTarget.id,
      damage: finalDamage,
    });

    // Handle monster death
    if (isDead) {
      this.handleMonsterDeath(this.currentTarget);
    }

    this.lastAttackTime = now;
    return true;
  }

  /**
   * Handle monster death
   */
  private handleMonsterDeath(monster: SpawnedMonster): void {
    console.log(`[CombatSystem] Monster killed: ${monster.monsterId}`);

    // Calculate XP reward
    const xpReward = this.calculateXPReward(monster);

    // Grant XP
    this.progression.gainXP(xpReward);

    // Emit monster death event
    this.onMonsterDeath.notifyObservers({
      monsterId: monster.monsterId,
      xpReward,
    });

    // Emit combat event
    this.onCombatEvent.notifyObservers({
      type: 'kill',
      attackerId: 'player',
      targetId: monster.id,
      xpGained: xpReward,
    });

    // Clear target
    if (this.currentTarget?.id === monster.id) {
      this.currentTarget = null;
    }
  }

  /**
   * Calculate XP reward from monster
   */
  private calculateXPReward(monster: SpawnedMonster): number {
    // Base XP from monster level
    const baseXP = monster.level * 50;

    // Apply party/solo modifiers (for MVP, just base XP)
    const finalXP = baseXP;

    return finalXP;
  }

  /**
   * Calculate damage from monster to player
   */
  calculateMonsterDamage(monster: SpawnedMonster): number {
    // Monster attack power
    const monsterAttack = monster.level * 5; // Simple formula for MVP

    // Player defense
    const playerDefense = this.progression.getDefense();

    // Calculate damage (monster attack - player defense, minimum 1)
    const damage = Math.max(1, monsterAttack - playerDefense);

    // Add some randomness (±20%)
    const variance = 0.2;
    const randomFactor = 1 + ((Math.random() * 2 - 1) * variance);
    const finalDamage = Math.max(1, Math.floor(damage * randomFactor));

    return finalDamage;
  }

  /**
   * Take damage from monster
   */
  takeDamage(monsterId: string, damage: number): boolean {
    const currentHP = this.progression.getHP();
    const newHP = Math.max(0, currentHP - damage);

    this.progression.setHP(newHP);

    const isDead = newHP <= 0;

    console.log(`[CombatSystem] Took ${damage} damage from ${monsterId}. HP: ${newHP}/${this.progression.getMaxHP()}`);

    // Emit combat event
    this.onCombatEvent.notifyObservers({
      type: isDead ? 'death' : 'damage',
      attackerId: monsterId,
      targetId: 'player',
      damage,
    });

    return isDead;
  }

  /**
   * Use HP potion
   */
  useHPPotion(): boolean {
    // Find HP potion in inventory
    const inventory = this.equipment.getInventory();
    const hpPotion = inventory.find(item => item.item.id.startsWith('potion_hp'));

    if (!hpPotion) {
      console.warn('[CombatSystem] No HP potions available');
      return false;
    }

    // Use potion
    const result = this.equipment.useItem(hpPotion.id);
    if (result.success && result.effect?.type === 'restore_hp') {
      this.progression.restoreHP(result.effect.amount);
      this.equipment.consumeItem(hpPotion.id);
      console.log(`[CombatSystem] Used HP potion, restored ${result.effect.amount} HP`);
      return true;
    }

    return false;
  }

  /**
   * Use MP potion
   */
  useMPPotion(): boolean {
    // Find MP potion in inventory
    const inventory = this.equipment.getInventory();
    const mpPotion = inventory.find(item => item.item.id.startsWith('potion_mp'));

    if (!mpPotion) {
      console.warn('[CombatSystem] No MP potions available');
      return false;
    }

    // Use potion
    const result = this.equipment.useItem(mpPotion.id);
    if (result.success && result.effect?.type === 'restore_mp') {
      this.progression.restoreMP(result.effect.amount);
      this.equipment.consumeItem(mpPotion.id);
      console.log(`[CombatSystem] Used MP potion, restored ${result.effect.amount} MP`);
      return true;
    }

    return false;
  }

  /**
   * Respawn player (on death)
   */
  respawnPlayer(): void {
    console.log('[CombatSystem] Respawning player...');

    // Restore HP/MP
    this.progression.setHP(this.progression.getMaxHP());
    this.progression.setMP(this.progression.getMaxMP());

    // Apply death penalty (lose 5% XP)
    const currentXP = this.progression.getCurrentXP();
    const lostXP = Math.floor(currentXP * 0.05);
    if (lostXP > 0) {
      console.log(`[CombatSystem] Death penalty: lost ${lostXP} XP`);
    }

    // Clear target
    this.currentTarget = null;

    // Emit combat event
    this.onCombatEvent.notifyObservers({
      type: 'death',
      attackerId: 'player',
    });
  }

  /**
   * Get current HP percentage
   */
  getHPPercentage(): number {
    return this.progression.getHP() / this.progression.getMaxHP();
  }

  /**
   * Get current MP percentage
   */
  getMPPercentage(): number {
    return this.progression.getMP() / this.progression.getMaxMP();
  }

  /**
   * Update combat system
   */
  update(): void {
    // For MVP, combat is action-based
    // In future, this could handle auto-attacks, DoTs, etc.
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.onCombatEvent.clear();
    this.onMonsterDeath.clear();
  }
}
