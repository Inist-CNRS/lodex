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
    let saga;

    beforeEach(() => {
        saga = handleHideResource({ payload: 'uri' });
    });

    it('should select getHideResourceFormData', () => {
        const next = saga.next();
        expect(next.value).toEqual(select(getHideResourceFormData));
    });

    it('should select getHideResourceRequest with resource', () => {
        saga.next();
        const next = saga.next({ reason: 'reason' });
        expect(next.value).toEqual(
            select(fromUser.getHideResourceRequest, {
                uri: 'uri',
                reason: 'reason',
            }),
        );
    });

    it('should call fetchSaga with returned request', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        const next = saga.next('request');
        expect(next.value).toEqual(call(fetchSaga, 'request'));
    });

    it('should put HideResourceError if fetchSaga returned an error', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        saga.next('request');
        const next = saga.next({ error: 'error' });
        expect(next.value).toEqual(put(hideResourceError('error')));
    });

    it('should put HideResourceSuccess and push to resource page', () => {
        saga.next();
        saga.next({ reason: 'reason' });
        saga.next('request');
        const next = saga.next({ response: 'response' });
        expect(next.value).toEqual(put(hideResourceSuccess('response')));
    });
});
