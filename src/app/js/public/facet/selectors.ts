// @ts-expect-error TS7016
import get from 'lodash/get';
// @ts-expect-error TS7016
import pick from 'lodash/pick';

// @ts-expect-error TS7031
export const getAppliedFacets = ({ appliedFacets }) => appliedFacets;

// @ts-expect-error TS7031
export const getAppliedFacetList = ({ appliedFacets }) =>
    Object.keys(appliedFacets).map((name) => ({
        name,
        value: appliedFacets[name],
    }));

// @ts-expect-error TS7006
export const isFacetOpen = (state, name) => !!state.openedFacets[name];

// @ts-expect-error TS7006
export const getFacetValues = (state, name) =>
    get(state, ['facetsValues', name, 'values'], []);

// @ts-expect-error TS7006
export const getFacetValuesTotal = (state, name) =>
    get(state, ['facetsValues', name, 'total'], 0);

// @ts-expect-error TS7006
export const getFacetValuesPage = (state, name) =>
    get(state, ['facetsValues', name, 'currentPage'], 0);

// @ts-expect-error TS7006
export const getFacetValuesPerPage = (state, name) =>
    get(state, ['facetsValues', name, 'perPage'], 10);

// @ts-expect-error TS7006
export const getFacetValuesFilter = (state, name) =>
    get(state, ['facetsValues', name, 'filter'], '');

// @ts-expect-error TS7006
export const getFacetValuesSort = (state, name) =>
    get(state, ['facetsValues', name, 'sort'], {});

// @ts-expect-error TS7031
export const isFacetValuesInverted = ({ invertedFacets }, name) =>
    !!invertedFacets[name];

// @ts-expect-error TS7006
export const isFacetValuesChecked = (state, { name, facetValue }) =>
    get(state, ['appliedFacets', name], []).some(
        // @ts-expect-error TS7006
        (facet) => facet?.value == facetValue?.value,
    );

// @ts-expect-error TS7031
export const getInvertedFacetKeys = ({ invertedFacets }) =>
    Object.keys(invertedFacets);

// @ts-expect-error TS7006
export const getFacetValueRequestData = (state, name) =>
    pick(get(state, ['facetsValues', name], {}), [
        'sort',
        'filter',
        'currentPage',
        'perPage',
    ]);

// @ts-expect-error TS7031
export const getFacetsValues = ({ facetsValues }) => facetsValues;

// @ts-expect-error TS7031
export const getOpenedFacets = ({ openedFacets }) => openedFacets;

// @ts-expect-error TS7031
export const getInvertedFacets = ({ invertedFacets }) => invertedFacets;

// @ts-expect-error TS7031
export const getMaxCheckAllValue = ({ maxCheckAllValue }) => maxCheckAllValue;

export default {
    getAppliedFacets,
    getAppliedFacetList,
    isFacetOpen,
    getFacetValues,
    isFacetValuesChecked,
    getFacetValuesTotal,
    getFacetValuesPage,
    getFacetValuesPerPage,
    getFacetValuesFilter,
    getFacetValuesSort,
    isFacetValuesInverted,
    getInvertedFacetKeys,
    getFacetValueRequestData,
    getOpenedFacets,
    getFacetsValues,
    getInvertedFacets,
    getMaxCheckAllValue,
};
