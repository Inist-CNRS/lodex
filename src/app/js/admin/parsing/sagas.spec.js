import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { getToken } from '../../user';

import { fetchParsingResult, handleLoadParsingResult } from './sagas';

describe('parsing saga', () => {
    describe('handleLoadParsingResult', () => {
        const saga = handleLoadParsingResult();

        it('should select the jwt token', () => {
            expect(saga.next().value).toEqual(select(getToken));
        });

        it('should call fetchParsingResult with the jwt token', () => {
            expect(saga.next('token').value).toEqual(call(fetchParsingResult, 'token'));
        });

        it('should put loadParsingResultSuccess action', () => {
            expect(saga.next({ result: true }).value).toEqual(put(loadParsingResultSuccess({ result: true })));
        });

        it('should put loadParsingResultError action with error if any', () => {
            const failedSaga = handleLoadParsingResult();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            const error = { message: 'foo' };
            expect(failedSaga.throw(error).value)
                .toEqual(put(loadParsingResultError(error)));
        });
    });
});
