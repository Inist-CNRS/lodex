import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    changeFieldStatusSuccess,
    changeFieldStatusError,
    CHANGE_FIELD_STATUS,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleChangeFieldStatus({ payload: { uri, field, status, prevStatus } }) {
    const request = yield select(fromUser.getChangeFieldStatusRequest, {
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
