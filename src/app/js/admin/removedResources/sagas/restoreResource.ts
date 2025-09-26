import { call, put, select, takeEvery } from 'redux-saga/effects';

import {
    RESTORE_RESOURCE,
    restoreRessourceSuccess,
    restoreRessourceError,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

// @ts-expect-error TS7031
export function* handleRestoreResourceRequest({ payload: uri }) {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getRestoreResourceRequest, uri);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(restoreRessourceError(error));
    }

    // @ts-expect-error TS7057
    return yield put(restoreRessourceSuccess(uri));
}

export default function* () {
    // @ts-expect-error TS2769
    yield takeEvery(RESTORE_RESOURCE, handleRestoreResourceRequest);
}
