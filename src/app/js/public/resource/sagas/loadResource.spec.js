import { call, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { loadResource, loadResourceSuccess, loadResourceError } from '../';
import { preLoadPublication } from '../../../fields';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';
import { fromResource, fromRouter } from '../../selectors';
import { handleLoadResource } from './loadResource';

describe('resource saga', () => {
    describe('handleLoadResource', () => {
        const action = {
            type: LOCATION_CHANGE,
            payload: {
                location: {
                    pathname: '/ark:/naan/publisher-id',
                    query: {
                        uri: 'uri',
                    },
                },
            },
        };

        it('should put preLoadPublication', () => {
            const saga = handleLoadResource(action);
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should select getUri from router', () => {
            const saga = handleLoadResource(action);
            saga.next();
            expect(saga.next().value).toEqual(
                select(fromRouter.getResourceUri),
            );
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
            expect(next.value).toEqual(
                select(fromResource.isResourceLoaded, 'uri'),
            );
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
            expect(next.value).toEqual(
                select(fromUser.getLoadResourceRequest, 'uri'),
            );
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
});
