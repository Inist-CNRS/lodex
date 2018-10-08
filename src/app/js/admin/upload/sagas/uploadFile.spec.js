import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { uploadSuccess, uploadError } from '../';
import { loadDatasetFile } from '../../../lib/loadFile';
import { handleUploadFile as uploadFileSaga } from './uploadFile';

describe('handleUploadFile saga', () => {
    let saga;

    beforeEach(() => {
        saga = uploadFileSaga({ payload: 'payload' });
    });

    it('should end if called with no action.payload', () => {
        saga = uploadFileSaga();
        expect(saga.next().done).toBe(true);
    });

    it('should select getParserName', () => {
        const { value } = saga.next();

        expect(value).toEqual(select(fromUpload.getParserName));
    });

    it('should select getToken', () => {
        saga.next();
        const { value } = saga.next('parserName');

        expect(value).toEqual(select(fromUser.getToken));
    });

    it('should race call(loadDatasetFile) and take(LOCATION_CHANGE)', () => {
        saga.next();
        saga.next('parserName');
        const { value } = saga.next('token');

        expect(value).toEqual(
            race({
                file: call(loadDatasetFile, 'payload', 'token', 'parserName'),
                cancel: take([LOCATION_CHANGE]),
            }),
        );
    });

    it('should end if receiving cancel', () => {
        saga.next();
        saga.next('parserName');
        saga.next('token');
        const { done } = saga.next({ cancel: true });
        expect(done).toBe(true);
    });

    it('should put uploadError if an error is thrown', () => {
        saga.next();
        saga.next('parserName');
        saga.next('token');
        const error = new Error('Boom');
        const { value } = saga.throw(error);
        expect(value).toEqual(put(uploadError(error)));
    });

    it('should put loadFileSuccess with file', () => {
        saga.next();
        saga.next('parserName');
        saga.next('token');
        const { value } = saga.next({ file: 'file' });
        expect(value).toEqual(put(uploadSuccess('file')));
    });
});
