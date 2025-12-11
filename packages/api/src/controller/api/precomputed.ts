import Koa from 'koa';
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'.
import ezs from '@ezs/core';
import koaBodyParser from 'koa-bodyparser';
import { v1 as uuid } from 'uuid';
import config from 'config';

import { getLocale, TaskStatus } from '@lodex/common';
import asyncBusboy from '@recuperateur/async-busboy';
import type { PreComputation } from '../../models/precomputed';
import {
    getPrecomputedDataPreview,
    setPrecomputedJobId,
} from '../../services/precomputed/precomputed';
import type { AppContext } from '../../services/repositoryMiddleware';
import { getOrCreateWorkerQueue } from '../../workers';
import { PRECOMPUTER } from '../../workers/precomputer';
import { cancelJob } from '../../workers/tools';
import { buildQuery } from './buildQuery';
import {
    checkFileExists,
    clearChunks,
    getUploadedFileSize,
    mergeChunks,
    saveStreamInFile,
    streamToJson,
    unlinkFile,
} from '../../services/fsHelpers';

export const setup = async (
    ctx: { status: number; body: { error: any } },
    next: any,
) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const postPrecomputed = async (
    ctx: AppContext<PreComputation, PreComputation | { error: string }>,
) => {
    try {
        const precomputed = ctx.request.body;
        const result = await ctx.precomputed.create(precomputed);

        if (result) {
            ctx.body = result;
            return;
        }

        ctx.status = 403;
    } catch (error) {
        ctx.status = 403;
        // if code error is 11000, it's a duplicate key error
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (error.code === 11000) {
            // send message due to browser locale
            const locale = getLocale(ctx);
            const errorMessage =
                locale === 'fr'
                    ? 'Un précalcul avec ce nom existe déjà'
                    : 'A precomputed with this name already exists';
            ctx.body = { error: errorMessage };
            return;
        }

        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const putPrecomputed = async (
    ctx: AppContext<PreComputation, PreComputation | null | { error: string }>,
    id: string,
) => {
    const newPrecomputed = ctx.request.body;

    try {
        ctx.body = await ctx.precomputed.update(id, newPrecomputed);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: (error as Error).message };
        return;
    }
};

export const deletePrecomputed = async (
    ctx: AppContext<void, { message: string } | { error: string }>,
    id: string,
) => {
    try {
        const precomputed = await ctx.precomputed.findOneById(id);
        await cancelJob(ctx, PRECOMPUTER, precomputed?.name);
        await ctx.precomputed.delete(id);
        ctx.status = 200;
        ctx.body = { message: 'ok' };
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: (error as Error).message };
        return;
    }
};

export const getPrecomputed = async (
    ctx: AppContext<void, PreComputation | null>,
    id: string,
) => {
    ctx.body = await ctx.precomputed.findOneById(id);
};

export const getAllPrecomputed = async (
    ctx: AppContext<void, PreComputation[]>,
) => {
    ctx.body = await ctx.precomputed
        .find({}, { projection: { data: { $slice: 10 } } })
        .toArray();
};

