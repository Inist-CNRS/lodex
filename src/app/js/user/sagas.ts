// @ts-expect-error TS7016
import qs from 'qs';
import { call, put, select, takeEvery, fork } from 'redux-saga/effects';
// @ts-expect-error TS7016
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'redux-first-history';

import { LOGIN, LOGOUT, SIGNOUT, LOGIN_FORM_NAME, loginSuccess } from './';
import { fromUser, getCurrentSearch } from '../sharedSelectors';
import fetchSaga from '../lib/sagas/fetchSaga';

// @ts-expect-error TS7031
export function* handleLoginRequest({ payload: credentials }) {
    yield put(startSubmit(LOGIN_FORM_NAME));
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoginRequest, credentials);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(
            stopSubmit(LOGIN_FORM_NAME, { _error: error.message }),
        );
    }

    yield put(loginSuccess(response));

    // @ts-expect-error TS7057
    const queryString = yield select(getCurrentSearch);
    const { page } =
        (queryString && qs.parse(queryString.replace('?', ''))) || {};

    yield put(push(page && page.startsWith('/') ? page : '/'));

    // @ts-expect-error TS7057
    return yield put(stopSubmit(LOGIN_FORM_NAME));
}

export function* handleLogoutRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLogoutRequest);
    yield call(fetchSaga, request);
}

export function* watchLoginRequest() {
    // @ts-expect-error TS2769
    yield takeEvery(LOGIN, handleLoginRequest);
}

export function* watchLogoutRequest() {
    yield takeEvery([LOGOUT, SIGNOUT], handleLogoutRequest);
}

export default function* () {
    yield fork(watchLoginRequest);
    yield fork(watchLogoutRequest);
}
