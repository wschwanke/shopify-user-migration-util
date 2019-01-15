import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
  ),
  level: 'info',
  transports: [
    new transports.Console(),
  ],
});

logger.exitOnError = true;

export { logger };
