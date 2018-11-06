import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';

import { fromDataset, fromSearch } from '../selectors';

const actionsByPage = {
    dataset: datasetActions,
    search: searchActions,
};

const selectorsByPage = {
    dataset: fromDataset,
    search: fromSearch,
};

export default page => {
    const actions = actionsByPage[page];
    const selectors = selectorsByPage[page];

    return {
        changeFacetValue: actions.changeFacetValue,
        getFacetValues: selectors.getFacetValues,
        getFacetValuesFilter: selectors.getFacetValuesFilter,
        getFacetValuesPage: selectors.getFacetValuesPage,
        getFacetValuesPerPage: selectors.getFacetValuesPerPage,
        getFacetValuesSort: selectors.getFacetValuesSort,
        getFacetValuesTotal: selectors.getFacetValuesTotal,
        invertFacet: actions.invertFacet,
        isFacetOpen: selectors.isFacetOpen,
        isFacetValuesInverted: selectors.isFacetValuesInverted,
        openFacet: actions.openFacet,
        sortFacetValue: actions.sortFacetValue,
        isFacetValuesChecked: selectors.isFacetValuesChecked,
        toggleFacetValue: actions.toggleFacetValue,
    };
};
