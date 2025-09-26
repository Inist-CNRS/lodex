// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
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
