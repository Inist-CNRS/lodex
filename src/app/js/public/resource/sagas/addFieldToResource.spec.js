import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    addFieldToResourceSuccess,
    addFieldToResourceError,
    getNewResourceFieldFormData,
} from '../';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';
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

    it('should put addFieldToResourceError if formData has no field', () => {
        const error = new Error('You need to select a field or create a new one');
        saga.next();
        const next = saga.next({});
        expect(next.value).toEqual(put(addFieldToResourceError(error)));
    });

    it('should select getAddFieldToResourceRequest with resource', () => {
        saga.next();
        const next = saga.next({ field: 'field data' });
        expect(next.value).toEqual(select(fromUser.getAddFieldToResourceRequest, {
            uri: 'uri',
            field: 'field data',
        }));
    });

    it('should call fetchSaga with returned request', () => {
        saga.next();
        saga.next({ field: 'field data' });
        const next = saga.next('request');
        expect(next.value).toEqual(call(fetchSaga, 'request'));
    });

    it('should put addFieldToResourceError if fetchSaga returned an error', () => {
        saga.next();
        saga.next({ field: 'field data' });
        saga.next('request');
        const next = saga.next({ error: 'error' });
        expect(next.value).toEqual(put(addFieldToResourceError('error')));
    });

    it('should put addFieldToResourceSuccess and push to resource page', () => {
        saga.next();
        saga.next({ field: 'field data' });
        saga.next('request');
        const next = saga.next({ response: 'response' });
        expect(next.value).toEqual(put(addFieldToResourceSuccess('response')));
    });
});
