import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    ADD_CHARACTERISTIC,
    addCharacteristicError,
    addCharacteristicSuccess,
} from '../reducer';
import { getNewCharacteristicFormData } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import validateField from './validateField';

export function* handleAddCharacteristic() {
    // @ts-expect-error TS7057
    const formData = yield select(getNewCharacteristicFormData);
    // @ts-expect-error TS7057
    const isValid = yield call(validateField, formData);
    if (!isValid) {
        return;
    }
    // @ts-expect-error TS7057
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

export default function* () {
    yield takeLatest(ADD_CHARACTERISTIC, handleAddCharacteristic);
}
