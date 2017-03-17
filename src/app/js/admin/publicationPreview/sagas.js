import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_INSERT as REDUX_FORM_ARRAY_INSERT,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    REGISTER_FIELD as REDUX_REGISTER_FIELD,
    UNREGISTER_FIELD as REDUX_UNREGISTER_FIELD,
} from 'redux-form/lib/actionTypes';


import getDocumentTransformer from '../../lib/getDocumentTransformer';
import { getToken } from '../../user';
import {
    COMPUTE_PREVIEW,
    computePreviewSuccess,
    computePreviewError,
} from './';
import {
    LOAD_FIELD_SUCCESS,
    ADD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    UPDATE_FIELD_SUCCESS,
    getFieldFormData,
} from '../fields';
import { fromFields, fromParsing } from '../selectors';
import {
    LOAD_PARSING_RESULT_SUCCESS,
} from '../parsing';

export function* handleComputePreview() {
    try {
        const token = yield select(getToken);
        const formData = yield select(getFieldFormData);
        const fields = yield select(fromFields.getFieldsForPreview, formData);

        const transformDocument = yield call(getDocumentTransformer, fields, token);

        const lines = yield select(fromParsing.getExcerptLines);
        const preview = yield lines.map(line => call(transformDocument, line));
        yield put(computePreviewSuccess(preview));
    } catch (error) {
        yield put(computePreviewError(error));
    }
}

export default function* watchComputePreview() {
    yield takeLatest([
        COMPUTE_PREVIEW,
        LOAD_PARSING_RESULT_SUCCESS,
        LOAD_FIELD_SUCCESS,
        ADD_FIELD_SUCCESS,
        REMOVE_FIELD_SUCCESS,
        UPDATE_FIELD_SUCCESS,
        REDUX_FORM_CHANGE,
        REDUX_FORM_ARRAY_INSERT,
        REDUX_FORM_ARRAY_REMOVE,
        REDUX_REGISTER_FIELD,
        REDUX_UNREGISTER_FIELD,
    ], handleComputePreview);
}
