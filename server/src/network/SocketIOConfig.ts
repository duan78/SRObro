// ============================================
// SRObro - Socket.IO Configuration with Redis Adapter
// Based on 2025 best practices for horizontal scaling
// ============================================

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Redis from 'ioredis';
import { createAdapter } from 'socket.io-redis';
import { env } from '../env';

/**
 * Socket.IO Configuration with Redis Adapter for Horizontal Scaling
 *
 * Architecture:
 * - Redis Pub/Sub for cross-server communication
 * - Sticky sessions via Nginx ip_hash
 * - CORS enabled for development
 * - Optimized ping timeouts/interval for MMORPG
 */
export function createSocketIOServer(httpServer: HTTPServer): SocketIOServer {
  // Create Redis clients for adapter
  // Note: We create separate clients for pub and sub for better performance
  const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  const redisSubClient = redisClient.duplicate();

  // Create Socket.IO server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.SOCKET_IO_CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: parseInt(env.SOCKET_IO_PING_TIMEOUT), // 30s (MMORPG needs longer timeout)
    pingInterval: parseInt(env.SOCKET_IO_PING_INTERVAL), // 25s
    maxHttpBufferSize: parseInt(env.SOCKET_IO_MAX_HTTP_BUFFER_SIZE), // 1MB
    transports: ['websocket', 'polling'], // WebSocket preferred, fallback to polling
    allowUpgrades: true, // Allow upgrade from polling to websocket
    // Connection state recovery (Socket.IO 4.6+ feature)
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true,
    },
  });

  // Create Redis adapter for horizontal scaling
  const redisAdapter = createAdapter({
    pubClient: redisClient,
    subClient: redisSubClient,
    key: env.REDIS_ADAPTER_KEY
  });

  // Attach adapter to Socket.IO
  io.adapter(redisAdapter);

  // Error handling for Redis connection
  redisClient.on('error', (err) => {
    console.error('[Socket.IO] Redis client error:', err);
  });

  redisSubClient.on('error', (err) => {
    console.error('[Socket.IO] Redis sub client error:', err);
  });

  redisClient.on('connect', () => {
    console.log('[Socket.IO] Redis adapter connected');
  });

  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      // Token-based authentication will be added later
      // For now, just log the connection
      console.log(`[Socket.IO] Client connecting: ${socket.id}`);

      next();
    } catch (error) {
      console.error('[Socket.IO] Authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`[Socket.IO] Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

/**
 * Broadcast to all servers in the cluster
 * Uses Redis adapter for cross-server communication
 */
export function broadcastToAllServers(
  io: SocketIOServer,
  event: string,
  data: unknown
): void {
  io.emit(event, data);
}

/**
 * Broadcast to players in a specific zone
 * Uses Redis adapter for cross-server zone broadcasts
 */
export function broadcastToZone(
  io: SocketIOServer,
  zoneId: string,
  event: string,
  data: unknown
): void {
  io.to(`zone:${zoneId}`).emit(event, data);
}

/**
 * Send to specific player
 * Uses Redis adapter for cross-server player messaging
 */
export function sendToPlayer(
  io: SocketIOServer,
  playerId: string,
  event: string,
  data: unknown
): void {
  io.to(`player:${playerId}`).emit(event, data);
}

/**
 * Get number of connected players across all servers
 * Uses Redis adapter for global count
 */
export async function getConnectedPlayerCount(io: SocketIOServer): Promise<number> {
  const sockets = await io.fetchSockets();
  return sockets.length;
}
