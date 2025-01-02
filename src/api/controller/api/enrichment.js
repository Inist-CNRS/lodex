import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import { v1 as uuid } from 'uuid';

import { ENRICHER, RETRY_ENRICHER } from '../../workers/enricher';
import { workerQueues } from '../../workers';
import {
    createEnrichmentRule,
    getEnrichmentDataPreview,
    setEnrichmentJobId,
} from '../../services/enrichment/enrichment';
import { cancelJob, getActiveJob } from '../../workers/tools';
import { getLocale } from 'redux-polyglot/dist/selectors';

export const setup = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
};

export const postEnrichment = async (ctx) => {
    try {
        const enrichment = ctx.request.body;
        const newEnrichmentWithRule = await createEnrichmentRule(
            ctx,
            enrichment,
        );
        const result = await ctx.enrichment.create(newEnrichmentWithRule);

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
                    ? 'Un enrichissement avec ce nom existe déjà'
                    : 'A enrichment with this name already exists';
            ctx.body = { error: errorMessage };
            return;
        }

        ctx.body = { error: error.message };
        return;
    }
};

export const putEnrichment = async (ctx, id) => {
    const newEnrichment = ctx.request.body;

    try {
        // Delete existing data from dataset
        // If we change the name or the rule, existing data is obsolete
        const enrichment = await ctx.enrichment.findOneById(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        const newEnrichmentWithRule = await createEnrichmentRule(
            ctx,
            newEnrichment,
        );
        ctx.body = await ctx.enrichment.update(id, newEnrichmentWithRule);
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const deleteEnrichment = async (ctx, id) => {
    try {
        const enrichment = await ctx.enrichment.findOneById(id);
        const activeJob = await getActiveJob(ctx.tenant);
        if (
            activeJob?.data?.jobType === ENRICHER &&
            activeJob?.data?.id === id
        ) {
            cancelJob(ctx, ENRICHER);
        }
        await ctx.enrichment.delete(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        ctx.status = 200;
        ctx.body = { message: 'ok' };
    } catch (error) {
        ctx.status = 403;
        ctx.body = { error: error.message };
        return;
    }
};

export const getEnrichment = async (ctx, id) => {
    ctx.body = await ctx.enrichment.findOneById(id);
};

export const getAllEnrichments = async (ctx) => {
    ctx.body = await ctx.enrichment.findAll();
};

export const enrichmentAction = async (ctx, action, id) => {
    if (!['launch', 'pause', 'relaunch'].includes(action)) {
        throw new Error(`Invalid action "${action}"`);
    }

    if (action === 'launch') {
        await workerQueues[ctx.tenant]
            .add(
                ENRICHER, // Name of the job
                {
                    id,
                    jobType: ENRICHER,
                    tenant: ctx.tenant,
                },
                { jobId: uuid() },
            )
            .then((job) => {
                setEnrichmentJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    if (action === 'relaunch') {
        const enrichment = await ctx.enrichment.findOneById(id);
        await ctx.dataset.removeAttribute(enrichment.name);
        await workerQueues[ctx.tenant]
            .add(
                ENRICHER, // Name of the job
                {
                    id,
                    jobType: ENRICHER,
                    tenant: ctx.tenant,
                },
                { jobId: uuid() },
            )
            .then((job) => {
                setEnrichmentJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
};

export const enrichmentDataPreview = async (ctx) => {
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

export const launchAllEnrichment = async (ctx) => {
    const enrichments = await ctx.enrichment.findAll();

    for (const enrichment of enrichments) {
        if (enrichment.status === 'FINISHED') {
            await ctx.dataset.removeAttribute(enrichment.name);
        }
        await workerQueues[ctx.tenant]
            .add(
                ENRICHER, // Name of the job
                {
                    id: enrichment._id,
                    jobType: ENRICHER,
                    tenant: ctx.tenant,
                },
                { jobId: uuid() },
            )
            .then((job) => setEnrichmentJobId(ctx, enrichment._id, job));
    }
    ctx.body = {
        status: 'pending',
    };
};

export const retryEnrichmentOnFailedRow = async (ctx, id) => {
    await workerQueues[ctx.tenant]
        .add(
            RETRY_ENRICHER, // Name of the job
            {
                id,
                jobType: RETRY_ENRICHER,
                tenant: ctx.tenant,
            },
            { jobId: uuid() },
        )
        .then((job) => {
            setEnrichmentJobId(ctx, id, job);
        });
    ctx.body = {
        status: 'pending',
    };
};

const app = new Koa();

app.use(setup);

app.use(route.get('/', getAllEnrichments));
app.use(route.get('/:id', getEnrichment));
app.use(koaBodyParser());
app.use(route.post('/launchAll', launchAllEnrichment));
app.use(route.post('/', postEnrichment));
app.use(route.put('/:id', putEnrichment));
app.use(route.delete('/:id', deleteEnrichment));
app.use(route.post('/retry/:id', retryEnrichmentOnFailedRow));
app.use(route.post('/:action/:id', enrichmentAction));
app.use(route.post('/preview', enrichmentDataPreview));

export default app;
