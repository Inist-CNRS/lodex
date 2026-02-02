import { Db, MongoClient, ObjectId } from 'mongodb';
import createEnrichmentModel, { type Enrichment } from './enrichment';

describe('enrichment model', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let connection: MongoClient;
    let db: Db;
    let enrichmentModel: Awaited<ReturnType<typeof createEnrichmentModel>>;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        enrichmentModel = await createEnrichmentModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await db.collection('enrichment').deleteMany({});
    });

    describe('create', () => {
        it('should have unique name for a dataSource', async () => {
            const enrichment: Enrichment = {
                name: 'test_enrichment',
                dataSource: 'dataset',
                jobId: new ObjectId(),
                status: 'PENDING',
                parameters: {},
                createdAt: new Date(),
            };

            await enrichmentModel.create({ ...enrichment });

            await expect(
                enrichmentModel.create({ ...enrichment }),
            ).rejects.toThrow();
        });

        it('should support same name for different dataSources', async () => {
            const enrichment: Enrichment = {
                name: 'test_enrichment',
                dataSource: 'dataset',
                jobId: new ObjectId(),
                status: 'PENDING',
                parameters: {},
                createdAt: new Date(),
            };

            await enrichmentModel.create({ ...enrichment });

            await expect(
                enrichmentModel.create({
                    ...enrichment,
                    dataSource: 'another',
                }),
            ).resolves.toMatchObject({
                ...enrichment,
                dataSource: 'another',
            });
        });
    });
});
