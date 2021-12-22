import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadEnrichmentsSuccess,
    loadEnrichmentsError,
    loadEnrichments,
    UPDATE_ENRICHMENT,
    createEnrichmentOptimistic,
    createEnrichmentError,
    updateEnrichmentOptimistic,
    CREATE_ENRICHMENT,
    LOAD_ENRICHMENTS,
    DELETE_ENRICHMENT,
    LAUNCH_ENRICHMENT,
    PREVIEW_DATA_ENRICHMENT,
    previewDataEnrichmentSuccess,
    previewDataEnrichmentError,
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

export function* handleCreateEnrichment({ payload: { enrichment, callback } }) {
    const request = yield select(
        fromUser.getCreateEnrichmentRequest,
        enrichment,
    );
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return yield put(createEnrichmentError(error.message));
    }

    yield put(createEnrichmentOptimistic(response));

    if (callback) {
        callback(response._id);
    }

    return yield put(loadEnrichments());
}

export function* handleUpdateEnrichment({ payload: enrichment }) {
    const request = yield select(
        fromUser.getUpdateEnrichmentRequest,
        enrichment,
    );

    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(updateEnrichmentOptimistic(response));
    return yield put(loadEnrichments());
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

export function* handleDeleteEnrichment({ payload: id }) {
    const request = yield select(fromUser.getDeleteEnrichmentRequest, id);
    const { error } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    return yield put(loadEnrichments());
}

export function* handlePreviewDataEnrichment({ payload: previewEnrichment }) {
    const request = yield select(
        fromUser.getPreviewDataEnrichmentRequest,
        previewEnrichment,
    );

    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return yield put(previewDataEnrichmentError(error));
    }

    yield put(previewDataEnrichmentSuccess(response));
}

export function* watchLoadEnrichmentsRequest() {
    yield takeLatest([LOAD_ENRICHMENTS], handleLoadEnrichmentsRequest);
}

export function* watchCreateEnrichment() {
    yield takeLatest(CREATE_ENRICHMENT, handleCreateEnrichment);
}

export function* watchLaunchEnrichment() {
    yield takeLatest(LAUNCH_ENRICHMENT, handleLaunchEnrichment);
}

export function* watchPreviewDataEnrichment() {
    yield takeLatest(PREVIEW_DATA_ENRICHMENT, handlePreviewDataEnrichment);
}

export function* watchUpdateEnrichment() {
    yield takeLatest(UPDATE_ENRICHMENT, handleUpdateEnrichment);
}

export function* watchDeleteEnrichment() {
    yield takeLatest(DELETE_ENRICHMENT, handleDeleteEnrichment);
}

export default function*() {
    yield fork(watchLoadEnrichmentsRequest);
    yield fork(watchCreateEnrichment);
    yield fork(watchLaunchEnrichment);
    yield fork(watchUpdateEnrichment);
    yield fork(watchDeleteEnrichment);
    yield fork(watchPreviewDataEnrichment);
}
