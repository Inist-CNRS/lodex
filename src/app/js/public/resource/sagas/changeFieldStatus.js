import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    changeFieldStatusSuccess,
    changeFieldStatusError,
    CHANGE_FIELD_STATUS,
} from '../';
import { getChangeFieldStatusRequest } from '../../../fetch';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleChangeFieldStatus({ payload: { uri, field, status, prevStatus } }) {
    const request = yield select(getChangeFieldStatusRequest, {
        uri,
        field,
        status,
    });
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        yield put(changeFieldStatusError(error, prevStatus));
        return;
    }

    yield put(changeFieldStatusSuccess(response));
}

export default function* watchAddFieldToResource() {
    yield takeLatest(CHANGE_FIELD_STATUS, handleChangeFieldStatus);
}
