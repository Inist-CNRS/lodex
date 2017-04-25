import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    DESTROY as REDUX_FORM_DESTROY,
    INITIALIZE as REDUX_FORM_INITIALIZE,
} from 'redux-form/lib/actionTypes';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { getToken } from '../../../user';
import {
    COMPUTE_FIELD_PREVIEW,
    computeFieldPreviewSuccess,
    computeFieldPreviewError,
} from './';
import {
    getFieldFormData,
} from '../../../fields';
import { fromParsing } from '../../selectors';

export function* handleComputeFieldPreview() {
    try {
        const formData = yield select(getFieldFormData);

        const fields = [formData];
        const lines = yield select(fromParsing.getExcerptLines);

        const token = yield select(getToken);
        const transformDocument = yield call(getDocumentTransformer, fields, token);

        const preview = yield lines.map(line => call(transformDocument, line));
        yield put(computeFieldPreviewSuccess(preview));
    } catch (error) {
        yield put(computeFieldPreviewError(error));
    }
}

export default function* watchComputePreview() {
    yield takeLatest([
        COMPUTE_FIELD_PREVIEW,
        REDUX_FORM_CHANGE,
        REDUX_FORM_ARRAY_REMOVE,
        REDUX_FORM_INITIALIZE,
        REDUX_FORM_DESTROY,
    ], handleComputeFieldPreview);
}
