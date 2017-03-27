import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    ADD_CHARACTERISTIC,
    addCharacteristicError,
    addCharacteristicSuccess,
} from '../';
import { getAddCharacteristicRequest } from '../../../fetch/';
import fetchSaga from '../../../lib/fetchSaga';

export function* handleAddCharacteristic({ payload }) {
    const request = yield select(getAddCharacteristicRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(addCharacteristicError(error));
    }

    return yield put(addCharacteristicSuccess(response));
}

export default function* () {
    yield takeLatest(ADD_CHARACTERISTIC, handleAddCharacteristic);
}
