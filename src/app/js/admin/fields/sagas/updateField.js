import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    getFieldFormData,
    updateFieldError,
    updateFieldSuccess,
    SAVE_FIELD,
} from '../';
import { getSaveFieldRequest } from '../../../fetch';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleUpdateField() {
    const fieldData = yield select(getFieldFormData);

    const request = yield select(getSaveFieldRequest, fieldData);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(updateFieldError(error));
        return;
    }

    yield put(updateFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest([
        SAVE_FIELD,
    ], handleUpdateField);
}
