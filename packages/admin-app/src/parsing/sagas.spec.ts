import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';

import {
    loadParsingResultError,
    loadParsingResultSuccess,
    LOAD_PARSING_RESULT,
} from './index';

import { fromUser } from '../../../../src/app/js/sharedSelectors';

import { handleLoadParsingResult } from './sagas';

describe('parsing saga', () => {
    describe('handleLoadParsingResult', () => {
        // @ts-expect-error TS2554
        const saga = handleLoadParsingResult({ type: LOAD_PARSING_RESULT });

        it('should select getLoadParsingResultRequest', () => {
            expect(saga.next().value).toEqual(
                select(fromUser.getLoadParsingResultRequest),
            );
        });

        it('should call fetchSaga with the request', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loadParsingResultSuccess action', () => {
            // @ts-expect-error TS2345
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(loadParsingResultSuccess('foo')),
            );
        });

        it('should put loadParsingResultError action with error if any', () => {
            // @ts-expect-error TS2554
            const failedSaga = handleLoadParsingResult({
                type: LOAD_PARSING_RESULT,
            });
            failedSaga.next();
            failedSaga.next();
            // @ts-expect-error TS2345
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(loadParsingResultError('foo')),
            );
        });
    });
});
