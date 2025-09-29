import BasicChart from './BasicChart';
import pieChartVL from './json/pie_chart.vl.json';
import pieChartLabelsVL from './json/pie_chart_labels.vl.json';
import deepClone from 'lodash/cloneDeep';

class PieChart extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(pieChartVL);
        // @ts-expect-error TS2339
        this.modelLabels = deepClone(pieChartLabelsVL);
        // @ts-expect-error TS2339
        this.labels = false;
    }

    // @ts-expect-error TS7006
    setLabels(labels) {
        // @ts-expect-error TS2339
        this.labels = labels;
    }

    buildSpec() {
        // @ts-expect-error TS2339
        this.model.encoding.color.scale.range = this.colors;
        // @ts-expect-error TS2339
        this.model.background = 'transparent';

        // @ts-expect-error TS2339
        if (this.labels) {
            // @ts-expect-error TS2339
            this.model.layer.push(this.modelLabels);

            // @ts-expect-error TS2339
            this.model.encoding.opacity.condition.selection.or.push('hover2');
        }

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            this.model.encoding.tooltip = [
                // @ts-expect-error TS2339
                this.tooltip.category,
                // @ts-expect-error TS2339
                this.tooltip.value,
            ];
        }

        // @ts-expect-error TS2339
        this.model.width = 'container';
        // @ts-expect-error TS2339
        this.model.height = 'container';
        // @ts-expect-error TS2339
        this.model.autosize = {
            type: 'fit',
            contains: 'padding',
        };

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default PieChart;
