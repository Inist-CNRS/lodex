import { MongoClient } from 'mongodb';
import createSiteGenerationModel, {
    type SiteGenerationCollection,
    type SiteGenerationStep,
} from './siteGeneration';

describe('siteGeneration model', () => {
    let connection: MongoClient;
    let siteGeneration: SiteGenerationCollection;

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

    it('returns null when there is no generation', async () => {
        expect(await siteGeneration.findCurrent()).toBeNull();
    });

    it('transitions with the right version and increments it', async () => {
        const current = await siteGeneration.startWizard({});
        const next = await siteGeneration.transition(current, {
            status: 'done',
        });

        expect(next).toMatchObject({ status: 'done', version: 1 });
        expect((await siteGeneration.findCurrent())?.version).toBe(1);
    });

    it('tells of every write, not of a lost transition', async () => {
        const onChange = jest.fn();
        siteGeneration.onChange = onChange;
        const started = await siteGeneration.startWizard({});
        expect(onChange).toHaveBeenCalledTimes(1);

        await siteGeneration.transition(started, { status: 'error' });
        expect(onChange).toHaveBeenCalledTimes(2);

        // stale snapshot: nothing written
        await siteGeneration.transition(started, { status: 'stopped' });
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('lets exactly one of two concurrent transitions succeed', async () => {
        const current = await siteGeneration.startWizard({});
        const results = await Promise.all([
            siteGeneration.transition(current, { status: 'error' }),
            siteGeneration.transition(current, { status: 'stopped' }),
        ]);

        expect(results.filter((result) => result !== null)).toHaveLength(1);
    });

    it('rejects a transition from a stale snapshot and leaves the document unchanged', async () => {
        const snapshot = await siteGeneration.startWizard({});
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
        const snapshotA = await siteGeneration.startWizard({});
        const generationB = await siteGeneration.startWizard({});
        expect(generationB.runId).not.toBe(snapshotA.runId);

        const result = await siteGeneration.transition(snapshotA, {
            status: 'stopped',
        });

        expect(result).toBeNull();
        expect(await siteGeneration.findCurrent()).toEqual(generationB);
    });

    it('reads a generation stored without a phase as in its launch phase', async () => {
        const started = await siteGeneration.startWizard({});
        await siteGeneration.updateOne(
            { _id: started._id },
            { $unset: { phase: '' } },
        );

        expect((await siteGeneration.findCurrent())?.phase).toBe('launch');
        expect(
            (await siteGeneration.transition(started, { status: 'done' }))
                ?.phase,
        ).toBe('launch');
    });

    it('reads a generation stored without a kind as a wizard one', async () => {
        const started = await siteGeneration.startWizard({});
        await siteGeneration.updateOne(
            { _id: started._id },
            { $unset: { kind: '' } },
        );

        expect((await siteGeneration.findCurrent())?.kind).toBe('wizard');
    });

    it('removes the fields to unset', async () => {
        const started = await siteGeneration.startWizard({});
        const failed = await siteGeneration.transition(started, {
            status: 'error',
            message: 'oops',
        });

        const next = await siteGeneration.transition(
            failed!,
            { status: 'running' },
            { unset: ['message'] },
        );

        expect(next).toMatchObject({ status: 'running', version: 2 });
        expect(next).not.toHaveProperty('message');
        expect(
            await siteGeneration.findOne({ _id: started._id }),
        ).not.toHaveProperty('message');
    });

    describe('startWizard', () => {
        const wizard = {
            choice: {
                modelId: 'model1',
                siteName: 'My site',
            },
            importJobId: 'job1',
            estimate: { enrichment: 2, precomputed: 3 },
        };

        it('creates a running generation in the data phase', async () => {
            const started = await siteGeneration.startWizard(wizard);

            expect(started).toMatchObject({
                status: 'running',
                phase: 'data',
                steps: [],
                position: 0,
                version: 0,
                ...wizard,
            });
            expect(await siteGeneration.findCurrent()).toEqual(started);
        });

        it('replaces an existing generation keeping its _id', async () => {
            const previous = await siteGeneration.startWizard({});
            const started = await siteGeneration.startWizard(wizard);

            expect(started._id).toEqual(previous._id);
            expect(started.runId).not.toBe(previous.runId);
            expect(started.steps).toEqual([]);
            expect(await siteGeneration.countDocuments()).toBe(1);
        });

        it('transitions writing phase, message and importedLines', async () => {
            const current = await siteGeneration.startWizard(wizard);
            const next = await siteGeneration.transition(current, {
                phase: 'model',
                message: 'oops',
                importedLines: 12,
            });

            expect(next).toMatchObject({
                phase: 'model',
                message: 'oops',
                importedLines: 12,
                version: 1,
            });
        });
    });

    describe('startDataAdd', () => {
        const steps: SiteGenerationStep[] = [
            {
                name: 'e1',
                type: 'enrichment',
                targetId: 't1',
                position: 0,
                attempts: 0,
            },
            {
                name: 'e2',
                type: 'enrichment',
                targetId: 't2',
                position: 1,
                attempts: 0,
            },
            {
                name: 'p1',
                type: 'precomputed',
                targetId: 't3',
                position: 2,
                attempts: 0,
            },
        ];
        const estimate = { enrichment: 2, precomputed: 1 };
        const add = { importJobId: 'job1', autoPublish: true, steps, estimate };

        it('creates a running data add generation in the data phase', async () => {
            const started = await siteGeneration.startDataAdd(add);

            expect(started).toMatchObject({
                kind: 'addData',
                status: 'running',
                phase: 'data',
                steps,
                importJobId: 'job1',
                autoPublish: true,
                estimate: { enrichment: 2, precomputed: 1 },
                position: 0,
                version: 0,
            });
            expect(started).not.toHaveProperty('choice');
            expect(await siteGeneration.findCurrent()).toEqual(started);
        });

        it('stores no estimate when the caller gives none', async () => {
            const started = await siteGeneration.startDataAdd({
                ...add,
                steps: [],
                estimate: undefined,
            });

            expect(started).not.toHaveProperty('estimate');
        });

        it('replaces an existing generation keeping its _id and tells of it', async () => {
            const previous = await siteGeneration.startWizard({});
            const onChange = jest.fn();
            siteGeneration.onChange = onChange;
            const started = await siteGeneration.startDataAdd(add);

            expect(started._id).toEqual(previous._id);
            expect(started.runId).not.toBe(previous.runId);
            expect(await siteGeneration.countDocuments()).toBe(1);
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });
});
