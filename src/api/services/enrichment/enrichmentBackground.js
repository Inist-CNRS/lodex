import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import ezs from '@ezs/core';
import progress from '../../services/progress';
import { IN_PROGRESS, FINISHED } from '../../../common/enrichmentStatus';
import { ENRICHING, PENDING } from '../../../common/progressStatus';

export const getEnrichmentDatasetCandidate = async (id, ctx) => {
    const enrichment = await ctx.enrichment.findOneById(id);
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
            return resolve({ value, enrichment });
        });
        result.on('error', error => reject({ error, enrichment }));
        input.write({ id: entry._id, value: entry });
        input.end();
    });
};

const processEnrichmentBackground = async (entry, enrichment, ctx) => {
    let nextEntry = entry;

    if (nextEntry) {
        await ctx.enrichment.updateOne(
            { _id: new ObjectId(enrichment._id) },
            { $set: { ['status']: IN_PROGRESS } },
        );
    }

    let lineIndex = 0;
    while (nextEntry) {
        lineIndex += 1;
        const logData = {
            level: 'info',
            message: `Started enriching line #${lineIndex}`,
            timestamp: new Date(),
        };
        ctx.job.log(JSON.stringify(logData));
        try {
            let { value } = await processEzsEnrichment(nextEntry, enrichment);
            const logData = {
                level: 'info',
                message: `Finished enriching line #${lineIndex} (output: ${value})`,
                timestamp: new Date(),
            };
            ctx.job.log(JSON.stringify(logData));

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

            const logData = {
                level: 'error',
                message: `Error enriching line #${lineIndex}`,
                timestamp: new Date(),
            };
            ctx.job.log(JSON.stringify(logData));
        }

        nextEntry = await getEnrichmentDatasetCandidate(enrichment._id, ctx);
        progress.incrementProgress(1);
        if (!nextEntry) {
            await ctx.enrichment.updateOne(
                { _id: new ObjectId(enrichment._id) },
                { $set: { ['status']: FINISHED } },
            );
        }
    }
    progress.finish();
    const logData = {
        level: 'ok',
        message: `Enrichement finished`,
        timestamp: new Date(),
    };
    ctx.job.log(JSON.stringify(logData));
};

const setEnrichmentJobId = async (ctx, enrichment, job) => {
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichment._id) },
        { $set: { ['jobId']: job.id } },
    );
};

export const startEnrichmentBackground = async ctx => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    await setEnrichmentJobId(ctx, enrichment, ctx.job);
    const firstEntry = await getEnrichmentDatasetCandidate(enrichment._id, ctx);
    const dataSetSize = await ctx.dataset.count();
    if (progress.getProgress().status === PENDING) {
        progress.start(
            ENRICHING,
            dataSetSize,
            null,
            'ENRICHING',
            enrichment.name,
            'enrichment',
        );
    }

    const logData = {
        level: 'ok',
        message: `Enrichement started`,
        timestamp: new Date(),
    };
    ctx.job.log(JSON.stringify(logData));
    await processEnrichmentBackground(firstEntry, enrichment, ctx);
};
