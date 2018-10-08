import { call, select } from 'redux-saga/effects';

import { handleExportPublishedDatasetSuccess } from './exportPublishedDataset';
import getQueryString from '../../../lib/getQueryString';
import { fromDataset, fromFacet } from '../../selectors';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import downloadFile from '../../../lib/downloadFile';

describe('export saga', () => {
    describe('handleExportPublishedDatasetSuccess', () => {
        const saga = handleExportPublishedDatasetSuccess({
            payload: { type: 'type' },
        });

        it('should select fromFacet.getAppliedFacets', () => {
            expect(saga.next().value).toEqual(
                select(fromFacet.getAppliedFacets),
            );
        });

        it('should select fromDataset.getFilter', () => {
            expect(
                saga.next([
                    {
                        field: {
                            name: 'aFacet',
                        },
                        value: 'aFacetValue',
                    },
                ]).value,
            ).toEqual(select(fromDataset.getFilter));
        });

        it('should select fromDataset.getSort', () => {
            expect(saga.next('aFilter').value).toEqual(
                select(fromDataset.getSort),
            );
        });

        it('should call getQueryString', () => {
            expect(
                saga.next({ sortBy: 'field', sortDir: 'ASC' }).value,
            ).toEqual(
                call(getQueryString, {
                    match: 'aFilter',
                    facets: [
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
            expect(saga.next('queryString').value).toEqual(
                select(fromUser.getExportPublishedDatasetRequest, {
                    type: 'type',
                    queryString: 'queryString',
                }),
            );
        });

        it('should fetch request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request', [], 'blob'),
            );
        });

        it('should call downloadFile with response', () => {
            expect(saga.next({ response: 'response' }).value).toEqual(
                call(downloadFile, 'response', 'export.type'),
            );
        });
    });
});
