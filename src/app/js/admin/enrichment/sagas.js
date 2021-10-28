import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    loadEnrichmentsSuccess,
    loadEnrichmentsError,
    loadEnrichments,
    UPDATE_ENRICHMENT,
    // DELETE_SUBRESOURCE,
    createEnrichmentOptimistic,
    updateEnrichmentOptimistic,
    CREATE_ENRICHMENT,
    LOAD_ENRICHMENTS,
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

export function* handleCreateEnrichment({ payload: { resource, callback } }) {
    const request = yield select(fromUser.getCreateEnrichmentRequest, resource);
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(createEnrichmentOptimistic(response));

    if (callback) {
        callback(response._id);
    }

    const scheduleRequest = yield select(
        fromUser.getScheduleDatasetEnrichmentRequest,
        {
            action: 'resume',
            id: response._id,
        },
    );

    yield call(fetchSaga, scheduleRequest);

    return yield put(loadEnrichments());
}

export function* handleUpdateEnrichment({ payload: resource }) {
    const request = yield select(
        fromUser.getUpdateEnrichmentRequest,
        resource,
    );

    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(updateEnrichmentOptimistic(response));

    const scheduleRequest = yield select(
        fromUser.getScheduleDatasetEnrichmentRequest,
        {
            action: 'resume',
            id: response._id,
        },
    );

    yield call(fetchSaga, scheduleRequest);

    return yield put(loadEnrichments());
}

// export function* handleDeleteSubresource({ payload: id }) {
//     const request = yield select(fromUser.getDeleteSubresourceRequest, id);
//     const { error } = yield call(fetchSaga, request);
//     if (error) {
//         return;
//     }

//     return yield put(loadEnrichments());
// }

export function* watchLoadEnrichmentsRequest() {
    yield takeLatest([LOAD_ENRICHMENTS], handleLoadEnrichmentsRequest);
}

export function* watchCreateEnrichment() {
    yield takeLatest(CREATE_ENRICHMENT, handleCreateEnrichment);
}

export function* watchUpdateEnrichment() {
    yield takeLatest(UPDATE_ENRICHMENT, handleUpdateEnrichment);
}

// export function* watchDeleteSubresource() {
//     yield takeLatest(DELETE_SUBRESOURCE, handleDeleteSubresource);
// }

export default function*() {
    yield fork(watchLoadEnrichmentsRequest);
    yield fork(watchCreateEnrichment);
    yield fork(watchUpdateEnrichment);
    // yield fork(watchDeleteSubresource);
}
