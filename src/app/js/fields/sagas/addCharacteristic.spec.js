import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import { addCharacteristicError, addCharacteristicSuccess } from '../';

import { getNewCharacteristicFormData } from '../selectors';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

import { handleAddCharacteristic } from './addCharacteristic';
import validateField from './validateField';

describe('characteristic saga', () => {
    describe('handleAddCharacteristic', () => {
        const saga = handleAddCharacteristic();

        it('should select getNewCharacteristicFormData', () => {
            expect(saga.next().value).toEqual(
                select(getNewCharacteristicFormData),
            );
        });

        it('should call validateField', () => {
            expect(saga.next('form data').value).toEqual(
                call(validateField, 'form data'),
            );
        });

        it('should select getAddCharacteristicsRequest if field is valid', () => {
            expect(saga.next(true).value).toEqual(
                select(fromUser.getAddCharacteristicRequest, 'form data'),
            );
        });

        it('should call fetchPublication with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put addCharacteristicSuccess action', () => {
            expect(
                saga.next({
                    response: ['value1', 'value2'],
                }).value,
            ).toEqual(put(addCharacteristicSuccess(['value1', 'value2'])));
        });

        it('should stop if form data is not valid', () => {
            const invalidSaga = handleAddCharacteristic();
            invalidSaga.next();
            invalidSaga.next();
            expect(invalidSaga.next(false).done).toBe(true);
        });

        it('should put addCharacteristicError action with error if any', () => {
            const failedSaga = handleAddCharacteristic();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next(true);
            failedSaga.next();
            expect(
                failedSaga.next({ error: { message: 'foo' } }).value,
            ).toEqual(put(addCharacteristicError('foo')));
        });
    });
});
