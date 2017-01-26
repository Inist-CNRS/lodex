import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import { PUBLISH, getPublishRequest, publishSuccess, publishError } from './';
import fetchSaga from '../../lib/fetchSaga';

export function* handlePublishRequest() {
    const request = yield select(getPublishRequest);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        return yield put(publishError(error));
    }

    return yield put(publishSuccess());
}

export function* watchPublishRequest() {
    yield takeLatest(PUBLISH, handlePublishRequest);
}

export default function* () {
    yield fork(watchPublishRequest);
}
