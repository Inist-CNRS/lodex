import expect from 'expect';
import { call, select, put } from 'redux-saga/effects';

import { handleConfigureField } from './configureField';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import {
    configureFieldSuccess,
    configureFieldError,
    preLoadPublication,
    fieldInvalid,
} from '../';
import { validateField } from '../../../../common/validateFields';

describe('fields saga', () => {
    describe('configureField', () => {
        const saga = handleConfigureField();

        it('should select getFieldOntologyFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldOntologyFormData));
        });

        it('should select getFields', () => {
            expect(saga.next('form data').value).toEqual(
                select(fromFields.getFields),
            );
        });

        it('should call validateFields with form data and fields', () => {
            expect(saga.next('fields').value).toEqual(
                call(validateField, 'form data', false, 'fields'),
            );
        });

        it('should select fromUser.getUpdateFieldRequest with form data if field is Valid', () => {
            expect(saga.next({ isValid: true }).value).toEqual(
                select(fromUser.getUpdateFieldRequest, 'form data'),
            );
        });

        it('should call fetchSaga with request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put configureFieldSuccess with response', () => {
            expect(saga.next({ response: 'response' }).value).toEqual(
                put(configureFieldSuccess({ field: 'response' })),
            );
        });

        it('should put preLoadPublication', () => {
            expect(saga.next().value).toEqual(put(preLoadPublication()));
        });

        it('should put fieldInvalid with validateField properties', () => {
            const invalidSaga = handleConfigureField();
            expect(invalidSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(invalidSaga.next('form data').value).toEqual(
                select(fromFields.getFields),
            );
            expect(invalidSaga.next('fields').value).toEqual(
                call(validateField, 'form data', false, 'fields'),
            );
            expect(
                invalidSaga.next({
                    isValid: false,
                    properties: [
                        { isValid: false, name: 'field1', error: 'error' },
                        { isValid: true, name: 'field2' },
                        { isValid: false, name: 'field3', error: 'error 2' },
                    ],
                }).value,
            ).toEqual(
                put(
                    fieldInvalid({
                        invalidProperties: [
                            { isValid: false, name: 'field1', error: 'error' },
                            {
                                isValid: false,
                                name: 'field3',
                                error: 'error 2',
                            },
                        ],
                    }),
                ),
            );
            expect(invalidSaga.next().done).toBe(true);
        });

        it('should put configureFieldError with fetchSaga error and end', () => {
            const failedSaga = handleConfigureField();
            expect(failedSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(failedSaga.next('form data').value).toEqual(
                select(fromFields.getFields),
            );
            expect(failedSaga.next('fields').value).toEqual(
                call(validateField, 'form data', false, 'fields'),
            );
            expect(failedSaga.next({ isValid: true }).value).toEqual(
                select(fromUser.getUpdateFieldRequest, 'form data'),
            );
            expect(failedSaga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            expect(failedSaga.next({ error: 'error' }).value).toEqual(
                put(configureFieldError('error')),
            );
            expect(failedSaga.next().done).toBe(true);
        });
    });
});
