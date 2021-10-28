import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import {
    getEnrichmentDatasetCandidate,
    getEnrichmentWorker,
} from '../../workers/enrichment';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const postEnrichment = async ctx => {
    const newResource = ctx.request.body;
    const result = await ctx.enrichment.create(newResource);
    // await ctx.field.initializeSubresourceModel(result);

    if (result) {
        ctx.body = result;
        return;
    }

    ctx.status = 500;
};

// export const putSubresource = async (ctx, id) => {
//     const newResource = ctx.request.body;

//     try {
//         await ctx.field.initializeSubresourceModel({ ...newResource, _id: id });
//         await ctx.field.updateSubresourcePaths({ ...newResource, _id: id });

//         ctx.body = await ctx.subresource.update(id, newResource);
//     } catch (error) {
//         ctx.status = 403;
//         ctx.body = { error: error.message };
//         return;
//     }
// };

// export const deleteSubresource = async (ctx, id) => {
//     try {
//         await ctx.subresource.delete(id);
//         await ctx.field.removeBySubresource(id);
//         ctx.body = true;
//     } catch (error) {
//         ctx.status = 403;
//         ctx.body = { error: error.message };
//         return;
//     }
// };

// export const getSubresource = async (ctx, id) => {
//     ctx.body = await ctx.subresource.findOne(id);
// };

export const getAllEnrichments = async ctx => {
    ctx.body = await ctx.enrichment.findAll();
};

export const scheduleDatasetEnrichment = async (ctx, action, id) => {
    if (!['resume', 'pause'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    const worker = getEnrichmentWorker(id, ctx);
    await worker[action]();

    if (action === 'resume') {
        const candidate = await getEnrichmentDatasetCandidate(id, ctx);
        candidate && worker.push(candidate);
    }
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllEnrichments));
// app.use(route.get('/:id', getSubresource));
app.use(koaBodyParser());
app.use(route.post('/', postEnrichment));
// app.use(route.put('/:id', putSubresource));
// app.use(route.delete('/:id', deleteSubresource));
app.use(route.post('/schedule/:action/:id', scheduleDatasetEnrichment));

export default app;
