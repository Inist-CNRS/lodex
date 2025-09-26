import {
    call,
    fork,
    put,
    select,
    take,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';

import {
    facetActions,
    facetActionTypes,
    initSort,
    loadMoreFailed,
    loadMoreSucceed,
    SEARCH,
    SEARCH_LOAD_MORE,
    SEARCH_ANNOTATIONS,
    SEARCH_SORT,
    SEARCH_SORT_INIT,
    searchFailed,
    searchSucceed,
    SEARCH_VISITED,
    TRIGGER_SEARCH,
} from './reducer';

import { LOAD_PUBLICATION_SUCCESS } from '../../fields';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromFields, fromUser } from '../../sharedSelectors';
import facetSagasFactory from '../facet/sagas';
import { LOAD_RESOURCE_SUCCESS } from '../resource';
import { fromResource, fromSearch } from '../selectors';
// @ts-expect-error TS7016
import { uniq } from 'lodash';
import { getVisitedUris } from '../resource/useRememberVisit';

const PER_PAGE = 10;

export const getAnnotationsFilter = ({
    // @ts-expect-error TS7031
    annotationsFilter,
    // @ts-expect-error TS7031
    resourceUrisWithAnnotation,
}) => {
    if (!annotationsFilter) {
        return {};
    }

    return {
        ...(annotationsFilter === 'my-annotations'
            ? { resourceUris: resourceUrisWithAnnotation }
            : {}),
        ...(annotationsFilter === 'not-my-annotations'
            ? { excludedResourceUris: resourceUrisWithAnnotation }
            : {}),
        ...(['annotated', 'not-annotated'].includes(annotationsFilter)
            ? { annotated: annotationsFilter === 'annotated' }
            : {}),
    };
};

export const addVisitedFilter = ({
    // @ts-expect-error TS7031
    filters,
    // @ts-expect-error TS7031
    visitedFilter,
    // @ts-expect-error TS7031
    visitedResourceUris,
}) => {
    switch (visitedFilter) {
        case 'visited':
            // If we already have a resourceUris filter we need to set the filter as the intersection of the two
            if (filters.resourceUris) {
                return {
                    ...filters,
                    // @ts-expect-error TS7006
                    resourceUris: filters.resourceUris.filter((uri) =>
                        visitedResourceUris.includes(uri),
                    ),
                };
            }

            return {
                ...filters,
                resourceUris: visitedResourceUris,
            };
        case 'not-visited':
            if (filters.excludedResourceUris) {
                return {
                    ...filters,
                    excludedResourceUris: uniq(
                        filters.excludedResourceUris.concat(
                            visitedResourceUris,
                        ),
                    ),
                };
            }
            return {
                ...filters,
                excludedResourceUris: visitedResourceUris,
            };
        default:
            return filters;
    }
};

export const doSearchRequest = function* (page = 0) {
    // @ts-expect-error TS7057
    const query = yield select(fromSearch.getQuery);
    // @ts-expect-error TS7057
    const annotationsFilter = yield select(fromSearch.getAnnotationsFilter);
    // @ts-expect-error TS7057
    const visitedFilter = yield select(fromSearch.getVisitedFilter);

    // @ts-expect-error TS7057
    const resourceUrisWithAnnotation = yield select(
        // @ts-expect-error TS2339
        fromSearch.getResourceUrisWithAnnotationFilter,
    );

    // @ts-expect-error TS7057
    const visitedResourceUris = yield call(getVisitedUris);

    // @ts-expect-error TS7057
    const sort = yield select(fromSearch.getSort);
    // @ts-expect-error TS7057
    let facets = yield select(fromSearch.getAppliedFacets);
    facets = Object.keys(facets).reduce((acc, facetName) => {
        // @ts-expect-error TS7053
        acc[facetName] = facets[facetName].map((facetValue) => facetValue.id);
        return acc;
    }, {});
    // @ts-expect-error TS7057
    const invertedFacets = yield select(fromSearch.getInvertedFacetKeys);

    // @ts-expect-error TS7057
    const filtersWithAnnotations = yield call(getAnnotationsFilter, {
        annotationsFilter,
        resourceUrisWithAnnotation,
    });

    // @ts-expect-error TS7057
    const filters = yield call(addVisitedFilter, {
        filters: filtersWithAnnotations,
        visitedFilter,
        visitedResourceUris,
    });

    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: query || '',
        sort,
        perPage: PER_PAGE,
        page,
        facets,
        invertedFacets,
        filters,
    });

    // @ts-expect-error TS7057
    return yield call(fetchSaga, request);
};

