import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';

class RadarChart {
    constructor() {
        this.model = require('./json/radar_chart.vg.json');
        this.colors = MONOCHROMATIC_DEFAULT_COLORSET.split(' ');
    }

    setColors(colors) {
        this.colors = colors;
    }

    buildSpec(widthIn) {
        this.model.scales.forEach(e => {
            if (e.name === 'color') {
                e.range = this.colors;
            }
        });

        this.model.width = widthIn - widthIn * 0.06;
        this.model.height = widthIn - widthIn * 0.24;

        this.model.padding = {
            left: 120,
            right: 120,
            top: 20,
            bottom: 0,
        };

        return this.model;
    }
}

export default RadarChart;
