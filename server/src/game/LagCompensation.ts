// ============================================
// SRObro - Lag Compensation
// Server-side lag compensation for hit detection
// Based on 2026 best practices for competitive games
// ============================================

import { GameLoop, WorldSnapshot } from '../core/GameLoop';
import { Entity } from '@srobro/shared';

/**
 * Hit detection request
 */
export interface HitRequest {
  attackerId: string;
  targetId: string;
  timestamp: number;
  skillId?: string;
  position: { x: number; y: number; z: number };
  rotation: number;
}

/**
 * Hit validation result
 */
export interface HitResult {
  valid: boolean;
  reason?: string;
  distance?: number;
  angle?: number;
  rewoundTime?: number;
}

/**
 * Lag Compensation
 *
 * "Rewinds" the game world to the time when the client
 * performed an action, then validates if the action was valid.
 *
 * Critical for fair gameplay with 100ms+ latency.
 *
 * Sources:
 * - [Valve Lag Compensation](https://developer.valvesoftware.com/wiki/Lag_Compensation)
 * - [Lag Compensation - Photon Fusion](https://doc.photonengine.com/fusion/current/manual/advanced/lag-compensation)
 * - [Fast-Paced Multiplayer: Lag Compensation](https://www.gabrielgambetta.com/lag-compensation.html)
 */
export class LagCompensation {
  private gameLoop: GameLoop;
  private snapshotHistory: Map<number, WorldSnapshot> = new Map();

  // Configuration
  private readonly MAX_REWIND_TIME = 1000; // ms (don't rewind more than 1 second)
  private readonly HIT_TOLERANCE_DISTANCE = 2.5; // meters (melee attack range)
  private readonly HIT_TOLERANCE_ANGLE = 45; // degrees

  constructor(gameLoop: GameLoop) {
    this.gameLoop = gameLoop;
    this.setupSnapshotCollection();
  }

  /**
   * Setup snapshot collection from game loop
   */
  private setupSnapshotCollection(): void {
    // Listen for game loop events to collect snapshots
    this.gameLoop.on('snapshot', (snapshot: WorldSnapshot) => {
      this.addSnapshot(snapshot);
    });
  }

  /**
   * Add snapshot to history
   */
  private addSnapshot(snapshot: WorldSnapshot): void {
    this.snapshotHistory.set(snapshot.tick, snapshot);

    // Limit snapshot history
    const maxSnapshots = (this.MAX_REWIND_TIME / 1000) * 20; // 20 ticks per second
    if (this.snapshotHistory.size > maxSnapshots) {
      // Remove oldest snapshot
      const oldestTick = Math.min(...this.snapshotHistory.keys());
      this.snapshotHistory.delete(oldestTick);
    }
  }

  /**
   * Validate hit with lag compensation
   */
  public validateHit(request: HitRequest, _worldManager: any): HitResult {
    const now = Date.now();
    const rewindTime = now - request.timestamp;

    // Check if rewind time is acceptable
    if (rewindTime > this.MAX_REWIND_TIME) {
      return {
        valid: false,
        reason: `Rewind time too large: ${rewindTime}ms`,
      };
    }

    // Get snapshot at the time of the action
    const snapshot = this.gameLoop.getSnapshotAtTime(request.timestamp);
    if (!snapshot) {
      return {
        valid: false,
        reason: 'No snapshot found for timestamp',
      };
    }

    // Get entity states from snapshot
    const attackerState = snapshot.entities.get(request.attackerId);
    const targetState = snapshot.entities.get(request.targetId);

    if (!attackerState) {
      return {
        valid: false,
        reason: 'Attacker not found in snapshot',
      };
    }

    if (!targetState) {
      return {
        valid: false,
        reason: 'Target not found in snapshot',
      };
    }

    // Calculate distance at the time of the action
    const dx = attackerState.position.x - targetState.position.x;
    const dy = attackerState.position.y - targetState.position.y;
    const dz = attackerState.position.z - targetState.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Calculate angle to target
    const angleToTarget = Math.atan2(dz, dx) * (180 / Math.PI);
    const angleDifference = Math.abs(
      this.normalizeAngle(attackerState.rotation - angleToTarget)
    );

    // Validate hit based on skill/melee/range
    const valid = this.validateHitByDistance(distance, angleDifference, request.skillId);

    return {
      valid,
      distance,
      angle: angleDifference,
      rewoundTime: rewindTime,
    };
  }

  /**
   * Validate hit based on distance and angle
   */
  private validateHitByDistance(
    distance: number,
    angle: number,
    _skillId?: string
  ): boolean {
    // TODO: Implement skill-specific ranges
    // For now, use default melee range
    const inRange = distance <= this.HIT_TOLERANCE_DISTANCE;
    const inAngle = angle <= this.HIT_TOLERANCE_ANGLE;

    return inRange && inAngle;
  }

  /**
   * Normalize angle to -180 to 180
   */
  private normalizeAngle(angle: number): number {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  }

  /**
   * Get entity state at specific time
   */
  public getEntityStateAtTime(
    entityId: string,
    timestamp: number
  ): Entity | null {
    const snapshot = this.gameLoop.getSnapshotAtTime(timestamp);
    if (!snapshot) return null;

    return snapshot.entities.get(entityId) || null;
  }

  /**
   * Clear snapshot history
   */
  public clearHistory(): void {
    this.snapshotHistory.clear();
  }

  /**
   * Get statistics
   */
  public getStats(): {
    snapshotCount: number;
    maxRewindTime: number;
  } {
    return {
      snapshotCount: this.snapshotHistory.size,
      maxRewindTime: this.MAX_REWIND_TIME,
    };
  }
}
