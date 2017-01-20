import { takeLatest } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { LOGIN, LOGIN_FORM_NAME, loginSuccess } from './';

export const fetchLogin = credentials => fetch('/api/login', {
    body: JSON.stringify(credentials),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
}).then((response) => {
    if (response.status >= 200 && response.status < 300) return response;
    throw new Error(response.statusText);
}).then(response => response.json());

export function* handleLoginRequest({ payload: credentials }) {
    yield put(startSubmit(LOGIN_FORM_NAME));

    try {
        const { token } = yield call(fetchLogin, credentials);
        yield put(loginSuccess(token));
        yield put(stopSubmit(LOGIN_FORM_NAME));
    } catch (error) {
        yield put(stopSubmit(LOGIN_FORM_NAME, { _error: error.message }));
    }
}

export function* watchLoginRequest() {
    yield takeLatest(LOGIN, handleLoginRequest);
}

export default function* () {
    yield fork(watchLoginRequest);
}
