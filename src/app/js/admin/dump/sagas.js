import { call, select, takeLatest, fork, put } from 'redux-saga/effects';

import { dumpDatasetError, dumpDatasetSuccess, DUMP_DATASET } from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import downloadFile from '../../lib/downloadFile';
import streamFile from '../../lib/streamFile';

export function* handleDumpDatasetRequest({ payload }) {
    const request = yield select(fromUser.getDumpDatasetRequest, payload);
    const { response, filename } = yield call(fetchSaga, request, [], 'stream');

    try {
        yield call(streamFile, response, filename);
        yield put(dumpDatasetSuccess());
    } catch (e) {
        yield put(dumpDatasetError(e));
    }
}

export function* watchDumpDatasetRequest() {
    yield takeLatest(DUMP_DATASET, handleDumpDatasetRequest);
}

export default function* () {
    yield fork(watchDumpDatasetRequest);
}
