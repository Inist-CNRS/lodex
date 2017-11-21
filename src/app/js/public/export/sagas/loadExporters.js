import { call, takeEvery, select, put } from 'redux-saga/effects';

import { PRE_LOAD_EXPORTERS, loadExporters, loadExportersError, loadExportersSuccess } from '../';
import { fromUser } from '../../../sharedSelectors';
import { fromExport } from '../../selectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleLoadExporters() {
    if (yield select(fromExport.areExporterLoaded)) {
        return;
    }
    yield put(loadExporters());
    const request = yield select(fromUser.getLoadExportersRequest);
    const { response, error } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadExportersError(error));
        return;
    }

    yield put(loadExportersSuccess(response));
}

export default function* () {
    yield takeEvery(PRE_LOAD_EXPORTERS, handleLoadExporters);
}
