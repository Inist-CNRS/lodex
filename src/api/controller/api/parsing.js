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
    const line = await ctx.dataset.findBy(fieldName, value);
    ctx.body = {
        ...line,
        uri: `uri to ${fieldName}: ${value}`,
    };
};

app.use(route.get('/', getExcerpt));
app.use(route.get('/:fieldName/:value', findBy));

export default app;
