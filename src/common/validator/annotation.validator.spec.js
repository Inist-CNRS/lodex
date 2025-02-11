import {
    annotationCreationSchema,
    annotationUpdateSchema,
    getAnnotationsQuerySchema,
} from './annotation.validator';

describe('annotation.validator', () => {
    describe('annotationCreationSchema', () => {
        it('should validate an annotation', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                fieldId: 'GvaF',
                itemPath: [],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });

        it('should support annotation without kind', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'title',
                fieldId: 'GvaF',
                itemPath: ['0'],
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: null,
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                kind: 'comment',
            });
        });

        it('should support annotation without itemPath', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                itemPath: null,
            });
        });

        it('should support annotation without authorEmail when it target title', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'title',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                initialValue: null,
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                authorEmail: null,
            });
        });

        it('should support annotation without target', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                initialValue: null,
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                target: 'title',
            });
        });

        it('should accept annotation without initialValue when target is title', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                proposedValue: null,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                initialValue: null,
            });
        });

        it('should reject annotation with initialValue when target is title', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: 'initial value',
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_empty',
                    message: 'annotation_error_empty_initial_value',
                    path: ['initialValue'],
                },
            ]);
        });

        it('should accept annotation with initialValue when target is value', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initial value',
                proposedValue: '',
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });

        it('should reject annotation without initialValue when target is value', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: null,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_required',
                    message: 'annotation_error_required_initial_value',
                    path: ['initialValue'],
                },
            ]);
        });

        it('should accept annotation with proposedValue when kind is correct', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'correct',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual(annotationPayload);
        });

        it('should reject annotation with proposedValue when kind is not "correct"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_empty',
                    message: 'annotation_error_empty_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should accept annotation with no proposedValue when kind is not correct', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual(annotationPayload);
        });

        it('should reject annotation with no proposedValue when kind is "correct"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'correct',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_required',
                    message: 'annotation_error_required_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should accept annotation with kind "comment" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: null,
                proposedValue: null,
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual(annotationPayload);
        });

        it('should reject annotation with kind "removal" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: null,
                proposedValue: null,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);
            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_title_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should reject annotation with kind "correct" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'correct',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: null,
                proposedValue: 'proposedValue',
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);
            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_title_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should reject annotation with kind "comment" when target is "value"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);
            expect(success).toBe(false);
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_value_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should accept annotation with kind "correct" when target is "value"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'correct',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual(annotationPayload);
        });

        it('should accept annotation with kind "removal" when target is "value"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                itemPath: ['GvaF', '0'],
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual(annotationPayload);
        });

        it('should drop unsupported fields', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                target: 'value',
                itemPath: null,
                comment: 'This is a comment',
                status: 'in_progress',
                internalComment: 'This is an internal comment',
                authorName: 'John Doe',
                authorEmail: '',
                initialValue: 'initial value',
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                target: 'value',
                itemPath: null,
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
                proposedValue: null,
            });
        });

        it('should return parsing errors', () => {
            const { success, error } = annotationCreationSchema.safeParse({
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

    describe('annotationUpdateSchema', () => {
        it('should validate annotation update data', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: 'Need to test this annotation thoroughly',
                administrator: 'The tester',
            };

            const validatedAnnotation =
                annotationUpdateSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });
        it('should reject status not in the enum', () => {
            const annotationPayload = {
                status: 'to-test',
                internalComment: 'Need to test this annotation thoroughly',
                administrator: 'The tester',
            };

            const { success, error } =
                annotationUpdateSchema.safeParse(annotationPayload);
            expect(success).toBe(false);

            expect(error.errors).toStrictEqual([
                {
                    code: 'invalid_enum_value',
                    message:
                        "Invalid enum value. Expected 'to_review' | 'ongoing' | 'validated' | 'rejected', received 'to-test'",
                    options: ['to_review', 'ongoing', 'validated', 'rejected'],
                    path: ['status'],
                    received: 'to-test',
                },
            ]);
        });
        it('should reject no status', () => {
            const annotationPayload = {
                status: null,
                internalComment: 'Need to test this annotation thoroughly',
                administrator: 'The tester',
            };

            const { success, error } =
                annotationUpdateSchema.safeParse(annotationPayload);
            expect(success).toBe(false);

            expect(error.errors).toStrictEqual([
                {
                    code: 'invalid_type',
                    expected:
                        "'to_review' | 'ongoing' | 'validated' | 'rejected'",
                    message:
                        "Expected 'to_review' | 'ongoing' | 'validated' | 'rejected', received null",

                    path: ['status'],
                    received: 'null',
                },
            ]);
        });
        it('should reject when internalComment is null', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: null,
                administrator: 'The tester',
            };

            const { success, error } =
                annotationUpdateSchema.safeParse(annotationPayload);
            expect(success).toBe(false);

            expect(error.errors).toStrictEqual([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    message: 'Expected string, received null',
                    path: ['internalComment'],
                    received: 'null',
                },
            ]);
        });
        it('should reject when internalComment is empty', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: '',
                administrator: 'The tester',
            };

            const { success, error } =
                annotationUpdateSchema.safeParse(annotationPayload);
            expect(success).toBe(false);

            expect(error.errors).toStrictEqual([
                {
                    code: 'too_small',
                    exact: false,
                    inclusive: true,
                    message: 'error_required',
                    minimum: 1,
                    path: ['internalComment'],
                    type: 'string',
                },
            ]);
        });
        it('should accept no administrator', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: 'Need to test this annotation thoroughly',
                administrator: null,
            };

            const validatedAnnotation =
                annotationUpdateSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
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
                        'kind',
                        'authorName',
                        'resourceUri',
                        'fieldId',
                        'comment',
                        'initialValue',
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
                        'status',
                        'internalComment',
                        'administrator',
                        'kind',
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
