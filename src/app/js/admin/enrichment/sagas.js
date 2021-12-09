import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadEnrichmentsSuccess,
    loadEnrichmentsError,
    loadEnrichments,
    UPDATE_ENRICHMENT,
    // DELETE_SUBRESOURCE,
    createEnrichmentOptimistic,
    createEnrichmentError,
    updateEnrichmentOptimistic,
    CREATE_ENRICHMENT,
    LOAD_ENRICHMENTS,
    DELETE_ENRICHMENT,
    START_ENRICHMENT,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
// import { loadPublication } from '../publication';
// import { IMPORT_FIELDS_SUCCESS } from '../import';

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

    // const scheduleRequest = yield select(
    //     fromUser.getScheduleDatasetEnrichmentRequest,
    //     {
    //         action: 'resume',
    //         id: response._id,
    //     },
    // );

    // yield call(fetchSaga, scheduleRequest);

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

    // const scheduleRequest = yield select(
    //     fromUser.getScheduleDatasetEnrichmentRequest,
    //     {
    //         action: 'resume',
    //         id: response._id,
    //     },
    // );

    // yield call(fetchSaga, scheduleRequest);

    return yield put(loadEnrichments());
}

export function* handleStartEnrichment({ payload: enrichment }) {
    console.log('handleStartEnrichment', enrichment);

    // const scheduleRequest = yield select(
    //     fromUser.getScheduleDatasetEnrichmentRequest,
    //     {
    //         action: 'resume',
    //         id: enrichment.id,
    //     },
    // );

    // yield call(fetchSaga, scheduleRequest);

    // return yield put(loadEnrichments());
}

export function* handleDeleteEnrichment({ payload: id }) {
    const request = yield select(fromUser.getDeleteEnrichmentRequest, id);
    const { error } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    return yield put(loadEnrichments());
}

export function* watchLoadEnrichmentsRequest() {
    yield takeLatest([LOAD_ENRICHMENTS], handleLoadEnrichmentsRequest);
}

export function* watchCreateEnrichment() {
    yield takeLatest(CREATE_ENRICHMENT, handleCreateEnrichment);
}

export function* watchStartEnrichment() {
    yield takeLatest(START_ENRICHMENT, handleStartEnrichment);
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
    yield fork(watchUpdateEnrichment);
    yield fork(watchDeleteEnrichment);
}
