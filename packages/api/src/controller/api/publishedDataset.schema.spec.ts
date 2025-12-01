import { filterSchema, searchSchema } from './publishedDataset.schema';

describe('filterSchema', () => {
    it.each([
        {
            input: { field: 'test', value: 'value' },
            expected: { field: 'test', value: 'value' },
            label: 'string value',
        },
        {
            input: { field: 'abcd', value: ['a', 'b'] },
            expected: { field: 'abcd', value: ['a', 'b'] },
            label: 'array value',
        },
        {
            input: { field: 'num1', value: 42 },
            expected: { field: 'num1', value: 42 },
            label: 'number value',
        },
        {
            input: { field: 'null', value: null },
            expected: { field: 'null', value: null },
            label: 'null value',
        },
        {
            input: { field: 'undf', value: undefined },
            expected: { field: 'undf', value: undefined },
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
            input: { field: 'ab', value: 'test' },
            label: 'field too short',
        },
        {
            input: { field: 'abcde', value: 'test' },
            label: 'field too long',
        },
        {
            input: { field: 'ab-d', value: 'test' },
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
            expected: { sortBy: '_id', sortDir: 'ASC' },
            label: 'sort null (defaults to _id/ASC)',
        },
        {
            input: { sort: undefined },
            expected: { sortBy: '_id', sortDir: 'ASC' },
            label: 'sort undefined (defaults to _id/ASC)',
        },
        {
            input: {},
            expected: { sortBy: '_id', sortDir: 'ASC' },
            label: 'sort missing (defaults to _id/ASC)',
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
                { field: 'test', value: 'value1' },
                { field: 'abcd', value: ['a', 'b'] },
            ],
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.filters).toEqual([
                { field: 'test', value: 'value1' },
                { field: 'abcd', value: ['a', 'b'] },
            ]);
        }
    });

    it('should accept complete valid object', () => {
        const result = searchSchema.safeParse({
            filters: [{ field: 'abcd', value: 'filter' }],
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
                filters: [{ field: 'abcd', value: 'filter' }],
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
                sort: {
                    sortBy: '_id',
                    sortDir: 'ASC',
                },
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
