import { useMemo } from 'react';
import type { ColorScaleItemMaybe } from './ColorScaleInput';

export function useColorOverrides(
    isAdvancedColorMode: boolean | undefined,
    colorScale: ColorScaleItemMaybe[] | undefined,
) {
    return useMemo<Record<string, string>>(() => {
        if (!isAdvancedColorMode) {
            return {};
        }

        return (
            colorScale?.reduce<Record<string, string>>((acc, item) => {
                if (item?.values && item?.color) {
                    const color = item.color.trim();
                    for (const value of item.values.split('\n')) {
                        const cleanedValue = value?.trim();
                        if (cleanedValue) {
                            acc[cleanedValue] = color;
                        }
                    }
                }
                return acc;
            }, {}) ?? {}
        );
    }, [isAdvancedColorMode, colorScale]);
}
