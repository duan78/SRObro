/**
 * SRObro - Game Server
 * Core game server logic and Socket.IO handling
 */

import type { Server as IOServer, Socket } from 'socket.io';
import type { DatabaseManager } from '../database/DatabaseManager';
import { createLogger } from './Logger';
import { ClientManager } from '../network/ClientManager';
import { WorldManager } from '../game/WorldManager';
import { SystemHandlers } from '../network/SystemHandlers';
import { GameLoop } from './GameLoop';
import type { C2SPacket, S2CPacket } from '@srobro/shared';

// Import system managers
import { GuildManager } from '../guild/GuildManager';
import { QuestManager } from '../quest/QuestManager';
import { FortressManager } from '../fortress/FortressManager';
import { MountManager } from '../mount/MountManager';
import { HotkeyManager } from '../hotkey/HotkeyManager';
import { CastingManager } from '../casting/CastingManager';
import { MinimapManager } from '../minimap/MinimapManager';
import { DropManager } from '../drop/DropManager';

const logger = createLogger('GameServer');

export class GameServer {
  private io: IOServer;
  private dbManager: DatabaseManager;
  private clientManager: ClientManager | null = null;
  private worldManager: WorldManager | null = null;
  private systemHandlers: SystemHandlers | null = null;
  private gameLoop: GameLoop;
  private isRunning = false;

  // System managers (singletons)
  private guildManager: GuildManager;
  private questManager: QuestManager;
  private fortressManager: FortressManager;
  private mountManager: MountManager;

  // Priority 1 managers (singletons)
  private hotkeyManager: HotkeyManager;
  private castingManager: CastingManager;
  private minimapManager: MinimapManager;
  private dropManager: DropManager;

  // Tick rate
  private tickRate = 20; // Hz
  private tickInterval: NodeJS.Timeout | null = null;

  constructor(io: IOServer, dbManager: DatabaseManager) {
    this.io = io;
    this.dbManager = dbManager;

    // Initialize singleton managers
    this.guildManager = GuildManager.getInstance();
    this.questManager = QuestManager.getInstance();
    this.fortressManager = FortressManager.getInstance();
    this.mountManager = MountManager.getInstance();

    // Initialize Priority 1 managers
    this.hotkeyManager = HotkeyManager.getInstance();
    this.castingManager = CastingManager.getInstance();
    this.minimapManager = MinimapManager.getInstance();
    this.dropManager = DropManager.getInstance();

    // Initialize game loop
    this.gameLoop = new GameLoop(this.tickRate);
    this.gameLoop.on('tick', ({ delta }) => this.tick(delta));

    // Start cleanup interval for dropped items
    this.dropManager.startCleanupInterval(60000); // Every minute

    // Initialize system handlers
    this.systemHandlers = new SystemHandlers();
  }

  /**
   * Initialize the game server
   */
  async initialize(): Promise<void> {
    logger.info('Initializing game server...');

    // Initialize client manager
    this.clientManager = new ClientManager(this.io, this.dbManager);
    await this.clientManager.initialize();

    // Initialize world manager
    this.worldManager = new WorldManager(this.dbManager);
    await this.worldManager.initialize();

    // Set up Socket.IO handlers
    this.setupSocketHandlers();

    this.isRunning = true;
    logger.info('Game server initialized');
  }

