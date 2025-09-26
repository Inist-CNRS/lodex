import Koa from 'koa';
import route from 'koa-route';

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
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import getLocale from '../../../common/getLocale';

export const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const postPrecomputed = async (ctx: any) => {
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

export const putPrecomputed = async (ctx: any, id: any) => {
    const newPrecomputed = ctx.request.body;

    try {
        ctx.body = await ctx.precomputed.update(id, newPrecomputed);
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const deletePrecomputed = async (ctx: any, id: any) => {
    try {
        const precomputed = await ctx.precomputed.findOneById(id);
        await cancelJob(ctx, PRECOMPUTER, precomputed?.name);
        await ctx.precomputed.delete(id);
        ctx.status = 200;
        ctx.body = { message: 'ok' };
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const getPrecomputed = async (ctx: any, id: any) => {
    ctx.body = await ctx.precomputed.findOneById(id);
};

export const getAllPrecomputed = async (ctx: any) => {
    ctx.body = await ctx.precomputed
        .find({}, { projection: { data: { $slice: 10 } } })
        .toArray();
};

export const precomputedAction = async (ctx: any, action: any, id: any) => {
    if (!['launch', 'pause', 'relaunch'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    const precomputed = await ctx.precomputed.findOneById(id);
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

export const precomputedDataPreview = async (ctx: any) => {
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

export const downloadPrecomputed = async (ctx: any, id: any) => {
    try {
        const strm = await ctx.precomputed.getStreamOfResult(id);
        ctx.body = strm.pipe(ezs('dump')).pipe(ezs.toBuffer());
        ctx.status = 200;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const previewDataPrecomputed = async (ctx: any, id: any) => {
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

app.use(route.get('/', getAllPrecomputed));
app.use(route.get('/:id', getPrecomputed));
app.use(route.get('/:id/download', downloadPrecomputed));
app.use(route.get('/:id/previewData', previewDataPrecomputed));
app.use(koaBodyParser());
app.use(route.post('/', postPrecomputed));
app.use(route.put('/:id', putPrecomputed));
app.use(route.delete('/:id', deletePrecomputed));
app.use(route.post('/:action/:id', precomputedAction));
app.use(route.post('/preview', precomputedDataPreview));

export default app;
