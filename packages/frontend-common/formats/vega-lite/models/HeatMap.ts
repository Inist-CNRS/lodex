import deepClone from 'lodash/cloneDeep';
import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';
import heatmapVL from './json/heatmap.vl.json';

const defaultTooltip = {
    source: {
        field: 'source',
        title: 'Source',
        type: 'nominal',
    },
    target: {
        field: 'target',
        title: 'Target',
        type: 'nominal',
    },
    weight: {
        field: 'weight',
        title: 'Weight',
        type: 'quantitative',
    },
};

export const commonWithBubblePlot = ({
    model,
    tooltip,
    flip,
    orderBy,
}: {
    model: Record<string, unknown>;
    tooltip: {
        toggle?: boolean;
        sourceTitle?: string;
        targetTitle?: string;
        weightTitle?: string;
    };
    flip?: boolean;
    orderBy?: number;
}) => {
    model.background = 'transparent';

    if (flip) {
        // @ts-expect-error TS2339
        const field = model.encoding.x.field;
        // @ts-expect-error TS2339
        model.encoding.x.field = model.encoding.y.field;
        // @ts-expect-error TS2339
        model.encoding.y.field = field;
    }

    if (tooltip.toggle) {
        // @ts-expect-error TS2339
        model.encoding.tooltip = [
            tooltip.sourceTitle
                ? {
                      ...defaultTooltip.source,
                      title: tooltip.sourceTitle,
                  }
                : defaultTooltip.source,
            tooltip.targetTitle
                ? {
                      ...defaultTooltip.target,
                      title: tooltip.targetTitle,
                  }
                : defaultTooltip.target,
            tooltip.weightTitle
                ? {
                      ...defaultTooltip.weight,
                      title: tooltip.weightTitle,
                  }
                : defaultTooltip.weight,
        ];
    }

    switch (orderBy) {
        case LABEL_ASC:
            // @ts-expect-error TS2339
            model.encoding.x.sort = 'x';
            // @ts-expect-error TS2339
            model.encoding.y.sort = 'y';
            break;
        case LABEL_DESC:
            // @ts-expect-error TS2339
            model.encoding.x.sort = '-x';
            // @ts-expect-error TS2339
            model.encoding.y.sort = '-y';
            break;
    }

    return model;
};

export const buildHeatMapSpec = ({
    colors,
    tooltip = {},
    flip,
    orderBy,
    selectionEnabled = false,
    selectedDatum,
}: {
    colors?: string[];
    tooltip?: {
        toggle?: boolean;
        sourceTitle?: string;
        targetTitle?: string;
        weightTitle?: string;
    };
    flip?: boolean;
    orderBy?: number;
    selectionEnabled?: boolean;
    selectedDatum?: unknown;
} = {}) => {
    const model: any = deepClone(heatmapVL);

    model.layer.forEach((layer: any) => {
        if (layer.mark.type !== 'rect') {
            return;
        }
        if (colors) {
            layer.encoding.color.scale.range = colors;
            layer.encoding.color.condition.value = colors[colors.length - 1];
        }
        if (selectionEnabled) {
            layer.mark.cursor = 'pointer';
            layer.mark.stroke = 'black';
            layer.params = [
                {
                    name: 'select',
                    select: 'point',
                    value: selectedDatum ? [selectedDatum] : null,
                },
                {
                    name: 'highlight',
                    select: {
                        type: 'point',
                        on: 'pointerover',
                    },
                },
            ];
            layer.encoding.opacity = {
                condition: [
                    {
                        param: 'select',
                        value: 1,
                    },
                    {
                        param: 'highlight',
                        empty: false,
                        value: 1,
                    },
                ],
                value: 0.3,
            };

            layer.encoding.strokeWidth = {
                condition: [
                    {
                        param: 'select',
                        empty: false,
                        value: 1,
                    },
                    {
                        param: 'highlight',
                        empty: false,
                        value: 1,
                    },
                ],
                value: 0,
            };
        }
    });

    return commonWithBubblePlot({ model, tooltip, flip, orderBy });
};
