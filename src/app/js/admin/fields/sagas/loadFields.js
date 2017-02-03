import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    LOAD_FIELD,
    getLoadFieldRequest,
    loadFieldError,
    loadFieldSuccess,
} from '../';

export function* handleLoadField() {
    const request = yield select(getLoadFieldRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFieldError(error));
    }

    return yield put(loadFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest([LOAD_FIELD], handleLoadField);
}
