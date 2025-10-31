import { call, select, takeEvery, fork } from 'redux-saga/effects';

import { LOGOUT, SIGNOUT } from './reducer';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

export function* handleLogoutRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLogoutRequest);
    yield call(fetchSaga, request);
}

export function* watchLogoutRequest() {
    yield takeEvery([LOGOUT, SIGNOUT], handleLogoutRequest);
}

export default function* () {
    yield fork(watchLogoutRequest);
}
