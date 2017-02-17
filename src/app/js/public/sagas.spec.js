import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadPublicationError,
    loadPublicationSuccess,
} from './';
import { getLoadPublicationRequest } from '../fetch';
import fetchSaga from '../lib/fetchSaga';

import { handleLoadPublicationRequest } from './sagas';

describe('publication saga', () => {
    describe('handleLoadPublicationRequest', () => {
        const saga = handleLoadPublicationRequest();

        it('should select getLoadPublicationRequest', () => {
            expect(saga.next().value).toEqual(select(getLoadPublicationRequest));
        });

        it('should call fetchPublication with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadPublicationSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(loadPublicationSuccess('foo')));
        });

        it('should put loadPublicationError action with error if any', () => {
            const failedSaga = handleLoadPublicationRequest();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(loadPublicationError('foo')));
        });
    });
});
