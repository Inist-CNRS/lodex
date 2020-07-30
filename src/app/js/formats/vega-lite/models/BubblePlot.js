import HeatMap from './HeatMap';

class BubblePlot extends HeatMap {
    constructor() {
        super();
        this.model = require('./json/bubble_plot.vl.json');
    }

    buildSpec(widthIn) {
        this.model.encoding.color.scale.range = this.colors;

        this.commonWithBubblePlot();

        this.model.width = widthIn * 0.6;
        return this.model;
    }
}

export default BubblePlot;
