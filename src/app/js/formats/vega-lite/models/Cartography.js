import BasicChart from './BasicChart';
import { MAP_EUROPE, MAP_FRANCE, MAP_WORLD } from '../../chartsUtils';
import cartographyVL from './json/cartography.vl.json';
import worldCountriesSansAntarctica from './topojson/world-countries-sans-antarctica.json';
import europe from './topojson/europe.json';
import frDepartments from './topojson/fr-departments.json';

import deepClone from 'lodash.clonedeep';

class Cartography extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        this.model = deepClone(cartographyVL);
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
     * Rebuild the edited spec
     */
    buildSpec() {
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

        switch (this.worldPosition) {
            default:
                this.model.data = {
                    values: worldCountriesSansAntarctica,
                    format: { type: 'topojson', feature: 'countries1' },
                };
                break;
            case MAP_EUROPE:
                this.model.data = {
                    values: europe,
                    format: {
                        type: 'topojson',
                        feature: 'continent_Europe_subunits',
                    },
                };
                break;
            case MAP_FRANCE:
                this.model.data = {
                    values: frDepartments,
                    format: {
                        type: 'topojson',
                        feature: 'FRA_adm2',
                    },
                };
                this.model.transform.forEach(e => {
                    if (e.lookup === 'id') {
                        e.lookup = 'properties.HASC_2';
                    }
                });
                break;
        }

        this.model.width = 'container';
        this.model.height = 'container';

        this.model.autosize = this.autosize;

        return this.model;
    }
}

export default Cartography;
