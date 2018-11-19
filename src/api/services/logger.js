import winston, { createLogger, format } from 'winston';
import config from 'config';
import { MESSAGE } from 'triple-beam';

export default createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
        format.printf(info => `${info.timestamp} ${info[MESSAGE]}`),
    ),
    silent: config.logger.disabled,
});
