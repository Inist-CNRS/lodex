import { createAction, handleActions } from 'redux-actions';

export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';

export const loadFacetValuesSuccess = createAction(LOAD_FACET_VALUES_SUCCESS);

export const initialState = {
    error: null,
    values: [],
    total: 0,
};

export default handleActions(
    {
        LOAD_FACET_VALUES_SUCCESS: (
            state,
            { payload: { data: values, total } },
        ) => ({
            ...state,
            values,
            total,
        }),
    },
    initialState,
);