const handleSearch = function* () {
    // @ts-expect-error TS7057
    const fieldsNumber = yield select(fromFields.getNbColumns);

    if (fieldsNumber === 0) {
        // Fields aren't loaded yet. Wait for them.
        yield take(LOAD_PUBLICATION_SUCCESS);
    }

    const { error, response } = yield doSearchRequest();

    if (error) {
        yield put(searchFailed({ error }));
        return;
    }

    const fields = {
        uri: 'uri',
        // @ts-expect-error TS7057
        title: yield select(fromFields.getResourceTitleFieldName),
        // @ts-expect-error TS7057
        description: yield select(fromFields.getResourceDescriptionFieldName),
        // @ts-expect-error TS7057
        detail1: yield select(fromFields.getResourceDetail1FieldName),
        // @ts-expect-error TS7057
        detail2: yield select(fromFields.getResourceDetail2FieldName),
        // @ts-expect-error TS7057
        detail3: yield select(fromFields.getResourceDetail3FieldName),
    };

    yield put(
        searchSucceed({
            dataset: response.data,
            fields,
            total: response.total,
            fullTotal: response.fullTotal,
        }),
    );
};

const handleLoadMore = function* () {
    // @ts-expect-error TS7057
    const currentPage = yield select(fromSearch.getPage);
    const page = currentPage + 1;

    const { error, response } = yield doSearchRequest(page);

    if (error) {
        yield put(loadMoreFailed({ error }));
        return;
    }

    yield put(
        loadMoreSucceed({
            dataset: response.data,
            page,
            total: response.total,
        }),
    );
};

const handleLoadNextResource = function* () {
    // @ts-expect-error TS7057
    const total = yield select(fromSearch.getTotal);
    // @ts-expect-error TS7057
    const results = yield select(fromSearch.getDataset);

    if (results.length >= total) {
        return;
    }

    // @ts-expect-error TS7057
    const currentResource = yield select(fromResource.getResourceLastVersion);
    const indexCurrentResource = results.findIndex(
        // @ts-expect-error TS7006
        (resource) => resource.uri === currentResource?.uri,
    );

    if (indexCurrentResource < results.length - 1) {
        return;
    }
    yield handleLoadMore();
};

const facetSagas = facetSagasFactory({
    actionTypes: facetActionTypes,
    actions: facetActions,
    selectors: fromSearch,
});

function* initSortSagas() {
    // @ts-expect-error TS7057
    const sortBy = yield select(fromFields.getResourceSortFieldName);
    // @ts-expect-error TS7057
    const sortDir = yield select(fromFields.getResourceSortDir);
    if (!sortBy) {
        return;
    }

    yield put(initSort({ sortBy, sortDir }));
}

export default function* () {
    yield fork(initSortSagas);

    yield takeLatest(
        [
            SEARCH,
            SEARCH_ANNOTATIONS,
            SEARCH_VISITED,
            SEARCH_SORT,
            SEARCH_SORT_INIT,
            TRIGGER_SEARCH,
            facetActionTypes.TOGGLE_FACET_VALUE,
            facetActionTypes.SET_ALL_VALUE_FOR_FACET,
            facetActionTypes.INVERT_FACET,
            facetActionTypes.CLEAR_FACET,
            facetActionTypes.SET_FACETS,
        ],
        handleSearch,
    );
    yield takeEvery([SEARCH_LOAD_MORE], handleLoadMore);
    yield takeEvery([LOAD_RESOURCE_SUCCESS], handleLoadNextResource);
    yield fork(facetSagas);
}
