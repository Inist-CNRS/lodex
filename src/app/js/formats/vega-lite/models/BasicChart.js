import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../colorUtils';
import {PADDING_BOTTOM, PADDING_LEFT, PADDING_RIGHT, PADDING_TOP} from "../chartsUtils";

/**
 * Very basic impl of the vega charts (common class for all chart)
 */
class BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        this.mark = '';
        this.colors = MULTICHROMATIC_DEFAULT_COLORSET.split(' ');
        this.padding = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    }

    /**
     * Charge/update the size of the padding
     * @param side the corresponding side [PADDING_LEFT, PADDING_RIGHT, PADDING_TOP, PADDING_BOTTOM]
     * @param size the new size
     */
    setPadding(side, size) {
        switch (side) {
            case PADDING_LEFT:
                this.padding.left = size;
                break;
            case PADDING_RIGHT:
                this.padding.right = size;
                break;
            case PADDING_TOP:
                this.padding.top = size;
                break;
            case PADDING_BOTTOM:
                this.padding.bottom = size;
                break
            default:
                throw 'Illegal state: The side given is not a valid side !';
        }
    }

    /**
     * Charge/Update the display type of the charts
     * @param mark
     */
    setMark(mark) {this.mark = mark}

    /**
     * Change/Update the default colors
     * @param colors can only be a string with html color code [default value: MULTICHROMATIC_DEFAULT_COLORSET]
     */
    setColor(colors) {this.colors = colors.split(' ')}

    buildSpec()  {
        throw new Error('The builder can\'t be use at the state');
    }
}

export default BasicChart;