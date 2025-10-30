import { call, put, select } from 'redux-saga/effects';

import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { uploadSuccess, uploadError } from '../index';
import { loadDatasetFile } from '@lodex/frontend-common/utils/loadFile';
import { handleFinishUpload, handleUploadFile } from './uploadFile';
import { handleUploadUrl } from './uploadUrl';
import { handleUploadText } from './uploadText';

describe('upload', () => {
    describe('handleUploadFile saga', () => {
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            saga = handleUploadFile({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            // @ts-expect-error TS2554
            saga = handleUploadFile();
            expect(saga.next().done).toBe(true);
        });

        it('should select getLoaderName', () => {
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.getLoaderName));
        });

        it('should select customLoader', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.getCustomLoader));
        });

        it('should select getToken', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            const { value } = saga.next('loaderName');

            expect(value).toEqual(select(fromUser.getToken));
        });

        it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('loaderName');
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
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
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('loaderName');
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            saga.next('token');
            const error = new Error('Boom');
            // @ts-expect-error TS7005
            const { value } = saga.throw(error);
            expect(value).toEqual(put(uploadError(error)));
        });
    });

    describe('handleUploadUrl saga', () => {
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            saga = handleUploadUrl();
        });

        it('should select getLoaderName', () => {
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUpload.getLoaderName)),
            );
        });

        it('should select customLoader', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUpload.getCustomLoader)),
            );
        });

        it('should select getToken', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            const { value } = saga.next('loaderName');

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUser.getToken)),
            );
        });

        it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('loaderName');
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            const { value } = saga.next('token');

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(
                    select(fromUser.getUploadUrlRequest, {
                        url: 'loaderName',
                        loaderName: 'customLoader',
                        customLoader: 'token',
                    }),
                ),
            );
        });
    });

    describe('handleUploadText saga', () => {
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            // @ts-expect-error TS2554
            saga = handleUploadText({ payload: 'payload' });
        });

        it('should select getLoaderName', () => {
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUpload.getLoaderName)),
            );
        });

        it('should select customLoader', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUpload.getCustomLoader)),
            );
        });

        it('should select getToken', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            const { value } = saga.next('loaderName');

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(select(fromUser.getToken)),
            );
        });

        it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('loaderName');
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            const { value } = saga.next('token');

            expect(JSON.stringify(value)).toEqual(
                JSON.stringify(
                    select(fromUser.getUploadTextRequest, {
                        text: 'loaderName',
                        loaderName: 'customLoader',
                        customLoader: 'token',
                    }),
                ),
            );
        });
    });

    describe('handleFinishUpload saga', () => {
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            saga = handleFinishUpload();
        });

        it('should select isUploadPending', () => {
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(value).toEqual(select(fromUpload.isUploadPending));
        });

        it('should end if isUploadPending is false', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            expect(saga.next(false).done).toBe(true);
        });

        it('should put uploadSuccess', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next(true);
            expect(value).toEqual(put(uploadSuccess()));
        });

        it('should select hasPublishedDataset', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next(true);
            // @ts-expect-error TS7005
            const { value } = saga.next();
            expect(value).toEqual(select(fromPublication.hasPublishedDataset));
        });

        it('should put clearPublished if hasPublishedDataset is true', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next(true);
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next(true);
            expect(value).toEqual(put({ type: 'CLEAR_PUBLISHED' }));
        });

        it('should put publishAction if hasPublishedDataset is true', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next(true);
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next(true);
            // @ts-expect-error TS7005
            const { value } = saga.next();
            expect(value).toEqual(put({ type: 'PUBLISH' }));
        });
    });
});
