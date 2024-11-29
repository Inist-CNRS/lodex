import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from '@recuperateur/async-busboy';
import config from 'config';
import koaBodyParser from 'koa-bodyparser';

import progress from '../../services/progress';
import { PENDING, UPLOADING_DATASET } from '../../../common/progressStatus';
import {
    saveStreamInFile,
    checkFileExists,
    getUploadedFileSize,
    unlinkFile,
} from '../../services/fsHelpers';

import { v1 as uuid } from 'uuid';
import { workerQueues } from '../../workers';
import { IMPORT } from '../../workers/import';

export const requestToStream = (asyncBusboyImpl) => async (req) => {
    const { files, fields } = await asyncBusboyImpl(req);
    files[0].once('close', async () => {
        await unlinkFile(files[0].path);
    });
    return { stream: files[0], fields };
};

export const clearUpload = async (ctx) => {
    await ctx.dataset.drop({});
    ctx.body = true;
};

export const prepareUpload = async (ctx, next) => {
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.getUploadedFileSize = getUploadedFileSize;

    try {
        await next();
    } catch (error) {
        progress.throw(ctx.tenant, error);
        ctx.status = 500;
        ctx.body = error.message;
    }
};

export const parseRequest = async (ctx, loaderName, next) => {
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

    const [extension] = resumableFilename.match(/[^.]*$/);
    const chunkNumber = parseInt(resumableChunkNumber, 10);

    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${config.uploadDir}/${ctx.tenant}_${resumableIdentifier}`,
        extension,
        chunkname: `${config.uploadDir}/${ctx.tenant}_${resumableIdentifier}.${chunkNumber}`,
        stream,
        customLoader: loaderName === 'custom-loader' ? customLoader : null,
    };
    await next();
};

export async function uploadChunkMiddleware(ctx, loaderName) {
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
    if (progress.getProgress(ctx.tenant).status === PENDING) {
        progress.start(ctx.tenant, {
            status: UPLOADING_DATASET,
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
    if (progress.getProgress(ctx.tenant).status === UPLOADING_DATASET) {
        progress.setProgress(
            ctx.tenant,
            progression === 100 ? 99 : progression,
        );
    }

    if (uploadedFileSize >= totalSize) {
        await workerQueues[ctx.tenant].add(
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

export const uploadUrl = async (ctx) => {
    const { url, loaderName, customLoader } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);
    await workerQueues[ctx.tenant].add(
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

export const uploadText = async (ctx) => {
    const { text, loaderName, customLoader } = ctx.request.body;
    await workerQueues[ctx.tenant].add(
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

export const checkChunkMiddleware = async (ctx, loaderName) => {
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
    const filename = `${config.uploadDir}/${ctx.tenant}_${resumableIdentifier}`;
    const chunkname = `${config.uploadDir}/${ctx.tenant}_${resumableIdentifier}.${resumableChunkNumber}`;
    const [extension] = resumableFilename.match(/[^.]*$/);

    const exists = await checkFileExists(chunkname, currentChunkSize);

    if (exists && chunkNumber === totalChunks) {
        await workerQueues[ctx.tenant].add(
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
        queryString: {
            allowDots: true, //  to keep compatibility with qs@4
            parameterLimit: 100000000000000,
        },
    }),
);
app.use(route.post('/url', uploadUrl));
app.use(route.post('/text', uploadText));

app.use(route.post('/:loaderName', parseRequest));
app.use(route.post('/:loaderName', uploadChunkMiddleware));
app.use(route.get('/:loaderName', checkChunkMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
