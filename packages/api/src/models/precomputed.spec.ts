import { MongoClient, ObjectId } from 'mongodb';
import createPrecomputedModel, {
    type PrecomputedCollection,
} from './precomputed';

describe('PrecomputedModel', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
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

    describe('getStreamOfResult', () => {
        it('should return a stream of documents without _id field', async () => {
            const collectionId = new ObjectId().toString();
            const collection = db.collection(`pc_${collectionId}`);
            const docs = [
                { id: 1, value: 'A', lodexStamp: 'stamp1', enrichedField: 41 },
                { id: 2, value: 'B', lodexStamp: 'stamp2', enrichedField: 42 },
                { id: 3, value: 'C', lodexStamp: 'stamp3', enrichedField: 43 },
            ];
            await collection.insertMany(docs);

            const stream =
                precomputedCollection.getStreamOfResult(collectionId);

            const results: any[] = [];
            for await (const doc of stream) {
                results.push(doc);
            }

            expect(results).toEqual([
                { id: 1, lodexStamp: 'stamp1', value: 'A', enrichedField: 41 },
                { id: 2, lodexStamp: 'stamp2', value: 'B', enrichedField: 42 },
                { id: 3, lodexStamp: 'stamp3', value: 'C', enrichedField: 43 },
            ]);
        });
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

    describe('getColumnsWithSubPaths', () => {
        it.each([
            {
                description: 'object fields with nested properties',
                documents: [
                    { id: 1, value: { name: 'X', age: 30 } },
                    { id: 2, value: { name: 'Y', city: 'Paris' } },
                    { id: 3, simple: 'text' },
                ],
                expected: [
                    { name: 'id', subPaths: [] },
                    { name: 'simple', subPaths: [] },
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
                    { tags: ['tag1', 'tag2'], items: [{ id: 1 }, { id: 2 }] },
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
                const collectionId = new ObjectId().toString();
                const collection = db.collection(`pc_${collectionId}`);
                await collection.insertMany(documents);

                const columns =
                    await precomputedCollection.getColumnsWithSubPaths(
                        collectionId,
                    );

                expect(columns).toEqual(expected);
            },
        );

        it('should return an empty array for a non-existent collection', async () => {
            const columns = await precomputedCollection.getColumnsWithSubPaths(
                new ObjectId().toString(),
            );
            expect(columns).toEqual([]);
        });

        it('should exclude _id field', async () => {
            const collectionId = new ObjectId().toString();
            const collection = db.collection(`pc_${collectionId}`);
            await collection.insertMany([{ col1: 'value1' }]);

            const columns =
                await precomputedCollection.getColumnsWithSubPaths(
                    collectionId,
                );

            expect(columns).toEqual([{ name: 'col1', subPaths: [] }]);
            expect(columns.find((c) => c.name === '_id')).toBeUndefined();
        });
    });

    describe('resultFindLimitFromSkip', () => {
        const collectionId = new ObjectId().toString();
        const documents = Array.from({ length: 10 }, (_, i) => ({
            _id: new ObjectId(),
            col1: `value${i}`,
            col2: i,
            isEven: i % 2 === 0,
        }));
        beforeEach(async () => {
            const collection = db.collection(`pc_${collectionId}`);
            await collection.insertMany(documents);
        });
        it('should return all documents', async () => {
            await expect(
                precomputedCollection.resultFindLimitFromSkip({
                    limit: 10,
                    skip: 0,
                    precomputedId: collectionId,
                    sortDir: 'ASC',
                    sortBy: 'col1',
                }),
            ).resolves.toStrictEqual(documents);
        });

        it('should allow to sort documents', async () => {
            await expect(
                precomputedCollection.resultFindLimitFromSkip({
                    limit: 10,
                    skip: 0,
                    precomputedId: collectionId,
                    sortDir: 'DESC',
                    sortBy: 'col1',
                }),
            ).resolves.toStrictEqual([...documents].reverse());
        });

        it('should return limited documents with skip and limit', async () => {
            await expect(
                precomputedCollection.resultFindLimitFromSkip({
                    limit: 3,
                    skip: 4,
                    precomputedId: collectionId,
                    sortDir: 'ASC',
                    sortBy: 'col1',
                }),
            ).resolves.toStrictEqual(documents.slice(4, 7));
        });

        it('should allow to filter documents', async () => {
            await expect(
                precomputedCollection.resultFindLimitFromSkip<{
                    _id: ObjectId;
                    col1: string;
                    col2: number;
                    isEven: boolean;
                }>({
                    limit: 10,
                    skip: 0,
                    precomputedId: collectionId,
                    sortDir: 'ASC',
                    sortBy: 'col1',
                    query: {
                        isEven: {
                            $eq: true,
                        },
                    },
                }),
            ).resolves.toStrictEqual(documents.filter((doc) => doc.isEven));
            await expect(
                precomputedCollection.resultFindLimitFromSkip<{
                    _id: ObjectId;
                    col1: string;
                    col2: number;
                    isEven: boolean;
                }>({
                    limit: 10,
                    skip: 0,
                    precomputedId: collectionId,
                    sortDir: 'ASC',
                    sortBy: 'col1',
                    query: {
                        isEven: {
                            $eq: false,
                        },
                    },
                }),
            ).resolves.toStrictEqual(documents.filter((doc) => !doc.isEven));
        });
    });

    describe('updateResult', () => {
        const collectionId = new ObjectId().toString();
        const documents = Array.from({ length: 5 }, (_, i) => ({
            _id: new ObjectId(),
            col1: `value${i}`,
            col2: i,
        }));
        beforeEach(async () => {
            const collection = db.collection(`pc_${collectionId}`);
            await collection.insertMany(documents);
        });

        it('should update and return the updated document', async () => {
            const docToUpdate = documents[2];
            const updatedData = { col1: 'updatedValue', col2: 42 };

            const updatedDoc = await precomputedCollection.updateResult({
                precomputedId: collectionId,
                id: docToUpdate._id.toString(),
                data: updatedData,
            });

            expect(updatedDoc).toEqual({
                _id: docToUpdate._id,
                ...updatedData,
            });

            const collection = db.collection(`pc_${collectionId}`);
            const dbDoc = await collection.findOne({ _id: docToUpdate._id });
            expect(dbDoc).toEqual({
                _id: docToUpdate._id,
                ...updatedData,
            });
        });

        it('should return null when trying to update a non-existent document', async () => {
            const updatedDoc = await precomputedCollection.updateResult({
                precomputedId: collectionId,
                id: new ObjectId().toString(),
                data: { col1: 'newValue', col2: 99 },
            });

            expect(updatedDoc).toBeNull();
        });

        it('should return null when trying to update a document on an unexisting collection', async () => {
            const collectionId = new ObjectId().toString();
            const updatedDoc = await precomputedCollection.updateResult({
                precomputedId: collectionId,
                id: new ObjectId().toString(),
                data: { col1: 'newValue', col2: 99 },
            });

            expect(updatedDoc).toBeNull();
        });
    });

    describe('insertManyResults', () => {
        it('should insert multiple documents into the precomputed collection', async () => {
            const precomputedId = new ObjectId().toString();
            const precomputedResults = [
                { col1: 'value1', col2: 10 },
                { col1: 'value2', col2: 20 },
                { col1: 'value3', col2: 30 },
            ];

            await precomputedCollection.insertManyResults(
                precomputedId,
                precomputedResults,
            );

            const insertedDocs = await db
                .collection(`pc_${precomputedId}`)
                .find({})
                .sort({ col1: 1 })
                .toArray();

            expect(insertedDocs).toEqual(precomputedResults);
        });
    });

    describe('deleteManyResults', () => {
        it('should delete the precomputed collection from the database', async () => {
            const precomputedId = new ObjectId().toString();
            const collection = db.collection(`pc_${precomputedId}`);
            await collection.insertMany([
                { col1: 'value1', col2: 10 },
                { col1: 'value2', col2: 20 },
            ]);

            await precomputedCollection.deleteManyResults({ precomputedId });

            const precomputedResults = await collection
                .find({})
                .sort({ col1: 1 })
                .toArray();

            expect(precomputedResults).toEqual([]);
        });

        it('should do nothing if the collection does not exist', async () => {
            const precomputedId = new ObjectId().toString();

            await expect(
                precomputedCollection.deleteManyResults({ precomputedId }),
            ).resolves.not.toThrow();
        });
    });
});
