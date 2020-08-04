import BasicChart from './BasicChart';
import { MAP_EUROPE } from '../../chartsUtils';

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
        this.worldPosition = 'world';
    }

    setWorldPosition(worldPosition) {
        this.worldPosition = worldPosition;
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

        if (this.worldPosition === MAP_EUROPE) {
            if (widthIn >= 550) {
                this.model.projection.scale = 300 - 100 * (450 / widthIn);
                this.model.projection.translate = [
                    250 - 30 * (450 / widthIn),
                    585 - 200 * (450 / widthIn),
                ];
            } else {
                this.model.projection.scale = 280 - 140 * (450 / widthIn);
                this.model.projection.translate = [
                    230 - 80 * (450 / widthIn),
                    545 - 260 * (450 / widthIn),
                ];
            }
            this.model.data.url =
                'https://raw.githubusercontent.com/Inist-CNRS/lodex/cartography-addition/src/app/js/formats/vega-lite/models/topojson/europe.json';
            this.model.data.format.feature = 'continent_Europe_subunits';
        }

        this.model.width = widthIn - widthIn * 0.1 - 30;
        this.model.height = (widthIn - widthIn * 0.1) * 0.6 - 30;

        return this.model;
    }
}

export default Cartography;
