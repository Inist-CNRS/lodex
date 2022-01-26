import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import progress from '../../services/progress';

import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import { IN_PROGRESS, FINISHED, ERROR } from '../../../common/enrichmentStatus';
import { ENRICHING, PENDING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError } from '../../workers';

const BATCH_SIZE = 100;

const getSourceData = async (ctx, sourceColumn) => {
    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumn
            ? {
                  [sourceColumn]: { $ne: null },
              }
            : {},
    );
    const sourceData = excerptLines[0][sourceColumn];
    try {
        return JSON.parse(sourceData);
    } catch {
        return sourceData;
    }
};

export const createEnrichmentRule = async ctx => {
    const enrichment = ctx.request.body;
    if (enrichment.advancedMode) {
        return enrichment;
    }

    if (!enrichment.webServiceUrl || !enrichment.sourceColumn) {
        throw new Error(`Missing parameters`);
    }

    const data = await getSourceData(ctx, enrichment.sourceColumn);

    let rule = getEnrichmentRuleModel(data, enrichment);

    return {
        ...enrichment,
        rule: rule,
    };
};

const cleanWebServiceRule = rule => {
    rule = rule.replace('URLConnect', 'transit');
    return rule;
};

export const getEnrichmentDataPreview = async ctx => {
    const { sourceColumn, subPath, rule } = ctx.request.body;
    let previewRule = rule;
    if (!sourceColumn && !rule) {
        throw new Error(`Missing parameters`);
    }

    if (!previewRule) {
        const data = await getSourceData(ctx, sourceColumn);
        previewRule = getEnrichmentRuleModel(data, {
            sourceColumn,
            subPath,
        });
    } else {
        previewRule = cleanWebServiceRule(previewRule);
    }
    const commands = createEzsRuleCommands(previewRule);
    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumn ? { [sourceColumn]: { $ne: null } } : {},
    );
    let result = [];
    for (let index = 0; index < excerptLines.length; index += BATCH_SIZE) {
        let values = await processEzsEnrichment(
            excerptLines.slice(index, index + BATCH_SIZE),
            commands,
        );
        result.push(...values.map(v => v.value));
    }
    return result;
};

export const getEnrichmentRuleModel = (sourceData, enrichment) => {
    try {
        let rule;
        if (!enrichment.sourceColumn) {
            throw new Error(`Missing source column parameter`);
        }
        let file;
        if (!enrichment.subPath) {
            file = Array.isArray(sourceData)
                ? './directPathMultipleValues.txt'
                : './directPathSingleValue.txt';
        } else {
            file = Array.isArray(sourceData)
                ? './subPathMultipleValues.txt'
                : './subPathSingleValue.txt';
        }

        rule = fs.readFileSync(path.resolve(__dirname, file)).toString();
        rule = rule.replace(/\[\[SOURCE COLUMN\]\]/g, enrichment.sourceColumn);
        rule = rule.replace(/\[\[SUB PATH\]\]/g, enrichment.subPath);
        rule = rule.replace(/\[\[BATCH SIZE\]\]/g, BATCH_SIZE);
        if (enrichment.webServiceUrl) {
            rule = rule.replace(
                '[[WEB SERVICE URL]]',
                enrichment.webServiceUrl,
            );
        } else {
            rule = cleanWebServiceRule(rule);
        }

        return rule;
    } catch (e) {
        console.error('Error:', e.stack);
        throw e;
    }
};

export const getEnrichmentDatasetCandidate = async (id, ctx) => {
    const enrichment = await ctx.enrichment.findOneById(id);
    const [entry] = await ctx.dataset
        .find({ [enrichment.name]: { $exists: false } })
        .limit(1)
        .toArray();

    return entry;
};

const createEzsRuleCommands = rule => ezs.compileScript(rule).get();

export const getSourceError = error => {
    const sourceError = error?.sourceError;
    if (sourceError?.sourceError) {
        return getSourceError(sourceError);
    }
    return error;
};

