import BasicChart from './BasicChart';
import { MAP_EUROPE, MAP_FRANCE, MAP_WORLD } from '../../utils/chartsUtils';
import cartographyVL from './json/cartography.vl.json';
import worldCountriesSansAntarctica from './topojson/world-countries-sans-antarctica.json';
import europe from './topojson/europe.json';
import frDepartments from './topojson/fr-departments.json';

// @ts-expect-error TS7016
import deepClone from 'lodash/cloneDeep';

class Cartography extends BasicChart {
    /**
     * Init all required parameters
     */
    constructor() {
        super();
        // @ts-expect-error TS2339
        this.model = deepClone(cartographyVL);
        // @ts-expect-error TS2339
        this.tooltip.category.field = 'properties.name';
        // @ts-expect-error TS2551
        this.worldPosition = 'world';
    }

    // @ts-expect-error TS7006
    setWorldPosition(worldPosition) {
        // @ts-expect-error TS2551
        this.worldPosition = worldPosition;
    }

    /**
     * Rebuild the edited spec
     */
    buildSpec() {
        // @ts-expect-error TS2339
        this.model.encoding.color.scale.range = this.colors;
        // @ts-expect-error TS2339
        this.model.background = 'transparent';

        // @ts-expect-error TS2339
        if (this.tooltip.toggle) {
            if (
                // @ts-expect-error TS2551
                this.worldPosition === MAP_WORLD ||
                // @ts-expect-error TS2551
                this.worldPosition === MAP_EUROPE
            ) {
                // @ts-expect-error TS2339
                this.model.encoding.tooltip = [
                    // @ts-expect-error TS2339
                    this.tooltip.category,
                    // @ts-expect-error TS2339
                    this.tooltip.value,
                ];
            } else {
                // @ts-expect-error TS2339
                this.model.encoding.tooltip = [
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
                    // @ts-expect-error TS2339
                    this.tooltip.value,
                ];
            }
        }

        // @ts-expect-error TS2551
        switch (this.worldPosition) {
            default:
                // @ts-expect-error TS2339
                this.model.data = {
                    values: worldCountriesSansAntarctica,
                    format: { type: 'topojson', feature: 'countries1' },
                };
                break;
            case MAP_EUROPE:
                // @ts-expect-error TS2339
                this.model.data = {
                    values: europe,
                    format: {
                        type: 'topojson',
                        feature: 'continent_Europe_subunits',
                    },
                };
                break;
            case MAP_FRANCE:
                // @ts-expect-error TS2339
                this.model.data = {
                    values: frDepartments,
                    format: {
                        type: 'topojson',
                        feature: 'FRA_adm2',
                    },
                };
                // @ts-expect-error TS2339
                this.model.transform.forEach((e) => {
                    if (e.lookup === 'id') {
                        e.lookup = 'properties.HASC_2';
                    }
                });
                break;
        }

        // @ts-expect-error TS2339
        this.model.width = 'container';
        // @ts-expect-error TS2339
        this.model.height = 'container';
        // @ts-expect-error TS2339
        this.model.autosize = {
            type: 'fit',
            contains: 'padding',
        };

        // @ts-expect-error TS2339
        return this.model;
    }
}

export default Cartography;
