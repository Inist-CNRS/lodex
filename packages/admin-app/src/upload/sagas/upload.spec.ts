import { call, put, select, take } from 'redux-saga/effects';

import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { importFinished, uploadSuccess, uploadError } from '../index';
import {
    LOAD_PARSING_RESULT_ERROR,
    LOAD_PARSING_RESULT_SUCCESS,
} from '../../parsing';
import { loadDatasetFile } from '@lodex/frontend-common/utils/loadFile';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { handleFinishUpload, handleUploadFile } from './uploadFile';
import { handleUploadUrl } from './uploadUrl';
import {
    forgetManualImportDismissal,
    rememberManualImportDismissal,
} from '../../siteWizard/wizardDismissal';
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

        // a reload during the import would open the wizard on the empty instance
        it('should remember the manual import once its file is sent', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('loaderName');
            // @ts-expect-error TS7005
            saga.next('customLoader');
            // @ts-expect-error TS7005
            saga.next('token');
            // @ts-expect-error TS7005
            expect(saga.next().value).toEqual(
                call(rememberManualImportDismissal),
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

    describe('the manual import dismissal of the wizard', () => {
        // runs an upload saga until its request answered
        const runUntilAnswered = (saga: Generator, answer: object) => {
            let step = saga.next();
            // the call of fetch, once the selects are answered
            while (!step.done && (step.value as any)?.payload?.fn !== fetch) {
                step = saga.next('request');
            }
            return saga.next(answer);
        };

        it.each([
            ['url', handleUploadUrl],
            ['text', () => handleUploadText()],
        ])('should be remembered once the %s is sent', (_, handle) => {
            expect(runUntilAnswered(handle(), {}).value).toEqual(
                call(rememberManualImportDismissal),
            );
        });

        it.each([
            ['url', handleUploadUrl],
            ['text', () => handleUploadText()],
        ])('should not be remembered when the %s is refused', (_, handle) => {
            const error = new Error('Boom');
            const saga = handle();
            runUntilAnswered(saga, { error });
            expect(saga.next().done).toBe(true);
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
        const success = importFinished({ success: true });
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            saga = handleFinishUpload(success);
        });

        // @ts-expect-error TS7006
        const runUntilUploadSuccess = (saga) => {
            saga.next();
            saga.next(true);
            return saga.next();
        };

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

        it('should wait for the parsing result before marking the upload as done', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            expect(saga.next(true).value).toEqual(
                take([LOAD_PARSING_RESULT_SUCCESS, LOAD_PARSING_RESULT_ERROR]),
            );
            // @ts-expect-error TS7005
            expect(saga.next().value).toEqual(put(uploadSuccess()));
        });

        it('should put uploadError and not republish when the import failed or was cancelled', () => {
            const failed = handleFinishUpload(
                importFinished({
                    success: false,
                    message: 'cancelled_import',
                }),
            );
            // the instance stays empty: the wizard may open by itself again
            expect(failed.next().value).toEqual(
                call(forgetManualImportDismissal),
            );
            failed.next();
            expect(failed.next(true).value).toEqual(
                put(uploadError(new Error('cancelled_import'))),
            );
            expect(failed.next().done).toBe(true);
        });

        it('should select hasPublishedDataset', () => {
            // @ts-expect-error TS7005
            runUntilUploadSuccess(saga);
            // @ts-expect-error TS7005
            const { value } = saga.next();
            expect(value).toEqual(select(fromPublication.hasPublishedDataset));
        });

        it('should put clearPublished if hasPublishedDataset is true', () => {
            // @ts-expect-error TS7005
            runUntilUploadSuccess(saga);
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next(true);
            expect(value).toEqual(put({ type: 'CLEAR_PUBLISHED' }));
        });

        it('should put publishAction if hasPublishedDataset is true', () => {
            // @ts-expect-error TS7005
            runUntilUploadSuccess(saga);
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
