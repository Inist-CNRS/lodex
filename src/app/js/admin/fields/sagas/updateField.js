import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_INSERT as REDUX_FORM_ARRAY_INSERT,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
} from 'redux-form/lib/actionTypes';
import {
    getFieldFormData,
    getUpdateFieldRequest,
    updateFieldError,
    updateFieldSuccess,
} from '../';
import prepareTransformers from './prepareTransformers';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleUpdateField({ meta: { form } }) {
    if (form !== 'field') {
        return;
    }
    const fieldData = yield select(getFieldFormData);
    fieldData.transformers = yield call(prepareTransformers, fieldData.transformers);

    const request = yield select(getUpdateFieldRequest, fieldData);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(updateFieldError(error));
        return;
    }

    yield put(updateFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest([
        REDUX_FORM_CHANGE,
        REDUX_FORM_ARRAY_INSERT,
        REDUX_FORM_ARRAY_REMOVE,
    ], handleUpdateField);
}
