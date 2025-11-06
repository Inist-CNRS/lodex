import { MongoClient, ObjectId } from 'mongodb';
import createPrecomputedModel, {
    type PrecomputedCollection,
} from './precomputed';

describe('PrecomputedModel', () => {
    const connectionStringURI = process.env.MONGO_URL as string;
    let connection: any;
    let db: any;
    let precomputedCollection: PrecomputedCollection;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {});
        db = connection.db();
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        precomputedCollection = await createPrecomputedModel(db);
    });
    afterEach(async () => {
        const collections = await db.collections();
        for (const collection of collections) {
            if (collection.collectionName.startsWith('pc_')) {
                await collection.drop();
            }
        }
    });
    describe('getResultColumns', () => {
        it('should return the correct columns for a given precomputed collection', async () => {
            const collectionId = new ObjectId().toString();
            const collection = db.collection(`pc_${collectionId}`);
            await collection.insertMany([
                { col1: 'value1', col2: 10, col3: true },
                { col1: 'value2', col2: 20, col3: false },
                { col4: { key: 'value' }, col2: 30 },
                { col5: [1, 2, 3] },
            ]);

            const columns =
                await precomputedCollection.getResultColumns(collectionId);

            expect(columns).toEqual([
                { key: 'col1', type: 'string' },
                { key: 'col2', type: 'number' },
                { key: 'col3', type: 'boolean' },
                { key: 'col4', type: 'object' },
                { key: 'col5', type: 'array' },
            ]);
        });

        it('should return an empty array for a non-existent collection', async () => {
            const columns = await precomputedCollection.getResultColumns(
                new ObjectId().toString(),
            );
            expect(columns).toEqual([]);
        });
    });
});
