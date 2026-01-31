import * as fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import progress from '../progress';
import {
    getEnrichmentDataPreview,
    getEnrichmentRuleModel,
    getSourceError,
    processEnrichment,
} from './enrichment';
// @ts-expect-error TS7016
import { disableFusible } from '@ezs/core/fusible';
import { CancelWorkerError } from '../../workers';

const waitFor = async (
    fn: () => Promise<boolean> | boolean,
    {
        checkEvery = 100,
        timeout = 10000,
    }: {
        checkEvery?: number;
        timeout?: number;
    } = {},
) => {
    expect(
        await (async () => {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                await new Promise((resolve) => setTimeout(resolve, checkEvery));

                if (await fn()) {
                    return true;
                }
            }
            return false;
        })(),
    ).toBeTruthy();
};

function mockDb(data: unknown[]) {
    return {
        db: {
            collection: jest.fn().mockImplementation((collectionName) => ({
                collectionName,
                idField: '_id',
                count: () => Promise.resolve(1),
                find: () => ({
                    limit: () => ({
                        toArray: () => Promise.resolve(data),
                    }),
                }),
            })),
        },
    };
}

describe('enrichment', () => {
    describe('getEnrichmentRuleModel', () => {
        it('should get rule for single value and direct path', async () => {
            const sourceData = 'single value';
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: null,
                advancedMode: false,
                webServiceUrl: 'https://lodex.fr',
            };

            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
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
                webServiceUrl: 'https://lodex.fr',
            };

            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
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
                webServiceUrl: 'https://lodex.fr',
            };

            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/URLConnect)/i);
            expect(result).toMatch(/(expand\/exploding)/i);
            expect(result).toMatch(/(expand\/expand)/i);
        });

        it('should get rule for multiple values and sub path', async () => {
            const sourceData = [{ sub: ['data', 'otherData'] }];
            const enrichment = {
                name: 'Test',
                sourceColumn: 'source',
                subPath: 'sub',
                advancedMode: false,
                webServiceUrl: 'https://lodex.fr',
            };

            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            const result = getEnrichmentRuleModel(sourceData, enrichment);
            expect(result).toMatch(/(expand\/exploding)/i);
            expect(result).toMatch(/(expand\/expand\/URLConnect)/i);
        });

        it('should get an error for missing sourceColumn', async () => {
            const sourceData = [{ sub: ['data', 'otherData'] }];
            const enrichment = {
                name: 'Test',
                advancedMode: false,
                webServiceUrl: 'https://lodex.fr',
            };

            expect(() =>
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                getEnrichmentRuleModel(sourceData, enrichment),
            ).toThrow('Missing source column parameter');
        });
    });

    describe('getEnrichmentDataPreview', () => {
        it('with direct path, single value', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'simpleValue',
                    },
                },
                ...mockDb([
                    { uri: '1', simpleValue: 'plop' },
                    { uri: '2', simpleValue: 'plip' },
                    { uri: '3', simpleValue: 'ploup' },
                ]),
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
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'objectValue',
                        subPath: 'subPath',
                    },
                },
                ...mockDb([
                    {
                        uri: '1',
                        objectValue: {
                            subPath: 'plop',
                        },
                    },
                    {
                        uri: '2',
                        objectValue: {
                            subPath: 'plip',
                        },
                    },
                    {
                        uri: '3',
                        objectValue: {
                            subPath: 'ploup',
                        },
                    },
                ]),
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    { subPath: 'plop' },
                    { subPath: 'plip' },
                    { subPath: 'ploup' },
                ]),
            );
        });
        it('with direct path, single value stringified and subpath', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'objectValue',
                        subPath: 'subPath',
                    },
                },
                ...mockDb([
                    {
                        uri: '1',
                        objectValue: JSON.stringify({
                            subPath: 'plop',
                        }),
                    },
                    {
                        uri: '2',
                        objectValue: JSON.stringify({
                            subPath: 'plip',
                        }),
                    },
                    {
                        uri: '3',
                        objectValue: JSON.stringify({
                            subPath: 'ploup',
                        }),
                    },
                ]),
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    '{"subPath":"plop"}',
                    '{"subPath":"plip"}',
                    '{"subPath":"ploup"}',
                ]),
            );
        });
        it('with direct path, multiple values', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                    },
                },
                ...mockDb([
                    {
                        uri: '1',
                        arrayValue: ['plop', 'plup'],
                    },
                    { uri: '2', arrayValue: ['plip'] },
                    { uri: '3', arrayValue: ['ploup'] },
                ]),
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
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                    },
                },
                ...mockDb([
                    {
                        uri: '1',
                        arrayValue: JSON.stringify(['plop', 'plup']),
                    },
                    {
                        uri: '2',
                        arrayValue: JSON.stringify(['plip']),
                    },
                    {
                        uri: '3',
                        arrayValue: JSON.stringify(['ploup']),
                    },
                ]),
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
                configTenant: {},
                request: {
                    body: {
                        sourceColumn: 'arrayValue',
                        subPath: 'subPath',
                    },
                },
                ...mockDb([
                    {
                        uri: '1',
                        arrayValue: [{ subPath: 'plop' }, { subPath: 'plup' }],
                    },
                    {
                        uri: '2',
                        arrayValue: [{ subPath: 'plip' }],
                    },
                    {
                        uri: '3',
                        arrayValue: [{ subPath: 'ploup' }],
                    },
                ]),
            };

            // WHEN
            const results = await getEnrichmentDataPreview(ctx);

            // THEN
            expect(results).toEqual(
                expect.arrayContaining([
                    [{ subPath: 'plop' }, { subPath: 'plup' }],
                    [{ subPath: 'plop' }, { subPath: 'plup' }],
                    [{ subPath: 'plip' }],
                    [{ subPath: 'plip' }],
                    [{ subPath: 'ploup' }],
                    [{ subPath: 'ploup' }],
                ]),
            );
        });
        // We skip that test because it's a very specific case where we want to get a subpath in an array that is stringified, that may not happen. If the dataset import a string, then, it's a string.
        it.skip('with direct path, multiple values and subpath stringified', async () => {
            // GIVEN
            const ctx = {
                configTenant: {},
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
                                uri: '1',
                                arrayValue: JSON.stringify([
                                    { subPath: 'plop' },
                                    { subPath: 'plup' },
                                ]),
                            },
                            {
                                uri: '2',
                                arrayValue: JSON.stringify([
                                    { subPath: 'plip' },
                                ]),
                            },
                            {
                                uri: '3',
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

    describe('processEnrichment', () => {
        const connectionStringURI = process.env.MONGO_URL;
        let db: any;
        let connection: any;
        let dbName: string;

        beforeAll(async () => {
            connection = await MongoClient.connect(connectionStringURI!);
            db = connection.db();
            dbName = connection.s.options.dbName;
        });

        afterAll(async () => {
            await connection.close();
        });

        afterEach(async () => db.dropDatabase());

        it('should throw a CancelWorkerError when the job is canceled', async () => {
            // Insert a big enough dataset to have time to cancel the job before the end of the enrichment.
            await db.collection('dataset').insertMany(
                [...Array(100000)].map((_, i) => ({
                    testField: `name${i}`,
                })),
            );

            // ezs cannot be mock in the same way, one day this test will have to be rewritten differently
            progress.initialize(dbName);

            let jobFusible: any;

            // GIVEN
            const ezsRule = fs
                .readFileSync(
                    path.resolve(__dirname, './directPathSingleValue.txt'),
                )
                .toString()
                .replace(/\[\[SOURCE COLUMN\]\]/g, 'name')
                .replace(/\[\[BATCH SIZE\]\]/g, '10')
                .replace(/\[\[WEB SERVICE TIMEOUT\]\]/g, '10000')
                .replace(
                    '[[WEB SERVICE URL]]',
                    'http://a-fake-url.to.raise.an.error',
                );
            const enrichment = {
                name: 'test',
                rule: ezsRule,
            };
            const ctx = {
                configTenant: {},
                tenant: dbName,
                job: {
                    id: 1,
                    log: jest.fn(),
                    isActive: jest.fn().mockReturnValue(true),
                    data: {
                        tenant: dbName,
                    },
                    update: jest.fn().mockImplementation(({ fusible }: any) => {
                        jobFusible = fusible;
                        return Promise.resolve();
                    }),
                },
                enrichment: {
                    updateOne: jest.fn(),
                    updateStatus: jest.fn(),
                },
                ...mockDb([
                    {
                        uri: '1',
                        arrayValue: [{ subPath: 'plop' }, { subPath: 'plup' }],
                    },
                ]),
            };

            // WHEN
            let catchedError: any;
            processEnrichment(enrichment, false, ctx).catch(
                (error) => (catchedError = error),
            );

            // Wait for the fusible to be created and enabled.
            await waitFor(() => !!jobFusible);
            await disableFusible(jobFusible);

            // Wait for an error to be thrown.
            await waitFor(() => !!catchedError);

            // THEN
            expect(catchedError).toBeInstanceOf(CancelWorkerError);
        }, 60000);

        it.skip('should log error when ws is out', async () => {
            // ezs cannot be mock in the same way, one day this test will have to be rewritten differently
            progress.initialize('lodex_test');

            // GIVEN
            const ezsRule = fs
                .readFileSync(
                    path.resolve(__dirname, './directPathSingleValue.txt'),
                )
                .toString()
                .replace(/\[\[SOURCE COLUMN\]\]/g, 'name')
                .replace(
                    '[[WEB SERVICE URL]]',
                    'http://a-fake-url.to.raise.an.error',
                )
                .replace('retries = 5', 'retries = 1');
            const enrichment = {
                rule: ezsRule,
            };
            const ctx = {
                configTenant: {},
                tenant: 'lodex_test',
                job: {
                    id: 1,
                    log: jest.fn(),
                    isActive: jest.fn().mockReturnValue(true),
                    data: {
                        tenant: 'lodex_test',
                    },
                },
                enrichment: {
                    updateOne: jest.fn(),
                    updateStatus: jest.fn(),
                },
                dataset: {
                    updateOne: jest.fn(),
                    count: jest.fn().mockReturnValue(3),
                    find: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockReturnValue({
                                toArray: jest.fn().mockReturnValue([
                                    {
                                        _id: new ObjectId(),
                                        uri: '1',
                                        name: 'plop',
                                    },
                                    {
                                        _id: new ObjectId(),
                                        uri: '2',
                                        name: 'plip',
                                    },
                                    {
                                        _id: new ObjectId(),
                                        uri: '3',
                                        name: 'ploup',
                                    },
                                ]),
                            }),
                        }),
                    }),
                },
            };

            // WHEN
            await processEnrichment(enrichment, false, ctx);

            // THEN
            expect(ctx.job.log).toHaveBeenCalledTimes(7);
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                4,
                expect.stringContaining(
                    `request to http://a-fake-url.to.raise.an.error/ failed, reason: getaddrinfo ENOTFOUND a-fake-url.to.raise.an.error`,
                ),
            );
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                5,
                expect.stringContaining(
                    `request to http://a-fake-url.to.raise.an.error/ failed, reason: getaddrinfo ENOTFOUND a-fake-url.to.raise.an.error`,
                ),
            );
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                6,
                expect.stringContaining(
                    `request to http://a-fake-url.to.raise.an.error/ failed, reason: getaddrinfo ENOTFOUND a-fake-url.to.raise.an.error`,
                ),
            );
        }, 60000);
        it.skip('should log error for 2nd line when ws errored for this line', async () => {
            // GIVEN
            const ezsRule = `
                [validate]
                path=value.valid
                rule=required
                [transit]
            `;
            const enrichment = {
                rule: ezsRule,
            };
            const ctx = {
                configTenant: {},
                job: {
                    id: 1,
                    log: jest.fn(),
                    isActive: jest.fn().mockReturnValue(true),
                },
                enrichment: {
                    updateOne: jest.fn(),
                },
                dataset: {
                    updateOne: jest.fn(),
                    count: jest.fn().mockReturnValue(3),
                    find: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockReturnValue({
                                toArray: jest.fn().mockReturnValue([
                                    {
                                        _id: new ObjectId(),
                                        uri: '1',
                                        name: 'plop',
                                        valid: true,
                                    },
                                    {
                                        _id: new ObjectId(),
                                        uri: '2',
                                        name: 'plip',
                                        invalid: true,
                                    },
                                    {
                                        _id: new ObjectId(),
                                        uri: '3',
                                        name: 'ploup',
                                        valid: true,
                                    },
                                ]),
                            }),
                        }),
                    }),
                },
            };

            // WHEN
            await processEnrichment(enrichment, false, ctx);

            // THEN
            expect(ctx.job.log).toHaveBeenCalledTimes(7);
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                4,
                expect.stringContaining(`Finished enriching #1`),
            );
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                5,
                expect.stringContaining(
                    `Error enriching #2: [Error] { 'value.valid': [ 'The value.valid field is required.' ] }`,
                ),
            );
            expect(ctx.job.log).toHaveBeenNthCalledWith(
                6,
                expect.stringContaining(`Finished enriching #3`),
            );
        });
    });
});

describe('getSourceError', () => {
    it('should return the deepest sourceError object', () => {
        // GIVEN
        const error = {
            sourceError: {
                sourceError: {
                    sourceError: { message: 'Source error' },
                    sourceChunk: 'This chunk',
                },
                sourceChunk: 'not that',
            },
            sourceChunk: 'not this',
        };

        // WHEN
        const deepestSourceError = getSourceError(error);

        // THEN
        expect(deepestSourceError.sourceError).toEqual({
            message: 'Source error',
        });
        expect(deepestSourceError.sourceChunk).toBe('This chunk');
    });
});
