import { call, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    LOAD_FIELD,
    loadFieldError,
    loadFieldSuccess,
} from '../';

import {
    UPLOAD_FILE_SUCCESS,
} from '../../upload';

import { IMPORT_FIELDS_SUCCESS } from '../../import';

import { getLoadFieldRequest } from '../../../fetch/';

export function* handleLoadField() {
    const request = yield select(getLoadFieldRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFieldError(error));
    }

    return yield put(loadFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest([LOAD_FIELD, IMPORT_FIELDS_SUCCESS, UPLOAD_FILE_SUCCESS], handleLoadField);
}
