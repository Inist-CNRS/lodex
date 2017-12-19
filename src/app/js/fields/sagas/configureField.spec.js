import expect from 'expect';
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

describe('fields saga', () => {
    describe('configureField', () => {
        const saga = handleConfigureField();

        it('should select getFieldOntologyFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldOntologyFormData));
        });

        it('should select fromUser.getUpdateFieldRequest with form data', () => {
            expect(saga.next('form data').value).toEqual(
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

        it('should put configureFieldError with fetchSaga error and end', () => {
            const failedSaga = handleConfigureField();
            expect(failedSaga.next().value).toEqual(
                select(getFieldOntologyFormData),
            );
            expect(failedSaga.next('form data').value).toEqual(
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
