import { TaskStatus } from '@lodex/common';
import omit from 'lodash/omit';
import { MongoClient } from 'mongodb';
import createSiteGenerationModel, {
    type SiteGenerationCollection,
    type SiteGenerationStep,
} from '../../models/siteGeneration';
import { cancelJob, getActiveJob, getWaitingJobs } from '../../workers/tools';
import { queueEnrichment, queuePrecomputed } from '../launchTasks';
import {
    advanceSiteGeneration,
    getSiteGenerationView,
    refusedDuringSiteGeneration,
    relaunchSiteGeneration,
    SITE_GENERATION_MAX_RELAUNCHES,
    stopSiteGeneration,
    type SiteGenerationContext,
} from './siteGeneration';

jest.mock('../launchTasks');
jest.mock('../../workers/tools');

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
        ctx = {
            tenant: 'lodex_test',
            enrichment,
            precomputed,
            dataset: { removeAttribute: jest.fn() },
            dataSource: { removeAttribute: jest.fn() },
            siteGeneration,
        } as unknown as SiteGenerationContext;
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await siteGeneration.deleteMany({});
    });

    const finishPosition = (position: number) => {
        for (const s of STEPS.filter((s) => s.position === position)) {
            setStatus(s.name, TaskStatus.FINISHED);
        }
    };

    describe('advanceSiteGeneration', () => {
        it('queues the first position once', async () => {
            await siteGeneration.start(STEPS);

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
            await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS.filter((s) => s.position === 3));

            await advanceSiteGeneration(ctx);

            expect(order).toEqual(['resumeFr-id', 'resume-id']);
        });

        it('does not move on while a step of the position is not finished', async () => {
            await siteGeneration.start(STEPS);
            await advanceSiteGeneration(ctx);
            setStatus('clusterRameau', TaskStatus.ON_HOLD);

            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(1);
        });

        it('counts a finished enrichment with lines in error as finished', async () => {
            await siteGeneration.start(STEPS.filter((s) => s.position >= 2));
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
                const generation = await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS.filter((s) => s.position === 2));
            await advanceSiteGeneration(ctx);
            setStatus('xml', TaskStatus.CANCELED);

            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([
                { id: 'xml-id', options: { lifo: false, relaunch: false } },
                { id: 'xml-id', options: { relaunch: true, lifo: false } },
            ]);
        });

        it(`puts the generation in error after ${SITE_GENERATION_MAX_RELAUNCHES} attempts`, async () => {
            const generation = await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS);

            await expect(advanceSiteGeneration(ctx)).resolves.toBeUndefined();
            expect(
                (await siteGeneration.findCurrent())?.steps[0].jobId,
            ).toBeDefined();
        });

        it('puts a step in error when queuing it fails, so that a later pass relaunches it', async () => {
            await siteGeneration.start(STEPS.filter((s) => s.position === 2));
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
            await siteGeneration.start(STEPS);
            for (const position of [1, 2, 3]) {
                await advanceSiteGeneration(ctx);
                finishPosition(position);
                await advanceSiteGeneration(ctx);
            }

            expect((await siteGeneration.findCurrent())?.status).toBe('done');
            expect(queued()).toHaveLength(STEPS.length);
        });

        it('wants a queued step only while its generation runs it', async () => {
            await siteGeneration.start(STEPS);
            await advanceSiteGeneration(ctx);
            const isStillWanted = jest.mocked(queuePrecomputed).mock.calls[0][2]
                ?.isStillWanted as () => Promise<boolean>;

            expect(await isStillWanted()).toBe(true);

            await stopSiteGeneration(ctx);
            expect(await isStillWanted()).toBe(false);
        });

        it('no longer wants a step relaunched with another jobId', async () => {
            await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS);

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
            await siteGeneration.start(STEPS);

            await advanceSiteGeneration(ctx);
            await advanceSiteGeneration(ctx);

            expect((await siteGeneration.findCurrent())?.position).toBe(1);
            expect((await getSiteGenerationView(ctx))?.steps[0].state).toBe(
                'running',
            );
        });

        it('does not relaunch again a step whose relaunch is being queued', async () => {
            await siteGeneration.start(STEPS.filter((s) => s.position === 2));
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
            await siteGeneration.start(STEPS);

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
            const generation = await siteGeneration.start(STEPS);
            await siteGeneration.transition(generation, { status: 'stopped' });
            await advanceSiteGeneration(ctx);

            expect(queued()).toEqual([]);
        });
    });

    describe('stopSiteGeneration', () => {
        it('removes the waiting jobs, cancels the targets and stops the generation', async () => {
            await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS);
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
            await siteGeneration.start(STEPS);
            await advanceSiteGeneration(ctx);
            setStatus('clusterRameau', TaskStatus.ON_HOLD);

            await stopSiteGeneration(ctx);

            expect(precomputed.targets.get('clusterRameau-id')?.status).toBe(
                TaskStatus.CANCELED,
            );
        });

        it('keeps the status and message of a step in error', async () => {
            await siteGeneration.start(STEPS);
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
            const generation = await siteGeneration.start(STEPS);
            await siteGeneration.transition(generation, { status: 'error' });

            expect(await stopSiteGeneration(ctx)).toBe(true);
            expect((await siteGeneration.findCurrent())?.status).toBe(
                'stopped',
            );
        });

        it('returns false without a running or failed generation', async () => {
            expect(await stopSiteGeneration(ctx)).toBe(false);
            const generation = await siteGeneration.start(STEPS);
            await siteGeneration.transition(generation, { status: 'done' });
            expect(await stopSiteGeneration(ctx)).toBe(false);
        });
    });

    describe('relaunchSiteGeneration', () => {
        it('relaunches the steps in error of a failed generation', async () => {
            const generation = await siteGeneration.start(STEPS);
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

        it('returns false when the generation is not in error', async () => {
            await siteGeneration.start(STEPS);

            expect(await relaunchSiteGeneration(ctx)).toBe(false);
            expect(queued()).toEqual([]);
        });
    });

    describe('refusedDuringSiteGeneration', () => {
        const handler = jest.fn(async (handlerCtx: any, id: string) => {
            handlerCtx.status = 200;
            handlerCtx.body = { id };
        });

        it.each(['running', 'error'] as const)(
            'refuses a launch by hand while the generation is %s',
            async (status) => {
                const generation = await siteGeneration.start(STEPS);
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
                    const generation = await siteGeneration.start(STEPS);
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
            const generation = await siteGeneration.start([
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

        it('reads the targets in one query per type', async () => {
            await siteGeneration.start(STEPS);

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
});
