import { call, put, select, takeLatest } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { fromUser, fromFields } from '../../../sharedSelectors';
import {
    fromConfigTenant,
    fromParsing,
    fromPublication,
} from '../../selectors';
import { LOAD_PARSING_RESULT_SUCCESS } from '../../parsing';
import { COMPUTE_PUBLICATION } from '../../publication';
import { publish } from '../../publish';

import {
    computePublicationPreviewSuccess,
    computePublicationPreviewError,
} from './';

import {
    LOAD_FIELD_SUCCESS,
    REMOVE_FIELD_LIST_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../../../fields';

export function* handleComputePublicationPreview() {
    try {
        const fields = yield select(fromFields.getFields);
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

        const preview = yield lines.map((line) =>
            call(transformDocument, line),
        );
        yield put(computePublicationPreviewSuccess(preview));
    } catch (error) {
        yield put(computePublicationPreviewError(error));
    }
}

export function* handleRecomputePublication() {
    const isPublished = yield select(fromPublication.hasPublishedDataset);
    const isEnableAutoPublication = yield select(
        fromConfigTenant.isEnableAutoPublication,
    );

    if (!isPublished || !isEnableAutoPublication) {
        return;
    }

    yield put(publish());
}

export default function* watchComputePreview() {
    yield takeLatest(
        [
            LOAD_PARSING_RESULT_SUCCESS,
            LOAD_FIELD_SUCCESS,
            REMOVE_FIELD_SUCCESS,
            SAVE_FIELD_SUCCESS,
            COMPUTE_PUBLICATION,
        ],
        handleComputePublicationPreview,
    );

    yield takeLatest(
        [SAVE_FIELD_SUCCESS, REMOVE_FIELD_SUCCESS, REMOVE_FIELD_LIST_SUCCESS],
        handleRecomputePublication,
    );
}
