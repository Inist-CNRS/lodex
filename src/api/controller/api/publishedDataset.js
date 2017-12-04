import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import { PROPOSED } from '../../../common/propositionStatus';
import generateUri from '../../../common/transformers/AUTOGENERATE_URI';
import ark from './ark';

const app = new Koa();

export const getPage = async ctx => {
    const {
        page = 0,
        perPage = 10,
        match,
        sortBy,
        sortDir,
        ...facets
    } = ctx.request.query;

    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const searchableFieldNames = await ctx.field.findSearchableNames();
    const facetFieldNames = await ctx.field.findFacetNames();

    const { data, total } = await ctx.publishedDataset.findPage(
        intPage,
        intPerPage,
        sortBy,
        sortDir,
        match,
        facets,
        searchableFieldNames,
        facetFieldNames,
    );

    ctx.body = {
        total,
        data: data.map(doc => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const getRemovedPage = async ctx => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const { data, total } = await ctx.publishedDataset.findRemovedPage(
        intPage,
        intPerPage,
    );

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

export const removeResource = async ctx => {
    const { uri, reason } = ctx.request.body;

    ctx.body = await ctx.publishedDataset.hide(uri, reason);
};

export const restoreResource = async ctx => {
    const { uri } = ctx.request.body;
    ctx.body = await ctx.publishedDataset.restore(uri);
};

export const addFieldToResource = async ctx => {
    const isLoggedIn = !!ctx.state.header && !!ctx.state.cookie;
    const { uri, contributor, field } = ctx.request.body;
    const fieldName = await ctx.field.addContributionField(
        field,
        contributor,
        isLoggedIn,
    );

    ctx.body = await ctx.publishedDataset.addFieldToResource(
        uri,
        contributor,
        {
            ...field,
            name: fieldName,
            display_in_resource: true,
            searchable: true,
        },
        isLoggedIn,
    );
};

export const changePropositionStatus = async (ctx, uri, name, status) => {
    ctx.body = await ctx.publishedDataset.changePropositionStatus(
        uri,
        name,
        status,
    );
};

export const getPropositionPage = async (ctx, status = PROPOSED) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const { data, total } = await ctx.publishedDataset.findContributedPage(
        intPage,
        intPerPage,
        status,
    );

    ctx.body = {
        total,
        data: data.map(doc => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const editResource = async ctx => {
    const newVersion = ctx.request.body;
    const resource = await ctx.publishedDataset.findByUri(newVersion.uri);
    if (!resource || resource.removed_at) {
        ctx.status = 404;
        ctx.body = 'Document not found';
        return;
    }

    ctx.body = await ctx.publishedDataset.addVersion(resource, newVersion);
};

export const createResource = async ctx => {
    const newResource = ctx.request.body;
    if (!newResource.uri) {
        newResource.uri = await generateUri()();
    }

    const resource = await ctx.publishedDataset.findByUri(newResource.uri);
    if (resource) {
        ctx.status = 400;
        ctx.body = 'uri_conflict';
        return;
    }

    await ctx.publishedDataset.create(newResource);

    ctx.body = {
        uri: newResource.uri,
    };
};

app.use(koaBodyParser());
app.use(route.get('/removed', getRemovedPage));
app.use(route.get('/', getPage));
app.use(route.put('/add_field', addFieldToResource));
app.use(route.get('/ark', ark));
app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});
app.use(route.post('/', createResource));
app.use(route.put('/', editResource));
app.use(route.put('/restore', restoreResource));
app.use(route.del('/', removeResource));
app.use(route.get('/:status', getPropositionPage));
app.use(
    route.put(
        '/:uri/change_contribution_status/:name/:status',
        changePropositionStatus,
    ),
);

export default app;
