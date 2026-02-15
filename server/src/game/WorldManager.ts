/**
 * SRObro - World Manager (Server)
 * Manages zones, spawns, entities, and game world logic
 */

// @ts-nocheck
import type { DatabaseManager } from '../database/DatabaseManager';
import { createLogger } from '../core/Logger';
import type { Client } from '../network/Client';
import { C2SPacket, S2CPacket, Zone, Monster, Position, Entity, EntityType } from '@srobro/shared';
import { globalCombatManager } from '../combat/CombatManager';
import { globalSpatialManager } from '../world/SpatialManager';
import { PlayerEntity } from '../world/PlayerEntity';
import { MonsterEntity } from '../world/MonsterEntity';
import { NPCEntity } from '../world/NPCEntity';
import { prisma } from '../database/prisma';

const logger = createLogger('WorldManager');

export class WorldManager {
  private dbManager: DatabaseManager;
  private zones: Map<string, Zone> = new Map();
  private monsters: Map<string, Monster> = new Map();
  private npcs: Map<string, Entity> = new Map();
  private players: Map<string, PlayerEntity> = new Map();
  private monsterEntities: Map<string, MonsterEntity> = new Map();
  private npcEntities: Map<string, NPCEntity> = new Map();

  constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  /**
   * Initialize world manager
   */
  async initialize(): Promise<void> {
    logger.info('Initializing world manager...');

    // Load zones from Prisma
    await this.loadZones();

    // Load monsters from Prisma
    await this.loadMonsters();

    // Load NPCs from Prisma
    await this.loadNPCs();

    logger.info('World manager initialized');
  }

  /**
   * Load zones from database
   */
  private async loadZones(): Promise<void> {
    try {
      const zones = await prisma.zone.findMany();
      for (const zone of zones) {
        this.zones.set(zone.id, {
          id: zone.id,
          name: zone.name,
          levelRange: { min: zone.levelMin, max: zone.levelMax },
          size: { width: zone.width, height: zone.height },
          spawnPoints: [],
          npcs: [],
          monsters: [],
          teleportPoints: [],
        });
      }
      logger.info(`Loaded ${this.zones.size} zones`);
    } catch (error) {
      logger.error('Failed to load zones:', error);
      // Create default zones if database is empty
      this.createDefaultZones();
    }
  }

  /**
   * Create default zones
   */
  private createDefaultZones(): void {
    const defaultZones: Zone[] = [
      {
        id: 'zone_jangan',
        name: 'Jangan',
        levelRange: { min: 1, max: 20 },
        size: { width: 2000, height: 2000 },
        spawnPoints: [
          { position: { x: 0, y: 0, z: 0 }, rotation: 0 },
        ],
        npcs: [],
        monsters: [],
        teleportPoints: [],
      },
    ];

    for (const zone of defaultZones) {
      this.zones.set(zone.id, zone);
    }

    logger.info(`Created ${defaultZones.length} default zones`);
  }

  /**
   * Load monsters from database
   */
  private async loadMonsters(): Promise<void> {
    try {
      const monsters = await prisma.monster.findMany();
      for (const monster of monsters) {
        this.monsters.set(monster.id, {
          id: monster.id,
          type: 'monster',
          name: monster.name,
          level: monster.level,
          position: { x: 0, y: 0, z: 0 }, // Will be set by spawn manager
          rotation: 0,
          modelId: monster.modelId,
          hp: monster.hp,
          maxHp: monster.hp,
          attackPower: { min: monster.attackPowerMin, max: monster.attackPowerMax },
          defense: monster.defense,
          exp: Number(monster.exp),
          sp: Number(monster.sp),
          aggroRange: monster.aggroRange,
          respawnTime: monster.respawnTime,
          drops: [],
        } as Monster);
      }
      logger.info(`Loaded ${this.monsters.size} monster types`);
    } catch (error) {
      logger.error('Failed to load monsters:', error);
    }
  }

