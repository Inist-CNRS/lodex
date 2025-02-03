import {
    annotationSchema,
    getAnnotationsQuerySchema,
} from './annotation.validator';

describe('annotation.validator', () => {
    describe('annotationSchema', () => {
        it('should validate an annotation', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                fieldId: 'GvaF',
                itemPath: [],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: null,
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });

        it('should should support annotation without kind', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'title',
                fieldId: 'GvaF',
                itemPath: ['0'],
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: null,
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                kind: 'comment',
            });
        });

        it('should should support annotation without itemPath', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: null,
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                itemPath: null,
            });
        });

        it('should should support annotation without authorEmail', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                initialValue: null,
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                authorEmail: null,
            });
        });

        it('should should support annotation without target', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                initialValue: null,
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                target: 'title',
            });
        });

        it('should should support annotation without initialValue', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                initialValue: null,
            });
        });

        it('should should support drop unsupported fields', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                target: 'value',
                itemPath: null,
                comment: 'This is a comment',
                status: 'in_progress',
                internal_comment: 'This is an internal comment',
                authorName: 'John Doe',
                authorEmail: '',
                initialValue: 'initial value',
            };

            const validatedAnnotation =
                annotationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                target: 'value',
                itemPath: null,
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
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
                    message: 'error_required',
                },
                {
                    path: ['authorName'],
                    message: 'error_required',
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
                    filterBy: 'resourceUri',
                    filterOperator: 'contains',
                    filterValue: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                    sortBy: 'updatedAt',
                    sortDir: 'asc',
                }),
            ).toStrictEqual({
                page: 1,
                perPage: 50,
                filterBy: 'resourceUri',
                filterOperator: 'contains',
                filterValue: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                sortBy: 'updatedAt',
                sortDir: 'asc',
            });
        });

        it('should apply defaults', () => {
            expect(getAnnotationsQuerySchema.parse({})).toStrictEqual({
                page: 0,
                perPage: 10,
                sortBy: 'createdAt',
                sortDir: 'desc',
            });
        });

        it('should return parsing errors', () => {
            const { success, error } = getAnnotationsQuerySchema.safeParse({
                page: 'INVALID',
                perPage: 1000,
                filterBy: 'toto',
                filterOperator: 'contains',
                filterValue: 'tata',
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
                    path: ['filterBy'],
                    code: 'invalid_enum_value',
                    message: 'annotation_query_filter_by_invalid_key',
                    options: [
                        'resource.title',
                        'authorName',
                        'resourceUri',
                        'fieldId',
                        'comment',
                        'createdAt',
                        'field.label',
                        'field.name',
                        'field.internalName',
                        'field.internalScopes',
                    ],
                },
                {
                    code: 'invalid_enum_value',
                    path: ['sortBy'],
                    message: 'annotation_query_sortBy_invalid',
                    options: [
                        'resourceUri',
                        'fieldId',
                        'createdAt',
                        'updatedAt',
                        'comment',
                    ],
                    received: 'INVALID',
                },
                {
                    path: ['sortDir'],
                    code: 'invalid_enum_value',
                    message: 'error_sortDir_invalid',
                    options: ['asc', 'desc'],
                    received: 'INVALID',
                },
            ]);
        });
    });
});
