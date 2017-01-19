import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import { SIGN_IN, SIGN_IN_FORM_NAME } from './reducers';

export const handleSignInRequest = function* (action) {
    console.log({ action });
    yield put(startSubmit(SIGN_IN_FORM_NAME));

    yield put(stopSubmit(SIGN_IN_FORM_NAME));
};

export const watchSignInRequest = function* (action) {
    yield takeLatest(SIGN_IN, handleSignInRequest)
};

export default function* () {
    yield fork(watchSignInRequest);
}
