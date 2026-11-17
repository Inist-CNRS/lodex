import { invalidateRepositories } from '../../services/repositoryMiddleware';
import asyncBusboy from '@recuperateur/async-busboy';
import path from 'path';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import config from 'config';
import {
    ProgressStatus,
    SITE_INFO_KEYS,
    type SiteWizardChoice,
} from '@lodex/common';
import { catalogModels } from '../../services/catalogModel';
import { startWizardGeneration } from '../../services/siteGeneration/wizardGeneration';
import { failWizardGeneration } from '../../services/siteGeneration/wizardJobs';
import {
    checkFileExists,
    getUploadedFileSize,
    saveStreamInFile,
    unlinkFile,
} from '../../services/fsHelpers';
import progress from '../../services/progress';
import {
    getUploadDir,
    isUploadCancelled,
    isUploadQueued,
    markUploadCancelled,
    markUploadQueued,
    removeStaleUploadFiles,
    removeUploadChunks,
} from '../../services/uploadCancellation';

import { randomUUID } from 'node:crypto';
import { getOrCreateWorkerQueue } from '../../workers';
import { IMPORT } from '../../workers/import';

const finishUploadProgress = (tenant: string) => {
    if (progress.getStatus(tenant) === ProgressStatus.UPLOADING_DATASET) {
        progress.finish(tenant);
    }
};

// Only the fields of the wizard's choice are stored, as texts, and the
// auto-publish flag (a text in the query of a chunk).
// Without a text model id, there is no model to find: null.
const pickSiteWizardChoice = (raw: unknown): SiteWizardChoice | null => {
    const source = (raw ?? {}) as Record<string, unknown>;
    if (typeof source.modelId !== 'string') {
        return null;
    }
    const choice: SiteWizardChoice = { modelId: source.modelId };
    SITE_INFO_KEYS.forEach((key) => {
        const value = source[key];
        if (typeof value === 'string') {
            choice[key] = value;
        }
    });
    if (source.autoPublish === true || source.autoPublish === 'true') {
        choice.autoPublish = true;
    }
    return choice;
};

type ImportRefusal = { status: number; error: string };

const answerRefusal = (ctx: any, { status, error }: ImportRefusal) => {
    ctx.status = status;
    ctx.body = { error };
};

// Queues an import. When the request carries the wizard's choice, the site
// generation starts first and the import carries its run: a refused choice
// is returned, and nothing is queued. `beforeQueue` runs once the generation
// started. If the import cannot be queued, the generation started for it is
// put in error (it would stay running without any import), then the error
// goes on.
const queueWizardImport = async (
    ctx: any,
    rawChoice: unknown,
    jobData: Record<string, unknown>,
    beforeQueue?: () => Promise<void>,
): Promise<ImportRefusal | undefined> => {
    const importJobId = randomUUID();
    let siteGenerationRunId: string | undefined;
    if (rawChoice !== undefined && rawChoice !== null) {
        const choice = pickSiteWizardChoice(rawChoice);
        if (!choice) {
            return { status: 404, error: 'model_not_found' };
        }
        const result = await startWizardGeneration(ctx, choice, importJobId);
        if ('error' in result) {
            return { status: result.status, error: result.error };
        }
        siteGenerationRunId = result.runId;
    }
    await beforeQueue?.();
    try {
        await getOrCreateWorkerQueue(ctx.tenant, 1).add(
            IMPORT, // Name of the job
            {
                ...jobData,
                tenant: ctx.tenant,
                jobType: IMPORT,
                ...(siteGenerationRunId && { siteGenerationRunId }),
            },
            { jobId: importJobId },
        );
    } catch (error) {
        if (siteGenerationRunId) {
            await failWizardGeneration(
                ctx,
                siteGenerationRunId,
                (error as Error).message,
            );
        }
        throw error;
    }
};

export const requestToStream = (asyncBusboyImpl: any) => async (req: any) => {
    const { files, fields } = await asyncBusboyImpl(req);
    files[0].once('close', async () => {
        await unlinkFile(files[0].path);
    });
    return { stream: files[0], fields };
};

