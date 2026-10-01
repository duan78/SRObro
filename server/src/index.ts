/**
 * SRObro - Server Entry Point
 * NodeJS/TypeScript Game Server
 */

import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { GameServer } from './core/GameServer';
import { DatabaseManager } from './database/DatabaseManager';
import { createLogger } from './core/Logger';
import prisma from './database/prisma';

// Load environment variables
dotenv.config();

// Create logger
const logger = createLogger('Server');

// Node >= 15: une promesse rejetée non gérée crash le process par défaut.
// On log et on continue — le serveur de jeu doit survivre à un incident
// ponctuel (timeout DB, asset manquant...).
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception (process kept alive):', error);
});

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new IOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  pingTimeout: 10000,
  pingInterval: 5000,
});

// Server configuration
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DATABASE_URL || 'postgresql://srobro:srobro_password@localhost:5432/srobro';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Main server function
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting SRObro server...');

    // Initialize database
    const dbManager = new DatabaseManager(DB_URL, REDIS_URL);
    await dbManager.initialize();
    logger.info('Database initialized');

    // Initialize game server
    const gameServer = new GameServer(io, dbManager);
    await gameServer.initialize();
    logger.info('Game server initialized');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('Server ready to accept connections');
    });

    // Graceful shutdown
    setupGracefulShutdown(gameServer, dbManager, httpServer);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown(
  gameServer: GameServer,
  dbManager: DatabaseManager,
  server: ReturnType<typeof createServer>
): void {
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down gracefully...`);

    try {
      // Stop game server
      await gameServer.shutdown();
      logger.info('Game server stopped');

      // Close database connections
      await dbManager.disconnect();
      // Ferme aussi le pool du singleton Prisma (sinon fuite de connexions)
      await prisma.$disconnect();
      logger.info('Database connections closed');

      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);

    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the server
main();
