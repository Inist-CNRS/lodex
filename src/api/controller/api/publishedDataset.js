import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';

import { PROPOSED } from '../../../common/propositionStatus';
import generateUri from '../../../common/transformers/AUTOGENERATE_URI';
import ark from './ark';
import updateFacetValue from '../../services/updateFacetValue';
import { ObjectId } from 'mongodb';

const app = new Koa();

export const getPage = async (ctx) => {
    const {
        page = 0,
        perPage = 10,
        match,
        sortBy,
        sortDir,
        invertedFacets = [],
        ...facetsWithValueIds
    } = ctx.request.query;

    let facets = {};

    for (const [facetName, facetValueIds] of Object.entries(
        facetsWithValueIds,
    )) {
        const facetValues = await Promise.all(
            facetValueIds.map(async (facetValueId) => {
                const facetValue = await ctx.publishedFacet.findOne({
                    _id: new ObjectId(facetValueId),
                });
                return facetValue.value;
            }),
        );
        facets[facetName] = facetValues;
    }

    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const searchableFieldNames = await ctx.field.findSearchableNames();
    const facetFieldNames = await ctx.field.findFacetNames();

    const { data, total } = await ctx.publishedDataset.findPage({
        page: intPage,
        perPage: intPerPage,
        sortBy,
        sortDir,
        match,
        facets,
        invertedFacets,
        searchableFieldNames,
        facetFieldNames,
        excludeSubresources: true,
    });

    const fullTotal = await ctx.publishedDataset.countAll({
        excludeSubresources: true,
    });

    ctx.body = {
        total,
        fullTotal,
        data: data.map((doc) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const getRemovedPage = async (ctx) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const { data, total } = await ctx.publishedDataset.findRemovedPage(
        intPage,
        intPerPage,
    );

    ctx.body = {
        total,
        data: data.map((doc) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
            removed_at: doc.removed_at,
            reason: doc.reason,
        })),
    };
};

export const removeResource = async (ctx) => {
    const { uri, reason } = ctx.request.body;
    const removedAt = ctx.request.body.removedAt ?? new Date();
    await ctx.hiddenResource.create({
        uri,
        reason,
        removedAt,
    });
    ctx.body = await ctx.publishedDataset.hide(uri, reason, removedAt);
};

export const restoreResource = async (ctx) => {
    const { uri } = ctx.request.body;
    await ctx.hiddenResource.deleteByUri(uri);
    ctx.body = await ctx.publishedDataset.restore(uri);
};

export const addFieldToResource = async (ctx) => {
    const isLoggedIn = ctx.state.isAdmin;
    const { uri, contributor, field } = ctx.request.body;
    const fieldName = await ctx.field.addContributionField(
        field,
        contributor,
        isLoggedIn,
    );

    await ctx.publishedDataset.addFieldToResource(
        uri,
        contributor,
        {
            ...field,
            name: fieldName,
            display: true,
            searchable: false,
        },
        isLoggedIn,
    );

    ctx.body = {
        field: await ctx.field.findOneByName(fieldName),
        resource: await ctx.publishedDataset.findByUri(uri),
    };
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
        data: data.map((doc) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const prepareEditResource = async (ctx, next) => {
    ctx.updateFacetValue = updateFacetValue(ctx.publishedFacet);
    await next();
};

export const editResource = async (ctx) => {
    const { resource: newVersion, field } = ctx.request.body;
    const resource = await ctx.publishedDataset.findByUri(newVersion.uri);
    if (!resource || resource.removed_at) {
        ctx.status = 404;
        ctx.body = 'Document not found';
        return;
    }

    const result = await ctx.publishedDataset.addVersion(resource, newVersion);

    if (field.isFacet) {
        const latestVersion = resource.versions.slice(-1)[0];

        await ctx.updateFacetValue({
            field: field.name,
            oldValue: latestVersion[field.name],
            newValue: newVersion[field.name],
        });
    }

    ctx.body = result;
};

export const createResource = async (ctx) => {
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
    if (!ctx.state.isAdmin) {
        ctx.status = 401;
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});
app.use(route.post('/', createResource));
app.use(route.put('/', prepareEditResource));
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
