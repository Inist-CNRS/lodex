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

            expect(result.length).toEqual(4);

            expect(result[0]).toEqual('my-title');
            expect(result[1]).toEqual('my-description');
            expect(result[2]).toEqual('my-first-detail');
            expect(result[3]).toEqual('my-second-detail');
        });

        it('should remove empty fieldNames', () => {
            const fieldNames = {
                title: 'my-title',
                description: null,
                detail1: undefined,
                detail2: 'my-second-detail',
            };

            const result = getSortableFieldNames(fieldNames);

            expect(result.length).toEqual(2);

            expect(result[0]).toEqual('my-title');
            expect(result[1]).toEqual('my-second-detail');
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

            expect(result.length).toEqual(4);

            expect(result[0].name).toEqual('my-title');
            expect(result[0].label).toEqual('Title');

            expect(result[1].name).toEqual('my-description');
            expect(result[1].label).toEqual('Description');

            expect(result[2].name).toEqual('my-first-detail');
            expect(result[2].label).toEqual('First Detail');

            expect(result[3].name).toEqual('my-second-detail');
            expect(result[3].label).toEqual('Second Detail');
        });
    });
});
