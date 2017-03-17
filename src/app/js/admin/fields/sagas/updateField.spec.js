import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    getFieldFormData,
    updateFieldError,
    updateFieldSuccess,
} from '../';
import { getUpdateFieldRequest } from '../../../fetch';

import {
    handleUpdateField,
} from './updateField';

describe('fields saga', () => {
    describe('handleUpdateField', () => {
        const saga = handleUpdateField({ meta: { form: 'field' } });

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should select getUpdateFieldRequest', () => {
            expect(saga.next('field form data').value).toEqual(select(getUpdateFieldRequest, 'field form data'));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put updateFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(updateFieldSuccess('foo')));
        });

        it('should put updateFieldError action with error if any', () => {
            const failedSaga = handleUpdateField({ meta: { form: 'field' } });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(updateFieldError('foo')));
        });
    });
});
