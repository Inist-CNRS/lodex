import { movePosition } from './changePosition';

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
});
