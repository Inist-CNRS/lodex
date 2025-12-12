import { renderHook } from '@testing-library/react';
import type { ColorScaleItem } from './useColorOverrides';
import { useColorOverrides, matchOneOf } from './useColorOverrides';

const mockTranslate = jest.fn((key: string) =>
    key === 'other' ? 'other' : key,
);

jest.mock('../../../i18n/I18NContext', () => ({
    useTranslate: () => ({
        translate: mockTranslate,
    }),
}));

describe('useColorOverrides', () => {
    it.each([
        {
            label: 'isAdvancedColorMode is false',
            isAdvancedColorMode: false,
            colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'isAdvancedColorMode is undefined',
            isAdvancedColorMode: undefined,
            colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'colorScale is undefined',
            isAdvancedColorMode: true,
            colorScale: undefined,
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'colorScale is empty array',
            isAdvancedColorMode: true,
            colorScale: [],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
    ])(
        'should return empty object when $label',
        ({ isAdvancedColorMode, colorScale, expected }) => {
            const { result } = renderHook(() =>
                useColorOverrides(isAdvancedColorMode, colorScale),
            );

            expect(result.current).toEqual(expected);
        },
    );

    it('should return color overrides for single color scale item', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red Items', values: ['A', 'B', 'C'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current.colorOverrides('A')).toBe('#FF0000');
        expect(result.current.colorOverrides('B')).toBe('#FF0000');
        expect(result.current.colorOverrides('C')).toBe('#FF0000');
    });

    it('should use values joined as caption when caption is not provided', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A', 'B', 'C'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'A, B, C', color: '#FF0000' }],
        });
    });

    it('should return color overrides for multiple color scale items', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
            { color: '#00FF00', caption: 'Green', values: ['C', 'D'] },
            { color: '#0000FF', caption: 'Blue', values: ['E'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [
                { label: 'Red', color: '#FF0000' },
                { label: 'Green', color: '#00FF00' },
                { label: 'Blue', color: '#0000FF' },
            ],
        });
    });

    it('should trim whitespace from values and colors', () => {
        const colorScale: ColorScaleItem[] = [
            {
                color: '  #FF0000  ',
                caption: 'Caption',
                values: ['  A  ', '  B  ', '  C  '],
            },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Caption', color: '#FF0000' }],
        });
    });

    it('should ignore empty values in array', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A', '', 'B', '  ', 'C', ''] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'A, B, C', color: '#FF0000' }],
        });
    });

    it.each([
        {
            label: 'item with missing color',
            colorScale: [{ values: ['A', 'B'] }] as ColorScaleItem[],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'item with missing values',
            colorScale: [{ color: '#FF0000' }] as ColorScaleItem[],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'item with empty color',
            colorScale: [{ color: '', values: ['A', 'B'] }] as ColorScaleItem[],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'item with empty values array',
            colorScale: [{ color: '#FF0000', values: [] }] as ColorScaleItem[],
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'removal of item with whitespace-only color',
            colorScale: [
                { color: '   ', values: ['A', 'B'] },
            ] as ColorScaleItem[],
            expected: {
                colorOverrides: expect.any(Function),
                captions: [],
            },
        },
    ])('should handle $label', ({ colorScale, expected }) => {
        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual(expected);
    });

    it('should handle mixed valid and invalid items', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
            { color: '', values: ['C'] },
            { color: '#00FF00', values: ['D'] },
            { values: ['E'] },
            { color: '#0000FF', values: [] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [
                { label: 'Red', color: '#FF0000' },
                { label: 'D', color: '#00FF00' },
            ],
        });
    });

    it('should override values when same value appears multiple times', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
            { color: '#00FF00', caption: 'Green', values: ['B', 'C'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [
                { label: 'Red', color: '#FF0000' },
                { label: 'Green', color: '#00FF00' },
            ],
        });
    });

    it('should update when isAdvancedColorMode changes', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A', 'B'] },
        ];

        const { result, rerender } = renderHook(
            ({ advanced }) => useColorOverrides(advanced, colorScale),
            { initialProps: { advanced: false } },
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [],
        });

        rerender({ advanced: true });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'A, B', color: '#FF0000' }],
        });

        rerender({ advanced: false });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [],
        });
    });

    it('should update when colorScale changes', () => {
        const colorScale1: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
        ];
        const colorScale2: ColorScaleItem[] = [
            { color: '#00FF00', caption: 'Green', values: ['C', 'D'] },
        ];

        const { result, rerender } = renderHook(
            ({ scale }) => useColorOverrides(true, scale),
            { initialProps: { scale: colorScale1 } },
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Red', color: '#FF0000' }],
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Green', color: '#00FF00' }],
        });
    });

    it('should update when items are added to colorScale', () => {
        const colorScale1: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A'] },
        ];
        const colorScale2: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A'] },
            { color: '#00FF00', caption: 'Green', values: ['B'] },
        ];

        const { result, rerender } = renderHook(
            ({ scale }) => useColorOverrides(true, scale),
            { initialProps: { scale: colorScale1 } },
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'A', color: '#FF0000' }],
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [
                { label: 'A', color: '#FF0000' },
                { label: 'Green', color: '#00FF00' },
            ],
        });
    });

    it('should memoize result when inputs do not change', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', values: ['A', 'B'] },
        ];

        const { result, rerender } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        const firstResult = result.current;

        rerender();

        expect(result.current).toBe(firstResult);
        expect(result.current.captions).toEqual([
            { label: 'A, B', color: '#FF0000' },
        ]);
    });

    it('should handle single value', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Single', values: ['A'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Single', color: '#FF0000' }],
        });
    });

    it('should handle values with various whitespace', () => {
        const colorScale: ColorScaleItem[] = [
            {
                color: '#FF0000',
                caption: 'Complex',
                values: [
                    '  Value One  ',
                    '',
                    'Value Two',
                    '  ',
                    '  Value Three  ',
                ],
            },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Complex', color: '#FF0000' }],
        });
    });

    it('should handle values with special characters', () => {
        const colorScale: ColorScaleItem[] = [
            {
                color: '#FF0000',
                values: ['value-1', 'value_2', 'value.3', 'value@4'],
            },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [
                {
                    label: 'value-1, value_2, value.3, value@4',
                    color: '#FF0000',
                },
            ],
        });
    });

    it('should return empty object when all items are invalid', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '', values: ['A'] },
            { color: '#FF0000', values: [] },
            { values: ['B'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [],
        });
    });

    it('should handle transition from undefined to defined colorScale', () => {
        const { result, rerender } = renderHook(
            ({ scale }: { scale: ColorScaleItem[] | undefined }) =>
                useColorOverrides(true, scale),
            {
                initialProps: {
                    scale: undefined as ColorScaleItem[] | undefined,
                },
            },
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [],
        });

        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
        ];

        rerender({ scale: colorScale });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Red', color: '#FF0000' }],
        });
    });

    it('should handle transition from defined to undefined colorScale', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
        ];

        const { result, rerender } = renderHook(
            ({ scale }: { scale: ColorScaleItem[] | undefined }) =>
                useColorOverrides(true, scale),
            {
                initialProps: {
                    scale: colorScale as ColorScaleItem[] | undefined,
                },
            },
        );

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [{ label: 'Red', color: '#FF0000' }],
        });

        rerender({ scale: undefined });

        expect(result.current).toEqual({
            colorOverrides: expect.any(Function),
            captions: [],
        });
    });

    it.each([
        {
            label: 'when defaultColor is provided',
            colorScale: [
                { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
            ] as ColorScaleItem[],
            defaultColor: '#CCCCCC',
            expected: {
                colorOverrides: expect.any(Function),
                captions: [
                    { label: 'Red', color: '#FF0000' },
                    { label: 'other', color: '#CCCCCC' },
                ],
            },
        },
        {
            label: 'when defaultColor is undefined',
            colorScale: [
                { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
            ] as ColorScaleItem[],
            defaultColor: undefined,
            expected: {
                colorOverrides: expect.any(Function),
                captions: [{ label: 'Red', color: '#FF0000' }],
            },
        },
        {
            label: 'with empty colorScale',
            colorScale: [] as ColorScaleItem[],
            defaultColor: '#999999',
            expected: {
                colorOverrides: expect.any(Function),
                captions: [{ label: 'other', color: '#999999' }],
            },
        },
        {
            label: 'with undefined colorScale',
            colorScale: undefined,
            defaultColor: '#888888',
            expected: {
                colorOverrides: expect.any(Function),
                captions: [{ label: 'other', color: '#888888' }],
            },
        },
        {
            label: 'when isAdvancedColorMode is false',
            colorScale: [
                { color: '#FF0000', values: ['A'] },
            ] as ColorScaleItem[],
            defaultColor: '#CCCCCC',
            isAdvancedColorMode: false,
            expected: { colorOverrides: expect.any(Function), captions: [] },
        },
        {
            label: 'with empty string as defaultColor',
            colorScale: [
                { color: '#FF0000', values: ['A'] },
            ] as ColorScaleItem[],
            defaultColor: '',
            expected: {
                colorOverrides: expect.any(Function),
                captions: [{ label: 'A', color: '#FF0000' }],
            },
        },
        {
            label: 'combining multiple captions with defaultColor',
            colorScale: [
                { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
                { color: '#00FF00', caption: 'Green', values: ['C'] },
                { color: '#0000FF', values: ['D', 'E'] },
            ] as ColorScaleItem[],
            defaultColor: '#CCCCCC',
            expected: {
                colorOverrides: expect.any(Function),
                captions: [
                    { label: 'Red', color: '#FF0000' },
                    { label: 'Green', color: '#00FF00' },
                    { label: 'D, E', color: '#0000FF' },
                    { label: 'other', color: '#CCCCCC' },
                ],
            },
        },
    ])(
        'should handle defaultColor $label',
        ({
            colorScale,
            defaultColor,
            isAdvancedColorMode = true,
            expected,
        }) => {
            const { result } = renderHook(() =>
                useColorOverrides(
                    isAdvancedColorMode,
                    colorScale,
                    defaultColor,
                ),
            );

            expect(result.current).toEqual(expected);
        },
    );

    it('should update "other" caption when defaultColor changes', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A'] },
        ];

        const { result, rerender } = renderHook(
            ({ color }) => useColorOverrides(true, colorScale, color),
            { initialProps: { color: '#AAAAAA' as string | undefined } },
        );

        expect(result.current.captions).toEqual([
            {
                label: 'Red',
                color: '#FF0000',
            },
            {
                label: 'other',
                color: '#AAAAAA',
            },
        ]);

        rerender({ color: '#BBBBBB' });

        expect(result.current.captions).toEqual([
            { label: 'Red', color: '#FF0000' },
            { label: 'other', color: '#BBBBBB' },
        ]);

        rerender({ color: undefined });

        expect(result.current.captions).toEqual([
            { label: 'Red', color: '#FF0000' },
        ]);
    });

    it('should return a colorOverrides function that uses defaultColor when no match is found', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale, '#DDDDDD'),
        );

        const colorOverrides = result.current.colorOverrides;

        expect(colorOverrides('B')).toBe('#DDDDDD');
        expect(colorOverrides('C')).toBe('#DDDDDD');
    });

    it('should return a colorOverrides function that return matching color when found', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A'] },
            { color: '#00FF00', caption: 'Green', values: ['B'] },
            { color: '#0000FF', caption: 'Blue', values: ['C'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale, '#DDDDDD'),
        );

        const colorOverrides = result.current.colorOverrides;

        expect(colorOverrides('A')).toBe('#FF0000');
        expect(colorOverrides('B')).toBe('#00FF00');
        expect(colorOverrides('C')).toBe('#0000FF');
        expect(colorOverrides('D')).toBe('#DDDDDD');
    });

    describe('matchOneOf', () => {
        it('should return true if content matches one of the values exactly', () => {
            expect(matchOneOf(['A', 'B', 'C'], 'B')).toBe(true);
        });
        it('should return false if content does not match any of the values exactly', () => {
            expect(matchOneOf(['AB', 'BC', 'CD'], 'A')).toBe(false);
            expect(matchOneOf(['AB', 'BC', 'CD'], 'B')).toBe(false);
            expect(matchOneOf(['AB', 'BC', 'CD'], 'C')).toBe(false);
            expect(matchOneOf(['AB', 'BC', 'CD'], 'D')).toBe(false);
        });
        it('should support wildcard patterns at the end', () => {
            expect(matchOneOf(['A*', 'B*', 'C*'], 'Apple')).toBe(true);
            expect(matchOneOf(['A*', 'B*', 'C*'], 'Banana')).toBe(true);
            expect(matchOneOf(['A*', 'B*', 'C*'], 'Cherry')).toBe(true);
            expect(matchOneOf(['A*', 'B*', 'C*'], 'Date')).toBe(false);
        });
        it('should support wildcard patterns at the start', () => {
            expect(matchOneOf(['*A', '*B', '*C'], 'Data')).toBe(true);
            expect(matchOneOf(['*A', '*B', '*C'], 'Club')).toBe(true);
            expect(matchOneOf(['*A', '*B', '*C'], 'Music')).toBe(true);
            expect(matchOneOf(['*A', '*B', '*C'], 'Test')).toBe(false);
        });
        it('should support wildcard patterns in the middle', () => {
            expect(matchOneOf(['A*C', 'B*D', 'C*E'], 'ABC')).toBe(true);
            expect(matchOneOf(['A*C', 'B*D', 'C*E'], 'BXD')).toBe(true);
            expect(matchOneOf(['A*C', 'B*D', 'C*E'], 'C123E')).toBe(true);
            expect(matchOneOf(['A*C', 'B*D', 'C*E'], 'ADE')).toBe(false);
        });
        it('should support multiple wildcards in a single pattern', () => {
            expect(
                matchOneOf(
                    ['the*fox*dog'],
                    'The quick brown fox jump over the lazy dog',
                ),
            ).toBe(true);
            expect(
                matchOneOf(
                    ['*fox*dog*'],
                    'The quick brown fox jump over the lazy dog',
                ),
            ).toBe(true);
        });
        it('should be case-insensitive', () => {
            expect(matchOneOf(['a', 'b', 'c'], 'A')).toBe(true);
            expect(matchOneOf(['a*', 'b*', 'c*'], 'APPLE')).toBe(true);
            expect(matchOneOf(['*a', '*b', '*c'], 'DATA')).toBe(true);
            expect(matchOneOf(['A*C'], 'a123c')).toBe(true);
        });
        it('should return false if values array is empty', () => {
            expect(matchOneOf([], 'A')).toBe(false);
        });
    });
});
