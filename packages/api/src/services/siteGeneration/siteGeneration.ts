import { randomUUID } from 'node:crypto';

import { TaskStatus, type SiteGenerationView } from '@lodex/common';
import type {
    SiteGeneration,
    SiteGenerationCollection,
    SiteGenerationStep,
} from '../../models/siteGeneration';
import {
    cancelJob,
    cancelPublisherJob,
    getActiveJob,
    getJobState,
    getWaitingJobs,
    queuePublisher,
} from '../../workers/tools';
import {
    queueEnrichment,
    queuePrecomputed,
    type LaunchContext,
} from '../launchTasks';
import getLogger from '../logger';

// Automatic relaunches of a step in error, after its first run: a step that
// keeps failing runs 1 + SITE_GENERATION_MAX_RELAUNCHES times, then the
// generation goes to error
export const SITE_GENERATION_MAX_RELAUNCHES = 3;

export type SiteGenerationContext = LaunchContext & {
    siteGeneration: SiteGenerationCollection;
};

// The publisher job is gone (Bull keeps the last finished jobs only, a
// publication by hand drops the waiting ones): whether it published cannot be
// told, an earlier publication may still be online. "Relancer" publishes again.
export const PUBLICATION_LOST = 'site_generation_publication_lost';

type Target = { status?: string; message?: string; jobId?: unknown };

type StepWithTarget = { step: SiteGenerationStep; target: Target | null };

const repositoryOf = (
    ctx: SiteGenerationContext,
    type: SiteGenerationStep['type'],
) => (type === 'precomputed' ? ctx.precomputed : ctx.enrichment);

// A step is launched once a job has been queued for it (it then has a jobId)
const isLaunched = (step: SiteGenerationStep) => step.jobId != null;

// One query per type of target, not one per step: the view is polled
const readTargets = async (
    ctx: SiteGenerationContext,
    steps: SiteGenerationStep[],
): Promise<StepWithTarget[]> => {
    const targetsByType = await Promise.all(
        (['precomputed', 'enrichment'] as const).map(async (type) => {
            const ids = steps
                .filter((step) => step.type === type)
                .map((step) => step.targetId);
            const targets = await repositoryOf(ctx, type).findStatesByIds(ids);
            return [
                type,
                new Map(targets.map((target) => [String(target._id), target])),
            ] as const;
        }),
    );
    const byType = new Map(targetsByType);
    return steps.map((step) => ({
        step,
        target: byType.get(step.type)?.get(step.targetId) ?? null,
    }));
};

// The status of a target belongs to the step only once the job queued for
// it has written its jobId (with PENDING). Until then, the target can still
// show the status of an earlier run (FINISHED, or ERROR before a relaunch):
// the step is in flight.
const isInFlight = ({ step, target }: StepWithTarget) =>
    !!target &&
    (target.jobId == null ? undefined : String(target.jobId)) !== step.jobId;

// A deleted target is ignored, as a finished one
const isFinished = (stepWithTarget: StepWithTarget) =>
    !stepWithTarget.target ||
    (!isInFlight(stepWithTarget) &&
        stepWithTarget.target.status === TaskStatus.FINISHED);

// A step canceled outside of "stop" counts as an error
const isInError = (stepWithTarget: StepWithTarget) =>
    !isInFlight(stepWithTarget) &&
    (stepWithTarget.target?.status === TaskStatus.ERROR ||
        stepWithTarget.target?.status === TaskStatus.CANCELED);

const sameStep = (a: SiteGenerationStep, b: SiteGenerationStep) =>
    a.type === b.type && a.targetId === b.targetId;

const updateSteps = (
    generation: SiteGeneration,
    steps: SiteGenerationStep[],
    update: (step: SiteGenerationStep) => Partial<SiteGenerationStep>,
) =>
    generation.steps.map((step) =>
        steps.some((other) => sameStep(step, other))
            ? { ...step, ...update(step) }
            : step,
    );

