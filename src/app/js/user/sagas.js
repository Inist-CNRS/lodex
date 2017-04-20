import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';

import { LOGIN, LOGIN_FORM_NAME, loginSuccess } from './';
import { getLoginRequest } from '../fetch';
import fetchSaga from '../lib/sagas/fetchSaga';

export function* handleLoginRequest({ payload: { previousState, ...credentials } }) {
    yield put(startSubmit(LOGIN_FORM_NAME));
    const request = yield select(getLoginRequest, credentials);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(stopSubmit(LOGIN_FORM_NAME, { _error: error.message }));
    }

    yield put(loginSuccess(response.token));

    if (previousState) {
        yield put(push(previousState));
    }

    return yield put(stopSubmit(LOGIN_FORM_NAME));
}

export function* watchLoginRequest() {
    yield takeEvery(LOGIN, handleLoginRequest);
}

export default function* () {
    yield fork(watchLoginRequest);
}
