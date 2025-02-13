import { default as z } from 'zod';

export const kinds = ['removal', 'comment', 'correct', 'addition'];

export const annotationCreationSchema = z
    .object({
        resourceUri: z.string().nullish().default(null),
        target: z.enum(['title', 'value']).nullish().default('title'),
        kind: z.enum(kinds).nullish().default('comment'),
        fieldId: z
            .string()
            .trim()
            .min(1, {
                message: 'error_required',
            })
            .optional(),
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
        authorName: z
            .string({
                required_error: 'error_required',
            })
            .trim()
            .min(1, {
                message: 'error_required',
            }),
        authorEmail: z
            .union([
                z.literal(''),
                z.string().email({
                    message: 'error_invalid_email',
                }),
            ])
            .nullish()
            .default(null)
            .transform((value) => (value === '' ? null : value)),
        initialValue: z.string().nullish().default(null),
        proposedValue: z.string().nullish().default(null),
    })
    .superRefine((data, refineContext) => {
        if (
            data.target === 'value' &&
            data.kind !== 'addition' &&
            !data.initialValue
        ) {
            refineContext.addIssue({
                code: 'error_required',
                message: 'annotation_error_required_initial_value',
                path: ['initialValue'],
            });
        }
        if (
            (data.target === 'title' && data.initialValue) ||
            (data.kind === 'addition' && data.initialValue)
        ) {
            refineContext.addIssue({
                code: 'error_empty',
                message: 'annotation_error_empty_initial_value',
                path: ['initialValue'],
            });
        }
        if (
            ['correct', 'addition'].includes(data.kind) &&
            !data.proposedValue
        ) {
            refineContext.addIssue({
                code: 'error_required',
                message: 'annotation_error_required_proposed_value',
                path: ['proposedValue'],
            });
        }
        if (data.kind === 'removal' && data.proposedValue) {
            refineContext.addIssue({
                code: 'error_empty',
                message: 'annotation_error_empty_proposed_value',
                path: ['proposedValue'],
            });
        }
        if (data.target === 'title' && data.kind !== 'comment') {
            refineContext.addIssue({
                code: 'error_invalid',
                message: 'annotation_error_title_invalid_kind',
                path: ['kind'],
            });
        }
        if (data.target === 'value' && data.kind === 'comment') {
            refineContext.addIssue({
                code: 'error_invalid',
                message: 'annotation_error_value_invalid_kind',
                path: ['kind'],
            });
        }
    });

export const annotationUpdateSchema = z.object({
    status: z.enum(['to_review', 'ongoing', 'validated', 'rejected']),
    internalComment: z
        .string({
            required_error: 'error_required',
        })
        .trim()
        .min(1, {
            message: 'error_required',
        }),
    administrator: z
        .union([
            z.literal(''),
            z
                .string({
                    required_error: 'error_required',
                })
                .trim()
                .min(1, {
                    message: 'error_required',
                }),
        ])
        .nullish()
        .default(null)
        .transform((value) => (value === '' ? null : value)),
});

const annotationFilterableFields = z
    .enum(
        [
            'resource.title',
            'kind',
            'authorName',
            'resourceUri',
            'fieldId',
            'comment',
            'initialValue',
            'proposedValue',
            'status',
            'internalComment',
            'administrator',
            'createdAt',
            'updatedAt',
            'field.label',
            'field.name',
            'field.internalName',
            'field.internalScopes',
        ],
        {
            message: 'annotation_query_filter_by_invalid_key',
        },
    )
    .optional();

const annotationSortableFields = z
    .enum(
        [
            'resourceUri',
            'fieldId',
            'createdAt',
            'updatedAt',
            'comment',
            'status',
            'internalComment',
            'administrator',
            'kind',
        ],
        {
            message: 'annotation_query_sortBy_invalid',
        },
    )
    .default('createdAt');

export const getAnnotationsQuerySchema = z.object({
    page: z.coerce
        .number({
            message: 'error_invalid_number',
        })
        .min(0, {
            message: 'error_page_invalid',
        })
        .optional()
        .default(0),
    perPage: z.coerce
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
    filterBy: annotationFilterableFields,
    filterOperator: z
        .enum(['contains', 'is', 'after', 'before', 'equals'], {
            message: 'annotation_query_filter_operator_invalid_key',
        })
        .optional(),
    filterValue: z.string().optional(),
    sortBy: annotationSortableFields,
    sortDir: z
        .enum(['asc', 'desc'], {
            message: 'error_sortDir_invalid',
        })
        .default('desc'),
});
