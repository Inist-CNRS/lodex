import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import getDocumentTransformer from '../../../../common/getDocumentTransformer';
import fetchLineBy from '../../lib/fetchLineBy';


import { getToken } from '../../user';
import {
    computePreviewSuccess,
    computePreviewError,
} from './';

import { fromFields, fromParsing } from '../';
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

        it('should select fromFields.getFields', () => {
            expect(saga.next(token).value).toEqual(select(fromFields.getFields));
        });

        it('should call getDocumentTransformer with correct context and field', () => {
            expect(saga.next(fields).value).toEqual(call(getDocumentTransformer, {
                env: 'browser',
                token,
                fetchLineBy,
            }, fields));
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
