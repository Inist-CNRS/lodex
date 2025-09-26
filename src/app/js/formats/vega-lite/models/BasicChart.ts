import { MULTICHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';

class BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        // @ts-expect-error TS2339
        this.editMode = false;
        // @ts-expect-error TS2339
        this.colors = MULTICHROMATIC_DEFAULT_COLORSET.split(' ');
        // @ts-expect-error TS2339
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

    // @ts-expect-error TS7006
    setEditMode(bool) {
        // @ts-expect-error TS2339
        this.editMode = bool;
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
     * Change/Update the default colors
     * @param colors can only be a string with html color code [default value: MULTICHROMATIC_DEFAULT_COLORSET]
     */
    // @ts-expect-error TS7006
    setColor(colors) {
        // @ts-expect-error TS2339
        this.colors = colors.split(' ');
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    // eslint-disable-next-line no-unused-vars
    // @ts-expect-error TS7006
    buildSpec(widthIn) {
        throw new Error("The builder can't be use at the state");
    }
}

export default BasicChart;
