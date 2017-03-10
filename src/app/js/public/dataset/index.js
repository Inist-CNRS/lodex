import { createAction, handleActions, combineActions } from 'redux-actions';

export const LOAD_DATASET_PAGE = 'LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE_SUCCESS = 'LOAD_DATASET_PAGE_SUCCESS';
export const LOAD_DATASET_PAGE_ERROR = 'LOAD_DATASET_PAGE_ERROR';

export const FILTER_DATASET = 'FILTER_DATASET';
export const FILTER_DATASET_SUCCESS = 'FILTER_DATASET_SUCCESS';
export const FILTER_DATASET_ERROR = 'FILTER_DATASET_ERROR';

export const loadDatasetPage = createAction(LOAD_DATASET_PAGE);
export const loadDatasetPageSuccess = createAction(LOAD_DATASET_PAGE_SUCCESS);
export const loadDatasetPageError = createAction(LOAD_DATASET_PAGE_ERROR);

export const filterDataset = createAction(FILTER_DATASET);
export const filterDatasetSuccess = createAction(FILTER_DATASET_SUCCESS);
export const filterDatasetError = createAction(FILTER_DATASET_ERROR);

export const defaultState = {
    match: null,
    currentPage: 0,
    perPage: 10,
    dataset: [],
    loading: false,
    filtering: false,
    total: 0,
};

export default handleActions({
    LOAD_DATASET_PAGE: (state, { payload: { perPage } }) => ({
        ...state,
        error: null,
        loading: true,
        perPage,
    }),
    [combineActions(
        LOAD_DATASET_PAGE_SUCCESS,
        FILTER_DATASET_SUCCESS,
    )]: (state, { payload: { dataset, page: currentPage, total } }) => ({
        ...state,
        currentPage,
        dataset,
        error: null,
        loading: false,
        filtering: false,
        total,
    }),
    [combineActions(
        LOAD_DATASET_PAGE_ERROR,
        FILTER_DATASET_ERROR,
    )]: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
        filtering: false,
    }),
    FILTER_DATASET: (state, { payload: match }) => ({
        ...state,
        currentPage: 0,
        filtering: true,
        match,
    }),
}, defaultState);

const isDatasetLoading = state => state.loading;
const isDatasetFiltering = state => state.filtering;
const getDatasetCurrentPage = state => state.currentPage;
const getDatasetPerPage = state => state.perPage;
const getDataset = state => state.dataset;
const getDatasetTotal = state => state.total;

export const fromDataset = {
    isDatasetLoading,
    isDatasetFiltering,
    getDatasetCurrentPage,
    getDatasetPerPage,
    getDataset,
    getDatasetTotal,
};
