import { renderHook } from '@testing-library/react';
import { useLinkColor } from './useLinkColor';

describe('useLinkColor', () => {
    describe('animated mode', () => {
        it.each([
            {
                label: 'with specified color',
                link: { color: '#ff0000', value: 5 },
                expected: '#ff000099',
            },
            {
                label: 'with default color when no color provided',
                link: { value: 5 },
                expected: '#d0d0d099',
            },
        ])(
            'should return color with transparency $label',
            ({ link, expected }) => {
                const { result } = renderHook(() =>
                    useLinkColor({
                        mode: 'animated',
                        minLinkSize: 1,
                        maxLinkSize: 10,
                    }),
                );

                const linkColor = result.current(link);

                expect(linkColor).toBe(expected);
            },
        );

        it('should return same color regardless of value', () => {
            const { result } = renderHook(() =>
                useLinkColor({
                    mode: 'animated',
                    minLinkSize: 1,
                    maxLinkSize: 10,
                }),
            );

            const linkColor1 = result.current({ color: '#00ff00', value: 1 });
            const linkColor2 = result.current({ color: '#00ff00', value: 10 });

            expect(linkColor1).toBe(linkColor2);
        });
    });

    describe('arrow mode', () => {
        it.each([
            {
                label: 'lighten color for values below midpoint',
                value: 2,
                color: '#ff0000',
                expected: 'rgb(255, 76, 76)',
            },
            {
                label: 'darken color for values above midpoint',
                value: 8,
                color: '#ff0000',
                expected: 'rgb(178, 0, 0)',
            },
            {
                label: 'return original color at midpoint',
                value: 5,
                color: '#ff0000',
                expected: 'rgb(255, 0, 0)',
            },
        ])('should $label', ({ value, color, expected }) => {
            const { result } = renderHook(() =>
                useLinkColor({
                    mode: 'arrow',
                    minLinkSize: 0,
                    maxLinkSize: 10,
                }),
            );

            const linkColor = result.current({ color, value });

            expect(linkColor).toBe(expected);
        });

        it.each([
            {
                label: 'use default color when link has no color',
                link: { value: 5 },
                minLinkSize: 0,
                maxLinkSize: 10,
                expected: 'rgb(208, 208, 208)',
            },
            {
                label: 'use value 1 when link has no value',
                link: { color: '#00ff00' },
                minLinkSize: 0,
                maxLinkSize: 10,
                expected: 'rgb(102, 255, 102)',
            },
            {
                label: 'handle edge case when maxLinkSize equals minLinkSize',
                link: { color: '#0000ff', value: 5 },
                minLinkSize: 5,
                maxLinkSize: 5,
                expected: 'rgb(127, 127, 255)',
            },
            {
                label: 'handle minimum value',
                link: { color: '#ff00ff', value: 1 },
                minLinkSize: 1,
                maxLinkSize: 10,
                expected: 'rgb(255, 127, 255)',
            },
            {
                label: 'handle maximum value',
                link: { color: '#ff00ff', value: 10 },
                minLinkSize: 1,
                maxLinkSize: 10,
                expected: 'rgb(127, 0, 127)',
            },
        ])('should $label', ({ link, minLinkSize, maxLinkSize, expected }) => {
            const { result } = renderHook(() =>
                useLinkColor({
                    mode: 'arrow',
                    minLinkSize,
                    maxLinkSize,
                }),
            );

            const linkColor = result.current(link);

            expect(linkColor).toBe(expected);
        });
    });
});
