import {
    annotationCreationSchema,
    annotationImportSchema,
    annotationUpdateSchema,
    getAnnotationsQuerySchema,
    statuses,
} from './annotation.validator';

describe('annotation.validator', () => {
    describe('annotationCreationSchema', () => {
        it('should validate an annotation', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'value',
                fieldId: 'GvaF',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
                proposedValue: null,
                isContributorNamePublic: false,
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
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual({
                ...annotationPayload,
                kind: 'comment',
            });
        });

        it('should support annotation without authorEmail when it target title', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                target: 'title',
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
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
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
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
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                proposedValue: null,
                isContributorNamePublic: false,
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
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: 'initial value',
                isContributorNamePublic: false,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initial value',
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const validatedAnnotation =
                annotationCreationSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });

        it('should reject annotation without initialValue when target is value', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const { success, error, data } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(true);
            expect(error).toBeUndefined();
            expect(data).toStrictEqual(annotationPayload);
        });

        it('should accept annotation with proposedValue when kind is correction', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual({
                ...annotationPayload,
                proposedValue: [annotationPayload.proposedValue],
            });
        });

        it('should accept annotation with proposedValue when kind is addition', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'addition',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: null,
                proposedValue: 'proposedValue',
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual({
                ...annotationPayload,
                proposedValue: [annotationPayload.proposedValue],
            });
        });

        it('should reject annotation with proposedValue when kind is not "correction"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
                isContributorNamePublic: false,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_empty',
                    message: 'annotation_error_empty_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should accept annotation with no proposedValue when kind is not correction', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual(annotationPayload);
        });

        it('should reject annotation with no proposedValue when kind is "correction"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_required',
                    message: 'annotation_error_required_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should reject annotation with no proposedValue when kind is "addition"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'addition',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const { success, error } =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_required',
                    message: 'annotation_error_required_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should support string for proposedValue', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual({
                ...annotationPayload,
                proposedValue: [annotationPayload.proposedValue],
            });
        });

        it('should support array for proposedValue', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: ['proposedValue'],
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);

            expect(result).toStrictEqual(annotationPayload);
        });

        it('should not support empty array for proposedValue', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: [],
            };

            const result =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(result.success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(result.error.errors).toStrictEqual([
                {
                    code: 'too_small',
                    minimum: 1,
                    type: 'array',
                    inclusive: true,
                    exact: false,
                    message: 'error_required',
                    path: ['proposedValue'],
                },
                {
                    code: 'error_required',
                    message: 'annotation_error_required_proposed_value',
                    path: ['proposedValue'],
                },
            ]);
        });

        it('should not support empty string for proposedValue array', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: [''],
            };

            const result =
                annotationCreationSchema.safeParse(annotationPayload);

            expect(result.success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(result.error.errors).toStrictEqual([
                {
                    code: 'too_small',
                    minimum: 1,
                    inclusive: true,
                    exact: false,
                    message: 'error_required',
                    path: ['proposedValue', 0],
                    type: 'string',
                },
            ]);
        });

        it('should accept annotation with kind "comment" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'comment',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'title',
                initialValue: null,
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual(annotationPayload);
        });

        it('should reject annotation with kind "removal" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_title_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should reject annotation with kind "correction" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_title_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should reject annotation with kind "addition" when target is "title"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'addition',
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'error_invalid',
                    message: 'annotation_error_value_invalid_kind',
                    path: ['kind'],
                },
            ]);
        });

        it('should accept annotation with kind "correction" when target is "value"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'correction',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: 'proposedValue',
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual({
                ...annotationPayload,
                proposedValue: [annotationPayload.proposedValue],
            });
        });

        it('should accept annotation with kind "removal" when target is "value"', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: 'john.doe@marmelab.com',
                target: 'value',
                initialValue: 'initialValue',
                proposedValue: null,
                isContributorNamePublic: false,
            };

            const result = annotationCreationSchema.parse(annotationPayload);
            expect(result).toStrictEqual(annotationPayload);
        });

        it('should drop unsupported fields', () => {
            const annotationPayload = {
                resourceUri: 'uid:/2a8d429f-8134-4502-b9d3-d20c571592fa',
                kind: 'removal',
                target: 'value',
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
                comment: 'This is a comment',
                authorName: 'John Doe',
                authorEmail: null,
                initialValue: 'initial value',
                proposedValue: null,
                isContributorNamePublic: false,
            });
        });

        it('should return parsing errors', () => {
            const { success, error } = annotationCreationSchema.safeParse({
                resourceUri: '/',
                comment: '',
            });

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
                adminComment: 'I will do it next week',
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'invalid_enum_value',
                    message:
                        "Invalid enum value. Expected 'to_review' | 'ongoing' | 'validated' | 'rejected' | 'parking', received 'to-test'",
                    options: statuses,
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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toStrictEqual([
                {
                    code: 'invalid_type',
                    expected:
                        "'to_review' | 'ongoing' | 'validated' | 'rejected' | 'parking'",
                    message:
                        "Expected 'to_review' | 'ongoing' | 'validated' | 'rejected' | 'parking', received null",

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

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
        it.each(['validated', 'rejected'])(
            'should reject when internalComment is empty and status %s',
            (status: any) => {
                const annotationPayload = {
                    status,
                    internalComment: '',
                    administrator: 'The tester',
                };

                const { success, error } =
                    annotationUpdateSchema.safeParse(annotationPayload);
                expect(success).toBe(false);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(error.errors).toStrictEqual([
                    {
                        message: 'error_required',
                        code: 'error_required',
                        path: ['internalComment'],
                    },
                ]);
            },
        );

        it.each(['to_review', 'ongoing', 'parking'])(
            'should accept when internalComment is empty and status %s',
            (status: any) => {
                const annotationPayload = {
                    status,
                    internalComment: '',
                    administrator: 'The tester',
                };

                const { success, error } =
                    annotationUpdateSchema.safeParse(annotationPayload);
                expect(success).toBe(true);

                expect(error).toBeUndefined();
            },
        );
        it('should accept no administrator', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: 'Need to test this annotation thoroughly',
                administrator: null,
                adminComment: 'I will do it next week',
            };

            const validatedAnnotation =
                annotationUpdateSchema.parse(annotationPayload);

            expect(validatedAnnotation).toStrictEqual(annotationPayload);
        });
        it('should accept no adminComment', () => {
            const annotationPayload = {
                status: 'to_review',
                internalComment: 'Need to test this annotation thoroughly',
                administrator: null,
                adminComment: null,
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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

    describe('annotationCreateBatchSchema', () => {
        it('should validate an imported annotation', () => {
            expect(
                annotationImportSchema.safeParse({
                    resourceUri: '/graph/kzB6',
                    fieldId: 'kzB6',
                    kind: 'comment',
                    authorName: 'Jane DOE',
                    authorEmail: 'jane@marmelab.com',
                    comment: 'There is a typo',
                    status: 'ongoing',
                    internalComment: 'Test comment',
                    administrator: 'paul',
                    createdAt: '2025-01-10T21:49:14.000Z',
                    updatedAt: '2025-01-10T21:49:14.000Z',
                }),
            ).toMatchObject({
                success: true,
                data: {
                    resourceUri: '/graph/kzB6',
                    fieldId: 'kzB6',
                    kind: 'comment',
                    authorName: 'Jane DOE',
                    authorEmail: 'jane@marmelab.com',
                    comment: 'There is a typo',
                    status: 'ongoing',
                    internalComment: 'Test comment',
                    administrator: 'paul',
                    createdAt: new Date('2025-01-10T21:49:14.000Z'),
                    updatedAt: new Date('2025-01-10T21:49:14.000Z'),
                },
            });
        });

        it('should annotations in to_review mode', () => {
            expect(
                annotationImportSchema.safeParse({
                    resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                    fieldId: 'Gb4a',
                    kind: 'comment',
                    authorName: 'Rick HARRIS',
                    authorEmail: 'rick.harris@marmelab.com',
                    comment: 'Hello world',
                    status: 'to_review',
                    internalComment: null,
                    administrator: null,
                    createdAt: '2025-01-10T21:50:27.000Z',
                    updatedAt: '2025-01-10T21:23:09.000Z',
                }),
            ).toMatchObject({
                success: true,
                data: {
                    resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                    fieldId: 'Gb4a',
                    kind: 'comment',
                    authorName: 'Rick HARRIS',
                    authorEmail: 'rick.harris@marmelab.com',
                    comment: 'Hello world',
                    status: 'to_review',
                    internalComment: null,
                    administrator: null,
                    createdAt: new Date('2025-01-10T21:50:27.000Z'),
                    updatedAt: new Date('2025-01-10T21:23:09.000Z'),
                },
            });
        });

        it('should support partial annotations', () => {
            expect(
                annotationImportSchema.safeParse({
                    resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                    fieldId: 'Gb4a',
                    kind: 'comment',
                    authorName: 'Rick HARRIS',
                    authorEmail: 'rick.harris@marmelab.com',
                    comment: 'Hello world',
                }),
            ).toMatchObject({
                success: true,
                data: {
                    resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                    fieldId: 'Gb4a',
                    kind: 'comment',
                    authorName: 'Rick HARRIS',
                    authorEmail: 'rick.harris@marmelab.com',
                    comment: 'Hello world',
                    status: 'to_review',
                    internalComment: null,
                    administrator: null,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                },
            });
        });

        it('should fail if annotation is not valid', () => {
            const { success, error } = annotationImportSchema.safeParse({
                resourceUri: 'uid:/a4f7a51f-7109-481e-86cc-0adb3a26faa6',
                fieldId: 'Gb4a',
                kind: 'comment',
                authorEmail: 'rick.harris@marmelab.com',
                comment: 'Hello world',
            });

            expect(success).toBe(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(error.errors).toMatchObject([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: 'undefined',
                    path: ['authorName'],
                    message: 'error_required',
                },
            ]);
        });
    });
});
