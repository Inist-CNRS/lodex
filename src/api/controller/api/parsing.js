import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import fetchLineBy from './fetchLineBy';
import applyJbjStylesheet from '../../services/applyJbjStylesheet';

const app = new Koa();

export const getExcerpt = async ctx => {
    const excerptLines = await ctx.dataset.getExcerpt();
    const totalLoadedLines = await ctx.dataset.count();

    ctx.body = {
        totalLoadedLines,
        excerptLines,
    };
};

export const findBy = async (ctx, fieldName, value) => {
    ctx.body = await fetchLineBy(ctx)(fieldName, value);
};

export const postApplyJbjStylesheet = async ctx => {
    const { value, stylesheet } = ctx.request.body;
    const result = await applyJbjStylesheet(value, stylesheet);
    ctx.body = { result };
};

app.use(route.get('/', getExcerpt));
app.use(route.get('/:fieldName/:value', findBy));

app.use(koaBodyParser());
app.use(route.post('/apply-jbj-stylesheet', postApplyJbjStylesheet));

export default app;