export const clearUpload = async (ctx: any) => {
    await ctx.dataset.drop({});
    invalidateRepositories(ctx.tenant);
    ctx.body = true;
};

export const prepareUpload = async (ctx: any, next: any) => {
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.getUploadedFileSize = getUploadedFileSize;
    ctx.isUploadCancelled = isUploadCancelled;
    ctx.markUploadCancelled = markUploadCancelled;
    ctx.markUploadQueued = markUploadQueued;
    ctx.isUploadQueued = isUploadQueued;
    ctx.removeUploadChunks = removeUploadChunks;
    ctx.removeStaleUploadFiles = removeStaleUploadFiles;
    ctx.catalogModels = catalogModels;
    ctx.availableLoaders = config.get('scripts.loaders');

    try {
        await next();
    } catch (error) {
        progress.throw(ctx.tenant, error);
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = error.message;
    }
};

export const parseRequest = async (ctx: any, loaderName: any, next: any) => {
    const { stream, fields } = await ctx.requestToStream(ctx.req);

    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableTotalChunks,
        resumableTotalSize,
        resumableCurrentChunkSize,
        resumableFilename = '',
        customLoader = null,
        modelId,
        siteName,
        siteDescription,
        theme,
        autoPublish,
    } = fields;

    const extension = resumableFilename.split('.').pop();
    const chunkNumber = parseInt(resumableChunkNumber, 10);

    const uploadDir = getUploadDir();

    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}`,
        extension,
        chunkNumber,
        chunkname: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}.${chunkNumber}`,
        stream,
        customLoader: loaderName === 'custom-loader' ? customLoader : null,
        // the site wizard choice, only used by the last chunk
        choice: modelId
            ? { modelId, siteName, siteDescription, theme, autoPublish }
            : undefined,
    };
    await next();
};

export async function uploadChunkMiddleware(ctx: any, loaderName: any) {
    const {
        chunkname,
        currentChunkSize,
        stream,
        filename,
        totalChunks,
        totalSize,
        extension,
        customLoader,
        choice,
    } = ctx.resumable;
    if (await ctx.isUploadCancelled(filename)) {
        ctx.status = 409;
        ctx.body = { status: 'cancelled' };
        return;
    }
    if (ctx.resumable.chunkNumber === 1) {
        // a new upload: clean up the files of the old ones, without waiting
        ctx.removeStaleUploadFiles(path.dirname(filename), ctx.tenant);
    }
    if (progress.getProgress(ctx.tenant).status === ProgressStatus.PENDING) {
        progress.start(ctx.tenant, {
            status: ProgressStatus.UPLOADING_DATASET,
            target: 100,
            symbol: '%',
            type: IMPORT,
        });
    }
    if (!(await ctx.checkFileExists(chunkname, currentChunkSize))) {
        await ctx.saveStreamInFile(stream, chunkname);
    }

    // cancelled while this chunk was saved
    if (await ctx.isUploadCancelled(filename)) {
        await ctx.removeUploadChunks(filename);
        finishUploadProgress(ctx.tenant);
        ctx.status = 409;
        ctx.body = { status: 'cancelled' };
        return;
    }

    const uploadedFileSize = await ctx.getUploadedFileSize(
        filename,
        totalChunks,
    );

    const progression = Math.round((uploadedFileSize * 100) / totalSize);
    if (
        progress.getProgress(ctx.tenant).status ===
        ProgressStatus.UPLOADING_DATASET
    ) {
        progress.setProgress(
            ctx.tenant,
            progression === 100 ? 99 : progression,
        );
    }

    if (uploadedFileSize >= totalSize) {
        let isQueueing = false;
        let refusal: ImportRefusal | undefined;
        try {
            refusal = await queueWizardImport(
                ctx,
                choice,
                { loaderName, filename, totalChunks, extension, customLoader },
                async () => {
                    // a cancel coming from now on is too late: the import runs
                    isQueueing = true;
                    await ctx.markUploadQueued(filename);
                },
            );
        } catch (error) {
            await ctx.removeUploadChunks(filename);
            finishUploadProgress(ctx.tenant);
            if (isQueueing) {
                throw error;
            }
            // the generation could not start
            ctx.status = 500;
            ctx.body = { error: (error as Error).message };
            return;
        }
        if (refusal) {
            // refused choice: the upload is dropped
            answerRefusal(ctx, refusal);
            await ctx.removeUploadChunks(filename);
            finishUploadProgress(ctx.tenant);
            return;
        }
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
}

export const uploadUrl = async (ctx: any) => {
    const { url, loaderName, customLoader, siteGeneration } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);
    const refusal = await queueWizardImport(ctx, siteGeneration, {
        loaderName,
        url,
        extension,
        customLoader,
    });
    if (refusal) {
        answerRefusal(ctx, refusal);
        return;
    }
    ctx.body = {
        status: 'pending',
    };
};

