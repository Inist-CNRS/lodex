import expect from 'expect';
import { call, select } from 'redux-saga/effects';


import { handleExportPublishedDatasetSuccess, open } from './exportPublishedDataset';
import getQueryString from '../../../lib/getQueryString';
import { fromDataset, fromFacet } from '../../selectors';

describe('export saga', () => {
    describe('handleExportPublishedDatasetSuccess', () => {
        const saga = handleExportPublishedDatasetSuccess({ payload: { type: 'type' } });

        it('should select fromFacet.getAppliedFacets', () => {
            expect(saga.next().value).toEqual(select(fromFacet.getAppliedFacets));
        });

        it('should select fromDataset.getFilter', () => {
            expect(saga.next([
                {
                    field: {
                        name: 'aFacet',
                    },
                    value: 'aFacetValue',
                },
            ]).value).toEqual(select(fromDataset.getFilter));
        });

        it('should select fromDataset.getSort', () => {
            expect(saga.next('aFilter').value).toEqual(select(fromDataset.getSort));
        });

        it('should call getQueryString', () => {
            expect(saga.next({ sortBy: 'field', sortDir: 'ASC' }).value).toEqual(call(getQueryString, {
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
            }));
        });

        it('should call window.open with type and queryString', () => {
            expect(saga.next('queryString').value).toEqual(call(open, '/api/export/type?queryString'));
        });
    });
});
