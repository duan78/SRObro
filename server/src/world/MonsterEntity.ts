/**
 * SRObro - Monster Entity Class
 * Represents a monster in the game world with AI capabilities
 */

import { Entity, EntityState } from './Entity';
import { Position, EntityType } from '@srobro/shared';
import { createLogger } from '../core/Logger';

const logger = createLogger('MonsterEntity');

/**
 * Monster AI state
 */
export enum MonsterAIState {
  IDLE = 'idle',
  PATROL = 'patrol',
  AGGRO = 'aggro',
  ATTACK = 'attack',
  RETURN = 'return',
}

/**
 * Monster entity options
 */
export interface MonsterEntityOptions {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attackPower: { min: number; max: number };
  defense: number;
  magicalDefense: number;
  exp: number;
  sp: number;
  aggroRange: number;
  attackRange: number;
  moveSpeed: number;
  attackSpeed: number;
  respawnTime: number;
  position: Position;
  rotation: number;
  modelId: string;
  zoneId: string;
  spawnId: string;
}

/**
 * Monster Entity class
 */
export class MonsterEntity extends Entity {
  public hp: number;
  public maxHp: number;
  public mp: number;
  public maxMp: number;
  public attackPower: { min: number; max: number };
  public defense: number;
  public magicalDefense: number;
  public exp: number;
  public sp: number;
  public aggroRange: number;
  public attackRange: number;
  public moveSpeed: number;
  public attackSpeed: number;
  public respawnTime: number;
  public readonly spawnId: string;

  // AI state
  public aiState: MonsterAIState;
  public spawnPosition: Position;
  public target: Entity | null = null;
  public patrolWaypoints: Position[] = [];
  public currentWaypointIndex: number = 0;
  public lastAttackTime: number = 0;
  public aggroTime: number = 0;

  private patrolTimer: NodeJS.Timeout | null = null;

  constructor(options: MonsterEntityOptions) {
    super({
      id: options.id,
      name: options.name,
      type: EntityType.MONSTER,
      level: options.level,
      position: options.position,
      rotation: options.rotation,
      modelId: options.modelId,
      zoneId: options.zoneId,
    });

    this.hp = options.hp;
    this.maxHp = options.maxHp;
    this.mp = options.mp;
    this.maxMp = options.maxMp;
    this.attackPower = options.attackPower;
    this.defense = options.defense;
    this.magicalDefense = options.magicalDefense;
    this.exp = options.exp;
    this.sp = options.sp;
    this.aggroRange = options.aggroRange;
    this.attackRange = options.attackRange;
    this.moveSpeed = options.moveSpeed;
    this.attackSpeed = options.attackSpeed;
    this.respawnTime = options.respawnTime;
    this.spawnId = options.spawnId;
    this.spawnPosition = { ...options.position };
    this.aiState = MonsterAIState.IDLE;

    logger.info(`Monster entity created: ${this.name}`, {
      id: this.id,
      level: this.level,
      hp: this.hp,
    });
  }

