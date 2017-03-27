import { call, put, select, takeLatest } from 'redux-saga/effects';
import { destroy } from 'redux-form';

import {
    getFieldFormData,
    saveFieldError,
    saveFieldSuccess,
    FIELD_FORM_NAME,
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
    yield put(destroy(FIELD_FORM_NAME));
}

export default function* watchSaveField() {
    yield takeLatest([
        SAVE_FIELD,
    ], handleSaveField);
}
