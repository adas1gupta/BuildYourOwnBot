import winston from 'winston';
import { config } from '../config';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  config.logging.format === 'json'
    ? winston.format.json()
    : winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaStr = Object.keys(meta).length
          ? `\n${JSON.stringify(meta, null, 2)}`
          : '';
        return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
      })
);

// Create the logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    // Log to console
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    // Add file transport in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ]
      : []),
  ],
});

// Add request logging middleware for Express (if used)
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
};