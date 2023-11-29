import { call, put, select, all } from 'redux-saga/effects';

import {
    handleLoadFormatDataRequest,
    handleFilterFormatDataRequest,
    loadFormatDataForName,
    loadFormatData,
    getQuery,
    getQueryType,
    splitPrecomputedNameAndRoutine,
} from './sagas';
import { loadFormatDataSuccess, loadFormatDataError } from './reducer';
import getQueryString from '../lib/getQueryString';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromDataset, fromFormat } from '../public/selectors';
import { fromFields, fromUser, fromCharacteristic } from '../sharedSelectors';
import { SCOPE_DATASET } from '../../../common/scope';

describe('format sagas', () => {
    describe('handleFilterFormatDataRequest', () => {
        it('should call loadFormatDataForName for every loaded field', () => {
            const it = handleFilterFormatDataRequest({
                payload: { filter: 'filter' },
            });
            expect(it.next()).toEqual({
                value: select(fromFormat.getCurrentFieldNames),
                done: false,
            });
            expect(it.next(['name1', 'name2'])).toEqual({
                value: all([
                    call(loadFormatDataForName, 'name1', 'filter'),
                    call(loadFormatDataForName, 'name2', 'filter'),
                ]),
                done: false,
            });
        });

        it('should not call loadFormatDataForName if no loaded field', () => {
            const it = handleFilterFormatDataRequest({
                payload: { filter: 'filter' },
            });
            expect(it.next()).toEqual({
                value: select(fromFormat.getCurrentFieldNames),
                done: false,
            });
            expect(it.next()).toEqual({
                done: true,
                value: undefined,
            });
        });
    });

    describe('loadFormatDataForName', () => {
        it('should call loadFormatData with request for given field name', () => {
            const it = loadFormatDataForName('name', { filter: 'data' });
            expect(it.next()).toEqual({
                value: select(fromFields.getFieldByName, 'name'),
                done: false,
            });
            expect(it.next({ scope: SCOPE_DATASET })).toEqual({
                value: select(
                    fromCharacteristic.getCharacteristicByName,
                    'name',
                ),
                done: false,
            });
            expect(it.next('url')).toEqual({
                value: select(fromFields.getGraphFieldParamsByName, 'name'),
                done: false,
            });
            expect(it.next({ params: 'data' })).toEqual({
                value: select(fromDataset.getAppliedFacets),
                done: false,
            });
            expect(
                it.next({
                    facetName: [{ value: 'facetValue', count: 1, id: 'id' }],
                }),
            ).toEqual({
                value: select(fromDataset.getInvertedFacetKeys),
                done: false,
            });
            expect(it.next('invertedFacets')).toEqual({
                value: select(fromDataset.getFilter),
                done: false,
            });
            expect(it.next('filter')).toEqual({
                value: call(getQueryString, {
                    facets: { facetName: ['facetValue'] },
                    invertedFacets: 'invertedFacets',
                    match: 'filter',
                    params: {
                        params: 'data',
                        filter: 'data',
                    },
                }),
                done: false,
            });
            expect(it.next('queryString')).toEqual({
                value: call(loadFormatData, 'name', '/url/', 'queryString'),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should not call loadFormatData if field scope is not dataset', () => {
            const it = loadFormatDataForName('name', { filter: 'data' });
            expect(it.next()).toEqual({
                value: select(fromFields.getFieldByName, 'name'),
                done: false,
            });
            expect(it.next({ scope: 'not dataset' })).toEqual({
                value: undefined,
                done: true,
            });
        });
    });

    describe('getQuery', () => {
        it('should return request for given query', () => {
            const it = getQuery('url', 'queryString');
            expect(it.next()).toEqual({
                value: call(getQueryType, 'url'),
                done: false,
            });
            expect(it.next('other')).toEqual({
                value: select(fromUser.getUrlRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should return sparql request if url is of type sparql', () => {
            const it = getQuery(
                'https://data.istex.fr/sparql/?query=select * where {?s ?c ?d }',
                'queryString',
            );
            expect(it.next()).toEqual({
                value: call(
                    getQueryType,
                    'https://data.istex.fr/sparql/?query=select * where {?s ?c ?d }',
                ),
                done: false,
            });
            expect(it.next('sparql')).toEqual({
                value: select(fromUser.getSparqlRequest, {
                    url: 'https://data.istex.fr/sparql/',
                    body: 'query=select * where {?s ?c ?d }',
                }),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should return istex request if url is of type istex', () => {
            const it = getQuery('url', 'queryString');
            expect(it.next()).toEqual({
                value: call(getQueryType, 'url'),
                done: false,
            });
            expect(it.next('istex')).toEqual({
                value: select(fromUser.getIstexRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });
    });

    describe('loadFormatData', () => {
        it('should call loadFormatDataSuccess with name and response', () => {
            const it = loadFormatData('name', 'url', 'queryString');
            expect(it.next()).toEqual({
                value: call(getQuery, 'url', 'queryString'),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ response: 'response' })).toEqual({
                value: put(
                    loadFormatDataSuccess({ name: 'name', data: 'response' }),
                ),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should call loadFormatDataSuccess with name and response.data if set', () => {
            const it = loadFormatData('name', 'url', 'queryString');
            expect(it.next()).toEqual({
                value: call(getQuery, 'url', 'queryString'),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ response: { data: 'data' } })).toEqual({
                value: put(
                    loadFormatDataSuccess({ name: 'name', data: 'data' }),
                ),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should call loadFormatDataSuccess with name and empty array if response.total is set at 0', () => {
            const it = loadFormatData('name', 'url', 'queryString');

            expect(it.next()).toEqual({
                value: call(getQuery, 'url', 'queryString'),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ response: { total: 0 } })).toEqual({
                value: put(
                    loadFormatDataSuccess({ name: 'name', data: [], total: 0 }),
                ),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should call loadFormatDataError if the request returned one', () => {
            const it = loadFormatData('name', 'url', 'queryString');

            expect(it.next()).toEqual({
                value: call(getQuery, 'url', 'queryString'),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ error: { message: 'failed to fetch' } })).toEqual({
                value: put(
                    loadFormatDataError({
                        name: 'name',
                        error: 'failed to fetch',
                    }),
                ),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });
    });

    describe('handleLoadFormatDataRequest', () => {
        it('should loadFormatData for field', () => {
            const iterator = handleLoadFormatDataRequest({
                payload: {
                    field: { name: 'fieldName' },
                    filter: { filterKey: 'filterValue' },
                    value: 'https://api.lodex.fr',
                    withUri: false,
                },
            });

            expect(iterator.next()).toEqual({
                done: false,
                value: select(
                    fromFields.getGraphFieldParamsByName,
                    'fieldName',
                ),
            });

            expect(iterator.next({ paramsKey: 'paramsValue' })).toEqual({
                done: false,
                value: call(getQueryString, {
                    params: {
                        filterKey: 'filterValue',
                        paramsKey: 'paramsValue',
                    },
                }),
            });

            expect(iterator.next('queryString')).toEqual({
                done: false,
                value: call(
                    loadFormatData,
                    'fieldName',
                    'https://api.lodex.fr/',
                    'queryString',
                ),
            });

            expect(iterator.next()).toEqual({
                done: true,
                value: undefined,
            });
        });

        it('should loadFormatData with the resource uri for field', () => {
            const iterator = handleLoadFormatDataRequest({
                payload: {
                    field: { name: 'fieldName' },
                    filter: { filterKey: 'filterValue' },
                    resource: { uri: 'thisIsAnUri' },
                    value: 'https://api.lodex.fr',
                    withUri: true,
                },
            });

            expect(iterator.next()).toEqual({
                done: false,
                value: select(
                    fromFields.getGraphFieldParamsByName,
                    'fieldName',
                ),
            });

            expect(iterator.next({ paramsKey: 'paramsValue' })).toEqual({
                done: false,
                value: call(getQueryString, {
                    params: {
                        filterKey: 'filterValue',
                        paramsKey: 'paramsValue',
                        uri: 'thisIsAnUri',
                    },
                }),
            });

            expect(iterator.next('queryString')).toEqual({
                done: false,
                value: call(
                    loadFormatData,
                    'fieldName',
                    'https://api.lodex.fr/',
                    'queryString',
                ),
            });

            expect(iterator.next()).toEqual({
                done: true,
                value: undefined,
            });
        });

        it('should put loadFormatDataError if value is not a string', () => {
            const iterator = handleLoadFormatDataRequest({
                payload: {
                    field: { name: 'fieldName' },
                    filter: { filterKey: 'filterValue' },
                    value: ['an', 'incorrect', 'value'],
                    withUri: false,
                },
            });

            expect(iterator.next()).toEqual({
                done: false,
                value: put(
                    loadFormatDataError({
                        name: 'fieldName',
                        error: 'bad value',
                    }),
                ),
            });

            expect(iterator.next()).toEqual({
                done: true,
                value: undefined,
            });
        });

        it('should do nothing if field has no name', () => {
            const iterator = handleLoadFormatDataRequest({
                payload: {
                    field: {},
                    filter: { filterKey: 'filterValue' },
                    value: 'url',
                    withUri: false,
                },
            });

            expect(iterator.next()).toEqual({
                done: true,
                value: undefined,
            });
        });

        it('should do nothing if receiving no field', () => {
            const iterator = handleLoadFormatDataRequest({
                payload: {
                    field: null,
                    filter: { filterKey: 'filterValue' },
                    value: 'url',
                    withUri: false,
                },
            });

            expect(iterator.next()).toEqual({
                done: true,
                value: undefined,
            });
        });
    });

    describe('splitPrecomputedNameAndRoutine', () => {
        it('should return routine and precomputeName for correct local precompted url', () => {
            const it = splitPrecomputedNameAndRoutine(
                '/api/run/routine?precomputedName=name',
            );

            expect(it.routine).toEqual('/api/run/routine');
            expect(it.precomputedName).toEqual('name');
        });

        it('should return routine and precomputeName for correct distant precompted url', () => {
            const it = splitPrecomputedNameAndRoutine(
                'https://someserver/routine?precomputedName=name',
            );

            expect(it.routine).toEqual('https://someserver/routine');
            expect(it.precomputedName).toEqual('name');
        });

        it('should return routine and precomputeName for correct local routine url', () => {
            const it = splitPrecomputedNameAndRoutine('/api/run/routine');

            expect(it.routine).toEqual('/api/run/routine');
            expect(it.precomputedName).toBeNull();
        });

        it('should return routine and precomputeName for correct distant routine url', () => {
            const it = splitPrecomputedNameAndRoutine(
                'https://someserver/routine',
            );

            expect(it.routine).toEqual('https://someserver/routine');
            expect(it.precomputedName).toBeNull();
        });

        it('should return raw text for incorrect url', () => {
            const it = splitPrecomputedNameAndRoutine('something');

            expect(it.routine).toEqual('/something/');
            expect(it.precomputedName).toBeNull();
        });

        it('should return null for empty url', () => {
            const it = splitPrecomputedNameAndRoutine('');

            expect(it.routine).toBeNull();
            expect(it.precomputedName).toBeNull();
        });

        it('should return null for missing url', () => {
            const it = splitPrecomputedNameAndRoutine();

            expect(it.routine).toBeNull();
            expect(it.precomputedName).toBeNull();
        });

        it('should return null for not a string url', () => {
            const it = splitPrecomputedNameAndRoutine(['an', 'array']);

            expect(it.routine).toBeNull();
            expect(it.precomputedName).toBeNull();
        });
    });
});
