import { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';

const matchOneOf = (patterns: string[], content: string) => {
    return patterns.some((pattern) =>
        new RegExp(`^${pattern.replaceAll('*', '.*')}`, 'i').test(
            content.trim(),
        ),
    );
};

export function useColorOverrides(
    isAdvancedColorMode: boolean | undefined,
    colorScale: ColorScaleItem[] | undefined,
    defaultColor?: string,
) {
    const { translate } = useTranslate();

    return useMemo<ColorOverrides>(() => {
        if (!isAdvancedColorMode) {
            return {
                colorOverrides: () => defaultColor || 'gray',
                captions: {},
            };
        }

        const captions = {
            ...(colorScale ?? []).reduce<ColorOverrides['captions']>(
                (acc, item) => {
                    if (item?.values && item?.color) {
                        const color = item.color.trim();

                        const caption =
                            item.caption?.trim() ?? item?.values.join(', ');
                        if (caption) {
                            acc[caption] = color;
                        }
                    }

                    return acc;
                },
                (defaultColor
                    ? {
                          [translate('other')]: defaultColor,
                      }
                    : {}) as ColorOverrides['captions'],
            ),
        };

        const colorOverrides = (content: string): string => {
            if (!colorScale) {
                return defaultColor!;
            }
            const color = colorScale?.find((item) => {
                if (!item.values) {
                    return false;
                }
                return matchOneOf(item.values ?? [], content);
            })?.color;
            return color ? color.trim() : defaultColor!;
        };

        return {
            captions,
            colorOverrides,
        };
    }, [translate, isAdvancedColorMode, colorScale, defaultColor]);
}

export type ColorOverrides = {
    colorOverrides: (content: string) => string;
    captions: Record<string, string>;
};

export type ColorScaleItem = {
    color?: string;

    caption?: string;
    values?: string[];
};
