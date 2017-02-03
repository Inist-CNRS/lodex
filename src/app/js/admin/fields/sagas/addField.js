import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
    ADD_FIELD,
    getFieldFormData,
    getCreateFieldRequest,
    addFieldError,
    addFieldSuccess,
} from '../';
import prepareTransformers from './prepareTransformers';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleAddField() {
    const fieldData = yield select(getFieldFormData);
    fieldData.transformers = yield call(prepareTransformers, fieldData.transformers);

    const request = yield select(getCreateFieldRequest, fieldData);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(addFieldError(error));
    } else {
        yield put(addFieldSuccess(response));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleAddField);
}
