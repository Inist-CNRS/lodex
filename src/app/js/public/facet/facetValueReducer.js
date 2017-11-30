import { createAction, handleActions, combineActions } from 'redux-actions';

export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';
export const FACET_VALUE_CHANGE_PAGE = 'FACET_VALUE_CHANGE_PAGE';
export const FACET_VALUE_CHANGE_PAGE_SUCCESS =
    'FACET_VALUE_CHANGE_PAGE_SUCCESS';

export const loadFacetValuesSuccess = createAction(LOAD_FACET_VALUES_SUCCESS);
export const changePage = createAction(FACET_VALUE_CHANGE_PAGE);

export const initialState = {
    values: [],
    total: 0,
    currentPage: 0,
    perPage: 10,
};

export default handleActions(
    {
        [combineActions(
            LOAD_FACET_VALUES_SUCCESS,
            FACET_VALUE_CHANGE_PAGE_SUCCESS,
        )]: (state, { payload: { values: { data: values, total } } }) => ({
            ...state,
            values,
            total,
        }),
        [FACET_VALUE_CHANGE_PAGE]: (
            state,
            { payload: { currentPage, perPage } },
        ) => ({
            ...state,
            currentPage,
            perPage,
        }),
    },
    initialState,
);
