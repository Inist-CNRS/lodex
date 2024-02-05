import BasicChart from './BasicChart';
import pieChartVL from './json/pie_chart.vl.json';
import pieChartLabelsVL from './json/pie_chart_labels.vl.json';
import deepClone from 'lodash.clonedeep';

class PieChart extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        this.model = deepClone(pieChartVL);
        this.modelLabels = deepClone(pieChartLabelsVL);
        this.labels = false;
    }

    setLabels(labels) {
        this.labels = labels;
    }

    buildSpec() {
        this.model.encoding.color.scale.range = this.colors;

        if (this.labels) {
            this.model.layer.push(this.modelLabels);

            this.model.encoding.opacity.condition.selection.or.push('hover2');
        }

        if (this.tooltip.toggle) {
            this.model.encoding.tooltip = [
                this.tooltip.category,
                this.tooltip.value,
            ];
        }

        this.model.width = 'container';
        this.model.height = 'container';
        this.model.autosize = {
            type: 'fit',
            contains: 'padding',
        };

        return this.model;
    }
}

export default PieChart;
