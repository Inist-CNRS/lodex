import { default as z } from 'zod';

export const annotationSchema = z.object({
    resourceUri: z.string().nullish().default(null),
    kind: z.enum(['correction', 'comment']).nullish().default('comment'),
    // A path that points to the field / item of a field that the annotation is about.
    // MUST be compatible with _.get
    // See https://lodash.com/docs/4.17.15#get
    itemPath: z
        .array(z.string(), {
            message: 'annotation_itemPath_invalid',
        })
        .nullish()
        .default(null),
    comment: z
        .string({
            required_error: 'error_required',
        })
        .trim()
        .min(1, {
            message: 'error_required',
        }),
});

const annotationFilterableFields = z
    .record(
        z.enum(['resourceUri', 'fieldId'], {
            message: 'annotation_query_match_invalid_key',
        }),
        z
            .string({
                message: 'annotation_query_match_invalid_value',
            })
            .nullable(),
    )
    .optional()
    .default({});

const annotationSortableFields = z
    .enum(['resourceUri', 'fieldId', 'createdAt', 'updatedAt'], {
        message: 'annotation_query_sortBy_invalid',
    })
    .default('createdAt');

export const getAnnotationsQuerySchema = z.object({
    page: z
        .number({
            message: 'error_invalid_number',
        })
        .min(0, {
            message: 'error_page_invalid',
        })
        .optional()
        .default(0),
    perPage: z
        .number({
            message: 'error_invalid_number',
        })
        .min(1, {
            message: 'annotation_query_perPage_length',
        })
        .max(100, {
            message: 'annotation_query_perPage_length',
        })
        .optional()
        .default(10),
    match: annotationFilterableFields,
    sortBy: annotationSortableFields,
    sortDir: z
        .enum(['ASC', 'DESC'], {
            message: 'error_sortDir_invalid',
        })
        .default('DESC'),
});