const processEzsEnrichment = (entries, commands) => {
    return new Promise((resolve, reject) => {
        const values = [];
        const input = new PassThrough({ objectMode: true });

        input
            .pipe(ezs('delegate', { commands }, {}))
            .on('data', data => {
                if (data instanceof Error) {
                    const error = getSourceError(data);
                    const sourceChunk = error?.sourceChunk
                        ? JSON.parse(error.sourceChunk)
                        : null;
                    values.push({
                        id: sourceChunk?.id,
                        error: error?.sourceError?.message,
                    });
                } else {
                    values.push(data);
                }
            })
            .on('end', () => {
                resolve(values);
            })
            .on('error', error => reject(error));

        for (const entry of entries) {
            input.write({ id: entry.uri, value: entry });
        }
        input.end();
    });
};

export const processEnrichment = async (enrichment, ctx) => {
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichment._id) },
        { $set: { ['status']: IN_PROGRESS } },
    );
    const room = `enrichment-job-${ctx.job.id}`;
    const commands = createEzsRuleCommands(enrichment.rule);
    const dataSetSize = await ctx.dataset.count();
    for (let index = 0; index < dataSetSize; index += BATCH_SIZE) {
        if (!(await ctx.job.isActive())) {
            throw new CancelWorkerError('Job has been canceled');
        }
        const entries = await ctx.dataset
            .find()
            .skip(index)
            .limit(BATCH_SIZE)
            .toArray();
        for (const entry of entries) {
            const logData = JSON.stringify({
                level: 'info',
                message: `Started enriching #${entry.uri}`,
                timestamp: new Date(),
                status: IN_PROGRESS,
            });
            jobLogger.info(ctx.job, logData);
            notifyListeners(room, logData);
        }
        try {
            const enrichedValues = await processEzsEnrichment(
                entries,
                commands,
            );

            for (const enrichedValue of enrichedValues) {
                const value =
                    enrichedValue.value ||
                    (enrichedValue.error && `[Error] ${enrichedValue.error}`) ||
                    'n/a';

                const id = enrichedValue.id;
                const logData = JSON.stringify({
                    level: enrichedValue.error ? 'error' : 'info',
                    message: enrichedValue.error
                        ? `Error enriching #${id}: ${value}`
                        : `Finished enriching #${id} (output: ${value})`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
                notifyListeners(room, logData);
                await ctx.dataset.updateOne(
                    {
                        uri: id,
                    },
                    { $set: { [enrichment.name]: value } },
                );
                progress.incrementProgress(1);
            }
        } catch (e) {
            for (const entry of entries) {
                await ctx.dataset.updateOne(
                    { _id: new ObjectId(entry._id) },
                    {
                        $set: {
                            [enrichment.name]: `ERROR: ${e.message}`,
                        },
                    },
                );

                const logData = JSON.stringify({
                    level: 'error',
                    message: e.message,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                jobLogger.info(ctx.job, logData);
                notifyListeners(room, logData);
                progress.incrementProgress(1);
            }
        }
    }
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichment._id) },
        { $set: { ['status']: FINISHED } },
    );
    progress.finish();
    const logData = JSON.stringify({
        level: 'ok',
        message: `Enrichement finished`,
        timestamp: new Date(),
        status: FINISHED,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setEnrichmentJobId = async (ctx, enrichmentID, job) => {
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(enrichmentID) },
        { $set: { ['jobId']: job.id } },
    );
};

export const startEnrichment = async ctx => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    const dataSetSize = await ctx.dataset.count();
    if (progress.getProgress().status === PENDING) {
        progress.start({
            status: ENRICHING,
            target: dataSetSize,
            label: 'ENRICHING',
            subLabel: enrichment.name,
            type: 'enricher',
        });
    }
    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'ok',
        message: `Enrichement started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processEnrichment(enrichment, ctx);
};

export const setEnrichmentError = async (ctx, err) => {
    const id = ctx.job?.data?.id;
    await ctx.enrichment.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ['status']: ERROR, ['message']: err?.message } },
    );

    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message: `Enrichement errored : ${err?.message}`,
        timestamp: new Date(),
        status: ERROR,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

const LISTENERS = [];
export const addEnrichmentJobListener = listener => {
    LISTENERS.push(listener);
};

const notifyListeners = (room, payload) => {
    LISTENERS.forEach(listener => listener({ room, data: payload }));
};
