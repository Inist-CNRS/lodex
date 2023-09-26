import winston, { createLogger, format } from 'winston';
import config from 'config';
import { MESSAGE } from 'triple-beam';

const loggers = new Map();

const getLogger = tenant => {
    if (loggers.has(tenant)) {
        return loggers.get(tenant);
    }

    const logger = createLogger({
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        transports: [new winston.transports.Console()],
        format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.simple(),
            format.printf(
                info => ` [${tenant}] ${info.timestamp} ${info[MESSAGE]}`,
            ),
        ),
        silent: config.logger.disabled,
    });

    loggers.set(tenant, logger);
    return logger;
};

export default getLogger;
