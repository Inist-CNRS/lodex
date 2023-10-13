import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadPrecomputedSuccess,
    loadPrecomputedError,
    loadPrecomputed,
    LOAD_PRECOMPUTED,
    LAUNCH_PRECOMPUTED,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadPrecomputedRequest() {
    const request = yield select(fromUser.getLoadPrecomputedRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPrecomputedError(error));
    }

    return yield put(loadPrecomputedSuccess(response));
}

export function* handleLaunchPrecomputed({ payload: precomputed }) {
    const precomputedActionRequest = yield select(
        fromUser.getPrecomputedActionRequest,
        {
            action: precomputed.action || 'launch',
            id: precomputed.id,
        },
    );

    yield call(fetchSaga, precomputedActionRequest);

    return yield put(loadPrecomputed());
}

export function* watchLoadPrecomputedRequest() {
    yield takeLatest([LOAD_PRECOMPUTED], handleLoadPrecomputedRequest);
}

export function* watchLaunchPrecomputed() {
    yield takeLatest(LAUNCH_PRECOMPUTED, handleLaunchPrecomputed);
}

export default function*() {
    yield fork(watchLoadPrecomputedRequest);
    yield fork(watchLaunchPrecomputed);
}