  /**
   * Update monster (called every tick)
   */
  update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.state === EntityState.DEAD || this.state === EntityState.RESPawning) {
      return;
    }

    // Update AI
    this.updateAI(deltaTime);
  }

  /**
   * Update AI state machine
   */
  private updateAI(deltaTime: number): void {
    switch (this.aiState) {
      case MonsterAIState.IDLE:
        this.handleIdle();
        break;
      case MonsterAIState.PATROL:
        this.handlePatrol(deltaTime);
        break;
      case MonsterAIState.AGGRO:
        this.handleAggro(deltaTime);
        break;
      case MonsterAIState.ATTACK:
        this.handleAttack();
        break;
      case MonsterAIState.RETURN:
        this.handleReturn(deltaTime);
        break;
    }
  }

  /**
   * Handle idle state
   */
  private handleIdle(): void {
    // Random chance to start patrolling
    if (Math.random() < 0.01) {
      this.aiState = MonsterAIState.PATROL;
      this.generatePatrolWaypoints();
    }
  }

  /**
   * Handle patrol state
   */
  private handlePatrol(deltaTime: number): void {
    if (this.patrolWaypoints.length === 0) {
      this.aiState = MonsterAIState.IDLE;
      return;
    }

    const targetWaypoint = this.patrolWaypoints[this.currentWaypointIndex];
    const distance = this.distanceToPosition(targetWaypoint);

    if (distance < 1) {
      // Reached waypoint, move to next
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;

      // Random chance to stop patrolling
      if (Math.random() < 0.3) {
        this.aiState = MonsterAIState.IDLE;
        this.patrolWaypoints = [];
      }
    } else {
      // Move towards waypoint
      this.moveTowards(targetWaypoint, deltaTime);
    }
  }

  /**
   * Handle aggro state
   */
  private handleAggro(deltaTime: number): void {
    if (!this.target) {
      this.aiState = MonsterAIState.RETURN;
      return;
    }

    // Cible morte ou disparue: libérer l'aggro
    if (!this.target.isAlive()) {
      this.target = null;
      this.aiState = MonsterAIState.RETURN;
      return;
    }

    const distance = this.distanceTo(this.target);

    // Check if target is too far
    if (distance > this.aggroRange * 2) {
      this.aiState = MonsterAIState.RETURN;
      this.target = null;
      return;
    }

    // Check if in attack range
    if (distance <= this.attackRange) {
      this.aiState = MonsterAIState.ATTACK;
    } else {
      // Move towards target (deltaTime en secondes)
      this.moveTowards(this.target.position, deltaTime);
    }
  }

  /**
   * Handle attack state
   */
  private handleAttack(): void {
    if (!this.target) {
      this.aiState = MonsterAIState.RETURN;
      return;
    }

    const distance = this.distanceTo(this.target);
    const now = Date.now();

    // Check if target moved out of attack range
    if (distance > this.attackRange * 1.5) {
      this.aiState = MonsterAIState.AGGRO;
      return;
    }

    // Check if can attack
    if (now - this.lastAttackTime >= this.attackSpeed) {
      this.performAttack();
      this.lastAttackTime = now;
    }
  }

  /**
   * Handle return state
   */
  private handleReturn(deltaTime: number): void {
    const distance = this.distanceToPosition(this.spawnPosition);

    if (distance < 1) {
      // Returned to spawn
      this.aiState = MonsterAIState.IDLE;
      this.setPosition(this.spawnPosition);
      this.hp = this.maxHp; // Reset HP
      this.mp = this.maxMp;
    } else {
      // Move towards spawn
      this.moveTowards(this.spawnPosition, deltaTime);
    }
  }

  /**
   * Perform attack
   */
  private performAttack(): void {
    if (!this.target) return;

    this.setState(EntityState.ATTACKING);

    // Emit attack event
    this.emit('attack', {
      attackerId: this.id,
      targetId: this.target.id,
      damage: Math.floor(Math.random() * (this.attackPower.max - this.attackPower.min) + this.attackPower.min),
    });

    // La cible peut être une entité détruite (déconnexion): ne jamais crasher
    // le tick monde pour un log (historique de bug: world update figé).
    logger.debug(`Monster attacked: ${this.name} -> ${this.target?.name ?? this.target?.id ?? '?'}`);
  }

  /**
   * Move towards a position
   * @param deltaTime en SECONDES (le tick serveur fournit des secondes)
   */
  private moveTowards(target: Position, deltaTime: number): void {
    const dx = target.x - this.position.x;
    const dz = target.z - this.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 0.1) return;

    // Calculate movement distance
    const moveDistance = this.moveSpeed * deltaTime;

    // Normalize and apply
    const nx = dx / distance;
    const nz = dz / distance;

    this.setPosition({
      x: this.position.x + nx * moveDistance,
      y: this.position.y,
      z: this.position.z + nz * moveDistance,
    });

    // Update rotation to face movement direction
    this.rotation = Math.atan2(nx, nz);
  }

  /**
   * Generate patrol waypoints around spawn
   */
  private generatePatrolWaypoints(): void {
    this.patrolWaypoints = [];
    const patrolCount = Math.floor(Math.random() * 3) + 2; // 2-4 waypoints
    const patrolRange = 20; // 20 meters

    for (let i = 0; i < patrolCount; i++) {
      const angle = (i / patrolCount) * Math.PI * 2;
      const distance = Math.random() * patrolRange;
      this.patrolWaypoints.push({
        x: this.spawnPosition.x + Math.cos(angle) * distance,
        y: this.spawnPosition.y,
        z: this.spawnPosition.z + Math.sin(angle) * distance,
      });
    }

    this.currentWaypointIndex = 0;
  }

  /**
   * Set HP
   */
  setHp(hp: number): void {
    const oldHp = this.hp;
    this.hp = Math.max(0, Math.min(hp, this.maxHp));

    if (this.hp === 0 && oldHp > 0) {
      this.setState(EntityState.DEAD);
      this.handleDeath();
    }

    this.emit('hpChanged', { entityId: this.id, oldHp, newHp: this.hp });
  }

  /**
   * Aggro on a target
   */
  aggro(target: Entity): void {
    this.target = target;
    this.aiState = MonsterAIState.AGGRO;
    this.aggroTime = Date.now();

    logger.debug(`Monster aggroed: ${this.name} -> ${target.name}`, {
      distance: this.distanceTo(target),
    });

    this.emit('aggro', {
      monsterId: this.id,
      targetId: target.id,
    });
  }

  /**
   * Check if can aggro on a target
   */
  canAggro(target: Entity): boolean {
    if (this.state === EntityState.DEAD || this.state === EntityState.RESPawning) {
      return false;
    }

    if (this.aiState === MonsterAIState.RETURN) {
      return false;
    }

    const distance = this.distanceTo(target);
    return distance <= this.aggroRange;
  }

  /**
   * Handle death
   * Le respawn est possédé par le SpawnManager (il retire l'entité et en
   * recrée une quand des joueurs sont proches) — un timer interne de
   * résurrection dupliquerait les monstres.
   */
  private handleDeath(): void {
    logger.info(`Monster died: ${this.name}`, { level: this.level });

    // Cancel patrol
    if (this.patrolTimer) {
      clearTimeout(this.patrolTimer);
      this.patrolTimer = null;
    }

    // Libérer la cible
    this.target = null;

    // Emit death event
    this.emit('death', {
      monsterId: this.id,
      spawnId: this.spawnId,
      position: this.position,
    });
  }

  /**
   * Get combat stats
   */
  getCombatStats() {
    return {
      attackPower: this.attackPower,
      magicalAttackPower: { min: 0, max: 0 },
      defense: this.defense,
      magicalDefense: this.magicalDefense,
      parryRatio: 5,
      blockRatio: 0,
      criticalChance: 5,
      attackRating: this.level * 10,
    };
  }

  /**
   * Serialize for network
   */
  serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      hp: this.hp,
      maxHp: this.maxHp,
      aiState: this.aiState,
    };
  }

  /**
   * Clean up
   */
  destroy(): void {
    if (this.patrolTimer) {
      clearTimeout(this.patrolTimer);
    }
    super.destroy();
  }
}