// The updated steps that match the given ones (to get their new jobId)
const pickSteps = (
    updated: SiteGenerationStep[],
    steps: SiteGenerationStep[],
) => updated.filter((step) => steps.some((other) => sameStep(step, other)));

// Precomputations first: they free the queue quickly by going ON_HOLD
const precomputedFirst = (steps: SiteGenerationStep[]) => [
    ...steps.filter((step) => step.type === 'precomputed'),
    ...steps.filter((step) => step.type !== 'precomputed'),
];

// Best effort: put the target in error with the step's jobId, so that the
// next pass sees an error that belongs to the step, counts an attempt and
// retries it (up to SITE_GENERATION_MAX_RELAUNCHES). Without it, the target
// would keep another jobId (or a PENDING with no job) and the step would stay
// in flight forever. A missing target is left alone: it counts as finished.
const markQueueFailure = async (
    ctx: SiteGenerationContext,
    step: SiteGenerationStep,
    message: string,
) => {
    try {
        const repository = repositoryOf(ctx, step.type);
        if (!(await repository.findOneById(step.targetId))) {
            return;
        }
        await repository.updateStatus(step.targetId, TaskStatus.ERROR, {
            jobId: step.jobId,
            message,
        });
    } catch (error) {
        getLogger(ctx.tenant).error(
            `Site generation: unable to put the ${step.type} "${step.name}" in error: ${(error as Error).message}`,
        );
    }
};

// "Arrêter" (or a relaunch) can win while the steps are being queued, a
// relaunch first removing the previous results, which can be long: a step is
// queued only while its generation still runs it with the same jobId
const isStillQueuedBy =
    (ctx: SiteGenerationContext, runId: string, step: SiteGenerationStep) =>
    async () => {
        const latest = await ctx.siteGeneration.findCurrent();
        return (
            latest?.status === 'running' &&
            latest.runId === runId &&
            latest.steps.some(
                (other) => sameStep(other, step) && other.jobId === step.jobId,
            )
        );
    };

// Called only by the process that won the transition. A failure is logged and
// written on the target (see markQueueFailure), it never stops the pass.
const queueSteps = async (
    ctx: SiteGenerationContext,
    runId: string,
    steps: SiteGenerationStep[],
    { relaunch }: { relaunch: boolean },
) => {
    for (const step of precomputedFirst(steps)) {
        const isStillWanted = isStillQueuedBy(ctx, runId, step);
        try {
            if (step.type === 'precomputed') {
                await queuePrecomputed(ctx, step.targetId, {
                    jobId: step.jobId,
                    relaunch,
                    isStillWanted,
                });
            } else {
                await queueEnrichment(ctx, step.targetId, {
                    jobId: step.jobId,
                    lifo: false,
                    relaunch,
                    isStillWanted,
                });
            }
        } catch (error) {
            const { message } = error as Error;
            getLogger(ctx.tenant).error(
                `Site generation: unable to queue the ${step.type} "${step.name}": ${message}`,
            );
            await markQueueFailure(ctx, step, message);
        }
    }
};

// Queued before the transition: a pass reading the publishing generation must
// find its job. The job of a lost transition (stop, other pass) is cancelled,
// even if the worker already runs it.
const startPublication = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
): Promise<boolean> => {
    const publishJobId = randomUUID();
    await queuePublisher(ctx.tenant, publishJobId);
    const publishing = await ctx.siteGeneration.transition(generation, {
        status: 'publishing',
        // an earlier publishError is replaced once this one ends
        publishJobId,
    });
    if (publishing) {
        return true;
    }
    try {
        await cancelPublisherJob(ctx, publishJobId);
    } catch (error) {
        getLogger(ctx.tenant).error(
            `Site generation: unable to cancel an unwanted publication: ${(error as Error).message}`,
        );
    }
    return false;
};

const advancePublication = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    const job = await getJobState(ctx.tenant, generation.publishJobId!);
    if (job?.state === 'completed') {
        await ctx.siteGeneration.transition(generation, { status: 'done' });
        return;
    }
    if (job?.state === 'failed') {
        await ctx.siteGeneration.transition(generation, {
            status: 'error',
            publishError: job.failedReason,
        });
        return;
    }
    if (job) {
        // waiting or active ("Arrêter" gets out of a job that never ends)
        return;
    }
    await ctx.siteGeneration.transition(generation, {
        status: 'error',
        publishError: PUBLICATION_LOST,
    });
};

