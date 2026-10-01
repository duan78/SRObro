/**
 * SRObro - Spawn Manager
 * Handles monster spawning, despawning, and respawn logic
 */

import { MonsterEntity } from '../world/MonsterEntity';
import { prisma } from '../database/prisma';
import { globalSpatialManager } from '../world/SpatialManager';
import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';

const logger = createLogger('SpawnManager');

/**
 * Active spawn data
 */
export interface ActiveSpawn {
  spawnId: string;
  monsterId: string;
  zoneId: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  maxCount: number;
  respawnTime: number;
  patrolRange: number;
  currentMonsters: Map<string, MonsterEntity>;
  lastSpawnCheck: number;
  /** Garde anti double-spawn: checkSpawn est async et appelée en fire-and-forget */
  isChecking: boolean;
}

/**
 * Spawn Manager options
 */
export interface SpawnManagerOptions {
  checkInterval: number; // Milliseconds between spawn checks
  despawnTime: number; // Seconds before despawning monsters when no players nearby
}

/**
 * Spawn Manager class
 */
export class SpawnManager extends EventEmitter {
  private activeSpawns: Map<string, ActiveSpawn> = new Map();
  private monsterEntities: Map<string, MonsterEntity> = new Map();
  private options: Required<SpawnManagerOptions>;
  private checkTimer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(options?: Partial<SpawnManagerOptions>) {
    super();
    this.options = {
      checkInterval: 1000, // Check every second
      despawnTime: 300, // 5 minutes
      ...options,
    };
  }

  /**
   * Initialize spawn manager
   */
  async initialize(): Promise<void> {
    logger.info('Initializing spawn manager...');

    // Load monster spawns from database
    await this.loadMonsterSpawns();

    logger.info(`Spawn manager initialized with ${this.activeSpawns.size} spawn points`);
  }

  /**
   * Load monster spawns from database
   */
  private async loadMonsterSpawns(): Promise<void> {
    try {
      const spawns = await prisma.monsterSpawn.findMany();

      for (const spawn of spawns) {
        const activeSpawn: ActiveSpawn = {
          spawnId: spawn.id,
          monsterId: spawn.monsterId,
          zoneId: spawn.zoneId,
          position: { x: spawn.positionX, y: spawn.positionY, z: spawn.positionZ },
          rotation: spawn.rotation,
          maxCount: spawn.maxCount,
          respawnTime: spawn.respawnTime,
          patrolRange: spawn.patrolRange,
          currentMonsters: new Map(),
          // lastSpawnCheck "échu": le premier cycle de spawn n'attend pas un
          // respawnTime complet — les monstres apparaissent dès qu'un joueur
          // entre dans le rayon (100 m) au check suivant (1 s).
          lastSpawnCheck: Date.now() - spawn.respawnTime * 1000 - 1000,
          isChecking: false,
        };

        this.activeSpawns.set(spawn.id, activeSpawn);
      }

      logger.info(`Loaded ${spawns.length} monster spawn points`);
    } catch (error) {
      logger.error('Failed to load monster spawns:', error);
    }
  }

  /**
   * Start spawn manager
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('Spawn manager is already running');
      return;
    }

    this.isRunning = true;
    this.checkTimer = setInterval(() => {
      this.update();
    }, this.options.checkInterval);

    logger.info('Spawn manager started');
  }

  /**
   * Stop spawn manager
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }

    logger.info('Spawn manager stopped');
  }

  /**
   * Update spawn manager (called periodically)
   */
  private update(): void {
    const now = Date.now();

    for (const [_spawnId, activeSpawn] of this.activeSpawns.entries()) {
      try {
        // Check if it's time to respawn
        if (now - activeSpawn.lastSpawnCheck >= activeSpawn.respawnTime * 1000) {
          activeSpawn.lastSpawnCheck = now;
          void this.checkSpawn(activeSpawn).catch((err) =>
            logger.error(`Spawn check failed for ${activeSpawn.spawnId}:`, err)
          );
        }

        // Check for despawn (no players nearby)
        this.checkDespawn(activeSpawn);
      } catch (error) {
        logger.error(`Spawn update error for ${activeSpawn.spawnId}:`, error);
      }
    }
  }

