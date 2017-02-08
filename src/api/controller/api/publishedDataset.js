import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

export const getPage = async (ctx) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const [data, total] = await Promise.all([
        ctx.publishedDataset.findLimitFromSkip(intPerPage, intPage * intPerPage),
        ctx.publishedDataset.count(),
    ]);

    ctx.body = {
        total,
        data,
    };
};

export const editResource = async (ctx) => {
    const newResource = ctx.request.body;
    const oldVersion = ctx.publishedDataset.findById(newResource.replaceAndCancel);
    if (!oldVersion) {
        ctx.status = 403;
        ctx.body = `Forbidden: No older version has been found for document ${newResource.uri}`;
        return;
    }

    ctx.body = await ctx.publishedDataset.addVersion({
        newResource,
        uri: oldVersion.uri,
    });
};

app.use(route.get('/', getPage));
app.use(route.post('/', editResource));

export default app;
