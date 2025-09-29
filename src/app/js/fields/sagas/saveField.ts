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
// @ts-expect-error TS7016
import { SCOPE_DOCUMENT } from '../../../../common/scope';
import fetchSaga from '../../lib/sagas/fetchSaga';

// @ts-expect-error TS7006
export const sanitizeField = (fieldData) => {
    const valueOperation = get(fieldData, 'transformers[0].operation');
    if (valueOperation === 'CONCAT') {
        const values = get(fieldData, 'transformers[0].args');

        return set({ ...fieldData }, 'transformers[0].args', [
            ...values.slice(0, 2),
            // @ts-expect-error TS7031
            ...values.slice(2).filter(({ value }) => !!value),
        ]);
    }

    return fieldData;
};

// @ts-expect-error TS7031
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

    // @ts-expect-error TS7057
    const fieldData = yield select(getFieldFormData);
    // @ts-expect-error TS7057
    const sanitizedFieldData = yield call(sanitizeField, fieldData);
    // @ts-expect-error TS7057
    const request = yield select(
        // @ts-expect-error TS2339
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

// @ts-expect-error TS7031
export function* handleSaveFieldData({ payload }) {
    // @ts-expect-error TS7057
    const field = yield select(fromFields.getFromName, payload.name);
    if (!field) {
        return;
    }

    // @ts-expect-error TS7057
    const sanitizedFieldData = yield call(sanitizeField, {
        ...field,
        ...payload.data,
    });

    // @ts-expect-error TS7057
    const request = yield select(
        // @ts-expect-error TS2339
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
    // @ts-expect-error TS2769
    yield takeLatest([SAVE_FIELD], handleSaveField);
    // @ts-expect-error TS2769
    yield takeLatest([SAVE_FIELD_FROM_DATA], handleSaveFieldData);
}
