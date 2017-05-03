import { call, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    LOAD_FIELD,
    loadFieldError,
    loadFieldSuccess,
} from '../';

import { UPLOAD_SUCCESS } from '../../admin/upload';

import { IMPORT_FIELDS_SUCCESS } from '../../admin/import';

import { fromUser } from '../../sharedSelectors';

export function* handleLoadField() {
    const request = yield select(fromUser.getLoadFieldRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFieldError(error));
    }

    return yield put(loadFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest([LOAD_FIELD, IMPORT_FIELDS_SUCCESS, UPLOAD_SUCCESS], handleLoadField);
}
