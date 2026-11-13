import { default as z } from 'zod';

export const ANNOTATION_KIND_REMOVAL = 'removal' as const;
export const ANNOTATION_KIND_COMMENT = 'comment' as const;
export const ANNOTATION_KIND_CORRECTION = 'correction' as const;
export const ANNOTATION_KIND_ADDITION = 'addition' as const;

export const kinds: [string, ...string[]] = [
    ANNOTATION_KIND_REMOVAL,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_ADDITION,
];

export const statuses: [string, ...string[]] = [
    'to_review' as const,
    'ongoing' as const,
    'validated' as const,
    'rejected' as const,
    'parking' as const,
];

export type AnnotationKind =
    | typeof ANNOTATION_KIND_REMOVAL
    | typeof ANNOTATION_KIND_COMMENT
    | typeof ANNOTATION_KIND_CORRECTION
    | typeof ANNOTATION_KIND_ADDITION;
export type AnnotationStatus =
    | 'to_review'
    | 'ongoing'
    | 'validated'
    | 'rejected'
    | 'parking';

// zod only allows known issue codes: our own code goes in params.code, see toApiErrors
const addCodedIssue = (
    refineContext: z.RefinementCtx,
    code: string,
    message: string,
    path: PropertyKey[],
) =>
    refineContext.addIssue({ code: 'custom', params: { code }, message, path });

// Stable API error format, independent of the zod issue internals
export const toApiErrors = (issues: z.core.$ZodIssue[]) =>
    issues.map((issue) => ({
        code:
            issue.code === 'custom' && issue.params?.code
                ? issue.params.code
                : issue.code,
        path: issue.path,
        message: issue.message,
    }));

export const annotationCreationSchema = z
    .object({
        resourceUri: z.string(),
        target: z.enum(['title', 'value']).nullish().default('title'),
        kind: z.enum(kinds).nullish().default(ANNOTATION_KIND_COMMENT),
        fieldId: z
            .string()
            .trim()
            .min(1, { error: 'error_required' })
            .optional(),
        comment: z
            .string({ error: 'error_required' })
            .nullish()
            .transform((value) => value?.trim() ?? ''),
        authorName: z
            .string({ error: 'error_required' })
            .trim()
            .min(1, { error: 'error_required' }),
        authorEmail: z
            .union([z.literal(''), z.email({ error: 'error_invalid_email' })])
            .nullish()
            .default(null)
            .transform((value: any) => (value === '' ? null : value)),
        initialValue: z.string().nullish().default(null),
        proposedValue: z
            .string()
            .trim()
            .min(1, { error: 'error_required' })
            .or(
                z
                    .array(
                        z.string().trim().min(1, { error: 'error_required' }),
                    )
                    .nonempty({ error: 'error_required' }),
            )
            .nullish()
            .default(null)
            .transform((value: any) => {
                if (value == null) {
                    return null;
                }

                if (Array.isArray(value)) {
                    return value;
                }

                return [value];
            }),
        isContributorNamePublic: z.boolean().default(false),
        reCaptchaToken: z.string().nullish().optional(),
    })
    .superRefine((data: any, refineContext) => {
        if (
            (data.target === 'title' && data.initialValue) ||
            (data.kind === 'addition' && data.initialValue)
        ) {
            addCodedIssue(
                refineContext,
                'error_empty',
                'annotation_error_empty_initial_value',
                ['initialValue'],
            );
        }
        if (
            [ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                data.kind,
            ) &&
            !data.proposedValue?.length
        ) {
            addCodedIssue(
                refineContext,
                'error_required',
                'annotation_error_required_proposed_value',
                ['proposedValue'],
            );
        }
        if (data.kind === ANNOTATION_KIND_REMOVAL && data.proposedValue) {
            addCodedIssue(
                refineContext,
                'error_empty',
                'annotation_error_empty_proposed_value',
                ['proposedValue'],
            );
        }
        if (data.target === 'title' && data.kind !== ANNOTATION_KIND_COMMENT) {
            addCodedIssue(
                refineContext,
                'error_invalid',
                'annotation_error_title_invalid_kind',
                ['kind'],
            );
        }
        if (data.target === 'value' && data.kind === ANNOTATION_KIND_COMMENT) {
            addCodedIssue(
                refineContext,
                'error_invalid',
                'annotation_error_value_invalid_kind',
                ['kind'],
            );
        }
    });

const unrefinedAnnotationUpdateSchema = z.object({
    status: z.enum(statuses, {
        error: (issue) =>
            issue.input == null
                ? 'error_required'
                : 'annotation_error_invalid_status',
    }),
    internalComment: z.string().trim().optional(),
    adminComment: z
        .string()
        .nullish()
        .default(null)
        .transform((value: any) => (value === '' ? null : value)),
    administrator: z
        .union([
            z.literal(''),
            z
                .string({ error: 'error_required' })
                .trim()
                .min(1, { error: 'error_required' }),
        ])
        .nullish()
        .default(null)
        .transform((value: any) => (value === '' ? null : value)),
});

export const annotationUpdateSchema =
    unrefinedAnnotationUpdateSchema.superRefine((data: any, refineContext) => {
        if (
            ['validated', 'rejected'].includes(data.status) &&
            !data.internalComment
        ) {
            addCodedIssue(refineContext, 'error_required', 'error_required', [
                'internalComment',
            ]);
        }
    });

const annotationUpdateNullishSchema = z.object(
    Object.entries(unrefinedAnnotationUpdateSchema.shape).reduce(
        (acc, [key, value]) => {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
        { error: 'annotation_query_filter_by_invalid_key' },
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
        { error: 'annotation_query_sortBy_invalid' },
    )
    .default('createdAt');

export const getAnnotationsQuerySchema = z.object({
    page: z.coerce
        .number({ error: 'error_invalid_number' })
        .min(0, { error: 'error_page_invalid' })
        .optional()
        .default(0),
    perPage: z.coerce
        .number({ error: 'error_invalid_number' })
        .min(1, { error: 'annotation_query_perPage_length' })
        .max(100, { error: 'annotation_query_perPage_length' })
        .optional()
        .default(10),
    filterBy: annotationFilterableFields,
    filterOperator: z
        .enum(['contains', 'is', 'after', 'before', 'equals'], {
            error: 'annotation_query_filter_operator_invalid_key',
        })
        .optional(),
    filterValue: z.string().optional(),
    sortBy: annotationSortableFields,
    sortDir: z
        .enum(['asc', 'desc'], { error: 'error_sortDir_invalid' })
        .default('desc'),
});

export const deleteManyAnnotationsSchema = z.array(z.string()).min(1);
