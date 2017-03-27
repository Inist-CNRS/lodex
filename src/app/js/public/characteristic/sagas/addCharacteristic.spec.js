import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    addCharacteristicError,
    addCharacteristicSuccess,
} from '../';
import { getAddCharacteristicRequest } from '../../../fetch/';
import fetchSaga from '../../../lib/fetchSaga';

import { handleAddCharacteristic } from './addCharacteristic';

describe('characteristic saga', () => {
    describe('handleAddCharacteristic', () => {
        const payload = 'characteristics';

        const saga = handleAddCharacteristic({ payload });

        it('should select getaddCharacteristicsRequest', () => {
            expect(saga.next().value).toEqual(select(getAddCharacteristicRequest, payload));
        });

        it('should call fetchPublication with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadPublicationSuccess action', () => {
            expect(saga.next({ response: [
                'value1',
                'value2',
            ] }).value).toEqual(put(addCharacteristicSuccess([
                'value1',
                'value2',
            ])));
        });

        it('should put loadPublicationError action with error if any', () => {
            const failedSaga = handleAddCharacteristic({ payload });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(addCharacteristicError('foo')));
        });
    });
});
