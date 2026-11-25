import { randomUUID } from 'node:crypto';

import {
    isSiteGenerationActive as isActiveStatus,
    toWaitingLaunchSteps,
    TaskStatus,
    type SiteGenerationCounter,
    type SiteGenerationView,
} from '@lodex/common';
import type {
    SiteGeneration,
    SiteGenerationCollection,
    SiteGenerationStep,
} from '../../models/siteGeneration';
import { getOrCreateWorkerQueue, isJobRunning } from '../../workers';
import {
    cancelJob,
    cancelPublisherJob,
    getActiveJob,
    getJobState,
    getPublisherJobStateSince,
    getWaitingJobs,
    queuePublisher,
} from '../../workers/tools';
import {
    queueEnrichment,
    queuePrecomputed,
    type LaunchContext,
} from '../launchTasks';
import getLogger from '../logger';
import { invalidateRepositories } from '../repositoryMiddleware';
import { failWizardGeneration, queueModelImport } from './wizardJobs';

// Automatic relaunches of a step in error, after its first run: a step that
// keeps failing runs 1 + SITE_GENERATION_MAX_RELAUNCHES times, then the
// generation goes to error
export const SITE_GENERATION_MAX_RELAUNCHES = 3;

// A job that just ended may not have moved its generation on yet (its end
// hook runs right after), and a generation just updated may not have queued
// its job yet: a job is lost only once this delay has passed
export const SITE_GENERATION_JOB_GRACE_PERIOD = 60_000;

// just moved on: the job of its new state may not be queued yet
const isInGracePeriod = (generation: SiteGeneration, now: Date) =>
    now.getTime() - generation.updatedAt.getTime() <
    SITE_GENERATION_JOB_GRACE_PERIOD;

export type SiteGenerationContext = LaunchContext & {
    siteGeneration: SiteGenerationCollection;
    // dropped when « Réessayer » ends a generation failed in its data phase
    dataset: LaunchContext['dataset'] & { drop(): Promise<unknown> };
};

// The publisher job is gone (Bull keeps the last finished jobs only, a
// publication by hand drops the waiting ones): whether it published cannot be
// told, an earlier publication may still be online. "Relancer" publishes again.
export const PUBLICATION_LOST = 'site_generation_publication_lost';

// What reading the generation and its targets needs
type ReadContext = Pick<
    SiteGenerationContext,
    'siteGeneration' | 'enrichment' | 'precomputed'
>;

type Target = { status?: string; message?: string; jobId?: unknown };

type StepWithTarget = { step: SiteGenerationStep; target: Target | null };

const repositoryOf = (ctx: ReadContext, type: SiteGenerationStep['type']) =>
    type === 'precomputed' ? ctx.precomputed : ctx.enrichment;

// A step is launched once a job has been queued for it (it then has a jobId)
const isLaunched = (step: SiteGenerationStep) => step.jobId != null;

// One query per type of target, not one per step: the view is polled
const readTargets = async (
    ctx: ReadContext,
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

// Queued only once the transition is won: two passes (periodic sweep, end of
// the last step) can end the launch together, and cancelling the job of the
// losing one would hit any publisher job, the winner's included. A pass
// reading the publishing generation before its job is queued waits for it
// (see advancePublication).
const startPublication = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
): Promise<boolean> => {
    const publishJobId = randomUUID();
    const publishing = await ctx.siteGeneration.transition(generation, {
        status: 'publishing',
        // an earlier publishError is replaced once this one ends
        publishJobId,
    });
    if (!publishing) {
        return false;
    }
    try {
        await queuePublisher(ctx.tenant, publishJobId);
    } catch (error) {
        await ctx.siteGeneration.transition(publishing, {
            status: 'error',
            publishError: (error as Error).message,
        });
        // « Réessayer » must answer its failure
        throw error;
    }
    // « Arrêter » between the transition and the queue found no job to
    // cancel: cancel this one, by its id (a finished one is left alone)
    const current = await ctx.siteGeneration.findCurrent();
    if (
        current?.status !== 'publishing' ||
        current.publishJobId !== publishJobId
    ) {
        try {
            await cancelPublisherJob(ctx, publishJobId);
        } catch (error) {
            getLogger(ctx.tenant).error(
                `Site generation: unable to cancel a stopped publication: ${(error as Error).message}`,
            );
        }
    }
    return true;
};

