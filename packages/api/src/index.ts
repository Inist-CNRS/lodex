import { getCleanHost } from '@lodex/common';
import app from './app';
import { Server } from 'socket.io';
import config from 'config';
import progress from './services/progress';
import { addPublisherListener } from './workers/publisher';
import { addEnrichmentJobListener } from './services/enrichment/enrichment';
import { addPrecomputedJobListener } from './services/precomputed/precomputed';
import { addImportListener } from './workers/import';
import getLogger from './services/logger';

if (!module.parent) {
    const mongo = config.get('mongo');

    const httpServer = app.listen(config.get('port'), () => {
        const logger = getLogger();
        logger.info(
            `Server listening on port ${config.get('port')}, Go to ${getCleanHost()}/instances/ to get started...`,
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
            // @ts-expect-error TS(18046): mongo is of type unknown
            socket.emit(`${mongo.dbName}_${payload.room}`, payload.data);
        };

        progress.addProgressListener(emitPayload);
        addPublisherListener(emitPayload);
        addEnrichmentJobListener(emitPayload);
        addPrecomputedJobListener(emitPayload);
        addImportListener(emitPayload);
    });
}
