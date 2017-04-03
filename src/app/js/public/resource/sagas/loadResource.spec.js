import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

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
        const action = {
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/ark:/naan/publisher-id',
                query: {
                    uri: 'uri',
                },
            },
        };

        it('should call parsePathName', () => {
            const saga = handleLoadResource(action);
            expect(saga.next().value).toEqual(call(parsePathName, '/ark:/naan/publisher-id'));
        });

        it('should put loadResource', () => {
            const saga = handleLoadResource(action);
            saga.next();
            const next = saga.next([null, '/ark:/naan/publisher-id']);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with ark if returned by parsePathName', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next([null, 'ark']);
            const next = saga.next();
            expect(next.value).toEqual(select(getLoadResourceRequest, 'ark'));
        });

        it('should select getLoadResourceRequest with uri returned from state', () => {
            const saga = handleLoadResource({
                type: LOCATION_CHANGE,
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

        it('should call fetchSaga with returned request', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next([null, 'ark']);
            saga.next();
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next([null, 'ark']);
            saga.next();
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess and loadPublication if fetchSaga succeeded', () => {
            const saga = handleLoadResource(action);
            saga.next();
            saga.next([null, 'ark']);
            saga.next();
            saga.next('request');
            let next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
            next = saga.next();
            expect(next.value).toEqual(put(loadPublication()));
        });
    });
});
