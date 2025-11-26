import { renderHook } from '@testing-library/react';
import type { ColorScaleItem } from './useColorOverrides';
import { useColorOverrides } from './useColorOverrides';

describe('useColorOverrides', () => {
    it.each([
        {
            label: 'isAdvancedColorMode is false',
            isAdvancedColorMode: false,
            colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'isAdvancedColorMode is undefined',
            isAdvancedColorMode: undefined,
            colorScale: [{ color: '#FF0000', values: ['A', 'B'] }],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'colorScale is undefined',
            isAdvancedColorMode: true,
            colorScale: undefined,
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'colorScale is empty array',
            isAdvancedColorMode: true,
            colorScale: [],
            expected: { colorOverrides: {}, captions: {} },
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

        expect(result.current).toEqual({
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
                C: '#FF0000',
            },
            captions: {
                'Red Items': '#FF0000',
            },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
                C: '#00FF00',
                D: '#00FF00',
                E: '#0000FF',
            },
            captions: {
                Red: '#FF0000',
                Green: '#00FF00',
                Blue: '#0000FF',
            },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
                C: '#FF0000',
            },
            captions: {
                Caption: '#FF0000',
            },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
                C: '#FF0000',
            },
            captions: {},
        });
    });

    it.each([
        {
            label: 'item with missing color',
            colorScale: [{ values: ['A', 'B'] }] as ColorScaleItem[],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'item with missing values',
            colorScale: [{ color: '#FF0000' }] as ColorScaleItem[],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'item with empty color',
            colorScale: [{ color: '', values: ['A', 'B'] }] as ColorScaleItem[],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'item with empty values array',
            colorScale: [{ color: '#FF0000', values: [] }] as ColorScaleItem[],
            expected: { colorOverrides: {}, captions: {} },
        },
        {
            label: 'item with whitespace-only color',
            colorScale: [
                { color: '   ', values: ['A', 'B'] },
            ] as ColorScaleItem[],
            expected: { colorOverrides: { A: '', B: '' }, captions: {} },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
                D: '#00FF00',
            },
            captions: {
                Red: '#FF0000',
            },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#00FF00',
                C: '#00FF00',
            },
            captions: {
                Red: '#FF0000',
                Green: '#00FF00',
            },
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

        expect(result.current).toEqual({ colorOverrides: {}, captions: {} });

        rerender({ advanced: true });

        expect(result.current).toEqual({
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
            },
            captions: {},
        });

        rerender({ advanced: false });

        expect(result.current).toEqual({ colorOverrides: {}, captions: {} });
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
            },
            captions: {
                Red: '#FF0000',
            },
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            colorOverrides: {
                C: '#00FF00',
                D: '#00FF00',
            },
            captions: {
                Green: '#00FF00',
            },
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
            colorOverrides: {
                A: '#FF0000',
            },
            captions: {},
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            colorOverrides: {
                A: '#FF0000',
                B: '#00FF00',
            },
            captions: {
                Green: '#00FF00',
            },
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
    });

    it('should handle single value', () => {
        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Single', values: ['A'] },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            colorOverrides: {
                A: '#FF0000',
            },
            captions: {
                Single: '#FF0000',
            },
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
            colorOverrides: {
                'Value One': '#FF0000',
                'Value Two': '#FF0000',
                'Value Three': '#FF0000',
            },
            captions: {
                Complex: '#FF0000',
            },
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
            colorOverrides: {
                'value-1': '#FF0000',
                value_2: '#FF0000',
                'value.3': '#FF0000',
                'value@4': '#FF0000',
            },
            captions: {},
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

        expect(result.current).toEqual({ colorOverrides: {}, captions: {} });
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

        expect(result.current).toEqual({ colorOverrides: {}, captions: {} });

        const colorScale: ColorScaleItem[] = [
            { color: '#FF0000', caption: 'Red', values: ['A', 'B'] },
        ];

        rerender({ scale: colorScale });

        expect(result.current).toEqual({
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
            },
            captions: {
                Red: '#FF0000',
            },
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
            colorOverrides: {
                A: '#FF0000',
                B: '#FF0000',
            },
            captions: {
                Red: '#FF0000',
            },
        });

        rerender({ scale: undefined });

        expect(result.current).toEqual({ colorOverrides: {}, captions: {} });
    });
});
