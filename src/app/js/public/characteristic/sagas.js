import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from './';
import { getUpdateCharacteristicsRequest } from '../../fetch/';
import fetchSaga from '../../lib/fetchSaga';

export function* handleUpdateCharacteristics() {
    const request = yield select(getUpdateCharacteristicsRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(updateCharacteristicsError(error));
    }

    return yield put(updateCharacteristicsSuccess(response));
}

export default function* () {
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}
