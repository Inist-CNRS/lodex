import {
    fieldNameSchema,
    getPageByFieldSchema,
} from './publishedDataset.schema';

describe('fieldNameSchema', () => {
    it.each([
        { fieldName: 'abcd', expected: true },
        { fieldName: 'test', expected: true },
        { fieldName: 'AB12', expected: true },
        { fieldName: '1234', expected: true },
        { fieldName: 'h1bM', expected: true },
    ])(
        'should accept valid field name: $fieldName',
        ({ fieldName, expected }) => {
            const result = fieldNameSchema.safeParse(fieldName);
            expect(result.success).toBe(expected);
            if (result.success) {
                expect(result.data).toBe(fieldName);
            }
        },
    );

    it.each([
        { fieldName: 'abc', reason: 'too short (3 chars)' },
        { fieldName: 'abcde', reason: 'too long (5 chars)' },
        { fieldName: 'ab-d', reason: 'contains dash' },
        { fieldName: 'ab$d', reason: 'contains special char' },
        { fieldName: 'ab d', reason: 'contains space' },
        { fieldName: '', reason: 'empty string' },
        { fieldName: 'aBéC', reason: 'contains accented char' },
        { fieldName: 'a_b_', reason: 'contains underscore' },
    ])(
        'should reject invalid field name: $fieldName ($reason)',
        ({ fieldName }) => {
            const result = fieldNameSchema.safeParse(fieldName);
            expect(result.success).toBe(false);
        },
    );
});

describe('getPageByFieldSchema', () => {
    it.each([
        { input: { value: 'test' }, expected: 'test', label: 'string value' },
        { input: { value: 42 }, expected: 42, label: 'number value' },
        { input: { value: null }, expected: null, label: 'null value' },
        {
            input: { value: undefined },
            expected: undefined,
            label: 'undefined value',
        },
        { input: {}, expected: undefined, label: 'missing value field' },
    ])('should accept value field: $label', ({ input, expected }) => {
        const result = getPageByFieldSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.value).toBe(expected);
        }
    });

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
        const result = getPageByFieldSchema.safeParse(input);
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
        const result = getPageByFieldSchema.safeParse(input);
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
        const result = getPageByFieldSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.sort).toEqual(expected);
        }
    });

    it('should reject invalid sortDir value', () => {
        const result = getPageByFieldSchema.safeParse({
            sort: {
                sortBy: 'name',
                sortDir: 'INVALID',
            },
        });
        expect(result.success).toBe(false);
    });

    it('should accept complete valid object', () => {
        const result = getPageByFieldSchema.safeParse({
            value: 'test',
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
                value: 'test',
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
        const result = getPageByFieldSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({
                value: undefined,
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
        const result = getPageByFieldSchema.safeParse({
            page: 'not a number',
            perPage: 'also not a number',
        });
        expect(result.success).toBe(false);
    });
});
