import asyncBusboy from '@recuperateur/async-busboy';
import config from 'config';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import { ProgressStatus } from '@lodex/common';
import {
    checkFileExists,
    getUploadedFileSize,
    saveStreamInFile,
    unlinkFile,
} from '../../services/fsHelpers';
import progress from '../../services/progress';

import { v1 as uuid } from 'uuid';
import { getOrCreateWorkerQueue } from '../../workers';
import { IMPORT } from '../../workers/import';

export const requestToStream = (asyncBusboyImpl: any) => async (req: any) => {
    const { files, fields } = await asyncBusboyImpl(req);
    files[0].once('close', async () => {
        await unlinkFile(files[0].path);
    });
    return { stream: files[0], fields };
};

export const clearUpload = async (ctx: any) => {
    await ctx.dataset.drop({});
    ctx.body = true;
};

export const prepareUpload = async (ctx: any, next: any) => {
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.getUploadedFileSize = getUploadedFileSize;

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
    } = fields;

    const extension = resumableFilename.split('.').pop();
    const chunkNumber = parseInt(resumableChunkNumber, 10);

    let uploadDir: string = config.get('uploadDir');
    if (!uploadDir.startsWith('/')) {
        uploadDir = `../../${uploadDir}`;
    }

    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}`,
        extension,
        chunkname: `${uploadDir}/${ctx.tenant}_${resumableIdentifier}.${chunkNumber}`,
        stream,
        customLoader: loaderName === 'custom-loader' ? customLoader : null,
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
    } = ctx.resumable;
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
        await getOrCreateWorkerQueue(ctx.tenant, 1).add(
            IMPORT, // Name of the job
            {
                loaderName,
                filename,
                totalChunks,
                extension,
                customLoader,
                tenant: ctx.tenant,
                jobType: IMPORT,
            },
            { jobId: uuid() },
        );
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
}

export const uploadUrl = async (ctx: any) => {
    const { url, loaderName, customLoader } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);
    await getOrCreateWorkerQueue(ctx.tenant, 1).add(
        IMPORT, // Name of the job
        {
            loaderName,
            url,
            extension,
            customLoader,
            tenant: ctx.tenant,
            jobType: IMPORT,
        },
        { jobId: uuid() },
    );
    ctx.body = {
        status: 'pending',
    };
};

export const uploadText = async (ctx: any) => {
    const { text, loaderName, customLoader } = ctx.request.body;
    await getOrCreateWorkerQueue(ctx.tenant, 1).add(
        IMPORT, // Name of the job
        {
            loaderName,
            text,
            customLoader,
            tenant: ctx.tenant,
            jobType: IMPORT,
        },
        { jobId: uuid() },
    );
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
    const filename = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}`;
    const chunkname = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}.${resumableChunkNumber}`;
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
            { jobId: uuid() },
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

app.use(route.post('/:loaderName', parseRequest));
app.use(route.post('/:loaderName', uploadChunkMiddleware));
app.use(route.get('/:loaderName', checkChunkMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
