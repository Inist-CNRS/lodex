import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';
import {
    PADDING_BOTTOM,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_TOP,
} from '../chartsUtils';

/**
 * Very basic impl of the vega charts (common class for all chart)
 */
class BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        this.colors = MULTICHROMATIC_DEFAULT_COLORSET.split(' ');
        this.padding = {
            left: 0,
            right: 0,
            top: 10,
            bottom: 0,
        };
        this.tooltip = {
            toggle: false,
            category: {
                field: '_id',
                type: 'nominal',
                title: 'Category',
            },
            value: {
                field: 'value',
                type: 'quantitative',
                title: 'Value',
            },
        };
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
     * Charge/update the size of the padding
     * @param side the corresponding side [PADDING_LEFT, PADDING_RIGHT, PADDING_TOP, PADDING_BOTTOM]
     * @param size the new size
     */
    setPadding(side, size) {
        switch (side) {
            case PADDING_LEFT:
                this.padding.left = parseInt(size);
                break;
            case PADDING_RIGHT:
                this.padding.right = parseInt(size);
                break;
            case PADDING_TOP:
                this.padding.top = parseInt(size);
                break;
            case PADDING_BOTTOM:
                this.padding.bottom = parseInt(size);
                break;
            default:
                throw 'Illegal state: The side given is not a valid side !';
        }
    }

    /**
     * Change/Update the default colors
     * @param colors can only be a string with html color code [default value: MULTICHROMATIC_DEFAULT_COLORSET]
     */
    setColor(colors) {
        this.colors = colors.split(' ');
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    // eslint-disable-next-line no-unused-vars
    buildSpec(widthIn) {
        throw new Error("The builder can't be use at the state");
    }
}

export default BasicChart;
