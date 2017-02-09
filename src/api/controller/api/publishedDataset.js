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
        data: data.map(doc => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const editResource = async (ctx) => {
    const newVersion = ctx.request.body;
    const resource = await ctx.publishedDataset.findByUri(newVersion.uri);
    if (!resource) {
        ctx.status = 404;
        ctx.body = 'Document not found';
        return;
    }

    ctx.body = await ctx.publishedDataset.addVersion(resource, newVersion);
};

app.use(route.get('/', getPage));
app.use(route.post('/', editResource));

export default app;
