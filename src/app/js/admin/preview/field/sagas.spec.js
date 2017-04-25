import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { getFieldFormData } from '../../../fields';
import { getToken } from '../../../user';
import {
    computeFieldPreviewSuccess,
    computeFieldPreviewError,
} from './';
import { fromParsing } from '../../selectors';
import { handleComputeFieldPreview } from './sagas';

describe('field saga', () => {
    describe('handleComputeFieldPreview', () => {
        const saga = handleComputeFieldPreview();
        const token = 'token';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should select fromParsing.getExcerptLines', () => {
            expect(saga.next('fieldFormData').value).toEqual(select(fromParsing.getExcerptLines));
        });

        it('should select getToken', () => {
            expect(saga.next(lines).value).toEqual(select(getToken));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            expect(saga.next(token).value).toEqual(call(getDocumentTransformer, ['fieldFormData'], token));
        });

        it('should call transformDocument for each lines', () => {
            expect(saga.next(transformDocument).value).toEqual(lines.map(line => call(transformDocument, line)));
        });

        it('should put computePreviewSuccess action', () => {
            expect(saga.next('preview').value).toEqual(put(computeFieldPreviewSuccess('preview')));
        });

        it('should put computePreviewError action with error if any', () => {
            const failedSaga = handleComputeFieldPreview();
            const error = { message: 'foo' };
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.throw(error).value)
                .toEqual(put(computeFieldPreviewError(error)));
        });
    });
});