  /**
   * Check and spawn monsters for a spawn point
   */
  private async checkSpawn(activeSpawn: ActiveSpawn): Promise<void> {
    // Garde: deux checks concurrents (latence DB) feraient doubler les spawns
    if (activeSpawn.isChecking) return;
    activeSpawn.isChecking = true;
    try {
      // Remove dead monsters from count
      let aliveCount = 0;
      for (const [monsterId, monster] of activeSpawn.currentMonsters) {
        if (monster.hp > 0) {
          aliveCount++;
        } else {
          activeSpawn.currentMonsters.delete(monsterId);
        }
      }

      // Check if we need to spawn more monsters
      if (aliveCount < activeSpawn.maxCount) {
        const neededCount = activeSpawn.maxCount - aliveCount;

        // Check if there are players nearby (don't spawn if no players)
        const nearbyPlayers = globalSpatialManager.getEntitiesByType(
          'player',
          activeSpawn.position,
          100 // 100m radius
        );

        if (nearbyPlayers.length === 0) {
          return; // Don't spawn if no players nearby
        }

        // Spawn needed monsters
        for (let i = 0; i < neededCount; i++) {
          await this.spawnMonster(activeSpawn);
        }
      }
    } finally {
      activeSpawn.isChecking = false;
    }
  }

  /**
   * Spawn a single monster
   */
  private async spawnMonster(activeSpawn: ActiveSpawn): Promise<void> {
    try {
      // Get monster data from database
      const monster = await prisma.monster.findUnique({
        where: { id: activeSpawn.monsterId },
      });

      if (!monster) {
        logger.error(`Monster not found: ${activeSpawn.monsterId}`);
        return;
      }

      // Create monster entity
      const monsterId = `${activeSpawn.spawnId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const monsterEntity = new MonsterEntity({
        id: monsterId,
        name: monster.name,
        level: monster.level,
        hp: monster.hp,
        maxHp: monster.hp,
        mp: monster.mp,
        maxMp: monster.mp,
        attackPower: { min: monster.attackPowerMin, max: monster.attackPowerMax },
        defense: monster.defense,
        magicalDefense: monster.magicalDefense,
        exp: Number(monster.exp),
        sp: Number(monster.sp),
        aggroRange: monster.aggroRange,
        attackRange: 3, // Default melee range
        moveSpeed: 3.0,
        attackSpeed: 2000,
        respawnTime: activeSpawn.respawnTime,
        position: { ...activeSpawn.position },
        rotation: activeSpawn.rotation,
        modelId: monster.modelId,
        zoneId: activeSpawn.zoneId,
        spawnId: activeSpawn.spawnId,
      });

      // Add to spawn's current monsters
      activeSpawn.currentMonsters.set(monsterId, monsterEntity);

      // Add to global monster entities
      this.monsterEntities.set(monsterId, monsterEntity);

      // Add to spatial manager
      globalSpatialManager.addEntity({
        id: monsterEntity.id,
        position: monsterEntity.position,
        type: 'monster',
        zoneId: monsterEntity.zoneId,
      });

      // Set up death event listener: le SpawnManager est l'unique
      // propriétaire du cycle de vie — on retire le corps après un court
      // délai, et le respawn est un NOUVEL spawn via checkSpawn (jamais un
      // timer de résurrection interne à l'entité, qui dupliquerait les mobs).
      monsterEntity.on('death', (data: unknown) => {
        setTimeout(() => this.despawnMonster(monsterId), 3000).unref?.();
        this.emit('monsterDeath', data);
      });

      // Les attaques IA remontent au CombatBridge (dégâts autoritaires au
      // joueur) — l'entité ne touche jamais directement aux HP de sa cible.
      monsterEntity.on('attack', (data: unknown) => {
        this.emit('monsterAttack', data);
      });

      // Réindexation spatiale quand le monstre bouge (patrouille/aggro):
      // une entité qui change de cellule sans être réindexée fausse AOI,
      // aggro et diffusion.
      monsterEntity.on('positionChanged', () => {
        globalSpatialManager.updateEntityPosition(monsterId, monsterEntity.position);
      });

      logger.debug(`Monster spawned: ${monsterEntity.name}`, {
        id: monsterId,
        spawnId: activeSpawn.spawnId,
        position: activeSpawn.position,
      });

      this.emit('monsterSpawned', {
        monsterId,
        monsterEntity,
        spawnId: activeSpawn.spawnId,
      });
    } catch (error) {
      logger.error(`Failed to spawn monster: ${activeSpawn.monsterId}`, error);
    }
  }

  /**
   * Spawn ponctuel à la demande (commande GM /spawn, console admin):
   * ActiveSpawn détaché — jamais re-vérifié par checkSpawn, donc ni respawn
   * ni maintien d'effectif. Le corps est retiré 3 s après la mort comme
   * pour tout monstre (listener de spawnMonster).
   */
  async spawnMonsterAt(monsterId: string, position: { x: number; y: number; z: number }, zoneId = 'jangan'): Promise<MonsterEntity | null> {
    const before = new Set(this.monsterEntities.keys());
    const adHoc: ActiveSpawn = {
      spawnId: `gm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      monsterId,
      zoneId,
      position,
      rotation: Math.random() * Math.PI * 2,
      maxCount: 1,
      respawnTime: Number.MAX_SAFE_INTEGER,
      patrolRange: 5,
      currentMonsters: new Map(),
      lastSpawnCheck: 0,
      isChecking: false,
    };
    await this.spawnMonster(adHoc);
    const newId = [...this.monsterEntities.keys()].find((id) => !before.has(id));
    return newId ? this.monsterEntities.get(newId) ?? null : null;
  }

