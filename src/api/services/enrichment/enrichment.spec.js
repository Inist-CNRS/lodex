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
    });

    describe('getEnrichmentDataPreview', () => {
        it('with direct path, single value', async () => {
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

        it('with direct path, single value and subpath', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'objectValue',
                        subPath: 'subPath',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { _id: '1', objectValue: { subPath: 'plop' } },
                            { _id: '2', objectValue: { subPath: 'plip' } },
                            { _id: '3', objectValue: { subPath: 'ploup' } },
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
        it('with direct path, single value stringified and subpath', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'objectValue',
                        subPath: 'subPath',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            {
                                _id: '1',
                                objectValue: JSON.stringify({
                                    subPath: 'plop',
                                }),
                            },
                            {
                                _id: '2',
                                objectValue: JSON.stringify({
                                    subPath: 'plip',
                                }),
                            },
                            {
                                _id: '3',
                                objectValue: JSON.stringify({
                                    subPath: 'ploup',
                                }),
                            },
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
        it('with direct path, multiple values', async () => {
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
                            { _id: '1', arrayValue: ['plop', 'plup'] },
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
                expect.arrayContaining([['plop', 'plup'], ['plip'], ['ploup']]),
            );
        });

        it('with direct path, multiple values stringified', async () => {
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
                            {
                                _id: '1',
                                arrayValue: JSON.stringify(['plop', 'plup']),
                            },
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
                expect.arrayContaining([['plop', 'plup'], ['plip'], ['ploup']]),
            );
        });

        it('with direct path, multiple values and subpath', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                        subPath: 'subPath',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            {
                                _id: '1',
                                arrayValue: [
                                    { subPath: 'plop' },
                                    { subPath: 'plup' },
                                ],
                            },
                            {
                                _id: '2',
                                arrayValue: [{ subPath: 'plip' }],
                            },
                            {
                                _id: '3',
                                arrayValue: [{ subPath: 'ploup' }],
                            },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([['plop', 'plup'], ['plip'], ['ploup']]),
            );
        });
        // We skip that test because it's a very specific case where we want to get a subpath in an array that is stringified, that may not happen. If the dataset import a string, then, it's a string.
        it.skip('with direct path, multiple values and subpath stringified', async () => {
            // GIVEN
            const ctx = {
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                        subPath: 'subPath',
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            {
                                _id: '1',
                                arrayValue: JSON.stringify([
                                    { subPath: 'plop' },
                                    { subPath: 'plup' },
                                ]),
                            },
                            {
                                _id: '2',
                                arrayValue: JSON.stringify([
                                    { subPath: 'plip' },
                                ]),
                            },
                            {
                                _id: '3',
                                arrayValue: JSON.stringify([
                                    { subPath: 'ploup' },
                                ]),
                            },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([['plop', 'plup'], ['plip'], ['ploup']]),
            );
        });
    });
});
