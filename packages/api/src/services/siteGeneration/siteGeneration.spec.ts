import { TaskStatus } from '@lodex/common';
import omit from 'lodash/omit';
import { MongoClient } from 'mongodb';
import createSiteGenerationModel, {
    type SiteGenerationCollection,
    type SiteGenerationStep,
} from '../../models/siteGeneration';
import {
    cancelJob,
    cancelPublisherJob,
    getActiveJob,
    getJobState,
    getWaitingJobs,
    queuePublisher,
} from '../../workers/tools';
import { MODEL_IMPORTER } from './wizardJobs';
import { queueEnrichment, queuePrecomputed } from '../launchTasks';
import { invalidateRepositories } from '../repositoryMiddleware';
import {
    advanceSiteGeneration,
    failLostSiteGenerationJob,
    getSiteGenerationView,
    PUBLICATION_LOST,
    refusedDuringSiteGeneration,
    relaunchSiteGeneration,
    settleStoppingSiteGeneration,
    SITE_GENERATION_MAX_RELAUNCHES,
    stopSiteGeneration,
    type SiteGenerationContext,
} from './siteGeneration';

jest.mock('../launchTasks');
jest.mock('../../workers/tools');

const mockWorkerQueue = { add: jest.fn(), getJob: jest.fn() };
jest.mock('../../workers', () => ({
    getOrCreateWorkerQueue: () => mockWorkerQueue,
}));
jest.mock('../repositoryMiddleware', () => ({
    invalidateRepositories: jest.fn(),
}));

// A job of the queue, as bull gives it
const queueJob = (state: string, finishedOn?: number) => ({
    getState: jest.fn(async () => state),
    remove: jest.fn(),
    finishedOn,
});

type Target = {
    _id: string;
    status?: string;
    message?: string;
    jobId?: string;
};

const createTargetRepository = () => {
    const targets = new Map<string, Target>();
    return {
        targets,
        findOneById: jest.fn(async (id: string) => {
            const target = targets.get(String(id));
            return target ? { ...target } : null;
        }),
        findStatesByIds: jest.fn(async (ids: string[]) =>
            ids.flatMap((id) => {
                const target = targets.get(String(id));
                return target ? [{ ...target }] : [];
            }),
        ),
        updateStatus: jest.fn(
            async (id: string, status: string, data: object = {}) => {
                const target = targets.get(String(id));
                if (target) {
                    targets.set(String(id), { ...target, ...data, status });
                }
            },
        ),
        cancelByIds: jest.fn(async (ids: string[]) => {
            for (const id of ids) {
                const target = targets.get(String(id));
                if (target) {
                    targets.set(String(id), { ...target, status: 'CANCELED' });
                }
            }
        }),
    };
};

const step = (
    name: string,
    type: SiteGenerationStep['type'],
    position: number,
): SiteGenerationStep => ({
    name,
    type,
    targetId: `${name}-id`,
    position,
    attempts: 0,
});

const STEPS = [
    step('clusterRameau', 'precomputed', 1),
    step('xml', 'enrichment', 2),
    step('resume', 'enrichment', 3),
    step('resumeFr', 'precomputed', 3),
];

