import HeatMap from './HeatMap';

class BubblePlot extends HeatMap {
    constructor() {
        super();
        this.model = require('./json/bubble_plot.vl.json');
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
