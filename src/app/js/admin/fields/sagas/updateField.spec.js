import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    getFieldFormData,
    getUpdateFieldRequest,
    updateField,
    updateFieldError,
    updateFieldSuccess,
} from '../';

import prepareTransformers from './prepareTransformers';

import {
    handleUpdateField,
} from './updateField';

describe('fields saga', () => {
    describe('handleUpdateField', () => {
        it('should exit if meta.form is not `field`', () => {
            const sagaNotField = handleUpdateField({ meta: { form: 'not_field' } });
            expect(sagaNotField.next().done).toEqual(true);
        });

        const saga = handleUpdateField({ meta: { form: 'field' } });

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should call prepareTransformers', () => {
            expect(saga.next({
                transformers: 'transformers',
            }).value).toEqual(call(prepareTransformers, 'transformers'));
        });

        it('should select getUpdateFieldRequest', () => {
            expect(saga.next('updated_transformers').value).toEqual(select(getUpdateFieldRequest, {
                transformers: 'updated_transformers',
            }));
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put updateFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(put(updateFieldSuccess('foo')));
        });

        it('should put updateField action', () => {
            expect(saga.next().value).toEqual(put(updateField({
                transformers: 'updated_transformers',
            })));
        });

        it('should put updateFieldError action with error if any', () => {
            const failedSaga = handleUpdateField({ meta: { form: 'field' } });
            failedSaga.next();
            failedSaga.next({});
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(updateFieldError('foo')));
        });
    });
});
