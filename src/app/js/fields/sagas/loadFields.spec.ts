import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import { loadFieldError, loadFieldSuccess } from '../';

import { fromUser } from '../../sharedSelectors';

import { handleLoadField } from './loadFields';

describe('fields saga', () => {
    describe('handleLoadField', () => {
        const saga = handleLoadField();

        it('should select getLoadFieldRequest', () => {
            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getLoadFieldRequest),
            );
        });

        it('should call fetchSaga with the request', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loadFieldSuccess action', () => {
            // @ts-expect-error TS2345
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(loadFieldSuccess('foo')),
            );
        });

        it('should put loadParsingResultError action with error if any', () => {
            const failedSaga = handleLoadField();
            failedSaga.next();
            failedSaga.next();
            // @ts-expect-error TS2345
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(loadFieldError('foo')),
            );
        });
    });
});
