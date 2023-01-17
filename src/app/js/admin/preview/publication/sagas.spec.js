import { call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../../lib/getDocumentTransformer';
import { fromFields, fromUser } from '../../../sharedSelectors';
import { fromParsing, fromPublication } from '../../selectors';
import { publish } from '../../publish';

import {
    handleComputePublicationPreview,
    handleRecomputePublication,
} from './sagas';

import {
    computePublicationPreviewSuccess,
    computePublicationPreviewError,
} from './';

describe('publication saga', () => {
    describe('handleRecomputePublication', () => {
        it('should return if not published', () => {
            const saga = handleRecomputePublication();

            expect(saga.next().value).toEqual(
                select(fromPublication.hasPublishedDataset),
            );

            expect(saga.next(false).done).toBe(true);
        });

        describe('if published', () => {
            const saga = handleRecomputePublication();
            saga.next();

            it('should put publish', () => {
                expect(saga.next(true).value).toEqual(put(publish()));
            });
        });
    });

    describe('handleComputePublicationPreview', () => {
        const saga = handleComputePublicationPreview();
        const token = 'token';
        const fields = 'fields';
        const lines = ['line1', 'line2'];
        const transformDocument = () => {};

        it('should select fromFields.getFields', () => {
            expect(saga.next().value).toEqual(select(fromFields.getFields));
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
            expect(it.next().value).toEqual(select(fromFields.getFields));
            expect(it.next([]).value).toEqual(
                select(fromParsing.getExcerptLines),
            );
            expect(it.next(lines).done).toBe(true);
        });

        it('should end if no lines returned', () => {
            const it = handleComputePublicationPreview();
            expect(it.next().value).toEqual(select(fromFields.getFields));
            expect(it.next(fields).value).toEqual(
                select(fromParsing.getExcerptLines),
            );
            expect(it.next([]).done).toBe(true);
        });
    });
});
