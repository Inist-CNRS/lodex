import * as fs from 'fs';
import path from 'path';

export const createEnrichmentRule = enrichment => {
    if (enrichment.hasOwnProperty('rule')) {
        return enrichment;
    }

    if (!enrichment.webServiceUrl || !enrichment.sourceColumn) {
        throw new Error(`Missing parameters`);
    }

    try {
        let data = fs
            .readFileSync(path.resolve(__dirname, './enrichment.txt'))
            .toString();
        let columnName = `${enrichment.sourceColumn}${
            !!enrichment.subPath ? '.' + enrichment.subPath : ''
        }`;
        data = data.replace('[[COLUMN NAME]]', columnName);
        data = data.replace('[[WEB SERVICE URL]]', enrichment.webServiceUrl);

        return {
            name: enrichment.name,
            advancedMode: enrichment.advancedMode,
            rule: data
        }
    } catch (e) {
        console.log('Error:', e.stack);
    }
};
