import { MongoClient } from 'mongodb';
import createDatasetModel from './dataset';

describe('Dataset Model', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let db: any;
    let connection: any;
    let datasetModel: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        datasetModel = await createDatasetModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => db.dropDatabase());
    describe('deleteManyById', () => {
        let datasets: any;
        beforeEach(async () => {
            await db
                .collection('dataset')
                .insertMany([
                    { name: '1' },
                    { name: '2' },
                    { name: '3' },
                    { name: '4' },
                    { name: '5' },
                ]);

            datasets = await db.collection('dataset').find().toArray();
        });
        it('should delete all dataset with given ids', async () => {
            const ids = [
                datasets[1]._id.toString(),
                datasets[3]._id.toString(),
            ];
            const result = await datasetModel.deleteManyById(ids);
            expect(result).toStrictEqual({
                acknowledged: true,
                deletedCount: 2,
            });

            const remainingDatasets = await db
                .collection('dataset')
                .find()
                .toArray();
            expect(remainingDatasets).toStrictEqual([
                datasets[0],
                datasets[2],
                datasets[4],
            ]);
        });
    });

    describe('removeAttribute', () => {
        let datasets: any;
        beforeEach(async () => {
            await db.collection('dataset').insertMany([
                { name: '1', enrichedColumn: 'enriched1' },
                { name: '2', enrichedColumn: 'enriched2' },
                { name: '3', enrichedColumn: 'enriched3' },
                { name: '4', enrichedColumn: 'enriched4' },
                { name: '5', enrichedColumn: 'enriched5' },
            ]);

            datasets = await db.collection('dataset').find().toArray();
        });

        it('should remove given attribute from all dataset', async () => {
            await datasetModel.removeAttribute('enrichedColumn');

            const remainingDatasets = await db
                .collection('dataset')
                .find()
                .toArray();
            expect(remainingDatasets).toStrictEqual([
                { _id: datasets[0]._id, name: '1' },
                { _id: datasets[1]._id, name: '2' },
                { _id: datasets[2]._id, name: '3' },
                { _id: datasets[3]._id, name: '4' },
                { _id: datasets[4]._id, name: '5' },
            ]);
        });
    });

    describe('getColumnsWithSubPaths', () => {
        it.each([
            {
                description: 'object fields with nested properties',
                documents: [
                    { uri: 'uri1', value: { name: 'X', age: 30 } },
                    { uri: 'uri2', value: { name: 'Y', city: 'Paris' } },
                    { uri: 'uri3', simple: 'text' },
                ],
                expected: [
                    { name: 'simple', subPaths: [] },
                    { name: 'uri', subPaths: [] },
                    { name: 'value', subPaths: ['age', 'city', 'name'] },
                ],
            },
            {
                description: 'primitive fields only',
                documents: [
                    { col1: 'value1', col2: 10, col3: true },
                    { col1: 'value2', col2: 20, col3: false },
                ],
                expected: [
                    { name: 'col1', subPaths: [] },
                    { name: 'col2', subPaths: [] },
                    { name: 'col3', subPaths: [] },
                ],
            },
            {
                description: 'multiple nested objects',
                documents: [
                    {
                        author: { name: 'John', email: 'john@example.com' },
                        metadata: {
                            created: '2025-01-01',
                            updated: '2025-01-02',
                        },
                        title: 'Document',
                    },
                ],
                expected: [
                    { name: 'author', subPaths: ['email', 'name'] },
                    { name: 'metadata', subPaths: ['created', 'updated'] },
                    { name: 'title', subPaths: [] },
                ],
            },
            {
                description: 'arrays (should not extract subPaths)',
                documents: [
                    {
                        tags: ['tag1', 'tag2'],
                        items: [{ id: 1 }, { id: 2 }],
                    },
                ],
                expected: [
                    { name: 'items', subPaths: [] },
                    { name: 'tags', subPaths: [] },
                ],
            },
            {
                description: 'mixed types across documents',
                documents: [
                    { field1: { nested: 'value' } },
                    { field1: 'string' },
                    { field1: 123 },
                ],
                expected: [{ name: 'field1', subPaths: ['nested'] }],
            },
            {
                description: 'deeply nested objects (only first level)',
                documents: [
                    {
                        data: {
                            level1: {
                                level2: {
                                    level3: 'deep',
                                },
                            },
                            simple: 'value',
                        },
                    },
                ],
                expected: [{ name: 'data', subPaths: ['level1', 'simple'] }],
            },
        ])(
            'should extract columns with subPaths for $description',
            async ({ documents, expected }) => {
                await db.collection('dataset').insertMany(documents);

                const columns = await datasetModel.getColumnsWithSubPaths();

                expect(columns).toEqual(expected);
            },
        );

        it('should return an empty array for an empty collection', async () => {
            const columns = await datasetModel.getColumnsWithSubPaths();
            expect(columns).toEqual([]);
        });

        it('should exclude _id field', async () => {
            await db.collection('dataset').insertMany([{ col1: 'value1' }]);

            const columns = await datasetModel.getColumnsWithSubPaths();

            expect(columns).toEqual([{ name: 'col1', subPaths: [] }]);
            expect(columns.find((c: any) => c.name === '_id')).toBeUndefined();
        });
    });

    describe('dumpAsJsonLStream', () => {
        it('should dump all dataset as json stream omitting _id', async () => {
            await db.collection('dataset').insertMany([
                { name: 'superman', power: 'fly', realName: 'Clark Kent' },
                { name: 'batman', power: 'none', realName: 'Bruce Wayne' },
                {
                    name: 'spiderman',
                    power: 'spider',
                    realName: 'Peter Parker',
                },
                { name: 'ironman', power: 'armor', realName: 'Tony Stark' },
                { name: 'hulk', power: 'anger', realName: 'Bruce Banner' },
                { name: 'thor', power: 'hammer', realName: 'Thor' },
            ]);

            const stream = await datasetModel.dumpAsJsonLStream();
            const dumpedDatasets = await new Promise((resolve: any) => {
                const dumpedDatasets: any = [];
                stream.on('data', (data: any) => dumpedDatasets.push(data));
                stream.on('end', () => resolve(dumpedDatasets));
            });

            expect(dumpedDatasets).toStrictEqual([
                '{"name":"superman","power":"fly","realName":"Clark Kent"}\n',
                '{"name":"batman","power":"none","realName":"Bruce Wayne"}\n',
                '{"name":"spiderman","power":"spider","realName":"Peter Parker"}\n',
                '{"name":"ironman","power":"armor","realName":"Tony Stark"}\n',
                '{"name":"hulk","power":"anger","realName":"Bruce Banner"}\n',
                '{"name":"thor","power":"hammer","realName":"Thor"}\n',
            ]);
        });
        it('should dump given fields only from dataset as json stream omitting _id', async () => {
            await db.collection('dataset').insertMany([
                { name: 'superman', power: 'fly', realName: 'Clark Kent' },
                { name: 'batman', power: 'none', realName: 'Bruce Wayne' },
                {
                    name: 'spiderman',
                    power: 'spider',
                    realName: 'Peter Parker',
                },
                { name: 'ironman', power: 'armor', realName: 'Tony Stark' },
                { name: 'hulk', power: 'anger', realName: 'Bruce Banner' },
                { name: 'thor', power: 'hammer', realName: 'Thor' },
            ]);

            const stream = await datasetModel.dumpAsJsonLStream(['name']);
            const dumpedDatasets = await new Promise((resolve: any) => {
                const dumpedDatasets: any = [];
                stream.on('data', (data: any) => dumpedDatasets.push(data));
                stream.on('end', () => resolve(dumpedDatasets));
            });

            expect(dumpedDatasets).toStrictEqual([
                '{"name":"superman"}\n',
                '{"name":"batman"}\n',
                '{"name":"spiderman"}\n',
                '{"name":"ironman"}\n',
                '{"name":"hulk"}\n',
                '{"name":"thor"}\n',
            ]);
        });

        it('should dump all dataset empty object if requested field is not in any document', async () => {
            await db.collection('dataset').insertMany([
                { name: 'superman', power: 'fly', realName: 'Clark Kent' },
                { name: 'batman', power: 'none', realName: 'Bruce Wayne' },
                {
                    name: 'spiderman',
                    power: 'spider',
                    realName: 'Peter Parker',
                },
                { name: 'ironman', power: 'armor', realName: 'Tony Stark' },
                { name: 'hulk', power: 'anger', realName: 'Bruce Banner' },
                { name: 'thor', power: 'hammer', realName: 'Thor' },
            ]);

            const stream = await datasetModel.dumpAsJsonLStream(['weakPoint']);
            const dumpedDatasets = await new Promise((resolve: any) => {
                const dumpedDatasets: any = [];
                stream.on('data', (data: any) => dumpedDatasets.push(data));
                stream.on('end', () => resolve(dumpedDatasets));
            });

            expect(dumpedDatasets).toStrictEqual([
                '{}\n',
                '{}\n',
                '{}\n',
                '{}\n',
                '{}\n',
                '{}\n',
            ]);
        });
    });
});
