import * as fs from 'fs';
import path from 'path';

export const createEnrichmentRule = async ctx => {
    const enrichment = ctx.request.body;
    if (enrichment.advancedMode) {
        return enrichment;
    }

    if (!enrichment.webServiceUrl || !enrichment.sourceColumn) {
        throw new Error(`Missing parameters`);
    }

    const excerpt = await ctx.dataset.getExcerpt();
    const sourceData = excerpt[0][enrichment.sourceColumn];
    let data;
    try {
        data = JSON.parse(sourceData);
    } catch {
        data = sourceData;
    }

    let rule = getEnrichmentRuleModel(data, enrichment);

    return {
        ...enrichment,
        rule: rule,
    };
};

export const getEnrichmentRuleModel = (sourceData, enrichment) => {
    try {
        let rule;
        if (typeof sourceData === 'string' || (Array.isArray(sourceData) && typeof sourceData[0] === 'string')) {
            const file = Array.isArray(sourceData)
                ? './directPathMultipleValues.txt'
                : './directPathSingleValue.txt';
            rule = fs.readFileSync(path.resolve(__dirname, file)).toString();
            let columnName = `${enrichment.sourceColumn}${
                !!enrichment.subPath ? '.' + enrichment.subPath : ''
            }`;
            rule = rule.replace(/\[\[COLUMN NAME\]\]/g, columnName);
            rule = rule.replace(
                '[[WEB SERVICE URL]]',
                enrichment.webServiceUrl,
            );
        }

        if (typeof sourceData === 'object' && (Array.isArray(sourceData)  && typeof sourceData[0] === 'object')) {
            if (!enrichment.subPath) {
                throw new Error(`Missing sub-path parameters`);
            }
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
                rule = rule.replace(
                    '[[WEB SERVICE URL]]',
                    enrichment.webServiceUrl,
                );
            }
        }

        return rule;
    } catch (e) {
        console.log('Error:', e.stack);
    }
};
