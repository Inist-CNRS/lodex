import { call, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'redux-first-history';

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
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should select getUri from router', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            expect(saga.next().value).toEqual(
                select(fromRouter.getResourceUri),
            );
        });

        it('should end if receiving no uri', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            const next = saga.next();
            expect(next.done).toBe(true);
        });

        it('should select isResourceLoaded', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            const next = saga.next('uri');
            expect(next.value).toEqual(
                select(fromResource.isResourceLoaded, 'uri'),
            );
        });

        it('should end if resource is loaded', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            const next = saga.next(true);
            expect(next.done).toBe(true);
        });

        it('should put loadResource if resource is not loaded', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            const next = saga.next(false);
            expect(next.value).toEqual(put(loadResource()));
        });

        it('should select getLoadResourceRequest with uri returned from getUri', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            saga.next(false);
            const next = saga.next();
            expect(next.value).toEqual(
                select(fromUser.getLoadResourceRequest, 'uri'),
            );
        });

        it('should call fetchSaga with returned request', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            saga.next(false);
            saga.next();
            // @ts-expect-error TS2345
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadResourceError if fetchSaga returned an error', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            saga.next(false);
            saga.next();
            // @ts-expect-error TS2345
            saga.next('request');
            // @ts-expect-error TS2345
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(loadResourceError('error')));
        });

        it('should put loadResourceSuccess if fetchSaga succeeded', () => {
            // @ts-expect-error TS2554
            const saga = handleLoadResource(action);
            saga.next();
            saga.next();
            // @ts-expect-error TS2345
            saga.next('uri');
            // @ts-expect-error TS2345
            saga.next(false);
            saga.next();
            // @ts-expect-error TS2345
            saga.next('request');
            // @ts-expect-error TS2345
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(loadResourceSuccess('response')));
        });
    });
});
