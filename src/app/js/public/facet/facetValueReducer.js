import { createAction, handleActions } from 'redux-actions';

export const createActionTypes = prefix => ({
    LOAD_FACET_VALUES_SUCCESS: `${prefix}_LOAD_FACET_VALUES_SUCCESS`,
    FACET_VALUE_CHANGE: `${prefix}_FACET_VALUE_CHANGE`,
    FACET_VALUE_SORT: `${prefix}_FACET_VALUE_SORT`,
});

export const createActions = actionTypes => ({
    loadFacetValuesSuccess: createAction(actionTypes.LOAD_FACET_VALUES_SUCCESS),
    changeFacetValue: createAction(actionTypes.FACET_VALUE_CHANGE),
    sortFacetValue: createAction(actionTypes.FACET_VALUE_SORT),
});

export const initialState = {
    values: [],
    total: 0,
    currentPage: 0,
    perPage: 10,
    filter: '',
    sort: {
        sortBy: 'count',
        sortDir: 'DESC',
    },
};

export const createReducer = actionTypes =>
    handleActions(
        {
            [actionTypes.LOAD_FACET_VALUES_SUCCESS]: (
                state,
                {
                    payload: {
                        values: { data: values, total },
                    },
                },
            ) => ({
                ...state,
                values,
                total,
            }),
            [actionTypes.FACET_VALUE_CHANGE]: (
                state,
                { payload: { currentPage, perPage, filter } },
            ) => ({
                ...state,
                currentPage,
                perPage,
                filter,
            }),
            [actionTypes.FACET_VALUE_SORT]: (
                { sort: { sortBy, sortDir }, ...state },
                { payload: { nextSortBy } },
            ) => ({
                ...state,
                currentPage: 0,
                sort: {
                    sortBy: nextSortBy,
                    sortDir:
                        sortBy === nextSortBy && sortDir === 'DESC'
                            ? 'ASC'
                            : 'DESC',
                },
            }),
        },
        initialState,
    );
