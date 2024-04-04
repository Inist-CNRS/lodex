import { call, select, put, takeEvery } from 'redux-saga/effects';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromUser } from '../sharedSelectors';

import { EXPORT_FIELDS, exportFieldsError } from './';
import downloadFile from '../lib/downloadFile';

export function* handleExportFields() {
    const request = yield select(fromUser.getExportFieldsRequest);
    const { error, response, filename } = yield call(
        fetchSaga,
        request,
        [],
        'blob',
    );

    if (error) {
        yield put(exportFieldsError(error));
        return;
    }

    yield call(downloadFile, response, filename[0]);
}

export default function* () {
    yield takeEvery(EXPORT_FIELDS, handleExportFields);
}
