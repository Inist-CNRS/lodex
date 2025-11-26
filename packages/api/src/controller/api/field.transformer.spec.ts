import {
    transformColorScale,
    transformField,
    transformValues,
    type Field,
} from './field.transformer';

describe('transformValues', () => {
    it.each([
        { label: 'undefined', input: undefined },
        { label: 'empty string', input: '' },
        { label: 'empty array', input: [] },
    ])('should return empty array when values is $label', ({ input }) => {
        const result = transformValues(input);
        expect(result).toEqual([]);
    });

    it.each([
        {
            label: 'string by newlines',
            input: 'A\nB\nC',
            expected: ['A', 'B', 'C'],
        },
        {
            label: 'string with whitespace',
            input: '  A  \n  B  \n  C  ',
            expected: ['A', 'B', 'C'],
        },
        {
            label: 'string with empty lines',
            input: 'A\n  \nB\n\nC',
            expected: ['A', 'B', 'C'],
        },
        {
            label: 'array with whitespace and empty strings',
            input: ['A', '  B  ', '', '  ', 'C'],
            expected: ['A', 'B', 'C'],
        },
        {
            label: 'already formatted array',
            input: ['A', 'B', 'C'],
            expected: ['A', 'B', 'C'],
        },
    ])('should handle $label correctly', ({ input, expected }) => {
        const result = transformValues(input);
        expect(result).toEqual(expected);
    });
});

describe('transformColorScale', () => {
    it.each([
        {
            label: 'default color when color is undefined',
            input: { caption: 'Test', values: ['A', 'B'] },
            expected: { color: '#000000', caption: 'Test', values: ['A', 'B'] },
        },
        {
            label: 'null caption when caption is undefined',
            input: { color: '#FF0000', values: ['A', 'B'] },
            expected: { color: '#FF0000', caption: null, values: ['A', 'B'] },
        },
    ])('should use $label', ({ input, expected }) => {
        const result = transformColorScale(input);
        expect(result).toEqual(expected);
    });

    it.each([
        {
            label: 'string values to array',
            input: {
                color: '#FF0000',
                caption: 'Red',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                values: 'A\nB\nC' as any,
            },
            expected: {
                color: '#FF0000',
                caption: 'Red',
                values: ['A', 'B', 'C'],
            },
        },
        {
            label: 'values with whitespace and empty lines',
            input: {
                color: '#FF0000',
                caption: 'Red',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                values: '  A  \n  \nB\n\nC  ' as any,
            },
            expected: {
                color: '#FF0000',
                caption: 'Red',
                values: ['A', 'B', 'C'],
            },
        },
        {
            label: 'undefined values',
            input: { color: '#FF0000', caption: 'Red' },
            expected: { color: '#FF0000', caption: 'Red', values: [] },
        },
        {
            label: 'undefined colorScale item',
            input: undefined,
            expected: { color: '#000000', caption: null, values: [] },
        },
        {
            label: 'provided color and caption',
            input: {
                color: '#ABCDEF',
                caption: 'Custom Caption',
                values: ['X', 'Y', 'Z'],
            },
            expected: {
                color: '#ABCDEF',
                caption: 'Custom Caption',
                values: ['X', 'Y', 'Z'],
            },
        },
    ])('should handle $label', ({ input, expected }) => {
        const result = transformColorScale(input);
        expect(result).toEqual(expected);
    });
});

