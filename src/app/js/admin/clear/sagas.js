import { call, put, select, fork, takeLatest } from 'redux-saga/effects';

import {
    CLEAR_DATASET,
    CLEAR_PUBLISHED,
    clearPublishedError,
    clearPublishedSuccess,
    clearDatasetError,
    clearDatasetSuccess,
} from './';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleClearDatasetRequest() {
    const request = yield select(fromUser.getClearDatasetRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error || response.status !== 'success') {
        return yield put(clearDatasetError(error));
    }

    return yield put(clearDatasetSuccess());
}

export function* handleClearPublishedRequest() {
    const request = yield select(fromUser.getClearPublishedRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error || response.status !== 'success') {
        return yield put(clearPublishedError(error));
    }

    return yield put(clearPublishedSuccess());
}

export function* watchClearDatasetRequest() {
    yield takeLatest(CLEAR_DATASET, handleClearDatasetRequest);
}

export function* watchClearPublishedRequest() {
    yield takeLatest(CLEAR_PUBLISHED, handleClearPublishedRequest);
}

export default function* () {
    yield fork(watchClearDatasetRequest);
    yield fork(watchClearPublishedRequest);
}
