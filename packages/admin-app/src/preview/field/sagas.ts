import { call, all, put, select, takeLatest } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';

import getDocumentTransformer from '@lodex/frontend-common/utils/getDocumentTransformer';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { computeFieldPreviewSuccess, computeFieldPreviewError } from './index';
import { fromParsing } from '../../selectors';
import { GET_SOURCE_VALUE_FROM_TRANSFORMERS } from '../../fields/sourceValue/SourceValueToggle';
import { prepareFieldFormData } from '@lodex/frontend-common/fields/sagas/saveField';
import { LODEX_FIELD_FORM_CHANGE } from '@lodex/frontend-common/fields/reducer';
import type { PreviewLine } from '@lodex/frontend-common/fields/types';

// @ts-expect-error TS7031
export function* handleComputeFieldPreview({ payload: { values } }) {
    try {
        // @ts-expect-error TS7057
        const formData = yield call(prepareFieldFormData, values);

        const { source } = GET_SOURCE_VALUE_FROM_TRANSFORMERS(
            formData.transformers,
            !!formData.subresourceId,
        );

        const isFromColumnsForSubRessourceField =
            source === 'fromColumnsForSubRessource';

        // we need to deep clone the formData to avoid mutating it
        const fields = [cloneDeep(formData)];

        // @ts-expect-error TS7057
        const lines = yield select(fromParsing.getExcerptLines);

        // @ts-expect-error TS7057
        const token = yield select(fromUser.getToken);

        let preview: PreviewLine[] = [];
        if (isFromColumnsForSubRessourceField) {
            // we keep the three first transformers (COLUMN, PARSE, GET) in fields to get the subresource data
            // other transformers will be used to transform the subresource data
            const subresourceTransformers = fields[0].transformers.splice(3);
            // @ts-expect-error TS7057
            const getSubresourceData = yield call(
                getDocumentTransformer,
                fields,
                token,
            );
            preview = yield all(
                // @ts-expect-error TS7006
                lines.map((line) => call(getSubresourceData, line)),
            );

            // if there is other transformers we have to apply them to transform the preview
            if (subresourceTransformers.length > 0) {
                const subresourceData = preview.map(
                    (subresourceLine) => subresourceLine[formData.name],
                );

                // use the subresource transformers to transform the subresource data
                fields[0].transformers = subresourceTransformers;
                // @ts-expect-error TS7057
                const transformSubresource = yield call(
                    getDocumentTransformer,
                    fields,
                    token,
                );

                preview = yield all(
                    subresourceData.map(function* (subresourceLine) {
                        if (Array.isArray(subresourceLine)) {
                            // @ts-expect-error TS7057
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
                                    // @ts-expect-error TS7006
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
            // @ts-expect-error TS7057
            const transformDocument = yield call(
                getDocumentTransformer,
                fields,
                token,
            );

            preview = yield all(
                // @ts-expect-error TS7006
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
        // @ts-expect-error TS2769
        [LODEX_FIELD_FORM_CHANGE],
        handleComputeFieldPreview,
    );
}
