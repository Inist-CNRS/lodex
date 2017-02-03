import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    getLastField,
    getCreateFieldRequest,
    addFieldError,
    addFieldSuccess,
} from '../';

import {
    handleAddField,
} from './addField';

describe('fields saga', () => {
    describe('handleAddField', () => {
        const saga = handleAddField();

        it('should select getLastField', () => {
            expect(saga.next().value).toEqual(select(getLastField));
        });

        it('should select getCreateFieldRequest', () => {
            expect(saga.next('last field').value).toEqual(select(getCreateFieldRequest, 'last field'));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put addFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(addFieldSuccess('foo')));
        });

        it('should put addFieldError action with error if any', () => {
            const failedSaga = handleAddField();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next('request');
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(addFieldError('foo')));
        });
    });
});
