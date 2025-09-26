import { getPrecomputedDataPreview } from './precomputed';

describe('precomputed', () => {
    describe('getPrecomputedDataPreview', () => {
        it('single value', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['simpleValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', simpleValue: 'plop' },
                            { uri: '2', simpleValue: 'plip' },
                            { uri: '3', simpleValue: 'ploup' },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { simpleValue: 'plop' },
                    { simpleValue: 'plip' },
                    { simpleValue: 'ploup' },
                ]),
            );
        });

        it('complex values', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['arrayValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', arrayValue: ['plop', 'plup'] },
                            { uri: '2', arrayValue: ['plip'] },
                            { uri: '3', arrayValue: ['ploup'] },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { arrayValue: ['plop', 'plup'] },
                    { arrayValue: ['plip'] },
                    { arrayValue: ['ploup'] },
                ]),
            );
        });

        it('multiple values', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumns: ['lol', 'simpleValue'],
                    },
                },
                dataset: {
                    getExcerpt: () => {
                        return [
                            { uri: '1', lol: 'a', simpleValue: 'plop' },
                            { uri: '2', lol: 'b', simpleValue: 'plip' },
                            { uri: '3', lol: 'c', simpleValue: 'ploup' },
                        ];
                    },
                },
            };

            // WHEN
            const results = await getPrecomputedDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { lol: 'a', simpleValue: 'plop' },
                    { lol: 'b', simpleValue: 'plip' },
                    { lol: 'c', simpleValue: 'ploup' },
                ]),
            );
        });
    });
});
