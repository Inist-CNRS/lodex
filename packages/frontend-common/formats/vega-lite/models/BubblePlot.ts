import { commonWithBubblePlot } from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash/cloneDeep';

export const buildBubblePlotSpec = ({
    colors,
    tooltip = {},
    flip = false,
    orderBy,
    selectionEnabled,
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
}) => {
    const model = deepClone(bubblePlotVL);

    if (colors) {
        model.encoding.color.scale.range = colors;
    }

    if (selectionEnabled) {
        model.mark.cursor = 'pointer';
        model.params = [
            {
                name: 'select',
                select: 'point',
            },
        ];
        model.encoding.opacity = {
            condition: {
                param: 'select',
                value: 1,
            },
            value: 0.3,
        };
    }

    return commonWithBubblePlot({
        model,
        tooltip,
        flip,
        orderBy,
    });
};
