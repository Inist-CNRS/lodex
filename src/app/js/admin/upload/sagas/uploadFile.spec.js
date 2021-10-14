import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { uploadSuccess, uploadError } from '../';
import { loadDatasetFile } from '../../../lib/loadFile';
import { handleUploadFile as uploadFileSaga } from './uploadFile';
import { FINISH_PROGRESS } from '../../progress/reducer';

describe('handleUploadFile saga', () => {
    let saga;

    beforeEach(() => {
        saga = uploadFileSaga({ payload: 'payload' });
    });

    it('should end if called with no action.payload', () => {
        saga = uploadFileSaga();
        expect(saga.next().done).toBe(true);
    });

    it('should select getLoaderName', () => {
        const { value } = saga.next();

        expect(value).toEqual(select(fromUpload.getLoaderName));
    });

    it('should select getToken', () => {
        saga.next();
        const { value } = saga.next('loaderName');

        expect(value).toEqual(select(fromUser.getToken));
    });

    it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
        saga.next();
        saga.next('loaderName');
        const { value } = saga.next('token');

        expect(value).toEqual(
            race({
                file: call(loadDatasetFile, 'payload', 'token', 'loaderName'),
            }),
        );
    });

    it('should put uploadError if an error is thrown', () => {
        saga.next();
        saga.next('loaderName');
        saga.next('token');
        const error = new Error('Boom');
        const { value } = saga.throw(error);
        expect(value).toEqual(put(uploadError(error)));
    });

    it('should take FINISH_PROGRESS', () => {
        saga.next();
        saga.next('loaderName');
        saga.next('token');
        const { value } = saga.next({ file: 'file' });
        expect(value).toEqual(take(FINISH_PROGRESS));
    });

    it('should put loadFileSuccess with file', () => {
        saga.next();
        saga.next('loaderName');
        saga.next('token');
        saga.next({ file: 'file' });
        const { value } = saga.next();
        expect(value).toEqual(put(uploadSuccess('file')));
    });
});
