// ============================================
// SRObro - Entity Interpolation
// Smooth interpolation of remote entities
// Based on 2025 best practices for networked games
// ============================================

import { Vector3 } from '@babylonjs/core';

/**
 * Entity state from server
 */
export interface EntityState {
  entityId: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  velocity: { x: number; y: number; z: number };
  action: string;
  timestamp: number;
}

/**
 * Interpolated entity state
 */
export interface InterpolatedEntity {
  entityId: string;
  currentPosition: Vector3;
  targetPosition: Vector3;
  currentRotation: number;
  targetRotation: number;
  currentAction: string;
  targetAction: string;
  lastUpdate: number;
  velocity: Vector3;
}

/**
 * Entity Interpolation
 *
 * Interpolates between server updates for smooth movement
 * of remote entities (other players, monsters, NPCs).
 *
 * Uses 100ms interpolation delay to ensure we always have
 * two states to interpolate between.
 *
 * Sources:
 * - [Network Interpolation](https://www.gabrielgambetta.com/client-side-prediction-and-server-interpolation.html)
 * - [Unity Netcode - Interpolation](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.5/manual/learn/dealing-with-latency.html)
 */
export class EntityInterpolation {
  // Entity states
  private entities: Map<string, InterpolatedEntity> = new Map();

  // State history for interpolation
  private stateHistory: Map<string, EntityState[]> = new Map();

  // Configuration
  private readonly INTERPOLATION_DELAY = 100; // ms
  private readonly MAX_HISTORY_SIZE = 100;
  private readonly MAX_EXTRAPOLATION_TIME = 500; // ms

  /**
   * Update entity states (called when server update received)
   */
  public onServerUpdate(updates: EntityState[]): void {
    const now = Date.now();

    for (const update of updates) {
      // Store state in history
      this.addStateToHistory(update);

      // Update interpolated entity
      this.updateEntity(update, now);
    }

    // Clean old states
    this.cleanOldStates(now);
  }

  /**
   * Add state to history
   */
  private addStateToHistory(state: EntityState): void {
    if (!this.stateHistory.has(state.entityId)) {
      this.stateHistory.set(state.entityId, []);
    }

    const history = this.stateHistory.get(state.entityId)!;
    history.push(state);

    // Limit history size
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.shift();
    }
  }

  /**
   * Update interpolated entity
   */
  private updateEntity(state: EntityState, now: number): void {
    let entity = this.entities.get(state.entityId);

    if (!entity) {
      // Create new entity
      entity = {
        entityId: state.entityId,
        currentPosition: new Vector3(
          state.position.x,
          state.position.y,
          state.position.z
        ),
        targetPosition: new Vector3(
          state.position.x,
          state.position.y,
          state.position.z
        ),
        currentRotation: state.rotation,
        targetRotation: state.rotation,
        currentAction: state.action,
        targetAction: state.action,
        lastUpdate: now,
        velocity: new Vector3(
          state.velocity.x,
          state.velocity.y,
          state.velocity.z
        ),
      };

      this.entities.set(state.entityId, entity);
    } else {
      // Update target state
      entity.targetPosition = new Vector3(
        state.position.x,
        state.position.y,
        state.position.z
      );
      entity.targetRotation = state.rotation;
      entity.targetAction = state.action;
      entity.velocity = new Vector3(
        state.velocity.x,
        state.velocity.y,
        state.velocity.z
      );
      entity.lastUpdate = now;
    }
  }

  /**
   * Clean old states from history
   */
  private cleanOldStates(now: number): void {
    const cutoffTime = now - this.INTERPOLATION_DELAY - 1000; // Keep 1 second extra

    for (const [entityId, history] of this.stateHistory) {
      this.stateHistory.set(
        entityId,
        history.filter(state => state.timestamp > cutoffTime)
      );
    }
  }

  /**
   * Get interpolated state for entity
   */
  public getInterpolatedState(entityId: string): InterpolatedEntity | null {
    return this.entities.get(entityId) || null;
  }

  /**
   * Update interpolation (called every frame)
   */
  public update(deltaTime: number): void {
    const now = Date.now();
    const renderTime = now - this.INTERPOLATION_DELAY;

    for (const [entityId, entity] of this.entities) {
      // Find two states to interpolate between
      const states = this.stateHistory.get(entityId);
      if (!states || states.length < 2) continue;

      const stateA = this.getStateBefore(renderTime, states);
      const stateB = this.getStateAfter(renderTime, states);

      if (!stateA || !stateB) {
        // No states to interpolate, extrapolate
        this.extrapolate(entity, deltaTime, now);
        continue;
      }

      // Calculate interpolation factor
      const timeRange = stateB.timestamp - stateA.timestamp;
      const timeOffset = renderTime - stateA.timestamp;
      const t = timeRange > 0 ? timeOffset / timeRange : 0;

      // Interpolate position
      entity.currentPosition = Vector3.Lerp(
        new Vector3(stateA.position.x, stateA.position.y, stateA.position.z),
        new Vector3(stateB.position.x, stateB.position.y, stateB.position.z),
        Math.max(0, Math.min(1, t))
      );

      // Interpolate rotation
      entity.currentRotation = this.lerpRotation(
        stateA.rotation,
        stateB.rotation,
        Math.max(0, Math.min(1, t))
      );

      // Update action (immediate, no interpolation)
      entity.currentAction = stateB.action;
    }
  }

  /**
   * Get state before timestamp
   */
  private getStateBefore(timestamp: number, states: EntityState[]): EntityState | null {
    let beforeState: EntityState | null = null;

    for (const state of states) {
      if (state.timestamp <= timestamp) {
        beforeState = state;
      } else {
        break;
      }
    }

    return beforeState;
  }

  /**
   * Get state after timestamp
   */
  private getStateAfter(timestamp: number, states: EntityState[]): EntityState | null {
    for (const state of states) {
      if (state.timestamp > timestamp) {
        return state;
      }
    }

    return null;
  }

  /**
   * Extrapolate entity position (when no states to interpolate)
   */
  private extrapolate(entity: InterpolatedEntity, deltaTime: number, now: number): void {
    const timeSinceLastUpdate = now - entity.lastUpdate;

    // Only extrapolate for a short time
    if (timeSinceLastUpdate > this.MAX_EXTRAPOLATION_TIME) {
      return;
    }

    // Extrapolate based on velocity
    entity.currentPosition.x += entity.velocity.x * deltaTime;
    entity.currentPosition.y += entity.velocity.y * deltaTime;
    entity.currentPosition.z += entity.velocity.z * deltaTime;
  }

  /**
   * Interpolate rotation (handles wraparound)
   */
  private lerpRotation(from: number, to: number, t: number): number {
    // Handle wraparound (0-360)
    const diff = to - from;
    const adjustedDiff = diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
    return from + adjustedDiff * t;
  }

  /**
   * Remove entity
   */
  public removeEntity(entityId: string): void {
    this.entities.delete(entityId);
    this.stateHistory.delete(entityId);
  }

  /**
   * Clear all entities
   */
  public clear(): void {
    this.entities.clear();
    this.stateHistory.clear();
  }

  /**
   * Get entity count
   */
  public getEntityCount(): number {
    return this.entities.size;
  }
}
