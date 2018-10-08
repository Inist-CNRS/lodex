import { call, put, select, all } from 'redux-saga/effects';

import {
    handleFilterFormatDataRequest,
    loadFormatDataForName,
    loadFormatData,
} from './sagas';
import { loadFormatDataSuccess, loadFormatDataError } from './reducer';
import getQueryString from '../lib/getQueryString';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromDataset, fromFacet, fromFormat } from '../public/selectors';
import { fromFields, fromUser, fromCharacteristic } from '../sharedSelectors';
import { COVER_DATASET } from '../../../common/cover';

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
            expect(it.next({ cover: COVER_DATASET })).toEqual({
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
                value: select(fromFacet.getAppliedFacets),
                done: false,
            });
            expect(it.next('facets')).toEqual({
                value: select(fromFacet.getInvertedFacets),
                done: false,
            });
            expect(it.next('invertedFacets')).toEqual({
                value: select(fromDataset.getFilter),
                done: false,
            });
            expect(it.next('filter')).toEqual({
                value: call(getQueryString, {
                    facets: 'facets',
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
                value: call(loadFormatData, 'name', 'url', 'queryString'),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });

        it('should not call loadFormatData if field cover is not dataset', () => {
            const it = loadFormatDataForName('name', { filter: 'data' });
            expect(it.next()).toEqual({
                value: select(fromFields.getFieldByName, 'name'),
                done: false,
            });
            expect(it.next({ cover: 'not dataset' })).toEqual({
                value: undefined,
                done: true,
            });
        });
    });

    describe('loadFormatData', () => {
        it('should call loadFormatDataSuccess with name and response', () => {
            const it = loadFormatData('name', 'url', 'queryString');
            expect(it.next()).toEqual({
                value: select(fromUser.getUrlRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
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
                value: select(fromUser.getUrlRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
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
                value: select(fromUser.getUrlRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ response: { total: 0 } })).toEqual({
                value: put(loadFormatDataSuccess({ name: 'name', data: [] })),
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
                value: select(fromUser.getUrlRequest, {
                    url: 'url',
                    queryString: 'queryString',
                }),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ error: 'failed to fetch' })).toEqual({
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

        it('should call loadFormatDataSuccess with url and the body of the request', () => {
            const it = loadFormatData(
                'name',
                'https://data.istex.fr/sparql/?query=select * where {?s ?c ?d }',
                'queryString',
            );
            expect(it.next()).toEqual({
                value: select(fromUser.getSparqlRequest, {
                    url: 'https://data.istex.fr/sparql/',
                    body: 'query=select * where {?s ?c ?d }',
                }),
                done: false,
            });
            expect(it.next('request')).toEqual({
                value: call(fetchSaga, 'request'),
                done: false,
            });
            expect(it.next({ response: { total: 0 } })).toEqual({
                value: put(loadFormatDataSuccess({ name: 'name', data: [] })),
                done: false,
            });
            expect(it.next()).toEqual({
                value: undefined,
                done: true,
            });
        });
    });
});
