import { take, put, select, call, takeEvery, fork } from 'redux-saga/effects';

import {
    loadMoreFailed,
    loadMoreSucceed,
    SEARCH_LOAD_MORE,
    SEARCH,
    SEARCH_SORT,
    searchFailed,
    searchSucceed,
    facetActionTypes,
    facetActions,
} from './reducer';

import { fromSearch } from '../selectors';
import { LOAD_PUBLICATION_SUCCESS } from '../../fields';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import facetSagasFactory from '../facet/sagas';

const doSearchRequest = function*(page = 0) {
    const query = yield select(fromSearch.getQuery);
    const sort = yield select(fromSearch.getSort);
    const facets = yield select(fromSearch.getAppliedFacets);
    const invertedFacets = yield select(fromSearch.getInvertedFacets);

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: query || '',
        sort,
        perPage: 10,
        page,
        facets,
        invertedFacets,
    });

    return yield call(fetchSaga, request);
};

const handleSearch = function*() {
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
    };

    yield put(
        searchSucceed({
            dataset: response.data,
            fields,
            total: response.total,
        }),
    );
};

const handleLoadMore = function*() {
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

const facetSagas = facetSagasFactory({
    actionTypes: facetActionTypes,
    actions: facetActions,
    selectors: fromSearch,
});

export default function*() {
    yield takeEvery(
        [
            SEARCH,
            SEARCH_SORT,
            facetActionTypes.TOGGLE_FACET_VALUE,
            facetActionTypes.INVERT_FACET,
            facetActionTypes.CLEAR_FACET,
        ],
        handleSearch,
    );
    yield takeEvery(SEARCH_LOAD_MORE, handleLoadMore);
    yield fork(facetSagas);
}
