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
});
