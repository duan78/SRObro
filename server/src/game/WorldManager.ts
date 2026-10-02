/**
 * SRObro - World Manager (Server)
 * Manages zones, spawns, entities, and game world logic
 */

import type { DatabaseManager } from '../database/DatabaseManager';
import { createLogger } from '../core/Logger';
import type { Client } from '../network/Client';
import { C2SPacket, S2CPacket, Zone, Monster, Position, Entity, EntityType, CharacterRace, PacketType } from '@srobro/shared';
import { globalCombatManager } from '../combat/CombatManager';
import { globalSpatialManager } from '../world/SpatialManager';
import { globalSpawnManager } from '../ai/SpawnManager';
import { PlayerEntity } from '../world/PlayerEntity';
import { MonsterEntity, MonsterAIState } from '../world/MonsterEntity';
import { NPCEntity } from '../world/NPCEntity';
import { prisma } from '../database/prisma';

const logger = createLogger('WorldManager');

/**
 * Convert a Prisma CharacterRace ('chinese' | 'european') to the shared enum
 */
function toSharedRace(race: string): CharacterRace {
  return race === 'european' ? CharacterRace.EUROPEAN : CharacterRace.CHINESE;
}

export class WorldManager {
  private zones: Map<string, Zone> = new Map();
  private monsters: Map<string, Monster> = new Map();
  private npcs: Map<string, Entity> = new Map();
  private players: Map<string, PlayerEntity> = new Map();
  private monsterEntities: Map<string, MonsterEntity> = new Map();
  private npcEntities: Map<string, NPCEntity> = new Map();

  constructor(_dbManager: DatabaseManager) {}

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

