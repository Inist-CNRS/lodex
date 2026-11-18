import repositoryMiddleware, {
    invalidateRepositories,
} from '../services/repositoryMiddleware';
import {
    startImport,
    getLoader,
    getStreamFromUrl,
    getCustomLoader,
    getStreamFromText,
} from '../services/import';
import { clearChunks, mergeChunks } from '../services/fsHelpers';
import { saveParsedStream } from '../services/saveParsedStream';
import publishDocuments from '../services/publishDocuments';
import publishFacets from '../controller/api/publishFacets';
import saveStream from '../services/saveStream';
import getLogger from '../services/logger';
import { getImportError } from '../services/importError';
import {
    onWizardImportEnd,
    type WizardImportOutcome,
} from '../services/siteGeneration/wizardGeneration';
import { CancelWorkerError, cleanWaitingJobsOfType } from './index';

export const IMPORT = 'import';
const CANCELLED_IMPORT = 'cancelled_import';
const listeners: any = [];

// What the generation of the wizard learns of the end of its import
const SUCCESS: WizardImportOutcome = { success: true };

const failedImport = (
    message: string,
    cancelled: boolean,
    detail?: string,
): WizardImportOutcome => ({
    success: false,
    cancelled,
    message,
    ...(detail && { detail }),
});

export const processImport = (job: any, done: any) => {
    cleanWaitingJobsOfType(job.data.tenant, IMPORT);
    startJobImport(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-import`, {
                isImporting: false,
                success: !isFailed,
            });
            await notifyWizard(
                job,
                isFailed ? failedImport('import_failed', false) : SUCCESS,
            );
            done();
        })
        .catch(async (err: any) => {
            // the dataset of a cancelled import is dropped, and the wizard
            // notified, before the queue moves to the next job
            try {
                await handleImportError(job, err);
            } catch (e) {
                getLogger(job.data.tenant).error(
                    'Import error handling error',
                    {
                        error: (e as Error).message,
                    },
                );
            }
            done(err);
        });
};

// The generation of the wizard follows the import. Its failure must not
// change the notification of the import: it is only logged.
const notifyWizard = async (
    job: any,
    outcome: WizardImportOutcome,
    preparedCtx?: any,
) => {
    const runId = job.data.siteGenerationRunId;
    if (!runId) {
        return;
    }
    try {
        const ctx = preparedCtx ?? (await prepareContext({ job }));
        await onWizardImportEnd(ctx, runId, outcome);
    } catch (e) {
        getLogger(job.data.tenant).error('Wizard import end error', {
            error: (e as Error).message,
        });
    }
};

const startJobImport = async (job: any) => {
    notifyListeners(`${job.data.tenant}-import`, {
        isImporting: true,
        success: false,
    });
    const ctx = await prepareContext({ job });
    await startImport(ctx);
};

const handleImportError = async (job: any, err: any) => {
    const ctx = await prepareContext({ job });
    const cancelled = err instanceof CancelWorkerError;
    if (cancelled) {
        await ctx.dataset.drop();
        invalidateRepositories(ctx.tenant);
    }
    // very useful for identifying the origin of production errors.
    const logger = getLogger(ctx.tenant);
    logger.warn('handleImportError', err);
    // an upload cancelled once its import was queued fails the import
    // with a plain error: the generation was stopped all the same
    if (cancelled || err?.message === CANCELLED_IMPORT) {
        notifyListeners(`${job.data.tenant}-import`, {
            isImporting: false,
            success: false,
            message: CANCELLED_IMPORT,
        });
        await notifyWizard(job, failedImport(CANCELLED_IMPORT, true), ctx);
        return;
    }
    // message: what went wrong, for the user
    const { code, detail, apiMessage } = getImportError(err);
    notifyListeners(`${job.data.tenant}-import`, {
        isImporting: false,
        success: false,
        message: code,
        detail,
        apiMessage,
    });
    await notifyWizard(
        job,
        failedImport(
            code,
            false,
            [apiMessage, detail].filter(Boolean).join('\n\n'),
        ),
        ctx,
    );
};

const prepareContext = async (ctx: any) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.getLoader = getLoader;
    ctx.getCustomLoader = getCustomLoader;
    ctx.getStreamFromUrl = getStreamFromUrl;
    ctx.getStreamFromText = getStreamFromText;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.saveStream = saveStream;
    ctx.saveParsedStream = saveParsedStream;
    ctx.publishDocuments = publishDocuments;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addImportListener = (listener: any) => listeners.push(listener);

export const removeImportListener = (listener: any) => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
};

export const notifyListeners = (room: any, payload: any) => {
    listeners.forEach((listener: any) => listener({ room, data: payload }));
};
