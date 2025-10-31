import { call, put, select } from 'redux-saga/effects';

import { fieldInvalid } from '../reducer';
import { fromFields } from '../../sharedSelectors';
import { validateAddedField } from '@lodex/common';

// @ts-expect-error TS7006
export default function* validateField(formData) {
    // @ts-expect-error TS7057
    const fields = yield select(fromFields.getFields);
    const { isValid, properties } = yield call(
        validateAddedField,
        formData,
        false,
        fields,
    );

    if (isValid) {
        return true;
    }

    yield put(
        fieldInvalid({
            // @ts-expect-error TS7031
            invalidProperties: properties.filter(({ isValid }) => !isValid),
        }),
    );

    return false;
}
