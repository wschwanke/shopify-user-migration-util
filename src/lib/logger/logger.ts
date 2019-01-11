import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
});

export { logger };
