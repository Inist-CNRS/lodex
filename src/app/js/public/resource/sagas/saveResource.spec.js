import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    getResourceFormData,
    saveResourceSuccess,
    saveResourceError,
} from '../';
import fetchSaga from '../../../lib/fetchSaga';
import { getSaveResourceRequest } from '../../../fetch';
import { handleSaveResource } from './saveResource';

describe('resource saga', () => {
    describe('handleSaveResource', () => {
        let saga;
        const resource = {
            resource: 'resource',
            uri: 'uri',
        };

        beforeEach(() => {
            saga = handleSaveResource();
        });

        it('should select getResourceFormData', () => {
            const next = saga.next();
            expect(next.value).toEqual(select(getResourceFormData));
        });

        it('should select getSaveResourceRequest with resource', () => {
            saga.next();
            const next = saga.next(resource);
            expect(next.value).toEqual(select(getSaveResourceRequest, resource));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            saga.next(resource);
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next(resource);
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should put saveResourceSuccess and push to resource page', () => {
            saga.next();
            saga.next(resource);
            saga.next('request');
            let next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(saveResourceSuccess('response')));
            next = saga.next();
            expect(next.value).toEqual(put(push({ pathname: '/resource', query: { uri: resource.uri } })));
        });
    });
});
