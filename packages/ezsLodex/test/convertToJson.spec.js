import from from 'from';
import ezs from '@ezs/core';
import statements from '../src';
import testOne from './testOne';

const dataTest = [
    {
        uri: 'http://data.istex.fr',
        Q98n: 'Terminator',
        JDGh: 'Description',
    },
];
const expectedJson = {
    uri: 'http://data.istex.fr',
    fields: [
        {
            name: 'Q98n',
            value: 'Terminator',
            label: 'title',
            language: 'fr',
        },
        {
            name: 'JDGh',
            value: 'Description',
            label: 'Abstract',
            language: undefined,
        },
    ],
};

const fields = [
    {
        label: 'title',
        name: 'Q98n',
        language: 'fr',
    },
    {
        label: 'Abstract',
        name: 'JDGh',
    },
];

ezs.use(statements);
describe('conversion to json', () => {
    it('should return json from the dataset', (done) => {
        const stream = from(dataTest).pipe(ezs('convertToJson', { fields }));
        testOne(
            stream,
            (data) => {
                expect(data).toEqual(expectedJson);
            },
            done,
        );
    });
});
