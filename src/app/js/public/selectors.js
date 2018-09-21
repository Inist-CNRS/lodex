import { createGlobalSelectors } from '../lib/selectors';
import { fromDataset as localFromDataset } from './dataset';
import { fromExport as localFromExport } from './export';
import { fromFacet as localFromFacet } from './facet';
import { fromResource as localFromResource } from './resource';
import { fromFormat as localFromFormat } from '../formats/reducer';
import qs from 'qs';

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

export const fromRouter = {
    getResourceUri: state => {
        const pathname = state.router.location.pathname;
        const match = pathname.match(/^\/((?:ark|uid):\/.*$)/);

        if (match) {
            return match[1];
        }

        const queryString = state.router.location.search.replace('?', '');
        const data = qs.parse(queryString);

        return data.uri;
    },
};
