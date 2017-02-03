import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
    ADD_FIELD,
    getFieldFormData,
    getCreateFieldRequest,
    createFieldError,
    createFieldSuccess,
} from '../';
import prepareTransformers from './prepareTransformers';

import fetchSaga from '../../../lib/fetchSaga';

export function* handleCreateField({ meta: { form } }) {
    if (form !== 'field') {
        return;
    }
    const fieldData = yield select(getFieldFormData);
    fieldData.transformers = yield call(prepareTransformers, fieldData.transformers);

    const request = yield select(getCreateFieldRequest, fieldData);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(createFieldError(error));
    } else {
        yield put(createFieldSuccess(response));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleCreateField);
}
