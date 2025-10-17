import { call, put, select } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'redux-first-history';

import fetchSaga from '../lib/sagas/fetchSaga';
import { LOGIN_FORM_NAME, loginSuccess } from './';
import { fromUser, getCurrentSearch } from '../sharedSelectors';
import { handleLoginRequest } from './sagas';
import { ADMIN_ROLE } from '../../../common/tools/tenantTools';

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
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loginSuccess action with the token from fetchLogin', () => {
            expect(
                // @ts-expect-error TS2345
                saga.next({ response: { token: 'foo', role: ADMIN_ROLE } })
                    .value,
            ).toEqual(put(loginSuccess({ token: 'foo', role: ADMIN_ROLE })));
        });

        it('should redirect to the right page', () => {
            expect(saga.next().value).toEqual(select(getCurrentSearch));
            expect(saga.next().value).toEqual(put(push('/')));
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
                // @ts-expect-error TS2345
                failedSaga.next({ error: { message: 'foo' } }).value,
            ).toEqual(put(stopSubmit(LOGIN_FORM_NAME, { _error: 'foo' })));
        });
    });
});
