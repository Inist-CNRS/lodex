import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../lib/getDocumentTransformer';


import { getToken } from '../../user';
import {
    computePreviewSuccess,
    computePreviewError,
} from './';
import { getFieldFormData } from '../fields';
import { fromFields, fromParsing } from '../selectors';
import { handleComputePreview } from './sagas';

describe('publication saga', () => {
    describe('handleComputePreview', () => {
        const saga = handleComputePreview();
        const token = 'token';
        const fields = 'fields';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select getToken', () => {
            expect(saga.next().value).toEqual(select(getToken));
        });

        it('should select getFieldFormData', () => {
            expect(saga.next(token).value).toEqual(select(getFieldFormData));
        });

        it('should select fromFields.getFields', () => {
            expect(saga.next('field form data').value)
                .toEqual(select(fromFields.getFieldsForPreview, 'field form data'));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            expect(saga.next(fields).value).toEqual(call(getDocumentTransformer, fields, token));
        });

        it('should select fromParsing.getExcerptLines', () => {
            expect(saga.next(transformDocument).value).toEqual(select(fromParsing.getExcerptLines));
        });

        it('should call transformDocument for each lines', () => {
            expect(saga.next(lines).value).toEqual(lines.map(line => call(transformDocument, line)));
        });

        it('should put computePreviewSuccess action', () => {
            expect(saga.next('preview').value).toEqual(put(computePreviewSuccess('preview')));
        });

        it('should put computePreviewError action with error if any', () => {
            const failedSaga = handleComputePreview();
            const error = { message: 'foo' };
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.throw(error).value)
                .toEqual(put(computePreviewError(error)));
        });
    });
});
