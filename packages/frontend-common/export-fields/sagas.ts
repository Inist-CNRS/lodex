import { call, select, put, takeEvery } from 'redux-saga/effects';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromUser } from '../../../src/app/js/sharedSelectors.ts';

import { EXPORT_FIELDS, exportFieldsError } from './index.ts';
import downloadFile from '../../../src/app/js/lib/downloadFile.ts';

export function* handleExportFields() {
    // @ts-expect-error TS7057
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
