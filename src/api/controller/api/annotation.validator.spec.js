const {
    annotationSchema,
    getAnnotationsQuerySchema,
} = require('./annotation.validator');

describe('annotation.validator', () => {
    describe('annotationSchema', () => {
        it('should validate an annotation', () => {
            const annotationPayload = {
                resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF'],
                comment: 'This is a comment',
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });

        it('should should support annotation without itemPath', () => {
            const annotationPayload = {
                resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                comment: 'This is a comment',
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                itemPath: null,
            });
        });

        it('should should support drop unsupported fields', () => {
            const annotationPayload = {
                resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: null,
                comment: 'This is a comment',
                status: 'in_progress',
                internal_comment: 'This is an internal comment',
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: null,
                comment: 'This is a comment',
            });
        });

        it('should return parsing errors', () => {
            const { success, error } = annotationSchema.safeParse({
                comment: '',
            });

            expect(success).toBe(false);
            expect(error.errors).toMatchObject([
                {
                    path: ['comment'],
                    message: 'annotation_comment_min_length',
                },
            ]);
        });
    });

    describe('getAnnotationsQuerySchema', () => {
        it('should parse query', () => {
            expect(
                getAnnotationsQuerySchema.parse({
                    page: 1,
                    perPage: 50,
                    match: {
                        resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                    },
                    sortBy: 'updatedAt',
                    sortDir: 'ASC',
                }),
            ).toStrictEqual({
                page: 1,
                perPage: 50,
                match: {
                    resourceId: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                },
                sortBy: 'updatedAt',
                sortDir: 'ASC',
            });
        });

        it('should apply defaults', () => {
            expect(getAnnotationsQuerySchema.parse({})).toStrictEqual({
                page: 0,
                perPage: 10,
                match: {},
                sortBy: 'createdAt',
                sortDir: 'DESC',
            });
        });

        it('should return parsing errors', () => {
            const { success, error } = getAnnotationsQuerySchema.safeParse({
                page: 'INVALID',
                perPage: 1000,
                match: {
                    toto: { $text: 'tata' },
                },
                sortBy: 'INVALID',
                sortDir: 'INVALID',
            });

            expect(success).toBe(false);
            expect(error.errors).toMatchObject([
                {
                    path: ['page'],
                    message: 'error_invalid_number',
                },
                {
                    path: ['perPage'],
                    message: 'annotation_query_perPage_length',
                },
                {
                    path: ['match', 'toto'],
                    message: 'annotation_query_match_invalid_key',
                },
                {
                    path: ['match', 'toto'],
                    message: 'annotation_query_match_invalid_value',
                },
                {
                    path: ['sortBy'],
                    message: 'annotation_query_sortBy_invalid',
                },
                {
                    path: ['sortDir'],
                    message: 'error_sortDir_invalid',
                },
            ]);
        });
    });
});
