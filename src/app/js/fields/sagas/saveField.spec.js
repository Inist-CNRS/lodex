import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import { saveFieldError, loadField, saveFieldSuccess } from '../';

import { getFieldFormData } from '../selectors';
import { fromUser } from '../../sharedSelectors';

import { handleSaveField, sanitizeField } from './saveField';

describe('fields saga', () => {
    describe('handleSaveField', () => {
        const saga = handleSaveField({ meta: { form: 'field' } });

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(select(getFieldFormData));
        });

        it('should call sanitizeField with field form data', () => {
            expect(saga.next('field form data').value).toEqual(
                call(sanitizeField, 'field form data'),
            );
        });

        it('should select getSaveFieldRequest', () => {
            expect(saga.next('sanitized field form data').value).toEqual(
                select(
                    fromUser.getSaveFieldRequest,
                    'sanitized field form data',
                ),
            );
        });

        it('should call fetchSaga with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put saveFieldSuccess action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(saveFieldSuccess()),
            );
        });

        it('should put loadField action', () => {
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(loadField()),
            );
        });

        it('should put saveFieldError action with error if any', () => {
            const failedSaga = handleSaveField({ meta: { form: 'field' } });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(saveFieldError('foo')),
            );
        });
    });
});
