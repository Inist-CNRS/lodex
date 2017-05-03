import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';

import { fromUser } from '../../sharedSelectors';

import {
    handleLoadParsingResult,
} from './sagas';

describe('parsing saga', () => {
    describe('handleLoadParsingResult', () => {
        const saga = handleLoadParsingResult();

        it('should select getLoadParsingResultRequest', () => {
            expect(saga.next().value).toEqual(select(fromUser.getLoadParsingResultRequest));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadParsingResultSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(loadParsingResultSuccess('foo')));
        });

        it('should put loadParsingResultError action with error if any', () => {
            const failedSaga = handleLoadParsingResult();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(loadParsingResultError('foo')));
        });
    });
});
