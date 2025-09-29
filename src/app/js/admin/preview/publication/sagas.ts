import { call, put, select, takeLatest, all } from 'redux-saga/effects';

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
        // @ts-expect-error TS7057
        const fields = yield select(fromFields.getFields);
        // @ts-expect-error TS7057
        const lines = yield select(fromParsing.getExcerptLines);
        if (!fields.length || !lines.length) {
            return;
        }
        // @ts-expect-error TS7057
        const token = yield select(fromUser.getToken);
        // @ts-expect-error TS7057
        const transformDocument = yield call(
            getDocumentTransformer,
            fields,
            token,
        );

        // @ts-expect-error TS7057
        const preview = yield all(
            // @ts-expect-error TS7006
            lines.map((line) => call(transformDocument, line)),
        );

        yield put(computePublicationPreviewSuccess(preview));
    } catch (error) {
        yield put(computePublicationPreviewError(error));
    }
}

export function* handleRecomputePublication() {
    // @ts-expect-error TS7057
    const isPublished = yield select(fromPublication.hasPublishedDataset);
    // @ts-expect-error TS7057
    const isEnableAutoPublication = yield select(
        // @ts-expect-error TS2339
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
