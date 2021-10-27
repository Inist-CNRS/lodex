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

    // const input = new PassThrough({ objectMode: true });

    // const result = input
    //     .pipe(
    //         ezs(
    //             'delegate',
    //             { commands: ezs.parseString(enrichment.rule, {}) },
    //             {},
    //         ),
    //     )
    //     .pipe(ezs.toString());

    // input.write('dssdds');
    // input.end();

    await ctx.dataset.updateOne(
        { _id: new ObjectId(entry._id) },
        { $set: { [enrichment.name]: 'temporary' } },
    );

    const nextEntry = await getEnrichmentDatasetCandidate(id, ctx);
    nextEntry && getEnrichmentWorker(id, ctx).push(nextEntry);
};

export const getEnrichmentWorker = (id, ctx) => workerRegistry.get(id, ctx);
