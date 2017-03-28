import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CONFIGURE_FIELD,
    configureFieldSuccess,
    configureFieldError,
    getFieldFormData,
} from '../';
import { getUpdateFieldRequest } from '../../../fetch';
import fetchSaga from '../../../lib/fetchSaga';

export function* handleSaveFieldRequest() {
    const formData = yield select(getFieldFormData);
    const request = yield select(getUpdateFieldRequest, formData);

    const { error, response: field } = yield call(fetchSaga, request);

    if (error) {
        yield put(configureFieldError(error));
        return;
    }

    yield put(configureFieldSuccess(field));
}

export default function* watchsaveFieldRequest() {
    yield takeLatest(CONFIGURE_FIELD, handleSaveFieldRequest);
}
