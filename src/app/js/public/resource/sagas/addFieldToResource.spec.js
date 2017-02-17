import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    addFieldToResourceSuccess,
    addFieldToResourceError,
    getNewResourceFieldFormData,
} from '../';
import fetchSaga from '../../../lib/fetchSaga';
import { getAddFieldToResourceRequest } from '../../../fetch';
import { handleAddFieldToResource } from './addFieldToResource';

describe('handleAddFieldToResource', () => {
    let saga;

    beforeEach(() => {
        saga = handleAddFieldToResource({ payload: 'uri' });
    });

    it('should select getNewResourceFieldFormData', () => {
        const next = saga.next();
        expect(next.value).toEqual(select(getNewResourceFieldFormData));
    });

    it('should select getAddFieldToResourceRequest with resource', () => {
        saga.next();
        const next = saga.next({ reason: 'reason' });
        expect(next.value).toEqual(select(getAddFieldToResourceRequest, {
            uri: 'uri',
            reason: 'reason',
        }));
    });

    it('should call fetchSaga with returned request', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        const next = saga.next('request');
        expect(next.value).toEqual(call(fetchSaga, 'request'));
    });

    it('should put addFieldToResourceError if fetchSaga returned an error', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        saga.next('request');
        const next = saga.next({ error: 'error' });
        expect(next.value).toEqual(put(addFieldToResourceError('error')));
    });

    it('should put addFieldToResourceSuccess and push to resource page', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        saga.next('request');
        let next = saga.next({ response: 'response' });
        expect(next.value).toEqual(put(addFieldToResourceSuccess('response')));
        next = saga.next();
        expect(next.value).toEqual(put(push({ pathname: '/resource', query: { uri: 'uri' } })));
    });
});
