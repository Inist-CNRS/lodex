import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../../lib/fetchSaga';

import {
    addFieldError,
    addFieldSuccess,
} from '../';
import { fromFields } from '../../selectors';

import { getCreateFieldRequest } from '../../../fetch/';
import { handleAddField } from './addField';

describe('fields saga', () => {
    describe('handleAddField', () => {
        describe('handleAddField without a field name', () => {
            const saga = handleAddField({});

            it('should select getNbFields', () => {
                expect(saga.next().value).toEqual(select(fromFields.getNbFields));
            });

            it('should select getCreateFieldRequest', () => {
                expect(saga.next(42).value).toEqual(select(getCreateFieldRequest, {
                    cover: 'collection',
                    display_in_list: true,
                    display_in_resouce: true,
                    searchable: true,
                    label: 'newField 43',
                    name: 'newField43',
                    transformers: [],
                }));
            });

            it('should call fetchSaga with the request', () => {
                expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
            });

            it('should put addFieldSuccess action', () => {
                expect(saga.next({ response: 'foo' }).value).toEqual(put(addFieldSuccess('foo')));
            });
        });

        describe('handleAddField with a field name', () => {
            const saga = handleAddField({ payload: 'foo' });

            it('should select getNbFields', () => {
                expect(saga.next().value).toEqual(select(fromFields.getNbFields));
            });

            it('should select getCreateFieldRequest', () => {
                expect(saga.next(42).value).toEqual(select(getCreateFieldRequest, {
                    cover: 'collection',
                    label: 'foo',
                    name: 'foo',
                    display_in_list: true,
                    display_in_resouce: true,
                    searchable: true,
                    transformers: [{
                        operation: 'COLUMN',
                        args: [{
                            name: 'column',
                            type: 'column',
                            value: 'foo',
                        }],
                    }],
                }));
            });

            it('should call fetchSaga with the request', () => {
                expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
            });

            it('should put addFieldSuccess action', () => {
                expect(saga.next({ response: 'foo' }).value).toEqual(put(addFieldSuccess('foo')));
            });
        });

        it('should put addFieldError action with error if any', () => {
            const failedSaga = handleAddField({});
            failedSaga.next();
            failedSaga.next();
            failedSaga.next('request');
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(addFieldError('foo')));
        });
    });
});
