import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    getLoadRemovedResourcePageRequest,
    loadRemovedResourcePageError,
    loadRemovedResourcePageSuccess,
} from '../';

import { handleLoadRemovedResourcePageRequest } from './loadRemovedResource';
import fetchSaga from '../../../lib/fetchSaga';

describe('load removed resources saga', () => {
    describe('handleLoadRemovedResourcePageRequest', () => {
        const saga = handleLoadRemovedResourcePageRequest({ payload: { page: 10, perPage: 42 } });

        it('should select getLoadRemovedResourcePageRequest', () => {
            expect(saga.next().value).toEqual(select(getLoadRemovedResourcePageRequest, { page: 10, perPage: 42 }));
        });

        it('should call fetchDafetchSagataset with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadRemovedResourcePageSuccess action', () => {
            expect(saga.next({ response: { data: [{ foo: 42 }], total: 100 } }).value)
                .toEqual(put(loadRemovedResourcePageSuccess({
                    resources: [{ foo: 42 }],
                    page: 10,
                    total: 100,
                })));
        });

        it('should put loadRemovedResourcePageError action with error if any', () => {
            const failedSaga = handleLoadRemovedResourcePageRequest({ payload: { page: 0, perPage: 20 } });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(loadRemovedResourcePageError('foo')));
        });
    });
});
