import { GET_TRANSFORMERS_FROM_SUBRESOURCE } from './SourceValueFromSubResource';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from './SourceValueToggle';

describe('SourceValueToggle', () => {
    describe('GET_SOURCE_VALUE_FROM_TRANSFORMERS', () => {
        it('returns correct values for operation VALUE', () => {
            const transformers = [
                { operation: 'VALUE', args: [{ value: 'test' }] },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'arbitrary',
                value: 'test',
            });
        });

        it('returns correct values for operation COLUMN', () => {
            const transformers = [
                { operation: 'COLUMN', args: [{ value: 'columnName' }] },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'fromColumns',
                value: ['columnName'],
            });
        });

        it('returns correct values for operation CONCAT', () => {
            const transformers = [
                {
                    operation: 'CONCAT',
                    args: [{ value: 'a' }, { value: 'b' }, { value: 'c' }],
                },
            ];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: 'fromColumns',
                value: ['a', 'b', 'c'],
            });
        });

        it('returns null values for invalid operation', () => {
            const transformers = [{ operation: 'INVALID', args: [] }];
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(transformers)).toEqual({
                source: null,
                value: null,
            });
        });

        it('returns null values for missing transformers', () => {
            expect(GET_SOURCE_VALUE_FROM_TRANSFORMERS(null)).toEqual({
                source: null,
                value: null,
            });
        });
    });
});

describe('SourceValueFromSubResource', () => {
    describe('GET_TRANSFORMERS_FROM_SUBRESOURCE', () => {
        const subresources = [
            { path: 'path1', identifier: 'id1', _id: 'sub1' },
            { path: 'path2', identifier: 'id2', _id: 'sub2' },
        ];

        test('returns empty array if subresources or subresourcePath is not provided', () => {
            expect(GET_TRANSFORMERS_FROM_SUBRESOURCE()).toEqual([]);
            expect(GET_TRANSFORMERS_FROM_SUBRESOURCE(subresources)).toEqual([]);
        });

        test('returns empty array if subresource not found', () => {
            expect(
                GET_TRANSFORMERS_FROM_SUBRESOURCE(subresources, 'path3'),
            ).toEqual([]);
        });

        test('returns proper transformers without column', () => {
            const expectedTransformers = [
                {
                    operation: 'COLUMN',
                    args: [{ name: 'column', type: 'column', value: 'path1' }],
                },
                { operation: 'PARSE' },
                {
                    operation: 'GET',
                    args: [{ name: 'path', type: 'string', value: 'id1' }],
                },
                { operation: 'STRING' },
                {
                    operation: 'REPLACE_REGEX',
                    args: [
                        {
                            name: 'searchValue',
                            type: 'string',
                            value: '^(.*)$',
                        },
                        {
                            name: 'replaceValue',
                            type: 'string',
                            value: 'sub1/$1',
                        },
                    ],
                },
                { operation: 'MD5', args: [] },
                {
                    operation: 'REPLACE_REGEX',
                    args: [
                        {
                            name: 'searchValue',
                            type: 'string',
                            value: '^(.*)$',
                        },
                        {
                            name: 'replaceValue',
                            type: 'string',
                            value: 'uid:/$1',
                        },
                    ],
                },
            ];
            expect(
                GET_TRANSFORMERS_FROM_SUBRESOURCE(subresources, 'path1'),
            ).toEqual(expectedTransformers);
        });

        test('returns proper transformers with column', () => {
            const expectedTransformers = [
                {
                    operation: 'COLUMN',
                    args: [{ name: 'column', type: 'column', value: 'path1' }],
                },
                { operation: 'PARSE' },
                {
                    operation: 'GET',
                    args: [
                        {
                            name: 'path',
                            type: 'string',
                            value: 'columnSelected',
                        },
                    ],
                },
                { operation: 'STRING' },
                {
                    operation: 'REPLACE_REGEX',
                    args: [
                        {
                            name: 'searchValue',
                            type: 'string',
                            value: '^(.*)$',
                        },
                        {
                            name: 'replaceValue',
                            type: 'string',
                            value: `(sub1)$1`,
                        },
                    ],
                },
                {
                    operation: 'REPLACE_REGEX',
                    args: [
                        {
                            name: 'searchValue',
                            type: 'string',
                            value: `/^\\((.*)\\)/`,
                        },
                        { name: 'replaceValue', type: 'string', value: ' ' },
                    ],
                },
                { operation: 'TRIM' },
            ];
            expect(
                GET_TRANSFORMERS_FROM_SUBRESOURCE(
                    subresources,
                    'path1',
                    'columnSelected',
                ),
            ).toEqual(expectedTransformers);
        });
    });
});
