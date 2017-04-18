import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_INSERT as REDUX_FORM_ARRAY_INSERT,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    REGISTER_FIELD as REDUX_FORM_REGISTER_FIELD,
    UNREGISTER_FIELD as REDUX_FORM_UNREGISTER_FIELD,
    DESTROY as REDUX_FORM_DESTROY,
} from 'redux-form/lib/actionTypes';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { getToken } from '../../../user';
import {
    COMPUTE_PREVIEW,
    computePreviewSuccess,
    computePreviewError,
} from './';
import {
    LOAD_FIELD_SUCCESS,
    ADD_FIELD,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
    getFieldFormData,
} from '../../fields';
import { fromFields, fromParsing, fromPublicationPreview } from '../../selectors';
import {
    LOAD_PARSING_RESULT_SUCCESS,
} from '../../parsing';

export function* handleComputePreview() {
    try {
        const formData = yield select(getFieldFormData);
        const hasPreview = yield select(fromPublicationPreview.hasPublicationPreview);
        if (!formData && hasPreview) {
            return;
        }
        const fields = yield select(fromFields.getFieldsForPreview, formData);
        const lines = yield select(fromParsing.getExcerptLines);
        if (!fields.length || !lines.length) {
            return;
        }

        const token = yield select(getToken);
        const transformDocument = yield call(getDocumentTransformer, fields, token);

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
        ADD_FIELD,
        REMOVE_FIELD_SUCCESS,
        SAVE_FIELD_SUCCESS,
        REDUX_FORM_CHANGE,
        REDUX_FORM_ARRAY_INSERT,
        REDUX_FORM_ARRAY_REMOVE,
        REDUX_FORM_REGISTER_FIELD,
        REDUX_FORM_UNREGISTER_FIELD,
        REDUX_FORM_DESTROY,
    ], handleComputePreview);
}
