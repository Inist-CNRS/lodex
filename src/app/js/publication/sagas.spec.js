import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadPublicationError,
    loadPublicationSuccess,
} from './';
import { getToken } from '../user';

import { fetchPublication, handleLoadPublicationRequest } from './sagas';

describe('publication saga', () => {
    describe('handleLoadPublicationRequest', () => {
        const saga = handleLoadPublicationRequest();

        it('should select the jwt token', () => {
            expect(saga.next().value).toEqual(select(getToken));
        });

        it('should call fetchPublication with the jwt token', () => {
            expect(saga.next('token').value).toEqual(call(fetchPublication, 'token'));
        });

        it('should put loadPublicationSuccess action', () => {
            expect(saga.next().value).toEqual(put(loadPublicationSuccess()));
        });

        it('should put loadPublicationError action with error if any', () => {
            const failedSaga = handleLoadPublicationRequest();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            const error = { message: 'foo' };
            expect(failedSaga.throw(error).value)
                .toEqual(put(loadPublicationError(error)));
        });
    });
});
