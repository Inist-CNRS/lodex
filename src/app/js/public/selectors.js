import { createGlobalSelectors } from '../lib/selectors';
import { fromCharacteristic as localFromCharacteristic } from './characteristic';
import { fromDataset as localFromDataset } from './dataset';
import { fromExport as localFromExport } from './export';
import { fromFacet as localFromFacet } from './facet';
import { fromResource as localFromResource } from './resource';
import { fromFormat as localFromFormat } from '../formats/reducer';

const getCharacteristicState = state => state.characteristic;
export const fromCharacteristic = createGlobalSelectors(
    getCharacteristicState,
    localFromCharacteristic,
);

const getDatasetState = state => state.dataset;
export const fromDataset = createGlobalSelectors(
    getDatasetState,
    localFromDataset,
);

const getExportState = state => state.export;
export const fromExport = createGlobalSelectors(
    getExportState,
    localFromExport,
);

const getFacetState = state => state.facet;
export const fromFacet = createGlobalSelectors(getFacetState, localFromFacet);

const getResourceState = state => state.resource;
export const fromResource = createGlobalSelectors(
    getResourceState,
    localFromResource,
);

const getFormatState = state => state.format;
export const fromFormat = createGlobalSelectors(
    getFormatState,
    localFromFormat,
);

export const fromRouting = {
    getGraphName: state => {
        const route = state.routing.locationBeforeTransitions.pathname;
        const match = route.match(/\/graph\/(.*?)$/);

        return match ? match[1] : null;
    },
};
