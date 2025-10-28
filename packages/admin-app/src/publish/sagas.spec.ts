import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import { handlePublishRequest } from './sagas';

import { publishError } from './index';

describe('publication saga', () => {
    describe('handlePublishRequest', () => {
        const saga = handlePublishRequest();

        it('should select getPublishRequest', () => {
            expect(saga.next().value).toEqual(
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
