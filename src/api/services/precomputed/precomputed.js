//TODO - Precomputing Task will be coded in next card

import ezs from '@ezs/core';
import progress from '../progress';
import localConfig from '../../../../config.json';

import { ObjectId } from 'mongodb';
import from from 'from';
import {
    PENDING as PRECOMPUTED_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
} from '../../../common/taskStatus';
import { PRECOMPUTING, PENDING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError } from '../../workers';
import getLogger from '../logger';

const { precomputedBatchSize: BATCH_SIZE = 10 } = localConfig;

const getSourceData = async (ctx, sourceColumns) => {
    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumns
            ? {
                  [sourceColumns]: { $ne: null },
              }
            : {},
    );
    if (excerptLines.length === 0) {
        return null;
    }

    const sourceData = excerptLines[0][sourceColumns];
    try {
        return JSON.parse(sourceData);
    } catch {
        return sourceData;
    }
};

export const getPrecomputedDataPreview = async ctx => {
    const { sourceColumns } = ctx.request.body;
    if (!sourceColumns) {
        throw new Error(`Missing parameters`);
    }

    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumns && sourceColumns.length
            ? { [sourceColumns[0]]: { $ne: null } }
            : {},
    );
    let result = [];
    try {
        for (
            let index = 0;
            index < Math.min(excerptLines.length, BATCH_SIZE);
            index += 1
        ) {
            const entry = {};
            sourceColumns.map(column => {
                entry[column] = excerptLines[index][column];
            });
            result.push(entry);
        }
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Error while processing precomputed preview`, error);
        return [];
    }
    return result;
};

const createEzsRuleCommands = rule => ezs.compileScript(rule).get();

export const getSourceError = error => {
    const sourceError = error?.sourceError;
    if (sourceError?.sourceError) {
        return getSourceError(sourceError);
    }
    return error;
};

function preformat(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    feed.send({ id: data.uri, value: data });
}

async function postcheck(data, feed) {
    const preview = this.getParam('preview');
    const ctx = this.getEnv();
    if (this.isLast()) {
        return feed.close();
    }
    if (!preview && !(await ctx.job?.isActive())) {
        return feed.stop(new CancelWorkerError('Job has been canceled'));
    }
    feed.send(data);
}

const processEzsEnrichment = (entries, commands, ctx, preview = false) => {
    return new Promise((resolve, reject) => {
        const values = [];
        from(entries)
            .pipe(ezs(preformat))
            .pipe(ezs('delegate', { commands }, {}))
            .pipe(ezs(postcheck, { preview }, ctx))
            .on('data', data => {
                if (data instanceof Error) {
                    const error = getSourceError(data);
                    let sourceChunk = null;
                    if (error?.sourceChunk) {
                        try {
                            sourceChunk = JSON.parse(error.sourceChunk);
                        } catch (e) {
                            const logger = getLogger(ctx.tenant);
                            logger.error(`Error while parsing sourceChunk`, e);
                        }
                    }
                    return values.push({
                        id: sourceChunk?.id,
                        error: error?.sourceError?.message,
                    });
                } else {
                    return values.push(data);
                }
            })
            .on('end', () => resolve(values))
            .on('error', error => reject(error));
    });
};

export const processPrecomputed = async (precomputed, ctx) => {
    await ctx.precomputed.updateOne(
        {
            $or: [
                { _id: new ObjectId(precomputed._id) },
                { _id: precomputed._id },
            ],
        },
        { $set: { ['status']: IN_PROGRESS } },
    );
    let errorCount = 0;

    const room = `${ctx.tenant}-precomputed-job-${ctx.job.id}`;
    const commands = createEzsRuleCommands(precomputed.rule);
    const dataSetSize = await ctx.dataset.count();
    for (let index = 0; index < dataSetSize; index += BATCH_SIZE) {
        if (!(await ctx.job?.isActive())) {
            throw new CancelWorkerError('Job has been canceled');
        }
        const entries = await ctx.dataset
            .find()
            .skip(index)
            .limit(BATCH_SIZE)
            .toArray();

        const logsStartedEnriching = [];
        for (const entry of entries) {
            if (!entry.uri) {
                const logData = JSON.stringify({
                    level: 'error',
                    message: `[Instance: ${ctx.tenant}] Unable to enrich row with no URI, see object _id#${entry._id}`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
            } else {
                const logData = JSON.stringify({
                    level: 'info',
                    message: `[Instance: ${ctx.tenant}] Started enriching #${entry.uri}`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
                logsStartedEnriching.push(logData);
            }
        }
        notifyListeners(room, logsStartedEnriching.reverse());
        try {
            const enrichedValues = await processEzsEnrichment(
                entries,
                commands,
                ctx,
            );

            const logsEnrichedValue = [];
            for (const enrichedValue of enrichedValues) {
                let value;
                if (enrichedValue.error) {
                    value = `[Error] ${enrichedValue.error}`;
                } else if (
                    enrichedValue.value !== undefined &&
                    enrichedValue.value !== null
                ) {
                    value = enrichedValue.value;
                } else {
                    value = 'n/a';
                }
                const id = enrichedValue.id;
                if (id) {
                    const logData = JSON.stringify({
                        level: enrichedValue.error ? 'error' : 'info',
                        message: enrichedValue.error
                            ? `[Instance: ${ctx.tenant}] Error enriching #${id}: ${value}`
                            : `[Instance: ${ctx.tenant}] Finished enriching #${id} (output: ${value})`,
                        timestamp: new Date(),
                        status: IN_PROGRESS,
                    });
                    errorCount += enrichedValue.error ? 1 : 0;
                    jobLogger.info(ctx.job, logData);
                    logsEnrichedValue.push(logData);
                    await ctx.dataset.updateOne(
                        {
                            uri: id,
                        },
                        { $set: { [precomputed.name]: value } },
                    );
                }
            }
            progress.incrementProgress(ctx.tenant, BATCH_SIZE);
            notifyListeners(room, logsEnrichedValue.reverse());
        } catch (e) {
            for (const entry of entries) {
                await ctx.dataset.updateOne(
                    { _id: new ObjectId(entry._id) },
                    {
                        $set: {
                            [precomputed.name]: `[Error]: ${e.message}`,
                        },
                    },
                );

                const logData = JSON.stringify({
                    level: 'error',
                    message: `[Instance: ${ctx.tenant}] ${e.message}`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
                notifyListeners(room, logData);
                errorCount++;
                progress.incrementProgress(ctx.tenant, 1);
            }
        }
    }
    await ctx.precomputed.updateOne(
        {
            $or: [
                { _id: new ObjectId(precomputed._id) },
                { _id: precomputed._id },
            ],
        },
        { $set: { ['status']: FINISHED, ['errorCount']: errorCount } },
    );
    progress.finish(ctx.tenant);
    const logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Enrichement finished`,
        timestamp: new Date(),
        status: FINISHED,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setPrecomputedJobId = async (ctx, precomputedID, job) => {
    await ctx.precomputed.updateOne(
        {
            $or: [{ _id: new ObjectId(precomputedID) }, { _id: precomputedID }],
        },
        { $set: { ['jobId']: job.id, ['status']: PRECOMPUTED_PENDING } },
    );
};

export const startPrecomputed = async ctx => {
    const id = ctx.job?.data?.id;
    const precomputed = await ctx.precomputed.findOneById(id);
    const dataSetSize = await ctx.dataset.count();

    if (progress.getProgress(ctx.tenant).status === PENDING) {
        progress.start(ctx.tenant, {
            status: PRECOMPUTING,
            target: dataSetSize,
            label: 'PRECOMPUTING',
            subLabel: precomputed.name,
            type: 'precomputer',
        });
    }
    const room = `precomputed-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Precomputing started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processPrecomputed(precomputed, ctx);
};

export const setPrecomputedError = async (ctx, err) => {
    const id = ctx.job?.data?.id;
    await ctx.precomputed.updateOne(
        {
            $or: [{ _id: new ObjectId(id) }, { _id: id }],
        },
        {
            $set: {
                ['status']: err instanceof CancelWorkerError ? CANCELED : ERROR,
                ['message']: err?.message,
            },
        },
    );

    const room = `precomputed-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message:
            err instanceof CancelWorkerError
                ? `[Instance: ${ctx.tenant}] ${err?.message}`
                : `[Instance: ${ctx.tenant}] Precomputing errored : ${err?.message}`,
        timestamp: new Date(),
        status: err instanceof CancelWorkerError ? CANCELED : ERROR,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    notifyListeners(`${ctx.tenant}-precomputer`, {
        isPrecomputing: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_precomputer'
                : err?.message,
    });
};

const LISTENERS = [];
export const addPrecomputedJobListener = listener => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
