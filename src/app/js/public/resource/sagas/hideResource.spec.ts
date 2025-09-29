import { call, put, select } from 'redux-saga/effects';

import {
    getHideResourceFormData,
    hideResourceSuccess,
    hideResourceError,
} from '../';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';
import { handleHideResource } from './hideResource';

describe('handleHideResource', () => {
    // @ts-expect-error TS7034
    let saga;

    beforeEach(() => {
        saga = handleHideResource({ payload: 'uri' });
    });

    it('should select getHideResourceFormData', () => {
        // @ts-expect-error TS7005
        const next = saga.next();
        expect(next.value).toEqual(select(getHideResourceFormData));
    });

    it('should select getHideResourceRequest with resource', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        const next = saga.next({ reason: 'reason' });
        expect(next.value).toEqual(
            // @ts-expect-error TS2339
            select(fromUser.getHideResourceRequest, {
                uri: 'uri',
                reason: 'reason',
            }),
        );
    });

    it('should call fetchSaga with returned request', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ reason: 'reason' });
        // @ts-expect-error TS7005
        const next = saga.next('request');
        expect(next.value).toEqual(call(fetchSaga, 'request'));
    });

    it('should put HideResourceError if fetchSaga returned an error', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ reason: 'reason' });
        // @ts-expect-error TS7005
        saga.next('request');
        // @ts-expect-error TS7005
        const next = saga.next({ error: 'error' });
        expect(next.value).toEqual(put(hideResourceError('error')));
    });

    it('should put HideResourceSuccess and push to resource page', () => {
        // @ts-expect-error TS7005
        saga.next();
        // @ts-expect-error TS7005
        saga.next({ reason: 'reason' });
        // @ts-expect-error TS7005
        saga.next('request');
        // @ts-expect-error TS7005
        const next = saga.next({ response: 'response' });
        expect(next.value).toEqual(put(hideResourceSuccess('response')));
    });
});
