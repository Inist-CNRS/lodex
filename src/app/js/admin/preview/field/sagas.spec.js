import { all, call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { getFieldFormData } from '../../../fields/selectors';
import { fromUser } from '../../../sharedSelectors';
import { computeFieldPreviewSuccess, computeFieldPreviewError } from './';
import { fromParsing } from '../../selectors';
import { handleComputeFieldPreview } from './sagas';
import { FIELD_FORM_NAME } from '../../../fields/index';

describe('field saga', () => {
    describe('handleComputeFieldPreview', () => {
        const saga = handleComputeFieldPreview({
            meta: { form: FIELD_FORM_NAME },
        });
        const token = 'token';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should select fromParsing.getExcerptLines', () => {
            expect(saga.next('fieldFormData').value).toEqual(
                select(fromParsing.getExcerptLines),
            );
        });

        it('should select getToken', () => {
            expect(saga.next(lines).value).toEqual(select(fromUser.getToken));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            expect(saga.next(token).value).toEqual(
                call(getDocumentTransformer, ['fieldFormData'], token),
            );
        });

        it('should call transformDocument for each lines', () => {
            expect(saga.next(transformDocument).value).toEqual(
                all(lines.map(line => call(transformDocument, line))),
            );
        });

        it('should put computePreviewSuccess action', () => {
            expect(saga.next('preview').value).toEqual(
                put(computeFieldPreviewSuccess('preview')),
            );
        });

        it('should put computePreviewError action with error if any', () => {
            const failedSaga = handleComputeFieldPreview({
                meta: { form: FIELD_FORM_NAME },
            });
            const error = { message: 'foo' };
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.throw(error).value).toEqual(
                put(computeFieldPreviewError(error)),
            );
        });

        it('should do nothing if meta.form is not FIELD_FORM_NAME', () => {
            const saga = handleComputeFieldPreview({
                meta: { field: 'other form' },
            });
            expect(saga.next()).toEqual({
                value: undefined,
                done: true,
            });
        });
    });
});
