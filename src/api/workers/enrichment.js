import fastq from 'fastq';
import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import ezs from '@ezs/core';
import logger from '../services/logger';

export const getEnrichmentDatasetCandidate = async (id, ctx) => {
    const enrichment = await ctx.enrichment.findOneById(id);
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichment._id) },
        { $set: { ['status']: 'pending' } },
    );
    const [entry] = await ctx.dataset
        .find({ [enrichment.name]: { $exists: false } })
        .limit(1)
        .toArray();

    return entry;
};

const workerRegistry = (() => {
    const map = {};
    const get = async (id, ctx) => {
        if (!map[id]) map[id] = fastq.promise(await worker(id, ctx), 1);
        return map[id];
    };

    return { get };
})();

const createEzsRuleCommands = rule => ezs.compileScript(rule).get();

const createEnrichmentTransformerFactory = ctx => async id => {
    const enrichment = await ctx.enrichment.findOneById(id);

    return ({ id, value }) =>
        new Promise((resolve, reject) => {
            const input = new PassThrough({ objectMode: true });
            const commands = createEzsRuleCommands(enrichment.rule);
            const result = input.pipe(ezs('delegate', { commands }, {}));

            result.on('data', ({ value }) => {
                logger.info(`valueWebService : ${value}`);
                return resolve({ value, enrichment });
            });
            result.on('error', error => reject({ error, enrichment }));

            input.write({ id, value });
            input.end();
        });
};

const worker = async (id, ctx) => {
    const transformerFactory = createEnrichmentTransformerFactory(ctx);

    return async entry => {
        const enricherTransformer = await transformerFactory(id);
        const enrichment = await ctx.enrichment.findOneById(id);
        await ctx.dataset.updateOne(
            { _id: new ObjectId(entry._id) },
            { $set: { [enrichment.name]: 'En attente' } },
        );

        try {
            let { value } = await enricherTransformer({
                id: entry._id,
                value: entry,
            });

            if (value === undefined) {
                value = 'n/a';
            }

            await ctx.dataset.updateOne(
                { _id: new ObjectId(entry._id) },
                { $set: { [enrichment.name]: value } },
            );
        } catch (e) {
            await ctx.dataset.updateOne(
                { _id: new ObjectId(entry._id) },
                { $set: { [enrichment.name]: `ERROR: ${e.error.message}` } },
            );

            logger.error('Enrichment error', {
                enrichment,
                error: e.error,
            });
        }

        const nextEntry = await getEnrichmentDatasetCandidate(id, ctx);
        nextEntry && (await getEnrichmentWorker(id, ctx)).push(nextEntry);
    };
};

export const getEnrichmentWorker = (id, ctx) => workerRegistry.get(id, ctx);
