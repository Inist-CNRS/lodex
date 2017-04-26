import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    CONFIGURE_FIELD,
    configureFieldSuccess,
    configureFieldError,
    getFieldOntologyFormData,
    loadPublication,
} from '../';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleSaveFieldRequest() {
    const formData = yield select(getFieldOntologyFormData);
    const request = yield select(fromUser.getUpdateFieldRequest, formData);

    const { error, response: field } = yield call(fetchSaga, request);

    if (error) {
        yield put(configureFieldError(error));
        return;
    }

    yield put(configureFieldSuccess(field));
    yield put(loadPublication());
}

export default function* watchsaveFieldRequest() {
    yield takeLatest(CONFIGURE_FIELD, handleSaveFieldRequest);
}
