export function transformValues(values: string[] | string | undefined) {
    if (!values) {
        return [];
    }

    const transformedValues: string[] =
        typeof values === 'string' ? values.split('\n') : values;

    return transformedValues
        .map((value) => value.trim())
        .filter((value) => value.length);
}

export function transformColorScale(
    colorScale?: ColorScaleItemMaybe | undefined,
) {
    return {
        color: colorScale?.color || '#000000',
        caption: colorScale?.caption || null,
        values: transformValues(colorScale?.values),
    };
}

export function transformField(field: Field) {
    const format = field.format;
    if (format?.name === 'network' || format?.name === 'network3D') {
        if (!format.args?.isAdvancedColorMode) {
            return {
                ...field,
                args: {
                    ...format.args,
                    isAdvancedColorMode: false,
                    captionTitle: null,
                    colorScale: [],
                },
            };
        }

        return {
            ...field,
            format: {
                ...format,
                args: {
                    ...format.args,
                    captionTitle: format.args?.captionTitle || null,
                    colorScale: (Array.isArray(format.args?.colorScale)
                        ? format.args.colorScale.map(transformColorScale)
                        : []
                    ).filter((colorScale) => !!colorScale.values?.length),
                },
            },
        };
    }
    return field;
}

export type ColorScaleItemMaybe =
    | {
          color?: string;
          caption?: string;
          values?: string[];
      }
    | undefined;

export type Field = {
    name?: string;
    searchable?: boolean;
    format:
        | {
              name: 'network' | 'network3D';
              args: {
                  isAdvancedColorMode?: boolean;
                  captionTitle?: string;
                  colorScale?: ColorScaleItemMaybe[];
              };
          }
        | {
              name: string;
              args: Record<string, undefined>;
          };
};
