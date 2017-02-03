import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    getFieldFormData,
    getCreateFieldRequest,
    addFieldError,
    addFieldSuccess,
} from '../';

import prepareTransformers from './prepareTransformers';

import {
    handleAddField,
} from './addField';

describe('fields saga', () => {
    describe('handleAddField', () => {
        const saga = handleAddField();

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should call prepareTransformers with thefield data', () => {
            expect(saga.next({
                transformers: 'transformers',
            }).value).toEqual(call(prepareTransformers, 'transformers'));
        });

        it('should select getCreateFieldRequest', () => {
            expect(saga.next('new transformers').value).toEqual(select(getCreateFieldRequest, {
                transformers: 'new transformers',
            }));
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
            failedSaga.next({
                transformers: 'transformers',
            });
            failedSaga.next('new transformers');
            failedSaga.next('request');
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(addFieldError('foo')));
        });
    });
});
