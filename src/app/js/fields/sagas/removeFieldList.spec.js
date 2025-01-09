import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import { loadField, removeFieldListError, removeFieldListSuccess } from '../';
import { fromFields, fromUser } from '../../sharedSelectors';
import { handleRemoveFieldList } from './removeFieldList';

describe('fields saga', () => {
    describe('handleRemoveFieldList', () => {
        it('should delete fields', () => {
            const fields = [
                { name: 'a_field_name' },
                { name: 'another_field_name' },
            ];
            const saga = handleRemoveFieldList({
                payload: {
                    fields,
                },
            });

            expect(saga.next().value).toEqual(
                select(fromFields.getFieldByName, fields[0].name),
            );

            expect(saga.next('field').value).toEqual(
                select(fromUser.getRemoveFieldRequest, 'field'),
            );

            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );

            expect(saga.next({ response: 'bar ' }).value).toEqual(
                select(fromFields.getFieldByName, fields[1].name),
            );

            expect(saga.next('field').value).toEqual(
                select(fromUser.getRemoveFieldRequest, 'field'),
            );

            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );

            expect(saga.next({ response: 'bar ' }).value).toEqual(
                put(removeFieldListSuccess(fields)),
            );

            expect(saga.next().value).toEqual(put(loadField()));
        });

        it('should put removeFieldError action with error if any', () => {
            const fields = [
                { name: 'a_field_name' },
                { name: 'another_field_name' },
            ];
            const failedSaga = handleRemoveFieldList({
                payload: { fields },
            });
            failedSaga.next();
            failedSaga.next('field');
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(removeFieldListError('foo')),
            );
            expect(failedSaga.next().value).toEqual(put(loadField()));
        });
    });
});
