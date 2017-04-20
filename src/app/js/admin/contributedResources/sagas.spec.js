import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import { loadContributedResourcePageError, loadContributedResourcePageSuccess } from './';

import { handleLoadContributedResourcePageRequest } from './sagas';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { getLoadContributedResourcePageRequest } from '../../fetch/';
import { fromContributedResources } from '../selectors';

describe('load removed resources saga', () => {
    describe('handleLoadContributedResourcePageRequest', () => {
        const saga = handleLoadContributedResourcePageRequest({
            payload: {
                page: 10,
                perPage: 42,
            },
        });

        it('should select getRequestData', () => {
            expect(saga.next().value).toEqual(select(fromContributedResources.getRequestData));
        });

        it('should select getLoadContributedResourcePageRequest', () => {
            expect(saga.next({ page: 10, perPage: 42 }).value)
                .toEqual(select(getLoadContributedResourcePageRequest, {
                    page: 10,
                    perPage: 42,
                }));
        });

        it('should call fetchDafetchSagataset with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadContributedResourcePageSuccess action', () => {
            expect(saga.next({
                response: {
                    data: [
                        {
                            foo: 42,
                        },
                    ],
                    total: 100,
                },
            }).value).toEqual(put(loadContributedResourcePageSuccess({
                resources: [
                    {
                        foo: 42,
                    },
                ],
                page: 10,
                total: 100,
            })));
        });

        it('should put loadContributedResourcePageError action with error if any', () => {
            const failedSaga = handleLoadContributedResourcePageRequest();
            failedSaga.next();
            failedSaga.next({ page: 0, perPage: 20 });
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(put(loadContributedResourcePageError('foo')));
        });
    });
});