  /**
   * Set up Socket.IO connection handlers
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle client connection
      this.clientManager?.handleClientConnection(socket);

      // Register system handlers (guild, quest, fortress, mount)
      if (this.systemHandlers) {
        this.systemHandlers.registerHandlers(socket);
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
        this.clientManager?.handleClientDisconnection(socket.id);
      });

      // Handle error
      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });

      // Handle packets from client
      socket.on('move', (data) => this.handlePacket(socket, 'move', data));
      socket.on('attack', (data) => this.handlePacket(socket, 'attack', data));
      socket.on('cast_skill', (data) => this.handlePacket(socket, 'cast_skill', data));
      socket.on('chat', (data) => this.handlePacket(socket, 'chat', data));
      socket.on('interact', (data) => this.handlePacket(socket, 'interact', data));

      // Priority 1 feature packets
      socket.on('hotkey_use', (data) => this.handlePacket(socket, 'hotkey_use', data));
      socket.on('hotkey_bind', (data) => this.handlePacket(socket, 'hotkey_bind', data));
      socket.on('pickup_item', (data) => this.handlePacket(socket, 'pickup_item', data));
      socket.on('pickup_all', (data) => this.handlePacket(socket, 'pickup_all', data));
    });
  }

  /**
   * Handle packet from client
   */
  private handlePacket(socket: Socket, type: string, data: unknown): void {
    const client = this.clientManager?.getClient(socket.id);
    if (!client) {
      logger.warn(`Received packet from unregistered client: ${socket.id}`);
      return;
    }

    const packet: C2SPacket = {
      type: type as any,
      timestamp: Date.now(),
      playerId: client.getPlayerId(),
      data,
    };

    // Route packet to appropriate handler
    switch (type) {
      case 'move':
        this.worldManager?.handleMovePacket(client, packet);
        break;
      case 'attack':
      case 'cast_skill':
        this.worldManager?.handleAttackPacket(client, packet);
        break;
      case 'chat':
        this.worldManager?.handleChatPacket(client, packet);
        break;
      case 'interact':
        this.worldManager?.handleInteractPacket(client, packet);
        break;
      case 'hotkey_use':
        this.handleHotkeyUse(client, packet);
        break;
      case 'hotkey_bind':
        this.handleHotkeyBind(client, packet);
        break;
      case 'pickup_item':
        this.handlePickupItem(client, packet);
        break;
      case 'pickup_all':
        this.handlePickupAll(client, packet);
        break;
      default:
        logger.warn(`Unknown packet type: ${type}`);
    }
  }

  /**
   * Broadcast packet to all clients
   */
  broadcast(packet: S2CPacket): void {
    this.io.emit(packet.type, packet);
  }

  /**
   * Broadcast packet to all clients in a room
   */
  broadcastToRoom(room: string, packet: S2CPacket): void {
    this.io.to(room).emit(packet.type, packet);
  }

  /**
   * Send packet to specific client
   */
  sendToClient(socketId: string, packet: S2CPacket): void {
    this.io.to(socketId).emit(packet.type, packet);
  }

  /**
   * Start game loop
   */
  startGameLoop(): void {
    if (this.tickInterval) {
      return;
    }

    const tickDuration = 1000 / this.tickRate;

    this.tickInterval = setInterval(() => {
      const delta = tickDuration / 1000;
      this.tick(delta);
    }, tickDuration);

    logger.info(`Game loop started at ${this.tickRate} Hz`);
  }

