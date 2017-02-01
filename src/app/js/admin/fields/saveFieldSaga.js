import { takeLatest } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { CHANGE as REDUX_FORM_CHANGE } from 'redux-form/lib/actionTypes';

import {
    saveField,
} from './';

const getFieldFormData = state => state.form.field.values;

export function* handleSaveField({ meta: { form } }) {
    if (form !== 'field') {
        return;
    }
    const fieldData = yield select(getFieldFormData);
    yield put(saveField(fieldData));
}

export default function* watchLoadField() {
    yield takeLatest([REDUX_FORM_CHANGE], handleSaveField);
}
