import { call, put, select, takeLatest } from 'redux-saga/effects';
import { destroy } from 'redux-form';
import set from 'lodash.set';
import get from 'lodash.get';

import {
    loadField,
    getFieldFormData,
    saveFieldError,
    saveFieldSuccess,
    FIELD_FORM_NAME,
    SAVE_FIELD,
} from '../';
import { getSaveFieldRequest } from '../../../fetch';

import fetchSaga from '../../../lib/fetchSaga';

export const sanitizeField = (fieldData) => {
    const valueOperation = get(fieldData, 'transformers[0].operation');
    if (valueOperation === 'CONCAT') {
        const values = get(fieldData, 'transformers[0].args');

        return set(
            { ...fieldData },
            'transformers[0].args',
            [
                ...values.slice(0, 2),
                ...values.slice(2).filter(({ value }) => !!value),
            ],
        );
    }

    return fieldData;
};

export function* handleSaveField() {
    const fieldData = yield select(getFieldFormData);
    const sanitizedFieldData = yield call(sanitizeField, fieldData);
    const request = yield select(getSaveFieldRequest, sanitizedFieldData);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }

    yield put(loadField());
    yield put(destroy(FIELD_FORM_NAME));
}

export default function* watchSaveField() {
    yield takeLatest([
        SAVE_FIELD,
    ], handleSaveField);
}
