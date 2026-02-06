import winston, { createLogger, format } from 'winston';
import path from 'path';
import config from 'config';
import { MESSAGE } from 'triple-beam';

// Configuration du format Apache Combined (Strict)
const apacheCombined = format.printf(({ metadata }) => {
    const {
        ip,
        user,
        date,
        method,
        url,
        httpVersion,
        status,
        size,
        referer,
        ua,
    } = metadata;

    // https://httpd.apache.org/docs/2.4/logs.html#combined
    // Exemple :
    // 127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    return `${ip} - ${user} [${date}] "${method} ${url} HTTP/${httpVersion}" ${status} ${size} "${referer}" "${ua}"`;
});

const loggers = new Map();

/**
 * @param tenant
 * @returns {winston.Logger}
 */
const getLogger = (tenant = '_lodex_') => {
    if (loggers.has(tenant)) {
        return loggers.get(tenant);
    }

    const logger = createLogger({
        level: config.get('logger.level'),
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
            }),
        ],
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

const httpLogger = winston.createLogger({
    format: format.combine(format.metadata(), apacheCombined),
});

if (config.get('logger.accessLogFile')) {
    httpLogger.add(new winston.transports.File({
        filename: path.join(config.get('logger.logpath'), 'access.log'),
        level: 'info',
    }));
} else {
    httpLogger.add(new winston.transports.Console());
}


export const getHttpLogger = () => httpLogger;

export default getLogger;
