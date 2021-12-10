import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import ezs from '@ezs/core';
import logger from '../../services/logger';

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

const createEzsRuleCommands = rule => ezs.compileScript(rule).get();

const processEzsEnrichment = (entry, enrichment) => {
    return new Promise((resolve, reject) => {
        const input = new PassThrough({ objectMode: true });
        const commands = createEzsRuleCommands(enrichment.rule);
        const result = input.pipe(ezs('delegate', { commands }, {}));

        result.on('data', ({ value }) => {
            logger.info(`valueWebService : ${value}`);
            return resolve({ value, enrichment });
        });
        result.on('error', error => reject({ error, enrichment }));
        input.write({ id: entry._id, value: entry });
        input.end();
    });
};

const processEnrichmentBackground = async (entry, enrichment, ctx) => {
    let nextEntry = entry;
    while (nextEntry) {
        await ctx.dataset.updateOne(
            { _id: new ObjectId(nextEntry._id) },
            { $set: { [enrichment.name]: 'En attente' } },
        );
        try {
            let { value } = await processEzsEnrichment(nextEntry, enrichment);

            if (value === undefined) {
                value = 'n/a';
            }

            await ctx.dataset.updateOne(
                { _id: new ObjectId(nextEntry._id) },
                { $set: { [enrichment.name]: value } },
            );
        } catch (e) {
            await ctx.dataset.updateOne(
                { _id: new ObjectId(nextEntry._id) },
                { $set: { [enrichment.name]: `ERROR: ${e.error.message}` } },
            );

            logger.error('Enrichment error', {
                enrichment,
                error: e.error,
            });
        }

        nextEntry = await getEnrichmentDatasetCandidate(enrichment._id, ctx);
    }
};

export const startEnrichmentBackground = async ctx => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    const firstEntry = await getEnrichmentDatasetCandidate(enrichment._id, ctx);
    await processEnrichmentBackground(firstEntry, enrichment, ctx);
};
