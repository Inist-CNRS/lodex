import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import progress from '../../services/progress';
import localConfig from '../../../../config.json';

import { ObjectId } from 'mongodb';
import from from 'from';
import {
    PENDING as ENRICHMENT_PENDING,
    IN_PROGRESS,
    FINISHED,
    ERROR,
    CANCELED,
} from '../../../common/taskStatus';
import { ENRICHING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';
import { CancelWorkerError } from '../../workers';
import getLogger from '../logger';

const getSourceData = async (ctx, sourceColumn) => {
    const excerptLines = await ctx.dataset.getExcerpt(
        sourceColumn
            ? {
                  [sourceColumn]: { $ne: null },
              }
            : {},
    );

    if (!excerptLines) {
        return null;
    }

    if (excerptLines.length === 0) {
        return null;
    }

    const sourceData = excerptLines[0][sourceColumn];
    try {
        return JSON.parse(sourceData);
    } catch {
        return sourceData;
    }
};

export const createEnrichmentRule = async (ctx, enrichment) => {
    const { enrichmentBatchSize } = ctx.configTenant;
    const BATCH_SIZE = Number(enrichmentBatchSize || 10);
    if (enrichment.advancedMode) {
        return enrichment;
    }

    if (!enrichment.webServiceUrl || !enrichment.sourceColumn) {
        throw new Error(`Missing parameters`);
    }

    const data = await getSourceData(ctx, enrichment.sourceColumn);
    let rule = getEnrichmentRuleModel(data, enrichment, BATCH_SIZE);

    return {
        ...enrichment,
        rule: rule,
    };
};

const cleanWebServiceRule = (rule) => {
    rule = rule.replace('URLConnect', 'transit');
    return rule;
};

export const getEnrichmentDataPreview = async (ctx) => {
    const { enrichmentBatchSize } = ctx.configTenant;
    const BATCH_SIZE = Number(enrichmentBatchSize || 10);
    const { sourceColumn, subPath, rule } = ctx.request.body;
    let previewRule = rule;
    if (!sourceColumn && !rule) {
        throw new Error(`Missing parameters`);
    }

    if (!previewRule) {
        const data = await getSourceData(ctx, sourceColumn);
        previewRule = getEnrichmentRuleModel(
            data,
            {
                sourceColumn,
                subPath,
            },
            BATCH_SIZE,
        );
    } else {
        previewRule = cleanWebServiceRule(previewRule);
    }
    const commands = createEzsRuleCommands(previewRule);
    const excerptLines = await ctx.dataset.getExcerpt();
    let result = [];
    try {
        for (let index = 0; index < excerptLines.length; index += BATCH_SIZE) {
            let values = await processEzsEnrichment(
                excerptLines.slice(index, index + BATCH_SIZE),
                commands,
                ctx,
                true,
            );

            // Display null or undefined by string only for preview. Use for show informations to user.
            result.push(
                ...values.map((v) =>
                    v.value !== undefined ? v.value : 'undefined',
                ),
            );
        }
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Error while processing enrichment preview`, error);
        return [];
    }
    return result;
};

export const getEnrichmentRuleModel = (sourceData, enrichment, BATCH_SIZE) => {
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
            rule = rule
                .replace('[[WEB SERVICE URL]]', enrichment.webServiceUrl)
                .replace(
                    '[[WEB SERVICE TIMEOUT]]',
                    Number(localConfig.timeout) || 120000,
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

const createEzsRuleCommands = (rule) => ezs.compileScript(rule).get();

export const getSourceError = (error) => {
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
            .on('data', (data) => {
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
            .on('error', (error) => reject(error));
    });
};

export const processEnrichment = async (enrichment, ctx) => {
    const { enrichmentBatchSize } = ctx.configTenant;
    const BATCH_SIZE = Number(enrichmentBatchSize || 10);
    await ctx.enrichment.updateStatus(enrichment._id, IN_PROGRESS);
    let errorCount = 0;

    const room = `${ctx.tenant}-enrichment-job-${ctx.job.id}`;
    const commands = createEzsRuleCommands(enrichment.rule);
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
                        { $set: { [enrichment.name]: value } },
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
                            [enrichment.name]: `[Error]: ${e.message}`,
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
    await ctx.enrichment.updateStatus(enrichment._id, FINISHED, { errorCount });
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

export const setEnrichmentJobId = async (ctx, enrichmentID, job) => {
    await ctx.enrichment.updateStatus(enrichmentID, ENRICHMENT_PENDING, {
        jobId: job.id,
    });
};

export const startEnrichment = async (ctx) => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    const dataSetSize = await ctx.dataset.count();
    progress.initialize(ctx.tenant);
    progress.start(ctx.tenant, {
        status: ENRICHING,
        target: dataSetSize,
        label: 'ENRICHING',
        subLabel: enrichment.name,
        type: 'enricher',
    });

    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Enrichement started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processEnrichment(enrichment, ctx);
};

export const setEnrichmentError = async (ctx, err) => {
    const id = ctx.job?.data?.id;
    await ctx.enrichment.updateStatus(
        id,
        err instanceof CancelWorkerError ? CANCELED : ERROR,
        {
            message: err?.message,
        },
    );

    const room = `enrichment-job-${ctx.job.id}`;
    const logData = JSON.stringify({
        level: 'error',
        message:
            err instanceof CancelWorkerError
                ? `[Instance: ${ctx.tenant}] ${err?.message}`
                : `[Instance: ${ctx.tenant}] Enrichement errored : ${err?.message}`,
        timestamp: new Date(),
        status: err instanceof CancelWorkerError ? CANCELED : ERROR,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    notifyListeners(`${ctx.tenant}-enricher`, {
        isEnriching: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_enricher'
                : err?.message,
    });
};

export const restoreEnrichments = async (ctx) => {
    // mongo update all enrichment to set status to empty
    await ctx.enrichment.updateMany({}, { $set: { status: '' } });

    // some enrichments are exported without a rule, we need to recreate the rule if it is the case
    const enrichments = await ctx.enrichment.find({}).toArray();

    for (const enrichment of enrichments) {
        if (!enrichment.rule) {
            const enrichmentWithRule = await createEnrichmentRule(
                ctx,
                enrichment,
            );
            await ctx.enrichment.update(enrichment._id, enrichmentWithRule);
        }
    }
};

const LISTENERS = [];
export const addEnrichmentJobListener = (listener) => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room, payload) => {
    LISTENERS.forEach((listener) => listener({ room, data: payload }));
};
