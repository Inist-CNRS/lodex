import { transformField, type Field } from './field.transformer';

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
                            values: 'A\nB\nC',
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
                            values: 'A\nB\nC',
                        },
                    ],
                },
            },
        });
    });

    it('should use default captionTitle when not provided in advanced mode', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale: [
                        {
                            color: '#FF0000',
                            values: 'A\nB',
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
                            caption: null,
                            values: 'A\nB',
                        },
                    ],
                },
            },
        });
    });

    it('should set default color when missing in colorScale item', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale: [
                        {
                            caption: 'Items',
                            values: 'A\nB',
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
                            color: '#000000',
                            caption: 'Items',
                            values: 'A\nB',
                        },
                    ],
                },
            },
        });
    });

    it('should set null caption when missing in colorScale item', () => {
        const field: Field = {
            format: {
                name: 'network',
                args: {
                    isAdvancedColorMode: true,
                    colorScale: [
                        {
                            color: '#FF0000',
                            values: 'A\nB',
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
                            caption: null,
                            values: 'A\nB',
                        },
                    ],
                },
            },
        });
    });

    it.each([
        {
            label: 'null values',
            colorScale: [
                {
                    color: '#FF0000',
                    caption: 'Red Items',
                    values: 'A\nB',
                },
                {
                    color: '#00FF00',
                    caption: 'Green Items',
                    values: '',
                },
                {
                    color: '#0000FF',
                    caption: 'Blue Items',
                    values: 'C\nD',
                },
            ],
            expectedColorScale: [
                {
                    color: '#FF0000',
                    caption: 'Red Items',
                    values: 'A\nB',
                },
                {
                    color: '#0000FF',
                    caption: 'Blue Items',
                    values: 'C\nD',
                },
            ],
        },
        {
            label: 'empty string values',
            colorScale: [
                {
                    color: '#FF0000',
                    caption: 'Valid',
                    values: 'A\nB',
                },
                {
                    color: '#00FF00',
                    caption: 'Invalid',
                    values: '',
                },
            ],
            expectedColorScale: [
                {
                    color: '#FF0000',
                    caption: 'Valid',
                    values: 'A\nB',
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
                            values: 'A\nB',
                        },
                        undefined,
                        {
                            color: '#00FF00',
                            caption: 'Green',
                            values: 'C\nD',
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
                            values: 'A\nB',
                        },
                        {
                            color: '#00FF00',
                            caption: 'Green',
                            values: 'C\nD',
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
                            values: '',
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
