import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CONFIGURE_FIELD,
    configureFieldSuccess,
    configureFieldError,
    preLoadPublication,
    loadPublication,
} from '../';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import validateField from './validateField';

export function* handleConfigureField() {
    const formData = yield select(getFieldOntologyFormData);
    const fields = yield select(fromFields.getFields);
    const fieldToUpdate = fields.find(f => f.name === formData.name);

    const isValid = yield call(validateField, formData);

    if (!isValid) {
        return;
    }
    const request = yield select(fromUser.getUpdateFieldRequest, formData);

    const { error, response: field } = yield call(fetchSaga, request);
    if (error) {
        yield put(configureFieldError(error));
        return;
    }

    yield put(configureFieldSuccess({ field }));

    if (fieldToUpdate && fieldToUpdate.overview !== field.overview) {
        yield put(loadPublication());
        return;
    }

    yield put(preLoadPublication());
}

export default function* watchsaveFieldRequest() {
    yield takeLatest(CONFIGURE_FIELD, handleConfigureField);
}
