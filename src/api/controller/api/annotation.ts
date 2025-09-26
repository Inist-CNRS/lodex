// @ts-expect-error TS(2792): Cannot find module '@recuperateur/async-busboy'. D... Remove this comment to see the full error message
import asyncBusboy from '@recuperateur/async-busboy';
import { JsonStreamStringify } from 'json-stream-stringify';
// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
import koaBodyParser from 'koa-bodyparser';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'lodash'. Did you mean to set t... Remove this comment to see the full error message
import { default as _, uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import streamToString from 'stream-to-string';
import {
    ADMIN_ROLE,
    CONTRIBUTOR_ROLE,
    // @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
} from '../../../common/tools/tenantTools';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';
import getLogger from '../../services/logger';
import { getAnnotationNotificationMail } from '../../services/mail/getAnnotationNotificationMail';
import { sendMail } from '../../services/mail/mailer';
import {
    annotationCreationSchema,
    annotationImportSchema,
    annotationUpdateSchema,
    deleteManyAnnotationsSchema,
    getAnnotationsQuerySchema,
    // @ts-expect-error TS(7016): Could not find a declaration file for module './..... Remove this comment to see the full error message
} from './../../../common/validator/annotation.validator';
import { verifyReCaptchaToken } from './recaptcha';

function getResourceTitle(
    resource: any,
    titleField: any,
    subResourceTitleFields: any,
) {
    const lastVersion = resource.versions[resource.versions.length - 1];
    const currentResourceTitleField = resource.subresourceId
        ? subResourceTitleFields.find(
              ({ subresourceId }: any) =>
                  subresourceId === resource.subresourceId,
          )
        : titleField;

    return lastVersion[currentResourceTitleField?.name];
}

async function bindResourceAndFieldToAnnotation(ctx: any, annotation: any) {
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

export const canAnnotate = async (ctx: any) => {
    const role = ctx?.state?.header?.role;
    const configTenant = await ctx.configTenantCollection.findLast();

    if (!configTenant) {
        return false;
    }

    if (configTenant.contributorAuth?.active) {
        return [CONTRIBUTOR_ROLE, ADMIN_ROLE].includes(role);
    }

    return true;
};

export const canAnnotateRoute = async (ctx: any) => {
    ctx.status = 200;
    ctx.body = await canAnnotate(ctx);
};

/**
 * @param {Koa.Context} ctx
 */
export async function createAnnotation(ctx: any) {
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

    const tokenVerification = await verifyReCaptchaToken(ctx, validation.data);
    if (!tokenVerification.success || tokenVerification.score < 0.5) {
        ctx.response.status = 400;
        ctx.body = {
            total: 0,
            errors: [
                {
                    message: 'error_recaptcha_verification_failed',
                },
            ],
        };
        return;
    }

    const createdAnnotation = await ctx.annotation.create(validation.data);
    const config = await ctx.configTenantCollection.findLast();

    if (config?.notificationEmail) {
        const locale = ctx.request.query.locale ?? 'en';

        const annotationWithDetails = await bindResourceAndFieldToAnnotation(
            ctx,
            createdAnnotation,
        );

        const { subject, text } = getAnnotationNotificationMail({
            locale,
            tenant: ctx.tenant,
            annotationWithDetails,
            origin: ctx.request.header.origin,
        });

        await sendMail({
            to: config.notificationEmail,
            subject,
            text,
        });
    }

    ctx.response.status = 200;
    ctx.body = {
        total: 1,
        data: createdAnnotation,
    };
}

const BATCH_SIZE = 100;

export function importAnnotations(asyncBusboyImpl: any) {
    return async (ctx: any) => {
        const { files } = await asyncBusboyImpl(ctx.req);
        const fileStream = files[0];

        try {
            const annotations = await streamToString(fileStream).then(
                (fieldsString: any) => JSON.parse(fieldsString),
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
                    chunk.map(async (annotation: any) => {
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
                                    // @ts-expect-error TS(2571): Object is of type 'unknown'.
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
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
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
}: any) => {
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
            switch (filterOperator) {
                case 'equals':
                    return {
                        [filterBy]: filterValue,
                    };
                case 'contains':
                    return {
                        [filterBy]:
                            createDiacriticSafeContainRegex(filterValue),
                    };
                default:
                    return {};
            }
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
export async function getAnnotations(ctx: any) {
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
        uniq(annotations.map(({ resourceUri }: any) => resourceUri)),
    );

    const resourceByUri = (resources || []).reduce(
        (acc: any, resource: any) => {
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
        },
        {},
    );

    const fieldById = await ctx.field.findManyByIds(
        uniq(
            annotations
                .map(({ fieldId }: any) => fieldId && new ObjectId(fieldId))
                .filter((v: any) => !!v),
        ),
    );

    ctx.response.status = 200;
    ctx.body = {
        total: annotations.length,
        fullTotal,
        data: annotations.map((annotation: any) => ({
            ...annotation,
            resource: resourceByUri[annotation.resourceUri],
            field: fieldById[annotation.fieldId] ?? null,
        })),
    };
}

export const getFieldAnnotations = async (ctx: any) => {
    const { fieldId, resourceUri } = ctx.request.query;
    const [titleField, subResourceTitleFields] = await Promise.all([
        ctx.field.findResourceTitle(),
        ctx.field.findSubResourceTitles(),
    ]);

    const annotations = await ctx.annotation.findManyByFieldAndResource(
        fieldId,
        resourceUri || null,
    );

    const field = await ctx.field.findOneById(fieldId);

    const resource = resourceUri
        ? await ctx.publishedDataset.findByUri(resourceUri)
        : null;

    ctx.response.status = 200;
    ctx.response.body = annotations.map((annotation: any) => ({
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
    }));
};

export async function exportAnnotations(ctx: any) {
    const fields = await ctx.field.find({}).toArray();
    const fieldById = (fields || []).reduce((acc: any, field: any) => {
        return {
            ...acc,
            [field._id]: {
                name: field.name,
                label: field.label,
                internalName: field.internalName,
                internalScopes: field.internalScopes,
            },
        };
    }, {});

    const annotationStream = await ctx.annotation
        .findAll()
        .then((cursor: any) =>
            cursor.stream({
                transform(annotation: any) {
                    return {
                        ...annotation,
                        field: fieldById[annotation.fieldId] ?? null,
                    };
                },
            }),
        );

    ctx.response.attachment('annotations.json');
    ctx.response.status = 200;
    ctx.response.body = new JsonStreamStringify(annotationStream);
}

/**
 * @param {Koa.Context} ctx
 */
export async function getAnnotation(ctx: any, id: any) {
    const annotation = await ctx.annotation.findOneById(id);

    if (!annotation) {
        ctx.response.status = 404;

        return;
    }

    ctx.response.status = 200;
    ctx.response.body = await bindResourceAndFieldToAnnotation(ctx, annotation);
}

/**
 * @param {Koa.Context} ctx
 */
export async function updateAnnotation(ctx: any, id: any) {
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
        data: await bindResourceAndFieldToAnnotation(ctx, updatedAnnotation),
    };
}

export async function deleteAnnotation(ctx: any, id: any) {
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

export async function deleteManyAnnotationById(ctx: any) {
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

export async function deleteManyAnnotationByFilter(ctx: any) {
    const { filterBy, filterOperator, filterValue } = ctx.request.query;
    if (!filterBy || !filterOperator || !filterValue) {
        ctx.response.status = 400;
        ctx.response.body = {
            status: 'error',
            error: 'filter parameter is incomplete',
            deletedCount: 0,
        };
        return;
    }

    try {
        const titleField = await ctx.field.findResourceTitle();

        const query = await buildQuery({
            filterBy,
            filterOperator,
            filterValue,
            ctx,
            titleField,
        });

        const { acknowledged, deletedCount } =
            await ctx.annotation.deleteMany(query);

        if (!acknowledged) {
            ctx.response.status = 500;
            ctx.response.body = {
                status: 'error',
                error: 'failed to execute query',
                deletedCount: 0,
            };
            return;
        }

        if (deletedCount === 0) {
            ctx.response.status = 404;
            ctx.response.body = {
                status: 'error',
                error: `no row match the filter`,
                deletedCount: 0,
            };
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = { status: 'deleted', deletedCount };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Delete dataset rows error`, {
            error,
        });
        ctx.response.status = 500;
        ctx.response.body = { status: 'error', error, deletedCount: 0 };
    }
}

const app = new Koa();

app.use(route.get('/', getAnnotations));
app.use(route.get('/field-annotations', getFieldAnnotations));
app.use(route.get('/export', exportAnnotations));
app.use(route.get('/can-annotate', canAnnotateRoute));
app.use(route.get('/:id', getAnnotation));
app.use(koaBodyParser());
app.use(route.put('/:id', updateAnnotation));
app.use(route.del('/batch-delete-filter', deleteManyAnnotationByFilter));
app.use(route.del('/:id', deleteAnnotation));
app.use(route.del('/', deleteManyAnnotationById));
app.use(route.post('/', createAnnotation));
app.use(route.post('/import', importAnnotations(asyncBusboy)));

export default app;
