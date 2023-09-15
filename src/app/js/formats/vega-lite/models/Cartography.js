import BasicChart from './BasicChart';
import { MAP_EUROPE, MAP_FRANCE, MAP_WORLD } from '../../chartsUtils';
import { VEGA_ACTIONS_WIDTH } from '../component/vega-lite-component/VegaLiteComponent';

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
        this.autosize = {
            type: 'fit',
            contains: 'padding',
        };
    }

    setWorldPosition(worldPosition) {
        this.worldPosition = worldPosition;
    }

    /**
     * Function use for rebuild the edited spec
     * @param widthIn{number | null}
     */
    buildSpec(widthIn = null) {
        this.model.encoding.color.scale.range = this.colors;

        if (this.tooltip.toggle) {
            if (
                this.worldPosition === MAP_WORLD ||
                this.worldPosition === MAP_EUROPE
            ) {
                this.model.encoding.tooltip = [
                    this.tooltip.category,
                    this.tooltip.value,
                ];
            } else {
                this.tooltip.category.field = 'properties.NAME_0';
                this.model.encoding.tooltip = [
                    this.tooltip.category,
                    {
                        field: 'properties.NAME_1',
                        type: 'nominal',
                        title: 'Région',
                    },
                    {
                        field: 'properties.NAME_2',
                        type: 'nominal',
                        title: 'Département',
                    },
                    this.tooltip.value,
                ];
            }
        }

        if (this.editMode) {
            widthIn = 600;
        }

        switch (this.worldPosition) {
            case MAP_EUROPE:
                {
                    if (widthIn >= 850) {
                        this.model.projection.scale =
                            300 - 225 * (450 / widthIn);
                        this.model.projection.translate = [
                            350 - 30 * (450 / widthIn),
                            650 - 200 * (450 / widthIn),
                        ];
                    } else if (widthIn >= 550) {
                        this.model.projection.scale =
                            300 - 100 * (450 / widthIn);
                        this.model.projection.translate = [
                            250 - 30 * (450 / widthIn),
                            585 - 200 * (450 / widthIn),
                        ];
                    } else {
                        this.model.projection.scale =
                            280 - 140 * (450 / widthIn);
                        this.model.projection.translate = [
                            230 - 80 * (450 / widthIn),
                            545 - 260 * (450 / widthIn),
                        ];
                    }
                    this.model.data.url =
                        'https://raw.githubusercontent.com/Inist-CNRS/lodex/master/src/app/js/formats/vega-lite/models/topojson/europe.min.json';
                    this.model.data.format.feature =
                        'continent_Europe_subunits';
                }
                break;
            case MAP_FRANCE:
                {
                    if (widthIn >= 850) {
                        this.model.projection.scale =
                            1800 - 100 * (450 / widthIn);
                        this.model.projection.translate = [
                            400 - 30 * (450 / widthIn),
                            1925 - 100 * (450 / widthIn),
                        ];
                    } else if (widthIn >= 550) {
                        this.model.projection.scale =
                            1200 - 80 * (450 / widthIn);
                        this.model.projection.translate = [
                            280 - 80 * (450 / widthIn),
                            1275 - 80 * (450 / widthIn),
                        ];
                    } else {
                        this.model.projection.scale =
                            1200 - 480 * (450 / widthIn);
                        this.model.projection.translate = [
                            280 - 110 * (450 / widthIn),
                            1275 - 510 * (450 / widthIn),
                        ];
                    }
                    this.model.data.url =
                        'https://raw.githubusercontent.com/Inist-CNRS/lodex/master/src/app/js/formats/vega-lite/models/topojson/fr-departments.min.json';
                    this.model.data.format.feature = 'FRA_adm2';

                    this.model.transform.forEach(e => {
                        if (e.lookup === 'id') {
                            e.lookup = 'properties.HASC_2';
                        }
                    });
                }
                break;
        }

        if (!this.editMode) {
            this.model.width = widthIn - VEGA_ACTIONS_WIDTH;
            this.model.height = widthIn * 0.6;
        }
        this.model.autosize = this.autosize;

        return this.model;
    }
}

export default Cartography;
