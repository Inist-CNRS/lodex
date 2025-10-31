import { all, call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '@lodex/frontend-common/utils/getDocumentTransformer.ts';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { computeFieldPreviewSuccess, computeFieldPreviewError } from './index';
import { fromParsing } from '../../selectors';
import { handleComputeFieldPreview } from './sagas';
import { prepareFieldFormData } from '@lodex/frontend-common/fields/sagas/saveField.ts';

describe('field saga', () => {
    describe('handleComputeFieldPreview', () => {
        const formValues = {
            label: 'field label',
        };
        const saga = handleComputeFieldPreview({
            payload: { values: formValues },
        });
        const token = 'token';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(
                call(prepareFieldFormData, formValues),
            );
        });

        it('should select fromParsing.getExcerptLines', () => {
            // @ts-expect-error TS2345
            expect(saga.next('fieldFormData').value).toEqual(
                select(fromParsing.getExcerptLines),
            );
        });

        it('should select getToken', () => {
            // @ts-expect-error TS2345
            expect(saga.next(lines).value).toEqual(select(fromUser.getToken));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            // @ts-expect-error TS2345
            expect(saga.next(token).value).toEqual(
                call(getDocumentTransformer, ['fieldFormData'], token),
            );
        });

        it('should call transformDocument for each lines', () => {
            // @ts-expect-error TS2345
            expect(saga.next(transformDocument).value).toEqual(
                // @ts-expect-error TS2769
                all(lines.map((line) => call(transformDocument, line))),
            );
        });

        it('should put computePreviewSuccess action', () => {
            // @ts-expect-error TS2345
            expect(saga.next('preview').value).toEqual(
                put(computeFieldPreviewSuccess('preview')),
            );
        });

        it('should put computePreviewError action with error if any', () => {
            const failedSaga = handleComputeFieldPreview({
                payload: { values: formValues },
            });
            const error = { message: 'foo' };
            failedSaga.next();
            expect(failedSaga.throw(error).value).toEqual(
                put(computeFieldPreviewError(error)),
            );
        });
    });
});
