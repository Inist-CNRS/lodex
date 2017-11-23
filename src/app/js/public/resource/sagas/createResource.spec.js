import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { handleCreateResource } from './createResource';
import {
    createResourceSuccess,
    createResourceError,
    getNewResourceFormData,
} from '../';

import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

describe('createResource saga', () => {
    it('should post new resource and put createResourceSuccess on success', () => {
        const saga = handleCreateResource({ payload: 'uri' });
        expect(saga.next().value).toEqual(select(getNewResourceFormData));
        expect(saga.next('new resource').value).toEqual(
            select(fromUser.getCreateResourceRequest, 'new resource'),
        );
        expect(saga.next('create resource request').value).toEqual(
            call(fetchSaga, 'create resource request'),
        );
        expect(saga.next({ response: { uri: 'response uri' } }).value).toEqual(
            put(createResourceSuccess()),
        );
        expect(saga.next({ response: { uri: 'response uri' } }).value).toEqual(
            put(push('/response uri')),
        );
    });

    it('should post new resource and put createResourceError on error', () => {
        const saga = handleCreateResource({ payload: 'uri' });
        expect(saga.next().value).toEqual(select(getNewResourceFormData));
        expect(saga.next('new resource').value).toEqual(
            select(fromUser.getCreateResourceRequest, 'new resource'),
        );
        expect(saga.next('create resource request').value).toEqual(
            call(fetchSaga, 'create resource request'),
        );
        expect(saga.next({ error: 'response error' }).value).toEqual(
            put(createResourceError('response error')),
        );
    });
});
