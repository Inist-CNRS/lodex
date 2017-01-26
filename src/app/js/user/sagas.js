import { takeEvery } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { LOGIN, LOGIN_FORM_NAME, getLoginRequest, loginSuccess } from './';
import fetchSaga from '../lib/fetchSaga';

export function* handleLoginRequest({ payload: credentials }) {
    yield put(startSubmit(LOGIN_FORM_NAME));
    const request = yield select(getLoginRequest, credentials);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(stopSubmit(LOGIN_FORM_NAME, { _error: error.message }));
    }

    yield put(loginSuccess(response.token));
    return yield put(stopSubmit(LOGIN_FORM_NAME));
}

export function* watchLoginRequest() {
    yield takeEvery(LOGIN, handleLoginRequest);
}

export default function* () {
    yield fork(watchLoginRequest);
}
