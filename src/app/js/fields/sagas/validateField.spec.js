import expect from 'expect';

import validateFieldSaga from './validateField';
import { select, call, put } from 'redux-saga/effects';
import { fromFields } from '../../sharedSelectors';
import { fieldInvalid } from '../index';
import { validateField } from '../../../../common/validateFields';

describe('fields saga', () => {
    describe('validateField', () => {
        it('should selectAllFields and validate formData ending if it is valid', () => {
            const saga = validateFieldSaga('form data');

            expect(saga.next().value).toEqual(select(fromFields.getFields));
            expect(saga.next('fields').value).toEqual(
                call(validateField, 'form data', false, 'fields'),
            );
            expect(saga.next({ isValid: true }).done).toBe(true);
        });

        it('should put fieldInvalid if field is invalid', () => {
            const saga = validateFieldSaga('form data');

            expect(saga.next().value).toEqual(select(fromFields.getFields));
            expect(saga.next('fields').value).toEqual(
                call(validateField, 'form data', false, 'fields'),
            );
            expect(
                saga.next({
                    isValid: false,
                    properties: [
                        { isValid: false, name: 'field1', error: 'invalid' },
                        { isValid: true, name: 'field2' },
                        { isValid: false, name: 'field3', error: 'required' },
                    ],
                }).value,
            ).toEqual(
                put(
                    fieldInvalid({
                        invalidProperties: [
                            {
                                isValid: false,
                                name: 'field1',
                                error: 'invalid',
                            },
                            {
                                isValid: false,
                                name: 'field3',
                                error: 'required',
                            },
                        ],
                    }),
                ),
            );
        });
    });
});
