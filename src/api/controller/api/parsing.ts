import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import fetchLineBy from './fetchLineBy';

const app = new Koa();

export const getExcerpt = async (ctx: any) => {
    const excerptLines = await ctx.dataset.getExcerpt();
    const totalLoadedLines = await ctx.dataset.count();

    ctx.body = {
        totalLoadedLines,
        excerptLines,
    };
};

export const findBy = async (ctx: any, fieldName: any, value: any) => {
    ctx.body = await fetchLineBy(ctx)(fieldName, value);
};

app.use(route.get('/', getExcerpt));
app.use(route.get('/:fieldName/:value', findBy));

app.use(koaBodyParser());

export default app;
