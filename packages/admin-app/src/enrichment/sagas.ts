import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
    LAUNCH_ALL_ENRICHMENT,
    LAUNCH_ENRICHMENT,
    launchAllEnrichmentCompleted,
    launchAllEnrichmentError,
    launchAllEnrichmentStarted,
    LOAD_ENRICHMENTS,
    loadEnrichments,
    loadEnrichmentsError,
    loadEnrichmentsSuccess,
    RETRY_ENRICHMENT,
} from './index';

import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';

export function* handleLoadEnrichmentsRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadEnrichmentsRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadEnrichmentsError(error));
    }

    // @ts-expect-error TS7057
    return yield put(loadEnrichmentsSuccess(response));
}

// @ts-expect-error TS7031
export function* handleLaunchEnrichment({ payload: enrichment }) {
    // @ts-expect-error TS7057
    const enrichmentActionRequest = yield select(
        fromUser.getEnrichmentActionRequest,
        {
            action: enrichment.action || 'launch',
            id: enrichment.id,
        },
    );

    yield call(fetchSaga, enrichmentActionRequest);

    // @ts-expect-error TS7057
    return yield put(loadEnrichments());
}

export function* handleLaunchAllEnrichment() {
    yield put(launchAllEnrichmentStarted());

    try {
        // @ts-expect-error TS7057
        const enrichmentLaunchAllRequest = yield select(
            fromUser.getEnrichmentLaunchAllRequest,
        );

        const { error } = yield call(fetchSaga, enrichmentLaunchAllRequest);

        if (error) {
            yield put(
                launchAllEnrichmentError(
                    error.message === 'circular_dependency_error'
                        ? 'run_all_enrichment_circular_dependency'
                        : 'run_all_enrichment_failed',
                ),
            );
        }
        // @ts-expect-error TS7057
        return yield put(loadEnrichments());
    } finally {
        yield put(launchAllEnrichmentCompleted());
    }
}

// @ts-expect-error TS7031
export function* handleRetryEnrichment({ payload: { id } }) {
    // @ts-expect-error TS7057
    const enrichmentRetryRequest = yield select(
        fromUser.getEnrichmentRetryRequest,
        {
            id,
        },
    );

    yield call(fetchSaga, enrichmentRetryRequest);

    // @ts-expect-error TS7057
    return yield put(loadEnrichments());
}

export function* watchLoadEnrichmentsRequest() {
    yield takeLatest([LOAD_ENRICHMENTS], handleLoadEnrichmentsRequest);
}

export function* watchLaunchEnrichment() {
    // @ts-expect-error TS2769
    yield takeLatest(LAUNCH_ENRICHMENT, handleLaunchEnrichment);
}

export function* watchLaunchAllEnrichment() {
    yield takeLatest(LAUNCH_ALL_ENRICHMENT, handleLaunchAllEnrichment);
}
export function* watchRetryEnrichment() {
    // @ts-expect-error TS2769
    yield takeLatest(RETRY_ENRICHMENT, handleRetryEnrichment);
}

export default function* () {
    yield fork(watchLoadEnrichmentsRequest);
    yield fork(watchLaunchEnrichment);
    yield fork(watchLaunchAllEnrichment);
    yield fork(watchRetryEnrichment);
}
