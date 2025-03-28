import ezs from '@ezs/core';
import progress from './progress';

const insert = async (data, feed, self) => {
    const method = self.getParam('method');
    const ctx = self.getEnv();
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

export const countValidObjectProperty = (item) => {
    const validKeys = Object.keys(item).filter((key) => {
        if (
            item[key] === undefined ||
            item[key] === null ||
            item[key] === ''
        ) {
            return false;
        }
        return true;
    });
    return validKeys.length;
};

const addPropertyCount = (data, feed, self) => {
    if (self.isLast()) {
        return feed.close();
    }
    return feed.send({
        ...data,
        lodexPropertyCount: countValidObjectProperty(data),
    });
};

export default async (stream, ctx) => {
    const datasetSize = await ctx.dataset.count();
    const method = datasetSize === 0 ? 'insertBatch' : 'bulkUpsertByUri';
    return new Promise((resolve, reject) => {
        let insertedTotal = 0;
        stream
            .pipe(ezs(addPropertyCount))
            .pipe(ezs('group', { length: 100 }))
            .pipe(ezs(insert, { method }, ctx))
            .pipe(ezs.catch())
            .on('error', (e) => {
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
