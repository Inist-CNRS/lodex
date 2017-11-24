import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
    RESTORE_RESOURCE,
    restoreRessourceSuccess,
    restoreRessourceError,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleRestoreResourceRequest({ payload: uri }) {
    const request = yield select(fromUser.getRestoreResourceRequest, uri);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        return yield put(restoreRessourceError(error));
    }

    return yield put(restoreRessourceSuccess(uri));
}

export default function*() {
    yield takeEvery(RESTORE_RESOURCE, handleRestoreResourceRequest);
}
