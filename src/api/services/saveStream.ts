// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import progress from './progress';

async function insert(this: any, data: any, feed: any) {
    const method = this.getParam('method');
    const ctx = this.getEnv();
    if (!this.nb) {
        this.nb = 0;
    }
    if (this.isLast()) {
        return feed.close();
    }
    try {
        this.nb += data.length;
        const result = await ctx.dataset[method](data);
        progress.incrementProgress(ctx.tenant, data.length);
        return feed.send(result);
    } catch (error) {
        return feed.send(error);
    }
}

export default async (stream: any, ctx: any) => {
    const datasetSize = await ctx.dataset.count();
    const method = datasetSize === 0 ? 'insertBatch' : 'bulkUpsertByUri';
    return new Promise((resolve: any, reject: any) => {
        let insertedTotal = 0;
        stream
            .pipe(ezs('group', { length: 100 }))
            .pipe(ezs(insert, { method }, ctx))
            .pipe(ezs.catch())
            .on('error', (e: any) => {
                console.error('Error in the import stream pipeline', e);
                reject(e.sourceError || e);
            })
            .on('data', ({ insertedCount = 0 }) => {
                insertedTotal += insertedCount;
            })
            .on('end', () => {
                resolve(insertedTotal);
            });
    });
};
