import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    ADD_CHARACTERISTIC,
    addCharacteristicError,
    addCharacteristicSuccess,
    fieldInvalid,
} from '../';
import { getNewCharacteristicFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { validateField } from '../../../../common/validateFields';

export function* handleAddCharacteristic() {
    const formData = yield select(getNewCharacteristicFormData);
    const fields = yield select(fromFields.getFields);
    const { isValid, properties } = yield call(validateField, false, fields);
    if (!isValid) {
        yield put(fieldInvalid(properties.filter(({ isValid }) => !isValid)));
        return;
    }
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
