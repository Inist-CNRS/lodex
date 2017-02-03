import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
    ADD_FIELD,
    getLastField,
    getCreateFieldRequest,
    addFieldError,
    addFieldSuccess,
} from '../';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleAddField() {
    const lastAddedItem = yield select(getLastField);
    const request = yield select(getCreateFieldRequest, lastAddedItem);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(addFieldError(error));
    } else {
        yield put(addFieldSuccess(response));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleAddField);
}
