import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';

import { uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';
import {
    annotationCreationSchema,
    annotationUpdateSchema,
    getAnnotationsQuerySchema,
} from './../../../common/validator/annotation.validator';

/**
 * @param {Koa.Context} ctx
 */
export async function createAnnotation(ctx) {
    const validation = annotationCreationSchema.safeParse(ctx.request.body);
    if (!validation.success) {
        ctx.response.status = 400;
        ctx.body = {
            total: 0,
            errors: validation.error.errors,
        };
        return;
    }

    ctx.response.status = 200;
    ctx.body = {
        total: 1,
        data: await ctx.annotation.create(validation.data),
    };
}

export const buildQuery = async ({
    filterBy,
    filterOperator,
    filterValue,
    titleField,
    ctx,
}) => {
    if (!filterValue) {
        return {};
    }
    switch (filterBy) {
        case 'updatedAt':
        case 'createdAt': {
            const date = new Date(filterValue);
            switch (filterOperator) {
                case 'is': {
                    return {
                        [filterBy]: {
                            $lt: new Date(
                                new Date(date).setDate(date.getDate() + 1),
                            ),
                            $gte: date,
                        },
                    };
                }
                case 'after':
                    return { [filterBy]: { $gte: date } };
                case 'before':
                    return { [filterBy]: { $lte: date } };
                default:
                    return {};
            }
        }
        case 'resourceUri':
        case 'internalComment':
        case 'status':
        case 'comment': {
            switch (filterOperator) {
                case 'contains':
                    return {
                        [filterBy]:
                            createDiacriticSafeContainRegex(filterValue),
                    };
                default:
                    return {};
            }
        }
        case 'authorName': {
            switch (filterOperator) {
                case 'contains':
                    return {
                        [filterBy]:
                            createDiacriticSafeContainRegex(filterValue),
                    };
                default:
                    return {};
            }
        }
        case 'resource.title': {
            switch (filterOperator) {
                case 'contains': {
                    const uris = await ctx.publishedDataset.findUrisByTitle({
                        value: filterValue,
                        titleField,
                    });

                    return { resourceUri: { $in: uris } };
                }
                default:
                    return {};
            }
        }
        case 'field.label': {
            switch (filterOperator) {
                case 'contains': {
                    const ids = await ctx.field.findIdsByLabel(filterValue);

                    return { fieldId: { $in: ids } };
                }
                default:
                    return {};
            }
        }
        case 'field.name': {
            switch (filterOperator) {
                case 'contains': {
                    const ids = await ctx.field.findIdsByName(filterValue);

                    return { fieldId: { $in: ids } };
                }
                default:
                    return {};
            }
        }
        case 'field.internalName': {
            switch (filterOperator) {
                case 'contains': {
                    const ids =
                        await ctx.field.findIdsByInternalName(filterValue);

                    return { fieldId: { $in: ids } };
                }
                default:
                    return {};
            }
        }
        case 'field.internalScopes': {
            switch (filterOperator) {
                case 'contains': {
                    const ids =
                        await ctx.field.findIdsByInternalScopes(filterValue);

                    return { fieldId: { $in: ids } };
                }
                default:
                    return {};
            }
        }
        default: {
            return {};
        }
    }
};

/**
 * @param {Koa.Context} ctx
 */
export async function getAnnotations(ctx) {
    const validation = getAnnotationsQuerySchema.safeParse(ctx.request.query);

    if (!validation.success) {
        ctx.response.status = 400;
        ctx.body = {
            total: 0,
            fullTotal: 0,
            errors: validation.error.errors,
            data: [],
        };
        return;
    }

    const {
        page,
        perPage: limit,
        sortBy,
        sortDir,
        filterBy,
        filterValue,
        filterOperator,
    } = validation.data;

    const skip = page * limit;
    const [titleField, subResourceTitleFields] = await Promise.all([
        ctx.field.findResourceTitle(),
        ctx.field.findSubResourceTitles(),
    ]);

    const query = await buildQuery({
        filterBy,
        filterOperator,
        filterValue,
        ctx,
        titleField,
    });

    const [annotations, fullTotal] = await Promise.all([
        ctx.annotation.findLimitFromSkip({
            limit,
            skip,
            query,
            sortBy,
            sortDir,
        }),
        ctx.annotation.count(query),
    ]);

    const resources = await ctx.publishedDataset.findManyByUris(
        uniq(annotations.map(({ resourceUri }) => resourceUri)),
    );

    const resourceByUri = (resources || []).reduce((acc, resource) => {
        return {
            ...acc,
            [resource.uri]: {
                uri: resource.uri,
                title: getResourceTitle(
                    resource,
                    titleField,
                    subResourceTitleFields,
                ),
            },
        };
    }, {});

    const fieldById = await ctx.field.findManyByIds(
        uniq(
            annotations
                .map(({ fieldId }) => fieldId && new ObjectId(fieldId))
                .filter((v) => !!v),
        ),
    );

    ctx.response.status = 200;
    ctx.body = {
        total: annotations.length,
        fullTotal,
        data: annotations.map((annotation) => ({
            ...annotation,
            resource: resourceByUri[annotation.resourceUri],
            field: fieldById[annotation.fieldId] ?? null,
        })),
    };
}
/**
 * @param {Koa.Context} ctx
 */
export async function getAnnotation(ctx, id) {
    const annotation = await ctx.annotation.findOneById(id);

    if (!annotation) {
        ctx.response.status = 404;

        return;
    }

    const [titleField, subResourceTitleFields] = await Promise.all([
        ctx.field.findResourceTitle(),
        ctx.field.findSubResourceTitles(),
    ]);

    const resource = annotation.resourceUri
        ? await ctx.publishedDataset.findByUri(annotation.resourceUri)
        : null;

    const field = annotation.fieldId
        ? await ctx.field.findOneById(annotation.fieldId)
        : null;

    ctx.response.status = 200;
    ctx.response.body = {
        ...annotation,
        field,
        resource: resource
            ? {
                  title: getResourceTitle(
                      resource,
                      titleField,
                      subResourceTitleFields,
                  ),
                  uri: resource.uri,
              }
            : null,
    };
}

/**
 * @param {Koa.Context} ctx
 */
export async function updateAnnotation(ctx, id) {
    const validation = annotationUpdateSchema.safeParse(ctx.request.body);
    if (!validation.success) {
        ctx.response.status = 400;
        ctx.response.body = {
            errors: validation.error.errors,
        };
        return;
    }

    const updatedAnnotation = await ctx.annotation.updateOneById(
        id,
        validation.data,
    );

    if (!updatedAnnotation) {
        ctx.response.status = 404;
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = { data: updatedAnnotation };
}

function getResourceTitle(resource, titleField, subResourceTitleFields) {
    const lastVersion = resource.versions[resource.versions.length - 1];
    const currentResourceTitleField = resource.subresourceId
        ? subResourceTitleFields.find(
              ({ subresourceId }) => subresourceId === resource.subresourceId,
          )
        : titleField;

    return lastVersion[currentResourceTitleField?.name];
}

const app = new Koa();

app.use(route.get('/', getAnnotations));
app.use(route.get('/:id', getAnnotation));
app.use(koaBodyParser());
app.use(route.put('/:id', updateAnnotation));
app.use(route.post('/', createAnnotation));

export default app;
