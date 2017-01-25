import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import fetchSaga from '../../lib/fetchSaga';

import {
    getPublishRequest,
    publishError,
    publishSuccess,
} from './';

import { handlePublishRequest } from './sagas';

describe('publication saga', () => {
    describe('handlePublishRequest', () => {
        const saga = handlePublishRequest();

        it('should select getPublishRequest', () => {
            expect(saga.next().value).toEqual(select(getPublishRequest));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put publishSuccess action', () => {
            expect(saga.next({}).value).toEqual(put(publishSuccess()));
        });

        it('should put publishError action with error if any', () => {
            const failedSaga = handlePublishRequest();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(publishError('foo')));
        });
    });
});
