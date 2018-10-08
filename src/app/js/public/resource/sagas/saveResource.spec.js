import { call, put, select } from 'redux-saga/effects';

import { saveResourceSuccess, saveResourceError } from '../';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';
import { handleSaveResource } from './saveResource';
import { fromResource } from '../../selectors';

describe('resource saga', () => {
    let saga;
    const resource = { field: 'value' };
    const field = { name: 'field' };

    beforeEach(() => {
        saga = handleSaveResource({ payload: { resource, field } });
    });

    it('should select fromResource.getResourceLastVersion', () => {
        const next = saga.next();
        expect(next.value).toEqual(select(fromResource.getResourceLastVersion));
    });

    it('should select getSaveResourceRequest with resource and field', () => {
        saga.next();
        const next = saga.next({ field: 'oldValue', uri: 'uri' });
        expect(next.value).toEqual(
            select(fromUser.getSaveResourceRequest, {
                resource: { field: 'value' },
                field: { name: 'field' },
            }),
        );
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
        const next = saga.next({ response: { value: 'response' } });
        expect(next.value).toEqual(put(saveResourceSuccess('response')));
    });
});
