import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    CLEAR_DATASET,
    CLEAR_PUBLISHED,
    clearPublishedError,
    clearPublishedSuccess,
    clearDatasetError,
    clearDatasetSuccess,
} from './index';

import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';

export function* handleClearDatasetRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getClearDatasetRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error || response.status !== 'success') {
        // @ts-expect-error TS7057
        return yield put(clearDatasetError(error));
    }

    // @ts-expect-error TS7057
    return yield put(clearDatasetSuccess());
}

export function* handleClearPublishedRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getClearPublishedRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error || response.status !== 'success') {
        // @ts-expect-error TS7057
        return yield put(clearPublishedError(error));
    }

    // @ts-expect-error TS7057
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
