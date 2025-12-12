import { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';

export const matchOneOf = (patterns: string[], content: string) => {
    if (!patterns || patterns.length === 0) {
        return false;
    }
    return patterns.some((pattern) => {
        return new RegExp(`^${pattern.replaceAll('*', '.*')}$`, 'i').test(
            content.trim(),
        );
    });
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
                captions: [],
            };
        }

        const sanitizedColorScale = (colorScale ?? []).map((item) => {
            const values = item.values?.map((v) => v.trim()).filter(Boolean);
            const caption = item.caption?.trim() ?? values?.join(', ');
            return {
                ...item,
                color: item.color?.trim(),
                caption,
                values,
            };
        });

        const captions: { color: string; label: string }[] = (
            sanitizedColorScale ?? []
        )
            .map((item) => {
                if (item?.values && item?.values?.length && item?.color) {
                    return { label: item.caption, color: item.color };
                }

                return null;
            })
            .filter(Boolean)
            .concat(
                defaultColor
                    ? {
                          label: translate('other'),
                          color: defaultColor,
                      }
                    : [],
            ) as { color: string; label: string }[];

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
            return color ?? defaultColor!;
        };

        return {
            captions,
            colorOverrides,
        };
    }, [translate, isAdvancedColorMode, colorScale, defaultColor]);
}

export type ColorOverrides = {
    colorOverrides: (content: string) => string;
    captions: { label: string; color: string }[];
};

export type ColorScaleItem = {
    color?: string;

    caption?: string;
    values?: string[];
};
