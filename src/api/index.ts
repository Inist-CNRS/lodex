import app from './app';
import { Server } from 'socket.io';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import config, { mongo } from 'config';
import progress from './services/progress';
import { addPublisherListener } from './workers/publisher';
import { addEnrichmentJobListener } from './services/enrichment/enrichment';
import { addPrecomputedJobListener } from './services/precomputed/precomputed';
import { addImportListener } from './workers/import';

if (!module.parent) {
    const httpServer = app.listen(config.port, () => {
        global.console.log(`Server listening on port ${config.port}`);
        // only available only for cluster mode (IPC channel)
        if (process.send) {
            // Here we send the ready signal to PM2
            process.send('ready');
        }
    });
    const io = new Server(httpServer);

    io.on('connection', (socket: any) => {
        const emitPayload = (payload: any) => {
            socket.emit(`${mongo.dbName}_${payload.room}`, payload.data);
        };

        progress.addProgressListener(emitPayload);
        addPublisherListener(emitPayload);
        addEnrichmentJobListener(emitPayload);
        addPrecomputedJobListener(emitPayload);
        addImportListener(emitPayload);
    });
}
