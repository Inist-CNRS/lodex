import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import { removeFieldError, removeFieldSuccess } from '../';
import { handleRemoveField } from './removeField';
import { fromFields, fromUser } from '../../sharedSelectors';

describe('fields saga', () => {
    describe('handleRemoveField', () => {
        const saga = handleRemoveField({
            payload: {
                field: { name: 'a_field_name', subresourceId: 'id' },
                filter: 'foo',
            },
        });

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

        it('should put push action', () => {
            expect(saga.next({ response: 'bar' }).value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/foo'],
                        method: 'push',
                    },
                }),
            );
        });

        it('should put removeFieldSuccess action', () => {
            expect(saga.next().value).toEqual(put(removeFieldSuccess('field')));
        });

        it('should put removeFieldError action with error if any', () => {
            const failedSaga = handleRemoveField({
                payload: {
                    field: { name: 'a_field_name', subresourceId: 'id' },
                    filter: 'foo',
                },
            });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next({ error: 'foo' });
            expect(failedSaga.next().value).toEqual(
                put(removeFieldError('foo')),
            );
        });
    });
});
