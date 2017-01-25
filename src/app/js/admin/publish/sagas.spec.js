import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    publishError,
    publishSuccess,
} from './';
import { getToken } from '../../user';

import { fetchPublish, handlePublishRequest } from './sagas';

describe('publication saga', () => {
    describe('handlePublishRequest', () => {
        const saga = handlePublishRequest();

        it('should select the jwt token', () => {
            expect(saga.next().value).toEqual(select(getToken));
        });

        it('should call fetchPublish with the jwt token', () => {
            expect(saga.next('token').value).toEqual(call(fetchPublish, 'token'));
        });

        it('should put publishSuccess action', () => {
            expect(saga.next().value).toEqual(put(publishSuccess()));
        });

        it('should put publishError action with error if any', () => {
            const failedSaga = handlePublishRequest();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            const error = { message: 'foo' };
            expect(failedSaga.throw(error).value)
                .toEqual(put(publishError(error)));
        });
    });
});
