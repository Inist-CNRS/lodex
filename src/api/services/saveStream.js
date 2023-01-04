import ezs from '@ezs/core';
import progress from './progress';
import { CancelWorkerError } from '../workers';

async function insert(data, feed) {
    const method = this.getParam('method');
    const ctx = this.getEnv();
    if (this.isLast()) {
        return feed.close();
    }
    const isActive = await ctx.job?.isActive();
    if (!isActive) {
        return feed.stop(new CancelWorkerError('Job has been canceled'));
    }
    try {
        const result = await ctx.dataset[method](data);
        progress.incrementProgress(data.length);
        return feed.send(result);
    } catch (error) {
        return feed.stop(error);
    }
}

export default async (stream, ctx) => {
    const datasetSize = await ctx.dataset.count();
    const method = datasetSize === 0 ? 'insertBatch' : 'bulkUpsertByUri';
    return new Promise((resolve, reject) => {
        let insertedTotal = 0;
        stream
            .pipe(ezs('group', { length: 100 }))
            .pipe(ezs(insert, { method }, ctx))
            .pipe(ezs.catch())
            .on('error', e => {
                reject(e.sourceError || e);
            })
            .on('data', ({ insertedCount }) => {
                insertedTotal += insertedCount;
            })
            .on('end', () => {
                resolve(insertedTotal);
            });
    });
};
