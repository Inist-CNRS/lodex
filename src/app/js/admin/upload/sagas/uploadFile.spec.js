import { call, put, select } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { uploadSuccess, uploadError } from '../';
import { loadDatasetFile } from '../../../lib/loadFile';
import { handleFinishUpload, handleUploadFile } from './uploadFile';

describe('uploadFile', () => {
    describe('handleUploadFile saga', () => {
        let saga;

        beforeEach(() => {
            saga = handleUploadFile({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            saga = handleUploadFile();
            expect(saga.next().done).toBe(true);
        });

        it('should select getLoaderName', () => {
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.getLoaderName));
        });

        it('should select customLoader', () => {
            saga.next();
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.getCustomLoader));
        });

        it('should select getToken', () => {
            saga.next();
            saga.next('customLoader');
            const { value } = saga.next('loaderName');

            expect(value).toEqual(select(fromUser.getToken));
        });

        it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
            saga.next();
            saga.next('loaderName');
            saga.next('customLoader');
            const { value } = saga.next('token');

            expect(value).toEqual(
                call(
                    loadDatasetFile,
                    'payload',
                    'token',
                    'loaderName',
                    'customLoader',
                ),
            );
        });

        it('should put uploadError if an error is thrown', () => {
            saga.next();
            saga.next('loaderName');
            saga.next('customLoader');
            saga.next('token');
            const error = new Error('Boom');
            const { value } = saga.throw(error);
            expect(value).toEqual(put(uploadError(error)));
        });
    });
    describe('handleFinishUpload saga', () => {
        let saga;

        beforeEach(() => {
            saga = handleFinishUpload();
        });

        it('should select isUploadPending', () => {
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.isUploadPending));
        });

        it('should end if isUploadPending is false', () => {
            saga.next();
            expect(saga.next(false).done).toBe(true);
        });

        it('should put uploadSuccess', () => {
            saga.next();
            const { value } = saga.next(true);
            expect(value).toEqual(put(uploadSuccess()));
        });

        it('should select hasPublishedDataset', () => {
            saga.next();
            saga.next(true);
            const { value } = saga.next();
            expect(value).toEqual(select(fromPublication.hasPublishedDataset));
        });

        it('should put clearPublished if hasPublishedDataset is true', () => {
            saga.next();
            saga.next(true);
            saga.next();
            const { value } = saga.next(true);
            expect(value).toEqual(put({ type: 'CLEAR_PUBLISHED' }));
        });

        it('should put publishAction if hasPublishedDataset is true', () => {
            saga.next();
            saga.next(true);
            saga.next();
            saga.next(true);
            const { value } = saga.next();
            expect(value).toEqual(put({ type: 'PUBLISH' }));
        });
    });
});
