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
    SEARCH_MY_ANNOTATIONS,
    SEARCH_SORT,
    SEARCH_SORT_INIT,
    searchFailed,
    searchSucceed,
} from './reducer';

import { LOAD_PUBLICATION_SUCCESS } from '../../fields';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromFields, fromUser } from '../../sharedSelectors';
import facetSagasFactory from '../facet/sagas';
import { LOAD_RESOURCE_SUCCESS } from '../resource';
import { fromResource, fromSearch } from '../selectors';
import { getAnnotatedResourceUris } from '../../annotation/annotationStorage';

const PER_PAGE = 10;

export const doSearchRequest = function* (page = 0) {
    const query = yield select(fromSearch.getQuery);
    const isMyAnnotations = yield select(fromSearch.getMyAnnotationsFilter);
    const sort = yield select(fromSearch.getSort);
    let facets = yield select(fromSearch.getAppliedFacets);
    facets = Object.keys(facets).reduce((acc, facetName) => {
        acc[facetName] = facets[facetName].map((facetValue) => facetValue.id);
        return acc;
    }, {});
    const invertedFacets = yield select(fromSearch.getInvertedFacetKeys);

    const resourceUris = yield call(getAnnotatedResourceUris);

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: query || '',
        sort,
        perPage: PER_PAGE,
        page,
        facets,
        invertedFacets,
        filters: {
            ...(isMyAnnotations === 'my-annotations' ? { resourceUris } : {}),
            ...(isMyAnnotations === 'not-my-annotations'
                ? { excludedResourceUris: resourceUris }
                : {}),
        },
    });

    return yield call(fetchSaga, request);
};

const handleSearch = function* () {
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
        title: yield select(fromFields.getResourceTitleFieldName),
        description: yield select(fromFields.getResourceDescriptionFieldName),
        detail1: yield select(fromFields.getResourceDetail1FieldName),
        detail2: yield select(fromFields.getResourceDetail2FieldName),
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
    const total = yield select(fromSearch.getTotal);
    const results = yield select(fromSearch.getDataset);

    if (results.length >= total) {
        return;
    }

    const currentResource = yield select(fromResource.getResourceLastVersion);
    const indexCurrentResource = results.findIndex(
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
    const sortBy = yield select(fromFields.getResourceSortFieldName);
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
            SEARCH_MY_ANNOTATIONS,
            SEARCH_SORT,
            SEARCH_SORT_INIT,
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
