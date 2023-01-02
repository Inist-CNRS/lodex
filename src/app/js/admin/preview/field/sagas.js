import { call, all, put, select, takeLatest } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    DESTROY as REDUX_FORM_DESTROY,
    INITIALIZE as REDUX_FORM_INITIALIZE,
    ARRAY_MOVE as REDUX_FORM_ARRAY_MOVE,
} from 'redux-form/lib/actionTypes';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { fromUser } from '../../../sharedSelectors';
import { computeFieldPreviewSuccess, computeFieldPreviewError } from './';
import { getFieldFormData } from '../../../fields/selectors';
import { fromParsing } from '../../selectors';
import { FIELD_FORM_NAME } from '../../../fields/index';

export function* handleComputeFieldPreview({ meta: { form } }) {
    if (form !== FIELD_FORM_NAME) {
        return;
    }
    try {
        const formData = yield select(getFieldFormData);

        const fields = [formData];
        const lines = yield select(fromParsing.getExcerptLines);

        const token = yield select(fromUser.getToken);
        const transformDocument = yield call(
            getDocumentTransformer,
            fields,
            token,
        );

        const preview = yield all(
            lines.map(line => call(transformDocument, line)),
        );
        yield put(computeFieldPreviewSuccess(preview));
    } catch (error) {
        yield put(computeFieldPreviewError(error));
    }
}

export default function* watchComputePreview() {
    yield takeLatest(
        [
            REDUX_FORM_CHANGE,
            REDUX_FORM_ARRAY_REMOVE,
            REDUX_FORM_INITIALIZE,
            REDUX_FORM_DESTROY,
            REDUX_FORM_ARRAY_MOVE,
        ],
        handleComputeFieldPreview,
    );
}
