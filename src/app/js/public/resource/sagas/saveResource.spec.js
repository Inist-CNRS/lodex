import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    saveResourceSuccess,
    saveResourceError,
} from '../';
import fetchSaga from '../../../lib/fetchSaga';
import { getSaveResourceRequest, getSaveFieldRequest } from '../../../fetch';
import { handleSaveResource } from './saveResource';
import { fromResource } from '../../selectors';

describe('resource saga', () => {
    describe('handleSaveResource with resource change and without position change', () => {
        let saga;
        const resource = {
            resource: 'resource',
            uri: 'uri',
            position: 10,
            field: { field1: 'field1', position: 10 },
        };

        beforeEach(() => {
            saga = handleSaveResource({ payload: resource });
        });

        it('should select fromResource.getResourceLastVersion', () => {
            const next = saga.next();
            expect(next.value).toEqual(select(fromResource.getResourceLastVersion));
        });

        it('should select getSaveResourceRequest with resource', () => {
            saga.next();
            const next = saga.next('old');
            expect(next.value).toEqual(select(getSaveResourceRequest, {
                resource: 'resource',
                uri: 'uri',
            }));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            saga.next('old');
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next('old');
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should put saveResourceSuccess and push to resource page', () => {
            saga.next();
            saga.next('old');
            saga.next('request');
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(saveResourceSuccess('response')));
        });
    });

    describe('handleSaveResource with resource and position change', () => {
        let saga;
        const resource = {
            resource: 'resource',
            uri: 'uri',
            position: 5,
            field: { field1: 'field1', position: 10 },
        };

        beforeEach(() => {
            saga = handleSaveResource({ payload: resource });
        });

        it('should select getSaveFieldRequest with resource', () => {
            const next = saga.next();
            expect(next.value).toEqual(select(getSaveFieldRequest, { field1: 'field1', position: 5 }));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            const next = saga.next('request_position');
            expect(next.value).toEqual(call(fetchSaga, 'request_position'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next();
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should select fromResource.getResourceLastVersion', () => {
            saga.next();
            saga.next();
            const next = saga.next({});
            expect(next.value).toEqual(select(fromResource.getResourceLastVersion));
        });

        it('should select getSaveResourceRequest with resource', () => {
            saga.next();
            saga.next();
            saga.next({});
            const next = saga.next('old');
            expect(next.value).toEqual(select(getSaveResourceRequest, {
                resource: 'resource',
                uri: 'uri',
            }));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            saga.next();
            saga.next({});
            saga.next('old');
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next();
            saga.next({});
            saga.next('old');
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should put saveResourceSuccess and push to resource page', () => {
            saga.next();
            saga.next();
            saga.next({});
            saga.next('old');
            saga.next('request');
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(saveResourceSuccess('response')));
        });
    });

    describe('handleSaveResource position change and no resource change', () => {
        let saga;
        const resource = {
            resource: 'resource',
            uri: 'uri',
            position: 5,
            field: { field1: 'field1', position: 10 },
        };

        beforeEach(() => {
            saga = handleSaveResource({ payload: resource });
        });

        it('should select getSaveFieldRequest with resource', () => {
            const next = saga.next();
            expect(next.value).toEqual(select(getSaveFieldRequest, { field1: 'field1', position: 5 }));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            const next = saga.next('request_position');
            expect(next.value).toEqual(call(fetchSaga, 'request_position'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next();
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should select fromResource.getResourceLastVersion', () => {
            saga.next();
            saga.next();
            const next = saga.next({});
            expect(next.value).toEqual(select(fromResource.getResourceLastVersion));
        });

        it('should put saveResourceSuccess', () => {
            saga.next();
            saga.next();
            saga.next({});
            const next = saga.next({
                resource: 'resource',
                uri: 'uri',
            });
            expect(next.value).toEqual(put(saveResourceSuccess()));
        });
    });
});
