import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
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
            saga = handleSaveResource({ payload: resource });
        });

        it('should select getSaveResourceRequest with resource', () => {
            const next = saga.next();
            expect(next.value).toEqual(select(getSaveResourceRequest, resource));
        });

        it('should call fetchSaga with returned request', () => {
            saga.next();
            const next = saga.next('request');
            expect(next.value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put saveResourceError if fetchSaga returned an error', () => {
            saga.next();
            saga.next('request');
            const next = saga.next({ error: 'error' });
            expect(next.value).toEqual(put(saveResourceError('error')));
        });

        it('should put saveResourceSuccess and push to resource page', () => {
            saga.next();
            saga.next('request');
            const next = saga.next({ response: 'response' });
            expect(next.value).toEqual(put(saveResourceSuccess('response')));
        });
    });
});
