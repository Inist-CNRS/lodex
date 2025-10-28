import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    changeFieldStatusSuccess,
    changeFieldStatusError,
    CHANGE_FIELD_STATUS,
} from '../index';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../../src/app/js/lib/sagas/fetchSaga';

export function* handleChangeFieldStatus({
    // @ts-expect-error TS7031
    payload: { uri, field, status, prevStatus },
}) {
    // @ts-expect-error TS7057
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
    // @ts-expect-error TS2769
    yield takeLatest(CHANGE_FIELD_STATUS, handleChangeFieldStatus);
}
