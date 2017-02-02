import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

export const getExcerpt = async (ctx) => {
    const excerptLines = await ctx.dataset.getExcerpt();
    const totalLoadedLines = await ctx.dataset.count();

    ctx.body = {
        totalLoadedLines,
        excerptLines,
    };
};

export const findBy = async (ctx, fieldName, value) => {
    ctx.body = ctx.dataset.findBy(fieldName, value);
};

app.use(route.get('/', getExcerpt));
app.use(route.get('/:fieldName/:value', findBy));

export default app;
