import { MongoClient } from 'mongodb';
import createSiteModelModel, { type SiteModelCollection } from './siteModel';

describe('siteModel model', () => {
    let connection: MongoClient;
    let siteModel: SiteModelCollection;

    beforeAll(async () => {
        connection = await MongoClient.connect(
            process.env.MONGODB_URI_FOR_TESTS as string,
            {},
        );
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        siteModel = await createSiteModelModel(connection.db());
        await siteModel.deleteMany({});
    });

    afterEach(async () => {
        await siteModel.deleteMany({});
    });

    it('returns null when no model is remembered', async () => {
        expect(await siteModel.findCurrent()).toBeNull();
    });

    it('keeps a single document: the last remembered model', async () => {
        await siteModel.remember('a');
        await siteModel.remember('b');

        expect(await siteModel.findCurrent()).toMatchObject({ modelId: 'b' });
        expect(await siteModel.countDocuments()).toBe(1);
    });

    it('forgets the model', async () => {
        await siteModel.remember('a');
        await siteModel.forget();

        expect(await siteModel.findCurrent()).toBeNull();
    });
});
