import * as fs from 'fs';
import path from 'path';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import type Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module '@ezs/compile'. Did you mean to ... Remove this comment to see the full error message
import { checkFusible, createFusible, enableFusible } from '@ezs/core/fusible';
import { PassThrough } from 'stream';
import localConfig from '../../../../../config.json';
import { mongoConnectionString } from '../mongoClient';
import progress from '../progress';

import { ProgressStatus, TaskStatus } from '@lodex/common';
import from from 'from';
import { jobLogger } from '../../workers/tools';

import { CancelWorkerError } from '../../workers';
import getLogger from '../logger';

export const DATASET_COLLECTION = 'dataset';


export const addSidToUrl = (url: string) => {
    const urlObj = new URL(url);
    urlObj.searchParams.append('sid', 'lodex');
    return urlObj.toString();
};

const getSource = (ctx: Koa.Context, dataSource?: string): Source => {
    const collectionName =
        !dataSource || dataSource === DATASET_COLLECTION
            ? DATASET_COLLECTION
            : `pc_${dataSource}`;

    const collection = ctx.db.collection(collectionName);
    return {
        collectionName,
        idField: collectionName === DATASET_COLLECTION ? 'uri' : '_id',
        count: async (filter) => {
            return collection.count(filter);
        },
        getExcerpt: async (filter) => {
            return collection.find(filter).limit(10).toArray();
        },
    };
};

type Source = {
    collectionName: string;
    idField: string;
    count(filter?: Record<string, unknown>): Promise<number>;
    getExcerpt(
        filter?: Record<string, unknown>,
    ): Promise<Record<string, unknown>[]>;
};

const getSourceData = async (source: Source, sourceColumn: string) => {
    const excerptLines = await source.getExcerpt(
        sourceColumn
            ? {
                  [sourceColumn]: { $ne: null },
              }
            : {},
    );

    if (!excerptLines?.length) {
        return null;
    }

    const sourceData = excerptLines[0][sourceColumn];
    if (typeof sourceData !== 'string') {
        return sourceData;
    }

    try {
        return JSON.parse(sourceData);
    } catch {
        return sourceData;
    }
};

export const createEnrichmentRule = async (ctx: any, enrichment: any) => {
    const { enrichmentBatchSize } = ctx.configTenant;
    const BATCH_SIZE = Number(enrichmentBatchSize || 10);
    if (enrichment.advancedMode) {
        return enrichment;
    }

    if (!enrichment.webServiceUrl || !enrichment.sourceColumn) {
        throw new Error(`Missing parameters`);
    }

    const source = getSource(ctx, enrichment.dataSource);
    const data = await getSourceData(source, enrichment.sourceColumn);
    const rule = getEnrichmentRuleModel(data, enrichment, BATCH_SIZE);

    return {
        ...enrichment,
        rule: rule,
    };
};

const cleanWebServiceRule = (rule: any) => {
    rule = rule.replace('URLConnect', 'transit');
    return rule;
};

