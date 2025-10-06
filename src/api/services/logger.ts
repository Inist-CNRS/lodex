import winston, { createLogger, format } from 'winston';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
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
        silent: config.logger.disabled,
    });

    loggers.set(tenant, logger);
    return logger;
};

export default getLogger;
