import { getEnrichmentDataPreview, getEnrichmentRuleModel } from './enrichment';

describe('enrichment', () => {
    describe('getEnrichmentRuleModel', () => {
        it('should get rule for single value and direct path', async () => {
            const sourceData = 'single value';
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: null,
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(URLConnect)/i);
            expect(result).not.toMatch(/(expand\/exploding)/i);
        });

        it('should get rule for multiple values and direct path', async () => {
            const sourceData = ['data', 'otherData'];
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: null,
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(URLConnect)/i);
            expect(result).toMatch(/(expand\/exploding)/i);
        });

        it('should get rule for single value and sub path', async () => {
            const sourceData = [{ sub: 'data' }];
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: 'sub',
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/URLConnect)/i);
            expect(result).toMatch(/(expand\/exploding)/i);
            expect(result).toMatch(/(expand\/assign)/i);
        });

        it('should get rule for multiple values and sub path', async () => {
            const sourceData = [{ sub: ['data', 'otherData'] }];
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: 'sub',
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/exploding)/i);
            expect(result).toMatch(/(expand\/expand\/exploding)/i);
            expect(result).toMatch(/(expand\/expand\/URLConnect)/i);
        });

        it('should get an error for missing sourceColumn', async () => {
            const sourceData = [{ sub: ['data', 'otherData'] }];
            const enrichment = {
                name: 'Test',
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            expect(() =>
                getEnrichmentRuleModel(sourceData, enrichment),
            ).toThrow('Missing source column parameter');
        });

        it('should get an error for having no data with this sub-path', async () => {
            const sourceData = [{ sub: ['data', 'otherData'] }];
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: 'bad_sub',
                advancedMode: false,
                webServiceUrl: 'lodex.fr',
            };

            expect(() =>
                getEnrichmentRuleModel(sourceData, enrichment),
            ).toThrow('No data with this sub-path');
        });
    });

    describe('getEnrichmentDataPreview', () => {
        it('should return right fields values when getting preview with simple sourceColumn', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'simpleValue',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { _id: '1', simpleValue: 'plop' },
                            { _id: '2', simpleValue: 'plip' },
                            { _id: '3', simpleValue: 'ploup' },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining(['plop', 'plip', 'ploup']),
            );
        });
        it('should return right fields values when getting preview with array sourceColumn', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { _id: '1', arrayValue: ['plop'] },
                            { _id: '2', arrayValue: ['plip'] },
                            { _id: '3', arrayValue: ['ploup'] },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([['plop'], ['plip'], ['ploup']]),
            );
        });

        it('should return right fields values when getting preview with array sourceColumn stringified', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { _id: '1', arrayValue: JSON.stringify(['plop']) },
                            { _id: '2', arrayValue: JSON.stringify(['plip']) },
                            { _id: '3', arrayValue: JSON.stringify(['ploup']) },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([['plop'], ['plip'], ['ploup']]),
            );
        });
    });
});
