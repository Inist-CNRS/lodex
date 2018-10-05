import { call, put, select } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import fetchSaga from '../lib/sagas/fetchSaga';
import { LOGIN_FORM_NAME, loginSuccess } from './';
import { fromUser } from '../sharedSelectors';
import { handleLoginRequest } from './sagas';

describe('user saga', () => {
    describe('handleLoginRequest', () => {
        const saga = handleLoginRequest({
            payload: { username: 'foo', password: 'pwd' },
        });

        it('should put the startSubmit action for login form', () => {
            expect(saga.next().value).toEqual(
                put(startSubmit(LOGIN_FORM_NAME)),
            );
        });

        it('should select getLoginRequest', () => {
            expect(saga.next().value).toEqual(
                select(fromUser.getLoginRequest, {
                    username: 'foo',
                    password: 'pwd',
                }),
            );
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loginSuccess action with the token from fetchLogin', () => {
            expect(
                saga.next({ response: { token: 'foo', role: 'admin' } }).value,
            ).toEqual(put(loginSuccess({ token: 'foo', role: 'admin' })));
        });

        it('should put stopSubmit action for login form', () => {
            expect(saga.next().value).toEqual(put(stopSubmit(LOGIN_FORM_NAME)));
        });

        it('should put stopSubmit action for login form with error if any', () => {
            const failedSaga = handleLoginRequest({
                payload: { username: 'foo', password: 'pwd' },
            });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(
                failedSaga.next({ error: { message: 'foo' } }).value,
            ).toEqual(put(stopSubmit(LOGIN_FORM_NAME, { _error: 'foo' })));
        });
    });
});
