import expect from 'expect';
import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { LOGIN, LOGIN_FORM_NAME, loginSuccess } from './reducers';

import userSaga, { fetchLogin, handleLoginRequest, watchLoginRequest } from './sagas';

describe('user saga', () => {
    describe('handleLoginRequest', () => {
        const saga = handleLoginRequest({ payload: { username: 'foo', password: 'pwd' } });

        it('should put the startSubmit action for login form', () => {
            expect(saga.next().value).toEqual(put(startSubmit(LOGIN_FORM_NAME)));
        });

        it('should call fetchLogin with credentials from action', () => {
            expect(saga.next().value).toEqual(call(fetchLogin, { username: 'foo', password: 'pwd' }));
        });

        it('should put loginSuccess action with the token from fetchLogin', () => {
            expect(saga.next({ token: 'foo' }).value).toEqual(put(loginSuccess('foo')));
        });

        it('should put stopSubmit action for login form', () => {
            expect(saga.next({ token: 'foo' }).value).toEqual(put(stopSubmit(LOGIN_FORM_NAME)));
        });

        it('should put stopSubmit action for login form with error if any', () => {
            const failedSaga = handleLoginRequest({ payload: { username: 'foo', password: 'pwd' } });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.throw({ message: 'foo' }).value).toEqual(put(stopSubmit(LOGIN_FORM_NAME, { _error: 'foo' })));
        });
    });
});
