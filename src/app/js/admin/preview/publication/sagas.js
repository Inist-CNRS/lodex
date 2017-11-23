import { call, put, select, takeLatest } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { fromUser, fromFields } from '../../../sharedSelectors';
import {
    computePublicationPreviewSuccess,
    computePublicationPreviewError,
} from './';
import {
    LOAD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../../../fields';
import { fromParsing } from '../../selectors';
import { LOAD_PARSING_RESULT_SUCCESS } from '../../parsing';

export function* handleComputePublicationPreview() {
    try {
        const fields = yield select(fromFields.getFieldsForPreview);
        const lines = yield select(fromParsing.getExcerptLines);
        if (!fields.length || !lines.length) {
            return;
        }
        const token = yield select(fromUser.getToken);
        const transformDocument = yield call(
            getDocumentTransformer,
            fields,
            token,
        );

        const preview = yield lines.map(line => call(transformDocument, line));
        yield put(computePublicationPreviewSuccess(preview));
    } catch (error) {
        yield put(computePublicationPreviewError(error));
    }
}

export default function* watchComputePreview() {
    yield takeLatest(
        [
            LOAD_PARSING_RESULT_SUCCESS,
            LOAD_FIELD_SUCCESS,
            REMOVE_FIELD_SUCCESS,
            SAVE_FIELD_SUCCESS,
        ],
        handleComputePublicationPreview,
    );
}
