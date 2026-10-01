/**
 * SRObro - Network Manager (Client)
 * Handles WebSocket communication with the server
 */

import { io, Socket } from 'socket.io-client';
import type { C2SPacket, S2CPacket } from '@srobro/shared';

export interface NetworkEvents {
  connected: () => void;
  disconnected: () => void;
  error: (error: Error) => void;
  spawn: (data: any) => void;
  despawn: (data: any) => void;
  update: (data: any) => void;
  damage: (data: any) => void;
  chat: (data: any) => void;
  // Priority 1 events
  minimap_update: (data: any) => void;
  casting_start: (data: any) => void;
  casting_interrupt: (data: any) => void;
  casting_complete: (data: any) => void;
  xp_gain: (data: any) => void;
  sp_gain: (data: any) => void;
  level_up: (data: any) => void;
  drop_item: (data: any) => void;
  remove_dropped_item: (data: any) => void;
  hotkey_bind_response: (data: any) => void;
  pickup_success: (data: any) => void;
  pickup_failed: (data: any) => void;
  pickup_all_response: (data: any) => void;
}

export class NetworkManager {
  private url: string;
  private socket: Socket | null = null;
  private isConnected = false;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;
  // Le mode single-player appelle send() à chaque frame: ne warn qu'une fois
  private sendNotConnectedWarned = false;

  // Event handlers
  private eventHandlers: Map<keyof NetworkEvents, Set<Function>> = new Map();

  // Heartbeat: garde la session vivante côté serveur (timeout d'inactivité
  // 30 s) pendant les chargements longs sans packets de jeu
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to the server
   */
  async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      console.warn('Already connected or connecting');
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        // Create socket connection
        this.socket = io(this.url, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        // Connection successful
        this.socket.on('connect', () => {
          console.log('Connected to server:', this.socket?.id);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.emit('connected');
          resolve();
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          this.isConnecting = false;
          this.reconnectAttempts++;

          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.emit('error', new Error('Failed to connect to server'));
            reject(error);
          }
        });

