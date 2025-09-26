// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';

export const getFacetFilteredValues = async (
    ctx: any,
    name: any,
    filter: any,
) => {
    try {
        const { page = 0, perPage = 10, sortBy, sortDir } = ctx.request.query;

        // Validate parameters
        const pageNumRaw = parseInt(page, 10);
        const pageNum =
            Number.isFinite(pageNumRaw) && pageNumRaw >= 0 ? pageNumRaw : 0;
        const perPageNumRaw = parseInt(perPage, 10);
        const perPageNum =
            Number.isFinite(perPageNumRaw) && perPageNumRaw >= 1
                ? Math.min(100, perPageNumRaw)
                : 10;

        // Decode filter if it exists
        let searchFilter = filter;
        if (typeof filter === 'string' && filter.length > 0) {
            try {
                searchFilter = decodeURIComponent(filter).trim();
            } catch (e) {
                searchFilter = filter.trim();
            }
        } else if (filter === null || filter === undefined) {
            searchFilter = undefined;
        }

        const [data, total] = await Promise.all([
            ctx.publishedFacet.findValuesForField({
                field: name,
                filter: searchFilter,
                page: pageNum,
                perPage: perPageNum,
                sortBy,
                sortDir,
            }),
            ctx.publishedFacet.countValuesForField(name, searchFilter),
        ]);

        ctx.body = {
            data: data.map((d) => ({
                value: d.value,
                count: d.count,
                id: d._id,
            })),
            total,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            error: 'Internal server error',
            message:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        };
    }
};

const app = new Koa();

// Route for the filters
app.use(
    route.get('/:name/(.*)', (ctx, name, filter = '') => {
        const cleanFilter = filter
            .replace(/^\/+/, '') // remove all leading slashes
            .replace(/\/+$/, ''); // remove all slashes at the end

        return getFacetFilteredValues(ctx, name, cleanFilter);
    }),
);

// Route for name without filters
app.use(route.get('/:name', getFacetFilteredValues));

export default app;
