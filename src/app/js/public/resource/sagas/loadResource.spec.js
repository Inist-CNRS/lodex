import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { preLoadPublication } from '../../../fields';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';
import { fromResource } from '../../selectors';
import { handleLoadResource, getUri, getUriFromPayload } from './loadResource';

describe('resource saga', () => {
    describe('handleLoadResource', () => {
        const action = {
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/ark:/naan/publisher-id',
                query: {
                    uri: 'uri',
                },
            },
        };

        it('should put preLoadPublication', () => {
            const saga = handleLoadResource(action);
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should call getUri', () => {
            const saga = handleLoadResource(action);
            saga.next();
            expect(saga.next().value).toEqual(call(getUri, LOCATION_CHANGE, {
                pathname: '/ark:/naan/publisher-id',
                query: {
                    uri: 'uri',
                },
            }));
        });

        it('should end if receiving no uri', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            const next = saga.next();
            expect(next.done).toBe(true);
        });

        it('should select isResourceLoaded', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            const next = saga.next('uri');
            expect(next.value).toEqual(select(fromResource.isResourceLoaded, 'uri'));
        });

        it('should end if resource is loaded', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            const next = saga.next(true);
            expect(next.done).toBe(true);
        });

        it('should put loadResource if resource is not loaded', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            const next = saga.next(false);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with uri returned from getUri', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            saga.next(false);
            const next = saga.next();
            expect(next.value).toEqual(select(fromUser.getLoadResourceRequest, 'uri'));
        });

        it('should call fetchSaga with returned request', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            saga.next(false);
            saga.next();
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            saga.next(false);
            saga.next();
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess if fetchSaga succeeded', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            saga.next('uri');
            saga.next(false);
            saga.next();
            saga.next('request');
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
        });
    });

    describe('getUri', () => {
        it('should return call getUriFromPayload result if type is LOCATION_CHANGE', () => {
            const saga = getUri(LOCATION_CHANGE, 'payload');
            let next = saga.next();
            expect(next.value).toEqual(call(getUriFromPayload, 'payload'));
            next = saga.next('result');
            expect(next.value).toBe('result');
            expect(next.done).toBe(true);
        });

        it('should select getResourceLastVersion if type is no LOCATION_CHANGE', () => {
            const saga = getUri('not LOCATION_CHANGE', 'payload');
            const next = saga.next();
            expect(next.value).toEqual(select(fromResource.getResourceLastVersion));
        });

        it('should return null if no resource', () => {
            const saga = getUri('not LOCATION_CHANGE', 'payload');
            saga.next();
            const next = saga.next();
            expect(next.done).toBe(true);
            expect(next.value).toBe(null);
        });

        it('should return resource.uri', () => {
            const saga = getUri('not LOCATION_CHANGE', 'payload');
            saga.next();
            const next = saga.next({ uri: 'uri' });
            expect(next.done).toBe(true);
            expect(next.value).toBe('uri');
        });
    });

    describe('getUriFromPayload', () => {
        it('should return payload.pathname if it match ark pattern', () => {
            expect(getUriFromPayload({ pathname: '/ark:/naan/publis-id' })).toEqual('ark:/naan/publis-id');
        });

        it('should return state.uri if pathname does not match ark', () => {
            expect(getUriFromPayload({ pathname: 'not an ark', state: { uri: 'state uri' } })).toEqual('state uri');
        });

        it('should return uri from queryString if no ark and no state uri', () => {
            expect(getUriFromPayload({ pathname: '/resource', search: '?uri=queryStringUri' })).toEqual('queryStringUri');
        });

        it('should return null if none of the above match', () => {
            expect(getUriFromPayload({ pathname: '/resource' })).toEqual(null);
        });
    });
});
