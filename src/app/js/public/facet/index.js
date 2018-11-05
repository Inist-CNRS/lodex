import { createAction, handleActions, combineActions } from 'redux-actions';
import get from 'lodash.get';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

import facetValueReducer, {
    LOAD_FACET_VALUES_SUCCESS,
    FACET_VALUE_CHANGE,
    FACET_VALUE_SORT,
    loadFacetValuesSuccess,
    changeFacetValue,
    sortFacetValue,
} from './facetValueReducer';

export {
    LOAD_FACET_VALUES_SUCCESS,
    FACET_VALUE_CHANGE,
    FACET_VALUE_SORT,
    loadFacetValuesSuccess,
    changeFacetValue,
    sortFacetValue,
};

import { SAVE_RESOURCE_SUCCESS } from '../resource/index';

export const OPEN_FACET = 'OPEN_FACET';
export const TOGGLE_FACET_VALUE = 'TOGGLE_FACET_VALUE';
export const CLEAR_FACET = 'CLEAR_FACET';
export const LOAD_FACET_VALUES = 'LOAD_FACET_VALUES';
export const LOAD_FACET_VALUES_ERROR = 'LOAD_FACET_VALUES_ERROR';
export const INVERT_FACET = 'INVERT_FACET';

export const openFacet = createAction(OPEN_FACET);
export const toggleFacetValue = createAction(TOGGLE_FACET_VALUE);
export const clearFacet = createAction(CLEAR_FACET);
export const loadFacetValues = createAction(LOAD_FACET_VALUES);
export const loadFacetValuesError = createAction(LOAD_FACET_VALUES_ERROR);
export const invertFacet = createAction(INVERT_FACET);

export const initialState = {
    error: null,
    appliedFacets: {},
    facetsValues: {},
    openedFacets: {},
    invertedFacets: {},
};

export default handleActions(
    {
        [OPEN_FACET]: (state, { payload: { name } }) => ({
            ...state,
            openedFacets: {
                ...state.openedFacets,
                [name]: !state.openedFacets[name],
            },
        }),
        [LOAD_FACET_VALUES_ERROR]: (state, { payload: error }) => ({
            ...state,
            error: error.message || error,
        }),
        [TOGGLE_FACET_VALUE]: (
            { appliedFacets, ...state },
            { payload: { name, value } },
        ) => {
            const isChecked = isFacetValuesChecked(
                { appliedFacets },
                { name, value },
            );
            const prevValues = appliedFacets[name] || [];
            const newValues = isChecked
                ? prevValues.filter(v => v !== value)
                : prevValues.concat(value);

            if (!newValues.length) {
                return {
                    ...state,
                    appliedFacets: omit(appliedFacets, name),
                };
            }

            return {
                ...state,
                appliedFacets: {
                    ...appliedFacets,
                    [name]: newValues,
                },
            };
        },
        [CLEAR_FACET]: (
            { appliedFacets, invertedFacets, ...state },
            { payload: name },
        ) => {
            if (!name) {
                return {
                    ...state,
                    appliedFacets: {},
                    invertedFacets: {},
                };
            }
            return {
                ...state,
                appliedFacets: omit(appliedFacets, name),
                invertedFacets: omit(invertedFacets, name),
            };
        },
        [INVERT_FACET]: (
            { invertedFacets, ...state },
            { payload: { name, inverted } },
        ) => ({
            ...state,
            invertedFacets: inverted
                ? { ...invertedFacets, [name]: true }
                : omit(invertedFacets, name),
        }),
        [combineActions(
            LOAD_FACET_VALUES_SUCCESS,
            FACET_VALUE_CHANGE,
            FACET_VALUE_SORT,
        )]: (state, action) => {
            const name = action.payload.name;

            return {
                ...state,
                facetsValues: {
                    ...state.facetsValues,
                    [name]: facetValueReducer(state.facetsValues[name], action),
                },
            };
        },
        [SAVE_RESOURCE_SUCCESS]: state => ({
            ...state,
            openedFacets: {},
        }),
    },
    initialState,
);

export const getAppliedFacets = ({ appliedFacets }) => appliedFacets;

export const getAppliedFacetList = ({ appliedFacets }) =>
    Object.keys(appliedFacets).map(name => ({
        name,
        value: appliedFacets[name],
    }));

export const isFacetOpen = (state, name) => !!state.openedFacets[name];

export const getFacetValues = (state, name) =>
    get(state, ['facetsValues', name, 'values'], []);

export const getFacetValuesTotal = (state, name) =>
    get(state, ['facetsValues', name, 'total'], 0);

export const getFacetValuesPage = (state, name) =>
    get(state, ['facetsValues', name, 'currentPage'], 0);

export const getFacetValuesPerPage = (state, name) =>
    get(state, ['facetsValues', name, 'perPage'], 10);

export const getFacetValuesFilter = (state, name) =>
    get(state, ['facetsValues', name, 'filter'], '');

export const getFacetValuesSort = (state, name) =>
    get(state, ['facetsValues', name, 'sort'], {});

export const isFacetValuesInverted = ({ invertedFacets }, name) =>
    !!invertedFacets[name];

export const isFacetValuesChecked = (state, { name, value }) =>
    get(state, ['appliedFacets', name], []).indexOf(value) !== -1;

export const getInvertedFacets = ({ invertedFacets }) =>
    Object.keys(invertedFacets);

export const getFacetValueRequestData = (state, name) =>
    pick(get(state, ['facetsValues', name], {}), [
        'sort',
        'filter',
        'currentPage',
        'perPage',
    ]);

export const fromFacet = {
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
    getInvertedFacets,
    getFacetValueRequestData,
};
