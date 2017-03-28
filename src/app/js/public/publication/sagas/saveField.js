import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    SAVE_FIELD,
    saveFieldSuccess,
    saveFieldError,
    getFieldFormData,
    loadPublication,
} from '../';
import { getUpdateFieldRequest } from '../../../fetch';
import fetchSaga from '../../../lib/fetchSaga';

export function* handleSaveFieldRequest() {
    const formData = yield select(getFieldFormData);
    const request = yield select(getUpdateFieldRequest, formData);

    const { error, response: field } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }

    yield put(saveFieldSuccess(field));
    yield put(loadPublication());
}

export default function* watchsaveFieldRequest() {
    yield takeLatest(SAVE_FIELD, handleSaveFieldRequest);
}
