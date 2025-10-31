import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CONFIGURE_FIELD,
    configureFieldSuccess,
    configureFieldError,
    preLoadPublication,
    loadPublication,
} from '../reducer';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../fetch/fetchSaga';
import validateField from './validateField';

export function* handleConfigureField() {
    // @ts-expect-error TS7057
    const formData = yield select(getFieldOntologyFormData);
    // @ts-expect-error TS7057
    const fields = yield select(fromFields.getFields);
    // @ts-expect-error TS7006
    const fieldToUpdate = fields.find((f) => f.name === formData.name);

    // @ts-expect-error TS7057
    const isValid = yield call(validateField, formData);

    if (!isValid) {
        return;
    }
    // @ts-expect-error TS7057
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
