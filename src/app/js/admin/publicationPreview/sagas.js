import { call, put, select, takeLatest } from 'redux-saga/effects';

import getDocumentTransformer from '../../../../common/getDocumentTransformer';
import fetchLineBy from '../../lib/fetchLineBy';

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
} from '../fields';

import {
    LOAD_PARSING_RESULT_SUCCESS,
    getExcerptLines,
} from '../parsing';
import { fromFields } from '../../selectors';

export function* handleComputePreview() {
    try {
        const token = yield select(getToken);
        const fields = yield select(fromFields.getFields);

        const transformDocument = yield call(getDocumentTransformer, { env: 'browser', token, fetchLineBy }, fields);

        const lines = yield select(getExcerptLines);
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
    ], handleComputePreview);
}
