import { combineActions, createAction, handleActions } from 'redux-actions';

import { createGlobalSelectors } from '@lodex/frontend-common/utils/selectors';
import createFacetReducer from '../facet';
import facetSelectors from '../facet/selectors';

export const SEARCH = 'SEARCH';
export const SEARCH_ANNOTATIONS = 'SEARCH_ANNOTATIONS';
export const SEARCH_VISITED = 'SEARCH_VISITED';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const SEARCH_LOAD_MORE = 'SEARCH_LOAD_MORE';
export const SEARCH_LOAD_MORE_SUCCESS = 'SEARCH_LOAD_MORE_SUCCESS';
export const SEARCH_LOAD_MORE_ERROR = 'SEARCH_LOAD_MORE_ERROR';

export const TRIGGER_SEARCH = 'TRIGGER_SEARCH';

export const SEARCH_SORT = 'SEARCH_SORT';
export const SEARCH_SORT_INIT = 'SEARCH_SORT_INIT';

export const SEARCH_NEW_RESOURCE_ANNOTATED = 'SEARCH_NEW_RESOURCE_ANNOTATED';

export const search = createAction(SEARCH);
export const searchAnnotations = createAction(SEARCH_ANNOTATIONS);
export const searchVisited = createAction(SEARCH_VISITED);
export const searchSucceed = createAction(SEARCH_RESULTS);
export const searchFailed = createAction(SEARCH_ERROR);
export const triggerSearch = createAction(TRIGGER_SEARCH);
export const newResourceAnnotated = createAction(SEARCH_NEW_RESOURCE_ANNOTATED);

export const sort = createAction(SEARCH_SORT);
export const initSort = createAction(SEARCH_SORT_INIT);

export const loadMore = createAction(SEARCH_LOAD_MORE);
export const loadMoreSucceed = createAction(SEARCH_LOAD_MORE_SUCCESS);
export const loadMoreFailed = createAction(SEARCH_LOAD_MORE_ERROR);

export const fromSearch = {
    // @ts-expect-error TS7006
    isLoading: (state) => state.loading,
    // @ts-expect-error TS7006
    getDataset: (state) => state.dataset,
    // @ts-expect-error TS7006
    getDatasetTotal: (state) => state.total,
    // @ts-expect-error TS7006
    getDatasetFullTotal: (state) => state.fullTotal,
    // @ts-expect-error TS7006
    getSort: (state) => state.sort,
    // @ts-expect-error TS7006
    getFieldNames: (state) => state.fields,
    // @ts-expect-error TS7006
    getPage: (state) => state.page,
    // @ts-expect-error TS7006
    getTotal: (state) => state.total,
    // @ts-expect-error TS7006
    getQuery: (state) => state.query,
    // @ts-expect-error TS7006
    getResourceUrisWithAnnotationFilter: (state) =>
        state.filters?.resourceUrisWithAnnotation,
    // @ts-expect-error TS7006
    getAnnotationsFilter: (state) => state.filters?.annotations ?? null,
    // @ts-expect-error TS7006
    getVisitedFilter: (state) => state.filters?.visited ?? null,
    // @ts-expect-error TS7006
    getFilters: (state) => state.filters,
    // @ts-expect-error TS7006
    getPrevResource: (state, currentResource) => {
        if (!currentResource || !currentResource.uri) {
            return null;
        }
        const indexCurrentResource = state.dataset.findIndex(
            // @ts-expect-error TS7006
            (resource) => resource.uri === currentResource.uri,
        );
        return indexCurrentResource < 0
            ? null
            : state.dataset[indexCurrentResource - 1];
    },
    // @ts-expect-error TS7006
    getNextResource: (state, currentResource) => {
        if (!currentResource || !currentResource.uri) {
            return null;
        }
        const indexCurrentResource = state.dataset.findIndex(
            // @ts-expect-error TS7006
            (resource) => resource.uri === currentResource.uri,
        );
        return indexCurrentResource === -1 ||
            indexCurrentResource + 1 > state.dataset.length
            ? null
            : state.dataset[indexCurrentResource + 1];
    },
    // @ts-expect-error TS7006
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
    // @ts-expect-error TS7006
    facet: facetReducer(undefined, {}),
    filters: {},
};

// @ts-expect-error TS7006
export default handleActions(
    {
        // @ts-expect-error TS7006
        [combineActions(...Object.values(facetActionTypes))]: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7006
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
        // @ts-expect-error TS7006
        [SEARCH_ANNOTATIONS]: (state, { payload: { mode, resourceUris } }) => {
            switch (mode) {
                case null: {
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
                case 'my-annotations': {
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

                case 'not-my-annotations': {
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

                case 'annotated': {
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

                case 'not-annotated': {
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
                default:
                    return state;
            }
        },
        // @ts-expect-error TS7006
        [SEARCH_VISITED]: (state, { payload: { value } }) => {
            return {
                ...state,
                page: 0,
                filters: {
                    ...state.filters,
                    visited: value,
                },
            };
        },
        [SEARCH_NEW_RESOURCE_ANNOTATED]: (
            state,
            // @ts-expect-error TS7031
            { payload: { resourceUri } },
        ) => {
            if (
                // @ts-expect-error TS7006
                state.filters?.resourceUrisWithAnnotation &&
                // @ts-expect-error TS7006
                !state.filters?.resourceUrisWithAnnotation.includes(resourceUri)
            ) {
                return {
                    ...state,
                    filters: {
                        ...state.filters,
                        resourceUrisWithAnnotation:
                            // @ts-expect-error TS7006
                            state.filters.resourceUrisWithAnnotation.concat(
                                resourceUri,
                            ),
                    },
                };
            }
            return state;
        },
        // @ts-expect-error TS7006
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
        // @ts-expect-error TS7006
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
        // @ts-expect-error TS7006
        [combineActions(SEARCH_RESULTS, SEARCH_ERROR)]: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
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
        // @ts-expect-error TS7006
        [combineActions(SEARCH_LOAD_MORE_SUCCESS, SEARCH_LOAD_MORE_ERROR)]: (
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
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