  /**
   * Stop game loop
   */
  stopGameLoop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
      logger.info('Game loop stopped');
    }
  }

  /**
   * Game tick
   */
  private tick(delta: number): void {
    // Update world
    this.worldManager?.update(delta);

    // Update clients
    this.clientManager?.update(delta);

    // Update all active casts
    const castingUpdates = this.castingManager.updateAllActiveCasts();
    // TODO: Broadcast casting updates to relevant clients
  }

  // ============================================
  // PRIORITY 1 FEATURE HANDLERS
  // ============================================

  /**
   * Handle hotkey use
   */
  private async handleHotkeyUse(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { slotType: string; slotIndex: number };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const result = await this.hotkeyManager.useHotkey(
      characterId,
      data.slotType as any,
      data.slotIndex
    );

    if (result.success) {
      // Execute the skill or item use
      if (result.type === 'skill' && result.id) {
        // Trigger skill cast
        const skillPacket = {
          type: 'cast_skill' as const,
          timestamp: Date.now(),
          data: { skillId: result.id }
        };
        this.worldManager?.handleAttackPacket(client, skillPacket);
      } else if (result.type === 'item' && result.id) {
        // Use item
        // TODO: Implement item use
        logger.info(`Character ${characterId} used item ${result.id} via hotkey`);
      }
    } else {
      logger.warn(`Hotkey use failed: ${result.error}`);
    }
  }

  /**
   * Handle hotkey binding
   */
  private async handleHotkeyBind(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { slotType: string; slotIndex: number; itemId?: string; skillId?: string };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const success = await this.hotkeyManager.saveBinding(
      characterId,
      data.slotType as any,
      data.slotIndex,
      data.itemId,
      data.skillId
    );

    if (success) {
      // Confirm binding save
      this.sendToClient(client.getSocketId(), {
        type: 'hotkey_bind_response',
        timestamp: Date.now(),
        data: { success: true, slotType: data.slotType, slotIndex: data.slotIndex }
      });
    } else {
      this.sendToClient(client.getSocketId(), {
        type: 'hotkey_bind_response',
        timestamp: Date.now(),
        data: { success: false, error: 'Failed to save binding' }
      });
    }
  }

  /**
   * Handle item pickup
   */
  private async handlePickupItem(client: any, packet: C2SPacket): Promise<void> {
    const data = packet.data as { droppedItemId: string };
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    const result = await this.dropManager.pickupItem(data.droppedItemId, characterId);

    if (result.success) {
      // Send success response with item data
      this.sendToClient(client.getSocketId(), {
        type: 'pickup_success',
        timestamp: Date.now(),
        data: {
          itemId: result.itemId,
          itemData: result.itemData
        }
      });

      // Broadcast item pickup to nearby players
      // TODO: Implement AOI broadcast
    } else {
      // Send error response
      this.sendToClient(client.getSocketId(), {
        type: 'pickup_failed',
        timestamp: Date.now(),
        data: { message: result.message }
      });
    }
  }

  /**
   * Handle pickup all nearby items
   */
  private async handlePickupAll(client: any, packet: C2SPacket): Promise<void> {
    const characterId = client.getCharacterId();

    if (!characterId) {
      return;
    }

    // Get player position
    const player = await this.worldManager?.getCharacter(characterId);

    if (!player) {
      return;
    }

    // Get nearby dropped items from zone
    const zoneItems = await this.dropManager.getDroppedItemsInZone(player.zoneId);

    let pickedUp = 0;
    for (const item of zoneItems) {
      const result = await this.dropManager.pickupItem(item.id, characterId);
      if (result.success) {
        pickedUp++;
      }
    }

    // Send response
    this.sendToClient(client.getSocketId(), {
      type: 'pickup_all_response',
      timestamp: Date.now(),
      data: { pickedUp }
    });
  }

  /**
   * Shutdown the game server
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down game server...');

    this.isRunning = false;

    // Stop game loop
    this.stopGameLoop();

    // Disconnect all clients
    await this.clientManager?.shutdown();

    // Shutdown world manager
    await this.worldManager?.shutdown();

    logger.info('Game server shutdown complete');
  }

  /**
   * Get server status
   */
  getStatus(): { isRunning: boolean; clients: number; tickRate: number } {
    return {
      isRunning: this.isRunning,
      clients: this.clientManager?.getClientCount() || 0,
      tickRate: this.tickRate,
    };
  }

  // ============================================
  // MANAGER GETTERS
  // ============================================

  /**
   * Get guild manager instance
   */
  getGuildManager(): GuildManager {
    return this.guildManager;
  }

  /**
   * Get quest manager instance
   */
  getQuestManager(): QuestManager {
    return this.questManager;
  }

  /**
   * Get fortress manager instance
   */
  getFortressManager(): FortressManager {
    return this.fortressManager;
  }

  /**
   * Get mount manager instance
   */
  getMountManager(): MountManager {
    return this.mountManager;
  }

  /**
   * Get hotkey manager instance
   */
  getHotkeyManager(): HotkeyManager {
    return this.hotkeyManager;
  }

  /**
   * Get casting manager instance
   */
  getCastingManager(): CastingManager {
    return this.castingManager;
  }

  /**
   * Get minimap manager instance
   */
  getMinimapManager(): MinimapManager {
    return this.minimapManager;
  }

  /**
   * Get drop manager instance
   */
  getDropManager(): DropManager {
    return this.dropManager;
  }
}
