import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';
import { handlePublishRequest } from './sagas';

import { publishError } from './';

describe('publication saga', () => {
    describe('handlePublishRequest', () => {
        const saga = handlePublishRequest();

        it('should select getPublishRequest', () => {
            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getPublishRequest),
            );
        });

        it('should call fetchSaga with the request', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put publishError action with error from request if any', () => {
            const failedSaga = handlePublishRequest();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(publishError('foo')),
            );
        });
    });
});
