import { call, select } from 'redux-saga/effects';

import { handleExportPublishedDatasetSuccess } from './exportPublishedDataset';
import getQueryString from '@lodex/frontend-common/utils/getQueryString';
import { fromSearch } from '../../selectors';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import downloadFile from '@lodex/frontend-common/utils/downloadFile';

describe('export saga', () => {
    describe('handleExportPublishedDatasetSuccess', () => {
        const saga = handleExportPublishedDatasetSuccess({
            // @ts-expect-error TS2741
            payload: { exportID: 'type' },
        });

        it('should select fromSearch.getAppliedFacets', () => {
            expect(saga.next().value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
        });

        it('should select fromSearch.getInvertedFacetKeys', () => {
            expect(saga.next().value).toEqual(
                select(fromSearch.getInvertedFacetKeys),
            );
        });

        it('should select fromSearch.getQuery', () => {
            expect(
                // @ts-expect-error TS2345
                saga.next([
                    {
                        field: {
                            name: 'aFacet',
                        },
                        value: 'aFacetValue',
                    },
                ]).value,
            ).toEqual(select(fromSearch.getQuery));
        });

        it('should select fromSearch.getSort', () => {
            // @ts-expect-error TS2345
            expect(saga.next('aFilter').value).toEqual(
                select(fromSearch.getSort),
            );
        });

        it('should call getQueryString', () => {
            expect(
                // @ts-expect-error TS2345
                saga.next({ sortBy: 'field', sortDir: 'ASC' }).value,
            ).toEqual(
                // @ts-expect-error TS2769
                call(getQueryString, {
                    match: 'aFilter',
                    facets: undefined,
                    invertedFacets: [
                        {
                            field: {
                                name: 'aFacet',
                            },
                            value: 'aFacetValue',
                        },
                    ],
                    uri: undefined,
                    sort: {
                        sortBy: 'field',
                        sortDir: 'ASC',
                    },
                }),
            );
        });

        it('should select fromUser.getExportPublishedDatasetRequest', () => {
            // @ts-expect-error TS2345
            expect(saga.next('queryString').value).toEqual(
                select(fromUser.getExportPublishedDatasetRequest, {
                    type: 'type',
                    queryString: 'queryString',
                }),
            );
        });

        it('should fetch request', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request', [], 'blob'),
            );
        });

        it('should call downloadFile with response', () => {
            // @ts-expect-error TS2345
            expect(saga.next({ response: 'response' }).value).toEqual(
                call(downloadFile, 'response', undefined),
            );
        });
    });
});