  /**
   * Load NPCs from database
   */
  private async loadNPCs(): Promise<void> {
    try {
      const npcs = await prisma.nPC.findMany();
      for (const npc of npcs) {
        this.npcs.set(npc.id, {
          id: npc.id,
          type: EntityType.NPC,
          name: npc.name,
          level: 1,
          position: { x: npc.positionX, y: npc.positionY, z: npc.positionZ },
          rotation: npc.rotation,
          modelId: npc.modelId,
        });
      }
      logger.info(`Loaded ${this.npcs.size} NPCs`);
    } catch (error) {
      logger.error('Failed to load NPCs:', error);
    }
  }

  /**
   * Handle player login
   */
  async handlePlayerLogin(client: Client, characterId: string): Promise<void> {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          masteries: true,
          skills: {
            include: { skill: true },
          },
          inventoryItems: {
            include: { item: true },
          },
        },
      });

      if (!character) {
        logger.error(`Character not found: ${characterId}`);
        return;
      }

      // Create player entity
      const playerEntity = new PlayerEntity({
        id: character.id,
        name: character.name,
        accountId: character.accountId,
        race: character.race,
        level: character.level,
        exp: Number(character.exp),
        sp: Number(character.sp),
        hp: character.hp,
        maxHp: character.maxHp,
        mp: character.mp,
        maxMp: character.maxMp,
        str: character.str,
        int: character.int,
        position: { x: character.positionX, y: character.positionY, z: character.positionZ },
        rotation: character.rotation,
        gold: Number(character.gold),
        zoneId: character.zoneId,
        modelId: 'char_chinese_male',
        skillPoints: character.skillPoints,
        statPoints: character.statPoints,
      });

      this.players.set(characterId, playerEntity);

      // Add to spatial manager
      globalSpatialManager.addEntity({
        id: playerEntity.id,
        position: playerEntity.position,
        type: 'player',
        zoneId: playerEntity.zoneId,
      });

      // Set character online
      await prisma.character.update({
        where: { id: characterId },
        data: { isOnline: true, lastLoginAt: new Date() },
      });

      logger.info(`Player logged in: ${playerEntity.name}`, {
        id: playerEntity.id,
        level: playerEntity.level,
      });

      this.emit('playerJoined', { playerId: characterId, playerEntity });
    } catch (error) {
      logger.error(`Failed to handle player login: ${characterId}`, error);
    }
  }

  /**
   * Handle player logout
   */
  async handlePlayerLogout(client: Client, characterId: string): Promise<void> {
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    // Save to database
    await playerEntity.saveToDatabase();

    // Set character offline
    await prisma.character.update({
      where: { id: characterId },
      data: { isOnline: false },
    });

    // Remove from spatial manager
    globalSpatialManager.removeEntity(characterId);

    // Remove from world
    this.players.delete(characterId);

    logger.info(`Player logged out: ${playerEntity.name}`, { id: playerEntity.id });

    this.emit('playerLeft', { playerId: characterId });
  }

  /**
   * Handle move packet from client
   */
  handleMovePacket(client: Client, packet: C2SPacket): void {
    if (!client.getIsAuthenticated()) {
      return;
    }

    const characterId = client.getCharacterId();
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    const data = packet.data as { position: Position; rotation: number; isRunning: boolean };

    // Update entity position
    playerEntity.setPosition(data.position);
    playerEntity.setRotation(data.rotation);

    // Update spatial manager
    globalSpatialManager.updateEntityPosition(characterId, data.position);

    // Broadcast movement to nearby clients
    this.broadcastToNearbyClients(characterId, {
      type: 'update',
      timestamp: packet.timestamp,
      data: {
        id: characterId,
        position: data.position,
        rotation: data.rotation,
      },
    });
  }

  /**
   * Handle attack packet from client
   */
  handleAttackPacket(client: Client, packet: C2SPacket): void {
    if (!client.getIsAuthenticated()) {
      return;
    }

    const characterId = client.getCharacterId();
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    const data = packet.data as { targetId: string; skillId?: string };
    const targetEntity = this.getEntityById(data.targetId);

    if (!targetEntity) {
      logger.warn(`Attack target not found: ${data.targetId}`);
      return;
    }

    // Process attack through combat manager
    const combatId = globalCombatManager.startCombat(
      this.toCombatParticipant(playerEntity),
      this.toCombatParticipant(targetEntity)
    );

    const result = globalCombatManager.processAttack(characterId, data.targetId);

    if (result) {
      // Broadcast attack to nearby clients
      this.broadcastToNearbyClients(characterId, {
        type: 'attack',
        timestamp: packet.timestamp,
        data: {
          attackerId: characterId,
          targetId: data.targetId,
          skillId: data.skillId,
          damage: result.damage,
          isCritical: result.isCritical,
          isBlocked: result.isBlocked,
        },
      });
    }
  }

  /**
   * Handle chat packet from client
   */
  handleChatPacket(client: Client, packet: C2SPacket): void {
    if (!client.getIsAuthenticated()) {
      return;
    }

    const characterId = client.getCharacterId();
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    const data = packet.data as { message: string; channel: string; targetId?: string };

    logger.info(`Chat from ${playerEntity.name}: ${data.message}`);

    // Broadcast chat based on channel
    switch (data.channel) {
      case 'general':
        this.broadcastToNearbyClients(characterId, {
          type: 'chat',
          timestamp: packet.timestamp,
          data: {
            playerId: characterId,
            playerName: playerEntity.name,
            message: data.message,
            channel: data.channel,
          },
        });
        break;
      case 'whisper':
        if (data.targetId) {
          this.sendToClient(data.targetId, {
            type: 'chat',
            timestamp: packet.timestamp,
            data: {
              playerId: characterId,
              playerName: playerEntity.name,
              message: data.message,
              channel: data.channel,
            },
          });
        }
        break;
      // TODO: Handle party, guild, shout channels
    }
  }

  /**
   * Handle interact packet from client
   */
  handleInteractPacket(client: Client, packet: C2SPacket): void {
    if (!client.getIsAuthenticated()) {
      return;
    }

    const characterId = client.getCharacterId();
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    const data = packet.data as { action: string; [key: string]: unknown };

    switch (data.action) {
      case 'enter_zone':
        this.handleEnterZone(client, data.zoneId as string);
        break;
      case 'interact_npc':
        this.handleInteractNPC(characterId, data.targetId as string);
        break;
      default:
        logger.warn(`Unknown interact action: ${data.action}`);
    }
  }

  /**
   * Handle entering a zone
   */
  private async handleEnterZone(client: Client, zoneId: string): Promise<void> {
    const zone = this.zones.get(zoneId);
    if (!zone) {
      logger.error(`Zone not found: ${zoneId}`);
      return;
    }

    const characterId = client.getCharacterId();
    const playerEntity = this.players.get(characterId);
    if (!playerEntity) {
      return;
    }

    playerEntity.zoneId = zoneId;
    client.setZoneId(zoneId);

    // Send zone data to client
    client.send('zone_data', {
      zone,
      timestamp: Date.now(),
    });

    // Send nearby NPCs
    const nearbyNPCs = globalSpatialManager.getEntitiesByType('npc', playerEntity.position, 100);
    for (const npc of nearbyNPCs) {
      const npcEntity = this.npcEntities.get(npc.id);
      if (npcEntity) {
        client.send('spawn', npcEntity.serialize());
      }
    }

    // Send nearby monsters
    const nearbyMonsters = globalSpatialManager.getEntitiesByType('monster', playerEntity.position, 100);
    for (const monster of nearbyMonsters) {
      const monsterEntity = this.monsterEntities.get(monster.id);
      if (monsterEntity) {
        client.send('spawn', monsterEntity.serialize());
      }
    }

    // Send nearby players
    const nearbyPlayers = globalSpatialManager.getEntitiesByType('player', playerEntity.position, 100);
    for (const player of nearbyPlayers) {
      if (player.id !== characterId) {
        const otherPlayerEntity = this.players.get(player.id);
        if (otherPlayerEntity) {
          client.send('spawn', otherPlayerEntity.serialize());
        }
      }
    }

    logger.info(`Client ${characterId} entered zone: ${zoneId}`);
  }

  /**
   * Handle NPC interaction
   */
  private handleInteractNPC(playerId: string, npcId: string): void {
    const npcEntity = this.npcEntities.get(npcId);
    if (!npcEntity) {
      logger.warn(`NPC not found: ${npcId}`);
      return;
    }

    const interaction = npcEntity.interact(playerId);

    this.sendToClient(playerId, {
      type: 'npc_interaction',
      timestamp: Date.now(),
      data: {
        npcId,
        ...interaction,
      },
    });
  }

  /**
   * Get entity by ID
   */
  getEntityById(entityId: string): PlayerEntity | MonsterEntity | NPCEntity | undefined {
    return this.players.get(entityId) || this.monsterEntities.get(entityId) || this.npcEntities.get(entityId);
  }

  /**
   * Convert entity to combat participant
   */
  private toCombatParticipant(entity: PlayerEntity | MonsterEntity | NPCEntity) {
    return {
      id: entity.id,
      name: entity.name,
      level: entity.level,
      hp: entity instanceof PlayerEntity || entity instanceof MonsterEntity ? entity.hp : 100,
      maxHp: entity instanceof PlayerEntity || entity instanceof MonsterEntity ? entity.maxHp : 100,
      mp: entity instanceof PlayerEntity || entity instanceof MonsterEntity ? entity.mp : 50,
      maxMp: entity instanceof PlayerEntity || entity instanceof MonsterEntity ? entity.maxMp : 50,
      stats: entity instanceof PlayerEntity ? entity.stats : entity instanceof MonsterEntity ? entity.getCombatStats() : {
        attackPower: { min: 0, max: 0 },
        magicalAttackPower: { min: 0, max: 0 },
        defense: 0,
        magicalDefense: 0,
        parryRatio: 0,
        blockRatio: 0,
        criticalChance: 0,
        attackRating: 0,
      },
      position: entity.position,
    };
  }

  /**
   * Broadcast packet to nearby clients
   */
  private broadcastToNearbyClients(sourceEntityId: string, packet: S2CPacket): void {
    const sourceEntity = this.getEntityById(sourceEntityId);
    if (!sourceEntity) {
      return;
    }

    const nearbyEntities = globalSpatialManager.getEntitiesInAOI(sourceEntity.position);

    for (const entity of nearbyEntities) {
      if (entity.type === 'player' && entity.id !== sourceEntityId) {
        this.sendToClient(entity.id, packet);
      }
    }
  }

  /**
   * Send packet to specific client
   */
  private sendToClient(playerId: string, packet: S2CPacket): void {
    // This would be handled by ClientManager/GameServer
    this.emit('sendToClient', { playerId, packet });
  }

  /**
   * Update world manager (called each tick)
   */
  update(delta: number): void {
    // Update combat manager
    globalCombatManager.update();

    // Update all players
    for (const player of this.players.values()) {
      player.update(delta);
    }

    // Update all monsters
    for (const monster of this.monsterEntities.values()) {
      monster.update(delta);

      // Check for aggro
      if (monster.aiState === 'idle' || monster.aiState === 'patrol') {
        const nearbyPlayers = globalSpatialManager.getEntitiesByType('player', monster.position, monster.aggroRange);
        for (const player of nearbyPlayers) {
          const playerEntity = this.players.get(player.id);
          if (playerEntity && playerEntity.isAlive() && monster.canAggro(playerEntity)) {
            monster.aggro(playerEntity);
          }
        }
      }
    }
  }

  /**
   * Shutdown world manager
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down world manager...');

    // Save all players
    for (const player of this.players.values()) {
      await player.saveToDatabase();
      player.destroy();
    }

    // Clear all entities
    this.players.clear();
    this.monsterEntities.clear();
    this.npcEntities.clear();
    this.zones.clear();
    this.monsters.clear();
    this.npcs.clear();

    // Clear spatial manager
    globalSpatialManager.clear();

    // Clear combat manager
    globalCombatManager.clearAllCombats();

    logger.info('World manager shutdown complete');
  }

  /**
   * EventEmitter methods (simple implementation)
   */
  private eventListeners: Map<string, Array<(...args: unknown[]) => void>> = new Map();

  on(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
  }
}
