import Koa from 'koa';
import route from 'koa-route';

export const getFacetFilteredValues = async (ctx, name, filter) => {
    const data = await ctx.publishedFacet.findValuesForField(name, typeof filter === 'function' ? undefined : filter);
    const total = await ctx.publishedFacet.countValuesForField(name, typeof filter === 'function' ? undefined : filter);
    ctx.body = { data: data.map(d => d.value), total };
};

const app = new Koa();

app.use(route.get('/:name/:filter', getFacetFilteredValues));
app.use(route.get('/:name', getFacetFilteredValues));

export default app;
