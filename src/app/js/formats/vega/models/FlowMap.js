import { schemeBlues } from 'd3-scale-chromatic';
import { VEGA_ACTIONS_WIDTH } from '../../vega-lite/component/vega-lite-component/VegaLiteComponent';

/**
 * Class use for create radar chart spec
 */
class FlowMap {
    /**
     * Init all required parameters
     */
    constructor() {
        this.model = require('./json/flow_map.vg.json');
        this.color = '#000000';
        this.colors = schemeBlues[9];
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
     * @param color can only be a string with html color code [default value: black]
     */
    setColor(color) {
        this.color = color;
    }

    setColorScheme(colors) {
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
        this.model.width = widthIn - VEGA_ACTIONS_WIDTH;
        this.model.height = widthIn * 0.6;

        this.model.marks.forEach(e => {
            if (e.type === 'text') {
                e.encode.encode.x.value = this.model.width - 5;
            }
            if (e.name === 'route') {
                e.encode.enter.stroke.value = this.color;
            }
        });

        this.model.scales.forEach(e => {
            if (e.name === 'color') {
                e.range = this.colors;
            }
        });

        if (this.tooltip.toggle)
            this.model.marks.forEach(e => {
                if (e.name === 'cell') {
                    e.encode.enter.tooltip = {
                        signal:
                            "{'" +
                            this.tooltip.category.title +
                            "': datum.name, '" +
                            this.tooltip.value.title +
                            "': datum.link_data.count}",
                    };
                }
            });

        return this.model;
    }
}

export default FlowMap;