export const precomputedAction = async (
    ctx: AppContext<void, { status: string } | { error: string }>,
    action: 'launch' | 'pause' | 'relaunch',
    id: string,
) => {
    if (!['launch', 'pause', 'relaunch'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    const precomputed = await ctx.precomputed.findOneById(id);

    if (!precomputed) {
        ctx.status = 404;
        ctx.body = { error: 'Precomputed not found' };
        return;
    }

    if (action === 'launch') {
        await getOrCreateWorkerQueue(ctx.tenant, 1)
            .add(
                PRECOMPUTER, // Name of the job
                {
                    id,
                    jobType: PRECOMPUTER,
                    action: 'askForPrecomputed',
                    tenant: ctx.tenant,
                    subLabel: precomputed.name,
                },
                { jobId: uuid() },
            )
            .then((job: any) => {
                setPrecomputedJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    if (action === 'relaunch') {
        await ctx.dataset.removeAttribute(precomputed.name);
        await getOrCreateWorkerQueue(ctx.tenant, 1)
            .add(
                PRECOMPUTER, // Name of the job
                {
                    id,
                    jobType: PRECOMPUTER,
                    action: 'askForPrecomputed',
                    tenant: ctx.tenant,
                    subLabel: precomputed.name,
                },
                { jobId: uuid() },
            )
            .then((job: any) => {
                setPrecomputedJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
};

export const precomputedDataPreview = async (ctx: AppContext) => {
    try {
        const result = await getPrecomputedDataPreview(ctx);
        ctx.status = 200;
        ctx.body = result;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const downloadPrecomputed = async (ctx: AppContext, id: string) => {
    try {
        const strm = ctx.precomputed.getStreamOfResult(id);
        ctx.body = strm.pipe(ezs('dump')).pipe(ezs.toBuffer());
        ctx.status = 200;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const getPrecomputedResultList = async (
    ctx: AppContext<
        void,
        {
            datas: Record<string, unknown>[];
            count: number;
        }
    >,
    precomputedId: string,
) => {
    const {
        skip,
        limit,
        sortBy,
        sortDir,
        filterBy,
        filterOperator,
        filterValue,
    } = ctx.query as {
        skip?: string;
        limit?: string;
        sortBy?: string;
        sortDir?: string;
        filterBy?: keyof PreComputation;
        filterOperator?: string;
        filterValue?: string;
    };
    const query = buildQuery<PreComputation>(
        filterBy,
        filterOperator,
        filterValue,
    );
    const datas = await ctx.precomputed.resultFindLimitFromSkip({
        precomputedId,
        limit: limit ? parseInt(limit, 10) : 10,
        skip: skip ? parseInt(skip) : 0,
        query,
        sortBy,
        sortDir: sortDir?.toUpperCase() as 'ASC' | 'DESC',
    });
    const count = await ctx.precomputed.resultCount(precomputedId, query);
    ctx.body = { count, datas };
};

export const getPrecomputedResultColumns = async (
    ctx: AppContext,
    id: string,
) => {
    const columns = await ctx.precomputed.getResultColumns(id);
    ctx.body = { columns };
};

export const putPrecomputedResult = async (
    ctx: AppContext<
        Record<string, unknown>,
        Record<string, unknown> | null | { error: string }
    >,
    precomputedId: string,
    id: string,
) => {
    const data = ctx.request.body;

    try {
        ctx.body = await ctx.precomputed.updateResult({
            id,
            precomputedId,
            data,
        });
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: (error as Error).message };
        return;
    }
};

export const previewDataPrecomputed = async (ctx: AppContext, id: string) => {
    try {
        const data = await ctx.precomputed.getSample(id);
        ctx.body = JSON.stringify(data);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const requestToStream = async (req: any) => {
    const { files, fields } = await asyncBusboy(req);
    files[0].once('close', async () => {
        await unlinkFile(files[0].path);
    });
    return { stream: files[0], fields };
};

export const parseRequest = async (ctx: any, loaderName: any, next: any) => {
    const { stream, fields } = await requestToStream(ctx.req);

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

export async function uploadChunkMiddleware(ctx: any, precomputedId: string) {
    const {
        chunkname,
        currentChunkSize,
        stream,
        filename,
        totalChunks,
        totalSize,
    } = ctx.resumable;
    if (!(await checkFileExists(chunkname, currentChunkSize))) {
        await saveStreamInFile(stream, chunkname);
    }

    const uploadedFileSize = await getUploadedFileSize(filename, totalChunks);

    if (uploadedFileSize >= totalSize) {
        try {
            const stream = mergeChunks(filename, totalChunks);

            const precomputedResults = await streamToJson(stream);

            await ctx.precomputed.deleteManyResults({
                precomputedId,
            });
            await ctx.precomputed.insertManyResults(
                precomputedId,
                precomputedResults,
            );

            await ctx.precomputed.updateStatus(
                precomputedId,
                TaskStatus.FINISHED,
                {
                    hasData: true,
                },
            );
            await clearChunks(filename, totalChunks);
            ctx.body = { message: 'Imported' };
        } catch (error) {
            ctx.status = 400;
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            ctx.body = { message: error.message };
            return;
        }
    }

    ctx.status = 200;
}

export const checkChunkMiddleware = async (ctx: any, precomputedId: string) => {
    const {
        resumableChunkNumber,
        resumableTotalChunks,
        resumableIdentifier,
        resumableCurrentChunkSize,
    } = ctx.request.query;
    const chunkNumber = parseInt(resumableChunkNumber, 10);
    const totalChunks = parseInt(resumableTotalChunks, 10);
    const currentChunkSize = parseInt(resumableCurrentChunkSize, 10);
    const filename = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}`;
    const chunkname = `${config.get('uploadDir')}/${ctx.tenant}_${resumableIdentifier}.${resumableChunkNumber}`;

    const exists = await checkFileExists(chunkname, currentChunkSize);

    if (exists && chunkNumber === totalChunks) {
        try {
            const stream = mergeChunks(filename, totalChunks);

            const precomputedResults = await streamToJson(stream);

            await ctx.precomputed.deleteManyResults({
                precomputedId,
            });
            await ctx.precomputed.insertManyResults(
                precomputedId,
                precomputedResults,
            );

            await ctx.precomputed.updateStatus(
                precomputedId,
                TaskStatus.FINISHED,
                {
                    hasData: true,
                },
            );
            ctx.body = { message: 'Imported' };
        } catch (error) {
            ctx.status = 400;
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            ctx.body = { message: error.message };
            return;
        }
    }
    ctx.status = exists ? 200 : 204;
};

export const cancelPrecomputedJob = async (
    ctx: AppContext,
    precomputedId: string,
) => {
    const precomputed = await ctx.precomputed.findOneById(precomputedId);
    if (!precomputed) {
        ctx.status = 404;
        ctx.body = { message: 'Precomputed not found' };
        return;
    }
    if (precomputed) {
        await cancelJob(ctx, PRECOMPUTER, precomputed.name);
    }
    await ctx.precomputed.updateStatus(precomputedId, TaskStatus.CANCELED, {});
    ctx.status = 200;
    ctx.body = { message: 'Job cancelled' };
};

const app = new Koa();

app.use(setup);

app.use(route.post('/:precomputedId/import', parseRequest));
app.use(route.post('/:precomputedId/import', uploadChunkMiddleware));
app.use(route.get('/:precomputedId/import', checkChunkMiddleware));

// @ts-expect-error TS2345
app.use(route.get('/', getAllPrecomputed));
// @ts-expect-error TS2345
app.use(route.get('/:id', getPrecomputed));
// @ts-expect-error TS2345
app.use(route.get('/:id/download', downloadPrecomputed));
// @ts-expect-error TS2345
app.use(route.get('/:id/previewData', previewDataPrecomputed));
app.use(koaBodyParser());
// @ts-expect-error TS2345
app.use(route.post('/', postPrecomputed));
// @ts-expect-error TS2345
app.use(route.put('/:id', putPrecomputed));
// @ts-expect-error TS2345
app.use(route.delete('/:id', deletePrecomputed));
// @ts-expect-error TS2345
app.use(route.post('/:action/:id', precomputedAction));
// @ts-expect-error TS2345
app.use(route.post('/preview', precomputedDataPreview));

// @ts-expect-error TS2345
app.use(route.get('/:precomputedId/result', getPrecomputedResultList));
// @ts-expect-error TS2345
app.use(route.put('/:precomputedId/cancel', cancelPrecomputedJob));
app.use(
    // @ts-expect-error TS2345
    route.get('/:precomputedId/result/columns', getPrecomputedResultColumns),
);
app.use(
    // @ts-expect-error TS2345
    route.put('/:precomputedId/result/:id', putPrecomputedResult),
);

export default app;
