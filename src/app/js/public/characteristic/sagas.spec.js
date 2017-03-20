import expect from 'expect';
import { call, put, select } from 'redux-saga/effects';

import {
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from './';
import { getUpdateCharacteristicsRequest } from '../../fetch/';
import fetchSaga from '../../lib/fetchSaga';

import { handleUpdateCharacteristics } from './sagas';

describe('characteristic saga', () => {
    describe('handleUpdateCharacteristics', () => {
        const payload = 'characteristics';

        const saga = handleUpdateCharacteristics({ payload });

        it('should select getUpdateCharacteristicsRequest', () => {
            expect(saga.next().value).toEqual(select(getUpdateCharacteristicsRequest, payload));
        });

        it('should call fetchPublication with the request', () => {
            expect(saga.next('request').value).toEqual(call(fetchSaga, 'request'));
        });

        it('should put loadPublicationSuccess action', () => {
            expect(saga.next({ response: [
                'value1',
                'value2',
            ] }).value).toEqual(put(updateCharacteristicsSuccess([
                'value1',
                'value2',
            ])));
        });

        it('should put loadPublicationError action with error if any', () => {
            const failedSaga = handleUpdateCharacteristics({ payload });
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value)
                .toEqual(put(updateCharacteristicsError('foo')));
        });
    });
});
