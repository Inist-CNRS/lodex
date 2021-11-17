import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import {
    getEnrichmentDatasetCandidate,
    getEnrichmentWorker,
} from '../../workers/enrichment';
import { createEnrichmentRule } from '../../services/enrichment/enrichment';

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
        await ctx.enrichment.delete(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        ctx.body = true;
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

export const scheduleDatasetEnrichment = async (ctx, action, id) => {
    if (!['resume', 'pause'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    const worker = await getEnrichmentWorker(id, ctx);
    await worker[action]();

    if (action === 'resume') {
        const candidate = await getEnrichmentDatasetCandidate(id, ctx);
        candidate && worker.push(candidate);
    }

    ctx.status = 200;
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllEnrichments));
app.use(route.get('/:id', getEnrichment));
app.use(koaBodyParser());
app.use(route.post('/', postEnrichment));
app.use(route.put('/:id', putEnrichment));
app.use(route.delete('/:id', deleteEnrichment));
app.use(route.post('/schedule/:action/:id', scheduleDatasetEnrichment));

export default app;
