import Koa from 'koa';
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'.
import ezs from '@ezs/core';
import koaBodyParser from 'koa-bodyparser';
import { v1 as uuid } from 'uuid';
import { PRECOMPUTER } from '../../workers/precomputer';
import { workerQueues } from '../../workers';
import {
    getPrecomputedDataPreview,
    setPrecomputedJobId,
} from '../../services/precomputed/precomputed';
import { cancelJob } from '../../workers/tools';
import { getLocale } from '@lodex/common';
import { buildQuery } from './buildQuery';
import type { PreComputation } from '../../models/precomputed';
import type { AppContext } from '../../services/repositoryMiddleware';

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
        await workerQueues[ctx.tenant]
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
        await workerQueues[ctx.tenant]
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

const app = new Koa();

app.use(setup);

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
app.use(
    // @ts-expect-error TS2345
    route.get('/:precomputedId/result/columns', getPrecomputedResultColumns),
);

export default app;
