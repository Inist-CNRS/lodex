import { call, put, select } from 'redux-saga/effects';

import { updateCharacteristicsError, updateCharacteristicsSuccess } from '../';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

import { handleUpdateCharacteristics } from './updateCharacteristic';
import { configureFieldSuccess } from '../../fields/index';

describe('characteristic saga', () => {
    describe('handleUpdateCharacteristics', () => {
        const payload = { characteristics: 'characteristics', name: 'name' };

        const saga = handleUpdateCharacteristics({ payload });

        it('should select getUpdateCharacteristicsRequest', () => {
            expect(saga.next().value).toEqual(
                select(fromUser.getUpdateCharacteristicsRequest, payload),
            );
        });

        it('should call fetchPublication with the request', () => {
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put updateCharacteristicsError action with error if any', () => {
            const failedSaga = handleUpdateCharacteristics({ payload });
            failedSaga.next();
            failedSaga.next({});
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(updateCharacteristicsError('foo')),
            );
        });

        it('should put updateCharacteristicsSuccess action with field and characteristics', () => {
            expect(
                saga.next({
                    response: {
                        characteristics: 'characteristics',
                        field: 'field',
                    },
                }).value,
            ).toEqual(
                put(
                    updateCharacteristicsSuccess({
                        characteristics: 'characteristics',
                        field: 'field',
                    }),
                ),
            );
        });

        it('should put configureFieldSuccess action with field', () => {
            expect(saga.next().value).toEqual(
                put(
                    configureFieldSuccess({
                        field: 'field',
                    }),
                ),
            );
        });

        it('should put updateCharacteristicSuccess with characteristics and field: { name: payload.name } btu not put configureFieldSuccess', () => {
            const noFieldSaga = handleUpdateCharacteristics({ payload });
            noFieldSaga.next();
            noFieldSaga.next();
            expect(
                noFieldSaga.next({
                    response: { characteristics: 'characteristics' },
                }).value,
            ).toEqual(
                put(
                    updateCharacteristicsSuccess({
                        field: {
                            name: 'name',
                        },
                        characteristics: 'characteristics',
                    }),
                ),
            );

            expect(noFieldSaga.next().done).toBe(true);
        });
    });
});
