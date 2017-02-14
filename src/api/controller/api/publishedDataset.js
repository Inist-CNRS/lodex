import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

export const getPage = async (ctx) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const [data, total] = await Promise.all([
        ctx.publishedDataset.findPage(intPage, intPerPage),
        ctx.publishedDataset.countWithoutRemoved(),
    ]);

    ctx.body = {
        total,
        data: data.map(doc => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const getRemovedPage = async (ctx) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const [data, total] = await Promise.all([
        ctx.publishedDataset.findRemovedPage(intPage, intPerPage),
        ctx.publishedDataset.countRemoved(),
    ]);

    ctx.body = {
        total,
        data: data.map(doc => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
            removed_at: doc.removed_at,
            reason: doc.reason,
        })),
    };
};

export const editResource = async (ctx) => {
    const newVersion = ctx.request.body;
    const resource = await ctx.publishedDataset.findByUri(newVersion.uri);
    if (!resource || resource.removed_at) {
        ctx.status = 404;
        ctx.body = 'Document not found';
        return;
    }

    ctx.body = await ctx.publishedDataset.addVersion(resource, newVersion);
};

export const removeResource = async (ctx) => {
    const { uri, reason } = ctx.request.body;

    ctx.body = await ctx.publishedDataset.hide(uri, reason);
};

export const restoreResource = async (ctx) => {
    const { uri } = ctx.request.body;
    ctx.body = await ctx.publishedDataset.restore(uri);
};

app.use(route.get('/removed', getRemovedPage));
app.use(route.get('/', getPage));
app.use(route.post('/', editResource));
app.use(route.put('/restore', restoreResource));
app.use(route.del('/', removeResource));

export default app;
