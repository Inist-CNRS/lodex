import { useMemo } from 'react';
import type { ColorScaleItemMaybe } from './ColorScaleInput';

export function useColorOverrides(
    isAdvancedColorMode: boolean | undefined,
    colorScale: ColorScaleItemMaybe[] | undefined,
) {
    return useMemo<ColorOverrides>(() => {
        if (!isAdvancedColorMode) {
            return {
                colorOverrides: {},
                captions: {},
            };
        }

        return (colorScale ?? []).reduce<ColorOverrides>(
            (acc, item) => {
                if (item?.values && item?.color) {
                    const color = item.color.trim();
                    for (const value of item.values.split('\n')) {
                        const cleanedValue = value?.trim();
                        if (cleanedValue) {
                            acc.colorOverrides[cleanedValue] = color;
                        }
                    }
                    if (item?.caption) {
                        acc.captions[item.caption] = color;
                    }
                }
                return acc;
            },
            {
                colorOverrides: {},
                captions: {},
            },
        );
    }, [isAdvancedColorMode, colorScale]);
}

export type ColorOverrides = {
    colorOverrides: Record<string, string>;
    captions: Record<string, string>;
};