const advancePublication = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
    now: Date,
) => {
    // its own job, else the publication that dropped it from the queue (one
    // launched by hand meanwhile): the site is published all the same
    const job =
        (await getJobState(ctx.tenant, generation.publishJobId!)) ??
        (await getPublisherJobStateSince(ctx.tenant, generation.updatedAt)) ??
        null;
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
    // the pass that started the publication may not have queued its job yet
    if (isInGracePeriod(generation, now)) {
        return;
    }
    await ctx.siteGeneration.transition(generation, {
        status: 'error',
        publishError: PUBLICATION_LOST,
    });
};

// Every step is done (or the model launches nothing): the generation ends, or
// publishes the site first
const endLaunch = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    if (generation.autoPublish) {
        await startPublication(ctx, generation);
        return;
    }
    await ctx.siteGeneration.transition(generation, { status: 'done' });
};

const nextPosition = (generation: SiteGeneration) => {
    const positions = generation.steps
        .map((step) => step.position)
        .filter((position) => position > generation.position);
    return positions.length ? Math.min(...positions) : null;
};

export const advanceSiteGeneration = async (
    ctx: SiteGenerationContext,
    now = new Date(),
): Promise<void> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (generation?.status === 'publishing') {
        await advancePublication(ctx, generation, now);
        return;
    }
    // Before its launch phase, the job of the wizard drives the generation
    if (
        !generation ||
        generation.status !== 'running' ||
        generation.phase !== 'launch'
    ) {
        return;
    }
    if (!generation.steps.length) {
        await endLaunch(ctx, generation);
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
            // a data add runs again the steps of a model: their results are
            // replaced by the ones of the new data
            relaunch: generation.kind === 'addData',
        });
        return;
    }

    const failed = current.filter(isInError);
    const errors = failed.map(({ step }) => step);
    if (
        errors.some((step) => step.attempts >= SITE_GENERATION_MAX_RELAUNCHES)
    ) {
        await ctx.siteGeneration.transition(generation, { status: 'error' });
        return;
    }

    if (errors.length) {
        // the relaunch clears the target: its error is kept on the step, for
        // the dialog to tell why the step runs again
        const steps = updateSteps(generation, errors, (step) => ({
            attempts: step.attempts + 1,
            lastError:
                failed.find((other) => sameStep(other.step, step))?.target
                    ?.message ?? '',
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
            // launch the next steps now rather than on the next pass
            if (await ctx.siteGeneration.transition(generation, { position })) {
                await advanceSiteGeneration(ctx, now);
            }
        } else {
            await endLaunch(ctx, generation);
        }
    }
};

// What a failed import may have left in the dataset (a plain failure does not
// empty it, unlike a cancellation). A data add keeps the dataset it was adding
// to: only the wizard drops.
const dropFailedImport = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    if (generation.kind === 'addData') {
        return;
    }
    await ctx.dataset.drop();
    invalidateRepositories(ctx.tenant);
};

// The server does not keep the uploaded file: the generation ends, and what
// the failed import left is removed. The admin goes back to the wizard.
const relaunchDataPhase = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    const stopped = await ctx.siteGeneration.transition(generation, {
        status: 'stopped',
    });
    if (!stopped) {
        return false;
    }
    await dropFailedImport(ctx, generation);
    return true;
};

// The data are kept: the model job runs again, from the model restoration
const relaunchModelPhase = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    const modelJobId = randomUUID();
    const relaunched = await ctx.siteGeneration.transition(
        generation,
        { status: 'running', phase: 'model', modelJobId },
        { unset: ['message', 'detail'] },
    );
    if (!relaunched) {
        return false;
    }
    try {
        await queueModelImport(ctx, generation.runId, modelJobId);
    } catch (e) {
        await failWizardGeneration(ctx, generation.runId, (e as Error).message);
    }
    return true;
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
    if (generation.phase === 'data') {
        return relaunchDataPhase(ctx, generation);
    }
    if (generation.phase !== 'launch') {
        return relaunchModelPhase(ctx, generation);
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
    const relaunched = await ctx.siteGeneration.transition(
        generation,
        { status: 'running', steps },
        { unset: ['message', 'detail'] },
    );
    if (!relaunched) {
        return false;
    }
    await queueSteps(ctx, generation.runId, pickSteps(steps, errors), {
        relaunch: true,
    });
    return true;
};

// A generation in error still waits for "Relancer" or "Arrêter". A
// generation stopping waits for its model job: it cannot be stopped again.
const STOPPABLE_STATUSES = ['running', 'publishing', 'error'];

