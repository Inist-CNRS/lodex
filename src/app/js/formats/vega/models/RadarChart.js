import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';

/**
 * Class use for create radar chart spec
 */
class RadarChart {
    /**
     * Init all required parameters
     */
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

    /**
     * Change/Update the default colors
     * @param colors can only be a string with html color code [default value: MULTICHROMATIC_DEFAULT_COLORSET]
     */
    setColors(colors) {
        this.colors = colors;
    }

    /**
     * Set the status of the tooltip (display or not)
     * @param bool new status
     */
    setTooltip(bool) {
        this.tooltip.toggle = bool;
    }

    /**
     * Set the display name of the category
     * @param title new name
     */
    setTooltipCategory(title) {
        this.tooltip.category.title = title;
    }

    /**
     * Set the display name of the value
     * @param title new name
     */
    setTooltipValue(title) {
        this.tooltip.value.title = title;
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
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
