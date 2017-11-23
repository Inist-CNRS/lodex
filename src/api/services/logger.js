import path from 'path';
import winston from 'winston';
import { logs } from 'config';

export default function logger(filename) {
    const transports = [
        new winston.transports.File({
            filename: path.join(__dirname, `/../../../logs/${filename}`),
        }),
    ];

    if (logs) {
        transports.push(
            new winston.transports.Console({
                name: 'info',
                level: 'info',
                timestamp: true,
            }),
        );
    }

    return new winston.Logger({
        transports,
    });
}

export const httpLogger = logger('http.log');
