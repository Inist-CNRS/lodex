import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    addCharacteristicError,
    addCharacteristicSuccess,
    getNewCharacteristicFormData,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

import { handleAddCharacteristic } from './addCharacteristic';

describe('characteristic saga', () => {
    describe('handleAddCharacteristic', () => {
        const saga = handleAddCharacteristic();

        it('should select getNewCharacteristicFormData', () => {
            expect(saga.next().value).toEqual(
                select(getNewCharacteristicFormData),
            );
        });

        it('should select getAddCharacteristicsRequest', () => {
            expect(saga.next('form data').value).toEqual(
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

        it('should put addCharacteristicError action with error if any', () => {
            const failedSaga = handleAddCharacteristic();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(
                failedSaga.next({ error: { message: 'foo' } }).value,
            ).toEqual(put(addCharacteristicError('foo')));
        });
    });
});
