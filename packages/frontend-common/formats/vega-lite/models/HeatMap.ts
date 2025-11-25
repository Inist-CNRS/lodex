import { LABEL_ASC, LABEL_DESC } from '../../utils/chartsUtils';
import heatmapVL from './json/heatmap.vl.json';
import deepClone from 'lodash/cloneDeep';

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
    flip: boolean;
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
                      ...defaultTooltip,
                      title: tooltip.sourceTitle,
                  }
                : defaultTooltip.source,
            tooltip.targetTitle
                ? {
                      ...defaultTooltip,
                      title: tooltip.targetTitle,
                  }
                : defaultTooltip.target,
            tooltip.weightTitle
                ? {
                      ...defaultTooltip,
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
}: {
    colors?: string[];
    tooltip?: {
        toggle?: boolean;
        sourceTitle?: string;
        targetTitle?: string;
        weightTitle?: string;
    };
    flip: boolean;
    orderBy?: number;
}) => {
    const model = deepClone(heatmapVL);

    model.layer.forEach((e) => {
        if (e.mark.type === 'rect' && colors) {
            // @ts-expect-error TS2339
            e.encoding.color.scale.range = colors;
            e.encoding.color.condition.value = colors[colors.length - 1];
        }
    });

    return commonWithBubblePlot({ model, tooltip, flip, orderBy });
};
