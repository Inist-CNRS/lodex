import { takeEvery } from 'redux-saga';
import { call, fork } from 'redux-saga/effects';

import {
    EXPORT_PUBLISHED_DATASET,
} from './';

export function* handleExportPublishedDatasetSuccess({ payload: type }) {
    yield call(window.open, `/api/export/${type}`);
}

export function* watchExportPublishedDatasetRequest() {
    yield takeEvery(EXPORT_PUBLISHED_DATASET, handleExportPublishedDatasetSuccess);
}

export default function* () {
    yield fork(watchExportPublishedDatasetRequest);
}
