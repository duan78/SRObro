/**
 * SRObro - Logger
 * Winston-based logging utility
 */

import winston from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(logColors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}` +
      (info.splat !== undefined ? `${info.splat}` : ' ') +
      (info.stack !== undefined ? `\n${info.stack}` : '')
  )
);

/**
 * Create a logger instance
 */
export function createLogger(label: string): winston.Logger {
  return winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || 'debug',
    format,
    transports: [
      new winston.transports.Console(),
      // Add file transports in production
      ...(process.env.NODE_ENV === 'production'
        ? [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
            }),
          ]
        : []),
    ],
    defaultMeta: { service: label },
  });
}

export default createLogger;
