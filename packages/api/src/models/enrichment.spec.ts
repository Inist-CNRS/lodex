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
    describe('updateStatusOfJob', () => {
        const insert = async (jobId?: string) => {
            const enrichment = await enrichmentModel.create({
                name: 'test_enrichment',
                dataSource: 'dataset',
                status: 'PENDING',
                parameters: {},
                createdAt: new Date(),
                ...(jobId ? { jobId } : {}),
            });
            return enrichment!._id.toString();
        };

        it('should write the status of the current job', async () => {
            const id = await insert('current');

            await enrichmentModel.updateStatusOfJob(id, 'current', 'ERROR', {
                message: 'boom',
            });

            await expect(
                enrichmentModel.findOneById(id),
            ).resolves.toMatchObject({
                status: 'ERROR',
                message: 'boom',
                jobId: 'current',
            });
        });

        it('should not write the status of a superseded job', async () => {
            const id = await insert('current');

            await enrichmentModel.updateStatusOfJob(id, 'superseded', 'ERROR', {
                message: 'boom',
            });

            const enrichment = await enrichmentModel.findOneById(id);
            expect(enrichment).toMatchObject({
                status: 'PENDING',
                jobId: 'current',
            });
            expect(enrichment?.message).toBeUndefined();
        });

        it('should write the status of an enrichment without jobId', async () => {
            const id = await insert();

            await enrichmentModel.updateStatusOfJob(id, 'any', 'IN_PROGRESS');

            await expect(
                enrichmentModel.findOneById(id),
            ).resolves.toMatchObject({ status: 'IN_PROGRESS' });
        });
    });
});
