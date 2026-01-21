/**
 * SRObro - Casting Manager (Server-Side)
 * Manages skill casting state, validation, and interrupts
 */

import type { CastingState } from '../../../shared/src/types';

export interface CastingData {
  entityId: string;
  skillId: string;
  skillName: string;
  castTime: number;
  startTime: number;
  canBeInterrupted: boolean;
  targetId?: string;
}

export class CastingManager {
  private static instance: CastingManager | null = null;
  private activeCasts: Map<string, CastingData> = new Map();

  private constructor() {}

  static getInstance(): CastingManager {
    if (!CastingManager.instance) {
      CastingManager.instance = new CastingManager();
    }
    return CastingManager.instance;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Start casting a skill
   */
  startCasting(data: CastingData): CastingState {
    // Remove any existing cast for this entity
    if (this.activeCasts.has(data.entityId)) {
      this.interrupt(data.entityId);
    }

    const castData: CastingData = {
      entityId: data.entityId,
      skillId: data.skillId,
      skillName: data.skillName,
      castTime: data.castTime,
      startTime: data.startTime,
      canBeInterrupted: data.canBeInterrupted,
      targetId: data.targetId
    };

    this.activeCasts.set(data.entityId, castData);

    const castingState: CastingState = {
      isCasting: true,
      skillId: data.skillId,
      skillName: data.skillName,
      progress: 0,
      castTime: data.castTime,
      startTime: data.startTime,
      canBeInterrupted: data.canBeInterrupted
    };

    console.log(`Entity ${data.entityId} started casting ${data.skillName}`);
    return castingState;
  }

  /**
   * Update casting progress
   */
  updateCasting(entityId: string): CastingState | null {
    const castData = this.activeCasts.get(entityId);

    if (!castData) {
      return {
        isCasting: false,
        progress: 0,
        castTime: 0,
        startTime: 0,
        canBeInterrupted: false
      };
    }

    const elapsed = Date.now() - castData.startTime;
    const progress = Math.min(1, elapsed / castData.castTime);

    const castingState: CastingState = {
      isCasting: progress < 1,
      skillId: castData.skillId,
      skillName: castData.skillName,
      progress,
      castTime: castData.castTime,
      startTime: castData.startTime,
      canBeInterrupted: castData.canBeInterrupted
    };

    // Check if casting is complete
    if (progress >= 1) {
      this.activeCasts.delete(entityId);
      console.log(`Entity ${entityId} finished casting ${castData.skillName}`);
      castingState.isCasting = false;
    }

    return castingState;
  }

  /**
   * Interrupt casting
   */
  interrupt(entityId: string): boolean {
    const castData = this.activeCasts.get(entityId);

    if (!castData) {
      return false;
    }

    if (!castData.canBeInterrupted) {
      console.log(`Cannot interrupt ${castData.skillName} for entity ${entityId}`);
      return false;
    }

    this.activeCasts.delete(entityId);
    console.log(`Interrupted casting for entity ${entityId}`);
    return true;
  }

  /**
   * Get casting state for an entity
   */
  getCastingState(entityId: string): CastingState | null {
    const castData = this.activeCasts.get(entityId);

    if (!castData) {
      return null;
    }

    const elapsed = Date.now() - castData.startTime;
    const progress = Math.min(1, elapsed / castData.castTime);

    return {
      isCasting: progress < 1,
      skillId: castData.skillId,
      skillName: castData.skillName,
      progress,
      castTime: castData.castTime,
      startTime: castData.startTime,
      canBeInterrupted: castData.canBeInterrupted
    };
  }

  /**
   * Check if entity is casting
   */
  isCasting(entityId: string): boolean {
    return this.activeCasts.has(entityId);
  }

  /**
   * Get all active casts
   */
  getActiveCasts(): Map<string, CastingData> {
    return new Map(this.activeCasts);
  }

  /**
   * Complete casting (force complete without waiting)
   */
  completeCasting(entityId: string): CastingState | null {
    const castData = this.activeCasts.get(entityId);

    if (!castData) {
      return null;
    }

    this.activeCasts.delete(entityId);

    return {
      isCasting: false,
      skillId: castData.skillId,
      skillName: castData.skillName,
      progress: 1,
      castTime: castData.castTime,
      startTime: castData.startTime,
      canBeInterrupted: castData.canBeInterrupted
    };
  }

  /**
   * Update all active casts (call every tick)
   */
  updateAllActiveCasts(): Map<string, CastingState> {
    const updates = new Map<string, CastingState>();

    this.activeCasts.forEach((castData, entityId) => {
      const state = this.updateCasting(entityId);
      if (state) {
        updates.set(entityId, state);
      }
    });

    return updates;
  }

  /**
   * Remove entity (when disconnecting or dying)
   */
  removeEntity(entityId: string): void {
    if (this.activeCasts.has(entityId)) {
      this.activeCasts.delete(entityId);
      console.log(`Removed entity ${entityId} from casting manager`);
    }
  }

  /**
   * Get statistics
   */
  getStats(): { activeCasts: number } {
    return {
      activeCasts: this.activeCasts.size
    };
  }
}

export default CastingManager;
