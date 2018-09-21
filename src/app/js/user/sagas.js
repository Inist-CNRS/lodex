import { call, put, select, takeEvery } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'connected-react-router';

import { LOGIN, LOGIN_FORM_NAME, loginSuccess } from './';
import { fromUser } from '../sharedSelectors';
import fetchSaga from '../lib/sagas/fetchSaga';

export function* handleLoginRequest({
    payload: { previousState, ...credentials },
}) {
    yield put(startSubmit(LOGIN_FORM_NAME));
    const request = yield select(fromUser.getLoginRequest, credentials);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(
            stopSubmit(LOGIN_FORM_NAME, { _error: error.message }),
        );
    }

    yield put(loginSuccess(response));

    if (previousState) {
        yield put(push(previousState));
    }

    return yield put(stopSubmit(LOGIN_FORM_NAME));
}

export default function* watchLoginRequest() {
    yield takeEvery(LOGIN, handleLoginRequest);
}
