import { call, select, put } from 'redux-saga/effects';

import { handleConfigureField } from './configureField';
import { getFieldOntologyFormData } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import {
    configureFieldSuccess,
    configureFieldError,
    preLoadPublication,
} from '../';
import validateField from './validateField';

describe('fields saga', () => {
    describe('configureField', () => {
        const saga = handleConfigureField();

        it('should select getFieldOntologyFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldOntologyFormData));
        });

        it('should call validateFields with form data', () => {
            expect(saga.next('form data').value).toEqual(
                call(validateField, 'form data'),
            );
        });

        it('should select fromUser.getUpdateFieldRequest with form data if field is Valid', () => {
            expect(saga.next(true).value).toEqual(
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

        it('should stop if validateField return false', () => {
            const invalidSaga = handleConfigureField();
            expect(invalidSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(invalidSaga.next('form data').value).toEqual(
                call(validateField, 'form data'),
            );
            expect(invalidSaga.next(false).done).toBe(true);
        });

        it('should put configureFieldError with fetchSaga error and end', () => {
            const failedSaga = handleConfigureField();
            expect(failedSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(failedSaga.next('form data').value).toEqual(
                call(validateField, 'form data'),
            );
            expect(failedSaga.next(true).value).toEqual(
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
