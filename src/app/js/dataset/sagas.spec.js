import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadDatasetPageError,
    loadDatasetPageSuccess,
} from './';
import { getToken } from '../user';

import { fetchDataset, handleLoadDatasetPageRequest } from './sagas';

describe('dataset saga', () => {
    describe('handleLoadDatasetPageRequest', () => {
        const saga = handleLoadDatasetPageRequest({ payload: { page: 10, perPage: 42 } });

        it('should select the jwt token', () => {
            expect(saga.next().value).toEqual(select(getToken));
        });

        it('should call fetchDataset with the jwt token', () => {
            expect(saga.next('token').value).toEqual(call(fetchDataset, 'token', 10, 42));
        });

        it('should put loadDatasetPageSuccess action', () => {
            expect(saga.next({ data: [{ foo: 42 }], total: 100 }).value)
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
            const error = { message: 'foo' };
            expect(failedSaga.throw(error).value)
                .toEqual(put(loadDatasetPageError(error)));
        });
    });
});
