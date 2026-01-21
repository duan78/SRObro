/**
 * SRObro - Database Manager
 * Handles PostgreSQL and Redis connections
 */

import { Pool, PoolClient } from 'pg';
import Redis from 'ioredis';
import { createLogger } from '../core/Logger';

const logger = createLogger('DatabaseManager');

export class DatabaseManager {
  private postgresUrl: string;
  private redisUrl: string;
  private pool: Pool | null = null;
  private redis: Redis | null = null;
  private isConnected = false;

  constructor(postgresUrl: string, redisUrl: string) {
    this.postgresUrl = postgresUrl;
    this.redisUrl = redisUrl;
  }

  /**
   * Initialize database connections
   */
  async initialize(): Promise<void> {
    try {
      // Connect to PostgreSQL
      await this.connectPostgreSQL();

      // Connect to Redis
      await this.connectRedis();

      this.isConnected = true;
      logger.info('Database connections established');

    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Connect to PostgreSQL
   */
  private async connectPostgreSQL(): Promise<void> {
    this.pool = new Pool({
      connectionString: this.postgresUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await this.pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    logger.info(`PostgreSQL connected: ${result.rows[0].now}`);
  }

  /**
   * Connect to Redis
   */
  private async connectRedis(): Promise<void> {
    // Parse Redis URL to extract host, port, and password
    // Format: redis://[:password@]host:port
    let password = process.env.REDIS_PASSWORD;

    // Extract password from URL if not in env
    if (!password && this.redisUrl.includes('@')) {
      const match = this.redisUrl.match(/redis:\/\/:(.+)@/);
      password = match ? match[1] : undefined;
    }

    // Extract host and port
    const urlMatch = this.redisUrl.match(/@([^:]+):(\d+)/);
    const host = urlMatch ? urlMatch[1] : 'localhost';
    const port = urlMatch ? parseInt(urlMatch[2]) : 6379;

    this.redis = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });

    // Test connection
    await this.redis.ping();
    logger.info('Redis connected');
  }

  /**
   * Get PostgreSQL client from pool
   */
  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not initialized');
    }
    return this.pool.connect();
  }

  /**
   * Execute PostgreSQL query
   */
  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not initialized');
    }
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug(`Executed query (${duration}ms): ${text}`);
      return result;
    } catch (error) {
      logger.error('Query error:', error);
      throw error;
    }
  }

  /**
   * Get Redis client
   */
  getRedis(): Redis {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }
    return this.redis;
  }

  /**
   * Set value in Redis
   */
  async redisSet(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * Get value from Redis
   */
  async redisGet(key: string): Promise<string | null> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }
    return this.redis.get(key);
  }

  /**
   * Delete value from Redis
   */
  async redisDel(key: string): Promise<void> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }
    await this.redis.del(key);
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect all database connections
   */
  async disconnect(): Promise<void> {
    logger.info('Disconnecting databases...');

    // Close PostgreSQL pool
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('PostgreSQL disconnected');
    }

    // Close Redis connection
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      logger.info('Redis disconnected');
    }

    this.isConnected = false;
  }
}
