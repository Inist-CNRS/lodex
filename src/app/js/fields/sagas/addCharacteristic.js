import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    ADD_CHARACTERISTIC,
    addCharacteristicError,
    addCharacteristicSuccess,
} from '../';
import { getNewCharacteristicFormData } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleAddCharacteristic() {
    const formData = yield select(getNewCharacteristicFormData);
    const request = yield select(
        fromUser.getAddCharacteristicRequest,
        formData,
    );
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(addCharacteristicError(error.message));
        return;
    }

    yield put(addCharacteristicSuccess(response));
}

export default function*() {
    yield takeLatest(ADD_CHARACTERISTIC, handleAddCharacteristic);
}
