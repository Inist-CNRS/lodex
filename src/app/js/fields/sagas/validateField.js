import { call, put, select } from 'redux-saga/effects';

import { fieldInvalid } from '../';
import { fromFields } from '../../sharedSelectors';
import { validateAddedField } from '../../../../common/validateFields';

export default function* handleConfigureField(formData) {
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
            invalidProperties: properties.filter(({ isValid }) => !isValid),
        }),
    );

    return false;
}
