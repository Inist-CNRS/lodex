import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    getUpdateCharacteristicsRequest,
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from './';
import fetchSaga from '../lib/fetchSaga';

export function* handleUpdateCharacteristics() {
    const request = yield select(getUpdateCharacteristicsRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(updateCharacteristicsError(error));
    }

    return yield put(updateCharacteristicsSuccess(response));
}

export function* watchUpdateCharacteristics() {
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}

export default function* () {
    yield fork(watchUpdateCharacteristics);
}
