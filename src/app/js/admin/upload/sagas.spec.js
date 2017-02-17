import expect from 'expect';
import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { getToken } from '../../user';
import {
    uploadFileSuccess,
    uploadFileError,
} from './';

import loadFile from '../../lib/loadFile';

import { uploadFile as uploadFileSaga } from './uploadFileSaga';

describe('parsing saga', () => {
    describe('handleLoadParsingResult', () => {
        let saga;

        beforeEach(() => {
            saga = uploadFileSaga({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            saga = uploadFileSaga();
            expect(saga.next().done).toBe(true);
        });

        it('should select getToken', () => {
            const { value } = saga.next();

            expect(value).toEqual(select(getToken));
        });

        it('should race call(loadFile) and take(LOCATION_CHANGE)', () => {
            saga.next();
            const { value } = saga.next('token');

            expect(value).toEqual(race({
                file: call(loadFile, 'payload', 'token'),
                cancel: take([LOCATION_CHANGE]),
            }));
        });

        it('should end if receiving cancel', () => {
            saga.next();
            saga.next('token');
            const { done } = saga.next({ cancel: true });
            expect(done).toBe(true);
        });

        it('should put uploadFileError if an error is thrown', () => {
            saga.next();
            saga.next('token');
            const error = new Error('Boom');
            const { value } = saga.throw(error);
            expect(value).toEqual(put(uploadFileError(error)));
        });

        it('should put loadFileSuccess with file', () => {
            saga.next();
            saga.next('token');
            const { value } = saga.next({ file: 'file' });
            expect(value).toEqual(put(uploadFileSuccess('file')));
        });
    });
});
