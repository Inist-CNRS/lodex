import winston, { createLogger, format } from 'winston';
import config from 'config';
import { MESSAGE } from 'triple-beam';

const loggers = new Map();

/**
 * @param tenant
 * @returns {winston.Logger}
 */
const getLogger = (tenant: any) => {
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
                (info: any) =>
                    ` [${tenant}] ${info.timestamp} ${info[MESSAGE]}`,
            ),
        ),
        silent: config.get('logger.disabled'),
    });

    loggers.set(tenant, logger);
    return logger;
};

export default getLogger;
