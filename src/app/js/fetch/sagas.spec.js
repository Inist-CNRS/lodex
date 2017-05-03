import expect from 'expect';
import { race, call, put, take } from 'redux-saga/effects';

import fetchSaga from '../lib/sagas/fetchSaga';

import {
    fetchError,
    fetchSuccess,
} from './';

import { handleFetch, filterAction } from './sagas';

describe('fetch', () => {
    describe('saga', () => {
        describe('handleFetch', () => {
            const saga = handleFetch({
                payload: 'config',
                meta: { name: 'name' },
            });

            it('should race a call to fetchSaga and cancel filterAction', () => {
                expect(saga.next().value).toEqual(race({
                    fetch: call(fetchSaga, 'config'),
                    cancel: take(filterAction),
                }));
            });

            it('should put fetchSuccess action', () => {
                expect(saga.next({
                    fetch: { response: 'foo' },
                }).value).toEqual(put(fetchSuccess({
                    response: 'foo',
                    name: 'name',
                })));
            });

            it('should put fetchError action with error if any', () => {
                const failedSaga = handleFetch({
                    payload: 'config',
                    meta: { name: 'name' },
                });
                failedSaga.next();
                expect(failedSaga.next({
                    fetch: { error: 'foo' },
                }).value).toEqual(put(fetchError({
                    error: 'foo',
                    name: 'name',
                })));
            });
        });
    });
});
