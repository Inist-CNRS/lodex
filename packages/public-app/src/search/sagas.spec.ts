import { select, call } from 'redux-saga/effects';
import {
    addVisitedFilter,
    doSearchRequest,
    getAnnotationsFilter,
} from './sagas';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromSearch } from '../selectors';
import { getVisitedUris } from '../resource/useRememberVisit';

describe('search sagas', () => {
    describe('getAnnotationsFilter', () => {
        it('should return empty object if no annotations filter', () => {
            // @ts-expect-error TS2345
            expect(getAnnotationsFilter({})).toEqual({});
        });
        it('should return resourceUris if my-annotations', () => {
            expect(
                getAnnotationsFilter({
                    annotationsFilter: 'my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            ).toEqual({
                resourceUris: ['uri1', 'uri2'],
            });
        });
        it('should return excludedResourceUris if not-my-annotations', () => {
            expect(
                getAnnotationsFilter({
                    annotationsFilter: 'not-my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            ).toEqual({
                excludedResourceUris: ['uri1', 'uri2'],
            });
        });
        it('should return annotated if annotated', () => {
            expect(
                getAnnotationsFilter({
                    annotationsFilter: 'annotated',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            ).toEqual({
                annotated: true,
            });
        });
        it('should return not annotated if not-annotated', () => {
            expect(
                getAnnotationsFilter({
                    annotationsFilter: 'not-annotated',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            ).toEqual({
                annotated: false,
            });
        });
    });

    describe('addVisitedFilter', () => {
        it('should set visitedResourceUris to resourceUris if empty when filter is visited', () => {
            expect(
                addVisitedFilter({
                    filters: {
                        excludedResourceUris: ['uri3'],
                    },
                    visitedFilter: 'visited',
                    visitedResourceUris: ['uri1', 'uri2'],
                }),
            ).toEqual({
                resourceUris: ['uri1', 'uri2'],
                excludedResourceUris: ['uri3'],
            });
        });
        it('should set resourceUris to the intersection of previous resourceUris and visitedResourceUris when filter is visited', () => {
            expect(
                addVisitedFilter({
                    filters: {
                        resourceUris: ['uri1', 'uri3', 'uri4'],
                        excludedResourceUris: ['uri3'],
                    },
                    visitedFilter: 'visited',
                    visitedResourceUris: ['uri1', 'uri2', 'uri3'],
                }),
            ).toEqual({
                resourceUris: ['uri1', 'uri3'],
                excludedResourceUris: ['uri3'],
            });
        });

        it('should add visitedResourceUris to excludedResourceUris when filter is not visited', () => {
            expect(
                addVisitedFilter({
                    filters: {
                        resourceUris: ['uri3'],
                        excludedResourceUris: ['uri4'],
                    },
                    visitedFilter: 'not-visited',
                    visitedResourceUris: ['uri1', 'uri2'],
                }),
            ).toEqual({
                excludedResourceUris: ['uri4', 'uri1', 'uri2'],
                resourceUris: ['uri3'],
            });
        });

        it('should set visitedResourceUris to excludedResourceUris if empty when filter is not visited', () => {
            expect(
                addVisitedFilter({
                    filters: {
                        resourceUris: ['uri3'],
                    },
                    visitedFilter: 'not-visited',
                    visitedResourceUris: ['uri1', 'uri2'],
                }),
            ).toEqual({
                resourceUris: ['uri3'],
                excludedResourceUris: ['uri1', 'uri2'],
            });
        });

        it('should not add visitedResourceUris that are already in excludedResourceUris when filter is not visited', () => {
            expect(
                addVisitedFilter({
                    filters: {
                        resourceUris: ['uri3'],
                        excludedResourceUris: ['uri1'],
                    },
                    visitedFilter: 'not-visited',
                    visitedResourceUris: ['uri1', 'uri2'],
                }),
            ).toEqual({
                resourceUris: ['uri3'],
                excludedResourceUris: ['uri1', 'uri2'],
            });
        });

        it('should return filters if no visitedFilter', () => {
            expect(
                addVisitedFilter({
                    filters: { resourceUris: ['uri3'] },
                    visitedFilter: null,
                    visitedResourceUris: ['uri1', 'uri2'],
                }),
            ).toEqual({
                resourceUris: ['uri3'],
            });
        });
    });
    describe('doSearchRequest', () => {
        it('should retrieve query, facets, inverted facets, annotations filter, visited filter and sort', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getAnnotationsFilter),
            );
            expect(gen.next('my-annotations').value).toEqual(
                select(fromSearch.getVisitedFilter),
            );
            expect(gen.next(null).value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next(['uri1', 'uri2']).value).toEqual(
                call(getVisitedUris),
            );
            expect(gen.next([]).value).toEqual(select(fromSearch.getSort));
            expect(gen.next('sortData').value).toEqual(
                select(fromSearch.getAppliedFacets),
            );
            expect(gen.next({}).value).toEqual(
                select(fromSearch.getInvertedFacetKeys),
            );
            expect(gen.next(['inverted', 'facet', 'keys']).value).toEqual(
                call(getAnnotationsFilter, {
                    annotationsFilter: 'my-annotations',
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            );
            expect(gen.next({ resourceUris: ['uri1', 'uri2'] }).value).toEqual(
                call(addVisitedFilter, {
                    filters: {
                        resourceUris: ['uri1', 'uri2'],
                    },
                    visitedFilter: null,
                    visitedResourceUris: [],
                }),
            );
            expect(
                gen.next({
                    resourceUris: ['uri1', 'uri2'],
                }).value,
            ).toEqual(
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

        it('should parse appliedFacet', () => {
            const gen = doSearchRequest();
            expect(gen.next().value).toEqual(select(fromSearch.getQuery));
            expect(gen.next('queryValue').value).toEqual(
                select(fromSearch.getAnnotationsFilter),
            );
            expect(gen.next(null).value).toEqual(
                select(fromSearch.getVisitedFilter),
            );
            expect(gen.next(null).value).toEqual(
                select(fromSearch.getResourceUrisWithAnnotationFilter),
            );
            expect(gen.next(['uri1', 'uri2']).value).toEqual(
                call(getVisitedUris),
            );
            expect(gen.next([]).value).toEqual(select(fromSearch.getSort));
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
                call(getAnnotationsFilter, {
                    annotationsFilter: null,
                    resourceUrisWithAnnotation: ['uri1', 'uri2'],
                }),
            );
            expect(gen.next({}).value).toEqual(
                call(addVisitedFilter, {
                    filters: {},
                    visitedFilter: null,
                    visitedResourceUris: [],
                }),
            );
            expect(gen.next({}).value).toEqual(
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
