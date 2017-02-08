import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    getUpdateCharacteristicsRequest,
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from './';
import fetchSaga from '../lib/fetchSaga';

export function* handleUpdateCharacteristics({ payload }) {
    const request = yield select(getUpdateCharacteristicsRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(updateCharacteristicsError(error));
    }

    const characteristics = response.map(r => r.value);
    return yield put(updateCharacteristicsSuccess(characteristics));
}

export function* watchUpdateCharacteristics() {
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}

export default function* () {
    yield fork(watchUpdateCharacteristics);
}
