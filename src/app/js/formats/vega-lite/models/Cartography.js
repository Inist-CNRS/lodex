import BasicChart from './BasicChart';

/**
 * Class use for create cartography spec
 */
class Cartography extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        this.model = require('./json/cartography.vl.json');
        this.tooltip.category.field = 'properties.name';
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn
     */
    buildSpec(widthIn) {
        this.model.encoding.color.scale.range = this.colors;

        if (this.tooltip.toggle)
            this.model.encoding.tooltip = [
                this.tooltip.category,
                this.tooltip.value,
            ];

        this.model.width = widthIn - widthIn * 0.1 - 30;
        this.model.height = (widthIn - widthIn * 0.1) * 0.6 - 30;

        return this.model;
    }
}

export default Cartography;