// A task launched by hand gets a jobId of its own: the generation would then
// never see its step finish nor fail, and stay running until "Arrêter"
export const isSiteGenerationActive = async (
    ctx: Pick<SiteGenerationContext, 'siteGeneration'>,
) => {
    const generation = await ctx.siteGeneration.findCurrent();
    return isActiveStatus(generation?.status);
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
// The job of the wizard (data import or model), by its bull job id. A job
// that no longer exists (crash, restart, removed from Redis) gives null.
const findWizardJob = async (
    ctx: SiteGenerationContext,
    jobId: string | undefined,
) => {
    if (!jobId) {
        return null;
    }
    const job = await getOrCreateWorkerQueue(ctx.tenant, 1).getJob(jobId);
    return job ? { job, state: await job.getState() } : null;
};

type WizardJob = NonNullable<Awaited<ReturnType<typeof findWizardJob>>>;

const NOT_STARTED_STATES = ['waiting', 'delayed', 'paused'];

// A job running or not started yet will still move its generation on
const isAlive = (found: WizardJob | null) =>
    !!found &&
    (found.state === 'active' || NOT_STARTED_STATES.includes(found.state));

// A restoration stopped halfway would leave the instance inconsistent: an
// active model job ends on its own and turns `stopping` into `stopped`. A job
// not started yet is removed (it may start meanwhile: it then ends as well).
const modelPhaseStopStatus = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
): Promise<'stopped' | 'stopping'> => {
    const found = await findWizardJob(ctx, generation.modelJobId);
    if (found?.state === 'active') {
        return 'stopping';
    }
    if (found && NOT_STARTED_STATES.includes(found.state)) {
        try {
            await found.job.remove();
        } catch {
            return 'stopping';
        }
    }
    return 'stopped';
};

// The import ends the generation as well when cancelled; a stopped generation
// is left alone by the end of its import
const stopDataImport = async (
    ctx: SiteGenerationContext,
    generation: SiteGeneration,
) => {
    const found = await findWizardJob(ctx, generation.importJobId);
    if (found && NOT_STARTED_STATES.includes(found.state)) {
        try {
            await found.job.remove();
            return;
        } catch {
            // started meanwhile: cancelled below
        }
    }
    if (!found || found.state === 'completed' || found.state === 'failed') {
        return;
    }
    // the import may have ended meanwhile, and another one started by hand:
    // only the generation's own import is cancelled
    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob && String(activeJob.id) === generation.importJobId) {
        await cancelJob(ctx, 'import');
    }
};

// The model job of a generation in `stopping` ends it. A job that died (crash,
// restart, removed from Redis) never will: the periodic pass ends it instead.
// Losing the transition is fine (the job, or another pass, won it).
export const settleStoppingSiteGeneration = async (
    ctx: SiteGenerationContext,
): Promise<void> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (generation?.status !== 'stopping') {
        return;
    }
    if (
        isJobRunning(generation.modelJobId) ||
        isAlive(await findWizardJob(ctx, generation.modelJobId))
    ) {
        return;
    }
    await ctx.siteGeneration.transition(generation, { status: 'stopped' });
};

const isLost = (found: WizardJob | null, now: Date) =>
    !found ||
    (!isAlive(found) &&
        (found.job.finishedOn == null ||
            now.getTime() - found.job.finishedOn >
                SITE_GENERATION_JOB_GRACE_PERIOD));

// Before the launch phase, the job of the wizard moves the generation on. A
// job that died (crash, restart, removed from Redis) never will: the periodic
// pass puts the generation in error, which « Réessayer » or « Arrêter » end.
// Losing the transition is fine (the job, or another pass, won it).
export const failLostSiteGenerationJob = async (
    ctx: SiteGenerationContext,
    now = new Date(),
): Promise<void> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (generation?.status !== 'running' || generation.phase === 'launch') {
        return;
    }
    // just started, moved to the model phase or relaunched: its job may not
    // be queued yet
    if (isInGracePeriod(generation, now)) {
        return;
    }
    const jobId =
        generation.phase === 'data'
            ? generation.importJobId
            : generation.modelJobId;
    // Bull may no longer see as running a job this process still runs (its
    // lock lost): its end moves the generation on
    if (isJobRunning(jobId)) {
        return;
    }
    const found = await findWizardJob(ctx, jobId);
    if (!isLost(found, now)) {
        return;
    }
    getLogger(ctx.tenant).warn(`Site generation job lost: ${jobId}`, {
        phase: generation.phase,
        state: found?.state ?? 'missing',
        failedReason: found?.job.failedReason,
        finishedOn: found?.job.finishedOn,
    });
    await ctx.siteGeneration.transition(generation, {
        status: 'error',
        message: 'site_generation_job_lost',
    });
};

// The periodic pass (or the model job) can win the transition first: try
// again on fresh data
const STOP_TRIES = 5;

