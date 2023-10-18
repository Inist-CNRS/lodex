import qs from 'qs';
import { call, put, select, takeEvery, fork } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'connected-react-router';

import { LOGIN, LOGOUT, SIGNOUT, LOGIN_FORM_NAME, loginSuccess } from './';
import { fromUser, getCurrentSearch } from '../sharedSelectors';
import fetchSaga from '../lib/sagas/fetchSaga';

export function* handleLoginRequest({ payload: credentials }) {
    yield put(startSubmit(LOGIN_FORM_NAME));
    const request = yield select(fromUser.getLoginRequest, credentials);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(
            stopSubmit(LOGIN_FORM_NAME, { _error: error.message }),
        );
    }

    yield put(loginSuccess(response));

    const queryString = yield select(getCurrentSearch);
    const { page } =
        (queryString && qs.parse(queryString.replace('?', ''))) || {};

    yield put(push(page && page.startsWith('/') ? page : '/'));

    return yield put(stopSubmit(LOGIN_FORM_NAME));
}

export function* handleLogoutRequest() {
    const request = yield select(fromUser.getLogoutRequest);
    yield call(fetchSaga, request);
}

export function* watchLoginRequest() {
    yield takeEvery(LOGIN, handleLoginRequest);
}

export function* watchLogoutRequest() {
    yield takeEvery([LOGOUT, SIGNOUT], handleLogoutRequest);
}

export default function*() {
    yield fork(watchLoginRequest);
    yield fork(watchLogoutRequest);
}
