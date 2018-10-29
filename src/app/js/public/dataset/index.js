import { createAction, handleActions, combineActions } from 'redux-actions';
import { TOGGLE_FACET_VALUE } from '../facet';

export const PRE_LOAD_DATASET_PAGE = 'PRE_LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE = 'LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE_SUCCESS = 'LOAD_DATASET_PAGE_SUCCESS';
export const LOAD_DATASET_PAGE_ERROR = 'LOAD_DATASET_PAGE_ERROR';

export const CHANGE_PAGE = 'CHANGE_PAGE';

export const APPLY_FILTER = 'APPLY_FILTER';
export const CLEAR_FILTER = 'CLEAR_FILTER';

export const SORT_DATASET = 'SORT_DATASET';

export const preLoadDatasetPage = createAction(PRE_LOAD_DATASET_PAGE);
export const loadDatasetPage = createAction(LOAD_DATASET_PAGE);
export const loadDatasetPageSuccess = createAction(LOAD_DATASET_PAGE_SUCCESS);
export const loadDatasetPageError = createAction(LOAD_DATASET_PAGE_ERROR);

export const changePage = createAction(CHANGE_PAGE);

export const applyFilter = createAction(APPLY_FILTER);
export const clearFilter = createAction(CLEAR_FILTER);

export const sortDataset = createAction(SORT_DATASET);

export const defaultState = {
    isSaving: false,
    isCreating: false,
    match: null,
    currentPage: 0,
    perPage: 10,
    dataset: [],
    loading: false,
    sort: {},
    total: 0,
    fullTotal: 0,
};

export default handleActions(
    {
        PRE_LOAD_DATASET_PAGE: (state, { payload }) => ({
            ...state,
            perPage: (payload && payload.perPage) || state.perPage,
        }),
        [combineActions(
            LOAD_DATASET_PAGE,
            TOGGLE_FACET_VALUE,
            APPLY_FILTER,
            CHANGE_PAGE,
        )]: (state, { payload }) => ({
            ...state,
            error: null,
            loading: true,
            perPage: (payload && payload.perPage) || state.perPage,
        }),
        CLEAR_FILTER: () => defaultState,
        LOAD_DATASET_PAGE_SUCCESS: (
            state,
            { payload: { dataset, page: currentPage, total, fullTotal } },
        ) => ({
            ...state,
            currentPage,
            dataset,
            error: null,
            loading: false,
            total,
            fullTotal,
        }),
        LOAD_DATASET_PAGE_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            loading: false,
        }),
        APPLY_FILTER: (state, { payload: match }) => ({
            ...state,
            currentPage: 0,
            match,
        }),
        TOGGLE_FACET_VALUE: state => ({
            ...state,
            currentPage: 0,
        }),
        SORT_DATASET: (state, { payload: sortBy }) => {
            const sortDir =
                sortBy === state.sort.sortBy && state.sort.sortDir === 'ASC'
                    ? 'DESC'
                    : 'ASC';

            return {
                ...state,
                currentPage: 0,
                sort: {
                    sortBy,
                    sortDir,
                },
            };
        },
    },
    defaultState,
);

const isDatasetLoading = state => state.loading;
const getDatasetCurrentPage = state => state.currentPage;
const getDatasetPerPage = state => state.perPage;
const getDataset = state => state.dataset;
const getDatasetTotal = state => state.total;
const getDatasetFullTotal = state => state.fullTotal;
const isDatasetLoaded = state => state.total > 0;
const getFilter = state => state.match || '';
const getSort = state => state.sort;
const isSaving = state => state.isSaving;

export const fromDataset = {
    isDatasetLoading,
    getDatasetCurrentPage,
    getDatasetPerPage,
    getDataset,
    getDatasetTotal,
    getDatasetFullTotal,
    isDatasetLoaded,
    getFilter,
    getSort,
    isSaving,
};