  /** Monstre vivant le plus proche d'une position (commande /mobinfo, /kill). */
  getNearestMonster(position: { x: number; y?: number; z: number }, maxDistance = 50): MonsterEntity | null {
    let best: MonsterEntity | null = null;
    let bestD = maxDistance;
    for (const m of this.monsterEntities.values()) {
      const d = Math.hypot(m.position.x - position.x, m.position.z - position.z);
      if (d < bestD) {
        bestD = d;
        best = m;
      }
    }
    return best;
  }

  /**
   * Check for despawning (no players nearby)
   */
  private checkDespawn(activeSpawn: ActiveSpawn): void {
    const nearbyPlayers = globalSpatialManager.getEntitiesByType(
      'player',
      activeSpawn.position,
      150 // 150m radius
    );

    if (nearbyPlayers.length > 0) {
      return; // Players nearby, don't despawn
    }

    // No players nearby, despawn monsters
    for (const [monsterId, monsterEntity] of activeSpawn.currentMonsters) {
      if (monsterEntity.hp > 0) {
        // Only despawn alive monsters
        this.despawnMonster(monsterId);
      }
    }
  }

  /**
   * Despawn a monster
   */
  private despawnMonster(monsterId: string): void {
    const monsterEntity = this.monsterEntities.get(monsterId);
    if (!monsterEntity) {
      return;
    }

    // Remove from spatial manager
    globalSpatialManager.removeEntity(monsterId);

    // Remove from spawn's current monsters
    for (const activeSpawn of this.activeSpawns.values()) {
      activeSpawn.currentMonsters.delete(monsterId);
    }

    // Remove from global entities
    this.monsterEntities.delete(monsterId);

    // Destroy entity
    monsterEntity.destroy();

    logger.debug(`Monster despawned: ${monsterEntity.name}`, { id: monsterId });

    this.emit('monsterDespawned', { monsterId, monsterEntity });
  }

