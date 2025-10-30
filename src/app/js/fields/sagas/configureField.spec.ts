import { call, select, put } from 'redux-saga/effects';

import { handleConfigureField } from './configureField';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
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
                // @ts-expect-error TS2345
                expect(saga.next(formData).value).toEqual(
                    select(fromFields.getFields),
                );
            });

            it('should call validateFields with form data', () => {
                // @ts-expect-error TS2345
                expect(saga.next([field]).value).toEqual(
                    call(validateField, formData),
                );
            });

            it('should select fromUser.getUpdateFieldRequest with form data if field is Valid', () => {
                // @ts-expect-error TS2345
                expect(saga.next(true).value).toEqual(
                    select(fromUser.getUpdateFieldRequest, formData),
                );
            });

            it('should call fetchSaga with request', () => {
                // @ts-expect-error TS2345
                expect(saga.next('request').value).toEqual(
                    call(fetchSaga, 'request'),
                );
            });

            it('should put configureFieldSuccess with response', () => {
                // @ts-expect-error TS2345
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
            // @ts-expect-error TS2345
            expect(invalidSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );
            // @ts-expect-error TS2345
            expect(invalidSaga.next([field]).value).toEqual(
                call(validateField, formData),
            );
            // @ts-expect-error TS2345
            expect(invalidSaga.next(false).done).toBe(true);
        });

        it('should put configureFieldError with fetchSaga error and end', () => {
            const failedSaga = handleConfigureField();
            expect(failedSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            // @ts-expect-error TS2345
            expect(failedSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );
            // @ts-expect-error TS2345
            expect(failedSaga.next([field]).value).toEqual(
                call(validateField, formData),
            );
            // @ts-expect-error TS2345
            expect(failedSaga.next(true).value).toEqual(
                select(fromUser.getUpdateFieldRequest, formData),
            );
            // @ts-expect-error TS2345
            expect(failedSaga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            // @ts-expect-error TS2345
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
            // @ts-expect-error TS2345
            expect(overviewSaga.next(formData).value).toEqual(
                select(fromFields.getFields),
            );

            // @ts-expect-error TS2345
            expect(overviewSaga.next([overviewField]).value).toEqual(
                call(validateField, formData),
            );
            // @ts-expect-error TS2345
            expect(overviewSaga.next(true).value).toEqual(
                select(fromUser.getUpdateFieldRequest, formData),
            );
            // @ts-expect-error TS2345
            expect(overviewSaga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            // @ts-expect-error TS2345
            expect(overviewSaga.next({ response: 'response' }).value).toEqual(
                put(configureFieldSuccess({ field: 'response' })),
            );
            expect(overviewSaga.next().value).toEqual(put(loadPublication()));
            expect(overviewSaga.next().done).toBe(true);
        });
    });
});
