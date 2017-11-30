import { createAction, handleActions, combineActions } from 'redux-actions';
import get from 'lodash.get';

import facetValueReducer, {
    LOAD_FACET_VALUES_SUCCESS as LOAD_FACET_VALUES_SUCCESS2,
    FACET_VALUE_CHANGE_PAGE as FACET_VALUE_CHANGE_PAGE2,
    FACET_VALUE_CHANGE_PAGE_SUCCESS as FACET_VALUE_CHANGE_PAGE_SUCCESS2,
    loadFacetValuesSuccess as loadFacetValuesSuccess2,
    changePage as changePage2,
} from './facetValueReducer';

export const OPEN_FACET = 'OPEN_FACET';
export const APPLY_FACET = 'APPLY_FACET';
export const REMOVE_FACET = 'REMOVE_FACET';
export const LOAD_FACET_VALUES = 'LOAD_FACET_VALUES';
export const LOAD_FACET_VALUES_ERROR = 'LOAD_FACET_VALUES_ERROR';
export const LOAD_FACET_VALUES_SUCCESS = LOAD_FACET_VALUES_SUCCESS2;
export const FACET_VALUE_CHANGE_PAGE = FACET_VALUE_CHANGE_PAGE2;
export const FACET_VALUE_CHANGE_PAGE_SUCCESS = FACET_VALUE_CHANGE_PAGE_SUCCESS2;

export const openFacet = createAction(OPEN_FACET);
export const applyFacet = createAction(APPLY_FACET);
export const removeFacet = createAction(REMOVE_FACET);
export const loadFacetValues = createAction(LOAD_FACET_VALUES);
export const loadFacetValuesError = createAction(LOAD_FACET_VALUES_ERROR);
export const loadFacetValuesSuccess = loadFacetValuesSuccess2;
export const changePage = changePage2;

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
        OPEN_FACET: (state, { payload: { name } }) => ({
            ...state,
            openedFacets: {
                ...state.openedFacets,
                [name]: !state.openedFacets[name],
            },
        }),
        LOAD_FACET_VALUES_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message || error,
        }),
        APPLY_FACET: (
            { appliedFacets, ...state },
            { payload: { name, value } },
        ) => ({
            ...state,
            appliedFacets: {
                ...appliedFacets,
                [name]: value,
            },
        }),
        REMOVE_FACET: ({ appliedFacets, ...state }, { payload: name }) => ({
            ...state,
            appliedFacets: {
                ...appliedFacets,
                [name]: undefined,
            },
        }),
        [combineActions(
            LOAD_FACET_VALUES_SUCCESS,
            FACET_VALUE_CHANGE_PAGE,
            FACET_VALUE_CHANGE_PAGE_SUCCESS,
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
    },
    initialState,
);

export const getSelectedFacet = state => state.selectedFacet;

export const getSelectedFacetValues = state => ({
    values: state.selectedFacetValues,
    total: state.selectedFacetValuesTotal,
});

export const getAppliedFacets = state => state.appliedFacets;

export const isFacetOpen = (state, name) => !!state.openedFacets[name];

export const getFacetValues = (state, name) =>
    get(state, ['facetsValues', name, 'values'], []);

export const getFacetValuesTotal = (state, name) =>
    get(state, ['facetsValues', name, 'total'], null);

export const getFacetValuesPage = (state, name) =>
    get(state, ['facetsValues', name, 'currentPage']);

export const getFacetValuesPerPage = (state, name) =>
    get(state, ['facetsValues', name, 'perPage']);

export const isFacetValuesChecked = (state, { name, value }) =>
    state.appliedFacets[name] === value;

export const fromFacet = {
    getAppliedFacets,
    getSelectedFacet,
    getSelectedFacetValues,
    isFacetOpen,
    getFacetValues,
    isFacetValuesChecked,
    getFacetValuesTotal,
    getFacetValuesPage,
    getFacetValuesPerPage,
};
