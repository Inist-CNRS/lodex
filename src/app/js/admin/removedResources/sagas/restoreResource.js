import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
    RESTORE_RESOURCE,
    restoreRessourceSuccess,
    restoreRessourceError,
} from '../';
import { getRestoreResourceRequest } from '../../../fetch/';
import fetchSaga from '../../../lib/fetchSaga';

export function* handleRestoreResourceRequest({ payload: uri }) {
    const request = yield select(getRestoreResourceRequest, uri);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        return yield put(restoreRessourceError(error));
    }

    return yield put(restoreRessourceSuccess(uri));
}

export default function* () {
    yield takeEvery(RESTORE_RESOURCE, handleRestoreResourceRequest);
}
