import { createAction, handleActions, combineActions } from 'redux-actions';
import get from 'lodash.get';
import omit from 'lodash.omit';

import facetValueReducer, {
    LOAD_FACET_VALUES_SUCCESS as LOAD_FACET_VALUES_SUCCESS2,
    FACET_VALUE_CHANGE as FACET_VALUE_CHANGE2,
    INVERT_FACET as INVERT_FACET2,
    loadFacetValuesSuccess as loadFacetValuesSuccess2,
    changeFacetValue as changeFacetValue2,
    invertFacet as invertFacet2,
} from './facetValueReducer';

export const OPEN_FACET = 'OPEN_FACET';
export const APPLY_FACET = 'APPLY_FACET';
export const REMOVE_FACET = 'REMOVE_FACET';
export const CLEAR_FACET = 'CLEAR_FACET';
export const LOAD_FACET_VALUES = 'LOAD_FACET_VALUES';
export const LOAD_FACET_VALUES_ERROR = 'LOAD_FACET_VALUES_ERROR';
export const LOAD_FACET_VALUES_SUCCESS = LOAD_FACET_VALUES_SUCCESS2;
export const FACET_VALUE_CHANGE = FACET_VALUE_CHANGE2;
export const INVERT_FACET = INVERT_FACET2;

export const openFacet = createAction(OPEN_FACET);
export const applyFacet = createAction(APPLY_FACET);
export const removeFacet = createAction(REMOVE_FACET);
export const clearFacet = createAction(CLEAR_FACET);
export const loadFacetValues = createAction(LOAD_FACET_VALUES);
export const loadFacetValuesError = createAction(LOAD_FACET_VALUES_ERROR);
export const loadFacetValuesSuccess = loadFacetValuesSuccess2;
export const changeFacetValue = changeFacetValue2;
export const invertFacet = invertFacet2;

export const initialState = {
    error: null,
    selectedFacet: null,
    selectedFacetValues: [],
    selectedFacetValuesTotal: 0,
    appliedFacets: {},
    facetsValues: {},
    openedFacets: {},
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
        [APPLY_FACET]: (
            { appliedFacets, ...state },
            { payload: { name, value } },
        ) => {
            const prevValues = appliedFacets[name] || [];
            const newValues =
                prevValues.indexOf(value) === -1
                    ? prevValues.concat(value)
                    : prevValues;

            return {
                ...state,
                appliedFacets: {
                    ...appliedFacets,
                    [name]: newValues,
                },
            };
        },
        [REMOVE_FACET]: (
            { appliedFacets, ...state },
            { payload: { name, value } },
        ) => {
            const prevValues = appliedFacets[name] || [];
            const newValues = prevValues.filter(v => v !== value);

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
        [CLEAR_FACET]: ({ appliedFacets, ...state }, { payload: name }) => ({
            ...state,
            appliedFacets: omit(appliedFacets, name),
        }),
        [combineActions(LOAD_FACET_VALUES_SUCCESS, FACET_VALUE_CHANGE)]: (
            state,
            action,
        ) => {
            const name = action.payload.name;

            return {
                ...state,
                facetsValues: {
                    ...state.facetsValues,
                    [name]: facetValueReducer(state.facetsValues[name], action),
                },
            };
        },
    },
    initialState,
);

export const getSelectedFacet = state => state.selectedFacet;

export const getSelectedFacetValues = state => ({
    values: state.selectedFacetValues,
    total: state.selectedFacetValuesTotal,
});

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
    get(state, ['facetsValues', name, 'total'], null);

export const getFacetValuesPage = (state, name) =>
    get(state, ['facetsValues', name, 'currentPage']);

export const getFacetValuesPerPage = (state, name) =>
    get(state, ['facetsValues', name, 'perPage']);

export const getFacetValuesFilter = (state, name) =>
    get(state, ['facetsValues', name, 'filter']);

export const isFacetValuesInverted = (state, name) =>
    get(state, ['facetsValues', name, 'inverted']);

export const isFacetValuesChecked = (state, { name, value }) =>
    get(state, ['appliedFacets', name], []).indexOf(value) !== -1;

export const getInvertedFacets = ({ facetsValues }) =>
    Object.keys(facetsValues).filter(key => facetsValues[key].inverted);

export const fromFacet = {
    getAppliedFacets,
    getAppliedFacetList,
    getSelectedFacet,
    getSelectedFacetValues,
    isFacetOpen,
    getFacetValues,
    isFacetValuesChecked,
    getFacetValuesTotal,
    getFacetValuesPage,
    getFacetValuesPerPage,
    getFacetValuesFilter,
    isFacetValuesInverted,
    getInvertedFacets,
};
