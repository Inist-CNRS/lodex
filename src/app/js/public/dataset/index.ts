// @ts-expect-error TS7016
import { createAction, handleActions, combineActions } from 'redux-actions';

import { createGlobalSelectors } from '../../lib/selectors';
import createFacetReducer from '../facet';
import facetSelectors from '../facet/selectors';

export const PRE_LOAD_DATASET_PAGE = 'PRE_LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE = 'LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE_SUCCESS = 'LOAD_DATASET_PAGE_SUCCESS';
export const LOAD_DATASET_PAGE_ERROR = 'LOAD_DATASET_PAGE_ERROR';

export const CHANGE_PAGE = 'CHANGE_PAGE';

export const APPLY_FILTER = 'APPLY_FILTER';

export const SORT_DATASET = 'SORT_DATASET';

export const preLoadDatasetPage = createAction(PRE_LOAD_DATASET_PAGE);
export const loadDatasetPage = createAction(LOAD_DATASET_PAGE);
export const loadDatasetPageSuccess = createAction(LOAD_DATASET_PAGE_SUCCESS);
export const loadDatasetPageError = createAction(LOAD_DATASET_PAGE_ERROR);

export const changePage = createAction(CHANGE_PAGE);

export const applyFilter = createAction(APPLY_FILTER);

export const sortDataset = createAction(SORT_DATASET);

const {
    actionTypes: facetActionTypes,
    actions: facetActions,
    reducer: facetReducer,
} = createFacetReducer('DATASET');

export { facetActions, facetActionTypes };

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
    facet: facetReducer(undefined, {}),
};

export default handleActions(
    {
        [combineActions(...Object.values(facetActionTypes))]: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7006
            action,
        ) => ({
            ...state,
            facet: facetReducer(state.facet, action),
        }),
        // @ts-expect-error TS7006
        PRE_LOAD_DATASET_PAGE: (state, { payload }) => ({
            ...state,
            perPage: (payload && payload.perPage) || state.perPage,
        }),
        [combineActions(
            LOAD_DATASET_PAGE,
            facetActionTypes.TOGGLE_FACET_VALUE,
            APPLY_FILTER,
            CHANGE_PAGE,
        // @ts-expect-error TS7006
        )]: (state, { payload }) => ({
            ...state,
            error: null,
            loading: true,
            formatLoading: true,
            perPage: (payload && payload.perPage) || state.perPage,
        }),
        // @ts-expect-error TS7006
        LOAD_FORMAT_DATA_SUCCESS: (state) => ({
            ...state,
            formatLoading: false,
        }),
        LOAD_DATASET_PAGE_SUCCESS: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
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
        // @ts-expect-error TS7006
        LOAD_DATASET_PAGE_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            loading: false,
        }),
        // @ts-expect-error TS7006
        APPLY_FILTER: (state, { payload: match }) => ({
            ...state,
            currentPage: 0,
            match,
            sort: {},
        }),
        // @ts-expect-error TS7006
        [facetActionTypes.TOGGLE_FACET_VALUE]: (state) => ({
            ...state,
            currentPage: 0,
        }),
        // @ts-expect-error TS7006
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

// @ts-expect-error TS7006
const isDatasetLoading = (state) => state.loading;
// @ts-expect-error TS7006
const getDatasetCurrentPage = (state) => state.currentPage;
// @ts-expect-error TS7006
const getDatasetPerPage = (state) => state.perPage;
// @ts-expect-error TS7006
const getDataset = (state) => state.dataset;
// @ts-expect-error TS7006
const getDatasetTotal = (state) => state.total;
// @ts-expect-error TS7006
const getDatasetFullTotal = (state) => state.fullTotal;
// @ts-expect-error TS7006
const isDatasetLoaded = (state) => state.total > 0;
// @ts-expect-error TS7006
const getFilter = (state) => state.match;
// @ts-expect-error TS7006
const getSort = (state) => state.sort;
// @ts-expect-error TS7006
const isSaving = (state) => state.isSaving;
// @ts-expect-error TS7006
const getFacet = (state) => state.facet;

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
    ...createGlobalSelectors(getFacet, facetSelectors),
};
