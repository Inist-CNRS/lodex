import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import { PropositionStatus, autoGenerateUriTransformer } from '@lodex/common';
import { uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import updateFacetValue from '../../services/updateFacetValue';
import ark from './ark';
import { searchSchema, type Filter } from './publishedDataset.schema';
import publishFacets from './publishFacets';

const app = new Koa();

export const completeFilters = async (filters = {}, ctx: any) => {
    if (!filters) {
        return {};
    }

    // @ts-expect-error TS(2339): Property 'annotated' does not exist on type '{}'.
    const { annotated, ...restFilters } = filters;

    if (annotated === undefined) {
        return filters;
    }

    const annotatedResourceUris =
        await ctx.annotation.getAnnotatedResourceUris();

    if (annotated === true) {
        // @ts-expect-error TS(2339): Property 'resourceUris' does not exist on type '{}... Remove this comment to see the full error message
        if (!filters.resourceUris) {
            return {
                ...restFilters,
                resourceUris: annotatedResourceUris,
            };
        }
        return {
            ...restFilters,
            // @ts-expect-error TS(2339): Property 'resourceUris' does not exist on type '{}... Remove this comment to see the full error message
            resourceUris: filters.resourceUris.filter((uri: any) =>
                annotatedResourceUris.includes(uri),
            ),
        };
    }

    if (annotated === false) {
        return {
            ...restFilters,
            // @ts-expect-error TS(2339): Property 'excludedResourceUris' does not exist on ... Remove this comment to see the full error message
            excludedResourceUris: filters.excludedResourceUris
                ? uniq(
                      // @ts-expect-error TS(2339): Property 'excludedResourceUris' does not exist on ... Remove this comment to see the full error message
                      filters.excludedResourceUris.concat(
                          annotatedResourceUris,
                      ),
                  )
                : annotatedResourceUris,
        };
    }

    return undefined;
};

export const getPage = async (ctx: any) => {
    const {
        page = 0,
        perPage = 10,
        match,
        sort: { sortBy, sortDir },
        invertedFacets = [],
        filters,
        facets: facetsWithValueIds,
    } = ctx.request.body;

    const facets = {};

    const completedFilters = await completeFilters(filters, ctx);

    // mongo ignore $in filter with empty array and would return all results
    // also we already know the result will be empty
    if (
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        completedFilters?.resourceUris &&
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        completedFilters?.resourceUris?.length === 0
    ) {
        ctx.body = {
            total: 0,
            fullTotal: 0,
            data: [],
        };
        return;
    }

    for (const [facetName, facetValueIds] of Object.entries(
        facetsWithValueIds,
    )) {
        const facetValues = await Promise.all(
            // @ts-expect-error TS(18046): facetValueIds is of type unknown
            facetValueIds.map(async (facetValueId: any) => {
                const facetValue = await ctx.publishedFacet.findOne({
                    _id: new ObjectId(facetValueId),
                });
                return facetValue.value;
            }),
        );
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
        filters: completedFilters,
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
        data: data.map((doc: any) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

const getFilter = ({ fieldName, value }: Filter) => {
    if (!value) {
        return null;
    }

    if (Array.isArray(value)) {
        return {
            [`versions.0.${fieldName}`]: { $in: value },
        };
    }

    return {
        $or: [
            { [`versions.0.${fieldName}`]: value },
            {
                [`versions.0.${fieldName}`]: {
                    $elemMatch: { $eq: value },
                },
            },
            {
                [`versions.0.${fieldName}`]: {
                    $elemMatch: {
                        $elemMatch: { $eq: value },
                    },
                },
            },
        ],
    };
};

export const searchByField = async (ctx: Koa.Context) => {
    const parseBodyResult = searchSchema.safeParse(ctx.request.body);
    if (!parseBodyResult.success) {
        ctx.status = 400;
        ctx.body = {
            error: 'invalid_request',
        };
        return;
    }

    const { filters, page, perPage, sort } = parseBodyResult.data;
    const transformedFilters = (filters ?? [])
        .map((f) => getFilter(f))
        .filter((f) => !!f);

    const searchFilter = transformedFilters?.length
        ? {
              $and: transformedFilters,
          }
        : {};

    const [data, total] = await Promise.all([
        ctx.publishedDataset
            .find(searchFilter)
            .limit(perPage)
            .skip(page * perPage)
            .sort({
                [sort.sortBy === '_id' ? '_id' : `versions.0.${sort.sortBy}`]:
                    sort.sortDir === 'ASC' ? 1 : -1,
            })
            .toArray(),
        ctx.publishedDataset.count(searchFilter),
    ]);

    ctx.body = {
        total,
        data: data.map(
            (doc: { uri: string; versions: Record<string, unknown>[] }) => ({
                ...doc.versions.at(-1),
                uri: doc.uri,
            }),
        ),
    };
};

export const getRemovedPage = async (ctx: any) => {
    const { page = 0, perPage = 10 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const { data, total } = await ctx.publishedDataset.findRemovedPage(
        intPage,
        intPerPage,
    );

    ctx.body = {
        total,
        data: data.map((doc: any) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
            removed_at: doc.removed_at,
            reason: doc.reason,
        })),
    };
};

export const removeResource = async (ctx: any) => {
    const { uri, reason } = ctx.request.body;
    const removedAt = ctx.request.body.removedAt ?? new Date();
    const targetResource = await ctx.publishedDataset.findByUri(uri);
    if (!targetResource || targetResource.removedAt) {
        ctx.status = 404;
        ctx.body = 'Resource not found';
        return;
    }
    await ctx.hiddenResource.create({
        uri,
        reason,
        removedAt,
    });
    ctx.body = await ctx.publishedDataset.hide(uri, reason, removedAt);

    if ((await ctx.publishedDataset.countAll()) > 0) {
        const fields = await ctx.field.findAll();
        await publishFacets(ctx, fields, true);
    }
};

export const restoreResource = async (ctx: any) => {
    const { uri } = ctx.request.body;
    const targetResource = await ctx.publishedDataset.findByUri(uri);
    if (!targetResource || !targetResource.removedAt) {
        ctx.status = 404;
        ctx.body = 'Resource not found';
        return;
    }
    await ctx.hiddenResource.deleteByUri(uri);
    ctx.body = await ctx.publishedDataset.restore(uri);

    if ((await ctx.publishedDataset.countAll()) > 0) {
        const fields = await ctx.field.findAll();
        await publishFacets(ctx, fields, true);
    }
};

export const addFieldToResource = async (ctx: any) => {
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

export const changePropositionStatus = async (
    ctx: any,
    uri: any,
    name: any,
    status: any,
) => {
    ctx.body = await ctx.publishedDataset.changePropositionStatus(
        uri,
        name,
        status,
    );
};

export const getPropositionPage = async (
    ctx: any,
    status = PropositionStatus.PROPOSED,
) => {
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
        data: data.map((doc: any) => ({
            ...doc.versions[doc.versions.length - 1],
            uri: doc.uri,
        })),
    };
};

export const prepareEditResource = async (ctx: any, next: any) => {
    ctx.updateFacetValue = updateFacetValue(ctx.publishedFacet);
    await next();
};

export const editResource = async (ctx: any) => {
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

export const createResource = async (ctx: any) => {
    const newResource = ctx.request.body;
    if (!newResource.uri) {
        newResource.uri = await autoGenerateUriTransformer()();
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
app.use(route.post('/', getPage));
app.use(route.post('/search', searchByField));
app.use(route.put('/add_field', addFieldToResource));
app.use(route.get('/ark', ark));
app.use(async (ctx: any, next: any) => {
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
