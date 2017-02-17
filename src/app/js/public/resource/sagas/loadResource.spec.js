import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { loadPublication } from '../../';
import fetchSaga from '../../../lib/fetchSaga';
import { getLoadResourceRequest } from '../../../fetch';
import { handleLoadResource, parsePathName } from './loadResource';

describe('resource saga', () => {
    describe('handleLoadResource', () => {
        const action = {
            payload: {
                pathname: 'pathname',
                query: {
                    uri: 'uri',
                },
            },
        };
        let saga;

        beforeEach(() => {
            saga = handleLoadResource(action);
        });

        it('should call parsePathName', () => {
            expect(saga.next().value).toEqual(call(parsePathName, 'pathname'));
        });

        it('should end if parsePathName return name different of /resource', () => {
            saga.next();
            const next = saga.next([null, '/different']);
            expect(next.done).toBe(true);
        });

        it('should put loadResource', () => {
            saga.next();
            const next = saga.next([null, '/resource', true, 'ark']);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with ark if returned by parsePathName', () => {
            saga.next();
            saga.next([null, '/resource', true, 'ark']);
            const next = saga.next();
            expect(next.value).toEqual(select(getLoadResourceRequest, 'ark'));
        });

        it('should select getLoadResourceRequest with payload.query.uri if ark not returned by parsePathName', () => {
            saga.next();
            saga.next([null, '/resource', false]);
            const next = saga.next();
            expect(next.value).toEqual(select(getLoadResourceRequest, 'uri'));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            saga.next([null, '/resource', false]);
            saga.next();
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next([null, '/resource', false]);
            saga.next();
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess and loadPublication if fetchSaga succeeded', () => {
            saga.next();
            saga.next([null, '/resource', false]);
            saga.next();
            saga.next('request');
            let next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
            next = saga.next();
            expect(next.value).toEqual(put(loadPublication()));
        });
    });
});
