import { call, put, take, race, select, takeLatest } from 'redux-saga/effects';

import {
    CLEAR_DATASET,
    clearDatasetError,
    clearDatasetSuccess,
} from './';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleClearDatasetRequest() {
    const request = yield select(fromUser.getClearDatasetRequest);
    const { error } = yield call(fetchSaga, request);

    yield console.log(error);
}

export default function* () {
    yield takeLatest(CLEAR_DATASET, handleClearDatasetRequest);
}
