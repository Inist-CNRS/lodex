import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import progress from '../../services/progress';

import { ObjectId } from 'mongodb';
import { PassThrough, pipeline, Transform, Writable } from 'stream';
import { IN_PROGRESS, FINISHED, ERROR } from '../../../common/enrichmentStatus';
import { ENRICHING, PENDING } from '../../../common/progressStatus';
import { jobLogger } from '../../workers/tools';

const getSourceData = async (ctx, sourceColumn) => {
    const excerptLines = await ctx.dataset.getExcerpt({
        [sourceColumn]: { $ne: null },
    });
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
    rule = rule.replace('[URLConnect]', '[transit]');
    rule = rule.replace('[expand/URLConnect]', '[expand/transit]');
    rule = rule.replace(
        '[expand/expand/URLConnect]',
        '[expand/expand/transit]',
    );
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
    const excerptLines = await ctx.dataset.getExcerpt({
        [sourceColumn]: { $ne: null },
    });
    let result = [];
    for (const line of excerptLines) {
        let { value } = await processEzsEnrichment(line, commands);
        result.push(value);
    }
    return result;
};

export const getEnrichmentRuleModel = (sourceData, enrichment) => {
    try {
        let rule;
        if (!enrichment.sourceColumn) {
            throw new Error(`Missing source column parameter`);
        }
        if (!enrichment.subPath) {
            const file = Array.isArray(sourceData)
                ? './directPathMultipleValues.txt'
                : './directPathSingleValue.txt';
            rule = fs.readFileSync(path.resolve(__dirname, file)).toString();
            rule = rule.replace(
                /\[\[SOURCE COLUMN\]\]/g,
                enrichment.sourceColumn,
            );

            if (enrichment.webServiceUrl) {
                rule = rule.replace(
                    '[[WEB SERVICE URL]]',
                    enrichment.webServiceUrl,
                );
            } else {
                rule = cleanWebServiceRule(rule);
            }
        } else {
            const file = Array.isArray(sourceData)
                ? './subPathMultipleValues.txt'
                : './subPathSingleValue.txt';
            rule = fs.readFileSync(path.resolve(__dirname, file)).toString();
            rule = rule.replace(
                /\[\[SOURCE COLUMN\]\]/g,
                enrichment.sourceColumn,
            );
            rule = rule.replace(/\[\[SUB PATH\]\]/g, enrichment.subPath);
            if (enrichment.webServiceUrl) {
                rule = rule.replace(
                    '[[WEB SERVICE URL]]',
                    enrichment.webServiceUrl,
                );
            } else {
                rule = cleanWebServiceRule(rule);
            }
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
        .limit(100)
        .toArray();

    return entry;
};

const createEzsRuleCommands = rule => ezs.compileScript(rule).get();

const processEzsEnrichment = (entry, commands) => {
    return new Promise((resolve, reject) => {
        const input = new PassThrough({ objectMode: true });
        const result = input.pipe(ezs('delegate', { commands }, {}));

        result.on('data', ({ value }) => {
            return resolve({ value });
        });
        result.on('error', error => reject({ error }));
        input.write({ id: entry._id, value: entry });
        input.end();
    });
};

const formatInputData = new Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
        console.log('typeof chunk', typeof chunk);
        const transformedData = { id: chunk._id, value: chunk };
        callback(null, transformedData);
    },
});

//     (chunk, encoding, callback) => {
//     console.log(chunk);
//     return { id: chunk._id, value: chunk };
// });

const lodexOutput = (ctx, room, enrichment) =>
    new Writable({
        objectMode: true,
        write: (chunk, encoding, next) => {
            console.log('saving:', chunk);
            ctx.dataset
                .updateOne(
                    { _id: new ObjectId(chunk.id) },
                    { $set: { [enrichment.name]: chunk.value } },
                )
                .then(() => {
                    const logData = JSON.stringify({
                        level: 'info',
                        message: `Finished enriching line #${chunk.id} (output: ${chunk.value})`,
                        timestamp: new Date(),
                        status: IN_PROGRESS,
                    });
                    jobLogger.info(ctx.job, logData);
                    notifyListeners(room, logData);
                    progress.incrementProgress(1);
                });
            next();
        },
    });

const processEnrichment = async (enrichment, ctx) => {
    const room = `enrichment-job-${ctx.job.id}`;
    const commands = createEzsRuleCommands(enrichment.rule);
    const output = lodexOutput(ctx, room, enrichment);
    const startingLogger = new PassThrough({ objectMode: true });
    startingLogger.on('data', chunk => {
        const logData = JSON.stringify({
            level: 'info',
            message: `Started enriching id ${chunk.id}`,
            timestamp: new Date(),
            status: IN_PROGRESS,
        });
        jobLogger.info(ctx.job, logData);
        notifyListeners(room, logData);
    });

    ctx.dataset
        .find()
        .stream()
        .pipe(formatInputData)
        .pipe(startingLogger)
        .pipe(ezs('delegate', { commands }, {}))
        .pipe(output)
        .on('finish', () => {
            progress.finish();
            ctx.enrichment.updateOne(
                { _id: new ObjectId(enrichment._id) },
                { $set: { ['status']: FINISHED } },
            );
        });
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
            type: 'enrichment',
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

export const setEnrichmentError = async ctx => {
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
