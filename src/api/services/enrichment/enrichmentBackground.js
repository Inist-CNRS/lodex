import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import ezs from '@ezs/core';
import progress from '../../services/progress';
import { IN_PROGRESS, FINISHED, ERROR } from '../../../common/enrichmentStatus';
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
    const room = `enrichment-job-${ctx.job.id}`;
    while (nextEntry) {
        lineIndex += 1;

        const logData = JSON.stringify({
            level: 'info',
            message: `Started enriching line #${lineIndex}`,
            timestamp: new Date(),
            status: IN_PROGRESS,
        });
        ctx.job.log(logData);
        notifyListeners(room, logData);
        try {
            let { value } = await processEzsEnrichment(nextEntry, enrichment);
            const logData = JSON.stringify({
                level: 'info',
                message: `Finished enriching line #${lineIndex} (output: ${value})`,
                timestamp: new Date(),
                status: IN_PROGRESS,
            });
            ctx.job.log(logData);
            notifyListeners(room, logData);

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

            const logData = JSON.stringify({
                level: 'error',
                message: `Error enriching line #${lineIndex}`,
                timestamp: new Date(),
                status: IN_PROGRESS,
            });
            ctx.job.log(logData);
            notifyListeners(room, logData);
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
    const logData = JSON.stringify({
        level: 'ok',
        message: `Enrichement finished`,
        timestamp: new Date(),
        status: FINISHED,
    });
    ctx.job.log(logData);
    notifyListeners(room, logData);
};

export const setEnrichmentJobId = async (ctx, enrichmentID, job) => {
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichmentID) },
        { $set: { ['jobId']: job.id } },
    );
};

export const startEnrichmentBackground = async ctx => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
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
    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'ok',
        message: `Enrichement started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    ctx.job.log(logData);
    notifyListeners(room, logData);
    await processEnrichmentBackground(firstEntry, enrichment, ctx);
};

export const setEnrichmentBackgroundError = async ctx => {
    const id = ctx.job?.data?.id;
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ['status']: ERROR } },
    );

    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message: `Enrichement errored`,
        timestamp: new Date(),
        status: ERROR,
    });
    ctx.job.log(logData);
    notifyListeners(room, logData);
};

const LISTENERS = [];
export const addEnrichmentJobListener = listener => {
    LISTENERS.push(listener);
};

const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
