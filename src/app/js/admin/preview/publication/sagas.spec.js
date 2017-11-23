import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';

import { fromFields, fromUser } from '../../../sharedSelectors';
import {
    computePublicationPreviewSuccess,
    computePublicationPreviewError,
} from './';
import { fromParsing } from '../../selectors';
import { handleComputePublicationPreview } from './sagas';

describe('publication saga', () => {
    describe('handleComputePublicationPreview', () => {
        const saga = handleComputePublicationPreview();
        const token = 'token';
        const fields = 'fields';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select fromFields.getFields', () => {
            expect(saga.next().value).toEqual(
                select(fromFields.getFieldsForPreview),
            );
        });

        it('should select fromParsing.getExcerptLines', () => {
            expect(saga.next(fields).value).toEqual(
                select(fromParsing.getExcerptLines),
            );
        });

        it('should select getToken', () => {
            expect(saga.next(lines).value).toEqual(select(fromUser.getToken));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            expect(saga.next(token).value).toEqual(
                call(getDocumentTransformer, fields, token),
            );
        });

        it('should call transformDocument for each lines', () => {
            expect(saga.next(transformDocument).value).toEqual(
                lines.map(line => call(transformDocument, line)),
            );
        });

        it('should put computePreviewSuccess action', () => {
            expect(saga.next('preview').value).toEqual(
                put(computePublicationPreviewSuccess('preview')),
            );
        });

        it('should put computePreviewError action with error if any', () => {
            const failedSaga = handleComputePublicationPreview();
            const error = { message: 'foo' };
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.throw(error).value).toEqual(
                put(computePublicationPreviewError(error)),
            );
        });

        it('should end if no fields returned', () => {
            const it = handleComputePublicationPreview();
            expect(it.next().value).toEqual(
                select(fromFields.getFieldsForPreview),
            );
            expect(it.next([]).value).toEqual(
                select(fromParsing.getExcerptLines),
            );
            expect(it.next(lines).done).toBe(true);
        });

        it('should end if no lines returned', () => {
            const it = handleComputePublicationPreview();
            expect(it.next().value).toEqual(
                select(fromFields.getFieldsForPreview),
            );
            expect(it.next(fields).value).toEqual(
                select(fromParsing.getExcerptLines),
            );
            expect(it.next([]).done).toBe(true);
        });
    });
});
