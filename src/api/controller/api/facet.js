import Koa from 'koa';
import route from 'koa-route';

export const getFacetFilteredValues = async (ctx, name, filter) => {
    try {
        const { page = 0, perPage = 10, sortBy, sortDir } = ctx.request.query;

        // Validation des paramètres
        const pageNum = Math.max(0, parseInt(page, 10) || 0);
        const perPageNum = Math.min(
            100,
            Math.max(1, parseInt(perPage, 10) || 10),
        );

        // Décoder le filtre s'il existe et nettoyer les espaces en fin
        let searchFilter = filter;
        if (typeof filter === 'string') {
            searchFilter = decodeURIComponent(filter).trim();
            // Si le filtre est vide après trim, on le considère comme undefined
            if (!searchFilter) {
                searchFilter = undefined;
            }
        } else if (typeof filter === 'function') {
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

// Route pour les filtres
app.use(
    route.get('/:name/(.*)', (ctx, name, filter) => {
        // Si le filtre est vide ou juste des slashes, on le traite comme undefined
        const cleanFilter = filter && filter.replace(/^\/+|\/+$/g, '').trim();
        return getFacetFilteredValues(ctx, name, cleanFilter || undefined);
    }),
);

// Route pour le nom seul (sans filtre)
app.use(route.get('/:name', getFacetFilteredValues));

export default app;
