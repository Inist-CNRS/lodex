import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    getFieldFormData,
    saveFieldError,
    saveFieldSuccess,
    SAVE_FIELD,
} from '../';
import { getSaveFieldRequest } from '../../../fetch';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleSaveField() {
    const fieldData = yield select(getFieldFormData);

    const request = yield select(getSaveFieldRequest, fieldData);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }

    yield put(saveFieldSuccess(response));
}

export default function* watchSaveField() {
    yield takeLatest([
        SAVE_FIELD,
    ], handleSaveField);
}
