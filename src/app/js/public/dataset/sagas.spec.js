import { call, put, select } from 'redux-saga/effects';

import {
    loadDatasetPage,
    loadDatasetPageError,
    loadDatasetPageSuccess,
} from './';

import {
    handleLoadDatasetPageRequest,
    handlePreLoadDatasetPage,
} from './sagas';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromDataset, fromFacet } from '../selectors';

describe('dataset saga', () => {
    describe('handleLoadDatasetPageRequest', () => {
        const saga = handleLoadDatasetPageRequest({});

        it('should select fromFacet.getAppliedFacets', () => {
            expect(saga.next().value).toEqual(
                select(fromFacet.getAppliedFacets),
            );
        });

        it('should select fromFacet.getInvertedFacets', () => {
            expect(
                saga.next([{ field: { name: 'aFacet' }, value: 'aFacetValue' }])
                    .value,
            ).toEqual(select(fromFacet.getInvertedFacets));
        });

        it('should select fromDataset.getFilter', () => {
            expect(saga.next(['facet']).value).toEqual(
                select(fromDataset.getFilter),
            );
        });

        it('should select fromDataset.getSort', () => {
            expect(saga.next('aFilter').value).toEqual(
                select(fromDataset.getSort),
            );
        });

        it('should select fromDataset.getDatasetCurrentPage', () => {
            expect(
                saga.next({ sortBy: 'field', sortDir: 'ASC' }).value,
            ).toEqual(select(fromDataset.getDatasetCurrentPage));
        });

        it('should select fromDataset.getDatasetPerPage', () => {
            expect(saga.next(10).value).toEqual(
                select(fromDataset.getDatasetPerPage),
            );
        });

        it('should select getLoadDatasetPageRequest', () => {
            expect(saga.next(20).value).toEqual(
                select(fromUser.getLoadDatasetPageRequest, {
                    match: 'aFilter',
                    facets: [
                        { field: { name: 'aFacet' }, value: 'aFacetValue' },
                    ],
                    invertedFacets: ['facet'],
                    sort: {
                        sortBy: 'field',
                        sortDir: 'ASC',
                    },
                    page: 10,
                    perPage: 20,
                }),
            );
        });

        it('should call fetchDafetchSagataset with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loadDatasetPageSuccess action', () => {
            expect(
                saga.next({
                    response: {
                        data: [{ foo: 42 }],
                        total: 100,
                        fullTotal: 1000,
                    },
                }).value,
            ).toEqual(
                put(
                    loadDatasetPageSuccess({
                        dataset: [{ foo: 42 }],
                        page: 10,
                        total: 100,
                        fullTotal: 1000,
                    }),
                ),
            );
        });

        it('should put loadDatasetPageError action with error if any', () => {
            const failedSaga = handleLoadDatasetPageRequest({});
            failedSaga.next();
            failedSaga.next([]);
            failedSaga.next([]);
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(loadDatasetPageError('foo')),
            );
        });
    });

    describe('handlePreLoadDatasetPage', () => {
        it('should select fromDataset.isDatasetLoaded', () => {
            const saga = handlePreLoadDatasetPage();
            const next = saga.next();

            expect(next.value).toEqual(select(fromDataset.isDatasetLoaded));
        });

        it('should end if dataset is loaded', () => {
            const saga = handlePreLoadDatasetPage();
            saga.next();
            const next = saga.next(true);

            expect(next.done).toBe(true);
        });

        it('should put loadDatasetPage if dataset is not loaded', () => {
            const saga = handlePreLoadDatasetPage();
            saga.next();
            const next = saga.next(false);

            expect(next.value).toEqual(put(loadDatasetPage()));
        });
    });
});
