// ============================================
// SRObro Server Environment Configuration
// Validates and provides typed access to environment variables
// ============================================

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validates that a required environment variable is set
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 */
function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Gets a numeric environment variable or throws
 */
function requireNumberEnv(key: string): number {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number, got: ${value}`);
  }
  return num;
}

/**
 * Gets a numeric environment variable with a default value
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    console.warn(`Environment variable ${key} is not a number, using default: ${defaultValue}`);
    return defaultValue;
  }
  return num;
}

/**
 * Gets a boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Server environment configuration
 */
export const env = {
  // Environment
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV', 'development') === 'production',

  // Server
  PORT: requireNumberEnv('PORT'),
  HOST: getEnv('HOST', '0.0.0.0'),

  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // Redis
  REDIS_URL: requireEnv('REDIS_URL'),
  REDIS_HOST: getEnv('REDIS_HOST', 'localhost'),
  REDIS_PORT: getEnv('REDIS_PORT', '6379'),
  REDIS_PASSWORD: getEnv('REDIS_PASSWORD', ''),

  // Client URL
  CLIENT_URL: requireEnv('CLIENT_URL'),

  // Authentication
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRATION: getEnv('JWT_EXPIRATION', '7d'),
  SESSION_SECRET: requireEnv('SESSION_SECRET'),
  SESSION_MAX_AGE: requireNumberEnv('SESSION_MAX_AGE'),

  // Logging
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
  LOG_FORMAT: getEnv('LOG_FORMAT', 'json'),

  // Game Settings
  TICK_RATE: getNumberEnv('TICK_RATE', 20),
  MAX_PLAYERS: getNumberEnv('MAX_PLAYERS', 100),
  MAX_PLAYERS_PER_SERVER: getNumberEnv('MAX_PLAYERS_PER_SERVER', 100),
  AOI_RADIUS: getNumberEnv('AOI_RADIUS', 100),

  // Socket.IO Configuration
  SOCKET_IO_CORS_ORIGIN: requireEnv('SOCKET_IO_CORS_ORIGIN'),
  SOCKET_IO_PING_TIMEOUT: getEnv('SOCKET_IO_PING_TIMEOUT', '30000'),
  SOCKET_IO_PING_INTERVAL: getEnv('SOCKET_IO_PING_INTERVAL', '25000'),
  SOCKET_IO_MAX_HTTP_BUFFER_SIZE: getEnv('SOCKET_IO_MAX_HTTP_BUFFER_SIZE', '1e6'),

  // Redis Adapter Configuration
  REDIS_ADAPTER_KEY: getEnv('REDIS_ADAPTER_KEY', 'srobro'),
  REDIS_ADAPTER_PUBLISH_ON_CLIENT_ERROR: getBooleanEnv('REDIS_ADAPTER_PUBLISH_ON_CLIENT_ERROR', true),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: getNumberEnv('RATE_LIMIT_WINDOW_MS', 60000),
  RATE_LIMIT_MAX_REQUESTS: getNumberEnv('RATE_LIMIT_MAX_REQUESTS', 100),
  AUTH_RATE_LIMIT_MAX: getNumberEnv('AUTH_RATE_LIMIT_MAX', 5),

  // Security
  BCRYPT_ROUNDS: getNumberEnv('BCRYPT_ROUNDS', 10),

  // Monitoring
  ENABLE_PROMETHEUS: getBooleanEnv('ENABLE_PROMETHEUS', false),
  PROMETHEUS_PORT: getNumberEnv('PROMETHEUS_PORT', 9090),
} as const;

/**
 * Validate critical environment variables on startup
 */
export function validateEnv(): void {
  const criticalVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
    'CLIENT_URL',
  ];

  const missing: string[] = [];

  for (const varName of criticalVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
  }

  // Warn in production if secrets are default
  if (env.isProduction) {
    if (env.JWT_SECRET === 'change-this-to-a-secure-random-string') {
      throw new Error('JWT_SECRET must be changed in production');
    }
    if (env.SESSION_SECRET === 'change-this-to-another-secure-random-string') {
      throw new Error('SESSION_SECRET must be changed in production');
    }
  }
}
