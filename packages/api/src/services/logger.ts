import winston, { createLogger, format } from 'winston';
import path from 'path';
import config from 'config';
import { LEVEL } from 'triple-beam';

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
// Configuration du format Minimal (Development)
const apacheMinimal = format.printf(({ metadata }) => {
    const { method, url, status } = metadata;

    return `${method} ${url} ${status}`;
});

// ASCII only: ezmaster shows logs without colors and breaks non-ASCII characters
export const ERROR_SEPARATOR = '='.repeat(100);

const indent = (text: string) => text.replace(/^/gm, '    ');

const upperCaseLevel = format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

// Readable without colors (ezmaster strips them):
// `[tenant] timestamp LEVEL message`, levels aligned,
// meta as `key: value` lines and stack indented below,
// error entries framed by separators.
export const lineFormat = (tenant: string) =>
    format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        upperCaseLevel(),
        format.colorize(),
        format.printf((info) => {
            const { timestamp, level, message, stack, ...meta } = info;
            // pad on the raw level: the colored one contains escape codes
            const rawLevel = String(info[LEVEL]);
            const padding = ' '.repeat(Math.max(0, 5 - rawLevel.length));
            const keyWidth =
                Math.max(...Object.keys(meta).map((key) => key.length)) + 2;
            const details = Object.entries(meta).map(
                ([key, value]) =>
                    `${`${key}:`.padEnd(keyWidth)}${typeof value === 'string' ? value : JSON.stringify(value)}`,
            );
            if (stack) {
                details.push(`stack:\n${indent(String(stack))}`);
            }
            // indent the message continuation lines too: an unindented
            // line would look like another entry (messages may come from browsers)
            const text = String(message).replace(
                /\r\n|[\r\n\u2028\u2029]/g,
                '\n    ',
            );
            const entry = [
                `[${tenant}] ${timestamp}  ${level}${padding}  ${text}`,
                ...details.map(indent),
            ].join('\n');

            return rawLevel === 'error'
                ? `\n${ERROR_SEPARATOR}\n${entry}\n${ERROR_SEPARATOR}\n`
                : entry;
        }),
    );

// Job messages are often JSON strings built for the admin UI:
// keep only their text and level, the tenant is already in the log line prefix
export const parseJobMessage = (
    message: any,
): { level?: string; text: any } => {
    let level;
    let text = message;
    try {
        const parsed = JSON.parse(message);
        if (typeof parsed?.message === 'string') {
            text = parsed.message;
            level = parsed.level;
        }
    } catch {
        // not JSON: log it as is
    }
    return {
        level,
        text:
            typeof text === 'string'
                ? text.replace(/^\[Instance: [^\]]*\] /, '')
                : text,
    };
};

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
        transports: [new winston.transports.Console()],
        format: lineFormat(tenant),
        silent: config.get('logger.disabled'),
    });

    loggers.set(tenant, logger);
    return logger;
};

const httpFormat = config.get('logger.apacheCombined')
    ? format.combine(format.metadata(), apacheCombined)
    : format.combine(format.metadata(), apacheMinimal);

const httpLogger = winston.createLogger({
    format: httpFormat,
});

if (config.get('logger.accessLogFile')) {
    httpLogger.add(
        new winston.transports.File({
            filename: path.join(config.get('logger.logpath'), 'access.log'),
            level: 'info',
        }),
    );
} else {
    httpLogger.add(new winston.transports.Console());
}

export const getHttpLogger = () => httpLogger;

export default getLogger;
