import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadDatasetPageError,
    loadDatasetPageSuccess,
} from './';

import { handleLoadDatasetPageRequest } from './sagas';
import { getLoadDatasetPageRequest } from '../fetch/';
import fetchSaga from '../lib/fetchSaga';

describe('dataset saga', () => {
    describe('handleLoadDatasetPageRequest', () => {
        const saga = handleLoadDatasetPageRequest({ payload: { page: 10, perPage: 42 } });

        it('should select getLoadDatasetPageRequest', () => {
            expect(saga.next().value).toEqual(select(getLoadDatasetPageRequest, { page: 10, perPage: 42 }));
        });

        it('should call fetchDafetchSagataset with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadDatasetPageSuccess action', () => {
            expect(saga.next({ response: { data: [{ foo: 42 }], total: 100 } }).value)
                .toEqual(put(loadDatasetPageSuccess({
                    dataset: [{ foo: 42 }],
                    page: 10,
                    total: 100,
                })));
        });

        it('should put loadDatasetPageError action with error if any', () => {
            const failedSaga = handleLoadDatasetPageRequest({ payload: { page: 0, perPage: 20 } });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(loadDatasetPageError('foo')));
        });
    });
});
