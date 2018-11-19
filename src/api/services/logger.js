import winston from 'winston';
import config from 'config';

export default new winston.Logger({
    transports: config.logger.disabled
        ? []
        : [new winston.transports.Console({ timestamp: true })],
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});
