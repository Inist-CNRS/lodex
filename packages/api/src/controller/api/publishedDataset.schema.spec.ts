import { filterSchema, searchSchema } from './publishedDataset.schema';

describe('filterSchema', () => {
    it.each([
        {
            input: { fieldName: 'test', value: 'value' },
            expected: { fieldName: 'test', value: 'value' },
            label: 'string value',
        },
        {
            input: { fieldName: 'abcd', value: ['a', 'b'] },
            expected: { fieldName: 'abcd', value: ['a', 'b'] },
            label: 'array value',
        },
        {
            input: { fieldName: 'num1', value: 42 },
            expected: { fieldName: 'num1', value: 42 },
            label: 'number value',
        },
        {
            input: { fieldName: 'null', value: null },
            expected: { fieldName: 'null', value: null },
            label: 'null value',
        },
        {
            input: { fieldName: 'undf', value: undefined },
            expected: { fieldName: 'undf', value: undefined },
            label: 'undefined value',
        },
    ])('should accept filter: $label', ({ input, expected }) => {
        const result = filterSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(expected);
        }
    });

    it.each([
        {
            input: { fieldName: 'ab', value: 'test' },
            label: 'field too short',
        },
        {
            input: { fieldName: 'abcde', value: 'test' },
            label: 'field too long',
        },
        {
            input: { fieldName: 'ab-d', value: 'test' },
            label: 'field with invalid character',
        },
    ])('should reject invalid filter: $label', ({ input }) => {
        const result = filterSchema.safeParse(input);
        expect(result.success).toBe(false);
    });
});

describe('searchSchema', () => {
    it.each([
        { input: { page: 5 }, expected: 5, label: 'page number' },
        { input: { page: null }, expected: 0, label: 'null (defaults to 0)' },
        {
            input: { page: undefined },
            expected: 0,
            label: 'undefined (defaults to 0)',
        },
        { input: {}, expected: 0, label: 'missing (defaults to 0)' },
    ])('should handle page field: $label', ({ input, expected }) => {
        const result = searchSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.page).toBe(expected);
        }
    });

    it.each([
        { input: { perPage: 20 }, expected: 20, label: 'perPage number' },
        {
            input: { perPage: null },
            expected: 10,
            label: 'null (defaults to 10)',
        },
        {
            input: { perPage: undefined },
            expected: 10,
            label: 'undefined (defaults to 10)',
        },
        { input: {}, expected: 10, label: 'missing (defaults to 10)' },
    ])('should handle perPage field: $label', ({ input, expected }) => {
        const result = searchSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.perPage).toBe(expected);
        }
    });

    it.each([
        {
            input: { sort: { sortBy: 'name', sortDir: 'ASC' } },
            expected: { sortBy: 'name', sortDir: 'ASC' },
            label: 'sortDir ASC',
        },
        {
            input: { sort: { sortBy: 'title', sortDir: 'DESC' } },
            expected: { sortBy: 'title', sortDir: 'DESC' },
            label: 'sortDir DESC',
        },
        {
            input: { sort: { sortBy: 'name', sortDir: null } },
            expected: { sortBy: 'name', sortDir: 'ASC' },
            label: 'sortDir null (defaults to ASC)',
        },
        {
            input: { sort: { sortBy: 'name', sortDir: undefined } },
            expected: { sortBy: 'name', sortDir: 'ASC' },
            label: 'sortDir undefined (defaults to ASC)',
        },
        {
            input: { sort: { sortBy: 'name' } },
            expected: { sortBy: 'name', sortDir: 'ASC' },
            label: 'sortDir missing (defaults to ASC)',
        },
        {
            input: { sort: null },
            expected: undefined,
            label: 'sort null (defaults to undefined)',
        },
        {
            input: { sort: undefined },
            expected: undefined,
            label: 'sort undefined (defaults to undefined)',
        },
        {
            input: {},
            expected: undefined,
            label: 'sort missing (defaults to undefined)',
        },
        {
            input: { sort: { sortBy: '_id', sortDir: 'DESC' } },
            expected: { sortBy: '_id', sortDir: 'DESC' },
            label: '_id as sortBy',
        },
    ])('should handle sort field: $label', ({ input, expected }) => {
        const result = searchSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.sort).toEqual(expected);
        }
    });

    it('should reject invalid sortDir value', () => {
        const result = searchSchema.safeParse({
            sort: {
                sortBy: 'name',
                sortDir: 'INVALID',
            },
        });
        expect(result.success).toBe(false);
    });

    it('should handle filters field', () => {
        const result = searchSchema.safeParse({
            filters: [
                { fieldName: 'test', value: 'value1' },
                { fieldName: 'abcd', value: ['a', 'b'] },
            ],
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.filters).toEqual([
                { fieldName: 'test', value: 'value1' },
                { fieldName: 'abcd', value: ['a', 'b'] },
            ]);
        }
    });

    it('should accept complete valid object', () => {
        const result = searchSchema.safeParse({
            filters: [{ fieldName: 'abcd', value: 'filter' }],
            page: 2,
            perPage: 25,
            sort: {
                sortBy: 'name',
                sortDir: 'DESC',
            },
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({
                filters: [{ fieldName: 'abcd', value: 'filter' }],
                page: 2,
                perPage: 25,
                sort: {
                    sortBy: 'name',
                    sortDir: 'DESC',
                },
            });
        }
    });

    it('should apply all defaults when empty object', () => {
        const result = searchSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({
                page: 0,
                perPage: 10,
            });
        }
    });

    it('should reject object with invalid field types', () => {
        const result = searchSchema.safeParse({
            page: 'not a number',
            perPage: 'also not a number',
        });
        expect(result.success).toBe(false);
    });
});
