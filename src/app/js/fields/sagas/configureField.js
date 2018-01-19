import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CONFIGURE_FIELD,
    configureFieldSuccess,
    configureFieldError,
    configureFieldInvalid,
    preLoadPublication,
} from '../';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { validateField } from '../../../../common/validateFields';

export function* handleConfigureField() {
    const formData = yield select(getFieldOntologyFormData);
    const fields = yield select(fromFields.getFields);
    const { isValid, properties } = yield call(
        validateField,
        formData,
        false,
        fields,
    );
    if (!isValid) {
        yield put(
            configureFieldInvalid({
                invalidProperties: properties.filter(({ isValid }) => !isValid),
            }),
        );

        return;
    }
    const request = yield select(fromUser.getUpdateFieldRequest, formData);

    const { error, response: field } = yield call(fetchSaga, request);
    if (error) {
        yield put(configureFieldError(error));
        return;
    }

    yield put(configureFieldSuccess({ field }));
    yield put(preLoadPublication());
}

export default function* watchsaveFieldRequest() {
    yield takeLatest(CONFIGURE_FIELD, handleConfigureField);
}
