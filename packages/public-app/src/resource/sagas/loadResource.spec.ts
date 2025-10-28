import { call, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'redux-first-history';

import { loadResource, loadResourceSuccess, loadResourceError } from '../index';
import { preLoadPublication } from '../../../../../src/app/js/fields';
import fetchSaga from '../../../../../src/app/js/lib/sagas/fetchSaga';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import { fromResource, fromRouter } from '../../selectors';
import { handleForceLoadResource, handlePreloadResource } from './loadResource';

describe('resource saga', () => {
    describe('handlePreloadResource', () => {
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
            const saga = handlePreloadResource(action);
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should select getUri from router', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            expect(saga.next().value).toEqual(
                select(fromRouter.getResourceUri),
            );
        });

        it('should end if receiving no uri', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            const next = saga.next();
            expect(next.done).toBe(true);
        });

        it('should select isResourceLoaded', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            const next = saga.next('uri');
            expect(next.value).toEqual(
                select(fromResource.isResourceLoaded, 'uri'),
            );
        });

        it('should end if resource is loaded', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            const next = saga.next(true);
            expect(next.done).toBe(true);
        });

        it('should put loadResource if resource is not loaded', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            const next = saga.next(false);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with uri returned from getUri', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            const next = saga.next();
            expect(next.value).toEqual(
                select(fromUser.getLoadResourceRequest, 'uri'),
            );
        });

        it('should call fetchSaga with returned request', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            saga.next('request');
            // @ts-expect-error TS7006
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess if fetchSaga succeeded', () => {
            const saga = handlePreloadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            saga.next('request');
            // @ts-expect-error TS7006
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
        });
    });

    describe('handleForceLoadResource', () => {
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
            const saga = handleForceLoadResource(action);
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should select getUri from router', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            expect(saga.next().value).toEqual(
                select(fromRouter.getResourceUri),
            );
        });

        it('should end if receiving no uri', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            const next = saga.next();
            expect(next.done).toBe(true);
        });

        it('should put loadResource if resource is not loaded', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            const next = saga.next(false);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with uri returned from getUri', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            const next = saga.next();
            expect(next.value).toEqual(
                select(fromUser.getLoadResourceRequest, 'uri'),
            );
        });

        it('should call fetchSaga with returned request', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            saga.next('request');
            // @ts-expect-error TS7006
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess if fetchSaga succeeded', () => {
            const saga = handleForceLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS7006
            saga.next('uri');
            // @ts-expect-error TS7006
            saga.next(false);
            saga.next();
            // @ts-expect-error TS7006
            saga.next('request');
            // @ts-expect-error TS7006
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
        });
    });
});
