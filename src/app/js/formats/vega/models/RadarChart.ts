import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';
import { SCALE_LINEAR } from '../../utils/chartsUtils';
import radarChartVG from './json/radar_chart.vg.json';
// @ts-expect-error TS7016
import deepClone from 'lodash/cloneDeep';
import BasicChartVG from './BasicChartVG';

class RadarChart extends BasicChartVG {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(radarChartVG);
        // @ts-expect-error TS2339
        this.colors = MONOCHROMATIC_DEFAULT_COLORSET.split(' ');
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
        // @ts-expect-error TS2339
        this.scales = SCALE_LINEAR;
    }

    // @ts-expect-error TS7006
    setScale(scales) {
        // @ts-expect-error TS2339
        this.scales = scales;
    }

    /**
     * Change/Update the default colors
     * @param colors can only be a string with html color code [default value: MULTICHROMATIC_DEFAULT_COLORSET]
     */
    // @ts-expect-error TS7006
    setColors(colors) {
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
        this.model.scales.forEach((e) => {
            if (e.name === 'color') {
                // @ts-expect-error TS2339
                e.range = this.colors;
            }
        });

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            // @ts-expect-error TS2339
            this.model.marks.forEach((e1) => {
                if (e1.type === 'group') {
                    // @ts-expect-error TS7006
                    e1.marks.forEach((e2) => {
                        if (e2.type === 'text') {
                            e2.encode.enter.tooltip = {
                                // @ts-expect-error TS2339
                                signal: `{"${this.tooltip.category.title}": datum.datum._id, "${this.tooltip.value.title}": datum.datum.value}`,
                            };
                        }
                    });
                }
            });
        }

        // @ts-expect-error TS2339
        this.model.scales.forEach((e) => {
            if (e.name === 'radial') {
                // @ts-expect-error TS2339
                e.type = this.scales === SCALE_LINEAR ? 'linear' : 'symlog';
            }
        });

        // @ts-expect-error TS2339
        if (!this.editMode) {
            // @ts-expect-error TS2339
            this.model.width = widthIn - widthIn * 0.06;
            // @ts-expect-error TS2339
            this.model.height = widthIn - widthIn * 0.24;
        } else {
            // @ts-expect-error TS2339
            this.model.width = '{|__LODEX_WIDTH__|}';
            // @ts-expect-error TS2339
            this.model.height = '{|__LODEX_HEIGHT__|}';
        }

        // @ts-expect-error TS2339
        this.model.padding = {
            left: 120,
            right: 120,
            top: 20,
            bottom: 0,
        };

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default RadarChart;
