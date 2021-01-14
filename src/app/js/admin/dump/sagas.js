import { call, select, takeLatest, fork } from 'redux-saga/effects';

import { DUMP_DATASET } from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import downloadFile from '../../lib/downloadFile';

export function* handleDumpDatasetRequest() {
    const request = yield select(fromUser.getDumpDatasetRequest);
    const { response, filename } = yield call(fetchSaga, request, [], 'blob');

    yield call(downloadFile, response, filename);
}

export function* watchDumpDatasetRequest() {
    yield takeLatest(DUMP_DATASET, handleDumpDatasetRequest);
}

export default function*() {
    yield fork(watchDumpDatasetRequest);
}
