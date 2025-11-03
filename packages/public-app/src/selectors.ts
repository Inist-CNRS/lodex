import qs from 'qs';
import { createGlobalSelectors } from '@lodex/frontend-common/utils/selectors';
import { fromDataset as localFromDataset } from './dataset';
import { fromExport as localFromExport } from './export';
import { fromResource as localFromResource } from './resource';
import { fromBreadcrumb as localFromBreadcrumb } from './breadcrumb/reducer';
import { fromMenu as localFromMenu } from './menu/reducer';
import { fromSearch as localFromSearch } from './search/reducer';
import { fromDisplayConfig as localFromDisplayConfig } from './displayConfig/reducer';
import localFromFacet from './facet/selectors';

// @ts-expect-error TS7006
const getDatasetState = (state) => state.dataset;
export const fromDataset = createGlobalSelectors(
    getDatasetState,
    localFromDataset,
);

// @ts-expect-error TS7006
const getExportState = (state) => state.export;
export const fromExport = createGlobalSelectors(
    getExportState,
    localFromExport,
);

// @ts-expect-error TS7006
const getResourceState = (state) => state.resource;
export const fromResource = createGlobalSelectors(
    getResourceState,
    localFromResource,
);

// @ts-expect-error TS7006
const getBreadcrumbState = (state) => state.breadcrumb;
export const fromBreadcrumb = createGlobalSelectors(
    getBreadcrumbState,
    localFromBreadcrumb,
);

// @ts-expect-error TS7006
const getMenuState = (state) => state.menu;
export const fromMenu = createGlobalSelectors(getMenuState, localFromMenu);

// @ts-expect-error TS7006
const getSearchState = (state) => state.search;
export const fromSearch = createGlobalSelectors(
    getSearchState,
    localFromSearch,
);

// @ts-expect-error TS7006
const getDisplayConfigState = (state) => state.displayConfig;
export const fromDisplayConfig = createGlobalSelectors(
    getDisplayConfigState,
    localFromDisplayConfig,
);

// @ts-expect-error TS7006
const getFacet = (page) => (state) => state[page].facet;
const facetSelectorsByPage = {
    dataset: createGlobalSelectors(getFacet('dataset'), localFromFacet),
    search: createGlobalSelectors(getFacet('search'), localFromFacet),
};
// @ts-expect-error TS7006
export const fromFacet = (page) => facetSelectorsByPage[page];

export const fromRouter = {
    // @ts-expect-error TS7006
    getResourceUri: (state) => {
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
