import Koa from 'koa';
import route from 'koa-route';

export const getFacetFilteredValues = async (ctx, name, filter) => {
    try {
        const { page = 0, perPage = 10, sortBy, sortDir } = ctx.request.query;

        // Validation des paramètres
        const pageNumRaw = parseInt(page, 10);
        const pageNum =
            Number.isFinite(pageNumRaw) && pageNumRaw >= 0 ? pageNumRaw : 0;
        const perPageNumRaw = parseInt(perPage, 10);
        const perPageNum =
            Number.isFinite(perPageNumRaw) && perPageNumRaw >= 1
                ? Math.min(100, perPageNumRaw)
                : 10;

        // Décoder le filtre s'il existe et nettoyer les espaces en fin
        let searchFilter = filter;
        if (typeof filter === 'string') {
            searchFilter = decodeURIComponent(filter).trim();
            // Si le filtre est vide après trim, on le considère comme undefined
            if (!searchFilter) {
                searchFilter = undefined;
            }
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

// Route pour les filtres
app.use(
    route.get('/:name/(.*)', (ctx, name, filter) => {
        const cleanFilter = filter
            ? filter.split('/').filter(Boolean).join('/').trim() || undefined
            : undefined;
        return getFacetFilteredValues(ctx, name, cleanFilter);
    }),
);

// Route pour le nom seul (sans filtre)
app.use(route.get('/:name', getFacetFilteredValues));

export default app;
