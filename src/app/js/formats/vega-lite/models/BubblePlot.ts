import HeatMap from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash/cloneDeep';

class BubblePlot extends HeatMap {
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(bubblePlotVL);
    }

    buildSpec() {
        // @ts-expect-error TS2339
        this.model.encoding.color.scale.range = this.colors;

        // @ts-expect-error TS2339
        this.model.encoding.x.axis.labelAngle = -35;

        this.commonWithBubblePlot();

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default BubblePlot;