describe('siteGeneration service', () => {
    let connection: MongoClient;
    let siteGeneration: SiteGenerationCollection;
    let enrichment: ReturnType<typeof createTargetRepository>;
    let precomputed: ReturnType<typeof createTargetRepository>;
    let ctx: SiteGenerationContext;

    const setStatus = (
        name: string,
        status: string,
        extra: Partial<Target> = {},
    ) => {
        const repository =
            STEPS.find((s) => s.name === name)!.type === 'precomputed'
                ? precomputed
                : enrichment;
        const id = `${name}-id`;
        // Keeps the jobId written when the step was queued
        repository.targets.set(id, {
            ...repository.targets.get(id),
            _id: id,
            ...extra,
            status,
        });
    };

    // The jobId is checked on its own (see "stores the jobId")
    const withoutJobId = ([, id, options]: [unknown, string, object?]) => ({
        id,
        options: omit(options, ['jobId', 'isStillWanted']),
    });
    const queued = () => [
        ...jest.mocked(queuePrecomputed).mock.calls.map(withoutJobId),
        ...jest.mocked(queueEnrichment).mock.calls.map(withoutJobId),
    ];

    // Each queue call writes PENDING on the target, like the real ones
    const mockQueue =
        (repository: () => ReturnType<typeof createTargetRepository>) =>
        async (_ctx: unknown, id: string, options?: { jobId?: string }) => {
            await repository().updateStatus(id, TaskStatus.PENDING, {
                jobId: options?.jobId,
            });
        };

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
        // A database of its own: the model spec uses the same collection
        siteGeneration = await createSiteGenerationModel(
            connection.db('lodex_test_site_generation_service'),
        );
        await siteGeneration.deleteMany({});
        enrichment = createTargetRepository();
        precomputed = createTargetRepository();
        for (const { name } of STEPS) {
            setStatus(name, '');
        }
        jest.mocked(queueEnrichment).mockImplementation(
            mockQueue(() => enrichment),
        );
        jest.mocked(queuePrecomputed).mockImplementation(
            mockQueue(() => precomputed),
        );
        jest.mocked(getWaitingJobs).mockResolvedValue([]);
        jest.mocked(getActiveJob).mockResolvedValue(undefined);
        mockWorkerQueue.getJob.mockResolvedValue(null);
        ctx = {
            tenant: 'lodex_test',
            enrichment,
            precomputed,
            dataset: { removeAttribute: jest.fn(), drop: jest.fn() },
            dataSource: { removeAttribute: jest.fn() },
            siteGeneration,
        } as unknown as SiteGenerationContext;
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await siteGeneration.deleteMany({});
    });

    // A generation of the wizard, once in its launch phase
    const start = async (
        steps: SiteGenerationStep[],
        { autoPublish }: { autoPublish?: boolean } = {},
    ) => {
        const started = await siteGeneration.startWizard(
            autoPublish ? { choice: { modelId: 'model', autoPublish } } : {},
        );
        return (await siteGeneration.transition(started, {
            phase: 'launch',
            position: steps.length
                ? Math.min(...steps.map((s) => s.position))
                : 0,
            steps,
        }))!;
    };

    // A generation of the wizard, before its launch phase
    const startIn = async (
        phase: 'data' | 'model' | 'settings',
        update: Parameters<SiteGenerationCollection['transition']>[1] = {},
    ) => {
        const started = await siteGeneration.startWizard({
            choice: { modelId: 'model' },
            importJobId: 'import-job',
            estimate: { enrichment: 2, precomputed: 1 },
        });
        return (await siteGeneration.transition(started, {
            phase,
            ...(phase !== 'data' && { modelJobId: 'model-job' }),
            ...update,
        }))!;
    };

    const finishPosition = (position: number) => {
        for (const s of STEPS.filter((s) => s.position === position)) {
            setStatus(s.name, TaskStatus.FINISHED);
        }
    };

    describe('advanceSiteGeneration', () => {
        it('does nothing before the launch phase', async () => {
            const started = await siteGeneration.startWizard({});
            const inModel = await siteGeneration.transition(started, {
                phase: 'model',
                steps: STEPS,
                position: 1,
            });

            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([]);
            expect(await siteGeneration.findCurrent()).toEqual(inModel);
        });

        it('queues the first position once', async () => {
            await start(STEPS);

            await advanceSiteGeneration(ctx);
            expect(queued()).toEqual([
                { id: 'clusterRameau-id', options: { relaunch: false } },
            ]);

            await advanceSiteGeneration(ctx);
            expect(queued()).toHaveLength(1);

            const generation = await siteGeneration.findCurrent();
            expect(generation?.steps.map((s) => !!s.jobId)).toEqual([
                true,
                false,
                false,
                false,
            ]);
        });

        it('moves to the next position once all steps are finished, then queues it', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            finishPosition(1);

            await advanceSiteGeneration(ctx);
            expect((await siteGeneration.findCurrent())?.position).toBe(2);
            expect(queued()).toHaveLength(1);

            await advanceSiteGeneration(ctx);
            expect(queued()).toEqual([
                { id: 'clusterRameau-id', options: { relaunch: false } },
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
            ]);
        });

        it('queues the precomputations of a position before its enrichment', async () => {
            const order: string[] = [];
            jest.mocked(queueEnrichment).mockImplementation(async (_, id) => {
                order.push(id);
            });
            jest.mocked(queuePrecomputed).mockImplementation(async (_, id) => {
                order.push(id);
            });
            await start(STEPS.filter((s) => s.position === 3));

            await advanceSiteGeneration(ctx);

            expect(order).toEqual(['resumeFr-id', 'resume-id']);
        });

        it('does not move on while a step of the position is not finished', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            setStatus('clusterRameau', TaskStatus.ON_HOLD);

            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(1);
        });

        it('counts a finished enrichment with lines in error as finished', async () => {
            await start(STEPS.filter((s) => s.position >= 2));
            await advanceSiteGeneration(ctx);
            setStatus('xml', TaskStatus.FINISHED, {
                errorCount: 12,
            } as Partial<Target>);

            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(3);
        });

        it.each([0, 1, 2])(
            'relaunches a step in error with %i attempts and counts the attempt',
            async (attempts) => {
                const generation = await start(STEPS);
                await siteGeneration.transition(generation, {
                    steps: STEPS.map((s) =>
                        s.position === 1
                            ? {
                                  ...s,
                                  attempts,
                                  jobId: 'job-1',
                              }
                            : s,
                    ),
                });
                setStatus('clusterRameau', TaskStatus.ERROR, {
                    message: 'boom',
                    jobId: 'job-1',
                });

                await advanceSiteGeneration(ctx);

                expect(queued()).toEqual([
                    { id: 'clusterRameau-id', options: { relaunch: true } },
                ]);
                const current = await siteGeneration.findCurrent();
                expect(current?.status).toBe('running');
                expect(current?.steps[0].attempts).toBe(attempts + 1);
            },
        );

        it('relaunches a canceled step as a step in error', async () => {
            await start(STEPS.filter((s) => s.position === 2));
            await advanceSiteGeneration(ctx);
            setStatus('xml', TaskStatus.CANCELED);

            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
                { id: 'xml-id', options: { relaunch: true, lifo: false } },
            ]);
        });

        it(`puts the generation in error after ${SITE_GENERATION_MAX_RELAUNCHES} attempts`, async () => {
            const generation = await start(STEPS);
            await siteGeneration.transition(generation, {
                steps: STEPS.map((s) =>
                    s.position === 1
                        ? {
                              ...s,
                              attempts: SITE_GENERATION_MAX_RELAUNCHES,
                              jobId: 'job-1',
                          }
                        : s,
                ),
            });
            setStatus('clusterRameau', TaskStatus.ERROR, { jobId: 'job-1' });

            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([]);
            expect((await siteGeneration.findCurrent())?.status).toBe('error');

            await advanceSiteGeneration(ctx);
            expect(queued()).toEqual([]);
        });

        it('treats a deleted target as finished', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            precomputed.targets.delete('clusterRameau-id');

            await advanceSiteGeneration(ctx);
            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(2);
            expect(queued().map(({ id }) => id)).toEqual([
                'clusterRameau-id',
                'xml-id',
            ]);
        });

        it('does not crash the pass when a queue call throws', async () => {
            jest.mocked(queuePrecomputed).mockRejectedValue(
                new Error('Precomputed "clusterRameau-id" not found'),
            );
            await start(STEPS);

            await expect(advanceSiteGeneration(ctx)).resolves.toBeUndefined();
            expect(
                (await siteGeneration.findCurrent())?.steps[0].jobId,
            ).toBeDefined();
        });

        it('puts a step in error when queuing it fails, so that a later pass relaunches it', async () => {
            await start(STEPS.filter((s) => s.position === 2));
            jest.mocked(queueEnrichment).mockRejectedValueOnce(
                new Error('Redis is down'),
            );

            await advanceSiteGeneration(ctx);

            const jobId = (await siteGeneration.findCurrent())?.steps[0].jobId;
            expect(enrichment.targets.get('xml-id')).toEqual(
                expect.objectContaining({
                    status: TaskStatus.ERROR,
                    jobId,
                    message: 'Redis is down',
                }),
            );

            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
                { id: 'xml-id', options: { relaunch: true, lifo: false } },
            ]);
            const current = await siteGeneration.findCurrent();
            expect(current?.steps[0].attempts).toBe(1);
            expect(enrichment.targets.get('xml-id')?.status).toBe(
                TaskStatus.PENDING,
            );
        });

        it('ends the generation as done after the last position', async () => {
            await start(STEPS);
            for (const position of [1, 2, 3]) {
                await advanceSiteGeneration(ctx);
                finishPosition(position);
                await advanceSiteGeneration(ctx);
            }

            expect((await siteGeneration.findCurrent())?.status).toBe('done');
            expect(queued()).toHaveLength(STEPS.length);
        });

        it('wants a queued step only while its generation runs it', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            const isStillWanted = jest.mocked(queuePrecomputed).mock.calls[0][2]
                ?.isStillWanted as () => Promise<boolean>;

            expect(await isStillWanted()).toBe(true);

            await stopSiteGeneration(ctx);
            expect(await isStillWanted()).toBe(false);
        });

        it('no longer wants a step relaunched with another jobId', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            const isStillWanted = jest.mocked(queuePrecomputed).mock.calls[0][2]
                ?.isStillWanted as () => Promise<boolean>;
            setStatus('clusterRameau', TaskStatus.ERROR, {
                jobId: (await siteGeneration.findCurrent())?.steps[0].jobId,
            });

            await advanceSiteGeneration(ctx);

            expect(jest.mocked(queuePrecomputed)).toHaveBeenCalledTimes(2);
            expect(await isStillWanted()).toBe(false);
        });

        it('stores the jobId given to each queued step', async () => {
            await start(STEPS);

            await advanceSiteGeneration(ctx);

            const jobId = (await siteGeneration.findCurrent())?.steps[0].jobId;
            expect(jobId).toEqual(expect.any(String));
            expect(jest.mocked(queuePrecomputed).mock.calls[0][2]).toEqual({
                jobId,
                relaunch: false,
                isStillWanted: expect.any(Function),
            });
            expect(precomputed.targets.get('clusterRameau-id')?.jobId).toBe(
                jobId,
            );
        });

        it('does not count the status of an earlier run while the step is being queued', async () => {
            // the winner has not written PENDING yet
            jest.mocked(queuePrecomputed).mockImplementation(async () => {});
            setStatus('clusterRameau', TaskStatus.FINISHED, {
                jobId: 'earlier-run',
            });
            await start(STEPS);

            await advanceSiteGeneration(ctx);
            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(1);
            expect((await getSiteGenerationView(ctx))?.steps[0].state).toBe(
                'running',
            );
        });

        it('does not relaunch again a step whose relaunch is being queued', async () => {
            await start(STEPS.filter((s) => s.position === 2));
            await advanceSiteGeneration(ctx);
            setStatus('xml', TaskStatus.ERROR);
            // the winner has not written PENDING yet
            jest.mocked(queueEnrichment).mockImplementation(async () => {});

            await advanceSiteGeneration(ctx);
            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
                { id: 'xml-id', options: { relaunch: true, lifo: false } },
            ]);
            expect(
                (await siteGeneration.findCurrent())?.steps[0].attempts,
            ).toBe(1);
        });

        it('queues each step once when two passes run together', async () => {
            await start(STEPS);

            await Promise.all([
                advanceSiteGeneration(ctx),
                advanceSiteGeneration(ctx),
            ]);
            finishPosition(1);
            await Promise.all([
                advanceSiteGeneration(ctx),
                advanceSiteGeneration(ctx),
            ]);
            await Promise.all([
                advanceSiteGeneration(ctx),
                advanceSiteGeneration(ctx),
            ]);
            setStatus('xml', TaskStatus.ERROR);
            await Promise.all([
                advanceSiteGeneration(ctx),
                advanceSiteGeneration(ctx),
            ]);

            expect(queued()).toEqual([
                { id: 'clusterRameau-id', options: { relaunch: false } },
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
                { id: 'xml-id', options: { relaunch: true, lifo: false } },
            ]);
            const current = await siteGeneration.findCurrent();
            expect(current?.position).toBe(2);
            expect(current?.steps[1].attempts).toBe(1);
        });

        it('does nothing without a running generation', async () => {
            await advanceSiteGeneration(ctx);
            const generation = await start(STEPS);
            await siteGeneration.transition(generation, { status: 'stopped' });
            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([]);
        });
    });

    describe('stopSiteGeneration', () => {
        it('removes the waiting jobs, cancels the targets and stops the generation', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            finishPosition(1);
            await advanceSiteGeneration(ctx);
            await advanceSiteGeneration(ctx);
            const remove = jest.fn();
            const otherRemove = jest.fn();
            jest.mocked(getWaitingJobs).mockResolvedValue([
                { data: { id: 'xml-id', jobType: 'enricher' }, remove },
                {
                    data: { id: 'other-id', jobType: 'enricher' },
                    remove: otherRemove,
                },
            ] as never);

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(remove).toHaveBeenCalled();
            expect(otherRemove).not.toHaveBeenCalled();
            expect(cancelJob).not.toHaveBeenCalled();
            expect(enrichment.targets.get('xml-id')?.status).toBe(
                TaskStatus.CANCELED,
            );
            // a finished step is left as it is
            expect(precomputed.targets.get('clusterRameau-id')?.status).toBe(
                TaskStatus.FINISHED,
            );
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );

            await advanceSiteGeneration(ctx);
            expect(queued()).toHaveLength(2);
        });

        it('cancels the active job of a step', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            jest.mocked(getActiveJob).mockResolvedValue({
                data: { id: 'clusterRameau-id', jobType: 'precomputer' },
            } as never);

            await stopSiteGeneration(ctx);

            expect(cancelJob).toHaveBeenCalledWith(ctx, 'precomputer');
            expect(precomputed.targets.get('clusterRameau-id')?.status).toBe(
                TaskStatus.CANCELED,
            );
        });

        it('cancels a precomputation on hold', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            setStatus('clusterRameau', TaskStatus.ON_HOLD);

            await stopSiteGeneration(ctx);

            expect(precomputed.targets.get('clusterRameau-id')?.status).toBe(
                TaskStatus.CANCELED,
            );
        });

        it('keeps the status and message of a step in error', async () => {
            await start(STEPS);
            await advanceSiteGeneration(ctx);
            setStatus('clusterRameau', TaskStatus.ERROR, { message: 'boom' });

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(precomputed.targets.get('clusterRameau-id')).toEqual(
                expect.objectContaining({
                    status: TaskStatus.ERROR,
                    message: 'boom',
                }),
            );
        });

        it('stops a generation in error', async () => {
            const generation = await start(STEPS);
            await siteGeneration.transition(generation, { status: 'error' });

            expect(await stopSiteGeneration(ctx)).toBe(true);
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('returns false without a running or failed generation', async () => {
            expect(await stopSiteGeneration(ctx)).toBe(false);
            const generation = await start(STEPS);
            await siteGeneration.transition(generation, { status: 'done' });
            expect(await stopSiteGeneration(ctx)).toBe(false);
        });

        it('removes a waiting data import and stops the generation', async () => {
            await startIn('data');
            const job = queueJob('waiting');
            mockWorkerQueue.getJob.mockResolvedValue(job);

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(mockWorkerQueue.getJob).toHaveBeenCalledWith('import-job');
            expect(job.remove).toHaveBeenCalled();
            expect(cancelJob).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('cancels an active data import and stops the generation', async () => {
            await startIn('data');
            const job = queueJob('active');
            mockWorkerQueue.getJob.mockResolvedValue(job);
            jest.mocked(getActiveJob).mockResolvedValue({
                id: 'import-job',
                data: { jobType: 'import' },
            } as any);

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(job.remove).not.toHaveBeenCalled();
            expect(cancelJob).toHaveBeenCalledWith(ctx, 'import');
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('does not cancel an import started by hand meanwhile', async () => {
            await startIn('data');
            // the import of the generation ended meanwhile
            mockWorkerQueue.getJob.mockResolvedValue(queueJob('active'));
            jest.mocked(getActiveJob).mockResolvedValue({
                id: 'manual-import',
                data: { jobType: 'import' },
            } as any);

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(cancelJob).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('stops a data phase whose import no longer exists', async () => {
            await startIn('data');

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(cancelJob).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('stops a data phase in error and empties the dataset', async () => {
            await startIn('data', { status: 'error', message: 'bad file' });
            mockWorkerQueue.getJob.mockResolvedValue(queueJob('failed'));

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(ctx.dataset.drop).toHaveBeenCalled();
            expect(invalidateRepositories).toHaveBeenCalledWith('lodex_test');
            expect(cancelJob).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('lets the cancelled import of a running data phase empty the dataset', async () => {
            await startIn('data');
            mockWorkerQueue.getJob.mockResolvedValue(queueJob('active'));

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(ctx.dataset.drop).not.toHaveBeenCalled();
        });

        it.each(['model', 'settings'] as const)(
            'removes a waiting model job in the %s phase',
            async (phase) => {
                await startIn(phase);
                const job = queueJob('waiting');
                mockWorkerQueue.getJob.mockResolvedValue(job);

                expect(await stopSiteGeneration(ctx)).toBe(true);

                expect(mockWorkerQueue.getJob).toHaveBeenCalledWith(
                    'model-job',
                );
                expect(job.remove).toHaveBeenCalled();
                expect((await siteGeneration.findCurrent())?.status).toBe(
                    'stopped',
                );
            },
        );

        it('lets an active model job end the generation, and refuses a second stop', async () => {
            await startIn('model');
            const job = queueJob('active');
            mockWorkerQueue.getJob.mockResolvedValue(job);

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect(job.remove).not.toHaveBeenCalled();
            expect(cancelJob).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopping',
            );

            expect(await stopSiteGeneration(ctx)).toBe(false);
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopping',
            );
        });

        it('stops a model phase whose job no longer exists', async () => {
            await startIn('settings');

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('stops a model phase in error', async () => {
            await startIn('model', { status: 'error', message: 'boom' });
            mockWorkerQueue.getJob.mockResolvedValue(queueJob('failed'));

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });
    });

    describe('settleStoppingSiteGeneration', () => {
        it.each([
            ['no longer exists', null],
            ['completed', 'completed'],
            ['failed', 'failed'],
        ])(
            'stops a stopping generation whose model job %s',
            async (_name, state) => {
                await startIn('model', { status: 'stopping' });
                mockWorkerQueue.getJob.mockResolvedValue(
                    state ? queueJob(state) : null,
                );

                await settleStoppingSiteGeneration(ctx);

                expect(mockWorkerQueue.getJob).toHaveBeenCalledWith(
                    'model-job',
                );
                expect((await siteGeneration.findCurrent())?.status).toBe(
                    'stopped',
                );
            },
        );

        it.each(['active', 'waiting'])(
            'leaves a stopping generation whose model job is %s',
            async (state) => {
                const generation = await startIn('settings', {
                    status: 'stopping',
                });
                mockWorkerQueue.getJob.mockResolvedValue(queueJob(state));

                await settleStoppingSiteGeneration(ctx);

                expect(await siteGeneration.findCurrent()).toEqual(generation);
            },
        );

        it.each(['running', 'error', 'done', 'stopped'] as const)(
            'leaves a %s generation alone',
            async (status) => {
                const generation = await startIn('model', { status });

                await settleStoppingSiteGeneration(ctx);

                expect(mockWorkerQueue.getJob).not.toHaveBeenCalled();
                expect(await siteGeneration.findCurrent()).toEqual(generation);
            },
        );

        it('does nothing without a generation', async () => {
            await settleStoppingSiteGeneration(ctx);

            expect(mockWorkerQueue.getJob).not.toHaveBeenCalled();
        });
    });

    describe('failLostSiteGenerationJob', () => {
        // the generations below were updated well before the grace period
        let now: Date;
        beforeEach(() => {
            now = new Date(Date.now() + 2 * 60_000);
        });
        const finishedAgo = (seconds: number) => now.getTime() - seconds * 1000;

        it('leaves a generation updated within the grace period', async () => {
            // its job may not be queued yet
            const generation = await startIn('data');

            await failLostSiteGenerationJob(
                ctx,
                new Date(generation.updatedAt.getTime() + 10_000),
            );

            expect(await siteGeneration.findCurrent()).toEqual(generation);
        });

        it('puts in error a generation updated long ago whose job is missing', async () => {
            const generation = await startIn('data');

            await failLostSiteGenerationJob(
                ctx,
                new Date(generation.updatedAt.getTime() + 2 * 60_000),
            );

            expect((await siteGeneration.findCurrent())?.status).toBe('error');
        });

        const cases = [
            ['data', 'import-job'],
            ['model', 'model-job'],
            ['settings', 'model-job'],
        ] as const;

        it.each(cases)(
            'puts in error a %s phase whose job no longer exists',
            async (phase, jobId) => {
                await startIn(phase);

                await failLostSiteGenerationJob(ctx, now);

                expect(mockWorkerQueue.getJob).toHaveBeenCalledWith(jobId);
                expect(await siteGeneration.findCurrent()).toEqual(
                    expect.objectContaining({
                        status: 'error',
                        phase,
                        message: 'site_generation_job_lost',
                    }),
                );
            },
        );

        it.each(cases)(
            'puts in error a %s phase whose job ended long ago',
            async (phase) => {
                for (const state of ['completed', 'failed']) {
                    await siteGeneration.deleteMany({});
                    await startIn(phase);
                    mockWorkerQueue.getJob.mockResolvedValue(
                        queueJob(state, finishedAgo(61)),
                    );

                    await failLostSiteGenerationJob(ctx, now);

                    expect((await siteGeneration.findCurrent())?.status).toBe(
                        'error',
                    );
                }
            },
        );

        it.each(['completed', 'failed'])(
            'leaves a generation whose job is %s within the grace period',
            async (state) => {
                // its end hook has not run yet
                const generation = await startIn('data');
                mockWorkerQueue.getJob.mockResolvedValue(
                    queueJob(state, finishedAgo(10)),
                );

                await failLostSiteGenerationJob(ctx, now);

                expect(await siteGeneration.findCurrent()).toEqual(generation);
            },
        );

        it.each(['active', 'waiting', 'delayed', 'paused'])(
            'leaves a generation whose job is %s',
            async (state) => {
                const generation = await startIn('model');
                mockWorkerQueue.getJob.mockResolvedValue(queueJob(state));

                await failLostSiteGenerationJob(ctx, now);

                expect(await siteGeneration.findCurrent()).toEqual(generation);
            },
        );

        it.each(['error', 'stopping', 'done', 'stopped'] as const)(
            'leaves a %s generation alone',
            async (status) => {
                const generation = await startIn('data', { status });

                await failLostSiteGenerationJob(ctx, now);

                expect(mockWorkerQueue.getJob).not.toHaveBeenCalled();
                expect(await siteGeneration.findCurrent()).toEqual(generation);
            },
        );

        it('leaves a launch phase alone', async () => {
            const generation = await start(STEPS);

            await failLostSiteGenerationJob(ctx, now);

            expect(mockWorkerQueue.getJob).not.toHaveBeenCalled();
            expect(await siteGeneration.findCurrent()).toEqual(generation);
        });

        it('does nothing without a generation', async () => {
            await failLostSiteGenerationJob(ctx, now);

            expect(mockWorkerQueue.getJob).not.toHaveBeenCalled();
        });
    });

    describe('relaunchSiteGeneration', () => {
        it('relaunches the steps in error of a failed generation', async () => {
            const generation = await start(STEPS);
            await siteGeneration.transition(generation, {
                status: 'error',
                steps: STEPS.map((s) =>
                    s.position === 1
                        ? {
                              ...s,
                              attempts: SITE_GENERATION_MAX_RELAUNCHES,
                              jobId: 'job-1',
                          }
                        : s,
                ),
            });
            setStatus('clusterRameau', TaskStatus.ERROR, { jobId: 'job-1' });

            expect(await relaunchSiteGeneration(ctx)).toBe(true);

            expect(queued()).toEqual([
                { id: 'clusterRameau-id', options: { relaunch: true } },
            ]);
            const current = await siteGeneration.findCurrent();
            expect(current?.status).toBe('running');
            expect(current?.steps[0].attempts).toBe(0);
        });

        it('stops a data phase in error and empties the dataset', async () => {
            await startIn('data', { status: 'error', message: 'bad file' });

            expect(await relaunchSiteGeneration(ctx)).toBe(true);

            expect(ctx.dataset.drop).toHaveBeenCalled();
            expect(invalidateRepositories).toHaveBeenCalledWith('lodex_test');
            expect(mockWorkerQueue.add).not.toHaveBeenCalled();
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it.each(['model', 'settings'] as const)(
            'queues the model job again from the %s phase',
            async (phase) => {
                const generation = await startIn(phase, {
                    status: 'error',
                    message: 'download failed',
                });

                expect(await relaunchSiteGeneration(ctx)).toBe(true);

                const current = await siteGeneration.findCurrent();
                expect(current).toEqual(
                    expect.objectContaining({
                        status: 'running',
                        phase: 'model',
                    }),
                );
                expect(
                    await siteGeneration.findOne({ _id: generation._id }),
                ).not.toHaveProperty('message');
                expect(current?.modelJobId).toEqual(expect.any(String));
                expect(current?.modelJobId).not.toBe('model-job');
                expect(mockWorkerQueue.add).toHaveBeenCalledWith(
                    MODEL_IMPORTER,
                    {
                        jobType: MODEL_IMPORTER,
                        tenant: 'lodex_test',
                        runId: generation.runId,
                    },
                    { jobId: current?.modelJobId, lifo: false },
                );
                expect(ctx.dataset.drop).not.toHaveBeenCalled();
                expect(queued()).toEqual([]);
            },
        );

        it('returns false when the generation is not in error', async () => {
            await start(STEPS);

            expect(await relaunchSiteGeneration(ctx)).toBe(false);
            expect(queued()).toEqual([]);
        });
    });

    describe('refusedDuringSiteGeneration', () => {
        const handler = jest.fn(async (handlerCtx: any, id: string) => {
            handlerCtx.status = 200;
            handlerCtx.body = { id };
        });

        it.each(['running', 'error', 'stopping'] as const)(
            'refuses a launch by hand while the generation is %s',
            async (status) => {
                const generation = await start(STEPS);
                await siteGeneration.transition(generation, { status });
                const handlerCtx: any = { siteGeneration };

                await refusedDuringSiteGeneration(handler)(handlerCtx, 'e1');

                expect(handler).not.toHaveBeenCalled();
                expect(handlerCtx.status).toBe(409);
                expect(handlerCtx.body).toEqual({
                    error: 'site_generation_in_progress',
                });
            },
        );

        it.each([
            ['without a generation', undefined],
            ['once the generation is done', 'done'],
            ['once the generation is stopped', 'stopped'],
        ] as const)(
            'lets a launch by hand through %s',
            async (_name, status) => {
                if (status) {
                    const generation = await start(STEPS);
                    await siteGeneration.transition(generation, { status });
                }
                const handlerCtx: any = { siteGeneration };

                await refusedDuringSiteGeneration(handler)(handlerCtx, 'e1');

                expect(handler).toHaveBeenCalledWith(handlerCtx, 'e1');
                expect(handlerCtx.body).toEqual({ id: 'e1' });
            },
        );
    });

    describe('getSiteGenerationView', () => {
        it('returns null without a generation', async () => {
            expect(await getSiteGenerationView(ctx)).toBeNull();
        });

        it('returns the state of each step', async () => {
            const generation = await start([
                ...STEPS,
                step('deleted', 'enrichment', 1),
            ]);
            await siteGeneration.transition(generation, {
                status: 'error',
                position: 3,
                steps: [...STEPS, step('deleted', 'enrichment', 1)].map(
                    (s) => ({
                        ...s,
                        jobId:
                            s.position <= 3 && s.name !== 'xml'
                                ? 'job-1'
                                : undefined,
                    }),
                ),
            });
            setStatus('clusterRameau', TaskStatus.FINISHED, { jobId: 'job-1' });
            setStatus('resume', TaskStatus.IN_PROGRESS, { jobId: 'job-1' });
            setStatus('resumeFr', TaskStatus.ERROR, {
                message: 'no answer',
                jobId: 'job-1',
            });

            expect(await getSiteGenerationView(ctx)).toEqual({
                status: 'error',
                phase: 'launch',
                launch: {
                    enrichment: { done: 1, total: 3, error: 0 },
                    precomputed: { done: 1, total: 2, error: 1 },
                },
                steps: [
                    {
                        name: 'clusterRameau',
                        type: 'precomputed',
                        position: 1,
                        state: 'done',
                    },
                    {
                        name: 'xml',
                        type: 'enrichment',
                        position: 2,
                        state: 'waiting',
                    },
                    {
                        name: 'resume',
                        type: 'enrichment',
                        position: 3,
                        state: 'running',
                    },
                    {
                        name: 'resumeFr',
                        type: 'precomputed',
                        position: 3,
                        state: 'error',
                        message: 'no answer',
                    },
                    {
                        name: 'deleted',
                        type: 'enrichment',
                        position: 1,
                        state: 'done',
                    },
                ],
            });
        });

        it('reads a generation without phase as in its launch phase', async () => {
            await start(STEPS);
            await siteGeneration.updateOne({}, { $unset: { phase: '' } });

            expect(await getSiteGenerationView(ctx)).toEqual(
                expect.objectContaining({ phase: 'launch' }),
            );
        });

        it('estimates the counters before the launch phase', async () => {
            await startIn('model', {
                importedLines: 12,
                choice: {
                    modelId: 'model',
                    siteName: 'My site',
                },
            });

            expect(await getSiteGenerationView(ctx)).toEqual({
                status: 'running',
                phase: 'model',
                modelId: 'model',
                importedLines: 12,
                settings: { siteName: true, siteDescription: false },
                launch: {
                    enrichment: { done: 0, total: 2, error: 0 },
                    precomputed: { done: 0, total: 1, error: 0 },
                },
                steps: [],
            });
        });

        it('has no counters without steps nor estimate', async () => {
            const started = await siteGeneration.startWizard({});

            expect(await getSiteGenerationView(ctx)).toEqual(
                expect.objectContaining({ phase: 'data', launch: null }),
            );
            await siteGeneration.transition(started, { phase: 'launch' });
            expect(await getSiteGenerationView(ctx)).toEqual(
                expect.objectContaining({ phase: 'launch', launch: null }),
            );
        });

        it('exposes the message and the theme not found', async () => {
            await startIn('settings', {
                status: 'error',
                message: 'boom',
                themeNotFound: 'dark',
            });

            expect(await getSiteGenerationView(ctx)).toEqual(
                expect.objectContaining({
                    message: 'boom',
                    themeNotFound: 'dark',
                }),
            );
        });

        it('counts the steps of the launch phase', async () => {
            const enrichments = [
                step('xml', 'enrichment', 1),
                step('resume', 'enrichment', 1),
            ];
            const generation = await start(enrichments);
            await siteGeneration.transition(generation, {
                estimate: { enrichment: 5, precomputed: 5 },
                steps: enrichments.map((s) => ({ ...s, jobId: 'job-1' })),
            });
            setStatus('xml', TaskStatus.FINISHED, { jobId: 'job-1' });
            setStatus('resume', TaskStatus.ERROR, { jobId: 'job-1' });

            expect((await getSiteGenerationView(ctx))?.launch).toEqual({
                enrichment: { done: 1, total: 2, error: 1 },
                precomputed: { done: 0, total: 0, error: 0 },
            });
        });

        it('reads the targets in one query per type', async () => {
            await start(STEPS);

            await getSiteGenerationView(ctx);

            expect(precomputed.findStatesByIds).toHaveBeenCalledTimes(1);
            expect(precomputed.findStatesByIds).toHaveBeenCalledWith([
                'clusterRameau-id',
                'resumeFr-id',
            ]);
            expect(enrichment.findStatesByIds).toHaveBeenCalledTimes(1);
            expect(enrichment.findStatesByIds).toHaveBeenCalledWith([
                'xml-id',
                'resume-id',
            ]);
            expect(precomputed.findOneById).not.toHaveBeenCalled();
            expect(enrichment.findOneById).not.toHaveBeenCalled();
        });
    });
    describe('publication at the end', () => {
        const ONE_STEP = [step('clusterRameau', 'precomputed', 1)];

        beforeEach(() => {
            jest.mocked(queuePublisher).mockResolvedValue({} as never);
        });

        const runToTheEnd = async () => {
            await start(ONE_STEP, { autoPublish: true });
            await advanceSiteGeneration(ctx);
            finishPosition(1);
            await advanceSiteGeneration(ctx);
        };

        const mockJob = (state: string, failedReason?: string) =>
            jest
                .mocked(getJobState)
                .mockResolvedValue({ state, failedReason } as never);

        it('publishes once every step is done', async () => {
            await runToTheEnd();

            const current = await siteGeneration.findCurrent();
            expect(current?.status).toBe('publishing');
            expect(queuePublisher).toHaveBeenCalledWith(
                'lodex_test',
                current?.publishJobId,
            );
        });

        it.each([
            [true, 'publishing'],
            [false, 'done'],
        ])(
            'ends a launch without steps at once (autoPublish %s)',
            async (autoPublish, status) => {
                await start([], { autoPublish });

                await advanceSiteGeneration(ctx);

                expect((await siteGeneration.findCurrent())?.status).toBe(
                    status,
                );
            },
        );

        it('does not publish without autoPublish', async () => {
            await start(ONE_STEP);
            await advanceSiteGeneration(ctx);
            finishPosition(1);
            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.status).toBe('done');
            expect(queuePublisher).not.toHaveBeenCalled();
        });

        it('waits for the publisher job, then ends as done', async () => {
            await runToTheEnd();
            mockJob('active');
            await advanceSiteGeneration(ctx);
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'publishing',
            );

            mockJob('completed');
            await advanceSiteGeneration(ctx);
            expect((await siteGeneration.findCurrent())?.status).toBe('done');
        });

        it('goes to error with the reason of a failed publication', async () => {
            await runToTheEnd();
            mockJob('failed', 'boom');

            await advanceSiteGeneration(ctx);

            expect(await getSiteGenerationView(ctx)).toEqual(
                expect.objectContaining({
                    status: 'error',
                    publication: { state: 'error', message: 'boom' },
                }),
            );
        });

        it('puts a vanished publisher job in error, to publish again', async () => {
            await runToTheEnd();
            jest.mocked(getJobState).mockResolvedValue(null);

            await advanceSiteGeneration(ctx);

            const current = await siteGeneration.findCurrent();
            expect(current?.status).toBe('error');
            expect(current?.publishError).toBe(PUBLICATION_LOST);
        });

        it('relaunches only the publication when it failed', async () => {
            await runToTheEnd();
            const failedJobId = (await siteGeneration.findCurrent())
                ?.publishJobId;
            mockJob('failed', 'boom');
            await advanceSiteGeneration(ctx);
            jest.mocked(queuePrecomputed).mockClear();

            expect(await relaunchSiteGeneration(ctx)).toBe(true);

            const current = await siteGeneration.findCurrent();
            expect(current?.status).toBe('publishing');
            expect(current?.publishJobId).not.toBe(failedJobId);
            expect(queuePublisher).toHaveBeenCalledTimes(2);
            expect(queuePrecomputed).not.toHaveBeenCalled();
        });

        it('cancels the publisher job of a lost transition', async () => {
            await start(ONE_STEP, { autoPublish: true });
            await advanceSiteGeneration(ctx);
            finishPosition(1);
            jest.spyOn(siteGeneration, 'transition').mockResolvedValueOnce(
                null,
            );

            await advanceSiteGeneration(ctx);

            expect(cancelPublisherJob).toHaveBeenCalledWith(
                ctx,
                jest.mocked(queuePublisher).mock.calls[0][1],
            );
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'running',
            );
        });

        it('stops a publication and cancels its job', async () => {
            await runToTheEnd();
            const { publishJobId } = (await siteGeneration.findCurrent())!;

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
            expect(cancelPublisherJob).toHaveBeenCalledWith(ctx, publishJobId);
        });

        it('still stops when the publisher job cannot be cancelled', async () => {
            await runToTheEnd();
            (cancelPublisherJob as jest.Mock).mockRejectedValueOnce(
                new Error('redis down'),
            );

            expect(await stopSiteGeneration(ctx)).toBe(true);

            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('does not cancel any publisher job when stopping a running generation', async () => {
            await start(ONE_STEP, { autoPublish: true });

            await stopSiteGeneration(ctx);

            expect(cancelPublisherJob).not.toHaveBeenCalled();
        });

        it('shows the publication only with autoPublish', async () => {
            await start(ONE_STEP, { autoPublish: true });
            expect((await getSiteGenerationView(ctx))?.publication).toEqual({
                state: 'waiting',
            });

            await start(ONE_STEP);
            expect(
                (await getSiteGenerationView(ctx))?.publication,
            ).toBeUndefined();
        });
    });
});
