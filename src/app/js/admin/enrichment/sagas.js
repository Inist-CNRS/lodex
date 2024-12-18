import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadEnrichmentsSuccess,
    loadEnrichmentsError,
    loadEnrichments,
    LOAD_ENRICHMENTS,
    LAUNCH_ENRICHMENT,
    LAUNCH_ALL_ENRICHMENT,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

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
    const enrichmentLaunchAllRequest = yield select(
        fromUser.getEnrichmentLaunchAllRequest,
    );

    yield call(fetchSaga, enrichmentLaunchAllRequest);

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

export default function* () {
    yield fork(watchLoadEnrichmentsRequest);
    yield fork(watchLaunchEnrichment);
    yield fork(watchLaunchAllEnrichment);
}