describe('transformField', () => {
    it('should return field unchanged when format is not network or network3D', () => {
        const field: Field = {
            format: {
                name: 'text',
                args: {},
            },
        };

        const result = transformField(field);

        expect(result).toEqual(field);
    });

    it.each([
        {
            label: 'network format with isAdvancedColorMode false',
            field: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: false,
                    },
                },
            },
            expected: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: false,
                    },
                },
                args: {
                    isAdvancedColorMode: false,
                    captionTitle: null,
                    colorScale: [],
                },
            },
        },
        {
            label: 'network format with isAdvancedColorMode undefined',
            field: {
                format: {
                    name: 'network' as const,
                    args: {},
                },
            },
            expected: {
                format: {
                    name: 'network' as const,
                    args: {},
                },
                args: {
                    isAdvancedColorMode: false,
                    captionTitle: null,
                    colorScale: [],
                },
            },
        },
        {
            label: 'network3D format with isAdvancedColorMode false',
            field: {
                format: {
                    name: 'network3D' as const,
                    args: {
                        isAdvancedColorMode: false,
                    },
                },
            },
            expected: {
                format: {
                    name: 'network3D' as const,
                    args: {
                        isAdvancedColorMode: false,
                    },
                },
                args: {
                    isAdvancedColorMode: false,
                    captionTitle: null,
                    colorScale: [],
                },
            },
        },
    ])('should set defaults when $label', ({ field, expected }) => {
        const result = transformField(field);

        expect(result).toEqual(expected);
    });

    it('should transform network format with advanced color mode enabled', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    captionTitle: 'My Caption',
                    colorScale: [
                        {
                            color: '#FF0000',
                            caption: 'Red Items',
                            values: ['A', 'B', 'C'],
                        },
                    ],
                },
            },
        };

        const result = transformField(field);

        expect(result).toEqual({
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    captionTitle: 'My Caption',
                    colorScale: [
                        {
                            color: '#FF0000',
                            caption: 'Red Items',
                            values: ['A', 'B', 'C'],
                        },
                    ],
                },
            },
        });
    });

    it.each([
        {
            label: 'default captionTitle when not provided',
            field: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
                    },
                },
            },
            expected: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        captionTitle: null,
                        colorScale: [
                            {
                                color: '#FF0000',
                                caption: null,
                                values: ['A', 'B'],
                            },
                        ],
                    },
                },
            },
        },
        {
            label: 'default color when missing',
            field: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        colorScale: [{ caption: 'Items', values: ['A', 'B'] }],
                    },
                },
            },
            expected: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        captionTitle: null,
                        colorScale: [
                            {
                                color: '#000000',
                                caption: 'Items',
                                values: ['A', 'B'],
                            },
                        ],
                    },
                },
            },
        },
        {
            label: 'null caption when missing',
            field: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
                    },
                },
            },
            expected: {
                format: {
                    name: 'network' as const,
                    args: {
                        isAdvancedColorMode: true,
                        captionTitle: null,
                        colorScale: [
                            {
                                color: '#FF0000',
                                caption: null,
                                values: ['A', 'B'],
                            },
                        ],
                    },
                },
            },
        },
    ])('should set $label in advanced mode', ({ field, expected }) => {
        const result = transformField(field);
        expect(result).toEqual(expected);
    });

    it.each([
        {
            label: 'empty values',
            colorScale: [
                {
                    color: '#FF0000',
                    caption: 'Red Items',
                    values: ['A', 'B'],
                },
                {
                    color: '#00FF00',
                    caption: 'Green Items',
                    values: [],
                },
                {
                    color: '#0000FF',
                    caption: 'Blue Items',
                    values: ['C', 'D'],
                },
            ],
            expectedColorScale: [
                {
                    color: '#FF0000',
                    caption: 'Red Items',
                    values: ['A', 'B'],
                },
                {
                    color: '#0000FF',
                    caption: 'Blue Items',
                    values: ['C', 'D'],
                },
            ],
        },
        {
            label: 'undefined values',
            colorScale: [
                {
                    color: '#FF0000',
                    caption: 'Valid',
                    values: ['A', 'B'],
                },
                {
                    color: '#00FF00',
                    caption: 'Invalid',
                    values: undefined,
                },
            ],
            expectedColorScale: [
                {
                    color: '#FF0000',
                    caption: 'Valid',
                    values: ['A', 'B'],
                },
            ],
        },
    ])(
        'should filter out colorScale items with $label',
        ({ colorScale, expectedColorScale }) => {
            const field: Field = {
                format: {
                    name: 'network',
                    args: {
                        isAdvancedColorMode: true,
                        colorScale,
                    },
                },
            };

            const result = transformField(field);

            expect(result).toEqual({
                format: {
                    name: 'network',
                    args: {
                        isAdvancedColorMode: true,
                        captionTitle: null,
                        colorScale: expectedColorScale,
                    },
                },
            });
        },
    );

    it('should handle undefined items in colorScale array', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale: [
                        {
                            color: '#FF0000',
                            caption: 'Red',
                            values: ['A', 'B'],
                        },
                        undefined,
                        {
                            color: '#00FF00',
                            caption: 'Green',
                            values: ['C', 'D'],
                        },
                    ],
                },
            },
        };

        const result = transformField(field);

        expect(result).toEqual({
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    captionTitle: null,
                    colorScale: [
                        {
                            color: '#FF0000',
                            caption: 'Red',
                            values: ['A', 'B'],
                        },
                        {
                            color: '#00FF00',
                            caption: 'Green',
                            values: ['C', 'D'],
                        },
                    ],
                },
            },
        });
    });

    it.each([
        {
            label: 'colorScale is not an array',
            colorScale: undefined,
        },
        {
            label: 'colorScale is undefined',
            colorScale: undefined,
        },
        {
            label: 'empty colorScale array',
            colorScale: [],
        },
    ])('should return empty colorScale when $label', ({ colorScale }) => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale,
                },
            },
        };

        const result = transformField(field);

        expect(result).toEqual({
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    captionTitle: null,
                    colorScale: [],
                },
            },
        });
    });

    it('should handle colorScale with all items having no values', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale: [
                        {
                            color: '#FF0000',
                            caption: 'Red',
                            values: undefined,
                        },
                        {
                            color: '#00FF00',
                            caption: 'Green',
                            values: [],
                        },
                    ],
                },
            },
        };

        const result = transformField(field);

        expect(result).toEqual({
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    captionTitle: null,
                    colorScale: [],
                },
            },
        });
    });
});
