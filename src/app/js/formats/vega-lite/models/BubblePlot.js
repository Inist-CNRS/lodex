import HeatMap from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash.clonedeep';

class BubblePlot extends HeatMap {
    constructor() {
        super();
        this.model = deepClone(bubblePlotVL);
    }

    buildSpec() {
        this.model.encoding.color.scale.range = this.colors;

        this.model.encoding.x.axis.labelAngle = -35;

        this.commonWithBubblePlot();

        return this.model;
    }
}

export default BubblePlot;
