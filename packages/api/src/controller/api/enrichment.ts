import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import { v1 as uuid } from 'uuid';

import {
    createEnrichmentRule,
    getEnrichmentDataPreview,
    setEnrichmentJobId,
} from '../../services/enrichment/enrichment';
import { orderEnrichmentsByDependencies } from '../../services/orderEnrichmentsByDependencies';
import { workerQueues } from '../../workers';
import { ENRICHER, RETRY_ENRICHER } from '../../workers/enricher';
import { cancelJob, getActiveJob } from '../../workers/tools';

export const setup = async (ctx: any, next: any) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
    }
};

export const postEnrichment = async (ctx: any) => {
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (error.code === 11000) {
            // send message due to browser locale
            const errorMessage =
                ctx.cookies.get('frontend_lang') === 'fr_FR'
                    ? 'Un enrichissement avec ce nom existe déjà'
                    : 'A enrichment with this name already exists';
            ctx.body = { error: errorMessage };
            return;
        }

        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const putEnrichment = async (ctx: any, id: any) => {
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const deleteEnrichment = async (ctx: any, id: any) => {
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
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const getEnrichment = async (ctx: any, id: any) => {
    ctx.body = await ctx.enrichment.findOneById(id);
};

export const getAllEnrichments = async (ctx: any) => {
    ctx.body = await ctx.enrichment.findAll();
};

export const enrichmentAction = async (ctx: any, action: any, id: any) => {
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
            .then((job: any) => {
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
            .then((job: any) => {
                setEnrichmentJobId(ctx, id, job);
            });
        ctx.body = {
            status: 'pending',
        };
    }

    ctx.status = 200;
};

export const enrichmentDataPreview = async (ctx: any) => {
    try {
        const result = await getEnrichmentDataPreview(ctx);
        ctx.status = 200;
        ctx.body = result;
    } catch (error) {
        ctx.status = 403;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        ctx.body = { error: error.message };
        return;
    }
};

export const launchAllEnrichment = async (ctx: any) => {
    try {
        const datasetColumns = await ctx.dataset.getColumns();
        const enrichments = await ctx.enrichment.findAll();
        const orderedEnrichments = orderEnrichmentsByDependencies(
            datasetColumns.map((column: any) => column.key),
            enrichments,
        );

        for (const enrichment of orderedEnrichments) {
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
                    { jobId: uuid(), lifo: false },
                )
                .then((job: any) =>
                    setEnrichmentJobId(ctx, enrichment._id, job),
                );
        }
        ctx.body = {
            status: 'pending',
        };
    } catch (e) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (e.message === 'circular_dependency') {
            ctx.status = 500;
            ctx.body = { error: 'circular_dependency_error' };
            return;
        }
        ctx.status = 500;
        ctx.body = { error: 'internal_error' };
    }
};

export const retryEnrichmentOnFailedRow = async (ctx: any, id: any) => {
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
        .then((job: any) => {
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
