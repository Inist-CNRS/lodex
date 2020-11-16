import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import { LOAD_RESOURCES, loadResourcesSuccess, loadResourcesError } from '.';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromUser } from '../sharedSelectors';

export function* handleLoadResourcesRequest() {
    const request = yield select(fromUser.getLoadResourcesRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadResourcesError(error));
    }

    return yield put(loadResourcesSuccess(response));
}

export function* watchLoadResourcesRequest() {
    yield takeLatest(LOAD_RESOURCES, handleLoadResourcesRequest);
}

export default function*() {
    yield fork(watchLoadResourcesRequest);
}
