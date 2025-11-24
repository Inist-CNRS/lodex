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
                        ? format.args.colorScale.map((caption) => ({
                              color: caption?.color || '#000000',
                              caption: caption?.caption || null,
                              values: caption?.values || null,
                          }))
                        : []
                    ).filter((colorScale) => !!colorScale.values),
                },
            },
        };
    }
    return field;
}

export type Field = {
    name?: string;
    searchable?: boolean;
    format:
        | {
              name: 'network' | 'network3D';
              args: {
                  isAdvancedColorMode?: boolean;
                  captionTitle?: string;
                  colorScale?: (
                      | {
                            color?: string;
                            caption?: string;
                            values?: string;
                        }
                      | undefined
                  )[];
              };
          }
        | {
              name: string;
              args: Record<string, undefined>;
          };
};
