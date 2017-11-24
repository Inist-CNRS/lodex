import { call, put, select, takeLatest } from 'redux-saga/effects';

import { REMOVE_FIELD, removeFieldError, removeFieldSuccess } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleRemoveField({ payload: name }) {
    const field = yield select(fromFields.getFieldByName, name);
    const request = yield select(fromUser.getRemoveFieldRequest, field);

    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(removeFieldError(error));
    } else {
        yield put(removeFieldSuccess(field));
    }
}

export default function* watchLoadField() {
    yield takeLatest([REMOVE_FIELD], handleRemoveField);
}
