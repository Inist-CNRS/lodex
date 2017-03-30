import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { loadPublication } from '../../publication';
import fetchSaga from '../../../lib/fetchSaga';
import { getLoadResourceRequest } from '../../../fetch';
import { handleLoadResource, parsePathName } from './loadResource';

describe('resource saga', () => {
    describe('handleLoadResource', () => {
        it('should end if pathname is not /resource', () => {
            const saga = handleLoadResource({
                payload: {
                    pathname: '/different',
                },
            });
            saga.next();
            const next = saga.next([null, '/different']);
            expect(next.done).toBe(true);
        });

        describe('with /resource pathname', () => {
            const action = {
                payload: {
                    pathname: '/resource',
                    query: {
                        uri: 'uri',
                    },
                },
            };

            let saga;

            it('should call parsePathName', () => {
                saga = handleLoadResource(action);
                expect(saga.next().value).toEqual(call(parsePathName, '/resource'));
            });

            it('should put loadResource', () => {
                saga = handleLoadResource(action);
                saga.next();
                const next = saga.next([null, '/resource', true, 'ark']);
                expect(next.value).toEqual(put(loadResource()));
            });

            it('should select getLoadResourceRequest with ark if returned by parsePathName', () => {
                saga = handleLoadResource(action);
                saga.next();
                saga.next([null, true, 'ark']);
                const next = saga.next();
                expect(next.value).toEqual(select(getLoadResourceRequest, 'ark'));
            });

            it('should select getLoadResourceRequest with uri returned from state', () => {
                saga = handleLoadResource({
                    payload: {
                        pathname: '/resource',
                        state: {
                            uri: 'uri',
                        },
                    },
                });
                saga.next();
                saga.next([]);
                const next = saga.next();
                expect(next.value).toEqual(select(getLoadResourceRequest, 'uri'));
            });

            it('should select getLoadResourceRequest with payload.query.uri if ark not returned by parsePathName', () => {
                saga = handleLoadResource(action);
                saga.next();
                saga.next([null, false]);
                const next = saga.next();
                expect(next.value).toEqual(select(getLoadResourceRequest, 'uri'));
            });

            it('should call fetchSaga with returned request', () => {
                saga = handleLoadResource(action);
                saga.next();
                saga.next([null, false]);
                saga.next();
                const next = saga.next('request');
                expect(next.value).toEqual(call(fetchSaga, 'request'));
            });

            it('should put loadResourceError if fetchSaga returned an error', () => {
                saga = handleLoadResource(action);
                saga.next();
                saga.next([null, false]);
                saga.next();
                saga.next('request');
                const next = saga.next({ error: 'error' });
                expect(next.value).toEqual(put(loadResourceError('error')));
            });

            it('should put loadResourceSuccess and loadPublication if fetchSaga succeeded', () => {
                saga = handleLoadResource(action);
                saga.next();
                saga.next([null, false]);
                saga.next();
                saga.next('request');
                let next = saga.next({ response: 'response' });
                expect(next.value).toEqual(put(loadResourceSuccess('response')));
                next = saga.next();
                expect(next.value).toEqual(put(loadPublication()));
            });
        });
    });
});
