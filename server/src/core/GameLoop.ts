import { EventEmitter } from 'events';

/**
 * World snapshot for lag compensation and synchronization
 */
export interface WorldSnapshot {
  tick: number;
  timestamp: number;
  entities: Map<string, any>;
}

/**
 * GameLoop
 * Core timing system for the game server
 */
export class GameLoop extends EventEmitter {
  private tickRate: number;
  private tickInterval: NodeJS.Timeout | null = null;
  private currentTick: number = 0;
  private snapshots: Map<number, WorldSnapshot> = new Map();
  private maxSnapshots: number = 200; // Store about 10 seconds of history at 20Hz

  constructor(tickRate: number = 20) {
    super();
    this.tickRate = tickRate;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.tickInterval) return;
    
    const tickDuration = 1000 / this.tickRate;
    this.tickInterval = setInterval(() => this.tick(), tickDuration);
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * Core tick function
   */
  private tick(): void {
    this.currentTick++;
    const timestamp = Date.now();
    const delta = 1 / this.tickRate;

    // Emit tick event
    this.emit('tick', {
      tick: this.currentTick,
      timestamp,
      delta
    });
  }

  /**
   * Add a world snapshot to history
   */
  public addSnapshot(snapshot: WorldSnapshot): void {
    this.snapshots.set(snapshot.tick, snapshot);
    
    // Maintain history size
    if (this.snapshots.size > this.maxSnapshots) {
      const oldestTick = Math.min(...this.snapshots.keys());
      this.snapshots.delete(oldestTick);
    }
    
    // Emit snapshot event
    this.emit('snapshot', snapshot);
  }

  /**
   * Get the snapshot closest to a specific timestamp
   */
  public getSnapshotAtTime(timestamp: number): WorldSnapshot | null {
    if (this.snapshots.size === 0) return null;

    let closest: WorldSnapshot | null = null;
    let minDiff = Infinity;

    for (const snapshot of this.snapshots.values()) {
      const diff = Math.abs(snapshot.timestamp - timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = snapshot;
      }
    }

    // Don't return snapshots that are too far in time (e.g., > 1s)
    if (minDiff > 1000) return null;

    return closest;
  }

  /**
   * Get the current tick number
   */
  public getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Get the tick rate
   */
  public getTickRate(): number {
    return this.tickRate;
  }
}