export const getEnrichmentDataPreview = async (ctx: any) => {
    const { enrichmentBatchSize } = ctx.configTenant;
    const BATCH_SIZE = Number(enrichmentBatchSize || 10);
    const { dataSource, sourceColumn, subPath, rule } = ctx.request.body;
    let previewRule = rule;
    const source = getSource(ctx, dataSource);
    if (!sourceColumn && !rule) {
        throw new Error(`Missing parameters`);
    }

    if (!previewRule) {
        const data = await getSourceData(source, sourceColumn);
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
    const excerptLines = await source.getExcerpt();
    const result = [];
    try {
        for (let index = 0; index < excerptLines.length; index += BATCH_SIZE) {
            const values = await processEzsEnrichment(
                excerptLines.slice(index, index + BATCH_SIZE),
                commands,
                ctx,
                true,
            );

            // Display null or undefined by string only for preview. Use for show informations to user.
            result.push(
                // @ts-expect-error TS(18046): values is of type unknown
                ...values.map((v: any) =>
                    v.value !== undefined ? v.value : 'undefined',
                ),
            );
        }
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Error while processing enrichment preview`, error);
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        return [`Execution Error: ${error?.sourceError?.message}`];
    }
    return result;
};

export const getEnrichmentRuleModel = (
    sourceData: any,
    enrichment: any,
    BATCH_SIZE: any,
) => {
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
                .replace('[[WEB SERVICE URL]]', addSidToUrl(enrichment.webServiceUrl))
                .replace(
                    '[[WEB SERVICE TIMEOUT]]',
                    // @ts-expect-error TS(2304): Cannot find name 'Number'.
                    Number(localConfig.timeout) || 120000,
                );
        } else {
            rule = cleanWebServiceRule(rule);
        }

        return rule;
    } catch (e) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error('Error:', e.stack);
        throw e;
    }
};

const createEzsRuleCommands = (rule: any) => ezs.compileScript(rule).get();

// @ts-expect-error TS(7023): 'getSourceError' implicitly has return type 'any' ... Remove this comment to see the full error message
export const getSourceError = (error: any) => {
    const sourceError = error?.sourceError;
    if (sourceError?.sourceError) {
        return getSourceError(sourceError);
    }
    return error;
};

function preformat(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }
    feed.send({ id: data.uri, value: data });
}

async function postcheck(this: any, data: any, feed: any) {
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

const processEzsEnrichment = (
    entries: any,
    commands: any,
    ctx: any,
    preview = false,
) => {
    return new Promise((resolve: any, reject: any) => {
        const environment = {
            connectionStringURI: mongoConnectionString(ctx.tenant),
        };
        const values: any = [];
        from(entries)
            .pipe(ezs(preformat))
            .pipe(ezs('delegate', { commands }, environment))
            .pipe(ezs(postcheck, { preview }, ctx))
            .on('data', (data: any) => {
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
                        []
                            .concat(error?.traceback)
                            .filter((x: any) => x.search(/Error:/) >= 0)
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
            .on('error', (error: any) => reject(error));
    });
};

const processEnrichmentPipeline = (
    room: any,
    fusible: any,
    filter: any,
    enrichment: any,
    ctx: any,
) =>
    new Promise<number>((resolve: any, reject: any) => {
        const source = getSource(ctx, enrichment.dataSource);
        const { enrichmentBatchSize } = ctx.configTenant;
        const BATCH_SIZE = Number(enrichmentBatchSize || 10);
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
collection = ${source.collectionName}

[breaker]
fusible = ${fusible}

[replace]
path = id
value = get('${source.idField}')

path = value
value = self().omit(['_id', '${source.idField}'])

${enrichment.rule}

[catch]
stop = false
[LodexHomogenizedObject]

[group]
length = ${BATCH_SIZE}

# Ensures that EZS does not write to the database if the job has been canceled
[breaker]
fusible = ${fusible}

[LodexUpdateDocuments]
idField = ${source.idField}
collection = ${source.collectionName}
field = ${enrichment.name}

[breaker]
fusible = ${fusible}

[ungroup]
    `;
        const input = new PassThrough({ objectMode: true });
        input
            .pipe(ezs('delegate', { script }, environment))
            .on('data', async (data: any) => {
                if (!(await ctx.job?.isActive())) {
                    return reject(
                        new CancelWorkerError('Job has been canceled'),
                    );
                }
                progress.incrementProgress(ctx.tenant, 1);
                const { id, value, error } = data;

                let logData;
                if (id) {
                    logData = JSON.stringify({
                        level: error ? 'error' : 'info',
                        message: error
                            ? `[Instance: ${ctx.tenant}] Error enriching #${id}: ${value}`
                            : `[Instance: ${ctx.tenant}] Finished enriching #${id} (output: ${value})`,
                        timestamp: new Date(),
                        status: TaskStatus.IN_PROGRESS,
                    });
                    errorCount += error ? 1 : 0;
                } else {
                    errorCount += 1;
                    logData = JSON.stringify({
                        level: 'error',
                        message: `[Instance: ${ctx.tenant}] ${error ?? 'ID missing for enrichment row'}`,
                        timestamp: new Date(),
                        status: TaskStatus.IN_PROGRESS,
                    });
                }
                jobLogger.info(ctx.job, logData);
                notifyListeners(room, logData);
            })
            .on('end', () => resolve(errorCount))
            .on('error', (error: any) => {
                error.errorCount = errorCount;
                reject(error);
            });
        input.end(primer);
    });

export const processEnrichment = async (
    enrichment: any,
    filter: any,
    ctx: any,
) => {
    const room = `${ctx.tenant}-enrichment-job-${ctx.job.id}`;
    await ctx.enrichment.updateStatus(enrichment._id, TaskStatus.IN_PROGRESS);
    if (enrichment.dataSource && enrichment.dataSource !== DATASET_COLLECTION) {
        await ctx.precomputed.removeResultColumn(
            enrichment.dataSource,
            enrichment.name,
        );
    }

    const fusible = await createFusible();
    await enableFusible(fusible);
    await ctx.job.update({
        ...ctx.job.data,
        fusible,
    });
    const errorCount = await processEnrichmentPipeline(
        room,
        fusible,
        filter,
        enrichment,
        ctx,
    );

    if (!(await checkFusible(fusible))) {
        const error = new CancelWorkerError('Job has been canceled');
        error.errorCount = errorCount;
        throw error;
    }

    await ctx.enrichment.updateStatus(enrichment._id, TaskStatus.FINISHED, {
        errorCount,
    });
    progress.finish(ctx.tenant);
    const logData = JSON.stringify({
        level: 'ok',
        message: `[Instance: ${ctx.tenant}] Enrichement finished`,
        timestamp: new Date(),
        status: TaskStatus.FINISHED,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
};

export const setEnrichmentJobId = async (
    ctx: any,
    enrichmentID: any,
    job: any,
) => {
    await ctx.enrichment.updateStatus(enrichmentID, TaskStatus.PENDING, {
        jobId: job.id,
    });
};

export const startEnrichment = async (ctx: any) => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);

    const filter = ctx.retryFailedOnly
        ? {
              [enrichment.name]: /^\[Error\]:/,
          }
        : undefined;

    const source = getSource(ctx, enrichment.dataSource);

    const dataSetSize = await source.count(filter);
    progress.initialize(ctx.tenant);
    progress.start(ctx.tenant, {
        status: ProgressStatus.ENRICHING,
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
        status: TaskStatus.IN_PROGRESS,
    });
    jobLogger.info(ctx.job, logData);
    notifyListeners(room, logData);
    await processEnrichment(enrichment, filter, ctx);
};

export const setEnrichmentError = async (ctx: any, err: any) => {
    const id = ctx.job?.data?.id;
    await ctx.enrichment.updateStatus(
        id,
        err instanceof CancelWorkerError
            ? TaskStatus.CANCELED
            : TaskStatus.ERROR,
        {
            message: err?.message,
            errorCount: err?.errorCount || 0,
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
        status:
            err instanceof CancelWorkerError
                ? TaskStatus.CANCELED
                : TaskStatus.ERROR,
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

export const restoreEnrichments = async (ctx: any) => {
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

const LISTENERS: any = [];
export const addEnrichmentJobListener = (listener: any) => {
    LISTENERS.push(listener);
};

export const notifyListeners = (room: any, payload: any) => {
    LISTENERS.forEach((listener: any) => listener({ room, data: payload }));
};