const nextPosition = (generation: SiteGeneration) => {
    const positions = generation.steps
        .map((step) => step.position)
        .filter((position) => position > generation.position);
    return positions.length ? Math.min(...positions) : null;
};

export const advanceSiteGeneration = async (
    ctx: SiteGenerationContext,
): Promise<void> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (generation?.status === 'publishing') {
        await advancePublication(ctx, generation);
        return;
    }
    if (!generation || generation.status !== 'running') {
        return;
    }

    const currentSteps = generation.steps.filter(
        (step) => step.position === generation.position,
    );
    const current = await readTargets(ctx, currentSteps);

    if (!currentSteps.some(isLaunched)) {
        const steps = updateSteps(generation, currentSteps, () => ({
            jobId: randomUUID(),
        }));
        const launched = await ctx.siteGeneration.transition(generation, {
            steps,
        });
        if (!launched) {
            return;
        }
        const existing = current
            .filter(({ target }) => target)
            .map(({ step }) => step);
        await queueSteps(ctx, generation.runId, pickSteps(steps, existing), {
            relaunch: false,
        });
        return;
    }

    const errors = current.filter(isInError).map(({ step }) => step);
    if (
        errors.some((step) => step.attempts >= SITE_GENERATION_MAX_RELAUNCHES)
    ) {
        await ctx.siteGeneration.transition(generation, { status: 'error' });
        return;
    }

    if (errors.length) {
        const steps = updateSteps(generation, errors, (step) => ({
            attempts: step.attempts + 1,
            jobId: randomUUID(),
        }));
        const counted = await ctx.siteGeneration.transition(generation, {
            steps,
        });
        if (counted) {
            await queueSteps(ctx, generation.runId, pickSteps(steps, errors), {
                relaunch: true,
            });
        }
        return;
    }

    if (current.every(isFinished)) {
        const position = nextPosition(generation);
        if (position !== null) {
            await ctx.siteGeneration.transition(generation, { position });
        } else if (generation.autoPublish) {
            await startPublication(ctx, generation);
        } else {
            await ctx.siteGeneration.transition(generation, {
                status: 'done',
            });
        }
    }
};

export const relaunchSiteGeneration = async (
    ctx: SiteGenerationContext,
): Promise<boolean> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (!generation || generation.status !== 'error') {
        return false;
    }
    // every step was done: only the publication failed
    if (generation.publishJobId) {
        return startPublication(ctx, generation);
    }

    const current = await readTargets(
        ctx,
        generation.steps.filter(
            (step) => step.position === generation.position,
        ),
    );
    const errors = current.filter(isInError).map(({ step }) => step);
    const steps = updateSteps(generation, errors, () => ({
        attempts: 0,
        jobId: randomUUID(),
    }));
    const relaunched = await ctx.siteGeneration.transition(generation, {
        status: 'running',
        steps,
    });
    if (!relaunched) {
        return false;
    }
    await queueSteps(ctx, generation.runId, pickSteps(steps, errors), {
        relaunch: true,
    });
    return true;
};

// A generation in error still waits for "Relancer" or "Arrêter"
const STOPPABLE_STATUSES = ['running', 'publishing', 'error'];

// A task launched by hand gets a jobId of its own: the generation would then
// never see its step finish nor fail, and stay running until "Arrêter"
export const isSiteGenerationActive = async (
    ctx: Pick<SiteGenerationContext, 'siteGeneration'>,
) => {
    const generation = await ctx.siteGeneration.findCurrent();
    return !!generation && STOPPABLE_STATUSES.includes(generation.status);
};

