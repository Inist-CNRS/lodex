import { getSortableFieldNames, getSortableFields } from './SearchResultSort';

describe('<SearchResultSort />', () => {
    describe('getSortableFieldNames', () => {
        it('should build an array like [title, description, detail1, detail2]', () => {
            const fieldNames = {
                title: 'my-title',
                detail1: 'my-first-detail',
                fakeField1: 'my-first-fake-field',
                description: 'my-description',
                detail2: 'my-second-detail',
                fakeField2: 'my-second-fake-field',
            };

            const result = getSortableFieldNames(fieldNames);

            expect(result).toHaveLength(4);

            expect(result[0]).toBe('my-title');
            expect(result[1]).toBe('my-description');
            expect(result[2]).toBe('my-first-detail');
            expect(result[3]).toBe('my-second-detail');
        });

        it('should remove empty fieldNames', () => {
            const fieldNames = {
                title: 'my-title',
                description: null,
                detail1: undefined,
                detail2: 'my-second-detail',
            };

            const result = getSortableFieldNames(fieldNames);

            expect(result).toHaveLength(2);

            expect(result[0]).toBe('my-title');
            expect(result[1]).toBe('my-second-detail');
        });
    });

    describe('getSortableFields', () => {
        it('should build an array of fields like [title, description, detail1, detail2]', () => {
            const sortedFieldNames = [
                'my-title',
                'my-description',
                'my-first-detail',
                'my-second-detail',
            ];

            const fields = [
                { name: 'my-title', label: 'Title' },
                { name: 'my-first-detail', label: 'First Detail' },
                { name: 'my-first-fake-field', label: 'First Fake Field' },
                { name: 'my-second-detail', label: 'Second Detail' },
                { name: 'my-description', label: 'Description' },
                { name: 'my-second-fake-field', label: 'Second Fake Field' },
            ];
            const result = getSortableFields(fields, sortedFieldNames);

            expect(result).toHaveLength(4);

            expect(result[0].name).toBe('my-title');
            expect(result[0].label).toBe('Title');

            expect(result[1].name).toBe('my-description');
            expect(result[1].label).toBe('Description');

            expect(result[2].name).toBe('my-first-detail');
            expect(result[2].label).toBe('First Detail');

            expect(result[3].name).toBe('my-second-detail');
            expect(result[3].label).toBe('Second Detail');
        });
    });
});
