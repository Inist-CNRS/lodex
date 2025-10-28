import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadPrecomputedSuccess,
    loadPrecomputedError,
    loadPrecomputed,
    LOAD_PRECOMPUTED,
    LAUNCH_PRECOMPUTED,
} from './index';

import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';
import type { SagaIterator } from 'redux-saga';

export function* handleLoadPrecomputedRequest(): SagaIterator {
    const request = yield select(fromUser.getLoadPrecomputedRequest);
    const {
        error,
        response,
    }: {
        error: Error;
        response: {
            precomputed: Array<{ _id: string; status: string }>;
        };
    } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPrecomputedError(error));
    }

    return yield put(loadPrecomputedSuccess(response));
}

export function* handleLaunchPrecomputed({
    payload: { action, id },
}: {
    payload: { action: string; id: string };
}): SagaIterator {
    const precomputedActionRequest = yield select(
        fromUser.getPrecomputedActionRequest,
        {
            action: action || 'launch',
            id: id,
        },
    );

    yield call(fetchSaga, precomputedActionRequest);

    return yield put(loadPrecomputed());
}

export function* watchLoadPrecomputedRequest(): SagaIterator {
    yield takeLatest([LOAD_PRECOMPUTED], handleLoadPrecomputedRequest);
}

export function* watchLaunchPrecomputed(): SagaIterator {
    // @ts-expect-error TS2769
    yield takeLatest(LAUNCH_PRECOMPUTED, handleLaunchPrecomputed);
}

export default function* (): SagaIterator {
    yield fork(watchLoadPrecomputedRequest);
    yield fork(watchLaunchPrecomputed);
}
