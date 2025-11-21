import { renderHook } from '@testing-library/react';
import type { ColorScaleItemMaybe } from './ColorScaleInput';
import { useColorOverrides } from './useColorOverrides';

describe('useColorOverrides', () => {
    it.each([
        {
            label: 'isAdvancedColorMode is false',
            isAdvancedColorMode: false,
            colorScale: [{ color: '#FF0000', values: 'A\nB' }],
            expected: {},
        },
        {
            label: 'isAdvancedColorMode is undefined',
            isAdvancedColorMode: undefined,
            colorScale: [{ color: '#FF0000', values: 'A\nB' }],
            expected: {},
        },
        {
            label: 'colorScale is undefined',
            isAdvancedColorMode: true,
            colorScale: undefined,
            expected: {},
        },
        {
            label: 'colorScale is empty array',
            isAdvancedColorMode: true,
            colorScale: [],
            expected: {},
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
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB\nC' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
            C: '#FF0000',
        });
    });

    it('should return color overrides for multiple color scale items', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
            { color: '#00FF00', values: 'C\nD' },
            { color: '#0000FF', values: 'E' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
            C: '#00FF00',
            D: '#00FF00',
            E: '#0000FF',
        });
    });

    it('should trim whitespace from values and colors', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '  #FF0000  ', values: '  A  \n  B  \n  C  ' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
            C: '#FF0000',
        });
    });

    it('should ignore empty lines in values', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\n\nB\n  \nC\n' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
            C: '#FF0000',
        });
    });

    it.each([
        {
            label: 'item with missing color',
            colorScale: [{ values: 'A\nB' }] as ColorScaleItemMaybe[],
            expected: {},
        },
        {
            label: 'item with missing values',
            colorScale: [{ color: '#FF0000' }] as ColorScaleItemMaybe[],
            expected: {},
        },
        {
            label: 'item with empty color',
            colorScale: [
                { color: '', values: 'A\nB' },
            ] as ColorScaleItemMaybe[],
            expected: {},
        },
        {
            label: 'item with empty values',
            colorScale: [
                { color: '#FF0000', values: '' },
            ] as ColorScaleItemMaybe[],
            expected: {},
        },
        {
            label: 'item with whitespace-only color',
            colorScale: [
                { color: '   ', values: 'A\nB' },
            ] as ColorScaleItemMaybe[],
            expected: { A: '', B: '' },
        },
        {
            label: 'undefined item in array',
            colorScale: [undefined, { color: '#FF0000', values: 'A' }],
            expected: { A: '#FF0000' },
        },
    ])('should handle $label', ({ colorScale, expected }) => {
        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual(expected);
    });

    it('should handle mixed valid and invalid items', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
            undefined,
            { color: '', values: 'C' },
            { color: '#00FF00', values: 'D' },
            { values: 'E' },
            { color: '#0000FF', values: '' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
            D: '#00FF00',
        });
    });

    it('should override values when same value appears multiple times', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
            { color: '#00FF00', values: 'B\nC' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#00FF00',
            C: '#00FF00',
        });
    });

    it('should update when isAdvancedColorMode changes', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
        ];

        const { result, rerender } = renderHook(
            ({ advanced }) => useColorOverrides(advanced, colorScale),
            { initialProps: { advanced: false } },
        );

        expect(result.current).toEqual({});

        rerender({ advanced: true });

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
        });

        rerender({ advanced: false });

        expect(result.current).toEqual({});
    });

    it('should update when colorScale changes', () => {
        const colorScale1: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
        ];
        const colorScale2: ColorScaleItemMaybe[] = [
            { color: '#00FF00', values: 'C\nD' },
        ];

        const { result, rerender } = renderHook(
            ({ scale }) => useColorOverrides(true, scale),
            { initialProps: { scale: colorScale1 } },
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            C: '#00FF00',
            D: '#00FF00',
        });
    });

    it('should update when items are added to colorScale', () => {
        const colorScale1: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A' },
        ];
        const colorScale2: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A' },
            { color: '#00FF00', values: 'B' },
        ];

        const { result, rerender } = renderHook(
            ({ scale }) => useColorOverrides(true, scale),
            { initialProps: { scale: colorScale1 } },
        );

        expect(result.current).toEqual({
            A: '#FF0000',
        });

        rerender({ scale: colorScale2 });

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#00FF00',
        });
    });

    it('should memoize result when inputs do not change', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
        ];

        const { result, rerender } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        const firstResult = result.current;

        rerender();

        expect(result.current).toBe(firstResult);
    });

    it('should handle single value without newline', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            A: '#FF0000',
        });
    });

    it('should handle complex multiline values with various whitespace', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            {
                color: '#FF0000',
                values: '  Value One  \n\nValue Two\n  \n  Value Three  \n',
            },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            'Value One': '#FF0000',
            'Value Two': '#FF0000',
            'Value Three': '#FF0000',
        });
    });

    it('should handle values with special characters', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'value-1\nvalue_2\nvalue.3\nvalue@4' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({
            'value-1': '#FF0000',
            value_2: '#FF0000',
            'value.3': '#FF0000',
            'value@4': '#FF0000',
        });
    });

    it('should return empty object when all items are invalid', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            undefined,
            { color: '', values: 'A' },
            { color: '#FF0000', values: '' },
            { values: 'B' },
        ];

        const { result } = renderHook(() =>
            useColorOverrides(true, colorScale),
        );

        expect(result.current).toEqual({});
    });

    it('should handle transition from undefined to defined colorScale', () => {
        const { result, rerender } = renderHook(
            ({ scale }: { scale: ColorScaleItemMaybe[] | undefined }) =>
                useColorOverrides(true, scale),
            {
                initialProps: {
                    scale: undefined as ColorScaleItemMaybe[] | undefined,
                },
            },
        );

        expect(result.current).toEqual({});

        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
        ];

        rerender({ scale: colorScale });

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
        });
    });

    it('should handle transition from defined to undefined colorScale', () => {
        const colorScale: ColorScaleItemMaybe[] = [
            { color: '#FF0000', values: 'A\nB' },
        ];

        const { result, rerender } = renderHook(
            ({ scale }: { scale: ColorScaleItemMaybe[] | undefined }) =>
                useColorOverrides(true, scale),
            {
                initialProps: {
                    scale: colorScale as ColorScaleItemMaybe[] | undefined,
                },
            },
        );

        expect(result.current).toEqual({
            A: '#FF0000',
            B: '#FF0000',
        });

        rerender({ scale: undefined });

        expect(result.current).toEqual({});
    });
});
