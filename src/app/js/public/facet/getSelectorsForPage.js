import { fromDataset, fromSearch } from '../selectors';

const selectorsByPage = {
    dataset: fromDataset,
    search: fromSearch,
};

export default page => {
    const selectors = selectorsByPage[page];

    return {
        getFacetValues: selectors.getFacetValues,
        getFacetValuesFilter: selectors.getFacetValuesFilter,
        getFacetValuesPage: selectors.getFacetValuesPage,
        getFacetValuesPerPage: selectors.getFacetValuesPerPage,
        getFacetValuesSort: selectors.getFacetValuesSort,
        getFacetValuesTotal: selectors.getFacetValuesTotal,
        isFacetOpen: selectors.isFacetOpen,
        isFacetValuesInverted: selectors.isFacetValuesInverted,
        isFacetValuesChecked: selectors.isFacetValuesChecked,
    };
};
