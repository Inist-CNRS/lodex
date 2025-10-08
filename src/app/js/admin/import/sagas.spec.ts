import { call, take, put, select, race } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'redux-first-history';

import { fromUser } from '../../sharedSelectors';
import { importFieldsSuccess, importFieldsError, importFieldsClosed } from './';

import { loadModelFile } from '../../lib/loadFile';

import { handleLoadModel as handleLoadModelSaga } from './sagas';

describe('import model saga', () => {
    describe('handleLoadModel', () => {
        // @ts-expect-error TS7034
        let saga;

        beforeEach(() => {
            saga = handleLoadModelSaga({ payload: 'payload' });
        });

        it('should end if called with no action.payload', () => {
            // @ts-expect-error TS2554
            saga = handleLoadModelSaga();
            expect(saga.next().done).toBe(true);
        });

        it('should select getToken', () => {
            // @ts-expect-error TS7005
            const { value } = saga.next();

            expect(value).toEqual(select(fromUser.getToken));
        });

        it('should race call(loadModelFile) and take(LOCATION_CHANGE)', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            const { value } = saga.next('token');

            expect(value).toEqual(
                race({
                    loadModelFileStatus: call(
                        loadModelFile,
                        'payload',
                        'token',
                    ),
                    cancel: take([LOCATION_CHANGE]),
                }),
            );
        });

        it('should end if receiving cancel', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('token');
            // @ts-expect-error TS7005
            const { done } = saga.next({ cancel: true });
            expect(done).toBe(true);
        });

        it('should put importFieldsError if an error is thrown', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('token');
            const error = new Error('Boom');
            // @ts-expect-error TS7005
            const { value } = saga.throw(error);
            expect(value).toEqual(put(importFieldsError(error)));
        });

        it('should put importFieldsClosed after error', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('token');
            // @ts-expect-error TS7005
            saga.throw(new Error('Boom'));
            // @ts-expect-error TS7005
            const { value } = saga.next();
            expect(value).toEqual(put(importFieldsClosed()));
        });

        it('should put loadFileSuccess with file', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('token');
            // @ts-expect-error TS7005
            const { value } = saga.next({
                loadModelFileStatus: JSON.stringify({ hasEnrichments: false }),
            });
            expect(value).toEqual(
                put(importFieldsSuccess({ hasEnrichments: false })),
            );
        });

        it('should put importFieldsClosed after success', () => {
            // @ts-expect-error TS7005
            saga.next();
            // @ts-expect-error TS7005
            saga.next('token');
            // @ts-expect-error TS7005
            saga.next({ file: 'file' });
            // @ts-expect-error TS7005
            const { value } = saga.next();
            expect(value).toEqual(put(importFieldsClosed()));
        });
    });
});
