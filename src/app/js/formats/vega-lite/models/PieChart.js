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

        this.model.width = this.model.height =
            widthIn * (widthIn <= 920 ? 0.5 : 0.7);

        return this.model;
    }
}

export default PieChart;
