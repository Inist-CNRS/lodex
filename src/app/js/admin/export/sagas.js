import { call, select, put, takeEvery } from 'redux-saga/effects';
import fetchSaga from '../../lib/fetchSaga';
import { getExportFieldsRequest } from '../../fetch/';

import {
    EXPORT_FIELDS,
    exportFieldsError,
} from './';

export const downloadFile = (blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = 'lodex_export.json';
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    a.remove();
};

export function* handleExportPublishedDatasetSuccess() {
    const request = yield select(getExportFieldsRequest);
    const { error, response } = yield call(fetchSaga, request, [], 'blob');

    if (error) {
        yield put(exportFieldsError(error));
        return;
    }

    yield call(downloadFile, response);
}

export default function* () {
    yield takeEvery(EXPORT_FIELDS, handleExportPublishedDatasetSuccess);
}
