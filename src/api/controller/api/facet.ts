import Koa from 'koa';
import route from 'koa-route';

export const getFacetFilteredValues = async (
    ctx: any,
    name: any,
    filter: any,
) => {
    const { page = 0, perPage = 10, sortBy, sortDir } = ctx.request.query;
    const data = await ctx.publishedFacet.findValuesForField({
        field: name,
        filter: typeof filter === 'function' ? undefined : filter,
        page,
        perPage,
        sortBy,
        sortDir,
    });
    const total = await ctx.publishedFacet.countValuesForField(
        name,
        typeof filter === 'function' ? undefined : filter,
    );
    ctx.body = {
        data: data.map((d: any) => ({
            value: d.value,
            count: d.count,
            id: d._id,
        })),
        total,
    };
};

const app = new Koa();

app.use(route.get('/:name/:filter', getFacetFilteredValues));
app.use(route.get('/:name', getFacetFilteredValues));

export default app;