  /**
   * Force un cycle de spawn immédiat pour les points proches d'une position
   * (arrivée d'un joueur): sans cela, un camp vidé par la déconnexion du
   * précédent visiteur ne se repeuple qu'après un respawnTime complet.
   */
  forceCheckNearby(position: { x: number; y: number; z: number }, radius = 120): void {
    for (const activeSpawn of this.activeSpawns.values()) {
      const d = Math.hypot(
        activeSpawn.position.x - position.x,
        activeSpawn.position.z - position.z,
      );
      if (d <= radius) {
        activeSpawn.lastSpawnCheck = 0; // éligible dès le prochain check (1 s)
      }
    }
  }

  /**
   * Get all active monster entities
   */
  getMonsterEntities(): Map<string, MonsterEntity> {
    return this.monsterEntities;
  }

  /**
   * Get monster entity by ID
   */
  getMonsterEntity(monsterId: string): MonsterEntity | undefined {
    return this.monsterEntities.get(monsterId);
  }

  /**
   * Get spawn point by ID
   */
  getSpawnPoint(spawnId: string): ActiveSpawn | undefined {
    return this.activeSpawns.get(spawnId);
  }

  /**
   * Get all spawn points for a zone
   */
  getSpawnPointsForZone(zoneId: string): ActiveSpawn[] {
    const spawns: ActiveSpawn[] = [];
    for (const spawn of this.activeSpawns.values()) {
      if (spawn.zoneId === zoneId) {
        spawns.push(spawn);
      }
    }
    return spawns;
  }

  /**
   * Get active spawn count
   */
  getActiveSpawnCount(): number {
    return this.activeSpawns.size;
  }

  /**
   * Get total monster count
   */
  getTotalMonsterCount(): number {
    return this.monsterEntities.size;
  }

  /**
   * Get monster count by zone
   */
  getMonsterCountByZone(zoneId: string): number {
    let count = 0;
    for (const monster of this.monsterEntities.values()) {
      if (monster.zoneId === zoneId) {
        count++;
      }
    }
    return count;
  }

  /**
   * Force spawn a monster at a spawn point
   */
  async forceSpawn(spawnId: string): Promise<boolean> {
    const activeSpawn = this.activeSpawns.get(spawnId);
    if (!activeSpawn) {
      logger.warn(`Spawn point not found: ${spawnId}`);
      return false;
    }

    await this.spawnMonster(activeSpawn);
    return true;
  }

  /**
   * Force despawn all monsters at a spawn point
   */
  forceDespawn(spawnId: string): number {
    const activeSpawn = this.activeSpawns.get(spawnId);
    if (!activeSpawn) {
      return 0;
    }

    let count = 0;
    for (const [monsterId] of activeSpawn.currentMonsters) {
      this.despawnMonster(monsterId);
      count++;
    }

    return count;
  }

  /**
   * Clear all spawns
   */
  clearAllSpawns(): void {
    logger.info('Clearing all spawns', { count: this.monsterEntities.size });

    for (const [monsterId] of this.monsterEntities) {
      this.despawnMonster(monsterId);
    }

    this.activeSpawns.clear();
  }

  /**
   * Shutdown spawn manager
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down spawn manager...');

    this.stop();
    this.clearAllSpawns();

    logger.info('Spawn manager shutdown complete');
  }

  /**
   * Get debug info
   */
  getDebugInfo(): {
    spawnCount: number;
    monsterCount: number;
    isRunning: boolean;
  } {
    return {
      spawnCount: this.activeSpawns.size,
      monsterCount: this.monsterEntities.size,
      isRunning: this.isRunning,
    };
  }
}

/**
 * Global spawn manager instance
 */
export const globalSpawnManager = new SpawnManager();