const transitionToStopped = async (
    ctx: SiteGenerationContext,
): Promise<{ previous: SiteGeneration; stopped: SiteGeneration } | null> => {
    for (let i = 0; i < STOP_TRIES; i++) {
        const generation = await ctx.siteGeneration.findCurrent();
        if (!generation || !STOPPABLE_STATUSES.includes(generation.status)) {
            return null;
        }
        const { phase } = generation;
        const status =
            phase === 'model' || phase === 'settings'
                ? await modelPhaseStopStatus(ctx, generation)
                : 'stopped';
        const stopped = await ctx.siteGeneration.transition(generation, {
            status,
        });
        if (stopped) {
            return { previous: generation, stopped };
        }
    }
    return null;
};

export const stopSiteGeneration = async (
    ctx: SiteGenerationContext,
): Promise<boolean> => {
    const transitioned = await transitionToStopped(ctx);
    if (!transitioned) {
        return false;
    }
    const { previous, stopped } = transitioned;
    if (stopped.phase === 'data') {
        // a failed import is over: as « Réessayer », drop what it left. A
        // running one is cancelled by its worker, which empties the dataset
        // unless the import keeps it (a data add: its job carries
        // keepDatasetOnCancel).
        if (previous.status === 'error') {
            await dropFailedImport(ctx, previous);
            return true;
        }
        await stopDataImport(ctx, stopped);
        return true;
    }
    if (stopped.phase !== 'launch') {
        return true;
    }

    // a failed publication has nothing left to cancel
    if (stopped.publishJobId) {
        try {
            await cancelPublisherJob(ctx, stopped.publishJobId);
        } catch (error) {
            getLogger(ctx.tenant).error(
                `Site generation: unable to cancel the publication: ${(error as Error).message}`,
            );
        }
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
): Pick<SiteGenerationView['steps'][number], 'state' | 'message' | 'retry'> => {
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
    if (step.attempts > 0) {
        return {
            state: 'running',
            retry: {
                attempt: step.attempts,
                max: SITE_GENERATION_MAX_RELAUNCHES,
                ...(step.lastError && { message: step.lastError }),
            },
        };
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

const countSteps = (
    steps: SiteGenerationView['steps'],
    type: SiteGenerationStep['type'],
): SiteGenerationCounter => {
    const ofType = steps.filter((step) => step.type === type);
    return {
        done: ofType.filter((step) => step.state === 'done').length,
        total: ofType.length,
        error: ofType.filter((step) => step.state === 'error').length,
    };
};

// Real counters in the launch phase; before it, the counts of the model's
// launch order, as an estimate
const launchCounters = (
    generation: SiteGeneration,
    steps: SiteGenerationView['steps'],
): SiteGenerationView['launch'] => {
    if (generation.phase === 'launch') {
        return steps.length
            ? {
                  enrichment: countSteps(steps, 'enrichment'),
                  precomputed: countSteps(steps, 'precomputed'),
              }
            : null;
    }
    if (!generation.estimate) {
        return null;
    }
    const estimated = (total: number) => ({ done: 0, total, error: 0 });
    return {
        enrichment: estimated(generation.estimate.enrichment),
        precomputed: estimated(generation.estimate.precomputed),
    };
};

export const getSiteGenerationView = async (
    ctx: ReadContext,
): Promise<SiteGenerationView | null> => {
    const generation = await ctx.siteGeneration.findCurrent();
    if (!generation) {
        return null;
    }
    const targets = await readTargets(ctx, generation.steps);
    // before the launch, the steps of the site are unknown: those planned
    // by the model wait
    const steps =
        generation.phase !== 'launch' && generation.plannedSteps
            ? toWaitingLaunchSteps(generation.plannedSteps)
            : targets.map(({ step, target }) => ({
                  name: step.name,
                  type: step.type,
                  position: step.position,
                  ...toState(step, target),
              }));
    const { choice, importedLines, message, detail, themeNotFound } =
        generation;
    // a wizard has its model in its choice, a data add on its own
    const modelId = generation.modelId ?? choice?.modelId;
    return {
        kind: generation.kind,
        status: generation.status,
        phase: generation.phase,
        ...(modelId && { modelId }),
        ...(choice && {
            settings: {
                siteName: !!choice.siteName,
                siteDescription: !!choice.siteDescription,
            },
        }),
        ...(importedLines != null && { importedLines }),
        ...(message && { message }),
        ...(detail && { detail }),
        ...(themeNotFound && { themeNotFound }),
        launch: launchCounters(generation, steps),
        steps,
        ...(generation.autoPublish && {
            publication: toPublicationState(generation),
        }),
    };
};
