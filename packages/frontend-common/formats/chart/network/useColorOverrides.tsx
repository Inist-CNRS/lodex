import { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';

export function useColorOverrides(
    isAdvancedColorMode: boolean | undefined,
    colorScale: ColorScaleItem[] | undefined,
    defaultColor?: string,
) {
    const { translate } = useTranslate();
    return useMemo<ColorOverrides>(() => {
        if (!isAdvancedColorMode) {
            return {
                colorOverrides: {},
                captions: {},
            };
        }

        return {
            ...(colorScale ?? []).reduce<ColorOverrides>(
                (acc, item) => {
                    if (item?.values && item?.color) {
                        const color = item.color.trim();
                        for (const value of item.values) {
                            const cleanedValue = value?.trim();
                            if (cleanedValue) {
                                acc.colorOverrides[cleanedValue] = color;
                            }
                        }

                        const caption =
                            item.caption?.trim() ?? item?.values.join(', ');
                        if (caption) {
                            acc.captions[caption] = color;
                        }
                    }

                    return acc;
                },
                {
                    colorOverrides: {},
                    captions: defaultColor
                        ? {
                              [translate('other')]: defaultColor,
                          }
                        : {},
                },
            ),
        };
    }, [translate, isAdvancedColorMode, colorScale, defaultColor]);
}

export type ColorOverrides = {
    colorOverrides: Record<string, string>;
    captions: Record<string, string>;
};

export type ColorScaleItem = {
    color?: string;

    caption?: string;
    values?: string[];
};
