import { call, takeEvery, select, put } from 'redux-saga/effects';

import { LOAD_EXPORTERS, loadExportersError, loadExportersSuccess } from '../';
import { getLoadExportersRequest } from '../../../fetch';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleLoadExporters() {
    const request = yield select(getLoadExportersRequest);
    const { response, error } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadExportersError(error));
    }

    return yield put(loadExportersSuccess(response));
}

export default function* () {
    yield takeEvery(LOAD_EXPORTERS, handleLoadExporters);
}
