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
        stream.on('end', resolve);
    });
};
