import HeatMap from './HeatMap';
import bubblePlotVL from './json/bubble_plot.vl.json';
import deepClone from 'lodash.clonedeep';

class BubblePlot extends HeatMap {
    constructor() {
        super();
        this.model = deepClone(bubblePlotVL);
    }

    /**
     * @param widthIn{number | null}
     */
    buildSpec(widthIn = null) {
        this.model.encoding.color.scale.range = this.colors;

        this.model.encoding.x.axis.labelAngle = -35;

        this.commonWithBubblePlot();

        if (!this.editMode) {
            this.model.width = widthIn * 0.6;
        }

        return this.model;
    }
}

export default BubblePlot;
