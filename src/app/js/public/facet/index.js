import { createAction, handleActions } from 'redux-actions';

export const SELECT_FACET = 'SELECT_FACET';
export const APPLY_FACET = 'APPLY_FACET';
export const REMOVE_FACET = 'REMOVE_FACET';
export const LOAD_FACET_VALUES = 'LOAD_FACET_VALUES';
export const LOAD_FACET_VALUES_ERROR = 'LOAD_FACET_VALUES_ERROR';
export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';

export const selectFacet = createAction(SELECT_FACET);
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
    facets: [],
};

export default handleActions(
    {
        SELECT_FACET: (state, { payload: { field: selectedFacet } }) => ({
            ...state,
            selectedFacet,
        }),
        LOAD_FACET_VALUES_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message || error,
        }),
        LOAD_FACET_VALUES_SUCCESS: (state, { payload: { data, total } }) => ({
            ...state,
            selectedFacetValues: data,
            selectedFacetValuesTotal: total,
        }),
        APPLY_FACET: ({ facets, ...state }, { payload: facet }) => ({
            ...state,
            facets: [...facets, facet],
            selectedFacet: null,
            selectedFacetValues: [],
            selectedFacetValuesTotal: 0,
        }),
        REMOVE_FACET: ({ facets, ...state }, { payload: field }) => ({
            ...state,
            facets: facets.filter(f => f.field.name !== field.name),
        }),
    },
    initialState,
);

export const getSelectedFacet = state => state.selectedFacet;

export const getSelectedFacetValues = state => ({
    values: state.selectedFacetValues,
    total: state.selectedFacetValuesTotal,
});

export const getAppliedFacets = state => state.facets;

export const fromFacet = {
    getAppliedFacets,
    getSelectedFacet,
    getSelectedFacetValues,
};
