import qs from 'qs';
import { createGlobalSelectors } from '../lib/selectors';
import { fromDataset as localFromDataset } from './dataset';
import { fromExport as localFromExport } from './export';
import { fromResource as localFromResource } from './resource';
import { fromFormat as localFromFormat } from '../formats/reducer';
import { fromBreadcrumb as localFromBreadcrumb } from './breadcrumb/reducer';
import { fromMenu as localFromMenu } from './menu/reducer';
import { fromSearch as localFromSearch } from './search/reducer';
import localFromFacet from './facet/selectors';

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

const getBreadcrumbState = state => state.breadcrumb;
export const fromBreadcrumb = createGlobalSelectors(
    getBreadcrumbState,
    localFromBreadcrumb,
);

const getMenuState = state => state.menu;
export const fromMenu = createGlobalSelectors(getMenuState, localFromMenu);

const getSearchState = state => state.search;
export const fromSearch = createGlobalSelectors(
    getSearchState,
    localFromSearch,
);

const getFacet = page => state => state[page].facet;
const facetSelectorsByPage = {
    dataset: createGlobalSelectors(getFacet('dataset'), localFromFacet),
    search: createGlobalSelectors(getFacet('search'), localFromFacet),
};
export const fromFacet = page => facetSelectorsByPage[page];

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
