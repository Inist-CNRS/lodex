import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

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
    getFields,
} from '../fields';

import {
    LOAD_PARSING_RESULT_SUCCESS,
    getExcerptLines,
} from '../parsing';

export function* handleComputePreview() {
    try {
        const token = yield select(getToken);
        const fields = yield select(getFields);

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
