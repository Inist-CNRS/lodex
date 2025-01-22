import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import {
    annotationSchema,
    getAnnotationsQuerySchema,
} from './../../../common/validator/annotation.validator';
import { buildQuery } from './buildQuery';

/**
 * @param {Koa.Context} ctx
 */
export async function createAnnotation(ctx) {
    const validation = annotationSchema.safeParse(ctx.request.body);
    if (!validation.success) {
        ctx.response.status = 400;
        ctx.body = {
            total: 0,
            errors: validation.error.errors,
        };
        return;
    }

    ctx.response.status = 200;
    ctx.body = {
        total: 1,
        data: await ctx.annotation.create(validation.data),
    };
}

/**
 * @param {Koa.Context} ctx
 */
export async function getAnnotations(ctx) {
    const validation = getAnnotationsQuerySchema.safeParse(ctx.request.query);

    if (!validation.success) {
        ctx.response.status = 400;
        ctx.body = {
            total: 0,
            fullTotal: 0,
            errors: validation.error.errors,
            data: [],
        };
        return;
    }

    const {
        page,
        perPage: limit,
        sortBy,
        sortDir,
        filterBy,
        filterValue,
        filterOperator,
    } = validation.data;

    const skip = page * limit;

    const query = buildQuery(filterBy, filterOperator, filterValue);

    const [annotations, fullTotal] = await Promise.all([
        ctx.annotation.findLimitFromSkip({
            limit,
            skip,
            query,
            sortBy,
            sortDir,
        }),
        ctx.annotation.count(query),
    ]);

    const resources = await ctx.publishedDataset.findManyByUris(
        annotations.map(({ resourceUri }) => resourceUri),
    );

    const titleField = await ctx.field.findTitle();

    const resourceByUri = (resources || []).reduce(
        (acc, resource) => ({
            ...acc,
            [resource.uri]: {
                uri: resource.uri,
                title: resource.versions[resource.versions.length - 1][
                    titleField.name
                ],
            },
        }),
        {},
    );

    ctx.response.status = 200;
    ctx.body = {
        total: annotations.length,
        fullTotal,
        data: annotations.map((annotation) => ({
            ...annotation,
            resource: resourceByUri[annotation.resourceUri],
        })),
    };
}

const app = new Koa();

app.use(route.get('/', getAnnotations));
app.use(koaBodyParser());
app.use(route.post('/', createAnnotation));

export default app;
