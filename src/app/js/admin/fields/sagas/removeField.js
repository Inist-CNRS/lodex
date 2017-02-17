import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    REMOVE_FIELD,
    getFieldFormData,
    removeFieldError,
    removeFieldSuccess,
} from '../';

import fetchSaga from '../../../lib/fetchSaga';
import { getRemoveFieldRequest } from '../../../fetch/';

export function* handleRemoveField() {
    const fieldData = yield select(getFieldFormData);
    const request = yield select(getRemoveFieldRequest, fieldData);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(removeFieldError(error));
    } else {
        yield put(removeFieldSuccess(response));
    }
}

export default function* watchLoadField() {
    yield takeLatest([REMOVE_FIELD], handleRemoveField);
}
