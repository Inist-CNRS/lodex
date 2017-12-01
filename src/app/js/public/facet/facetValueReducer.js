import { createAction, handleActions } from 'redux-actions';

export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';
export const FACET_VALUE_CHANGE = 'FACET_VALUE_CHANGE';

export const loadFacetValuesSuccess = createAction(LOAD_FACET_VALUES_SUCCESS);
export const changeFacetValue = createAction(FACET_VALUE_CHANGE);

export const initialState = {
    values: [],
    total: 0,
    currentPage: 0,
    perPage: 10,
    filter: '',
    inverted: false,
};

export default handleActions(
    {
        [LOAD_FACET_VALUES_SUCCESS]: (
            state,
            { payload: { values: { data: values, total } } },
        ) => ({
            ...state,
            values,
            total,
        }),
        [FACET_VALUE_CHANGE]: (
            state,
            { payload: { currentPage, perPage, filter, inverted } },
        ) => ({
            ...state,
            currentPage,
            perPage,
            filter,
            inverted,
        }),
    },
    initialState,
);
