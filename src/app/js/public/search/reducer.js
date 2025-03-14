import { combineActions, createAction, handleActions } from 'redux-actions';

import { createGlobalSelectors } from '../../lib/selectors';
import createFacetReducer from '../facet';
import facetSelectors from '../facet/selectors';

export const SEARCH = 'SEARCH';
export const SEARCH_ANNOTATIONS = 'SEARCH_ANNOTATIONS';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const SEARCH_LOAD_MORE = 'SEARCH_LOAD_MORE';
export const SEARCH_LOAD_MORE_SUCCESS = 'SEARCH_LOAD_MORE_SUCCESS';
export const SEARCH_LOAD_MORE_ERROR = 'SEARCH_LOAD_MORE_ERROR';

export const SEARCH_SORT = 'SEARCH_SORT';
export const SEARCH_SORT_INIT = 'SEARCH_SORT_INIT';

export const SEARCH_ANNOTATION_ADDED = 'SEARCH_ANNOTATION_ADDED';

export const search = createAction(SEARCH);
export const searchAnnotations = createAction(SEARCH_ANNOTATIONS);
export const searchSucceed = createAction(SEARCH_RESULTS);
export const searchFailed = createAction(SEARCH_ERROR);
export const annotationAdded = createAction(SEARCH_ANNOTATION_ADDED);

export const sort = createAction(SEARCH_SORT);
export const initSort = createAction(SEARCH_SORT_INIT);

export const loadMore = createAction(SEARCH_LOAD_MORE);
export const loadMoreSucceed = createAction(SEARCH_LOAD_MORE_SUCCESS);
export const loadMoreFailed = createAction(SEARCH_LOAD_MORE_ERROR);

export const fromSearch = {
    isLoading: (state) => state.loading,
    getDataset: (state) => state.dataset,
    getDatasetTotal: (state) => state.total,
    getDatasetFullTotal: (state) => state.fullTotal,
    getSort: (state) => state.sort,
    getFieldNames: (state) => state.fields,
    getPage: (state) => state.page,
    getTotal: (state) => state.total,
    getQuery: (state) => state.query,
    getResourceUrisWithAnnotationFilter: (state) =>
        state.filters?.resourceUrisWithAnnotation,
    getAnnotationsFilter: (state) => state.filters?.annotations,
    getFilters: (state) => state.filters,
    getPrevResource: (state, currentResource) => {
        if (!currentResource || !currentResource.uri) {
            return null;
        }
        const indexCurrentResource = state.dataset.findIndex(
            (resource) => resource.uri === currentResource.uri,
        );
        return indexCurrentResource < 0
            ? null
            : state.dataset[indexCurrentResource - 1];
    },
    getNextResource: (state, currentResource) => {
        if (!currentResource || !currentResource.uri) {
            return null;
        }
        const indexCurrentResource = state.dataset.findIndex(
            (resource) => resource.uri === currentResource.uri,
        );
        return indexCurrentResource === -1 ||
            indexCurrentResource + 1 > state.dataset.length
            ? null
            : state.dataset[indexCurrentResource + 1];
    },
    ...createGlobalSelectors((state) => state.facet, facetSelectors),
};

const {
    actionTypes: facetActionTypes,
    actions: facetActions,
    reducer: facetReducer,
} = createFacetReducer('SEARCH');

export { facetActions, facetActionTypes };

export const defaultState = {
    dataset: [],
    fields: {},
    sort: {
        sortBy: '',
        sortDir: 'ASC',
    },
    loading: false,
    page: null,
    total: 0,
    query: null,
    facet: facetReducer(undefined, {}),
    filters: {},
};

export default handleActions(
    {
        [combineActions(...Object.values(facetActionTypes))]: (
            state,
            action,
        ) => ({
            ...state,
            facet: facetReducer(state.facet, action),
        }),
        [SEARCH]: (state, { payload }) => ({
            ...state,
            dataset: [],
            loading: true,
            page: 0,
            total: 0,
            query: payload.query,
        }),
        [SEARCH_ANNOTATIONS]: (state, { payload: { mode, resourceUris } }) => {
            if (mode === null) {
                return {
                    ...state,
                    page: 0,
                    filters: {
                        ...state.filters,
                        annotations: null,
                        resourceUrisWithAnnotation: undefined,
                    },
                };
            }
            if (mode === 'my-annotations') {
                return {
                    ...state,
                    page: 0,
                    filters: {
                        ...state.filters,
                        annotations: mode,
                        resourceUrisWithAnnotation: resourceUris,
                    },
                };
            }

            if (mode === 'not-my-annotations') {
                return {
                    ...state,
                    page: 0,
                    filters: {
                        ...state.filters,
                        annotations: mode,
                        resourceUrisWithAnnotation: resourceUris,
                    },
                };
            }

            if (mode === 'annotated') {
                return {
                    ...state,
                    page: 0,
                    filters: {
                        ...state.filters,
                        annotations: mode,
                        resourceUrisWithAnnotation: undefined,
                    },
                };
            }

            if (mode === 'not-annotated') {
                return {
                    ...state,
                    page: 0,
                    filters: {
                        ...state.filters,
                        annotations: mode,
                        resourceUrisWithAnnotation: undefined,
                    },
                };
            }

            return state;
        },
        [SEARCH_ANNOTATION_ADDED]: (state, { payload: { resourceUri } }) => {
            if (
                state.filters.resourceUrisWithAnnotation &&
                !state.filters.resourceUrisWithAnnotation.includes(resourceUri)
            ) {
                return {
                    ...state,
                    filters: {
                        ...state.filters,
                        resourceUrisWithAnnotation:
                            state.filters.resourceUrisWithAnnotation.concat(
                                resourceUri,
                            ),
                    },
                };
            }
            return state;
        },
        [SEARCH_SORT]: (state, { payload: { sortBy: nextSortBy } }) => {
            const { sortBy, sortDir } = state.sort;

            const nextSortDir =
                sortBy === nextSortBy && sortDir === 'ASC' ? 'DESC' : 'ASC';

            return {
                ...state,
                page: 0,
                sort: {
                    sortBy: nextSortBy,
                    sortDir: nextSortDir,
                },
            };
        },
        [SEARCH_SORT_INIT]: (state, { payload: { sortBy, sortDir } }) => {
            return {
                ...state,
                page: 0,
                sort: {
                    sortBy,
                    sortDir,
                },
            };
        },
        [combineActions(SEARCH_RESULTS, SEARCH_ERROR)]: (
            state,
            { payload },
        ) => ({
            ...state,
            loading: false,
            dataset: payload.dataset || [],
            page: payload.page || 0,
            total: payload.total || 0,
            fullTotal: payload.fullTotal || 0,
            fields: payload.fields || state.fields,
        }),
        [SEARCH_LOAD_MORE]: (state) => ({
            ...state,
            loading: true,
        }),
        [combineActions(SEARCH_LOAD_MORE_SUCCESS, SEARCH_LOAD_MORE_ERROR)]: (
            state,
            { payload },
        ) => ({
            ...state,
            loading: false,
            dataset: [...state.dataset, ...(payload.dataset || [])],
            page: payload.page || state.page + 1,
            total: payload.total || state.total,
        }),
    },
    defaultState,
);
