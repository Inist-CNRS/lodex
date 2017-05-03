import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    restoreRessourceError,
    restoreRessourceSuccess,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import { handleRestoreResourceRequest } from './restoreResource';
import fetchSaga from '../../../lib/sagas/fetchSaga';

describe('restore removed resources saga', () => {
    describe('handleRestoreResourceRequest', () => {
        const saga = handleRestoreResourceRequest({ payload: 'an_uri' });

        it('should select getRestoreResourceRequest', () => {
            expect(saga.next().value).toEqual(select(fromUser.getRestoreResourceRequest, 'an_uri'));
        });

        it('should call fetchDafetchSagataset with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put restoreRessourceSuccess action', () => {
            expect(saga.next({}).value)
                .toEqual(put(restoreRessourceSuccess('an_uri')));
        });

        it('should put restoreRessourceError action with error if any', () => {
            const failedSaga = handleRestoreResourceRequest({ payload: 'an_uri' });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(restoreRessourceError('foo')));
        });
    });
});
