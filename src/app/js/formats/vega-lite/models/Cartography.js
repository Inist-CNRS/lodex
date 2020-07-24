import BasicChart from './BasicChart';

class Cartography extends BasicChart {
    constructor() {
        super();
        this.model = require('./json/cartography.vl.json');
        this.tooltip.category.field = 'properties.name';
        this.hoverColor = 'C25140';
    }

    setHoverColor(color) {
        this.hoverColor = color;
    }

    buildSpec(widthIn) {
        this.model.encoding.color.scale.range = this.colors;

        if (this.tooltip.toggle)
            this.model.encoding.tooltip = [
                this.tooltip.category,
                this.tooltip.value,
            ];

        this.model.encoding.color.condition.value = this.hoverColor;

        this.model.width = widthIn - widthIn * 0.1 - 40;
        this.model.height = widthIn * 0.6 - widthIn * 0.1 - 40;

        return this.model;
    }
}

export default Cartography;
