import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
    REMOVE_FIELD,
    getFieldFormData,
    getRemoveFieldRequest,
    removeFieldError,
    removeFieldSuccess,
} from '../';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleRemoveField({ meta: { form } }) {
    if (form !== 'field') {
        return;
    }
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
