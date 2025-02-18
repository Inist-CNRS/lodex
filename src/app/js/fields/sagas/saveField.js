import get from 'lodash/get';
import set from 'lodash/set';
import { destroy } from 'redux-form';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    FIELD_FORM_NAME,
    loadField,
    SAVE_FIELD,
    SAVE_FIELD_FROM_DATA,
    saveFieldError,
    saveFieldSuccess,
} from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import { getFieldFormData } from '../selectors';

import { push } from 'redux-first-history';
import { SCOPE_DOCUMENT } from '../../../../common/scope';
import fetchSaga from '../../lib/sagas/fetchSaga';

export const sanitizeField = (fieldData) => {
    const valueOperation = get(fieldData, 'transformers[0].operation');
    if (valueOperation === 'CONCAT') {
        const values = get(fieldData, 'transformers[0].args');

        return set({ ...fieldData }, 'transformers[0].args', [
            ...values.slice(0, 2),
            ...values.slice(2).filter(({ value }) => !!value),
        ]);
    }

    return fieldData;
};

export function* handleSaveField({ payload }) {
    const {
        field: { subresourceId },
        filter,
    } = payload;

    const redirectingPath = `/display/${filter}${
        filter === SCOPE_DOCUMENT && subresourceId
            ? `/subresource/${subresourceId}`
            : ''
    }`;

    const fieldData = yield select(getFieldFormData);
    const sanitizedFieldData = yield call(sanitizeField, fieldData);
    const request = yield select(
        fromUser.getSaveFieldRequest,
        sanitizedFieldData,
    );
    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }
    yield put(saveFieldSuccess());
    yield put(push(redirectingPath));

    yield put(loadField());
    yield put(destroy(FIELD_FORM_NAME));
}

export function* handleSaveFieldData({ payload }) {
    const field = yield select(fromFields.getFromName, payload.name);
    if (!field) {
        return;
    }

    const sanitizedFieldData = yield call(sanitizeField, {
        ...field,
        ...payload.data,
    });

    const request = yield select(
        fromUser.getSaveFieldRequest,
        sanitizedFieldData,
    );

    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }

    if (!payload.silent) {
        yield put(saveFieldSuccess());
    }

    yield put(loadField());
}

export default function* watchSaveField() {
    yield takeLatest([SAVE_FIELD], handleSaveField);
    yield takeLatest([SAVE_FIELD_FROM_DATA], handleSaveFieldData);
}
