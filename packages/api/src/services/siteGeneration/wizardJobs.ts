import { getOrCreateWorkerQueue } from '../../workers';
import getLogger from '../logger';

// The job of the model phase of the wizard generation (see
// workers/modelImport). Kept apart from the services that drive the
// generation, which all queue or fail it, so that they do not import each
// other.
export const MODEL_IMPORTER = 'model-importer';

// A job of the generation could not be queued or failed unexpectedly: the
// generation would stay running without it. Only the run given is touched.
export const failWizardGeneration = async (
    ctx: any,
    runId: string,
    message: string,
): Promise<void> => {
    try {
        const current = await ctx.siteGeneration.findCurrent();
        if (current?.runId === runId) {
            await ctx.siteGeneration.transition(current, {
                status: 'error',
                message,
            });
        }
    } catch (e) {
        getLogger(ctx.tenant).error('Site generation failure write error', {
            error: (e as Error).message,
        });
    }
};

export const queueModelImport = async (
    ctx: any,
    runId: string,
    modelJobId: string,
): Promise<void> => {
    await getOrCreateWorkerQueue(ctx.tenant, 1).add(
        MODEL_IMPORTER,
        { jobType: MODEL_IMPORTER, tenant: ctx.tenant, runId },
        { jobId: modelJobId, lifo: false },
    );
};
