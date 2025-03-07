import { MongoClient } from 'mongodb';
import createDatasetModel from './dataset';

describe('Dataset Model', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let db;
    let connection;
    let datasetModel;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = connection.db();
        datasetModel = await createDatasetModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => db.dropDatabase());
    describe('deleteManyById', () => {
        let datasets;
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
        let datasets;
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
            const dumpedDatasets = await new Promise((resolve) => {
                const dumpedDatasets = [];
                stream.on('data', (data) => dumpedDatasets.push(data));
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
            const dumpedDatasets = await new Promise((resolve) => {
                const dumpedDatasets = [];
                stream.on('data', (data) => dumpedDatasets.push(data));
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
            const dumpedDatasets = await new Promise((resolve) => {
                const dumpedDatasets = [];
                stream.on('data', (data) => dumpedDatasets.push(data));
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
