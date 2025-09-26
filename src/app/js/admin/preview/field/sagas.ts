import { call, all, put, select, takeLatest } from 'redux-saga/effects';
import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    INITIALIZE as REDUX_FORM_INITIALIZE,
    ARRAY_MOVE as REDUX_FORM_ARRAY_MOVE,
    ARRAY_PUSH as REDUX_FORM_ARRAY_PUSH,
    ARRAY_SPLICE as REDUX_FORM_ARRAY_SPLICE,
} from 'redux-form/lib/actionTypes';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { fromUser } from '../../../sharedSelectors';
import { computeFieldPreviewSuccess, computeFieldPreviewError } from './';
import { getFieldFormData } from '../../../fields/selectors';
import { fromParsing } from '../../selectors';
import { FIELD_FORM_NAME } from '../../../fields/index';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from '../../../fields/sourceValue/SourceValueToggle';
import cloneDeep from 'lodash/cloneDeep';

export function* handleComputeFieldPreview({ meta: { form } }) {
    if (form !== FIELD_FORM_NAME) {
        return;
    }
    try {
        const formData = yield select(getFieldFormData);

        const { source } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
            formData.transformers,
            !!formData.subresourceId,
        );

        const isFromColumnsForSubRessourceField =
            source === 'fromColumnsForSubRessource';

        // we need to deep clone the formData to avoid mutating it
        const fields = [cloneDeep(formData)];

        const lines = yield select(fromParsing.getExcerptLines);

        const token = yield select(fromUser.getToken);

        let preview;
        if (isFromColumnsForSubRessourceField) {
            // we keep the three first transformers (COLUMN, PARSE, GET) in fields to get the subresource data
            // other transformers will be used to transform the subresource data
            const subresourceTransformers = fields[0].transformers.splice(3);
            const getSubresourceData = yield call(
                getDocumentTransformer,
                fields,
                token,
            );
            preview = yield all(
                lines.map((line) => call(getSubresourceData, line)),
            );

            // if there is other transformers we have to apply them to transform the preview
            if (subresourceTransformers.length > 0) {
                const subresourceData = preview.map(
                    (subresourceLine) => subresourceLine[formData.name],
                );

                // use the subresource transformers to transform the subresource data
                fields[0].transformers = subresourceTransformers;
                const transformSubresource = yield call(
                    getDocumentTransformer,
                    fields,
                    token,
                );

                preview = yield all(
                    subresourceData.map(function* (subresourceLine) {
                        if (Array.isArray(subresourceLine)) {
                            const previewLine = yield all(
                                subresourceLine.map((subresourceLineItem) =>
                                    call(
                                        transformSubresource,
                                        subresourceLineItem,
                                    ),
                                ),
                            );
                            return {
                                [formData.name]: previewLine.map(
                                    (previewLineItem) =>
                                        previewLineItem[formData.name],
                                ),
                            };
                        }
                        return call(transformSubresource, subresourceLine);
                    }),
                );
            }
        } else {
            const transformDocument = yield call(
                getDocumentTransformer,
                fields,
                token,
            );

            preview = yield all(
                lines.map((line) => call(transformDocument, line)),
            );
        }

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
            REDUX_FORM_ARRAY_MOVE,
            REDUX_FORM_ARRAY_PUSH,
            REDUX_FORM_ARRAY_SPLICE,
        ],
        handleComputeFieldPreview,
    );
}
