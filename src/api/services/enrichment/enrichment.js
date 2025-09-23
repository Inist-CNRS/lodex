import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import {
    createFusible,
    enableFusible,
    disableFusible,
} from '@ezs/core/fusible';
import { PassThrough } from 'stream';
import progress from '../../services/progress';
import localConfig from '../../../../config.json';
import { mongoConnectionString } from '../mongoClient';

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
        return [`Execution Error: ${error?.sourceError?.message}`];
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
        const environment = {
            connectionStringURI: mongoConnectionString(ctx.tenant),
        };
        const values = [];
        from(entries)
            .pipe(ezs(preformat))
            .pipe(ezs('detach', { commands }, environment))
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
                    // try to obtain only the lodash error message
                    const errorMessage =
                        Array()
                            .concat(error?.traceback)
                            .filter((x) => x.search(/Error:/) >= 0)
                            .shift() || error?.message;

                    return values.push({
                        id: sourceChunk?.id,
                        value: errorMessage, // for the preview
                        error: errorMessage, // for the log
                    });
                } else {
                    return values.push(data);
                }
            })
            .on('end', () => resolve(values))
            .on('error', (error) => reject(error));
    });
};

const processEnrichmentPipeline = (room, fusible, filter, enrichment, ctx) => new Promise((resolve, reject) => {
    const environment = {
        connectionStringURI: mongoConnectionString(ctx.tenant),
    };
    const primer = {
        filter,
    };
    let errorCount = 0;
    const script = `
    [use]
    plugin = lodex

    [LodexRunQuery]
    collection = dataset

    [breaker]
    fusible = ${fusible}

    [replace]
    path = id
    value = get('uri')

    path = value
    value = self().omit(['_id', 'uri'])

    ${enrichment.rule}

    [catch]
    stop = false
    [LodexHomogenizedObject]

    [LodexUpdateDocument]
    collection = dataset
    field = ${enrichment.name}

    [breaker]
    fusible = ${fusible}
    `;
    const input = new PassThrough({ objectMode: true });
    input
        .pipe(ezs(
            'delegate',
            { script },
            environment,
        ))
        .on('data', async (data) => {
            if (!(await ctx.job?.isActive())) {
                return reject(new CancelWorkerError('Job has been canceled'));
            }
            progress.incrementProgress(ctx.tenant, 1);
            const {id, value, error } = data;
            let logData;
            if (id) {
                logData = JSON.stringify({
                    level: error ? 'error' : 'info',
                    message: error
                    ? `[Instance: ${ctx.tenant}] Error enriching #${id}: ${value}`
                    : `[Instance: ${ctx.tenant}] Finished enriching #${id} (output: ${value})`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
                errorCount += error ? 1 : 0;
            } else {
                errorCount += 1;
                logData = JSON.stringify({
                    level: 'error',
                    message: `[Instance: ${ctx.tenant}] ${e.message}`,
                    timestamp: new Date(),
                    status: IN_PROGRESS,
                });
            }
            jobLogger.info(ctx.job, logData);
            notifyListeners(room, logData);
        })
        .on('end', () => resolve(errorCount))
        .on('error', (error) => {
            error.errorCount = errorCount;
            reject(error);
        });
    input.end(primer);
});

export const processEnrichment = async (enrichment, filter, ctx) => {
    const room = `${ctx.tenant}-enrichment-job-${ctx.job.id}`;
    let errorCount = 0;
    await ctx.enrichment.updateStatus(enrichment._id, IN_PROGRESS);
    try {
        const fusible = await createFusible();
        await enableFusible(fusible);
        ctx.job.update({
            ...ctx.job.data,
            fusible,
        });
        errorCount = await processEnrichmentPipeline(room, fusible, filter, enrichment, ctx);
    } catch(e) {
        errorCount = e.errorCount || 0;
        const logData = JSON.stringify({
            level: 'error',
            message: `[Instance: ${ctx.tenant}] Enrichment failed (${e.message})`,
            timestamp: new Date(),
            status: IN_PROGRESS,
        });
        jobLogger.info(ctx.job, logData);
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

    const filter = ctx.retryFailedOnly
        ? {
            [enrichment.name]: /^\[Error\]:/,
        }
        : undefined;

    const dataSetSize = await ctx.dataset.count(filter);
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
        message: `[Instance: ${ctx.tenant}] Enrichment started`,
        timestamp: new Date(),
        status: IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processEnrichment(enrichment, filter, ctx);
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
    // very useful for identifying the origin of production errors.
    console.warn('handleEnrichmentError', err);
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
            await ctx.enrichment.updateOne(enrichment._id, enrichmentWithRule);
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
