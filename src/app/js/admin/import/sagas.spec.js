import expect from 'expect';
import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fromUser } from '../../sharedSelectors';
import { importFieldsSuccess, importFieldsError } from './';

import { loadModelFile } from '../../lib/loadFile';

import { handleLoadModel as handleLoadModelSaga } from './sagas';

describe('import model saga', () => {
    describe('handleLoadParsingResult', () => {
        let saga;

        beforeEach(() => {
            saga = handleLoadModelSaga({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            saga = handleLoadModelSaga();
            expect(saga.next().done).toBe(true);
        });

        it('should select getToken', () => {
            const { value } = saga.next();

            expect(value).toEqual(select(fromUser.getToken));
        });

        it('should race call(loadModelFile) and take(LOCATION_CHANGE)', () => {
            saga.next();
            const { value } = saga.next('token');

            expect(value).toEqual(
                race({
                    file: call(loadModelFile, 'payload', 'token'),
                    cancel: take([LOCATION_CHANGE]),
                }),
            );
        });

        it('should end if receiving cancel', () => {
            saga.next();
            saga.next('token');
            const { done } = saga.next({ cancel: true });
            expect(done).toBe(true);
        });

        it('should put importFieldsError if an error is thrown', () => {
            saga.next();
            saga.next('token');
            const error = new Error('Boom');
            const { value } = saga.throw(error);
            expect(value).toEqual(put(importFieldsError(error)));
        });

        it('should put loadFileSuccess with file', () => {
            saga.next();
            saga.next('token');
            const { value } = saga.next({ file: 'file' });
            expect(value).toEqual(put(importFieldsSuccess('file')));
        });
    });
});
