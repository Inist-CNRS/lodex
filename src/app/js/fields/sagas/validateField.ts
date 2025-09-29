import { call, put, select } from 'redux-saga/effects';

import { fieldInvalid } from '../';
import { fromFields } from '../../sharedSelectors';
// @ts-expect-error TS7016
import { validateAddedField } from '../../../../common/validateFields';

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
