import { createAction, handleActions } from 'redux-actions';
import get from 'lodash.get';

export const OPEN_FACET = 'OPEN_FACET';
export const APPLY_FACET = 'APPLY_FACET';
export const REMOVE_FACET = 'REMOVE_FACET';
export const LOAD_FACET_VALUES = 'LOAD_FACET_VALUES';
export const LOAD_FACET_VALUES_ERROR = 'LOAD_FACET_VALUES_ERROR';
export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';

export const openFacet = createAction(OPEN_FACET);
export const applyFacet = createAction(APPLY_FACET);
export const removeFacet = createAction(REMOVE_FACET);
export const loadFacetValues = createAction(LOAD_FACET_VALUES);
export const loadFacetValuesError = createAction(LOAD_FACET_VALUES_ERROR);
export const loadFacetValuesSuccess = createAction(LOAD_FACET_VALUES_SUCCESS);

export const initialState = {
    error: null,
    selectedFacet: null,
    selectedFacetValues: [],
    selectedFacetValuesTotal: 0,
    appliedFacets: [],
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
        LOAD_FACET_VALUES_SUCCESS: (state, { payload: { name, values } }) => ({
            ...state,
            facetsValues: {
                ...state.facetsValues,
                [name]: values,
            },
        }),
        APPLY_FACET: ({ appliedFacets, ...state }, { payload: facet }) => ({
            ...state,
            appliedFacets: [...appliedFacets, facet],
        }),
        REMOVE_FACET: ({ appliedFacets, ...state }, { payload: field }) => ({
            ...state,
            appliedFacets: appliedFacets.filter(
                f => f.field.name !== field.name,
            ),
        }),
    },
    initialState,
);

export const getSelectedFacet = state => state.selectedFacet;

export const getSelectedFacetValues = state => ({
    values: state.selectedFacetValues,
    total: state.selectedFacetValuesTotal,
});

export const getAppliedFacets = state => state.appliedFacets;

export const isFacetOpen = (state, name) => state.openedFacets[name];

export const getFacetValues = (state, name) =>
    get(state, ['facetsValues', name, 'data'], []);

export const fromFacet = {
    getAppliedFacets,
    getSelectedFacet,
    getSelectedFacetValues,
    isFacetOpen,
    getFacetValues,
};
