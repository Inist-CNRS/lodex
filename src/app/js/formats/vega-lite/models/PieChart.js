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

    /**
     * Rebuild the edited spec
     * @param widthIn{number | null}
     */
    buildSpec(widthIn = null) {
        this.model.encoding.color.scale.range = this.colors;

        if (this.labels) {
            this.model.layer.push(this.modelLabels);

            this.model.encoding.opacity.condition.selection.or.push('hover2');
        }

        if (this.tooltip.toggle)
            this.model.encoding.tooltip = [
                this.tooltip.category,
                this.tooltip.value,
            ];

        if (!this.editMode) {
            this.model.width = widthIn * (widthIn <= 920 ? 0.5 : 0.7);

            this.model.encoding.color.legend.legendX =
                widthIn * (widthIn <= 920 ? 0.5 : 0.7);
        }

        this.model.height = 300;

        return this.model;
    }
}

export default PieChart;
