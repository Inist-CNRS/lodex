import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CLEAR_DATASET,
    clearDatasetError,
    clearDatasetSuccess,
} from './';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleClearDatasetRequest() {
    const request = yield select(fromUser.getClearDatasetRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error || response.status !== 'success') {
        return yield put(clearDatasetError(error));
    }

    return yield put(clearDatasetSuccess());
}

export function* handleClearPublishedRequest() {
    
}

export default function* () {
    yield takeLatest(CLEAR_DATASET, handleClearDatasetRequest);
    yield takeLatest(CLEAR_DATASET, handleClearDatasetRequest);
}
