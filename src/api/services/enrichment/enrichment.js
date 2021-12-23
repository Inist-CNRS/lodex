import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import progress from '../../services/progress';

import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import { IN_PROGRESS, FINISHED, ERROR } from '../../../common/enrichmentStatus';
import { ENRICHING, PENDING } from '../../../common/progressStatus';

const getSourceData = async (ctx, sourceColumn) => {
    const excerpt = await ctx.dataset.getExcerpt();
    const sourceData = excerpt.find(line => !!line[sourceColumn])[sourceColumn];
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
    const excerptLines = await getExcerptLines(ctx);
    let result = [];
    for (const line of excerptLines) {
        let { value } = await processEzsEnrichment(line, commands);
        result.push(value);
    }
    return result;
};

const isBasicType = sourceData => {
    return typeof sourceData === 'string' || typeof sourceData === 'number';
};

const isDirectPath = sourceData => {
    return (
        isBasicType(sourceData) ||
        (Array.isArray(sourceData) && isBasicType(sourceData[0]))
    );
};

const isSubPath = sourceData => {
    return typeof sourceData === 'object';
};

export const getEnrichmentRuleModel = (sourceData, enrichment) => {
    try {
        let rule;
        if (!enrichment.sourceColumn) {
            throw new Error(`Missing source column parameter`);
        }
        if (isDirectPath(sourceData)) {
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
        }

        if (isSubPath(sourceData)) {
            let subPathData;
            if (Array.isArray(sourceData)) {
                subPathData = sourceData[0][enrichment.subPath];
            } else {
                subPathData = sourceData[enrichment.subPath];
            }

            if (!subPathData) {
                throw new Error(`No data with this sub-path`);
            }

            if (typeof subPathData === 'string' || Array.isArray(subPathData)) {
                const file = Array.isArray(subPathData)
                    ? './subPathMultipleValues.txt'
                    : './subPathSingleValue.txt';
                rule = fs
                    .readFileSync(path.resolve(__dirname, file))
                    .toString();
                rule = rule.replace(
                    '[[SOURCE COLUMN]]',
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

export const getExcerptLines = async ctx => {
    const lines = await ctx.dataset
        .find({})
        .limit(8)
        .toArray();

    return lines;
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

const processEnrichment = async (entry, enrichment, ctx) => {
    let nextEntry = entry;

    if (nextEntry) {
        await ctx.enrichment.updateOne(
            { _id: new ObjectId(enrichment._id) },
            { $set: { ['status']: IN_PROGRESS } },
        );
    }

    let lineIndex = 0;
    const room = `enrichment-job-${ctx.job.id}`;
    const commands = createEzsRuleCommands(enrichment.rule);
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
            let { value } = await processEzsEnrichment(nextEntry, commands);
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
                message: `Error enriching line #${lineIndex}: ${e.error.message}`,
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

export const startEnrichment = async ctx => {
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
    await processEnrichment(firstEntry, enrichment, ctx);
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