// Wraps a koa-route handler that launches tasks by hand
export const refusedDuringSiteGeneration =
    <Args extends unknown[]>(
        handler: (ctx: any, ...args: Args) => Promise<void>,
    ) =>
    async (ctx: any, ...args: Args) => {
        if (await isSiteGenerationActive(ctx)) {
            ctx.status = 409;
            ctx.body = { error: 'site_generation_in_progress' };
            return;
        }
        await handler(ctx, ...args);
    };
// The periodic pass can win the transition first: try again on fresh data
const STOP_TRIES = 5;

const transitionToStopped = async (
    ctx: SiteGenerationContext,
): Promise<SiteGeneration | null> => {
    for (let i = 0; i < STOP_TRIES; i++) {
        const generation = await ctx.siteGeneration.findCurrent();
        if (!generation || !STOPPABLE_STATUSES.includes(generation.status)) {
            return null;
        }
        const stopped = await ctx.siteGeneration.transition(generation, {
            status: 'stopped',
        });
        if (stopped) {
            return stopped;
        }
    }
    return null;
};

export const stopSiteGeneration = async (
    ctx: SiteGenerationContext,
): Promise<boolean> => {
    const stopped = await transitionToStopped(ctx);
    if (!stopped) {
        return false;
    }

    // a failed publication has nothing left to cancel
    if (stopped.publishJobId) {
        await cancelPublisherJob(ctx, stopped.publishJobId);
    }

    const launched = await readTargets(ctx, stopped.steps.filter(isLaunched));
    const unfinished = launched.filter(
        (stepWithTarget) => !isFinished(stepWithTarget),
    );
    const toCancel = unfinished.map(({ step }) => step);
    if (!toCancel.length) {
        return true;
    }

    const isStepJob = (job: { data?: { id?: unknown } } | undefined) =>
        toCancel.some((step) => String(job?.data?.id) === step.targetId);

    const waitingJobs = await getWaitingJobs(ctx.tenant);
    for (const job of waitingJobs.filter(isStepJob)) {
        await job.remove();
    }

    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob && isStepJob(activeJob)) {
        await cancelJob(ctx, activeJob.data.jobType);
    }

    // A target in ERROR keeps its status and message. A target still FINISHED
    // from an earlier run (step in flight) has nothing to cancel.
    const toMarkCanceled = unfinished
        .filter(
            ({ target }) =>
                target?.status !== TaskStatus.ERROR &&
                target?.status !== TaskStatus.FINISHED,
        )
        .map(({ step }) => step);
    for (const type of ['precomputed', 'enrichment'] as const) {
        await repositoryOf(ctx, type).cancelByIds(
            toMarkCanceled
                .filter((step) => step.type === type)
                .map((step) => step.targetId),
        );
    }
    return true;
};

const toState = (
    step: SiteGenerationStep,
    target: Target | null,
): Pick<SiteGenerationView['steps'][number], 'state' | 'message'> => {
    if (!isLaunched(step)) {
        return { state: 'waiting' };
    }
    if (isFinished({ step, target })) {
        return { state: 'done' };
    }
    if (isInError({ step, target })) {
        return target?.message
            ? { state: 'error', message: target.message }
            : { state: 'error' };
    }
    return { state: 'running' };
};

const toPublicationState = (
    generation: SiteGeneration,
): NonNullable<SiteGenerationView['publication']> => {
    if (generation.status === 'publishing') {
        return { state: 'running' };
    }
    if (generation.status === 'done') {
        return { state: 'done' };
    }
    if (generation.status === 'error' && generation.publishJobId) {
        return generation.publishError
            ? { state: 'error', message: generation.publishError }
            : { state: 'error' };
    }
    return { state: 'waiting' };
};

export const getSiteGenerationView = async (
    ctx: SiteGenerationContext,
): Promise<SiteGenerationView | null> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (!generation) {
        return null;
    }
    const steps = await readTargets(ctx, generation.steps);
    return {
        status: generation.status,
        steps: steps.map(({ step, target }) => ({
            name: step.name,
            type: step.type,
            position: step.position,
            ...toState(step, target),
        })),
        ...(generation.autoPublish && {
            publication: toPublicationState(generation),
        }),
    };
};
