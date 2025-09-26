// @ts-expect-error TS7016
import { schemeBlues } from 'd3-scale-chromatic';
import flowMapVG from './json/flow_map.vg.json';
// @ts-expect-error TS7016
import deepClone from 'lodash/cloneDeep';
import BasicChartVG from './BasicChartVG';
import { VEGA_ACTIONS_WIDTH } from '../../utils/chartsUtils';
import worldCountriesSansAntarctica from '../../vega-lite/models/topojson/world-countries-sans-antarctica.json';
import countriesCoordinate from './json/countriesCoordinate.json';

class FlowMap extends BasicChartVG {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(flowMapVG);
        // @ts-expect-error TS2339
        this.color = '#000000';
        // @ts-expect-error TS2339
        this.colors = schemeBlues[9];
        // @ts-expect-error TS2339
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
    // @ts-expect-error TS7006
    setColor(color) {
        // @ts-expect-error TS2339
        this.color = color;
    }

    // @ts-expect-error TS7006
    setColorScheme(colors) {
        // @ts-expect-error TS2339
        this.colors = colors;
    }

    /**
     * Set the status of the tooltip (display or not)
     * @param bool new status
     */
    // @ts-expect-error TS7006
    setTooltip(bool) {
        // @ts-expect-error TS2339
        this.tooltip.toggle = bool;
    }

    /**
     * Set the display name of the category
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipCategory(title) {
        // @ts-expect-error TS2339
        this.tooltip.category.title = title;
    }

    /**
     * Set the display name of the value
     * @param title new name
     */
    // @ts-expect-error TS7006
    setTooltipValue(title) {
        // @ts-expect-error TS2339
        this.tooltip.value.title = title;
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    // @ts-expect-error TS7006
    buildSpec(widthIn) {
        // @ts-expect-error TS2339
        this.model.background = 'transparent';

        // @ts-expect-error TS2339
        if (!this.editMode) {
            // @ts-expect-error TS2339
            this.model.width = widthIn - VEGA_ACTIONS_WIDTH;
            // @ts-expect-error TS2339
            this.model.height = widthIn * 0.6;
        } else {
            // @ts-expect-error TS2339
            this.model.width = '{|__LODEX_WIDTH__|}';
            // @ts-expect-error TS2339
            this.model.height = '{|__LODEX_HEIGHT__|}';
        }

        // @ts-expect-error TS2339
        this.model.marks.forEach((e) => {
            // @ts-expect-error TS2339
            if (e.type === 'text' && !this.editMode) {
                // @ts-expect-error TS2339
                e.encode.encode.x.value = this.model.width - 5;
            }
            if (e.name === 'route') {
                // @ts-expect-error TS2339
                e.encode.enter.stroke.value = this.color;
            }
        });

        // @ts-expect-error TS2339
        this.model.scales.forEach((e) => {
            if (e.name === 'color') {
                // @ts-expect-error TS2339
                e.range = this.colors;
            }
        });

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            this.model.marks.forEach((e) => {
                if (e.name === 'cell') {
                    e.encode.enter.tooltip = {
                        // @ts-expect-error TS2339
                        signal: `{"${this.tooltip.category.title}": datum.name, "${this.tooltip.value.title}": datum.link_data.count}`,
                    };
                }
            });
        }

        // @ts-expect-error TS2339
        this.model.data.forEach((e) => {
            if (e.name === 'geo_data') {
                e.values = worldCountriesSansAntarctica;
            }
            if (e.name === 'node_data') {
                e.values = countriesCoordinate;
            }
        });

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default FlowMap;
