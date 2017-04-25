import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    loadFieldError,
    loadFieldSuccess,
} from '../';

import { getLoadFieldRequest } from '../../fetch/';

import {
    handleLoadField,
} from './loadFields';

describe('fields saga', () => {
    describe('handleLoadField', () => {
        const saga = handleLoadField();

        it('should select getLoadFieldRequest', () => {
            expect(saga.next().value).toEqual(select(getLoadFieldRequest));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(loadFieldSuccess('foo')));
        });

        it('should put loadParsingResultError action with error if any', () => {
            const failedSaga = handleLoadField();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(loadFieldError('foo')));
        });
    });
});
