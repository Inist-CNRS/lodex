import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    getFieldFormData,
    updateFieldError,
    updateFieldSuccess,
    SAVE_FIELD,
} from '../';
import { getUpdateFieldRequest } from '../../../fetch';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleUpdateField() {
    const fieldData = yield select(getFieldFormData);

    const request = yield select(getUpdateFieldRequest, fieldData);
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