    // Le SpawnManager est la source de vérité des monstres: on partage sa
    // map pour que update()/getEntityById() voient les spawns qu'il crée.
    this.monsterEntities = globalSpawnManager.getMonsterEntities();

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
          type: EntityType.MONSTER,
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
          aggroRange: monster.aggroRange * 8, // unités SRO
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
  async handlePlayerLogin(_client: Client, characterId: string): Promise<void> {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          masteries: { include: { mastery: true } },
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
        gender: character.gender,
        race: toSharedRace(character.race),
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
        // Maîtrises { clé normalisée → niveau } (GAP + formules de dégâts)
        masteries: new Map(
          character.masteries.map((cm) => [
            (cm.mastery?.name ?? '').toLowerCase().split(/[\s(]/)[0],
            cm.level,
          ]),
        ),
        // Skills appris (codes officiels) — gating de cast (Phase C)
        learnedSkills: new Set(character.skills.map((cs) => cs.skillId)),
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
  async handlePlayerLogout(_client: Client, characterId: string): Promise<void> {
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

    // Libérer l'aggro des monstres qui ciblaient ce joueur: l'entité va être
    // détruite, et un monstre réféençant une cible détruite crashe le tick.
    for (const monster of this.monsterEntities.values()) {
      if (monster.target && (monster.target as { id?: string }).id === characterId) {
        monster.target = null;
        monster.aiState = MonsterAIState.RETURN;
      }
    }

    // Remove from world
    this.players.delete(characterId);

    // Stoppe l'autosave et les timers de l'entité (sinon ils tournent à jamais)
    playerEntity.destroy();

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

    const data = packet.data as { position: Position; rotation: number; isRunning: number };

    // Payload malformé: ignorer proprement plutôt que d'écraser la position
    if (!data || typeof data.position?.x !== 'number' || !Number.isFinite(data.position.x)) {
      return;
    }

    // GM /freeze: le joueur est figé côté serveur — on ignore le mouvement
    // (le client rappellera sa vraie position dès la reprise)
    if (playerEntity.frozen) {
      return;
    }

    // Update entity position
    playerEntity.setPosition(data.position);
    playerEntity.setRotation(data.rotation);

    // Repeupler les camps autour de la nouvelle position si le joueur a
    // beaucoup bougé (sinon: zones à +120 m du spawn restent vides jusqu'à
    // un cycle respawnTime complet après l'arrivée du joueur).
    const last = this.lastForceCheck.get(characterId);
    if (!last || Math.hypot(data.position.x - last.x, data.position.z - last.z) > 60) {
      this.lastForceCheck.set(characterId, { x: data.position.x, z: data.position.z });
      globalSpawnManager.forceCheckNearby(data.position, 120);
    }

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

    // Cible courante du joueur: le loup attaque la même (Phase H)
    playerEntity.currentTargetId = data.targetId;

    // PvP (Phase E V2): tracer l'agresseur pour le self-defense officiel
    if (targetEntity instanceof PlayerEntity) {
      void import('../pvp/PvPManager.js').then(({ globalPvPManager }) => {
        globalPvPManager.recordAttack(characterId, data.targetId);
      }).catch(() => undefined);
    }

    // Compétence: déléguée au CombatBridge (cooldown, MP, multi-coups)
    if (data.skillId && this.combatBridge) {
      this.combatBridge.processSkillCast(client, characterId, data.skillId, data.targetId);
      return;
    }

    // Validation serveur-autoritaire: cible vivante, à portée, anti-spam.
    if (!targetEntity.isAlive()) {
      return;
    }
    const attackRange = 'attackRange' in targetEntity ? (targetEntity as MonsterEntity).attackRange : 3;
    const distance = playerEntity.distanceTo(targetEntity);
    if (distance > Math.max(attackRange * 3, 15)) {
      logger.warn(`Attack out of range: ${characterId} -> ${data.targetId} (${distance.toFixed(1)}m)`);
      return;
    }
    const now = Date.now();
    const lastAttack = this.lastPlayerAttack.get(characterId) ?? 0;
    if (now - lastAttack < 400) {
      return; // anti-spam réseau (400ms entre attaques de base)
    }
    this.lastPlayerAttack.set(characterId, now);

    // Process attack through combat manager
    globalCombatManager.startCombat(
      this.toCombatParticipant(playerEntity),
      this.toCombatParticipant(targetEntity)
    );

    const result = globalCombatManager.processAttack(characterId, data.targetId);

    if (result) {
      // Écriture des HP réels: le CombatManager travaille sur une copie de
      // session — sans cette écriture les entités ne perdent jamais de HP
      // et les monstres ne meurent jamais.
      if (targetEntity instanceof PlayerEntity || targetEntity instanceof MonsterEntity) {
        targetEntity.setHp(result.targetHp);
      }

      // Broadcast attack to nearby clients
      const attackPacket = {
        type: 'attack' as const,
        timestamp: packet.timestamp,
        data: {
          attackerId: characterId,
          targetId: data.targetId,
          skillId: data.skillId,
          damage: result.damage,
          isCritical: result.isCritical,
          isBlocked: result.isBlocked,
          remainingHp: result.targetHp,
        },
      };
      this.broadcastToNearbyClients(characterId, attackPacket);
      // L'ATTAQUANT doit aussi recevoir son attaque (dégâts affichés, HP cible):
      // broadcastToNearbyClients exclut explicitement la source.
      this.sendToClient(characterId, attackPacket);
    }
  }

  /**
   * Handle chat packet from client
   */
  async handleChatPacket(client: Client, packet: C2SPacket): Promise<void> {
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

    // Commandes slash: GM d'abord (phase 6), puis joueur (phase 5)
    if (data.message?.startsWith('/')) {
      const handled = this.gmCommands ? await this.gmCommands.dispatch(client, packet) : false;
      if (handled) {
        return;
      }
      const cmd = data.message.split(' ')[0].toLowerCase();
      if (cmd === '/who') {
        const others = this.getAllPlayers().filter((p) => p.id !== characterId);
        const list = others.map((p) => `${p.name} (niv. ${p.level})`).join(', ');
        this.sendToClient(characterId, {
          type: 'chat', timestamp: packet.timestamp,
          data: { channel: 'system', message: `En ligne: ${others.length + 1} joueur(s) — ${playerEntity.name}${list ? ', ' + list : ''}` },
        });
        return;
      }
      if (cmd === '/loc') {
        this.sendToClient(characterId, {
          type: 'chat', timestamp: packet.timestamp,
          data: { channel: 'system', message: `Position: X=${playerEntity.position.x.toFixed(0)} Z=${playerEntity.position.z.toFixed(0)} (zone ${playerEntity.zoneId})` },
        });
        return;
      }
      // /w <nom> <message> — chuchotement par NOM (phase D V3): le client ne
      // connaît pas les characterId, le serveur résout le nom.
      if (cmd === '/w' || cmd === '/whisper') {
        const parts = data.message.split(' ');
        const targetName = parts[1];
        const text = parts.slice(2).join(' ');
        if (!targetName || !text) {
          this.sendToClient(characterId, {
            type: 'chat', timestamp: packet.timestamp,
            data: { channel: 'system', message: 'Usage: /w <nom> <message>' },
          });
          return;
        }
        const { resolvePlayerByName } = await import('./ChatChannels.js');
        const target = await resolvePlayerByName(targetName);
        if (!target) {
          this.sendToClient(characterId, {
            type: 'chat', timestamp: packet.timestamp,
            data: { channel: 'system', message: `Joueur introuvable ou hors ligne: ${targetName}` },
          });
          return;
        }
        // Livraison au destinataire + accusé à l'expéditeur
        this.sendToClient(target.id, {
          type: 'chat', timestamp: packet.timestamp,
          data: { playerId: characterId, playerName: playerEntity.name, message: text, channel: 'whisper' },
        });
        this.sendToClient(characterId, {
          type: 'chat', timestamp: packet.timestamp,
          data: { channel: 'whisper_sent', message: `À ${target.name}: ${text}` },
        });
        return;
      }
      this.sendToClient(characterId, {
        type: 'chat', timestamp: packet.timestamp,
        data: { channel: 'system', message: `Commande inconnue: ${cmd} — /help pour la liste` },
      });
      return;
    }

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
      // Phase D V3: canaux sociaux party / guild / union
      case 'party':
      case 'guild':
      case 'union': {
        void (async () => {
          const { partyTargets, guildTargets, unionTargets } = await import('./ChatChannels.js');
          let targets: { characterIds: string[]; label: string } | null = null;
          if (data.channel === 'party') targets = partyTargets(characterId);
          else if (data.channel === 'guild') targets = await guildTargets(characterId);
          else targets = await unionTargets(characterId);
          if (!targets) {
            this.sendToClient(characterId, {
              type: 'chat', timestamp: packet.timestamp,
              data: { channel: 'system', message: `Canal ${data.channel} indisponible (pas de ${data.channel === 'party' ? 'groupe' : data.channel === 'guild' ? 'guilde' : 'union'}).` },
            });
            return;
          }
          for (const id of targets.characterIds) {
            this.sendToClient(id, {
              type: 'chat', timestamp: packet.timestamp,
              data: {
                playerId: characterId, playerName: playerEntity.name,
                message: data.message, channel: data.channel,
              },
            });
          }
        })();
        break;
      }
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
      type: 'npc_interaction' as PacketType,
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
   * Get a logged-in player entity by character ID
   */
  async getCharacter(characterId: string): Promise<PlayerEntity | undefined> {
    return this.players.get(characterId);
  }

  /**
   * Convert entity to combat participant
   */
  toCombatParticipant(entity: PlayerEntity | MonsterEntity | NPCEntity) {    return {
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

    // Diffusion des positions/états monstres (throttlée)
    this.combatBridge?.update(delta);

    // Update all players
    for (const player of this.players.values()) {
      player.update(delta);
    }

    // Update all monsters + aggro. Sans joueur connecté, on saute les
    // requêtes spatiales d'aggro (sinon 1 requête par monstre par tick).
    for (const monster of this.monsterEntities.values()) {
      try {
        monster.update(delta);

        // Check for aggro
        if (this.players.size > 0 && (monster.aiState === 'idle' || monster.aiState === 'patrol')) {
          const nearbyPlayers = globalSpatialManager.getEntitiesByType('player', monster.position, monster.aggroRange);
          for (const player of nearbyPlayers) {
            const playerEntity = this.players.get(player.id);
            if (playerEntity && playerEntity.isAlive() && monster.canAggro(playerEntity)) {
              monster.aggro(playerEntity);
            }
          }
        }
      } catch (monsterError) {
        // Une entité corrompue ne doit JAMAIS figer tout le monde (bug
        // historique: target null → tick en échec → monde gelé).
        logger.error(`Monster update error (${monster.name}):`, monsterError);
        monster.target = null;
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

  // Anti-spam d'attaque par personnage (timestamp de la dernière attaque)
  private lastPlayerAttack: Map<string, number> = new Map();

  // Dernière position où un forceCheckNearby a été fait pour ce joueur
  private lastForceCheck: Map<string, { x: number; z: number }> = new Map();

  // Pont combat (phase 2) — injecté après construction pour éviter le cycle
  // WorldManager ⇄ CombatBridge.
  combatBridge: import('./CombatBridge').CombatBridge | null = null;
  /** Commandes GM (phase 6) — injecté par GameServer après CombatBridge */
  gmCommands: import('../admin/GmCommands').GmCommands | null = null;

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

  /** Joueur connecté par characterId (null si hors ligne). */
  getPlayer(characterId: string): PlayerEntity | undefined {
    return this.players.get(characterId);
  }

  /** Tous les joueurs connectés (visibilité multi-joueurs). */
  getAllPlayers(): PlayerEntity[] {
    return Array.from(this.players.values());
  }
}
