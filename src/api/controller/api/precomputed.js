import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { v1 as uuid } from 'uuid';

import { PRECOMPUTER } from '../../workers/precomputer';
import { workerQueues } from '../../workers';
import {
    getPrecomputedDataPreview,
    setPrecomputedJobId,
} from '../../services/precomputed/precomputed';
import { cancelJob, getActiveJob } from '../../workers/tools';
import getLocale from '../../../common/getLocale';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const postPrecomputed = async ctx => {
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

        ctx.body = { error: error.message };
        return;
    }
};

export const putPrecomputed = async (ctx, id) => {
    const newPrecomputed = ctx.request.body;

    try {
        ctx.body = await ctx.precomputed.update(id, newPrecomputed);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const deletePrecomputed = async (ctx, id) => {
    try {
        const activeJob = await getActiveJob(ctx.tenant);
        if (
            activeJob?.data?.jobType === PRECOMPUTER &&
            activeJob?.data?.id === id
        ) {
            cancelJob(ctx, PRECOMPUTER);
        }
        await ctx.precomputed.delete(id);
        ctx.status = 200;
        ctx.body = { message: 'ok' };
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getPrecomputed = async (ctx, id) => {
    ctx.body = await ctx.precomputed.findOneById(id);
};

export const getAllPrecomputed = async ctx => {
    ctx.body = await ctx.precomputed
        .find({}, { projection: { data: { $slice: 10 } } })
        .toArray();
};

export const precomputedAction = async (ctx, action, id) => {
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
            .then(job => {
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
            .then(job => {
                setPrecomputedJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
};

export const precomputedDataPreview = async ctx => {
    try {
        const result = await getPrecomputedDataPreview(ctx);
        ctx.status = 200;
        ctx.body = result;
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllPrecomputed));
app.use(route.get('/:id', getPrecomputed));
app.use(koaBodyParser());
app.use(route.post('/', postPrecomputed));
app.use(route.put('/:id', putPrecomputed));
app.use(route.delete('/:id', deletePrecomputed));
app.use(route.post('/:action/:id', precomputedAction));
app.use(route.post('/preview', precomputedDataPreview));

export default app;
