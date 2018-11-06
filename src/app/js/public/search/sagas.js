import { take, put, select, call, takeEvery } from 'redux-saga/effects';

import {
    loadMoreFailed,
    loadMoreSucceed,
    SEARCH_LOAD_MORE,
    SEARCH,
    searchFailed,
    searchSucceed,
} from './reducer';
import { fromSearch } from '../selectors';
import { LOAD_PUBLICATION_SUCCESS } from '../../fields';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

const doSearchRequest = function*(payload, page = 0) {
    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: payload ? payload.query : '',
        perPage: 10,
        page,
    });

    return yield call(fetchSaga, request);
};

const handleSearch = function*({ payload }) {
    const fieldsNumber = yield select(fromFields.getNbColumns);

    if (fieldsNumber === 0) {
        // Fields aren't loaded yet. Wait for them.
        yield take(LOAD_PUBLICATION_SUCCESS);
    }

    const { error, response } = yield doSearchRequest(payload);

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
    const query = yield select(fromSearch.getQuery);
    const page = currentPage + 1;

    const { error, response } = yield doSearchRequest({ query }, page);

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

export default function*() {
    yield takeEvery(SEARCH, handleSearch);
    yield takeEvery(SEARCH_LOAD_MORE, handleLoadMore);
}
