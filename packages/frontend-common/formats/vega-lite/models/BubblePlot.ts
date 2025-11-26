import { commonWithBubblePlot } from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash/cloneDeep';

export const buildBubblePlotSpec = ({
    colors,
    tooltip = {},
    flip = false,
    orderBy,
    selectionEnabled,
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
}) => {
    const model: any = deepClone(bubblePlotVL);

    if (colors) {
        model.encoding.color.scale.range = colors;
    }

    if (selectionEnabled) {
        model.mark.cursor = 'pointer';
        model.params = [
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
        model.encoding.opacity = {
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
        model.mark.stroke = 'black';
        model.encoding.strokeWidth = {
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

    return commonWithBubblePlot({
        model,
        tooltip,
        flip,
        orderBy,
    });
};
