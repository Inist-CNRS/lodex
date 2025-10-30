import { call, put, select } from 'redux-saga/effects';

import {
    addFieldToResourceSuccess,
    addFieldToResourceError,
    getNewResourceFieldFormData,
} from '../index';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import { handleAddFieldToResource } from './addFieldToResource';

describe('handleAddFieldToResource', () => {
    // @ts-expect-error TS7034
    let saga;

    beforeEach(() => {
        saga = handleAddFieldToResource({ payload: 'uri' });
    });

    it('should select getNewResourceFieldFormData', () => {
        // @ts-expect-error TS7005
        const next = saga.next();
        expect(next.value).toEqual(select(getNewResourceFieldFormData));
    });

    it('should put addFieldToResourceError if formData has no field', () => {
        const error = new Error(
            'You need to select a field or create a new one',
        );
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        const next = saga.next({});
        expect(next.value).toEqual(put(addFieldToResourceError(error)));
    });

    it('should select getAddFieldToResourceRequest with resource', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        const next = saga.next({ field: 'field data' });
        expect(next.value).toEqual(
            select(fromUser.getAddFieldToResourceRequest, {
                uri: 'uri',
                field: 'field data',
            }),
        );
    });

    it('should call fetchSaga with returned request', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ field: 'field data' });
        // @ts-expect-error TS7005
        const next = saga.next('request');
        expect(next.value).toEqual(call(fetchSaga, 'request'));
    });

    it('should put addFieldToResourceError if fetchSaga returned an error', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ field: 'field data' });
        // @ts-expect-error TS7005
        saga.next('request');
        // @ts-expect-error TS7005
        const next = saga.next({ error: 'error' });
        expect(next.value).toEqual(put(addFieldToResourceError('error')));
    });

    it('should put addFieldToResourceSuccess and push to resource page', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ field: 'field data' });
        // @ts-expect-error TS7005
        saga.next('request');
        // @ts-expect-error TS7005
        const next = saga.next({ response: 'response' });
        expect(next.value).toEqual(put(addFieldToResourceSuccess('response')));
    });
});
