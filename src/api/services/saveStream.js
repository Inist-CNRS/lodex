import through from 'through';

import safePipe from './safePipe';
import progress from './progress';
import { CancelWorkerError } from '../workers';

const defaultChunkSize = 100;

export const chunkStream = chunkSize => {
    let acc = [];
    return through(
        function write(d) {
            acc.push(d);
            if (acc.length >= chunkSize) {
                this.queue(acc);
                acc = [];
            }
        },
        function end() {
            if (acc.length) {
                this.queue(acc);
            }
        },
    );
};

export default async (stream, ctx) => {
    const datasetSize = await ctx.dataset.count();
    const method = datasetSize === 0 ? 'insertBatch' : 'bulkUpsertByUri';
    return new Promise((resolve, reject) => {
        safePipe(stream, [
            chunkStream(defaultChunkSize),
            through(async function(chunk) {
                const isActive = await ctx.job?.isActive();
                if (!isActive) {
                    this.emit(
                        'error',
                        new CancelWorkerError('Job has been canceled'),
                    );
                }
                ctx.dataset[method](chunk)
                    .then(data => {
                        this.emit('data', data);
                        progress.incrementProgress(defaultChunkSize);
                    })
                    .catch(error => {
                        this.emit('error', error);
                    });
            }),
        ])
            .on('error', reject)
            .on('end', resolve);

        stream.on('data', data => {
            if (data instanceof Error) {
                reject(data.sourceError || data);
            }
        });
        stream.on('end', () => {
            // TODO: This is a temporary fix
            // The stream is not always finished when the end event is fired. The error event is emitted after the end event.
            // This need to be removed when we have a better way to know handle concurrency in the saveStream
            setTimeout(() => {
                resolve();
            }, 10);
        });
    });
};