export const uploadText = async (ctx: any) => {
    const { text, loaderName, customLoader, siteGeneration } = ctx.request.body;
    const refusal = await queueWizardImport(ctx, siteGeneration, {
        loaderName,
        text,
        customLoader,
    });
    if (refusal) {
        answerRefusal(ctx, refusal);
        return;
    }
    ctx.body = {
        status: 'pending',
    };
};

export const cancelUpload = async (ctx: any) => {
    const { identifier } = ctx.request.body ?? {};
    if (
        typeof identifier !== 'string' ||
        !/^[0-9a-zA-Z_-]+$/.test(identifier)
    ) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_upload_identifier' };
        return;
    }
    const filename = `${getUploadDir()}/${ctx.tenant}_${identifier}`;
    await ctx.markUploadCancelled(filename);
    // the import was queued just before: if it has not started yet, it ends
    // as cancelled on its own (see startImport); either way it needs the
    // chunks, and the client cancels it as a running import
    if (await ctx.isUploadQueued(filename)) {
        ctx.body = { status: 'import_started' };
        return;
    }
    await ctx.removeUploadChunks(filename);
    finishUploadProgress(ctx.tenant);
    ctx.body = { status: 'cancelled' };
};

export const checkChunkMiddleware = async (ctx: any, loaderName: any) => {
    const {
        resumableChunkNumber,
        resumableTotalChunks,
        resumableIdentifier,
        resumableCurrentChunkSize,
        resumableFilename,
    } = ctx.request.query;
    const chunkNumber = parseInt(resumableChunkNumber, 10);
    const totalChunks = parseInt(resumableTotalChunks, 10);
    const currentChunkSize = parseInt(resumableCurrentChunkSize, 10);
    const filename = `${getUploadDir()}/${ctx.tenant}_${resumableIdentifier}`;
    const chunkname = `${getUploadDir()}/${ctx.tenant}_${resumableIdentifier}.${resumableChunkNumber}`;
    const extension = resumableFilename.split('.').pop();

    const exists = await checkFileExists(chunkname, currentChunkSize);

    if (exists && chunkNumber === totalChunks) {
        await getOrCreateWorkerQueue(ctx.tenant, 1).add(
            IMPORT, // Name of the job
            {
                loaderName,
                filename,
                totalChunks,
                extension,
                tenant: ctx.tenant,
                jobType: IMPORT,
            },
            { jobId: randomUUID() },
        );
    }
    ctx.status = exists ? 200 : 204;
};

const app = new Koa();

app.use(prepareUpload);

app.use(
    koaBodyParser({
        formLimit: '10mb',
        textLimit: '10mb',
        jsonLimit: '10mb',
    }),
);
app.use(route.post('/url', uploadUrl));
app.use(route.post('/text', uploadText));
app.use(route.post('/cancel', cancelUpload));

app.use(route.post('/:loaderName', parseRequest));
app.use(route.post('/:loaderName', uploadChunkMiddleware));
app.use(route.get('/:loaderName', checkChunkMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
