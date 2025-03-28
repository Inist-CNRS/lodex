import { default as z } from 'zod';

export const ANNOTATION_KIND_REMOVAL = 'removal';
export const ANNOTATION_KIND_COMMENT = 'comment';
export const ANNOTATION_KIND_CORRECTION = 'correction';
export const ANNOTATION_KIND_ADDITION = 'addition';

export const kinds = [
    ANNOTATION_KIND_REMOVAL,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_ADDITION,
];

export const statuses = [
    'to_review',
    'ongoing',
    'validated',
    'rejected',
    'parking',
];

export const annotationCreationSchema = z
    .object({
        resourceUri: z.string(),
        target: z.enum(['title', 'value']).nullish().default('title'),
        kind: z.enum(kinds).nullish().default(ANNOTATION_KIND_COMMENT),
        fieldId: z
            .string()
            .trim()
            .min(1, {
                message: 'error_required',
            })
            .optional(),
        comment: z
            .string({
                required_error: 'error_required',
                invalid_type_error: 'error_required',
            })
            .trim()
            .min(1, {
                message: 'error_required',
            }),
        authorName: z
            .string({
                required_error: 'error_required',
                invalid_type_error: 'error_required',
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
        proposedValue: z
            .string()
            .trim()
            .min(1, {
                message: 'error_required',
            })
            .or(
                z
                    .array(
                        z.string().trim().min(1, {
                            message: 'error_required',
                        }),
                    )
                    .nonempty({
                        message: 'error_required',
                    }),
            )
            .nullish()
            .default(null)
            .transform((value) => {
                if (value == null) {
                    return null;
                }

                if (Array.isArray(value)) {
                    return value;
                }

                return [value];
            }),
        isContributorNamePublic: z.boolean().default(false),
        reCaptchaToken: z.string().nullish().default(undefined),
    })
    .superRefine((data, refineContext) => {
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
            [ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                data.kind,
            ) &&
            !data.proposedValue?.length
        ) {
            refineContext.addIssue({
                code: 'error_required',
                message: 'annotation_error_required_proposed_value',
                path: ['proposedValue'],
            });
        }
        if (data.kind === ANNOTATION_KIND_REMOVAL && data.proposedValue) {
            refineContext.addIssue({
                code: 'error_empty',
                message: 'annotation_error_empty_proposed_value',
                path: ['proposedValue'],
            });
        }
        if (data.target === 'title' && data.kind !== ANNOTATION_KIND_COMMENT) {
            refineContext.addIssue({
                code: 'error_invalid',
                message: 'annotation_error_title_invalid_kind',
                path: ['kind'],
            });
        }
        if (data.target === 'value' && data.kind === ANNOTATION_KIND_COMMENT) {
            refineContext.addIssue({
                code: 'error_invalid',
                message: 'annotation_error_value_invalid_kind',
                path: ['kind'],
            });
        }
    });

const unrefinedAnnotationUpdateSchema = z.object({
    status: z.enum(statuses),
    internalComment: z.string().trim().optional(),
    adminComment: z
        .string()
        .nullish()
        .default(null)
        .transform((value) => (value === '' ? null : value)),
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

export const annotationUpdateSchema =
    unrefinedAnnotationUpdateSchema.superRefine((data, refineContext) => {
        if (
            ['validated', 'rejected'].includes(data.status) &&
            !data.internalComment
        ) {
            refineContext.addIssue({
                code: 'error_required',
                message: 'error_required',
                path: ['internalComment'],
            });
        }
    });

const annotationUpdateNullishSchema = z.object(
    Object.entries(unrefinedAnnotationUpdateSchema.shape).reduce(
        (acc, [key, value]) => {
            acc[key] = value
                .nullish()
                .default(key === 'status' ? 'to_review' : null);
            return acc;
        },
        {},
    ),
);

export const annotationImportSchema = annotationCreationSchema
    .and(annotationUpdateNullishSchema)
    .and(
        z.object({
            createdAt: z.coerce
                .date()
                .nullish()
                .default(() => new Date()),
            updatedAt: z.coerce
                .date()
                .nullish()
                .default(() => new Date()),
        }),
    );

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

export const deleteManyAnnotationsSchema = z.array(z.string()).min(1);
