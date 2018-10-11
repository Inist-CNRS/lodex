import { call, select, put } from 'redux-saga/effects';

import { handleConfigureField } from './configureField';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import {
    configureFieldSuccess,
    configureFieldError,
    preLoadPublication,
    loadPublication,
} from '../';
import validateField from './validateField';

describe('fields saga', () => {
    describe('configureField', () => {
        const field = {
            name: 'abcd',
            label: 'Old Label',
        };
        const formData = {
            name: 'abcd',
            label: 'Changed Label',
        };

        describe('optimal scenario', () => {
            const saga = handleConfigureField();

            it('should select getFieldOntologyFormData', () => {
                expect(saga.next().value).toEqual(
                    select(getFieldOntologyFormData),
                );
            });

            it('should select fromFields.getFields', () => {
                expect(saga.next(formData).value).toEqual(
                    select(fromFields.getFields),
                );
            });

            it('should call validateFields with form data', () => {
                expect(saga.next([field]).value).toEqual(
                    call(validateField, formData),
                );
            });

            it('should select fromUser.getUpdateFieldRequest with form data if field is Valid', () => {
                expect(saga.next(true).value).toEqual(
                    select(fromUser.getUpdateFieldRequest, formData),
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
        });

        it('should stop if validateField return false', () => {
            const invalidSaga = handleConfigureField();
            expect(invalidSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(invalidSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );
            expect(invalidSaga.next([field]).value).toEqual(
                call(validateField, formData),
            );
            expect(invalidSaga.next(false).done).toBe(true);
        });

        it('should put configureFieldError with fetchSaga error and end', () => {
            const failedSaga = handleConfigureField();
            expect(failedSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(failedSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );
            expect(failedSaga.next([field]).value).toEqual(
                call(validateField, formData),
            );
            expect(failedSaga.next(true).value).toEqual(
                select(fromUser.getUpdateFieldRequest, formData),
            );
            expect(failedSaga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            expect(failedSaga.next({ error: 'error' }).value).toEqual(
                put(configureFieldError('error')),
            );
            expect(failedSaga.next().done).toBe(true);
        });

        it('should call loadPublication instead of preload if overview changed', () => {
            const overviewSaga = handleConfigureField();
            const overviewField = {
                ...field,
                overview: 1,
            };

            expect(overviewSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(overviewSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );

            expect(overviewSaga.next([overviewField]).value).toEqual(
                call(validateField, formData),
            );
            expect(overviewSaga.next(true).value).toEqual(
                select(fromUser.getUpdateFieldRequest, formData),
            );
            expect(overviewSaga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            expect(overviewSaga.next({ response: 'response' }).value).toEqual(
                put(configureFieldSuccess({ field: 'response' })),
            );
            expect(overviewSaga.next().value).toEqual(put(loadPublication()));
            expect(overviewSaga.next().done).toBe(true);
        });
    });
});
