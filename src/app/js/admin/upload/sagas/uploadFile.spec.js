import expect from 'expect';
import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fromUser } from '../../../sharedSelectors';
import { fromPublication } from '../../selectors';
import { uploadSuccess, uploadError } from '../';
import { loadDatasetFile } from '../../../lib/loadFile';
import fetch from '../../../lib/fetch';
import { handleUploadFile as uploadFileSaga } from './uploadFile';

describe('parsing saga', () => {
    describe('handleUploadFile', () => {
        let saga;

        beforeEach(() => {
            saga = uploadFileSaga({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            saga = uploadFileSaga();
            expect(saga.next().done).toBe(true);
        });

        it('should select fromPublication.hasPublishedDataset', () => {
            const { value } = saga.next();

            expect(value).toEqual(select(fromPublication.hasPublishedDataset));
        });

        it('should select getClearRequest and fetch it if hasPublishedDataset returned false', () => {
            saga.next();

            expect(saga.next(false).value).toEqual(
                select(fromUser.getClearUploadRequest),
            );

            expect(saga.next('clearUploadRequest').value).toEqual(
                call(fetch, 'clearUploadRequest'),
            );
        });

        it('should select getToken (skipping clearRequest) if hasPublishedDataset returned true', () => {
            saga.next();
            const { value } = saga.next(true);

            expect(value).toEqual(select(fromUser.getToken));
        });

        it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
            saga.next();
            saga.next(true);
            saga.next('parserName');
            const { value } = saga.next('token');

            expect(value).toEqual(
                race({
                    file: call(
                        loadDatasetFile,
                        'payload',
                        'token',
                        'parserName',
                    ),
                    cancel: take([LOCATION_CHANGE]),
                }),
            );
        });

        it('should end if receiving cancel', () => {
            saga.next();
            saga.next(true);
            saga.next('parserName');
            saga.next('token');
            const { done } = saga.next({ cancel: true });
            expect(done).toBe(true);
        });

        it('should put uploadError if an error is thrown', () => {
            saga.next();
            saga.next(true);
            saga.next('parserName');
            saga.next('token');
            const error = new Error('Boom');
            const { value } = saga.throw(error);
            expect(value).toEqual(put(uploadError(error)));
        });

        it('should put loadFileSuccess with file', () => {
            saga.next();
            saga.next(true);
            saga.next('parserName');
            saga.next('token');
            const { value } = saga.next({ file: 'file' });
            expect(value).toEqual(put(uploadSuccess('file')));
        });
    });
});
