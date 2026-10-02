// ============================================
// SRObro - Progression System
// Handles XP, leveling, and stat allocation
// ============================================

import type { Character, CharacterStats } from '@srobro/shared';
import { xpForNextLevel } from '@srobro/shared';
import { Observable } from '@babylonjs/core';

export interface LevelUpEvent {
  newLevel: number;
  statPointsAwarded: number;
}

export interface XPGainEvent {
  amount: number;
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

/** Cap 120 (phase I — Legend VIII, extension Europe/Égypte). */
export const LEVEL_CAP = 120;

export class ProgressionSystem {
  private character: Character;

  // Observables for events
  public onLevelUp = new Observable<LevelUpEvent>();
  public onXPGain = new Observable<XPGainEvent>();
  public onStatAllocation = new Observable<CharacterStats>();

  constructor(character: Character) {
    this.character = character;
  }

  /**
   * Get XP required for a specific level
   * Courbe OFFICIELLE leveldata (shared/xpcurve — extraite du client).
   */
  getXPForLevel(level: number): number {
    if (level < 1 || level > LEVEL_CAP) {
      return 0;
    }
    return xpForNextLevel(level - 1);
  }

  /**
   * Get current level's XP requirement
   */
  getCurrentLevelXP(): number {
    return this.getXPForLevel(this.character.level);
  }

  /**
   * Get next level's XP requirement
   */
  getNextLevelXP(): number {
    const nextLevel = this.character.level + 1;
    if (nextLevel > LEVEL_CAP) {
      return this.getCurrentLevelXP(); // Max level
    }
    return this.getXPForLevel(nextLevel);
  }

  /**
   * Gain XP
   */
  gainXP(amount: number): void {
    this.character.exp += amount;

    // Check for level up
    let leveledUp = false;
    let totalStatPoints = 0;

    while (this.character.level < LEVEL_CAP && this.character.exp >= this.getNextLevelXP()) {
      this.character.exp -= this.getNextLevelXP();
      this.character.level++;

      // Award stat points (3 points per level for MVP)
      this.character.statPoints += 3;
      totalStatPoints += 3;

      leveledUp = true;
    }

    // Emit XP gain event
    this.onXPGain.notifyObservers({
      amount,
      currentXP: this.character.exp,
      nextLevelXP: this.getNextLevelXP(),
      level: this.character.level,
    });

    // Emit level up event if leveled up
    if (leveledUp) {
      console.log(`[Progression] Level up! New level: ${this.character.level}`);

      // Update max HP/MP based on level and stats
      this.updateMaxHPMP();

      this.onLevelUp.notifyObservers({
        newLevel: this.character.level,
        statPointsAwarded: totalStatPoints,
      });
    }
  }

  /**
   * Allocate stat point
   */
  allocateStat(stat: 'STR' | 'INT'): boolean {
    if (this.character.statPoints <= 0) {
      console.warn('[Progression] No stat points available');
      return false;
    }

    // Allocate point
    if (stat === 'STR') {
      this.character.stats.str++;
    } else if (stat === 'INT') {
      this.character.stats.int++;
    }

    this.character.statPoints--;

    // Update max HP/MP after stat change
    this.updateMaxHPMP();

    console.log(`[Progression] Allocated 1 point to ${stat}. Remaining: ${this.character.statPoints}`);

    // Emit stat allocation event
    this.onStatAllocation.notifyObservers({ ...this.character.stats });

    return true;
  }

  /**
   * Update max HP and MP based on level and stats
   * SRO formula:
   * - HP: base + (level * 10) + (STR * 5)
   * - MP: base + (level * 5) + (INT * 5)
   */
  private updateMaxHPMP(): void {
    const baseHP = 200;
    const baseMP = 100;

    this.character.maxHp = baseHP + (this.character.level * 10) + (this.character.stats.str * 5);
    this.character.maxMp = baseMP + (this.character.level * 5) + (this.character.stats.int * 5);

    // If HP/MP are above max, clamp them
    if (this.character.hp > this.character.maxHp) {
      this.character.hp = this.character.maxHp;
    }
    if (this.character.mp > this.character.maxMp) {
      this.character.mp = this.character.maxMp;
    }

    console.log(`[Progression] Updated max HP/MP: ${this.character.maxHp}/${this.character.maxMp}`);
  }

  /**
   * Get current stats
   */
  getStats(): CharacterStats {
    return { ...this.character.stats };
  }

  /**
   * Get available stat points
   */
  getStatPoints(): number {
    return this.character.statPoints;
  }

  /**
   * Get level
   */
  getLevel(): number {
    return this.character.level;
  }

  /**
   * Get current XP
   */
  getCurrentXP(): number {
    return this.character.exp;
  }

  /**
   * Get XP progress to next level (0-1)
   */
  getXPProgress(): number {
    const currentLevelXP = this.getCurrentLevelXP();
    const nextLevelXP = this.getNextLevelXP();
    const currentXP = this.character.exp;
    const range = nextLevelXP - currentLevelXP;
    const progress = currentXP / range;

    return Math.max(0, Math.min(1, progress));
  }

  /**
   * Get HP/MP
   */
  getHP(): number { return this.character.hp; }
  getMaxHP(): number { return this.character.maxHp; }
  getMP(): number { return this.character.mp; }
  getMaxMP(): number { return this.character.maxMp; }

  /**
   * Set HP (for damage/healing)
   */
  setHP(amount: number): void {
    this.character.hp = Math.max(0, Math.min(this.character.maxHp, amount));
  }

  /**
   * Set MP (for skills/consumables)
   */
  setMP(amount: number): void {
    this.character.mp = Math.max(0, Math.min(this.character.maxMp, amount));
  }

  /**
   * Restore HP
   */
  restoreHP(amount: number): void {
    this.setHP(this.character.hp + amount);
  }

  /**
   * Restore MP
   */
  restoreMP(amount: number): void {
    this.setMP(this.character.mp + amount);
  }

  /**
   * Get total stats (base + equipment)
   * For MVP, just returns base stats
   */
  getTotalStats(): CharacterStats {
    return { ...this.character.stats };
  }

  /**
   * Calculate physical attack power
   * Formula: base + (STR * 2)
   */
  getPhysicalAttackPower(): { min: number; max: number } {
    const str = this.character.stats.str;
    const base = 10;

    const min = base + (str * 2);
    const max = min + Math.floor(min * 0.2);

    return { min, max };
  }

  /**
   * Calculate magical attack power
   * Formula: base + (INT * 2)
   */
  getMagicalAttackPower(): { min: number; max: number } {
    const int = this.character.stats.int;
    const base = 10;

    const min = base + (int * 2);
    const max = min + Math.floor(min * 0.2);

    return { min, max };
  }

  /**
   * Calculate defense
   * Formula: base + (STR * 0.5)
   */
  getDefense(): number {
    const str = this.character.stats.str;
    const base = 5;
    return base + Math.floor(str * 0.5);
  }

  /**
   * Calculate magical defense
   * Formula: base + (INT * 0.5)
   */
  getMagicalDefense(): number {
    const int = this.character.stats.int;
    const base = 5;
    return base + Math.floor(int * 0.5);
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.onLevelUp.clear();
    this.onXPGain.clear();
    this.onStatAllocation.clear();
  }
}
