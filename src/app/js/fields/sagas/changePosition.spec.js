import expect from 'expect';
import { call, select, put } from 'redux-saga/effects';

import { movePosition, handleChangePosition } from './changePosition';
import { fromFields, fromUser } from '../../sharedSelectors';
import { changePositionValue } from '../';
import fetchSaga from '../../lib/sagas/fetchSaga';

describe('fields saga changePosition', () => {
    describe('movePosition', () => {
        it('should move an item in an array given its old and new position', () => {
            const fields = [
                { name: 'field1', position: 0 },
                { name: 'field2', position: 1 },
                { name: 'field3', position: 2 },
                { name: 'field4', position: 3 },
                { name: 'field5', position: 4 },
            ];

            const result = movePosition(fields, 4, 2);

            expect(result).toEqual([
                { name: 'field1', position: 0 },
                { name: 'field2', position: 1 },
                { name: 'field5', position: 2 },
                { name: 'field3', position: 3 },
                { name: 'field4', position: 4 },
            ]);
        });

        it('should reset position from 0 to fields length', () => {
            const fields = [
                { name: 'field1', position: 0 },
                { name: 'field2', position: 4 },
                { name: 'field3', position: 9 },
                { name: 'field4', position: 10 },
                { name: 'field5', position: 14 },
            ];

            const result = movePosition(fields, 14, 10);

            expect(result).toEqual([
                { name: 'field1', position: 0 },
                { name: 'field2', position: 1 },
                { name: 'field3', position: 2 },
                { name: 'field5', position: 3 },
                { name: 'field4', position: 4 },
            ]);
        });

        it('should allow to move an item to the last position', () => {
            const fields = [
                { name: 'field1', position: 0 },
                { name: 'field2', position: 4 },
                { name: 'field3', position: 9 },
                { name: 'field4', position: 10 },
                { name: 'field5', position: 14 },
            ];

            const result = movePosition(fields, 9, 14);

            expect(result).toEqual([
                { name: 'field1', position: 0 },
                { name: 'field2', position: 1 },
                { name: 'field4', position: 2 },
                { name: 'field5', position: 3 },
                { name: 'field3', position: 4 },
            ]);
        });
    });

    describe('handleChangePosition', () => {
        const fields = [
            { name: 'field1', position: 0 },
            { name: 'field2', position: 5 },
            { name: 'field3', position: 7 },
        ];
        const oldPosition = 5;
        const newPosition = 7;

        const expectedOutput = [
            { name: 'field1', position: 0 },
            { name: 'field3', position: 1 },
            { name: 'field2', position: 2 },
        ];

        it('should reorder the fields positions and send it to the api', () => {
            const it = handleChangePosition({
                payload: { oldPosition, newPosition, type: 'dataset' },
            });

            expect(it.next().value).toEqual(
                select(fromFields.getOntologyFields, 'dataset'),
            );
            expect(it.next(fields).value).toEqual(
                call(movePosition, fields, oldPosition, newPosition),
            );
            expect(it.next(expectedOutput).value).toEqual(
                put(changePositionValue({ fields: expectedOutput })),
            );

            expect(it.next().value).toEqual(
                select(fromUser.getReorderFieldRequest, expectedOutput),
            );

            expect(it.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            expect(it.next({ response: 'response' }).value).toEqual(
                put(changePositionValue({ fields: 'response' })),
            );
            expect(it.next().done).toBe(true);
        });

        it('should rollback if the api update fail', () => {
            const it = handleChangePosition({
                payload: { oldPosition, newPosition, type: 'dataset' },
            });

            expect(it.next().value).toEqual(
                select(fromFields.getOntologyFields, 'dataset'),
            );
            expect(it.next(fields).value).toEqual(
                call(movePosition, fields, oldPosition, newPosition),
            );
            expect(it.next(expectedOutput).value).toEqual(
                put(changePositionValue({ fields: expectedOutput })),
            );

            expect(it.next().value).toEqual(
                select(fromUser.getReorderFieldRequest, expectedOutput),
            );

            expect(it.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
            expect(it.next({ error: 'error' }).value).toEqual(
                put(changePositionValue({ fields })),
            );
            expect(it.next().done).toBe(true);
        });
    });
});
