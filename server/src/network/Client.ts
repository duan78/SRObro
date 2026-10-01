/**
 * SRObro - Client
 * Represents a connected client
 */

import type { Socket } from 'socket.io';
import type { DatabaseManager } from '../database/DatabaseManager';
import type { Character, Position } from '@srobro/shared';
import { createLogger } from '../core/Logger';

const logger = createLogger('Client');

export type ClientEventCallback = (data: any) => void;

export class Client {
  private socket: Socket;
  private dbManager: DatabaseManager;
  private playerId: string | null = null;
  private characterId: string | null = null;
  private characterData: Character | null = null;
  private zoneId: string | null = null;
  private isAuthenticated = false;
  // Authentification au niveau COMPTE (login/mot de passe OK) — distincte
  // du chargement d'un personnage (isAuthenticated).
  private accountAuthenticated = false;

  // Position
  private position: Position = { x: 0, y: 0, z: 0 };
  private rotation = 0;

  // Event handlers
  private eventHandlers: Map<string, ClientEventCallback[]> = new Map();

  // Last update time
  private lastUpdateTime = Date.now();

  constructor(socket: Socket, dbManager: DatabaseManager) {
    this.socket = socket;
    this.dbManager = dbManager;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string {
    return this.socket.id;
  }

  /**
   * Get player ID
   */
  getPlayerId(): string | null {
    return this.playerId;
  }

  /**
   * Get account ID (alias de playerId: l'ID de compte authentifié)
   */
  getAccountId(): string | null {
    return this.accountAuthenticated ? this.playerId : null;
  }

  /**
   * Authentifie le socket au niveau compte (après login/mot de passe).
   */
  authenticateAccount(accountId: string): void {
    this.playerId = accountId;
    this.accountAuthenticated = true;
  }

  /**
   * Réinitialise toute l'authentification (logout / kick): le socket peut
   * se re-loguer mais n'agit plus sur aucun compte ni personnage.
   */
  clearAuthentication(): void {
    this.playerId = null;
    this.characterId = null;
    this.characterData = null;
    this.isAuthenticated = false;
    this.accountAuthenticated = false;
    this.emit('sessionCleared', null);
  }

  /**
   * Set player ID
   */
  setPlayerId(playerId: string): void {
    this.playerId = playerId;
  }

  /**
   * Get character ID
   */
  getCharacterId(): string | null {
    return this.characterId;
  }

  /**
   * Get character data
   */
  getCharacterData(): Character | null {
    return this.characterData;
  }

  /**
   * Load character
   */
  async loadCharacter(characterId: string): Promise<void> {
    try {
      // Load character from database
      const result = await this.dbManager.query(
        'SELECT * FROM "Character" WHERE id = $1',
        [characterId]
      );

      if (result.rows.length === 0) {
        throw new Error('Character not found');
      }

      this.characterData = result.rows[0];
      this.characterId = characterId;
      this.playerId = this.characterData.accountId;
      this.zoneId =
        (this.characterData as { zoneId?: string }).zoneId ?? 'zone_jangan';
      this.position = this.characterData.position || { x: 0, y: 0, z: 0 };
      this.isAuthenticated = true;

      this.emit('authenticated', this.playerId);

      logger.info(`Character loaded: ${characterId} for player: ${this.playerId}`);

    } catch (error) {
      logger.error('Failed to load character:', error);
      throw error;
    }
  }

  /**
   * Get zone ID
   */
  getZoneId(): string | null {
    return this.zoneId;
  }

  /**
   * Set zone ID
   */
  setZoneId(zoneId: string): void {
    this.zoneId = zoneId;
  }

  /**
   * Get position
   */
  getPosition(): Position {
    return this.position;
  }

  /**
   * Set position
   */
  setPosition(position: Position): void {
    this.position = position;
  }

  /**
   * Get rotation
   */
  getRotation(): number {
    return this.rotation;
  }

  /**
   * Set rotation
   */
  setRotation(rotation: number): void {
    this.rotation = rotation;
  }

  /**
   * Check if authenticated
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Send packet to client
   */
  send(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  /**
   * Register event handler
   */
  on(event: string, callback: ClientEventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  /**
   * Emit event to handlers
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

  /**
   * Signal network activity (resets the inactivity timeout)
   */
  touch(): void {
    this.lastUpdateTime = Date.now();
  }

  /**
   * Update client (called each tick)
   */
  update(_delta: number): void {
    // Update last activity time
    const now = Date.now();
    if (now - this.lastUpdateTime > 30000) { // 30 seconds timeout
      logger.warn(`Client timeout: ${this.socket.id}`);
      this.disconnect();
    }
  }

  /**
   * Disconnect client
   */
  disconnect(): void {
    this.socket.disconnect();
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.eventHandlers.clear();
  }
}
