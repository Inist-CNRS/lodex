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
} from '.';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';

export function* handleLoadEnrichmentsRequest() {
    const request = yield select(fromUser.getLoadEnrichmentsRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadEnrichmentsError(error));
    }

    return yield put(loadEnrichmentsSuccess(response));
}

export function* handleLaunchEnrichment({ payload: enrichment }) {
    const enrichmentActionRequest = yield select(
        fromUser.getEnrichmentActionRequest,
        {
            action: enrichment.action || 'launch',
            id: enrichment.id,
        },
    );

    yield call(fetchSaga, enrichmentActionRequest);

    return yield put(loadEnrichments());
}

export function* handleLaunchAllEnrichment() {
    yield put(launchAllEnrichmentStarted());

    try {
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
        return yield put(loadEnrichments());
    } finally {
        yield put(launchAllEnrichmentCompleted());
    }
}

export function* handleRetryEnrichment({ payload: { id } }) {
    const enrichmentRetryRequest = yield select(
        fromUser.getEnrichmentRetryRequest,
        {
            id,
        },
    );

    yield call(fetchSaga, enrichmentRetryRequest);

    return yield put(loadEnrichments());
}

export function* watchLoadEnrichmentsRequest() {
    yield takeLatest([LOAD_ENRICHMENTS], handleLoadEnrichmentsRequest);
}

export function* watchLaunchEnrichment() {
    yield takeLatest(LAUNCH_ENRICHMENT, handleLaunchEnrichment);
}

export function* watchLaunchAllEnrichment() {
    yield takeLatest(LAUNCH_ALL_ENRICHMENT, handleLaunchAllEnrichment);
}
export function* watchRetryEnrichment() {
    yield takeLatest(RETRY_ENRICHMENT, handleRetryEnrichment);
}

export default function* () {
    yield fork(watchLoadEnrichmentsRequest);
    yield fork(watchLaunchEnrichment);
    yield fork(watchLaunchAllEnrichment);
    yield fork(watchRetryEnrichment);
}
