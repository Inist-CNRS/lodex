import { createAction, handleActions } from 'redux-actions';

export const LOAD_FACET_VALUES_SUCCESS = 'LOAD_FACET_VALUES_SUCCESS';
export const FACET_VALUE_CHANGE = 'FACET_VALUE_CHANGE';
export const FACET_VALUE_SORT = 'FACET_VALUE_SORT';
export const INVERT_FACET = 'INVERT_FACET';

export const loadFacetValuesSuccess = createAction(LOAD_FACET_VALUES_SUCCESS);
export const changeFacetValue = createAction(FACET_VALUE_CHANGE);
export const sortFacetValue = createAction(FACET_VALUE_SORT);
export const invertFacet = createAction(INVERT_FACET);

export const initialState = {
    values: [],
    total: 0,
    currentPage: 0,
    perPage: 10,
    filter: '',
    inverted: false,
    sort: {
        sortBy: 'count',
        sortDir: 'DESC',
    },
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
            { payload: { currentPage, perPage, filter } },
        ) => ({
            ...state,
            currentPage,
            perPage,
            filter,
        }),
        [FACET_VALUE_SORT]: (
            { sort: { sortBy, sortDir }, ...state },
            { payload: { nextSortBy } },
        ) => ({
            ...state,
            sort: {
                sortBy: nextSortBy,
                sortDir:
                    sortBy === nextSortBy && sortDir === 'DESC'
                        ? 'ASC'
                        : 'DESC',
            },
        }),
        [INVERT_FACET]: (state, { payload: { inverted } }) => ({
            ...state,
            inverted,
        }),
    },
    initialState,
);
