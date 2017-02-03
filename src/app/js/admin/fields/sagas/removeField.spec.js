import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    getFieldFormData,
    getRemoveFieldRequest,
    removeFieldError,
    removeFieldSuccess,
} from '../';


import {
    handleRemoveField,
} from './removeField';

describe('fields saga', () => {
    describe('handleRemoveField', () => {
        const saga = handleRemoveField();

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should select getRemoveFieldRequest', () => {
            expect(saga.next('fieldData').value).toEqual(select(getRemoveFieldRequest, 'fieldData'));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put removeFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(removeFieldSuccess('foo')));
        });

        it('should put removeFieldError action with error if any', () => {
            const failedSaga = handleRemoveField();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(removeFieldError('foo')));
        });
    });
});