        // Disconnection
        this.socket.on('disconnect', (reason) => {
          console.log('Disconnected from server:', reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.emit('disconnected');
        });

        // Server packets
        this.setupPacketHandlers();

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Heartbeat toutes les 10 s: empêche le timeout d'inactivité serveur (30 s)
   * pendant les chargements/AFK sans traffic de jeu.
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.emit('heartbeat', { t: Date.now() });
      }
    }, 10000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Set up packet handlers from server
   */
  private setupPacketHandlers(): void {
    if (!this.socket) return;

    // Spawn entity
    this.socket.on('spawn', (data) => {
      this.emit('spawn', data);
    });

    // Despawn entity
    this.socket.on('despawn', (data) => {
      this.emit('despawn', data);
    });

    // Update entity
    this.socket.on('update', (data) => {
      this.emit('update', data);
    });

    // Damage event
    this.socket.on('damage', (data) => {
      this.emit('damage', data);
    });

    // Chat message
    this.socket.on('chat', (data) => {
      this.emit('chat', data);
    });

    // Priority 1: Minimap update
    this.socket.on('minimap_update', (data) => {
      this.emit('minimap_update', data);
    });

    // Priority 1: Casting events
    this.socket.on('casting_start', (data) => {
      this.emit('casting_start', data);
    });

    this.socket.on('casting_interrupt', (data) => {
      this.emit('casting_interrupt', data);
    });

    this.socket.on('casting_complete', (data) => {
      this.emit('casting_complete', data);
    });

    // Priority 1: XP/SP events
    this.socket.on('xp_gain', (data) => {
      this.emit('xp_gain', data);
    });

    this.socket.on('sp_gain', (data) => {
      this.emit('sp_gain', data);
    });

    this.socket.on('level_up', (data) => {
      this.emit('level_up', data);
    });

    // Priority 1: Drop/Pickup events
    this.socket.on('drop_item', (data) => {
      this.emit('drop_item', data);
    });

    this.socket.on('remove_dropped_item', (data) => {
      this.emit('remove_dropped_item', data);
    });

    this.socket.on('pickup_success', (data) => {
      this.emit('pickup_success', data);
    });

    this.socket.on('pickup_failed', (data) => {
      this.emit('pickup_failed', data);
    });

    this.socket.on('pickup_all_response', (data) => {
      this.emit('pickup_all_response', data);
    });

    // Priority 1: Hotkey events
    this.socket.on('hotkey_bind_response', (data) => {
      this.emit('hotkey_bind_response', data);
    });
  }

  /**
   * Send packet to server
   */
  send<T extends C2SPacket>(packet: T): void {
    if (!this.socket || !this.isConnected) {
      if (!this.sendNotConnectedWarned) {
        this.sendNotConnectedWarned = true;
        console.warn('Cannot send packet: not connected (single-player mode? further warnings suppressed)');
      }
      return;
    }

    this.socket.emit(packet.type, packet);
  }

  /**
   * Requête/réponse avec acquittement Socket.io (auth, personnages...).
   * Résout avec la réponse du serveur, ou rejette si non connecté.
   */
  request<T = any>(event: string, data?: any, timeoutMs = 10000): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Not connected'));
        return;
      }
      const timer = setTimeout(() => {
        reject(new Error(`Timeout awaiting response for ${event}`));
      }, timeoutMs);
      this.socket.emit(event, data ?? {}, (response: T) => {
        clearTimeout(timer);
        resolve(response);
      });
    });
  }

  /**
   * Écoute un évènement brut du serveur (échappatoire typée pour les
   * protocoles récents: auth, admin...).
   */
  onRaw(event: string, handler: (data: any) => void): void {
    this.socket?.on(event, handler);
  }

  offRaw(event: string, handler: (data: any) => void): void {
    this.socket?.off(event, handler);
  }

  /**
   * Send movement packet
   */
  sendMove(position: { x: number; y: number; z: number }, rotation: number, isRunning: boolean): void {
    this.send({
      type: 'move',
      timestamp: Date.now(),
      data: { position, rotation, isRunning },
    });
  }

  /**
   * Send attack packet
   */
  sendAttack(targetId: string, skillId?: string): void {
    this.send({
      type: skillId ? 'cast_skill' : 'attack',
      timestamp: Date.now(),
      playerId: undefined,
      data: { targetId, skillId },
    });
  }

  /**
   * Send chat packet
   */
  sendChat(message: string, channel: string = 'general', targetId?: string): void {
    this.send({
      type: 'chat',
      timestamp: Date.now(),
      data: { message, channel, targetId },
    });
  }

  // ============================================
  // PRIORITY 1 FEATURE SEND METHODS
  // ============================================

  /**
   * Send hotkey use packet
   */
  sendHotkeyUse(slotType: string, slotIndex: number): void {
    this.send({
      type: 'hotkey_use',
      timestamp: Date.now(),
      data: { slotType, slotIndex },
    });
  }

  /**
   * Send hotkey bind packet
   */
  sendHotkeyBind(slotType: string, slotIndex: number, itemId?: string, skillId?: string): void {
    this.send({
      type: 'hotkey_bind',
      timestamp: Date.now(),
      data: { slotType, slotIndex, itemId, skillId },
    });
  }

  /**
   * Send pickup item packet
   */
  sendPickupItem(droppedItemId: string): void {
    this.send({
      type: 'pickup_item',
      timestamp: Date.now(),
      data: { droppedItemId },
    });
  }

  /**
   * Send pickup all nearby items packet
   */
  sendPickupAll(): void {
    this.send({
      type: 'pickup_all',
      timestamp: Date.now(),
      data: {},
    });
  }

  /**
   * Send interact packet (for NPCs, etc.)
   */
  sendInteract(targetEntityId: string): void {
    this.send({
      type: 'interact',
      timestamp: Date.now(),
      data: { targetEntityId },
    });
  }

  /**
   * Register event handler
   */
  on<K extends keyof NetworkEvents>(event: K, handler: NetworkEvents[K]): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unregister event handler
   */
  off<K extends keyof NetworkEvents>(event: K, handler: NetworkEvents[K]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit event to all handlers
   */
  private emit<K extends keyof NetworkEvents>(event: K, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Clean up
   */
  dispose(): void {
    this.disconnect();
    this.eventHandlers.clear();
  }
}
