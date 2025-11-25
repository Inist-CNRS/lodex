import { commonWithBubblePlot } from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash/cloneDeep';

export const buildBubblePlotSpec = ({
    colors,
    tooltip = {},
    flip = false,
    orderBy,
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
}) => {
    const model = deepClone(bubblePlotVL);

    if (colors) {
        model.encoding.color.scale.range = colors;
    }

    return commonWithBubblePlot({
        model,
        tooltip,
        flip,
        orderBy,
    });
};
