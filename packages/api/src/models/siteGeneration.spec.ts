import { MongoClient } from 'mongodb';
import createSiteGenerationModel, {
    type SiteGenerationCollection,
    type SiteGenerationStep,
} from './siteGeneration';

describe('siteGeneration model', () => {
    let connection: MongoClient;
    let siteGeneration: SiteGenerationCollection;

    const step = (position: number): SiteGenerationStep => ({
        name: `step ${position}`,
        type: 'enrichment',
        targetId: `id${position}`,
        position,
        attempts: 0,
    });

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
        siteGeneration = await createSiteGenerationModel(connection.db());
        await siteGeneration.deleteMany({});
    });

    afterEach(async () => {
        await siteGeneration.deleteMany({});
    });

    it('starts a generation replacing the previous one', async () => {
        await siteGeneration.start([step(1)]);
        const started = await siteGeneration.start([step(5), step(3)]);

        expect(started).toMatchObject({
            status: 'running',
            position: 3,
            version: 0,
        });
        expect(await siteGeneration.countDocuments()).toBe(1);
        expect(await siteGeneration.findCurrent()).toEqual(started);
    });

    it('returns null when there is no generation', async () => {
        expect(await siteGeneration.findCurrent()).toBeNull();
    });

    it('transitions with the right version and increments it', async () => {
        const current = await siteGeneration.start([step(1)]);
        const next = await siteGeneration.transition(current, {
            status: 'done',
        });

        expect(next).toMatchObject({ status: 'done', version: 1 });
        expect((await siteGeneration.findCurrent())?.version).toBe(1);
    });

    it('lets exactly one of two concurrent transitions succeed', async () => {
        const current = await siteGeneration.start([step(1)]);
        const results = await Promise.all([
            siteGeneration.transition(current, { status: 'error' }),
            siteGeneration.transition(current, { status: 'stopped' }),
        ]);

        expect(results.filter((result) => result !== null)).toHaveLength(1);
    });

    it('rejects a transition from a stale snapshot and leaves the document unchanged', async () => {
        const snapshot = await siteGeneration.start([step(1)]);
        const next = await siteGeneration.transition(snapshot, {
            status: 'error',
        });
        expect(next).not.toBeNull();

        const stale = await siteGeneration.transition(snapshot, {
            status: 'stopped',
        });

        expect(stale).toBeNull();
        expect(await siteGeneration.findCurrent()).toEqual(next);
    });

    it('rejects a transition from a snapshot of a previous generation', async () => {
        const snapshotA = await siteGeneration.start([step(1)]);
        const generationB = await siteGeneration.start([step(2)]);
        expect(generationB.runId).not.toBe(snapshotA.runId);

        const result = await siteGeneration.transition(snapshotA, {
            status: 'stopped',
        });

        expect(result).toBeNull();
        expect(await siteGeneration.findCurrent()).toEqual(generationB);
    });
});
