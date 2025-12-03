import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import pieChartVL from './json/pie_chart.vl.json';
import pieChartLabelsVL from './json/pie_chart_labels.vl.json';
import deepClone from 'lodash/cloneDeep';

export const buildPieChartSpec = ({
    colors = MULTICHROMATIC_DEFAULT_COLORSET.split(' '),
    hasTooltip = false,
    tooltipCategory = 'Category',
    tooltipValue = 'Value',
    labels = false,
}: {
    colors?: string[];
    hasTooltip?: boolean;
    tooltipCategory?: string;
    tooltipValue?: string;
    labels?: boolean;
}) => {
    const tooltip = {
        toggle: hasTooltip,
        category: {
            field: '_id',
            type: 'nominal',
            title: tooltipCategory,
        },
        value: {
            field: 'value',
            type: 'quantitative',
            title: tooltipValue,
        },
    };
    const model: any = deepClone(pieChartVL);
    const modelLabels = deepClone(pieChartLabelsVL);
    model.encoding.color.scale.range = colors;
    model.background = 'transparent';

    if (labels) {
        model.layer.push(modelLabels);

        model.encoding.opacity.condition.selection.or.push('hover2');
    }

    if (tooltip.toggle) {
        model.encoding.tooltip = [tooltip.category, tooltip.value];
    }

    model.width = 'container';
    model.height = 'container';
    model.autosize = {
        type: 'fit',
        contains: 'padding',
    };

    return model;
};
