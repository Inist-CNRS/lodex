import config from 'config';
process.env.DEBUG = config.get('ezs.verbose');
import debug from 'debug';
debug.enable(String(process.env.DEBUG));

import app from './app';
import { Server } from 'socket.io';
import progress from './services/progress';
import {
    addPublisherListener,
    removePublisherListener,
} from './workers/publisher';
import {
    addEnrichmentJobListener,
    removeEnrichmentJobListener,
} from './services/enrichment/enrichment';
import {
    addPrecomputedJobListener,
    removePrecomputedJobListener,
} from './services/precomputed/precomputed';
import { addImportListener, removeImportListener } from './workers/import';
import getLogger from './services/logger';
import {
    mongoDatabasePrefix,
    mongoConnectionString,
} from './services/mongoClient';

function logAsciiBox(lines: string[]): string {
    const contentWidth: number = 120;
    const border: string = '═'.repeat(contentWidth + 4);
    const emptyContent: string = ' '.repeat(contentWidth);
    const emptyLine: string = `║  ${emptyContent}  ║`;

    const contentLines: string[] = lines.map((line: string) =>
        line === '' ? emptyLine : `║  ${line.padEnd(contentWidth)}  ║`,
    );

    return [
        '\n',
        `╔${border}╗`,
        emptyLine,
        ...contentLines,
        emptyLine,
        `╚${border}╝`,
        '\n',
    ].join('\n');
}

if (!module.parent) {
    const port = Number(config.get('port'));
    const baseURL = config.has('baseURL')
        ? config.get('baseURL')
        : `http://localhost:${port}`;
    const httpServer = app.listen(port, () => {
        const logger = getLogger();
        logger.info(
            logAsciiBox([
                ` ★ LODEX is running in ${String(process.env.NODE_ENV || 'development').toUpperCase()} mode ★`,
                '',
                ` It will connect to the following middlewares:`,
                `   - MongoDB on ⊳ ${mongoConnectionString()} ⊲`,
                `   - Redis on ⊳ ${config.get('redis.url')} ⊲`,
                `   - EZS Server on ⊳ ${config.get('ezs.url')} ⊲`,
                '',
                `To start managing your instances,`,
                `   go to ${baseURL}/instances/`,
            ]),
        );
        // only available only for cluster mode (IPC channel)
        if (process.send) {
            // Here we send the ready signal to PM2
            process.send('ready');
        }
    });
    const io = new Server(httpServer);

    io.on('connection', (socket: any) => {
        const emitPayload = (payload: any) => {
            socket.emit(
                `${mongoDatabasePrefix()}_${payload.room}`,
                payload.data,
            );
        };
        progress.addProgressListener(emitPayload);
        addPublisherListener(emitPayload);
        addEnrichmentJobListener(emitPayload);
        addPrecomputedJobListener(emitPayload);
        addImportListener(emitPayload);

        // without this, every closed socket keeps receiving the notifications
        socket.on('disconnect', () => {
            progress.removeProgressListener(emitPayload);
            removePublisherListener(emitPayload);
            removeEnrichmentJobListener(emitPayload);
            removePrecomputedJobListener(emitPayload);
            removeImportListener(emitPayload);
        });
    });

    const toMB = (bytes: number) => Math.round(bytes / 1024 / 1024);
    setInterval(() => {
        const { rss, heapUsed, heapTotal, external } = process.memoryUsage();
        getLogger().info(
            `[memory] rss=${toMB(rss)}MB heapUsed=${toMB(heapUsed)}MB heapTotal=${toMB(heapTotal)}MB external=${toMB(external)}MB sockets=${io.engine.clientsCount}`,
        );
    }, 60_000).unref();
}
