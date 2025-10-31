import { call, select, takeLatest, fork, put } from 'redux-saga/effects';

import { dumpDatasetError, dumpDatasetSuccess, DUMP_DATASET } from './index';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import streamFile from '@lodex/frontend-common/utils/streamFile';

// @ts-expect-error TS7031
export function* handleDumpDatasetRequest({ payload }) {
    // @ts-expect-error TS7057
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
    // @ts-expect-error TS2769
    yield takeLatest(DUMP_DATASET, handleDumpDatasetRequest);
}

export default function* () {
    yield fork(watchDumpDatasetRequest);
}
