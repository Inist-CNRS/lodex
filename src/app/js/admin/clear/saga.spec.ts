import { call, select } from 'redux-saga/effects';

import {
    handleClearDatasetRequest,
    handleClearPublishedRequest,
} from './sagas';

import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';

describe('load clear saga', () => {
    describe('handleClearDatasetRequest', () => {
        const saga = handleClearDatasetRequest();
        it('should select getClearDatasetRequest', () => {
            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getClearDatasetRequest),
            );
        });

        it('should call handleClearDatasetRequest', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });
    });

    describe('handleClearPublishedRequest', () => {
        const saga = handleClearPublishedRequest();
        it('should select getClearPublishedRequest', () => {
            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getClearPublishedRequest),
            );
        });

        it('should call handleClearPublishedRequest', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });
    });
});
