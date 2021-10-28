import fastq from 'fastq';
import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import ezs from '@ezs/core';

export const getEnrichmentDatasetCandidate = async (id, ctx) => {
    const enrichment = await ctx.enrichment.findOneById(id);
    const [entry] = await ctx.dataset
        .find({ [enrichment.name]: { $exists: false } })
        .limit(1)
        .toArray();

    return entry;
};

const workerRegistry = (() => {
    const map = {};
    const get = (id, ctx) => {
        if (!map[id]) map[id] = fastq.promise(worker(id, ctx), 1);
        return map[id];
    };

    return { get };
})();

const worker = (id, ctx) => async entry => {
    console.log('Computing entry...');

    await new Promise(r => setTimeout(r, 1000));

    const enrichment = await ctx.enrichment.findOneById(id);

    await new Promise(resolve => {

        const input = new PassThrough({ objectMode: true });
        const result = input.pipe(ezs('delegate', { script: enrichment.rule }, {}));
        const ezsInput = {
            id: entry._id,
            value: entry,
        };
        input.write(ezsInput);
        result.on('data', async ({id, value}) => {
            await ctx.dataset.updateOne(
                { _id: new ObjectId(id) },
                { $set: { [enrichment.name]: value } },
            );
            resolve();
        });

        result.on('error', async () => {
            await ctx.dataset.updateOne(
                { _id: new ObjectId(entry._id) },
                { $set: { [enrichment.name]: 'ERROR' } },
            );
            resolve();
        });
        
        input.end();
    })

    const nextEntry = await getEnrichmentDatasetCandidate(id, ctx);
    nextEntry && getEnrichmentWorker(id, ctx).push(nextEntry);
};

export const getEnrichmentWorker = (id, ctx) => workerRegistry.get(id, ctx);
