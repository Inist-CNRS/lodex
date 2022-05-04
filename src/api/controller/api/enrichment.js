import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { v1 as uuid } from 'uuid';

import { ENRICHER } from '../../workers/enricher';
import { workerQueue } from '../../workers';
import {
    createEnrichmentRule,
    getEnrichmentDataPreview,
    setEnrichmentJobId,
} from '../../services/enrichment/enrichment';
import { cancelJob, getActiveJob } from '../../workers/tools';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const postEnrichment = async ctx => {
    try {
        const newEnrichmentWithRule = await createEnrichmentRule(ctx);
        const result = await ctx.enrichment.create(newEnrichmentWithRule);

        if (result) {
            ctx.body = result;
            return;
        }

        ctx.status = 403;
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const putEnrichment = async (ctx, id) => {
    const newResource = ctx.request.body;

    try {
        // Delete existing data from dataset
        // If we change the name or the rule, existing data is obsolete
        const enrichment = await ctx.enrichment.findOneById(id);
        await ctx.dataset.removeAttribute(enrichment.name);

        ctx.body = await ctx.enrichment.update(id, newResource);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const deleteEnrichment = async (ctx, id) => {
    try {
        const enrichment = await ctx.enrichment.findOneById(id);
        const activeJob = await getActiveJob();
        if (
            activeJob?.data?.jobType === ENRICHER &&
            activeJob?.data?.id === id
        ) {
            cancelJob(ctx, ENRICHER);
        }
        await ctx.enrichment.delete(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        ctx.status = 200;
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getEnrichment = async (ctx, id) => {
    ctx.body = await ctx.enrichment.findOneById(id);
};

export const getAllEnrichments = async ctx => {
    ctx.body = await ctx.enrichment.findAll();
};

export const enrichmentAction = async (ctx, action, id) => {
    if (!['launch', 'pause', 'relaunch'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    if (action === 'launch') {
        await workerQueue
            .add({ id, jobType: ENRICHER, opts: { jobId: uuid() } })
            .then(job => {
                setEnrichmentJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    if (action === 'relaunch') {
        const enrichment = await ctx.enrichment.findOneById(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        await workerQueue
            .add({ id, jobType: ENRICHER, opts: { jobId: uuid() } })
            .then(job => {
                setEnrichmentJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
};

export const enrichmentDataPreview = async ctx => {
    try {
        const result = await getEnrichmentDataPreview(ctx);
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

app.use(route.get('/', getAllEnrichments));
app.use(route.get('/:id', getEnrichment));
app.use(koaBodyParser());
app.use(route.post('/', postEnrichment));
app.use(route.put('/:id', putEnrichment));
app.use(route.delete('/:id', deleteEnrichment));
app.use(route.post('/:action/:id', enrichmentAction));
app.use(route.post('/preview', enrichmentDataPreview));

export default app;
