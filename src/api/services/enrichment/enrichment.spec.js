import { enrichments } from '../../../app/js/admin/enrichment';
import {
    getEnrichmentRuleModel
} from './enrichment';

describe('enrichment', () => {
    describe('getEnrichmentRuleModel', () => {
        it('should get rule for single value and direct path', async () => {
            const sourceData = 'single value'
            const enrichment = {
                name: 'Test', 
                sourceColumn: 'source',
                subPath: null,
                advancedMode: false,
                webServiceUrl: 'lodex.fr'
            }

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(URLConnect)/i)
            expect(result).not.toMatch(/(expand\/exploding)/i)
        });

        it('should get rule for multiple values and direct path', async () => {
            const sourceData = ['data', 'otherData'];
            const enrichment = {
                name: 'Test', 
                sourceColumn: 'source',
                subPath: null,
                advancedMode: false,
                webServiceUrl: 'lodex.fr'
            }

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(URLConnect)/i)
            expect(result).toMatch(/(expand\/exploding)/i)
        });

        it('should get rule for single value and sub path', async () => {
            const sourceData = [{sub: 'data'}];
            const enrichment = {
                name: 'Test', 
                sourceColumn: 'source',
                subPath: 'sub',
                advancedMode: false,
                webServiceUrl: 'lodex.fr'
            }

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/expand\/URLConnect)/i)
            expect(result).not.toMatch(/(expand\/expand\/exploding)/i)
        });


        it('should get rule for multiple values and sub path', async () => {
            const sourceData = [{sub: ['data', 'otherData']}];
            const enrichment = {
                name: 'Test', 
                sourceColumn: 'source',
                subPath: 'sub',
                advancedMode: false,
                webServiceUrl: 'lodex.fr'
            }

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/expand\/expand\/URLConnect)/i)
            expect(result).toMatch(/(expand\/expand\/exploding)/i)
        });
    });
});
