import { TaskStatus } from '@lodex/common';
import { Collection, type Db, MongoClient, ObjectId } from 'mongodb';
import dataset from './dataset';
import type {
    DatasetService,
    DataSourceService,
    PrecomputedService,
} from './dataSource';
import createDataSourceService, { DATASET_ID } from './dataSource';
import precomputed from './precomputed';

const PRECOMPUTED_ID = '64b64c4f2f4d88b6f0e4d1a1';
describe('dataSource', () => {
    let connection: MongoClient;
    let db: Db;

    let datasetService: DatasetService;
    let precomputedService: PrecomputedService;
    let dataSource: DataSourceService;

    let datasetCollection: Collection;
    let precomputedCollection: Collection;
    let precomputedDataCollection: Collection;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGODB_URI_FOR_TESTS!);
        db = connection.db();

        datasetService = await dataset(db);
        precomputedService = await precomputed(db);
        dataSource = createDataSourceService(
            datasetService,
            precomputedService,
        );

        datasetCollection = db.collection('dataset');
        precomputedCollection = db.collection('precomputed');
        precomputedDataCollection = db.collection(`pc_${PRECOMPUTED_ID}`);
    });

    afterAll(async () => {
        await db.dropDatabase();
        await connection.close();
    });

    describe('getDataSources', () => {
        beforeEach(async () => {
            await Promise.all([
                datasetCollection.deleteMany({}),
                precomputedCollection.deleteMany({}),
                precomputedDataCollection.deleteMany({}),
            ]);

            await Promise.all([
                datasetCollection.insertMany([
                    {
                        uri: 'doi://ABC',
                        title: 'Item 1',
                        nested: { info: 'Info 1' },
                    },
                    {
                        uri: 'doi://DEF',
                        title: 'Item 2',
                        nested: { info: 'Info 2' },
                    },
                ]),
                precomputedCollection.insertMany([
                    {
                        _id: new ObjectId(PRECOMPUTED_ID),
                        name: 'Precomputed 1',
                        status: TaskStatus.FINISHED,
                    },
                ]),
                precomputedDataCollection.insertMany([
                    { id: 'abc', value: { name: 'A' } },
                    { id: 'def', value: { name: 'B' } },
                ]),
            ]);
        });

        it('should list data sources with their columns', async () => {
            await expect(dataSource.getDataSources()).resolves.toStrictEqual([
                {
                    id: 'dataset',
                    name: 'dataset',
                    columns: [
                        {
                            name: 'nested',
                            subPaths: ['info'],
                        },
                        {
                            name: 'title',
                            subPaths: [],
                        },
                        {
                            name: 'uri',
                            subPaths: [],
                        },
                    ],
                    status: TaskStatus.FINISHED,
                    isEmpty: false,
                },
                {
                    id: PRECOMPUTED_ID,
                    name: 'Precomputed 1',
                    status: TaskStatus.FINISHED,
                    columns: [
                        {
                            name: 'id',
                            subPaths: [],
                        },
                        {
                            name: 'value',
                            subPaths: ['name'],
                        },
                    ],
                    isEmpty: false,
                },
            ]);
        });

        describe('removeAttribute', () => {
            it('should remove the attribute from dataset', async () => {
                await dataSource.removeAttribute(DATASET_ID, 'nested');

                await expect(
                    datasetCollection.findOne({ uri: 'doi://ABC' }),
                ).resolves.toStrictEqual({
                    _id: expect.any(ObjectId),
                    uri: 'doi://ABC',
                    title: 'Item 1',
                });
            });

            it('should remove the attribute from precomputed data source', async () => {
                await dataSource.removeAttribute(PRECOMPUTED_ID, 'value');

                await expect(
                    precomputedDataCollection.findOne({ id: 'abc' }),
                ).resolves.toStrictEqual({
                    _id: expect.any(ObjectId),
                    id: 'abc',
                });
            });
        });
    });
});
