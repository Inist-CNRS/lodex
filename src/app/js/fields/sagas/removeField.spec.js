import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import { removeFieldError, removeFieldSuccess } from '../';
import { handleRemoveField } from './removeField';
import { fromFields, fromUser } from '../../sharedSelectors';

describe('fields saga', () => {
    describe('handleRemoveField', () => {
        const saga = handleRemoveField({ payload: 'a_field_name' });

        it('should select fromFields.getFieldByName', () => {
            expect(saga.next().value).toEqual(
                select(fromFields.getFieldByName, 'a_field_name'),
            );
        });

        it('should select getRemoveFieldRequest', () => {
            expect(saga.next('field').value).toEqual(
                select(fromUser.getRemoveFieldRequest, 'field'),
            );
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put removeFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(removeFieldSuccess('field')),
            );
        });

        it('should put removeFieldError action with error if any', () => {
            const failedSaga = handleRemoveField({ payload: 'a_field_name' });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(removeFieldError('foo')),
            );
        });
    });
});
