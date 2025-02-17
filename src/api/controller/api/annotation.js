import { JsonStreamStringify } from 'json-stream-stringify';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import { default as _ } from 'lodash';

import asyncBusboy from '@recuperateur/async-busboy';
import { uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import streamToString from 'stream-to-string';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';
import getLogger from '../../services/logger';
import {
    annotationCreationSchema,
    annotationImportSchema,
    annotationUpdateSchema,
    deleteManyAnnotationsSchema,
    getAnnotationsQuerySchema,
} from './../../../common/validator/annotation.validator';
import {
    ADMIN_ROLE,
    CONTRIBUTOR_ROLE,
} from '../../../common/tools/tenantTools';

export const canAnnotate = async (ctx) => {
    const role = ctx?.state?.header?.role;
    const configTenant = await ctx.configTenantCollection.findLast();

    if (!configTenant) {
        return false;
    }

    if (configTenant.contributorAuth.active) {
        return [CONTRIBUTOR_ROLE, ADMIN_ROLE].includes(role);
    }

    return true;
};

export const canAnnotateRoute = async (ctx) => {
    ctx.status = 200;
    ctx.body = await canAnnotate(ctx);
};

/**
 * @param {Koa.Context} ctx
 */
export async function createAnnotation(ctx) {
    if ((await canAnnotate(ctx)) === false) {
        ctx.response.status = 403;
        return;
    }
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

const BATCH_SIZE = 100;

export function importAnnotations(asyncBusboyImpl) {
    return async (ctx) => {
        const { files } = await asyncBusboyImpl(ctx.req);
        const fileStream = files[0];

        try {
            const annotations = await streamToString(fileStream).then(
                (fieldsString) => JSON.parse(fieldsString),
            );
            const failedImports = [];

            if (!Array.isArray(annotations)) {
                ctx.response.status = 400;
                ctx.body = {
                    total: 0,
                    failedImports: [],
                };
            }

            const chunks = _.chunk(annotations, BATCH_SIZE);
            for (const chunk of chunks) {
                const importResults = await Promise.all(
                    chunk.map(async (annotation) => {
                        try {
                            const { success, data, error } =
                                annotationImportSchema.safeParse(annotation);

                            if (!success) {
                                return {
                                    success: false,
                                    annotation,
                                    errors: error.errors,
                                };
                            }

                            await ctx.annotation.create(data);

                            return {
                                success: true,
                            };
                        } catch (e) {
                            return {
                                success: false,
                                annotation,
                                errors: [
                                    { message: e.message ?? e.toString() },
                                ],
                            };
                        }
                    }),
                );

                for (const result of importResults) {
                    if (!result.success) {
                        failedImports.push({
                            annotation: result.annotation,
                            errors: result.errors,
                        });
                    }
                }
            }

            ctx.response.status = 200;
            ctx.body = {
                total: annotations.length,
                failedImports,
            };
        } catch (e) {
            // JSON parsing error
            if (e.constructor?.name === 'SyntaxError') {
                ctx.response.status = 400;
                ctx.body = {
                    success: false,
                    errors: [
                        {
                            message: 'Invalid JSON File',
                        },
                    ],
                };
                return;
            }

            const logger = getLogger(ctx.tenant);
            logger.error(`An error occured while importing annotations`, e);

            ctx.response.status = 500;
            ctx.body = {
                success: false,
                errors: [
                    {
                        message: 'Internal Server Error',
                    },
                ],
            };
        }
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
        case 'administrator':
        case 'initialValue':
        case 'proposedValue':
        case 'authorName':
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
        case 'kind':
        case 'status': {
            switch (filterOperator) {
                case 'equals':
                    return {
                        [filterBy]: filterValue,
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

export async function exportAnnotations(ctx) {
    const annotationStream = await ctx.annotation
        .findAll()
        .then((cursor) => cursor.stream());

    ctx.response.attachment('annotations.json');
    ctx.response.status = 200;
    ctx.response.body = new JsonStreamStringify(annotationStream);
}

async function bindResourceAndFieldToAnnnotation(ctx, annotation) {
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

    return {
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
export async function getAnnotation(ctx, id) {
    const annotation = await ctx.annotation.findOneById(id);

    if (!annotation) {
        ctx.response.status = 404;

        return;
    }

    ctx.response.status = 200;
    ctx.response.body = await bindResourceAndFieldToAnnnotation(
        ctx,
        annotation,
    );
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
    ctx.response.body = {
        data: await bindResourceAndFieldToAnnnotation(ctx, updatedAnnotation),
    };
}

export async function deleteAnnotation(ctx, id) {
    const deletedCount = await ctx.annotation.deleteOneById(id);
    if (deletedCount === 0) {
        ctx.response.status = 404;
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
    };
}

export async function deleteManyAnnotation(ctx) {
    const validation = deleteManyAnnotationsSchema.safeParse(ctx.request.body);

    if (!validation.success) {
        ctx.response.status = 400;
        ctx.response.body = {
            deletedCount: 0,
            errors: validation.error.errors,
        };
        return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
        deletedCount: await ctx.annotation.deleteManyById(validation.data),
    };
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
app.use(route.get('/export', exportAnnotations));
app.use(route.get('/can-annotate', canAnnotateRoute));
app.use(route.get('/:id', getAnnotation));
app.use(koaBodyParser());
app.use(route.put('/:id', updateAnnotation));
app.use(route.del('/:id', deleteAnnotation));
app.use(route.del('/', deleteManyAnnotation));
app.use(route.post('/', createAnnotation));
app.use(route.post('/import', importAnnotations(asyncBusboy)));

export default app;
