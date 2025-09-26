// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';

// @ts-expect-error TS7006
export const createActionTypes = (prefix) => ({
    LOAD_FACET_VALUES_SUCCESS: `${prefix}_LOAD_FACET_VALUES_SUCCESS`,
    FACET_VALUE_CHANGE: `${prefix}_FACET_VALUE_CHANGE`,
    FACET_VALUE_SORT: `${prefix}_FACET_VALUE_SORT`,
});

// @ts-expect-error TS7006
export const createActions = (actionTypes) => ({
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

// @ts-expect-error TS7006
export const createReducer = (actionTypes) =>
    handleActions(
        {
            [actionTypes.LOAD_FACET_VALUES_SUCCESS]: (
                // @ts-expect-error TS7006
                state,
                {
                    payload: {
                        // @ts-expect-error TS7031
                        values: { data: values, total },
                    },
                },
            ) => ({
                ...state,
                values,
                total,
            }),
            [actionTypes.FACET_VALUE_CHANGE]: (
                // @ts-expect-error TS7006
                state,
                // @ts-expect-error TS7031
                { payload: { currentPage, perPage, filter } },
            ) => ({
                ...state,
                currentPage,
                perPage,
                filter,
            }),
            [actionTypes.FACET_VALUE_SORT]: (
                // @ts-expect-error TS7031
                { sort: { sortBy, sortDir }, ...state },
                // @ts-expect-error TS7031
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
