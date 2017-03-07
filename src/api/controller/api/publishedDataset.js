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

export const addFieldToResource = async (ctx) => {
    const isLoggedIn = !!ctx.state.header && !!ctx.state.cookie;
    const { uri, contributor, field } = ctx.request.body;
    const fieldName = await ctx.field.addContributionField(field, contributor, isLoggedIn);

    ctx.body = await ctx.publishedDataset.addFieldToResource(uri, contributor, {
        ...field,
        name: fieldName,
    }, isLoggedIn);
};

export const changePropositionStatus = async (ctx, uri, name, status) => {
    ctx.body = await ctx.publishedDataset.changePropositionStatus(uri, name, status);
};

export const getPropositionPage = async (ctx, status) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    ctx.body = await ctx.publishedDataset.findContributionPage(page, perPage, status);
};

app.use(route.get('/removed', getRemovedPage));
app.use(route.get('/', getPage));
app.use(route.post('/add_field', addFieldToResource));
app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        this.status = 401;
        this.body = 'No authentication token found';
        return;
    }

    await next();
});
app.use(route.post('/', editResource));
app.use(route.put('/restore', restoreResource));
app.use(route.del('/', removeResource));
app.use(route.get('/contribution/:status', getPropositionPage));
app.use(route.put('/:uri/change_contribution_status/:name/:status', changePropositionStatus));

export default app;
