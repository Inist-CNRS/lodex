import BasicChart from './BasicChart';

class PieChart extends BasicChart {
    constructor() {
        super();
        this.model = require('./json/pie_chart.vl.json');
    }

    buildSpec(widthIn) {
        this.model.encoding.color.scale.range = this.colors;

        if (this.tooltip.toggle)
            this.model.encoding.tooltip = [
                this.tooltip.category,
                this.tooltip.value,
            ];

        this.model.width = widthIn * (widthIn <= 920 ? 0.5 : 0.7);

        this.model.encoding.color.legend.legendX =
            widthIn * (widthIn <= 920 ? 0.5 : 0.7);

        this.model.height = 300;

        return this.model;
    }
}

export default PieChart;
