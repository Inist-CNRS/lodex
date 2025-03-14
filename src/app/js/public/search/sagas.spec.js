import { select, call } from 'redux-saga/effects';
import { doSearchRequest } from './sagas';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromSearch } from '../selectors';

describe('search sagas', () => {
    describe('doSearchRequest', () => {
        it('should keep filter empty when getMyAnnotationsFilter selector return null', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getMyAnnotationsFilter),
            );
            expect(gen.next(null).value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next(['uri1', 'uri2']).value).toEqual(
                select(fromSearch.getSort),
            );
            expect(gen.next('sortData').value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
            expect(gen.next({}).value).toEqual(
                select(fromSearch.getInvertedFacetKeys),
            );
            expect(gen.next(['inverted', 'facet', 'keys']).value).toEqual(
                select(fromUser.getLoadDatasetPageRequest, {
                    match: 'queryValue',
                    sort: 'sortData',
                    perPage: 10,
                    page: 0,
                    facets: {},
                    invertedFacets: ['inverted', 'facet', 'keys'],
                    filters: {},
                }),
            );
            expect(gen.next('request object').value).toEqual(
                call(fetchSaga, 'request object'),
            );
            expect(gen.next().done).toBe(true);
        });

        it('should add resourceUris filter when getMyAnnotationsFilter selector return my-annotations', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getMyAnnotationsFilter),
            );
            expect(gen.next('my-annotations').value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next(['uri1', 'uri2']).value).toEqual(
                select(fromSearch.getSort),
            );
            expect(gen.next('sortData').value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
            expect(gen.next({}).value).toEqual(
                select(fromSearch.getInvertedFacetKeys),
            );
            expect(gen.next(['inverted', 'facet', 'keys']).value).toEqual(
                select(fromUser.getLoadDatasetPageRequest, {
                    match: 'queryValue',
                    sort: 'sortData',
                    perPage: 10,
                    page: 0,
                    facets: {},
                    invertedFacets: ['inverted', 'facet', 'keys'],
                    filters: {
                        resourceUris: ['uri1', 'uri2'],
                    },
                }),
            );
            expect(gen.next('request object').value).toEqual(
                call(fetchSaga, 'request object'),
            );
            expect(gen.next().done).toBe(true);
        });

        it('should add excludedResourceUris filter when getMyAnnotationsFilter selector return not-my-annotations', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getMyAnnotationsFilter),
            );
            expect(gen.next('not-my-annotations').value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next(['uri1', 'uri2']).value).toEqual(
                select(fromSearch.getSort),
            );
            expect(gen.next('sortData').value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
            expect(gen.next({}).value).toEqual(
                select(fromSearch.getInvertedFacetKeys),
            );
            expect(gen.next(['inverted', 'facet', 'keys']).value).toEqual(
                select(fromUser.getLoadDatasetPageRequest, {
                    match: 'queryValue',
                    sort: 'sortData',
                    perPage: 10,
                    page: 0,
                    facets: {},
                    invertedFacets: ['inverted', 'facet', 'keys'],
                    filters: {
                        excludedResourceUris: ['uri1', 'uri2'],
                    },
                }),
            );
            expect(gen.next('request object').value).toEqual(
                call(fetchSaga, 'request object'),
            );
            expect(gen.next().done).toBe(true);
        });

        it('should parse appliedFacet', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getMyAnnotationsFilter),
            );
            expect(gen.next(null).value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next().value).toEqual(select(fromSearch.getSort));
            expect(gen.next('sortData').value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
            expect(
                gen.next({
                    appliedFacet1: [{ id: '1' }, { id: '2' }],
                    appliedFacet2: [{ id: '3' }, { id: '4' }],
                }).value,
            ).toEqual(select(fromSearch.getInvertedFacetKeys));
            expect(gen.next(['inverted', 'facet', 'keys']).value).toEqual(
                select(fromUser.getLoadDatasetPageRequest, {
                    match: 'queryValue',
                    sort: 'sortData',
                    perPage: 10,
                    page: 0,
                    facets: {
                        appliedFacet1: ['1', '2'],
                        appliedFacet2: ['3', '4'],
                    },
                    invertedFacets: ['inverted', 'facet', 'keys'],
                    filters: {},
                }),
            );
            expect(gen.next('request object').value).toEqual(
                call(fetchSaga, 'request object'),
            );
            expect(gen.next().done).toBe(true);
        });
    });
});
