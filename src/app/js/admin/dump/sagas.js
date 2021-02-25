import { call, select, takeLatest, fork, put } from 'redux-saga/effects';

import { dumpDatasetError, dumpDatasetSuccess, DUMP_DATASET } from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import downloadFile from '../../lib/downloadFile';

export function* handleDumpDatasetRequest() {
    const request = yield select(fromUser.getDumpDatasetRequest);
    const { response, filename } = yield call(fetchSaga, request, [], 'blob');

    try {
        yield call(downloadFile, response, filename);
        yield put(dumpDatasetSuccess());
    } catch (e) {
        yield put(dumpDatasetError(e));
    }
}

export function* watchDumpDatasetRequest() {
    yield takeLatest(DUMP_DATASET, handleDumpDatasetRequest);
}

export default function*() {
    yield fork(watchDumpDatasetRequest);
}
