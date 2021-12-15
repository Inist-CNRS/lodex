import * as fs from 'fs';
import path from 'path';
import ezs from '@ezs/core';
import logger from '../../services/logger';

import { ObjectId } from 'mongodb';
import { PassThrough } from 'stream';
import { IN_PROGRESS, FINISHED } from '../../../common/enrichmentStatus';

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

export const getEnrichmentDataPreview = async ctx => {
    const { sourceColumn, subPath } = ctx.request.body;

    if (!sourceColumn) {
        throw new Error(`Missing sourceColumn parameter`);
    }

    const data = await getSourceData(ctx, sourceColumn);
    const rule = getEnrichmentRuleModel(data, { sourceColumn, subPath });
    const commands = createEzsRuleCommands(rule);
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
    return (
        typeof sourceData === 'object' &&
        Array.isArray(sourceData) &&
        typeof sourceData[0] === 'object'
    );
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
                rule = rule.replace('[URLConnect]', '');
                rule = rule.replace('[expand/URLConnect]', '');
            }
        }

        if (isSubPath(sourceData)) {
            // if (!enrichment.subPath) {
            //     throw new Error(`Missing sub-path parameter`);
            // }
            const subPathData = sourceData[0][enrichment.subPath];
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
                    rule = rule.replace('[expand/URLConnect]', '');
                    rule = rule.replace('[expand/expand/URLConnect]', '');
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
            logger.info(`valueWebService : ${value}`);
            return resolve({ value });
        });
        result.on('error', error => reject({ error }));
        input.write({ id: entry._id, value: entry });
        input.end();
    });
};

const processStartEnrichment = async (entry, enrichment, ctx) => {
    let nextEntry = entry;

    if (nextEntry) {
        await ctx.enrichment.updateOne(
            { _id: new ObjectId(enrichment._id) },
            { $set: { ['status']: IN_PROGRESS } },
        );
    }

    const commands = createEzsRuleCommands(enrichment.rule);
    while (nextEntry) {
        ctx.job.log(`Enrichment ${enrichment.name} on ${nextEntry._id}`);
        try {
            let { value } = await processEzsEnrichment(nextEntry, commands);

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
        if (!nextEntry) {
            await ctx.enrichment.updateOne(
                { _id: new ObjectId(enrichment._id) },
                { $set: { ['status']: FINISHED } },
            );
        }
    }
};

export const startEnrichment = async ctx => {
    const id = ctx.job?.data?.id;
    const enrichment = await ctx.enrichment.findOneById(id);
    const firstEntry = await getEnrichmentDatasetCandidate(enrichment._id, ctx);
    await processStartEnrichment(firstEntry, enrichment, ctx);
};
