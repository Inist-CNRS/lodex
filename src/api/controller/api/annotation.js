import Koa from 'koa';
import route from 'koa-route';
import {
    annotationSchema,
    getAnnotationsQuerySchema,
} from './annotation.validator';

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
        match: query,
        sortBy,
        sortDir,
    } = validation.data;
    const skip = page * limit;

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

    ctx.response.status = 200;
    ctx.body = {
        total: annotations.length,
        fullTotal,
        data: annotations,
    };
}

const app = new Koa();

app.use(route.post('/', createAnnotation));
app.use(route.get('/', getAnnotations));

export default app;
