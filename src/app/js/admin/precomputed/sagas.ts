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
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadPrecomputedRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadPrecomputedError(error));
    }

    // @ts-expect-error TS7057
    return yield put(loadPrecomputedSuccess(response));
}

// @ts-expect-error TS7031
export function* handleLaunchPrecomputed({ payload: precomputed }) {
    // @ts-expect-error TS7057
    const precomputedActionRequest = yield select(
        // @ts-expect-error TS2339
        fromUser.getPrecomputedActionRequest,
        {
            action: precomputed.action || 'launch',
            id: precomputed.id,
        },
    );

    yield call(fetchSaga, precomputedActionRequest);

    // @ts-expect-error TS7057
    return yield put(loadPrecomputed());
}

export function* watchLoadPrecomputedRequest() {
    yield takeLatest([LOAD_PRECOMPUTED], handleLoadPrecomputedRequest);
}

export function* watchLaunchPrecomputed() {
    // @ts-expect-error TS2769
    yield takeLatest(LAUNCH_PRECOMPUTED, handleLaunchPrecomputed);
}

export default function* () {
    yield fork(watchLoadPrecomputedRequest);
    yield fork(watchLaunchPrecomputed);
}
