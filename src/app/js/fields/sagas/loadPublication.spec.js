import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    loadPublication,
    loadPublicationError,
    loadPublicationSuccess,
} from '../';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

import { handleLoadPublicationRequest } from './loadPublication';

describe('publication saga', () => {
    describe('handleLoadPublicationRequest', () => {
        it('should select getNbFields', () => {
            const saga = handleLoadPublicationRequest();
            expect(saga.next().value).toEqual(select(fromFields.getNbFields));
        });

        it('should end if nbFields is more than 0', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            expect(saga.next(10).done).toBe(true);
        });

        it('should put loadPublication', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            expect(saga.next(0).value).toEqual(put(loadPublication()));
        });

        it('should select getLoadPublicationRequest', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            saga.next(0);
            expect(saga.next().value).toEqual(
                select(fromUser.getLoadPublicationRequest),
            );
        });

        it('should call fetchPublication with the request', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            saga.next(0);
            saga.next();
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put loadPublicationSuccess action', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            saga.next(0);
            saga.next();
            saga.next('request');
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(loadPublicationSuccess('foo')),
            );
        });

        it('should put loadPublicationError action with error if any', () => {
            const saga = handleLoadPublicationRequest();
            saga.next();
            saga.next(0);
            saga.next();
            saga.next();
            expect(saga.next({ error: 'foo' }).value).toEqual(
                put(loadPublicationError('foo')),
            );
        });
    });
});
