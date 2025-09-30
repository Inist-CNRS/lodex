import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
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
    it('should return json from the dataset', (done: any) => {
        const stream = from(dataTest).pipe(ezs('convertToJson', { fields }));
        testOne(
            stream,
            (data: any) => {
                expect(data).toEqual(expectedJson);
            },
            done,
        );
    });
});
