import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';

class RadarChart {
    constructor() {
        this.model = require('./json/radar_chart.vg.json');
        this.colors = MONOCHROMATIC_DEFAULT_COLORSET.split(' ');
        this.tooltip = {
            toggle: false,
            category: {
                title: 'Category',
            },
            value: {
                title: 'Value',
            },
        };
    }

    setColors(colors) {
        this.colors = colors;
    }

    setTooltip(bool) {
        this.tooltip.toggle = bool;
    }

    setTooltipCategory(title) {
        this.tooltip.category.title = title;
    }

    setTooltipValue(title) {
        this.tooltip.value.title = title;
    }

    buildSpec(widthIn) {
        this.model.scales.forEach(e => {
            if (e.name === 'color') {
                e.range = this.colors;
            }
        });

        if (this.tooltip.toggle) {
            this.model.marks.forEach(e1 => {
                if (e1.type === 'group') {
                    e1.marks.forEach(e2 => {
                        if (e2.type === 'text') {
                            e2.encode.enter.tooltip = {
                                signal:
                                    "{'" +
                                    this.tooltip.category.title +
                                    "': datum.datum._id, '" +
                                    this.tooltip.value.title +
                                    "': datum.datum.value}",
                            };
                        }
                    });
                }
            });
        }

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
