/**
 * SRObro - Base Entity Class
 * Abstract base class for all game entities
 */

import { Position, EntityType } from '@srobro/shared';
import { EventEmitter } from 'events';
import { createLogger } from '../core/Logger';

const logger = createLogger('Entity');

/**
 * Entity state
 */
export enum EntityState {
  IDLE = 'idle',
  MOVING = 'moving',
  CASTING = 'casting',
  ATTACKING = 'attacking',
  DEAD = 'dead',
  RESPawning = 'respawning',
}

/**
 * Base entity options
 */
export interface EntityOptions {
  id: string;
  name: string;
  type: EntityType;
  level: number;
  position: Position;
  rotation: number;
  modelId: string;
  zoneId: string;
}

/**
 * Base Entity class
 */
export abstract class Entity extends EventEmitter {
  public readonly id: string;
  public readonly name: string;
  public readonly type: EntityType;
  public level: number;
  public position: Position;
  public rotation: number;
  public readonly modelId: string;
  public zoneId: string;
  public state: EntityState;
  public createdAt: Date;

  protected lastUpdate: number;

  constructor(options: EntityOptions) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.level = options.level;
    this.position = { ...options.position };
    this.rotation = options.rotation;
    this.modelId = options.modelId;
    this.zoneId = options.zoneId;
    this.state = EntityState.IDLE;
    this.createdAt = new Date();
    this.lastUpdate = Date.now();
  }

  /**
   * Update entity (called every tick)
   */
  update(_deltaTime: number): void {
    this.lastUpdate = Date.now();
  }

  /**
   * Set position
   */
  setPosition(position: Position): void {
    const oldPosition = { ...this.position };
    this.position = { ...position };

    logger.debug(`Entity position updated: ${this.id}`, {
      oldPosition,
      newPosition: position,
    });

    this.emit('positionChanged', { entityId: this.id, oldPosition, newPosition: position });
  }

  /**
   * Set rotation
   */
  setRotation(rotation: number): void {
    this.rotation = rotation;
    this.emit('rotationChanged', { entityId: this.id, rotation });
  }

  /**
   * Set state
   */
  setState(state: EntityState): void {
    if (this.state === state) return;

    const oldState = this.state;
    this.state = state;

    logger.debug(`Entity state changed: ${this.id}`, {
      oldState,
      newState: state,
    });

    this.emit('stateChanged', { entityId: this.id, oldState, newState: state });
  }

  /**
   * Get distance to another entity
   */
  distanceTo(other: Entity): number {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const dz = this.position.z - other.position.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Get distance to a position
   */
  distanceToPosition(position: Position): number {
    const dx = this.position.x - position.x;
    const dy = this.position.y - position.y;
    const dz = this.position.z - position.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Check if entity is alive
   */
  isAlive(): boolean {
    return this.state !== EntityState.DEAD && this.state !== EntityState.RESPawning;
  }

  /**
   * Check if entity is in combat
   */
  isInCombat(): boolean {
    return this.state === EntityState.ATTACKING || this.state === EntityState.CASTING;
  }

  /**
   * Serialize entity for network transmission
   */
  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      level: this.level,
      position: this.position,
      rotation: this.rotation,
      modelId: this.modelId,
      state: this.state,
    };
  }

  /**
   * Get entity info
   */
  getInfo(): {
    id: string;
    name: string;
    type: EntityType;
    level: number;
    position: Position;
    rotation: number;
    state: EntityState;
  } {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      level: this.level,
      position: { ...this.position },
      rotation: this.rotation,
      state: this.state,
    };
  }

  /**
   * Clean up entity
   */
  destroy(): void {
    this.removeAllListeners();
    logger.debug(`Entity destroyed: ${this.id}`);
  }
}
