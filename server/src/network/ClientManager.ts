/**
 * SRObro - Client Manager
 * Manages connected clients and their state
 */

import type { Server as IOServer, Socket } from 'socket.io';
import type { DatabaseManager } from '../database/DatabaseManager';
import { createLogger } from '../core/Logger';
import { Client } from './Client';

const logger = createLogger('ClientManager');

export class ClientManager {
  private io: IOServer;
  private dbManager: DatabaseManager;
  private clients: Map<string, Client> = new Map();
  private clientsByPlayerId: Map<string, Client> = new Map();

  constructor(io: IOServer, dbManager: DatabaseManager) {
    this.io = io;
    this.dbManager = dbManager;
  }

  /**
   * Initialize client manager
   */
  async initialize(): Promise<void> {
    logger.info('Client manager initialized');
  }

  /**
   * Handle new client connection
   */
  async handleClientConnection(socket: Socket): Promise<void> {
    const client = new Client(socket, this.dbManager);

    // Store client
    this.clients.set(socket.id, client);

    logger.info(`Client registered: ${socket.id}`);

    // Send welcome message
    socket.emit('connected', {
      socketId: socket.id,
      timestamp: Date.now(),
    });

    // Set up client event handlers
    client.on('authenticated', (playerId) => {
      this.clientsByPlayerId.set(playerId, client);
      logger.info(`Client authenticated: ${socket.id} -> ${playerId}`);
    });

    client.on('disconnected', () => {
      this.clientsByPlayerId.delete(client.getPlayerId() || '');
    });
  }

  /**
   * Handle client disconnection
   */
  handleClientDisconnection(socketId: string): void {
    const client = this.clients.get(socketId);
    if (!client) {
      return;
    }

    const playerId = client.getPlayerId();
    if (playerId) {
      this.clientsByPlayerId.delete(playerId);
    }

    this.clients.delete(socketId);
    logger.info(`Client removed: ${socketId}`);
  }

  /**
   * Get client by socket ID
   */
  getClient(socketId: string): Client | undefined {
    return this.clients.get(socketId);
  }

  /**
   * Get client by player ID
   */
  getClientByPlayerId(playerId: string): Client | undefined {
    return this.clientsByPlayerId.get(playerId);
  }

  /**
   * Get all clients
   */
  getAllClients(): Client[] {
    return Array.from(this.clients.values());
  }

  /**
   * Get clients in a specific zone
   */
  getClientsInZone(zoneId: string): Client[] {
    return Array.from(this.clients.values()).filter(
      client => client.getZoneId() === zoneId
    );
  }

  /**
   * Get client count
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Broadcast to all clients
   */
  broadcastToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  /**
   * Broadcast to clients in a zone
   */
  broadcastToZone(zoneId: string, event: string, data: any): void {
    const clients = this.getClientsInZone(zoneId);
    for (const client of clients) {
      client.send(event, data);
    }
  }

  /**
   * Update client manager (called each tick)
   */
  update(delta: number): void {
    // Update all clients
    for (const client of this.clients.values()) {
      client.update(delta);
    }
  }

  /**
   * Shutdown client manager
   */
  async shutdown(): Promise<void> {
    logger.info('Disconnecting all clients...');

    for (const client of this.clients.values()) {
      client.disconnect();
    }

    this.clients.clear();
    this.clientsByPlayerId.clear();

    logger.info('All clients disconnected');
  }
}
